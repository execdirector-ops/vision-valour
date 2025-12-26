import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Calendar, MapPin } from 'lucide-react';

interface EventPageData {
  id: string;
  title: string;
  content: string;
  key_dates: string;
  updated_at: string;
}

export default function EventPage() {
  const [eventData, setEventData] = useState<EventPageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEventData() {
      try {
        const { data, error } = await supabase
          .from('event_page')
          .select('*')
          .maybeSingle();

        if (error) throw error;
        setEventData(data);
      } catch (error) {
        console.error('Error fetching event data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchEventData();
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
      <div className="bg-gradient-to-r from-red-900 to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <MapPin className="w-12 h-12" />
            <h1 className="text-5xl font-bold">{eventData?.title || 'Event Information'}</h1>
          </div>
          <p className="text-xl text-red-100">
            Important dates for our signature motorcycle ride event
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {eventData?.key_dates && (
          <div className="bg-gradient-to-br from-red-50 to-white rounded-2xl shadow-xl p-8 md:p-12 border border-red-100">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-8 h-8 text-red-900" />
              <h2 className="text-3xl font-bold text-gray-900">Key Dates</h2>
            </div>
            <div
              className="content-display prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: eventData.key_dates }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
