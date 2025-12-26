import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Save } from 'lucide-react';
import ReactQuill from 'react-quill';
import { quillModules, quillFormats } from '../../lib/quillConfig';

interface EventPageData {
  id: string;
  title: string;
  content: string;
  key_dates: string;
  updated_at: string;
}

export default function ManageEventPage() {
  const [eventData, setEventData] = useState<EventPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    key_dates: '',
  });

  useEffect(() => {
    fetchEventData();
  }, []);

  async function fetchEventData() {
    try {
      const { data, error } = await supabase
        .from('event_page')
        .select('*')
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setEventData(data);
        setFormData({
          title: data.title,
          content: data.content,
          key_dates: data.key_dates || '',
        });
      }
    } catch (error) {
      console.error('Error fetching event data:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      const dataToSave = {
        ...formData,
        updated_at: new Date().toISOString(),
      };

      if (eventData) {
        const { error } = await supabase
          .from('event_page')
          .update(dataToSave)
          .eq('id', eventData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('event_page')
          .insert([dataToSave]);
        if (error) throw error;
      }

      await fetchEventData();
      alert('Event page updated successfully!');
    } catch (error) {
      console.error('Error saving event page:', error);
      alert('Error saving event page. Please try again.');
    } finally {
      setSaving(false);
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
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Manage Event Page</h2>
        <p className="text-gray-600">
          Edit the main Event page content (overview of the ride event)
        </p>
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Page Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
            placeholder="e.g., Ride for Vision & Valour"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            About the Event
          </label>
          <div className="bg-white rounded-lg border-2 border-gray-300">
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              modules={quillModules}
              formats={quillFormats}
              className="min-h-[300px]"
            />
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Main description of the ride event shown on the Event page
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Key Dates
          </label>
          <div className="bg-white rounded-lg border-2 border-gray-300">
            <ReactQuill
              theme="snow"
              value={formData.key_dates}
              onChange={(key_dates) => setFormData({ ...formData, key_dates })}
              modules={quillModules}
              formats={quillFormats}
              className="min-h-[200px]"
            />
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Important dates like registration deadlines, ride dates, etc.
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={handleSave}
            disabled={saving || !formData.title}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all disabled:bg-gray-400"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Event Page'}
          </button>
        </div>
      </div>

      {eventData && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Last Updated</h3>
          <p className="text-gray-600">
            {new Date(eventData.updated_at).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
