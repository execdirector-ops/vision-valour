import { useEffect, useState } from 'react';
import { supabase, RegistrationInstructions } from '../lib/supabase';

export default function RegisterPage() {
  const [instructions, setInstructions] = useState<RegistrationInstructions | null>(null);
  const [registrationEmbedUrl, setRegistrationEmbedUrl] = useState<string>('https://www.zeffy.com/embed/donation-form/vision-and-valour-challenge');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [instructionsResult, embedUrlResult] = await Promise.all([
          supabase
            .from('registration_instructions')
            .select('*')
            .eq('is_active', true)
            .maybeSingle(),
          supabase
            .from('site_settings')
            .select('value')
            .eq('key', 'zeffy_fundraising_donation_embed')
            .maybeSingle()
        ]);

        if (instructionsResult.error) throw instructionsResult.error;
        setInstructions(instructionsResult.data);

        if (!embedUrlResult.error && embedUrlResult.data?.value) {
          setRegistrationEmbedUrl(embedUrlResult.data.value);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="bg-gradient-to-r from-red-900 to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-4">Event Registration</h1>
          <p className="text-xl text-red-100">
            Sign up to join us on our next ride
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {!loading && instructions && (
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{instructions.title}</h2>
            <div className="prose prose-lg max-w-none">
              <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-6 rounded-r-lg">
                <h3 className="text-xl font-bold text-blue-900 mb-3">Registration Instructions</h3>
                <ol className="space-y-3 text-gray-800">
                  {instructions.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
                <p className="text-gray-800">
                  <strong className="text-amber-900">Note:</strong> {instructions.note_text}{' '}
                  <a
                    href={`mailto:${instructions.contact_email}`}
                    className="text-amber-800 hover:text-amber-900 underline"
                  >
                    {instructions.contact_email}
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}

        {registrationEmbedUrl && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-4">
            <div style={{ position: 'relative', overflow: 'hidden', height: '450px', width: '100%' }}>
              <iframe
                title="Registration form powered by Zeffy"
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
                src={registrationEmbedUrl}
                allowPaymentRequest={true}
                allowTransparency={true}
              />
            </div>
          </div>
        )}

        {!registrationEmbedUrl && !loading && (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
            <p className="text-yellow-800 font-semibold">
              Registration form not configured. Please contact the site administrator.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
