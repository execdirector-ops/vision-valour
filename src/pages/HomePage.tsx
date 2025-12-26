import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, Page } from '../lib/supabase';
import { Calendar, Users, FileText, Mail, X } from 'lucide-react';
import SocialShare from '../components/SocialShare';

export default function HomePage() {
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [newsletterEmbed, setNewsletterEmbed] = useState<string>('');
  const [fundraisingUrl, setFundraisingUrl] = useState<string>('');
  const [showFundraisingModal, setShowFundraisingModal] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [pageResult, newsletterResult, fundraisingResult] = await Promise.all([
          supabase.from('pages').select('*').eq('slug', 'home').maybeSingle(),
          supabase.from('site_settings').select('*').eq('key', 'zeffy_newsletter_embed').maybeSingle(),
          supabase.from('site_settings').select('*').eq('key', 'zeffy_fundraising_url').maybeSingle()
        ]);

        if (pageResult.error) throw pageResult.error;
        setPage(pageResult.data);

        if (!newsletterResult.error && newsletterResult.data) {
          setNewsletterEmbed(newsletterResult.data.value);
        }

        if (!fundraisingResult.error && fundraisingResult.data) {
          setFundraisingUrl(fundraisingResult.data.value);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900"></div>
      </div>
    );
  }

  return (
    <div>
      <section className="relative bg-gradient-to-br from-red-900 via-red-800 to-red-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                {page?.title || 'Ride for Vision & Valour'}
              </h1>
              <div className="text-xl md:text-2xl mb-8 text-red-100 leading-relaxed">
                {page?.content ? (
                  <div dangerouslySetInnerHTML={{ __html: page.content }} />
                ) : (
                  <p>Join us in our mission to ride with heart and inspire valour.</p>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  to="/register"
                  className="bg-white text-red-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-center"
                >
                  Register Now
                </Link>
                <Link
                  to="/about"
                  className="bg-red-800 border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-center"
                >
                  Learn More
                </Link>
              </div>
              <div className="mt-8 flex justify-center md:justify-start">
                <SocialShare
                  title="Ride for Vision & Valour 2026 - Join Our Journey"
                  description="Join us on an incredible motorcycle journey across Canada supporting veterans and vision-related causes."
                  hashtags={['RideForVisionAndValour', 'CMTA', 'VeteransSupport', 'CharityRide']}
                />
              </div>
            </div>
            <div className="flex-shrink-0">
              <img
                src="/Vision & Valour Logo.png"
                alt="Vision & Valour"
                className="w-64 h-64 md:w-80 md:h-80 object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Get Involved</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join our community and make a difference for veterans and vision-related causes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link
              to="/calendar"
              className="bg-gradient-to-br from-red-50 to-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-2 border border-red-100"
            >
              <div className="bg-red-900 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Events</h3>
              <p className="text-gray-600 leading-relaxed">
                Check out our upcoming rides and community events
              </p>
            </Link>

            <Link
              to="/register"
              className="bg-gradient-to-br from-red-50 to-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-2 border border-red-100"
            >
              <div className="bg-red-900 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Register</h3>
              <p className="text-gray-600 leading-relaxed">
                Sign up for our next ride and join our mission
              </p>
            </Link>

            <Link
              to="/documents"
              className="bg-gradient-to-br from-red-50 to-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-2 border border-red-100"
            >
              <div className="bg-red-900 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Documents</h3>
              <p className="text-gray-600 leading-relaxed">
                Access important documents, waivers, and information
              </p>
            </Link>

            <Link
              to="/contact"
              className="bg-gradient-to-br from-red-50 to-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-2 border border-red-100"
            >
              <div className="bg-red-900 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Contact</h3>
              <p className="text-gray-600 leading-relaxed">
                Get in touch with questions or to learn how you can help
              </p>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Impact</h2>
          <p className="text-xl text-gray-700 leading-relaxed mb-12">
            Every mile ridden, every dollar raised, and every connection made brings us closer to
            our goal of supporting blind children through the Military Police Fund for Blind Children.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-5xl font-bold text-red-900 mb-2">25</div>
              <div className="text-gray-600 font-semibold">Riders</div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-5xl font-bold text-red-900 mb-2">$27K</div>
              <div className="text-gray-600 font-semibold">Raised</div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-5xl font-bold text-red-900 mb-2">2026</div>
              <div className="text-gray-600 font-semibold">3rd Annual Ride</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Stay Connected</h2>
          <p className="text-xl text-gray-700 leading-relaxed mb-12">
            Sign up for our newsletter to receive updates about upcoming rides, events, and ways to support our mission.
          </p>
          <div className="bg-gray-50 p-8 rounded-xl shadow-lg">
            {newsletterEmbed ? (
              <div
                id="zeffy-newsletter-embed"
                className="zeffy-embed-container"
                dangerouslySetInnerHTML={{ __html: newsletterEmbed }}
              />
            ) : (
              <div className="text-gray-600">
                <p className="mb-2">Newsletter signup coming soon!</p>
                <p className="text-sm">Admin: Add your Zeffy form embed code in Settings</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {showFundraisingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative">
            <div className="bg-gradient-to-r from-red-900 to-red-800 text-white p-6 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold">Support Our Mission</h2>
                <p className="text-red-100 mt-1">Every donation makes a difference</p>
              </div>
              <button
                onClick={() => setShowFundraisingModal(false)}
                className="p-2 hover:bg-red-800 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 100px)' }}>
              {fundraisingUrl ? (
                <div style={{ position: 'relative', overflow: 'hidden', height: '600px', width: '100%' }}>
                  <iframe
                    title="Fundraising form powered by Zeffy"
                    style={{
                      position: 'absolute',
                      border: 0,
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      width: '100%',
                      height: '100%',
                    }}
                    src={fundraisingUrl}
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">
                    Fundraising form will be available soon!
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Admin: Add your Zeffy fundraising URL in Settings
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
