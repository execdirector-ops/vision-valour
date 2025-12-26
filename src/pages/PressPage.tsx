import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Newspaper, ExternalLink, Calendar } from 'lucide-react';

interface PressArticle {
  id: string;
  title: string;
  description: string | null;
  url: string;
  publication: string;
  published_date: string | null;
  image_url: string | null;
  display_order: number;
}

export default function PressPage() {
  const [articles, setArticles] = useState<PressArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('press_articles')
        .select('*')
        .eq('is_published', true)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="bg-gradient-to-r from-red-900 to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <Newspaper className="w-12 h-12" />
            <h1 className="text-5xl font-bold">Press</h1>
          </div>
          <p className="text-xl text-red-100">
            News coverage and press releases
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-900"></div>
            <p className="mt-4 text-gray-600">Loading articles...</p>
          </div>
        ) : articles.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-8">
            {articles.map((article) => (
              <a
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1"
              >
                {article.image_url && (
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="w-full h-64 object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-2xl font-bold text-gray-900 flex-1">{article.title}</h3>
                    <ExternalLink className="w-5 h-5 text-red-900 flex-shrink-0 mt-1" />
                  </div>

                  {article.description && (
                    <p className="text-gray-600 mb-4 line-clamp-3">{article.description}</p>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-red-900">{article.publication}</span>
                    {article.published_date && (
                      <div className="flex items-center gap-1 text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(article.published_date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Coming Soon</h2>
            <p className="text-gray-700 text-lg">
              This section will feature press releases, news articles, and media coverage. Check back soon for updates!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
