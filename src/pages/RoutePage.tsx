import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Map, Calendar, MapPin } from 'lucide-react';

interface Route {
  id: string;
  name: string;
  description: string;
  duration_days: number;
  provinces: string;
  map_embed_url: string;
  itinerary_content: string;
  is_active: boolean;
  display_order: number;
}

export default function RoutePage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoutes() {
      try {
        const { data, error } = await supabase
          .from('routes')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (error) throw error;
        setRoutes(data || []);
        if (data && data.length > 0) {
          setSelectedRoute(data[0]);
        }
      } catch (error) {
        console.error('Error fetching routes:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRoutes();
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
            <Map className="w-12 h-12" />
            <h1 className="text-5xl font-bold">Routes & Itineraries</h1>
          </div>
          <p className="text-xl text-red-100">
            Choose your adventure - explore our ride routes and daily schedules
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {routes.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <Map className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Routes Available</h3>
            <p className="text-gray-600">
              Route information coming soon. Check back later!
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              {routes.map((route) => (
                <div
                  key={route.id}
                  onClick={() => setSelectedRoute(route)}
                  className={`cursor-pointer rounded-2xl shadow-lg p-8 transition-all border-4 ${
                    selectedRoute?.id === route.id
                      ? 'border-red-900 bg-gradient-to-br from-red-50 to-white'
                      : 'border-gray-200 bg-white hover:border-red-300'
                  }`}
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{route.name}</h3>
                  <div className="flex items-center gap-4 mb-4 text-gray-700">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-red-900" />
                      <span className="font-semibold">{route.duration_days} days</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-red-900" />
                      <span className="font-semibold">{route.provinces}</span>
                    </div>
                  </div>
                  <p className="text-gray-600">{route.description}</p>
                </div>
              ))}
            </div>

            {selectedRoute && (
              <div className="space-y-8">
                {selectedRoute.map_embed_url && (
                  <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Route Map</h2>
                    <div className="flex justify-center">
                      <div
                        className="w-full max-w-4xl"
                        dangerouslySetInnerHTML={{ __html: selectedRoute.map_embed_url }}
                      />
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Itinerary Details</h2>
                  <div
                    className="content-display prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: selectedRoute.itinerary_content || '<p>Itinerary information coming soon...</p>' }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
