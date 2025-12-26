import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit, Trash2, Save, X, Upload, Image as ImageIcon, AlertCircle, CheckCircle } from 'lucide-react';
import { uploadImage } from './ImageUploadHandler';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { quillModules, quillFormats } from '../../lib/quillConfig';

interface Photo {
  id: string;
  title: string;
  description: string;
  image_url: string;
  photographer_name: string;
  event_date: string | null;
  category: string;
  is_featured: boolean;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export default function ManagePhotos() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    image_url: '',
    photographer_name: '',
    event_date: '',
    category: 'general',
    is_featured: false,
    display_order: 0,
    is_published: true,
  });

  useEffect(() => {
    fetchPhotos();
  }, []);

  async function fetchPhotos() {
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .order('display_order', { ascending: true })
        .order('event_date', { ascending: false });

      if (error) throw error;
      setPhotos(data || []);
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleAdd = () => {
    setShowAddForm(true);
    setEditForm({
      title: '',
      description: '',
      image_url: '',
      photographer_name: '',
      event_date: '',
      category: 'general',
      is_featured: false,
      display_order: 0,
      is_published: true,
    });
  };

  const handleEdit = (photo: Photo) => {
    setEditingId(photo.id);
    setEditForm({
      title: photo.title,
      description: photo.description || '',
      image_url: photo.image_url,
      photographer_name: photo.photographer_name || '',
      event_date: photo.event_date || '',
      category: photo.category || 'general',
      is_featured: photo.is_featured,
      display_order: photo.display_order || 0,
      is_published: photo.is_published,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowAddForm(false);
    setEditForm({
      title: '',
      description: '',
      image_url: '',
      photographer_name: '',
      event_date: '',
      category: 'general',
      is_featured: false,
      display_order: 0,
      is_published: true,
    });
  };

  const handleSave = async () => {
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('You must be logged in to save. Please refresh and log in again.');
      }

      if (editingId) {
        console.log('Updating photo:', editingId);
        const { data, error } = await supabase
          .from('photos')
          .update({
            ...editForm,
            event_date: editForm.event_date || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingId)
          .select();

        if (error) {
          console.error('Supabase error:', error);
          throw new Error(`Failed to save: ${error.message}`);
        }

        if (!data || data.length === 0) {
          throw new Error('Update appeared successful but no rows were affected.');
        }

        console.log('Photo updated successfully:', data);
      } else {
        console.log('Inserting new photo');
        const { data, error } = await supabase.from('photos').insert([
          {
            ...editForm,
            event_date: editForm.event_date || null,
          },
        ]).select();

        if (error) {
          console.error('Supabase error:', error);
          throw new Error(`Failed to save: ${error.message}`);
        }

        console.log('Photo inserted successfully:', data);
      }

      await fetchPhotos();
      setSaveSuccess(true);
      setTimeout(() => {
        handleCancel();
      }, 1500);
    } catch (error) {
      console.error('Error saving photo:', error);
      setSaveError(error instanceof Error ? error.message : 'Failed to save photo. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;

    try {
      const { error } = await supabase.from('photos').delete().eq('id', id);

      if (error) throw error;
      await fetchPhotos();
    } catch (error) {
      console.error('Error deleting photo:', error);
      alert('Failed to delete photo. Please try again.');
    }
  };

  const handleImageUpload = () => {
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
          setEditForm({ ...editForm, image_url: imageUrl });
        } catch (error) {
          alert('Failed to upload image. Please try again.');
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

  const renderForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Title *</label>
        <input
          type="text"
          value={editForm.title}
          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
          placeholder="Photo title"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Image *</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={editForm.image_url}
            onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })}
            className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
            placeholder="https://example.com/photo.jpg"
          />
          <button
            onClick={handleImageUpload}
            disabled={uploading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
          </button>
        </div>
        {editForm.image_url && (
          <img
            src={editForm.image_url}
            alt="Preview"
            className="mt-2 h-40 object-cover rounded-lg"
          />
        )}
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
          placeholder="Photo description"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Photographer</label>
          <input
            type="text"
            value={editForm.photographer_name}
            onChange={(e) => setEditForm({ ...editForm, photographer_name: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
            placeholder="Photographer name"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Event Date</label>
          <input
            type="date"
            value={editForm.event_date}
            onChange={(e) => setEditForm({ ...editForm, event_date: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
          <select
            value={editForm.category}
            onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
          >
            <option value="general">General</option>
            <option value="ride">Ride</option>
            <option value="ceremony">Ceremony</option>
            <option value="social">Social</option>
            <option value="blueberry-mountain">Blueberry Mountain</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Display Order</label>
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

      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={editForm.is_featured}
            onChange={(e) => setEditForm({ ...editForm, is_featured: e.target.checked })}
            className="w-5 h-5 text-red-900 border-gray-300 rounded focus:ring-red-900"
          />
          <span className="text-sm font-semibold text-gray-900">Featured on Homepage</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={editForm.is_published}
            onChange={(e) => setEditForm({ ...editForm, is_published: e.target.checked })}
            className="w-5 h-5 text-red-900 border-gray-300 rounded focus:ring-red-900"
          />
          <span className="text-sm font-semibold text-gray-900">Published</span>
        </label>
      </div>

      {saveError && (
        <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-800 font-semibold">{saveError}</p>
        </div>
      )}
      {saveSuccess && (
        <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-lg flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-green-800 font-semibold">Photo saved successfully!</p>
        </div>
      )}

      <div className="flex gap-3 justify-end pt-4">
        <button
          onClick={handleCancel}
          className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!editForm.title || !editForm.image_url}
          className="px-6 py-2 bg-red-900 text-white rounded-lg hover:bg-red-800 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Manage Photos</h2>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Photo
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Add New Photo</h3>
          {renderForm()}
        </div>
      )}

      <div className="grid gap-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            {editingId === photo.id ? (
              renderForm()
            ) : (
              <div className="flex items-start gap-6">
                <img
                  src={photo.image_url}
                  alt={photo.title}
                  className="h-32 w-32 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{photo.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-semibold capitalize">{photo.category}</span>
                        {photo.photographer_name && ` • ${photo.photographer_name}`}
                        {photo.event_date && ` • ${new Date(photo.event_date).toLocaleDateString()}`}
                        {photo.is_featured && (
                          <span className="ml-2 text-yellow-600 font-semibold">(Featured)</span>
                        )}
                        {!photo.is_published && (
                          <span className="ml-2 text-red-600 font-semibold">(Unpublished)</span>
                        )}
                      </p>
                      {photo.description && (
                        <div
                          className="text-gray-700 mt-2 prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: photo.description }}
                        />
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(photo)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(photo.id)}
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

      {photos.length === 0 && !showAddForm && (
        <div className="text-center py-12 bg-white rounded-2xl shadow-xl">
          <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No photos yet. Add your first photo!</p>
        </div>
      )}
    </div>
  );
}
