export type RegistrationFormKey = 'identity-card' | 'residentials' | 'sports' | 'skill' | 'medical';

type FormAttachment = {
  field_name: string;
  file_name: string;
  mime_type: string;
  data_base64: string;
};

async function fileToBase64(file: File) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = '';
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  }
  return btoa(binary);
}

export async function saveRegistrationFormDraft(formKey: RegistrationFormKey, formData: Record<string, string>) {
  const response = await fetch('http://localhost:5000/api/auth/new-student/draft', {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ [formKey]: formData, completionStatus: { [formKey]: false } }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || 'Unable to save this form draft.');
}

export async function submitRegistrationForm(
  formKey: RegistrationFormKey,
  form: HTMLFormElement,
  previousFormData: Record<string, string> = {},
) {
  try {
    const values: Record<string, string[]> = {};
    const attachments: FormAttachment[] = [];

    new FormData(form).forEach((value, key) => {
    if (typeof value === 'string') {
      (values[key] ??= []).push(value);
      return;
    }

    if (!value.name || value.size === 0) return;
    if (value.size > 2 * 1024 * 1024) {
      throw new Error('Each uploaded image must be 2 MB or smaller.');
    }
    if (!['image/jpeg', 'image/png'].includes(value.type)) {
      throw new Error('Uploaded images must be JPEG or PNG files.');
    }
    attachments.push({
      field_name: key,
      file_name: value.name,
      mime_type: value.type,
      data_base64: '',
    });
    });

    const fileInputs = Array.from(form.querySelectorAll<HTMLInputElement>('input[type="file"]'));
    for (const attachment of attachments) {
      const file = fileInputs.find((input) => input.name === attachment.field_name)?.files?.[0];
      if (!file) continue;
      attachment.data_base64 = await fileToBase64(file);
    }

    const formData = Object.fromEntries(
      Object.entries(values).map(([key, entries]) => [key, entries.length === 1 ? entries[0] : entries]),
    );
    const response = await fetch('http://localhost:5000/api/auth/new-student/forms', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ form_key: formKey, form_data: { ...previousFormData, ...formData }, attachments }),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(result.error || 'Unable to save the registration form.');
    }

    window.dispatchEvent(new CustomEvent('registration-form-submitted', { detail: { formKey } }));
    return result as { submitted: boolean; form_key: RegistrationFormKey };
  } catch (error) {
    window.dispatchEvent(new CustomEvent('registration-form-submit-failed', { detail: { formKey } }));
    throw error;
  }
}
