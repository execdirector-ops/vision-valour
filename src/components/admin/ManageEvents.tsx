import { useEffect, useState } from 'react';
import { supabase, Event } from '../../lib/supabase';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import ReactQuill from 'react-quill';
import { quillModules, quillFormats } from '../../lib/quillConfig';

export default function ManageEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    location: '',
    registration_url: '',
    event_type: 'other' as 'ride_day' | 'legion_event' | 'luncheon' | 'dinner' | 'social' | 'other',
    day_number: null as number | null,
    is_published: false,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      start_date: '',
      end_date: '',
      location: '',
      registration_url: '',
      event_type: 'other',
      day_number: null,
      is_published: false,
    });
    setEditingId(null);
    setShowNewForm(false);
  };

  const handleEdit = (event: Event) => {
    setEditingId(event.id);

    const formatForDateTimeLocal = (dateString: string) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    setFormData({
      title: event.title,
      description: event.description,
      start_date: formatForDateTimeLocal(event.start_date),
      end_date: event.end_date ? formatForDateTimeLocal(event.end_date) : '',
      location: event.location,
      registration_url: event.registration_url || '',
      event_type: event.event_type || 'other',
      day_number: event.day_number,
      is_published: event.is_published,
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const eventData = {
        ...formData,
        start_date: formData.start_date ? new Date(formData.start_date).toISOString() : null,
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
        registration_url: formData.registration_url || null,
        updated_at: new Date().toISOString(),
      };

      if (editingId) {
        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('events').insert([eventData]);
        if (error) throw error;
      }

      await fetchEvents();
      alert('Event saved successfully!');
      resetForm();
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Error saving event. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
      await fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Manage Events</h2>
          <p className="text-gray-600">Create and manage events for your calendar</p>
        </div>
        <button
          onClick={() => setShowNewForm(true)}
          className="flex items-center gap-2 bg-red-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-800 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Event
        </button>
      </div>

      {(showNewForm || editingId) && (
        <div className="border-2 border-red-900 rounded-xl p-6 bg-red-50">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {editingId ? 'Edit Event' : 'New Event'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Description
              </label>
              <div className="bg-white rounded-lg border-2 border-gray-300">
                <ReactQuill
                  theme="snow"
                  value={formData.description}
                  onChange={(description) => setFormData({ ...formData, description })}
                  modules={quillModules}
                  formats={quillFormats}
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Start Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  End Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Event Type *
                </label>
                <select
                  value={formData.event_type}
                  onChange={(e) => setFormData({ ...formData, event_type: e.target.value as any })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                >
                  <option value="ride_day">Ride Day</option>
                  <option value="legion_event">Legion Event</option>
                  <option value="luncheon">Luncheon</option>
                  <option value="dinner">Dinner</option>
                  <option value="social">Social Event</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Day Number (1-13, optional)
                </label>
                <input
                  type="number"
                  min="1"
                  max="13"
                  value={formData.day_number || ''}
                  onChange={(e) => setFormData({ ...formData, day_number: e.target.value ? parseInt(e.target.value) : null })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                  placeholder="e.g., 1"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                placeholder="Enter location or leave blank to use Google Maps"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Registration URL (Zeffy)
              </label>
              <input
                type="url"
                value={formData.registration_url}
                onChange={(e) => setFormData({ ...formData, registration_url: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                placeholder="https://www.zeffy.com/..."
              />
              <p className="text-xs text-gray-600 mt-1">
                External registration link. If set, "Register Now" will open this URL.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_published"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="w-5 h-5 text-red-900 border-gray-300 rounded focus:ring-red-900"
              />
              <label htmlFor="is_published" className="text-sm font-semibold text-gray-900">
                Publish event (make visible to public)
              </label>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving || !formData.title || !formData.start_date}
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-all disabled:bg-gray-400"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Event'}
              </button>
              <button
                onClick={resetForm}
                className="flex items-center gap-2 bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-all"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="border-2 border-gray-200 rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                  {event.is_published ? (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                      Published
                    </span>
                  ) : (
                    <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                      Draft
                    </span>
                  )}
                </div>
                <div className="text-gray-700 mb-3 content-display" dangerouslySetInnerHTML={{ __html: event.description }} />
                <div className="text-sm text-gray-600 space-y-1">
                  {event.day_number && (
                    <p>
                      <strong>Day:</strong> {event.day_number}
                    </p>
                  )}
                  <p>
                    <strong>Type:</strong> {event.event_type?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Other'}
                  </p>
                  <p>
                    <strong>Start:</strong> {new Date(event.start_date).toLocaleString()}
                  </p>
                  {event.end_date && (
                    <p>
                      <strong>End:</strong> {new Date(event.end_date).toLocaleString()}
                    </p>
                  )}
                  {event.location && (
                    <p>
                      <strong>Location:</strong> {event.location}
                    </p>
                  )}
                  {event.registration_url && (
                    <p>
                      <strong>Registration URL:</strong>{' '}
                      <a
                        href={event.registration_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {event.registration_url}
                      </a>
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleEdit(event)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
