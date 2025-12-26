import { useEffect, useState } from 'react';
import { Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function PrivacyPolicyPage() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<string>('');

  useEffect(() => {
    fetchPrivacyPolicy();
  }, []);

  async function fetchPrivacyPolicy() {
    try {
      const { data, error } = await supabase
        .from('privacy_policy')
        .select('*')
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setContent(data.content);
        setUpdatedAt(data.updated_at);
      }
    } catch (error) {
      console.error('Error fetching privacy policy:', error);
    } finally {
      setLoading(false);
    }
  }

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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <Shield className="w-12 h-12" />
            <h1 className="text-5xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-xl text-red-100">
            Your privacy and data protection information
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {content ? (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />

            {updatedAt && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Last updated: {new Date(updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Privacy Policy Not Available
            </h2>
            <p className="text-gray-600">
              Our privacy policy is currently being updated. Please check back soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
