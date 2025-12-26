import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Mountain, MapPin, Clock, Shield, FileText } from 'lucide-react';
import SocialShare from '../components/SocialShare';

interface BlueberryMountainData {
  id: string;
  title: string;
  hero_image_url: string | null;
  content: string;
  walk_details: string;
  col_stone_memorial_info: string;
  brochure_url: string;
  updated_at: string;
}

export default function BlueberryMountainPage() {
  const [pageData, setPageData] = useState<BlueberryMountainData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPageData() {
      try {
        const { data, error } = await supabase
          .from('blueberry_mountain_page')
          .select('*')
          .maybeSingle();

        if (error) throw error;
        setPageData(data);
      } catch (error) {
        console.error('Error fetching Blueberry Mountain page:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPageData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
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
            <Mountain className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 text-white" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center sm:text-left text-white">
              {pageData?.title || 'Blueberry Mountain: A Legacy of Military Service'}
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-amber-50 text-center sm:text-left">
            Discover the remarkable military heritage of Alberta's Saddle Hills County
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center border-t-4 border-amber-600">
            <div className="text-4xl sm:text-5xl font-bold text-amber-700 mb-2">42</div>
            <div className="text-gray-900 font-semibold text-base sm:text-lg mb-2">Soldiers</div>
            <div className="text-gray-600 text-sm">Who lived in Blueberry Mountain</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center border-t-4 border-green-600">
            <div className="text-4xl sm:text-5xl font-bold text-green-600 mb-2">0</div>
            <div className="text-gray-900 font-semibold text-base sm:text-lg mb-2">Killed in Action</div>
            <div className="text-gray-600 text-sm">Across 4 major wars</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center border-t-4 border-blue-600">
            <div className="text-4xl sm:text-5xl font-bold text-blue-600 mb-2">8</div>
            <div className="text-gray-900 font-semibold text-base sm:text-lg mb-2">Multi-War Veterans</div>
            <div className="text-gray-600 text-sm">Served in two wars</div>
          </div>
        </div>

        <div className="space-y-6 sm:space-y-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Blueberry Mountain Community & Military History Walk</h2>
              <SocialShare
                title="Blueberry Mountain: A Legacy of Military Service"
                description="Discover the remarkable military heritage of Alberta's Saddle Hills County. 42 soldiers, 0 casualties."
                hashtags={['BlueberryMountain', 'MilitaryHistory', 'Alberta', 'Veterans']}
              />
            </div>
            <div
              className="content-display text-base sm:text-lg"
              dangerouslySetInnerHTML={{ __html: pageData?.content || '' }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow-lg p-6 sm:p-8 border-2 border-amber-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-amber-700 p-3 rounded-lg">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Trail Details</h3>
              </div>
              <div className="space-y-3 text-sm sm:text-base text-gray-700">
                <div className="flex items-start gap-2">
                  <Shield className="w-5 h-5 text-amber-700 mt-0.5 flex-shrink-0" />
                  <span>Starts at the Col Stone Memorial and veterans tributes</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-amber-700 mt-0.5 flex-shrink-0" />
                  <span>Self-guided walking trail through scenic landscape</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-amber-700 mt-0.5 flex-shrink-0" />
                  <span>Ends at the Presbyterian Church</span>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-5 h-5 text-amber-700 mt-0.5 flex-shrink-0" />
                  <span>Duration: 30 minutes to 1 hour at a leisurely pace</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-6 sm:p-8 border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-600 p-3 rounded-lg">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Location</h3>
              </div>
              <p className="text-gray-700 mb-4 text-sm sm:text-base">
                Property owned by the <strong>Blueberry Mountain Goodwill Society</strong>.
              </p>
              <div className="bg-white rounded-lg p-4 border border-blue-300">
                <p className="text-sm font-semibold text-gray-900 mb-1">Community Hall:</p>
                <p className="text-gray-800 font-medium text-sm sm:text-base">AB-680, Blueberry Mountain, AB T0H 3G0</p>
              </div>
            </div>
          </div>

          {pageData?.brochure_url && (
            <div className="bg-gradient-to-r from-red-900 to-red-800 rounded-2xl shadow-xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-white">
                  <div className="bg-white/20 p-4 rounded-xl">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-1">Blueberry Mountain Brochure</h3>
                    <p className="text-red-100 text-sm sm:text-base">Download the complete guide and community information</p>
                  </div>
                </div>
                <a
                  href={pageData.brochure_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-red-900 px-6 py-3 rounded-lg font-bold hover:bg-red-50 transition-all shadow-lg whitespace-nowrap"
                >
                  Download PDF
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
