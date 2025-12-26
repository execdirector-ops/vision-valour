import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit, Trash2, Save, X, Upload, ExternalLink } from 'lucide-react';
import { uploadImage } from './ImageUploadHandler';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { quillModules, quillFormats } from '../../lib/quillConfig';

interface Sponsor {
  id: string;
  name: string;
  logo_url: string;
  website_url: string;
  description: string;
  category: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function ManageSponsors() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    logo_url: '',
    website_url: '',
    description: '',
    category: 'operations',
    display_order: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchSponsors();
  }, []);

  async function fetchSponsors() {
    try {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .order('display_order', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      setSponsors(data || []);
    } catch (error) {
      console.error('Error fetching sponsors:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleAdd = () => {
    setShowAddForm(true);
    setEditForm({
      name: '',
      logo_url: '',
      website_url: '',
      description: '',
      category: 'operations',
      display_order: 0,
      is_active: true,
    });
  };

  const handleEdit = (sponsor: Sponsor) => {
    setEditingId(sponsor.id);
    setEditForm({
      name: sponsor.name,
      logo_url: sponsor.logo_url || '',
      website_url: sponsor.website_url || '',
      description: sponsor.description || '',
      category: sponsor.category || 'operations',
      display_order: sponsor.display_order || 0,
      is_active: sponsor.is_active,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowAddForm(false);
    setEditForm({
      name: '',
      logo_url: '',
      website_url: '',
      description: '',
      category: 'operations',
      display_order: 0,
      is_active: true,
    });
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        const { error } = await supabase
          .from('sponsors')
          .update({
            name: editForm.name,
            logo_url: editForm.logo_url,
            website_url: editForm.website_url,
            description: editForm.description,
            category: editForm.category,
            display_order: editForm.display_order,
            is_active: editForm.is_active,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('sponsors').insert([
          {
            name: editForm.name,
            logo_url: editForm.logo_url,
            website_url: editForm.website_url,
            description: editForm.description,
            category: editForm.category,
            display_order: editForm.display_order,
            is_active: editForm.is_active,
          },
        ]);

        if (error) throw error;
      }

      await fetchSponsors();
      handleCancel();
    } catch (error) {
      console.error('Error saving sponsor:', error);
      alert('Failed to save sponsor. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sponsor?')) return;

    try {
      const { error } = await supabase.from('sponsors').delete().eq('id', id);

      if (error) throw error;
      await fetchSponsors();
    } catch (error) {
      console.error('Error deleting sponsor:', error);
      alert('Failed to delete sponsor. Please try again.');
    }
  };

  const handleLogoUpload = () => {
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
          setEditForm({ ...editForm, logo_url: imageUrl });
        } catch (error) {
          alert('Failed to upload logo. Please try again.');
        } finally {
          setUploading(false);
        }
      }
    };
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
        <h2 className="text-3xl font-bold text-gray-900">Manage Sponsors</h2>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Sponsor
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Add New Sponsor</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Name *</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                placeholder="Sponsor name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Logo URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editForm.logo_url}
                  onChange={(e) => setEditForm({ ...editForm, logo_url: e.target.value })}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                  placeholder="https://example.com/logo.png"
                />
                <button
                  onClick={handleLogoUpload}
                  disabled={uploading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" />
                </button>
              </div>
              {editForm.logo_url && (
                <img
                  src={editForm.logo_url}
                  alt="Logo preview"
                  className="mt-2 h-20 object-contain"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Website URL</label>
              <input
                type="text"
                value={editForm.website_url}
                onChange={(e) => setEditForm({ ...editForm, website_url: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
              <ReactQuill
                value={editForm.description}
                onChange={(value) => setEditForm({ ...editForm, description: value })}
                className="bg-white rounded-lg"
                theme="snow"
                modules={quillModules}
                formats={quillFormats}
                placeholder="Brief description of the sponsor"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                >
                  <option value="operations">Operations Sponsors</option>
                  <option value="insurance">Insurance Sponsors</option>
                  <option value="marketing">Marketing Sponsors</option>
                  <option value="chase_truck">Chase Truck / Rider Support Sponsors</option>
                  <option value="meals">Meal and Coffee Break Sponsors</option>
                  <option value="swag">Swag Sponsors</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  value={editForm.display_order}
                  onChange={(e) =>
                    setEditForm({ ...editForm, display_order: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editForm.is_active}
                  onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
                  className="w-5 h-5 text-red-900 border-gray-300 rounded focus:ring-red-900"
                />
                <span className="text-sm font-semibold text-gray-900">Active (visible on site)</span>
              </label>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <button
                onClick={handleCancel}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!editForm.name}
                className="px-6 py-2 bg-red-900 text-white rounded-lg hover:bg-red-800 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {sponsors.map((sponsor) => (
          <div
            key={sponsor.id}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            {editingId === sponsor.id ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Name *</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Logo URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editForm.logo_url}
                      onChange={(e) => setEditForm({ ...editForm, logo_url: e.target.value })}
                      className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                    />
                    <button
                      onClick={handleLogoUpload}
                      disabled={uploading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Website URL
                  </label>
                  <input
                    type="text"
                    value={editForm.website_url}
                    onChange={(e) => setEditForm({ ...editForm, website_url: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Description
                  </label>
                  <ReactQuill
                    value={editForm.description}
                    onChange={(value) => setEditForm({ ...editForm, description: value })}
                    className="bg-white rounded-lg"
                    theme="snow"
                    modules={quillModules}
                    formats={quillFormats}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Category
                    </label>
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                    >
                      <option value="operations">Operations Sponsors</option>
                      <option value="insurance">Insurance Sponsors</option>
                      <option value="marketing">Marketing Sponsors</option>
                      <option value="chase_truck">Chase Truck / Rider Support Sponsors</option>
                      <option value="meals">Meal and Coffee Break Sponsors</option>
                      <option value="swag">Swag Sponsors</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={editForm.display_order}
                      onChange={(e) =>
                        setEditForm({ ...editForm, display_order: parseInt(e.target.value) || 0 })
                      }
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editForm.is_active}
                      onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
                      className="w-5 h-5 text-red-900 border-gray-300 rounded focus:ring-red-900"
                    />
                    <span className="text-sm font-semibold text-gray-900">
                      Active (visible on site)
                    </span>
                  </label>
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-red-900 text-white rounded-lg hover:bg-red-800 transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-6">
                {sponsor.logo_url && (
                  <img
                    src={sponsor.logo_url}
                    alt={`${sponsor.name} logo`}
                    className="h-20 w-20 object-contain flex-shrink-0"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{sponsor.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-semibold capitalize">{sponsor.category}</span> •
                        Order: {sponsor.display_order}
                        {!sponsor.is_active && (
                          <span className="ml-2 text-red-600 font-semibold">(Inactive)</span>
                        )}
                      </p>
                      {sponsor.description && (
                        <div
                          className="text-gray-700 mt-2 prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: sponsor.description }}
                        />
                      )}
                      {sponsor.website_url && (
                        <a
                          href={sponsor.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-red-900 hover:text-red-700 mt-2 text-sm font-semibold"
                        >
                          Visit Website <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(sponsor)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(sponsor.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {sponsors.length === 0 && !showAddForm && (
        <div className="text-center py-12 bg-white rounded-2xl shadow-xl">
          <p className="text-gray-600 mb-4">No sponsors yet. Add your first sponsor!</p>
        </div>
      )}
    </div>
  );
}
