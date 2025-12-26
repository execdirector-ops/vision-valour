import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Save } from 'lucide-react';
import ReactQuill from 'react-quill';
import { quillModules, quillFormats } from '../../lib/quillConfig';

interface PrivacyPolicyData {
  id: string;
  content: string;
  updated_at: string;
}

export default function ManagePrivacyPolicy() {
  const [policyData, setPolicyData] = useState<PrivacyPolicyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchPolicyData();
  }, []);

  async function fetchPolicyData() {
    try {
      const { data, error } = await supabase
        .from('privacy_policy')
        .select('*')
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setPolicyData(data);
        setContent(data.content);
      }
    } catch (error) {
      console.error('Error fetching privacy policy:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      const dataToSave = {
        content,
        updated_at: new Date().toISOString(),
      };

      if (policyData) {
        const { error } = await supabase
          .from('privacy_policy')
          .update(dataToSave)
          .eq('id', policyData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('privacy_policy')
          .insert([dataToSave]);
        if (error) throw error;
      }

      await fetchPolicyData();
      alert('Privacy policy updated successfully!');
    } catch (error) {
      console.error('Error saving privacy policy:', error);
      alert('Error saving privacy policy. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Privacy Policy</h2>
        <p className="text-gray-600">
          Manage your website's privacy policy content
        </p>
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Privacy Policy Content
          </label>
          <div className="bg-white rounded-lg border-2 border-gray-300">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={quillModules}
              formats={quillFormats}
              className="min-h-[400px]"
            />
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Your privacy policy content - explain how you collect, use, and protect user data
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all disabled:bg-gray-400"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Privacy Policy'}
          </button>
        </div>
      </div>

      {policyData && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Last Updated</h3>
          <p className="text-gray-600">
            {new Date(policyData.updated_at).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
