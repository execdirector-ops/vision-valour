import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ExternalLink, Facebook } from 'lucide-react';
import SocialShare from '../components/SocialShare';

interface MPFBCData {
  id: string;
  title: string;
  hero_image_url: string | null;
  content: string;
  subtitle: string | null;
  website_url: string | null;
  facebook_url: string | null;
  updated_at: string;
}

export default function MPFBCPage() {
  const [pageData, setPageData] = useState<MPFBCData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPageData();
  }, []);

  async function fetchPageData() {
    try {
      const { data, error } = await supabase
        .from('mpfbc_page')
        .select('*')
        .maybeSingle();

      if (error) throw error;
      setPageData(data);
    } catch (error) {
      console.error('Error fetching MPFBC page data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="relative bg-gradient-to-br from-red-900 via-red-800 to-red-900 py-24 sm:py-32 lg:py-40">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center gap-6">
            <img
              src="/mpfund copy.webp"
              alt="Military Police Fund for Blind Children Logo"
              className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 object-contain bg-white rounded-full p-4 shadow-2xl"
            />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              <a
                href="https://mpfbc.ca/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-100 hover:underline transition-all cursor-pointer"
              >
                Military Police Fund for Blind Children
              </a>
            </h1>
            <p className="text-lg sm:text-xl text-amber-50 max-w-3xl">
              {pageData?.subtitle || "Canada's only military charity dedicated to supporting blind and visually impaired children"}
            </p>
            {(pageData?.website_url || pageData?.facebook_url) && (
              <div className="flex flex-wrap gap-4 justify-center mt-4">
                {pageData?.website_url && (
                  <a
                    href={pageData.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white text-red-900 px-6 py-3 rounded-lg font-bold hover:bg-amber-50 transition-all shadow-lg"
                  >
                    <ExternalLink className="w-5 h-5" />
                    Visit MPFBC Website
                  </a>
                )}
                {pageData?.facebook_url && (
                  <a
                    href={pageData.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-lg"
                  >
                    <Facebook className="w-5 h-5" />
                    Follow on Facebook
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="space-y-6 sm:space-y-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-12">
            <div className="flex justify-end mb-6">
              <SocialShare
                title={pageData?.title || 'MPFBC'}
                description="Supporting blind and visually impaired children across Canada"
                hashtags={['MPFBC', 'Charity', 'BlindChildren', 'Canada']}
              />
            </div>
            <div
              className="content-display text-base sm:text-lg"
              dangerouslySetInnerHTML={{ __html: pageData?.content || '' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
