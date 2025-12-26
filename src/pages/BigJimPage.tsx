import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Award } from 'lucide-react';

interface PageData {
  title: string;
  content: string;
}

export default function BigJimPage() {
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
        .eq('slug', 'big-jim')
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
            <Award className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 text-white" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center sm:text-left text-white">
              {pageData?.title || 'Col. James Riley "Big Jim" Stone, CM, DSO, MC, CD'}
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-red-50 text-center sm:text-left">
            Canada's Most Respected Combat Leader and Founder of the MPFBC
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <img
                src="/Colonel_James_Riley_Stone.jpg"
                alt="Colonel James Riley Stone"
                className="w-full rounded-lg shadow-xl mb-6"
              />
              <img
                src="/plumsy.jpg"
                alt="Moira 'Plumsey' Stone"
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
                  Col. James Riley "Big Jim" Stone was one of Canada's most respected combat leaders and the founder of the Military Police Fund for Blind Children (MPFBC).
                </p>

                <p>
                  Born in Great Britain, he immigrated to Canada and settled in the Blueberry Mountain / Grande Prairie region as a young man. When the Second World War was declared in 1939, he rode his saddle horse Mini the 65 miles into Grande Prairie to enlist, becoming the 25th soldier to sign up from the area. He joined the Edmonton Regiment, rose quickly through the ranks, and served with distinction in Sicily, Italy, and Northwest Europe, earning the Military Cross and the Distinguished Service Order (DSO) and bar for his leadership and courage.
                </p>

                <p>
                  After the Second World War, Stone returned to civilian life but maintained his military ties by commanding the Rocky Mountain Rangers, a militia regiment. When Canada raised a special force for the Korean War, he was selected to command the 2nd Battalion, Princess Patricia's Canadian Light Infantry (2PPCLI). Under his command, the battalion became a highly disciplined, hard‑trained unit that played a key role in Korea, including the Battle of Kapyong, where Stone earned a second bar to his DSO and cemented his reputation as a tough, no‑nonsense commander who looked after his troops.
                </p>

                <p>
                  The most personal chapter of his story came after Korea. While serving as Canadian Army Provost Marshal (head of the Military Police), his daughter Moira "Plumsey" Stone was diagnosed with cancer of the eye, which led to sudden blindness and, tragically, her death. During her illness, Col. Stone came into close contact with organizations trying to support blind children. He saw that many families had far fewer resources and opportunities than his own daughter had, and that lack of money often meant children went without even simple supports or experiences.
                </p>

                <p>
                  That realization affected him deeply. In 1957, determined to help blind children across Canada, he asked members of the Military Police to voluntarily contribute one or two dollars per year. From those small donations, he created what became the Military Police Fund for Blind Children (MPFBC), focused on helping blind and visually impaired children under the age of 13.
                </p>

                <p>
                  Over time, the Fund grew and was formally established as a charitable corporation under the Canada Corporations Act (Letters Patent issued October 18, 1976; Trust Agreement October 27, 1977). The MPFBC remains unique in Canada as the country's only military‑run charity, operated entirely by Military Police volunteers, both serving and retired. Local Military Police units across Canada raise funds and identify children and organizations that can benefit from the Fund's support.
                </p>

                <p>
                  Col. James Riley Stone passed away on November 24, 2005, at the age of 97. His legacy lives on through the Military Police Fund for Blind Children, the veterans who served under him, and the communities that continue to tell his story.
                </p>

                <p className="text-lg font-semibold text-red-900 mt-8">
                  Our Ride for Vision and Valour honours Col. James Riley "Big Jim" Stone and his daughter Moira "Plumsey" Stone by raising funds for the MPFBC and sharing their story with communities along the route.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
