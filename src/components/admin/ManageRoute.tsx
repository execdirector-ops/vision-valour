import { useEffect, useState, useRef, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Upload, MapPin, Plus, Edit, Trash2, X } from 'lucide-react';
import ReactQuill from 'react-quill';
import { uploadImage } from './ImageUploadHandler';

interface Route {
  id: string;
  name: string;
  description: string;
  duration_days: number;
  provinces: string;
  map_embed_url: string;
  itinerary_content: string;
  is_active: boolean;
  display_order: number;
}

export default function ManageRoute() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    duration_days: 13,
    provinces: '',
    map_embed_url: '',
    itinerary_content: '',
    is_active: true,
    display_order: 0,
  });
  const quillRef = useRef<ReactQuill>(null);

  useEffect(() => {
    fetchRoutes();
  }, []);

  async function fetchRoutes() {
    try {
      const { data, error } = await supabase
        .from('routes')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setRoutes(data || []);
    } catch (error) {
      console.error('Error fetching routes:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (route: Route) => {
    setEditingId(route.id);
    setEditForm({
      name: route.name,
      description: route.description,
      duration_days: route.duration_days,
      provinces: route.provinces,
      map_embed_url: route.map_embed_url || '',
      itinerary_content: route.itinerary_content || '',
      is_active: route.is_active,
      display_order: route.display_order,
    });
  };

  const handleAdd = () => {
    setShowAddForm(true);
    setEditForm({
      name: '',
      description: '',
      duration_days: 13,
      provinces: '',
      map_embed_url: '',
      itinerary_content: '',
      is_active: true,
      display_order: routes.length,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingId) {
        const { error } = await supabase
          .from('routes')
          .update({
            name: editForm.name,
            description: editForm.description,
            duration_days: editForm.duration_days,
            provinces: editForm.provinces,
            map_embed_url: editForm.map_embed_url,
            itinerary_content: editForm.itinerary_content,
            is_active: editForm.is_active,
            display_order: editForm.display_order,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingId);

        if (error) throw error;
        alert('Route updated successfully!');
      } else {
        const { error } = await supabase.from('routes').insert([editForm]);
        if (error) throw error;
        alert('Route added successfully!');
      }

      await fetchRoutes();
      handleCancel();
    } catch (error) {
      console.error('Error saving route:', error);
      alert('Failed to save route. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this route?')) return;

    try {
      const { error } = await supabase.from('routes').delete().eq('id', id);
      if (error) throw error;

      await fetchRoutes();
      alert('Route deleted successfully!');
    } catch (error) {
      console.error('Error deleting route:', error);
      alert('Failed to delete route. Please try again.');
    }
  };

  const handleMapImageUpload = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        setUploading(true);
        try {
          const imageUrl = await uploadImage(file);
          setEditForm({ ...editForm, map_embed_url: imageUrl });
        } catch (error) {
          alert('Failed to upload map image. Please try again.');
        } finally {
          setUploading(false);
        }
      }
    };
  };

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ align: [] }],
        ['link'],
        [{ color: [] }, { background: [] }],
        ['blockquote'],
        ['clean'],
      ],
    }),
    []
  );

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
    'color',
    'background',
    'blockquote',
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900"></div>
      </div>
    );
  }

  if (editingId || showAddForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin className="w-8 h-8 text-red-900" />
            <h2 className="text-3xl font-bold text-gray-900">
              {editingId ? 'Edit Route' : 'Add New Route'}
            </h2>
          </div>
          <button
            onClick={handleCancel}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Route Name *
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                  placeholder="e.g., BC + Alberta Route"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Provinces *
                </label>
                <input
                  type="text"
                  value={editForm.provinces}
                  onChange={(e) => setEditForm({ ...editForm, provinces: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                  placeholder="e.g., BC + AB"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Duration (Days) *
                </label>
                <input
                  type="number"
                  value={editForm.duration_days}
                  onChange={(e) => setEditForm({ ...editForm, duration_days: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  value={editForm.display_order}
                  onChange={(e) => setEditForm({ ...editForm, display_order: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Description *
              </label>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                rows={3}
                placeholder="Brief description of the route"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Route Map (Image URL or iframe Embed Code)
              </label>
              <div className="flex gap-3">
                <textarea
                  value={editForm.map_embed_url}
                  onChange={(e) => setEditForm({ ...editForm, map_embed_url: e.target.value })}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                  rows={3}
                  placeholder='Paste image URL or Google Maps iframe embed code'
                />
                <button
                  onClick={handleMapImageUpload}
                  disabled={uploading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </button>
              </div>
              {editForm.map_embed_url && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Preview:</p>
                  <div className="flex justify-center">
                    {editForm.map_embed_url.includes('<iframe') ? (
                      <div
                        className="w-full max-w-2xl"
                        dangerouslySetInnerHTML={{ __html: editForm.map_embed_url }}
                      />
                    ) : (
                      <img
                        src={editForm.map_embed_url}
                        alt="Route Map Preview"
                        className="max-w-md rounded-lg shadow-lg"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Itinerary Content
              </label>
              <div className="bg-white rounded-lg border-2 border-gray-300">
                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  value={editForm.itinerary_content}
                  onChange={(content) => setEditForm({ ...editForm, itinerary_content: content })}
                  modules={modules}
                  formats={formats}
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editForm.is_active}
                  onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
                  className="w-5 h-5 text-red-900 border-2 border-gray-300 rounded focus:ring-2 focus:ring-red-900"
                />
                <span className="text-sm font-semibold text-gray-900">Route is Active</span>
              </label>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancel}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 bg-red-900 text-white rounded-lg hover:bg-red-800 transition-colors disabled:opacity-50 flex items-center gap-2 font-semibold"
              >
                <Save className="w-5 h-5" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MapPin className="w-8 h-8 text-red-900" />
          <h2 className="text-3xl font-bold text-gray-900">Manage Routes</h2>
        </div>
        <button
          onClick={handleAdd}
          className="px-6 py-3 bg-red-900 text-white rounded-lg hover:bg-red-800 transition-colors flex items-center gap-2 font-semibold"
        >
          <Plus className="w-5 h-5" />
          Add Route
        </button>
      </div>

      <div className="grid gap-6">
        {routes.map((route) => (
          <div key={route.id} className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{route.name}</h3>
                <p className="text-gray-600 mb-3">{route.description}</p>
                <div className="flex gap-4 text-sm text-gray-700">
                  <span className="font-semibold">{route.duration_days} days</span>
                  <span className="font-semibold">{route.provinces}</span>
                  <span className={`font-semibold ${route.is_active ? 'text-green-600' : 'text-red-600'}`}>
                    {route.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(route)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(route.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
