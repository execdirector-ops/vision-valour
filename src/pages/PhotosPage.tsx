import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Camera, ExternalLink } from 'lucide-react';

interface Photo {
  id: string;
  title: string;
  description: string;
  image_url: string;
  photographer_name: string;
  event_date: string;
  category: string;
}

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  const flickrAlbum2025 = import.meta.env.VITE_FLICKR_ALBUM_2025_URL || 'https://www.flickr.com/photos/191950705@N03/albums/72177720327420736';
  const flickrAlbum2024 = import.meta.env.VITE_FLICKR_ALBUM_2024_URL || 'https://www.flickr.com/photos/191950705@N03/albums/72177720329469836';

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('is_published', true)
        .order('display_order', { ascending: true })
        .order('event_date', { ascending: false });

      if (error) throw error;
      setPhotos(data || []);
    } catch (err) {
      console.error('Error fetching photos:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="bg-gradient-to-r from-red-900 to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <Camera className="w-12 h-12" />
            <h1 className="text-5xl font-bold">Photo Gallery</h1>
          </div>
          <p className="text-xl text-red-100">
            Memories from our rides and events
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Ride for Vision & Valour 2025</h2>
            <p className="text-gray-700 mb-4 text-sm leading-relaxed">
              View photos from our 2025 ride. Experience the journey as we honor Col. Stone's legacy.
            </p>
            <a
              href={flickrAlbum2025}
              target="_blank"
              rel="noopener noreferrer"
              className="block mb-4"
            >
              <img
                src="https://live.staticflickr.com/31337/54643491451_3ee1fb4f28_b.jpg"
                alt="Ride for Vision & Valour 2025"
                className="w-full h-64 object-cover rounded-lg shadow-lg hover:shadow-2xl transition-all"
              />
            </a>
            <a
              href={flickrAlbum2025}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-red-900 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-red-800 transition-all shadow-lg hover:shadow-xl"
            >
              <ExternalLink className="w-4 h-4" />
              View 2025 Album
            </a>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">First Ride - 2024</h2>
            <p className="text-gray-700 mb-4 text-sm leading-relaxed">
              View photos from our inaugural ride. A memorable journey that started it all.
            </p>
            <a
              href={flickrAlbum2024}
              target="_blank"
              rel="noopener noreferrer"
              className="block mb-4"
            >
              <img
                src="https://live.staticflickr.com/65535/54833522307_5eb6d45aaf_h.jpg"
                alt="1st Ride for Vision & Valour"
                className="w-full h-64 object-cover rounded-lg shadow-lg hover:shadow-2xl transition-all"
              />
            </a>
            <a
              href={flickrAlbum2024}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-red-900 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-red-800 transition-all shadow-lg hover:shadow-xl"
            >
              <ExternalLink className="w-4 h-4" />
              View 2024 Album
            </a>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-900"></div>
            <p className="mt-4 text-gray-600">Loading photos...</p>
          </div>
        ) : photos.length > 0 ? (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Photos</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {photos.map((photo) => (
                <div key={photo.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1">
                  <div className="aspect-w-16 aspect-h-12 bg-gray-200">
                    <img
                      src={photo.image_url}
                      alt={photo.title}
                      className="w-full h-64 object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{photo.title}</h3>
                    {photo.description && (
                      <p className="text-gray-600 mb-3 line-clamp-3">{photo.description}</p>
                    )}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      {photo.photographer_name && (
                        <span>Photo by {photo.photographer_name}</span>
                      )}
                      {photo.event_date && (
                        <span>{new Date(photo.event_date).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
