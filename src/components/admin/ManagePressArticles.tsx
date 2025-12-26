import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Newspaper, Plus, Edit, Trash2, Save, X } from 'lucide-react';

interface PressArticle {
  id: string;
  title: string;
  description: string | null;
  url: string;
  publication: string;
  published_date: string | null;
  image_url: string | null;
  display_order: number;
  is_published: boolean;
}

interface ArticleFormData {
  title: string;
  description: string;
  url: string;
  publication: string;
  published_date: string;
  image_url: string;
  display_order: number;
  is_published: boolean;
}

export default function ManagePressArticles() {
  const [articles, setArticles] = useState<PressArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    description: '',
    url: '',
    publication: '',
    published_date: '',
    image_url: '',
    display_order: 0,
    is_published: true,
  });

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('press_articles')
        .select('*')
        .order('display_order', { ascending: true })
        .order('published_date', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (err) {
      console.error('Error fetching press articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const articleData = {
        ...formData,
        description: formData.description || null,
        published_date: formData.published_date || null,
        image_url: formData.image_url || null,
      };

      if (editingId) {
        const { error } = await supabase
          .from('press_articles')
          .update(articleData)
          .eq('id', editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('press_articles')
          .insert([articleData]);

        if (error) throw error;
      }

      resetForm();
      fetchArticles();
    } catch (err) {
      console.error('Error saving press article:', err);
      alert('Failed to save press article');
    }
  };

  const handleEdit = (article: PressArticle) => {
    setFormData({
      title: article.title,
      description: article.description || '',
      url: article.url,
      publication: article.publication,
      published_date: article.published_date || '',
      image_url: article.image_url || '',
      display_order: article.display_order,
      is_published: article.is_published,
    });
    setEditingId(article.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const { error } = await supabase
        .from('press_articles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchArticles();
    } catch (err) {
      console.error('Error deleting press article:', err);
      alert('Failed to delete press article');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      url: '',
      publication: '',
      published_date: '',
      image_url: '',
      display_order: 0,
      is_published: true,
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Newspaper className="w-8 h-8 text-red-900" />
          <h2 className="text-2xl font-bold text-gray-900">Press Articles</h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-red-900 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors"
        >
          {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {showForm ? 'Cancel' : 'Add Article'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {editingId ? 'Edit Article' : 'Add New Article'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Article URL *
              </label>
              <input
                type="url"
                required
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Publication *
              </label>
              <input
                type="text"
                required
                value={formData.publication}
                onChange={(e) => setFormData({ ...formData, publication: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Published Date
                </label>
                <input
                  type="date"
                  value={formData.published_date}
                  onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_published"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="w-4 h-4 text-red-900 border-gray-300 rounded focus:ring-red-900"
              />
              <label htmlFor="is_published" className="text-sm font-medium text-gray-700">
                Published (visible on website)
              </label>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex items-center gap-2 bg-red-900 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors"
              >
                <Save className="w-5 h-5" />
                Save Article
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Publication
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {articles.map((article) => (
              <tr key={article.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{article.title}</div>
                  {article.description && (
                    <div className="text-sm text-gray-500 line-clamp-2">{article.description}</div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {article.publication}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {article.published_date ? new Date(article.published_date).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    article.is_published
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {article.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleEdit(article)}
                    className="text-red-900 hover:text-red-700"
                  >
                    <Edit className="w-5 h-5 inline" />
                  </button>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-5 h-5 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {articles.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No press articles yet. Add your first article above.
          </div>
        )}
      </div>
    </div>
  );
}
