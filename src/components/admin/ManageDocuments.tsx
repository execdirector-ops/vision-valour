import { useEffect, useState } from 'react';
import { supabase, Document } from '../../lib/supabase';
import { Plus, Edit, Trash2, Save, X, Upload, Copy } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { uploadDocument } from './ImageUploadHandler';

export default function ManageDocuments() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file_url: '',
    file_name: '',
    category: 'general',
    is_public: true,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  async function fetchDocuments() {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      file_url: '',
      file_name: '',
      category: 'general',
      is_public: true,
    });
    setEditingId(null);
    setShowNewForm(false);
  };

  const handleEdit = (doc: Document) => {
    setEditingId(doc.id);
    setFormData({
      title: doc.title,
      description: doc.description,
      file_url: doc.file_url,
      file_name: doc.file_name,
      category: doc.category,
      is_public: doc.is_public,
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const docData = {
        ...formData,
        uploaded_by: user?.id || null,
      };

      if (editingId) {
        const { error } = await supabase
          .from('documents')
          .update(docData)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('documents').insert([docData]);
        if (error) throw error;
      }

      await fetchDocuments();
      resetForm();
    } catch (error) {
      console.error('Error saving document:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      const { error } = await supabase.from('documents').delete().eq('id', id);
      if (error) throw error;
      await fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('URL copied to clipboard!');
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const {url} = await uploadDocument(file);
      setFormData({
        ...formData,
        file_url: url,
        file_name: file.name,
      });
      alert('File uploaded successfully!');
    } catch (error) {
      alert('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Manage Documents</h2>
          <p className="text-gray-600">Upload and manage documents for your repository</p>
        </div>
        <button
          onClick={() => setShowNewForm(true)}
          className="flex items-center gap-2 bg-red-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-800 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Document
        </button>
      </div>

      {(showNewForm || editingId) && (
        <div className="border-2 border-red-900 rounded-xl p-6 bg-red-50">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {editingId ? 'Edit Document' : 'New Document'}
          </h3>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
            <p className="text-sm text-blue-800">
              <strong>Upload your file:</strong> Click "Choose File" below to upload documents directly from your computer.
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Upload File
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all cursor-pointer disabled:bg-gray-400">
                  <Upload className="w-5 h-5" />
                  {uploading ? 'Uploading...' : 'Choose File'}
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  />
                </label>
                {formData.file_name && (
                  <span className="text-sm text-gray-600">Selected: {formData.file_name}</span>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Document Title *
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
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
              />
            </div>
            <div className="hidden">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                File URL *
              </label>
              <input
                type="url"
                value={formData.file_url}
                onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                placeholder="https://example.com/document.pdf"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
              />
            </div>
            <div className="hidden">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                File Name *
              </label>
              <input
                type="text"
                value={formData.file_name}
                onChange={(e) => setFormData({ ...formData, file_name: e.target.value })}
                placeholder="document.pdf"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
              >
                <option value="general">General</option>
                <option value="waivers">Waivers</option>
                <option value="routes">Routes</option>
                <option value="safety">Safety</option>
                <option value="registration">Registration</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_public"
                checked={formData.is_public}
                onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                className="w-5 h-5 text-red-900 border-gray-300 rounded focus:ring-red-900"
              />
              <label htmlFor="is_public" className="text-sm font-semibold text-gray-900">
                Make public (visible to all visitors)
              </label>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving || !formData.title || !formData.file_url || !formData.file_name}
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-all disabled:bg-gray-400"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Document'}
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
        {documents.map((doc) => (
          <div key={doc.id} className="border-2 border-gray-200 rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{doc.title}</h3>
                  <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold capitalize">
                    {doc.category}
                  </span>
                  {doc.is_public ? (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                      Public
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold">
                      Private
                    </span>
                  )}
                </div>
                {doc.description && (
                  <p className="text-gray-700 mb-3">{doc.description}</p>
                )}
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <strong>File:</strong> {doc.file_name}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="flex-1">
                      <strong>URL:</strong>{' '}
                      <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {doc.file_url}
                      </a>
                    </p>
                    <button
                      onClick={() => handleCopyUrl(doc.file_url)}
                      className="flex items-center gap-1 bg-gray-200 text-gray-700 px-3 py-1 rounded-lg font-semibold hover:bg-gray-300 transition-all text-sm"
                      title="Copy URL to clipboard"
                    >
                      <Copy className="w-4 h-4" />
                      Copy URL
                    </button>
                  </div>
                  <p>
                    <strong>Uploaded:</strong> {new Date(doc.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleEdit(doc)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(doc.id)}
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
