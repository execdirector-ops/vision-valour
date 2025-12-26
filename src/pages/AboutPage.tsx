import { useEffect, useState } from 'react';
import { supabase, Page } from '../lib/supabase';
import { Target, Eye, Heart, Award, ChevronDown, ChevronUp } from 'lucide-react';

export default function AboutPage() {
  const [pages, setPages] = useState<{ [key: string]: Page }>({});
  const [loading, setLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    async function fetchPages() {
      try {
        const { data, error } = await supabase
          .from('pages')
          .select('*')
          .in('slug', ['mission', 'vision', 'values', 'cmta']);

        if (error) throw error;

        const pagesMap: { [key: string]: Page } = {};
        data?.forEach((page) => {
          pagesMap[page.slug] = page;
        });
        setPages(pagesMap);
      } catch (error) {
        console.error('Error fetching pages:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPages();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900"></div>
      </div>
    );
  }

  const toggleCard = (slug: string) => {
    setExpandedCards(prev => ({ ...prev, [slug]: !prev[slug] }));
  };

  const truncateContent = (content: string, maxParagraphs: number = 2) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;

    // Get all child elements
    const children = Array.from(tempDiv.children);

    // If content has 2 or fewer block elements, show it all
    if (children.length <= maxParagraphs) {
      return { truncated: content, needsTruncation: false };
    }

    // Take first N paragraphs/elements and add ellipsis
    const truncatedElements = children.slice(0, maxParagraphs);
    const truncatedHTML = truncatedElements.map(el => el.outerHTML).join('');

    return {
      truncated: truncatedHTML + '<p class="text-gray-500 italic">...</p>',
      needsTruncation: true
    };
  };

  const renderContent = (content: string, slug: string) => {
    const isExpanded = expandedCards[slug];
    const { truncated, needsTruncation } = truncateContent(content);

    return (
      <>
        <div
          className="content-display text-lg"
          dangerouslySetInnerHTML={{ __html: isExpanded ? content : truncated }}
        />
        {needsTruncation && (
          <button
            onClick={() => toggleCard(slug)}
            className="mt-4 flex items-center gap-2 text-red-900 font-semibold hover:text-red-700 transition-colors"
          >
            {isExpanded ? (
              <>
                Show Less <ChevronUp className="w-5 h-5" />
              </>
            ) : (
              <>
                Read More <ChevronDown className="w-5 h-5" />
              </>
            )}
          </button>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="bg-gradient-to-r from-red-900 to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-4">About Us</h1>
          <p className="text-xl text-red-100">
            Learn about our mission, vision, and the values that drive us forward
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border-t-4 border-red-900">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 bg-red-900 w-16 h-16 rounded-xl flex items-center justify-center">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {pages.mission?.title || 'Our Mission'}
                </h2>
                <div className="text-lg">
                  {renderContent(
                    pages.mission?.content ||
                      'To honor and support our veterans through community engagement and fundraising activities.',
                    'mission'
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border-t-4 border-red-800">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 bg-red-800 w-16 h-16 rounded-xl flex items-center justify-center">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {pages.vision?.title || 'Our Vision'}
                </h2>
                <div className="text-lg">
                  {renderContent(
                    pages.vision?.content ||
                      'A community where veterans receive the support and recognition they deserve.',
                    'vision'
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border-t-4 border-red-700">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 bg-red-700 w-16 h-16 rounded-xl flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {pages.values?.title || 'Our Values'}
                </h2>
                <div className="text-lg">
                  {renderContent(
                    pages.values?.content ||
                      'Honour, Community, Compassion, and Action drive everything we do.',
                    'values'
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">About the CMTA</h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border-t-4 border-amber-600">
              <div className="flex items-center gap-6 mb-6">
                <div className="bg-amber-600 w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">
                  {pages.cmta?.title || 'About the CMTA'}
                </h3>
              </div>
              <div className="text-gray-700 text-lg">
                {renderContent(
                  pages.cmta?.content ||
                    '<p>Information about the CMTA will go here.</p>',
                  'cmta'
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-gradient-to-br from-red-50 to-white rounded-2xl shadow-xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Join Our Community
          </h2>
          <p className="text-lg text-gray-700 text-center leading-relaxed max-w-3xl mx-auto mb-8">
            Whether you're a rider, a supporter, or someone who shares our passion for helping veterans,
            there's a place for you in our community. Together, we can make a lasting impact and honor
            those who have served our country with dedication and courage.
          </p>
          <div className="flex justify-center">
            <a
              href="https://www.facebook.com/groups/819884517486255"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-red-900 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-800 transition-all shadow-lg hover:shadow-xl"
            >
              Join Our Facebook Group
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
