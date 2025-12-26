import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Heart } from 'lucide-react';

interface PageData {
  title: string;
  content: string;
}

export default function HeartOfTheRidePage() {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPageData();
  }, []);

  const fetchPageData = async () => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('title, content')
        .eq('slug', 'heart-of-the-ride')
        .maybeSingle();

      if (error) throw error;
      setPageData(data);
    } catch (error) {
      console.error('Error fetching page data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="relative bg-gradient-to-br from-red-900 via-red-800 to-red-900 py-24 sm:py-32 lg:py-40">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
            <Heart className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 text-white" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center sm:text-left text-white">
              {pageData?.title || 'Heart of the Ride'}
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-red-50 text-center sm:text-left">
            The Heart Behind the Fund
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <img
                src="/Plumsy.png"
                alt="The three Stone daughters - Shelley, Plumsy, and Victoria"
                className="w-full rounded-lg shadow-xl"
              />
            </div>
          </div>

          <div className="lg:col-span-2">
            {pageData?.content ? (
              <div
                className="prose prose-lg max-w-none content-display"
                dangerouslySetInnerHTML={{ __html: pageData.content }}
              />
            ) : (
              <div className="space-y-8 text-gray-700 leading-relaxed">
                <p className="text-lg">
                  Moira "Plumsy" Stone was born on April 6, 1949, in Salmon Arm, BC. As a small child, she was diagnosed with retinoblastoma, a cancer of the eye, which eventually left her completely blind. While attending the School for the Blind in Brantford, Ontario, she told her father, Col. James Riley Stone, that some children could not afford even a small treat from the school tuck shop and asked if he could help them.
                </p>

                <p>
                  That simple, compassionate question from a little girl who had lost her sight became the spark for what is now the Military Police Fund for Blind Children (MPFBC). During her illness and after her death, Col. Stone and the Military Police began raising money so that blind children across Canada could have the supports, opportunities, and small joys that many families could not otherwise afford.
                </p>

                <p className="text-lg font-semibold text-red-900">
                  Moira "Plumsy" Stone's loving heart is at the centre of the Fund's story.
                </p>

                <div className="bg-red-50 border-l-4 border-red-900 p-6 rounded-lg mt-8">
                  <p className="font-semibold text-red-900 mb-2">Read Shelley Bouska (Stone)'s full account of Moira's life and legacy:</p>
                  <a
                    href="https://mpfbc.ca/about/moira-plumsy-stone/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-700 hover:text-red-900 underline text-lg"
                  >
                    https://mpfbc.ca/about/moira-plumsy-stone/
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
