import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Award, ExternalLink } from 'lucide-react';

interface Sponsor {
  id: string;
  name: string;
  logo_url: string;
  website_url: string;
  description: string;
  category: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSponsors() {
      try {
        const { data, error } = await supabase
          .from('sponsors')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true })
          .order('name', { ascending: true });

        if (error) throw error;
        setSponsors(data || []);
      } catch (error) {
        console.error('Error fetching sponsors:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSponsors();
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'operations':
        return 'border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100';
      case 'insurance':
        return 'border-green-400 bg-gradient-to-br from-green-50 to-green-100';
      case 'marketing':
        return 'border-purple-400 bg-gradient-to-br from-purple-50 to-purple-100';
      case 'chase_truck':
        return 'border-orange-400 bg-gradient-to-br from-orange-50 to-orange-100';
      case 'meals':
        return 'border-red-400 bg-gradient-to-br from-red-50 to-red-100';
      case 'swag':
        return 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category.toLowerCase()) {
      case 'operations':
        return 'Operations';
      case 'insurance':
        return 'Insurance';
      case 'marketing':
        return 'Marketing';
      case 'chase_truck':
        return 'Chase Truck / Rider Support';
      case 'meals':
        return 'Meal and Coffee Break';
      case 'swag':
        return 'Swag';
      default:
        return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };

  const groupedSponsors = sponsors.reduce((acc, sponsor) => {
    const category = sponsor.category || 'operations';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(sponsor);
    return acc;
  }, {} as Record<string, Sponsor[]>);

  const categoryOrder = ['operations', 'insurance', 'marketing', 'chase_truck', 'meals', 'swag'];
  const sortedCategories = Object.keys(groupedSponsors).sort((a, b) => {
    const aIndex = categoryOrder.indexOf(a.toLowerCase());
    const bIndex = categoryOrder.indexOf(b.toLowerCase());
    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
  });

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
            <Award className="w-12 h-12" />
            <h1 className="text-5xl font-bold">Our Sponsors</h1>
          </div>
          <p className="text-xl text-red-100">
            Thank you to our generous sponsors who make this ride possible
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {sponsors.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Sponsors Yet</h3>
            <p className="text-gray-600">
              Check back soon to see our amazing sponsors who support this cause.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {sortedCategories.map((category) => (
              <div key={category}>
                <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                  {getCategoryTitle(category)} Sponsors
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedSponsors[category].map((sponsor) => (
                    <div
                      key={sponsor.id}
                      className={`rounded-2xl shadow-lg p-6 border-4 ${getCategoryColor(
                        category
                      )} hover:shadow-2xl transition-all`}
                    >
                      {sponsor.logo_url && (
                        <div className="flex items-center justify-center mb-4 h-32">
                          <img
                            src={sponsor.logo_url}
                            alt={`${sponsor.name} logo`}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                        {sponsor.name}
                      </h3>
                      {sponsor.description && (
                        <div
                          className="text-gray-700 text-sm mb-4 prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: sponsor.description }}
                        />
                      )}
                      {sponsor.website_url && (
                        <a
                          href={sponsor.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 text-red-900 hover:text-red-700 font-semibold transition-colors"
                        >
                          Visit Website <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
