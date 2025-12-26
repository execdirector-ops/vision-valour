import { useEffect, useState } from 'react';
import { supabase, Page } from '../../lib/supabase';
import { Edit, Save, X } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    ['link', 'image'],
    [{ color: [] }, { background: [] }],
    ['blockquote', 'code-block'],
    ['clean'],
  ],
};

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
  'bullet',
  'align',
  'link',
  'image',
  'color',
  'background',
  'blockquote',
  'code-block',
];

export default function ManagePages() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: '', content: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchPages();
  }, []);

  async function fetchPages() {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('slug', { ascending: true });

      if (error) {
        console.error('Fetch error:', error);
        throw error;
      }

      setPages(data || []);
    } catch (error) {
      console.error('Error fetching pages:', error);
      setMessage({ type: 'error', text: 'Failed to load pages' });
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (page: Page) => {
    setEditingId(page.id);
    setEditForm({ title: page.title, content: page.content });
    setMessage(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({ title: '', content: '' });
    setMessage(null);
  };

  const handleSave = async (id: string) => {
    if (!editForm.title.trim()) {
      setMessage({ type: 'error', text: 'Title is required' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      // Check authentication
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        throw new Error('Not authenticated. Please log out and log back in.');
      }

      console.log('Saving page:', id);
      console.log('User:', session.user.email);
      console.log('Title:', editForm.title);
      console.log('Content length:', editForm.content.length);

      // Perform update
      const { data, error } = await supabase
        .from('pages')
        .update({
          title: editForm.title,
          content: editForm.content,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select();

      if (error) {
        console.error('Update error:', error);
        throw new Error(error.message);
      }

      if (!data || data.length === 0) {
        throw new Error('No rows updated. Check permissions.');
      }

      console.log('Update successful:', data);

      // Refetch to confirm
      await fetchPages();

      setMessage({ type: 'success', text: 'Saved successfully!' });

      // Close edit form after 1 second
      setTimeout(() => {
        setEditingId(null);
        setMessage(null);
      }, 1000);

    } catch (error: any) {
      console.error('Save failed:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Failed to save. Check console for details.'
      });
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Manage Pages</h2>
        <p className="text-gray-600">Edit content for different pages on your website</p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success'
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {pages.map((page) => (
        <div key={page.id} className="border-2 border-gray-200 rounded-xl p-6 bg-white">
          {editingId === page.id ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Page: {page.slug}
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Content
                </label>
                <div className="bg-white rounded-lg border-2 border-gray-300">
                  <ReactQuill
                    theme="snow"
                    value={editForm.content}
                    onChange={(content) => setEditForm({ ...editForm, content })}
                    modules={modules}
                    formats={formats}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleSave(page.id)}
                  disabled={saving}
                  className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all disabled:bg-gray-400"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex items-center gap-2 bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{page.title}</h3>
                  <p className="text-sm text-gray-500">Slug: {page.slug}</p>
                </div>
                <button
                  onClick={() => handleEdit(page)}
                  className="flex items-center gap-2 bg-red-900 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-800 transition-all"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: page.content }} />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
