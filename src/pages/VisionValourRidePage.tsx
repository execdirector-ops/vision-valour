import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Bike } from 'lucide-react';
import SocialShare from '../components/SocialShare';

interface VisionValourRideData {
  id: string;
  title: string;
  hero_image_url: string | null;
  content: string;
  updated_at: string;
}

export default function VisionValourRidePage() {
  const [pageData, setPageData] = useState<VisionValourRideData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPageData();
  }, []);

  async function fetchPageData() {
    try {
      const { data, error } = await supabase
        .from('vision_valour_ride_page')
        .select('*')
        .maybeSingle();

      if (error) throw error;
      setPageData(data);
    } catch (error) {
      console.error('Error fetching Vision & Valour Ride page data:', error);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {pageData?.hero_image_url && (
        <div className="relative bg-white border-b-4 border-red-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="flex flex-col items-center text-center gap-6">
              <img
                src={pageData.hero_image_url}
                alt={pageData.title}
                className="max-h-48 sm:max-h-64 w-auto object-contain"
              />
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                {pageData.title}
              </h1>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {!pageData?.hero_image_url && (
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red-900 to-red-700 rounded-full mb-4 shadow-lg">
              <Bike className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {pageData?.title}
            </h1>
          </div>
        )}

        <div className="space-y-6 sm:space-y-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">About the Ride</h2>
              <SocialShare
                title={pageData?.title || 'Vision & Valour Ride'}
                description="Join us for the annual Vision & Valour Ride"
                hashtags={['VisionAndValour', 'MotorcycleRide', 'Charity', 'BlindChildren']}
              />
            </div>
            <div
              className="content-display text-base sm:text-lg"
              dangerouslySetInnerHTML={{ __html: pageData?.content || '' }}
            />
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Register Now</h2>
            <div className="w-full">
              <div style={{ position: 'relative', overflow: 'hidden', height: '450px', width: '100%', paddingTop: '450px' }}>
                <iframe
                  title='Donation form powered by Zeffy'
                  style={{ position: 'absolute', border: 0, top: 0, left: 0, bottom: 0, right: 0, width: '100%', height: '100%' }}
                  src='https://www.zeffy.com/embed/ticketing/ride-for-vision-and-valour-2'
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
