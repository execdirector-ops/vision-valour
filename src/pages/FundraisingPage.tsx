import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Heart, TrendingUp } from 'lucide-react';

export default function FundraisingPage() {
  const [donationEmbedUrl, setDonationEmbedUrl] = useState<string>('https://www.zeffy.com/embed/donation-form/vision-and-valour-challenge');
  const [leaderboardEmbedUrl, setLeaderboardEmbedUrl] = useState<string>('https://www.zeffy.com/embed/leaderboard/vision-and-valour-challenge');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEmbedUrls() {
      try {
        const [donationResult, leaderboardResult] = await Promise.all([
          supabase
            .from('site_settings')
            .select('value')
            .eq('key', 'zeffy_fundraising_donation_embed')
            .maybeSingle(),
          supabase
            .from('site_settings')
            .select('value')
            .eq('key', 'zeffy_fundraising_leaderboard_embed')
            .maybeSingle()
        ]);

        if (!donationResult.error && donationResult.data?.value) {
          setDonationEmbedUrl(donationResult.data.value);
        }

        if (!leaderboardResult.error && leaderboardResult.data?.value) {
          setLeaderboardEmbedUrl(leaderboardResult.data.value);
        }
      } catch (error) {
        console.error('Error fetching embed URLs:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchEmbedUrls();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="bg-gradient-to-r from-red-900 to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Heart className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-5xl font-bold mb-4">Support Our Mission</h1>
            <p className="text-xl text-red-100 max-w-3xl mx-auto">
              Become a part of our fundraising effort for the Ride for Vision & Valour in our efforts to support the Military Police Fund for Blind Children
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">About the Ride</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Ride for Vision & Valour is a 13-day motorcycle ride supporting the MP Fund for Blind Children.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Donations help blind and visually impaired kids through programs, services, and equipment that improve independence and quality of life.
            </p>
            <p className="text-gray-700 leading-relaxed font-semibold">
              Your donors WILL get a charitable tax receipt after the ride and all of the reconciliations have been done.
            </p>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">How to Participate</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">1) Register ($20 per rider)</h4>
                <p className="text-gray-700">
                  This confirms your spot on the team. You will get a tax receipt for this amount.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">2) Create your personal fundraiser</h4>
                <p className="text-gray-700">
                  After you register, Zeffy will give you your personal fundraising page/link.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">3) Set your fundraising goal</h4>
                <p className="text-gray-700">
                  You can base it on the number of days you're riding, set a competitive goal, or choose a goal that feels doable.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">4) Share your link</h4>
                <p className="text-gray-700">
                  Send your personal fundraising link to friends, family, coworkers, riding groups, and local businesses — donations made through your link count toward your total and the team total.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Fundraising Prizes</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Top Individual Fundraiser</h4>
                <p className="text-gray-700 leading-relaxed">
                  The top individual fundraiser will win a Ride for Vision & Valour lap blanket, handmade by Lorraine Kibblewhite (
                  <a
                    href="https://www.facebook.com/profile.php?id=100063354481727"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-900 hover:text-red-700 font-semibold underline"
                  >
                    Brilliant Snuggles
                  </a>
                  ), plus a digital badge and a feature in our social media group and on the Veterans Memorial Gardens Facebook page.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Top Fundraising Team</h4>
                <p className="text-gray-700 leading-relaxed">
                  The top fundraising team will receive digital badges and a feature in our social media group and on the Veterans Memorial Gardens Facebook page.
                </p>
              </div>
            </div>
          </div>

        </div>

        <div>
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-8 h-8 text-red-900" />
            <h2 className="text-3xl font-bold text-gray-900">Ready to Join?</h2>
          </div>
          <p className="text-gray-600 mb-8 text-lg">
            Register, set your goal, share your link, and ride with us for the kids.
          </p>
          {donationEmbedUrl && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-4">
              <div style={{ position: 'relative', overflow: 'hidden', height: '450px', width: '100%' }}>
                <iframe
                  title="Donation form powered by Zeffy"
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
                  src={donationEmbedUrl}
                  allowPaymentRequest={true}
                  allowTransparency={true}
                />
              </div>
            </div>
          )}
          {!donationEmbedUrl && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
              <p className="text-yellow-800 font-semibold">
                Donation form not configured. Please contact the site administrator.
              </p>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-8 h-8 text-red-900" />
            <h2 className="text-3xl font-bold text-gray-900">Fundraising Leaderboard</h2>
          </div>
          <p className="text-gray-600 mb-8 text-lg">
            See who's making the biggest impact in our community fundraising challenge!
          </p>
          {leaderboardEmbedUrl && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-4">
              <div style={{ position: 'relative', overflow: 'hidden', width: '100%', paddingTop: '240px' }}>
                <iframe
                  title="Leaderboard powered by Zeffy"
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
                  src={leaderboardEmbedUrl}
                  allowTransparency={true}
                />
              </div>
            </div>
          )}
          {!leaderboardEmbedUrl && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
              <p className="text-yellow-800 font-semibold">
                Leaderboard not configured. Please contact the site administrator.
              </p>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">About the Military Police Fund for Blind Children</h3>
          <p className="text-gray-700 leading-relaxed">
            The Military Police Fund for Blind Children provides critical support and resources to help blind children achieve independence and opportunity. Your generous donation directly impacts the lives of children who need our support.
          </p>
        </div>
      </div>
    </div>
  );
}
