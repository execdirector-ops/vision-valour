import { useEffect, useState } from 'react';
import { supabase, Document } from '../lib/supabase';
import { FileText, Download, FolderOpen } from 'lucide-react';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .eq('is_public', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setDocuments(data || []);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDocuments();
  }, []);

  const categories = Array.from(new Set(documents.map((doc) => doc.category)));
  const filteredDocuments =
    selectedCategory === 'all'
      ? documents
      : documents.filter((doc) => doc.category === selectedCategory);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="bg-gradient-to-r from-red-900 to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-4">Document Repository</h1>
          <p className="text-xl text-red-100">
            Access important documents, waivers, and resources
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {categories.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-red-900 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
              }`}
            >
              All Documents
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all capitalize ${
                  selectedCategory === category
                    ? 'bg-red-900 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {filteredDocuments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Documents Available</h3>
            <p className="text-gray-600">
              {selectedCategory === 'all'
                ? 'Check back soon for important documents and resources.'
                : 'No documents found in this category.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 md:p-8 border-l-4 border-red-900"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="bg-red-100 w-16 h-16 rounded-xl flex items-center justify-center">
                      <FileText className="w-8 h-8 text-red-900" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h3 className="text-2xl font-bold text-gray-900">{doc.title}</h3>
                      <span className="bg-red-100 text-red-900 px-3 py-1 rounded-full text-sm font-semibold capitalize">
                        {doc.category}
                      </span>
                    </div>

                    {doc.description && (
                      <p className="text-gray-700 mb-4 leading-relaxed">{doc.description}</p>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="font-medium">{doc.file_name}</span>
                      {doc.file_size > 0 && (
                        <>
                          <span>•</span>
                          <span>{formatFileSize(doc.file_size)}</span>
                        </>
                      )}
                      <span>•</span>
                      <span>Uploaded {formatDate(doc.created_at)}</span>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-red-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-800 transition-all shadow-lg hover:shadow-xl"
                    >
                      <Download className="w-5 h-5" />
                      Download
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
