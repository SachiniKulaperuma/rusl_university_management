'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

type DraftValue = string | boolean | number | string[] | null | undefined;

function getFormKey(pathname: string) {
  const cleanPath = pathname.replace(/^\/+|\/+$/g, '');
  const segments = cleanPath.split('/');
  const last = segments[segments.length - 1];
  return last || 'student-personal-info';
}

function formToObject(form: HTMLFormElement): Record<string, DraftValue> {
  const values: Record<string, DraftValue> = {};

  form.querySelectorAll('input, textarea, select').forEach((element) => {
    const field = element as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    if (field instanceof HTMLInputElement && field.type === 'file') return;
    const key = field.id || field.name;

    if (!key) return;

    if (field instanceof HTMLInputElement && (field.type === 'checkbox' || field.type === 'radio')) {
      values[key] = field.checked;
      return;
    }

    if (field instanceof HTMLSelectElement && field.multiple) {
      values[key] = Array.from(field.selectedOptions).map((option) => option.value);
      return;
    }

    values[key] = field.value;
  });

  return values;
}

function applyDraftToForm(form: HTMLFormElement, draft: Record<string, unknown>) {
  form.querySelectorAll('input, textarea, select').forEach((element) => {
    const field = element as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    if (field instanceof HTMLInputElement && field.type === 'file') return;
    const key = field.id || field.name;

    if (!key || !(key in draft)) return;

    const value = draft[key];

    if (field instanceof HTMLInputElement && (field.type === 'checkbox' || field.type === 'radio')) {
      field.checked = Boolean(value);
      field.dispatchEvent(new Event('change', { bubbles: true }));
      return;
    }

    if (field instanceof HTMLSelectElement && field.multiple) {
      const selectedValues = Array.isArray(value) ? value : [];
      Array.from(field.options).forEach((option) => {
        option.selected = selectedValues.includes(option.value);
      });
      field.dispatchEvent(new Event('change', { bubbles: true }));
      return;
    }

    const valueSetter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(field), 'value')?.set;
    valueSetter?.call(field, String(value ?? ''));
    field.dispatchEvent(new Event('input', { bubbles: true }));
  });
}

async function saveCurrentDraft(formKey: string, form: HTMLFormElement, completed = false, keepalive = false) {
  const draft = formToObject(form);

  try {
    const response = await fetch('http://localhost:5000/api/auth/new-student/draft', {
      method: 'PUT',
      credentials: 'include',
      keepalive,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        [formKey]: draft,
        completionStatus: { [formKey]: completed },
      }),
    });

    if (!response.ok) {
      console.warn('Draft save failed:', await response.text());
    }
  } catch (error) {
    console.warn('Draft save could not reach the server:', error);
  }
}

export default function RegistrationDraftGuard() {
  const pathname = usePathname();
  const saveTimerRef = useRef<number | null>(null);
  const isSubmittingRef = useRef(false);
  const isSubmittedRef = useRef(false);

  useEffect(() => {
    const formKey = getFormKey(pathname);
    const currentForm = document.querySelector('form');

    if (!currentForm) return;

    const restoreDraft = async () => {
      try {
        const sessionResponse = await fetch('http://localhost:5000/api/auth/new-student/session', {
          credentials: 'include',
          cache: 'no-store',
        });

        if (!sessionResponse.ok) return;

        const sessionData = await sessionResponse.json();
        const draft = sessionData?.draft?.[formKey] ?? {};

        if (Object.keys(draft).length > 0) {
          applyDraftToForm(currentForm as HTMLFormElement, draft);
        }
      } catch (error) {
        console.warn('Unable to restore draft:', error);
      }
    };

    void restoreDraft();

    const handleInput = () => {
      // A new edit after submission makes this form a draft again.  Until then,
      // do not allow delayed autosaves to overwrite the confirmed submission.
      isSubmittingRef.current = false;
      isSubmittedRef.current = false;
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current);
      }

      saveTimerRef.current = window.setTimeout(() => {
        void saveCurrentDraft(formKey, currentForm as HTMLFormElement, false);
      }, 700);
    };

    const persistOnLeave = () => {
      if (!currentForm || isSubmittingRef.current || isSubmittedRef.current) return;
      void saveCurrentDraft(formKey, currentForm as HTMLFormElement, false, true);
    };

    const handleSubmitStart = () => {
      isSubmittingRef.current = true;
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }
    };

    const handleSubmitted = (event: Event) => {
      const submittedFormKey = (event as CustomEvent<{ formKey?: string }>).detail?.formKey;
      if (submittedFormKey !== formKey) return;
      isSubmittingRef.current = false;
      isSubmittedRef.current = true;
    };

    const handleSubmitFailed = (event: Event) => {
      const submittedFormKey = (event as CustomEvent<{ formKey?: string }>).detail?.formKey;
      if (submittedFormKey !== formKey) return;
      isSubmittingRef.current = false;
    };

    currentForm.addEventListener('input', handleInput);
    currentForm.addEventListener('change', handleInput);
    currentForm.addEventListener('submit', handleSubmitStart, true);
    window.addEventListener('registration-form-submitted', handleSubmitted);
    window.addEventListener('registration-form-submit-failed', handleSubmitFailed);
    window.addEventListener('pagehide', persistOnLeave);
    window.addEventListener('beforeunload', persistOnLeave);

    return () => {
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current);
      }

      persistOnLeave();

      currentForm.removeEventListener('input', handleInput);
      currentForm.removeEventListener('change', handleInput);
      currentForm.removeEventListener('submit', handleSubmitStart, true);
      window.removeEventListener('registration-form-submitted', handleSubmitted);
      window.removeEventListener('registration-form-submit-failed', handleSubmitFailed);
      window.removeEventListener('pagehide', persistOnLeave);
      window.removeEventListener('beforeunload', persistOnLeave);
    };
  }, [pathname]);

  return null;
}
