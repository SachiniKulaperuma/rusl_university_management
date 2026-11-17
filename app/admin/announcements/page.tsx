'use client';

import { FormEvent, useEffect, useState } from 'react';
import { adminFetch } from '../adminFetch';

type AnnouncementStatus = 'Published' | 'Unpublished';

type Announcement = {
  announcement_id: number;
  title: string;
  description: string;
  publication_date: string;
  status: AnnouncementStatus;
  administrator_name?: string;
  administrator_email?: string;
};

const emptyForm = { title: '', description: '', status: 'Published' as AnnouncementStatus };

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-LK', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

export default function AnnouncementManagementPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);

  async function loadAnnouncements() {
    try {
      const response = await adminFetch('http://localhost:5000/api/announcements/admin');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to load announcements.');
      setAnnouncements(data.announcements);
    } catch (error) {
      setMessage({ text: error instanceof Error ? error.message : 'Unable to load announcements.', error: true });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadAnnouncements();
  }, []);

  function startEditing(announcement: Announcement) {
    setEditingId(announcement.announcement_id);
    setForm({ title: announcement.title, description: announcement.description, status: announcement.status });
    setMessage(null);
  }

  function cancelEditing() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const response = await adminFetch(
        editingId ? `http://localhost:5000/api/announcements/${editingId}` : 'http://localhost:5000/api/announcements',
        {
          method: editingId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to save the announcement.');

      setMessage({ text: data.message, error: false });
      cancelEditing();
      await loadAnnouncements();
    } catch (error) {
      setMessage({ text: error instanceof Error ? error.message : 'Unable to save the announcement.', error: true });
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteAnnouncement(id: number) {
    if (!window.confirm('Delete this announcement? This cannot be undone.')) return;
    setMessage(null);

    try {
      const response = await adminFetch(`http://localhost:5000/api/announcements/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to delete the announcement.');
      if (editingId === id) cancelEditing();
      setMessage({ text: data.message, error: false });
      await loadAnnouncements();
    } catch (error) {
      setMessage({ text: error instanceof Error ? error.message : 'Unable to delete the announcement.', error: true });
    }
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-[#1e293b]">Announcement Management</h1>
        <p className="font-medium text-[#64748b]">Publish university updates and control what visitors see on the home page.</p>
      </div>

      {message && (
        <p role="status" className={`mb-6 rounded-lg border px-4 py-3 text-sm font-semibold ${message.error ? 'border-red-200 bg-red-50 text-red-700' : 'border-green-200 bg-green-50 text-green-700'}`}>
          {message.text}
        </p>
      )}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)]">
        <section className="h-fit rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-sm lg:sticky lg:top-24">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-[#1e293b]">
            <i className={`fas ${editingId ? 'fa-pen-to-square' : 'fa-plus-circle'} text-[#7C0A02]`} />
            {editingId ? 'Edit Announcement' : 'Add Announcement'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="announcement-title" className="mb-1 block text-sm font-semibold text-[#334155]">Announcement Title</label>
              <input
                id="announcement-title"
                required
                maxLength={200}
                value={form.title}
                onChange={event => setForm(current => ({ ...current, title: event.target.value }))}
                className="w-full rounded-lg border border-[#cbd5e1] px-4 py-2 text-sm outline-none transition-all focus:border-[#7C0A02] focus:ring-1 focus:ring-[#7C0A02]"
                placeholder="e.g. Semester registration is now open"
              />
            </div>

            <div>
              <label htmlFor="announcement-description" className="mb-1 block text-sm font-semibold text-[#334155]">Announcement Details</label>
              <textarea
                id="announcement-description"
                required
                maxLength={5000}
                rows={8}
                value={form.description}
                onChange={event => setForm(current => ({ ...current, description: event.target.value }))}
                className="w-full resize-y rounded-lg border border-[#cbd5e1] px-4 py-2 text-sm outline-none transition-all focus:border-[#7C0A02] focus:ring-1 focus:ring-[#7C0A02]"
                placeholder="Write the announcement details here..."
              />
            </div>

            <div>
              <label htmlFor="announcement-status" className="mb-1 block text-sm font-semibold text-[#334155]">Visibility</label>
              <select
                id="announcement-status"
                value={form.status}
                onChange={event => setForm(current => ({ ...current, status: event.target.value as AnnouncementStatus }))}
                className="w-full rounded-lg border border-[#cbd5e1] px-4 py-2 text-sm outline-none transition-all focus:border-[#7C0A02] focus:ring-1 focus:ring-[#7C0A02]"
              >
                <option value="Published">Published</option>
                <option value="Unpublished">Unpublished</option>
              </select>
              <p className="mt-1 text-xs text-[#64748b]">The publication date is assigned automatically when this announcement is created.</p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button disabled={submitting} className="rounded-lg bg-[#7C0A02] px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#5a0602] disabled:opacity-70">
                {submitting ? 'Saving...' : editingId ? 'Save Changes' : 'Add Announcement'}
              </button>
              {editingId && <button type="button" onClick={cancelEditing} className="rounded-lg border border-[#cbd5e1] px-5 py-2.5 text-sm font-bold text-[#475569] hover:bg-[#f8fafc]">Cancel</button>}
            </div>
          </form>
        </section>

        <section className="overflow-hidden rounded-xl border border-[#e2e8f0] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#e2e8f0] bg-[#f8fafc] p-5">
            <h2 className="text-lg font-bold text-[#1e293b]">All Announcements ({announcements.length})</h2>
          </div>
          {loading ? (
            <p className="p-8 text-center text-[#64748b]">Loading announcements...</p>
          ) : announcements.length === 0 ? (
            <p className="p-8 text-center text-[#64748b]">No announcements have been added yet.</p>
          ) : (
            <div className="divide-y divide-[#e2e8f0]">
              {announcements.map(announcement => (
                <article key={announcement.announcement_id} className="p-5">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-[#1e293b]">{announcement.title}</h3>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${announcement.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                          {announcement.status}
                        </span>
                      </div>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#475569]">{announcement.description}</p>
                      <p className="mt-3 text-xs font-medium text-[#64748b]">
                        Published {formatDate(announcement.publication_date)}{announcement.administrator_name ? ` by ${announcement.administrator_name}` : ''}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button type="button" onClick={() => startEditing(announcement)} className="rounded-md border border-[#cbd5e1] px-3 py-2 text-sm font-semibold text-[#475569] hover:bg-[#f8fafc]" aria-label={`Edit ${announcement.title}`}>
                        <i className="fas fa-pen" aria-hidden="true" /> <span className="sr-only sm:not-sr-only sm:ml-1">Edit</span>
                      </button>
                      <button type="button" onClick={() => void deleteAnnouncement(announcement.announcement_id)} className="rounded-md border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50" aria-label={`Delete ${announcement.title}`}>
                        <i className="fas fa-trash" aria-hidden="true" /> <span className="sr-only sm:not-sr-only sm:ml-1">Delete</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
