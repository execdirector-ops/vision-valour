import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Settings, AlertCircle, CheckCircle } from 'lucide-react';

interface SiteSetting {
  id: string;
  key: string;
  value: string;
  description: string;
}

export default function ManageSettings() {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<{ key: string; success: boolean; message: string } | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      console.log('Fetching site settings...');
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('key', { ascending: true });

      if (error) throw error;

      const settings = data || [];
      console.log(`Fetched ${settings.length} settings`);
      setSettings(settings);

      const values: Record<string, string> = {};
      settings.forEach(setting => {
        values[setting.key] = setting.value;
      });
      setEditValues(values);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async (key: string) => {
    setSaving(key);
    setSaveStatus(null);

    try {
      console.log(`Saving setting: ${key}`);
      console.log(`New value length: ${editValues[key]?.length || 0}`);

      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('You must be logged in to save settings. Please refresh and log in again.');
      }

      const { data, error } = await supabase
        .from('site_settings')
        .update({
          value: editValues[key],
          updated_at: new Date().toISOString(),
        })
        .eq('key', key)
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Failed to save: ${error.message}`);
      }

      if (!data || data.length === 0) {
        throw new Error('Update appeared successful but no rows were affected.');
      }

      console.log('Save successful:', data);
      await fetchSettings();
      setSaveStatus({ key, success: true, message: 'Setting saved successfully!' });

      setTimeout(() => {
        setSaveStatus(null);
      }, 3000);
    } catch (error) {
      console.error('Error updating setting:', error);
      const message = error instanceof Error ? error.message : 'Failed to save setting. Please try again.';
      setSaveStatus({ key, success: false, message });
    } finally {
      setSaving(null);
    }
  };

  const handleAddNewSetting = async () => {
    const key = prompt('Enter setting key (e.g., site_title, contact_email):');
    if (!key) return;

    const description = prompt('Enter setting description:');
    if (!description) return;

    try {
      const { error } = await supabase.from('site_settings').insert([
        {
          key,
          value: '',
          description,
        },
      ]);

      if (error) throw error;
      await fetchSettings();
    } catch (error) {
      console.error('Error adding setting:', error);
      alert('Failed to add setting. Please try again.');
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Site Settings</h2>
          <p className="text-gray-600">Configure site-wide settings and integrations</p>
        </div>
        <button
          onClick={handleAddNewSetting}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
        >
          Add New Setting
        </button>
      </div>

      {settings.length === 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <p className="text-yellow-800">
            No settings found. Click "Add New Setting" to create your first setting.
          </p>
        </div>
      )}

      {settings.map((setting) => (
        <div key={setting.id} className="border-2 border-gray-200 rounded-xl p-6 bg-white">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Settings className="w-5 h-5 text-red-900 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {setting.key.split('_').map(word =>
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{setting.description}</p>

                {setting.key === 'zeffy_newsletter_embed' && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-4">
                    <div className="text-sm text-blue-900">
                      <p className="font-semibold mb-2">How to get your Zeffy embed code:</p>
                      <ol className="list-decimal ml-4 space-y-1">
                        <li>Log in to your Zeffy account</li>
                        <li>Create or edit your newsletter signup form</li>
                        <li>Click "Share" or "Embed" button</li>
                        <li>Copy the entire embed code (usually starts with &lt;iframe or &lt;script&gt;)</li>
                        <li>Paste it in the text area below</li>
                      </ol>
                    </div>
                  </div>
                )}

                {setting.key === 'zeffy_fundraising_url' && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-4">
                    <div className="text-sm text-blue-900">
                      <p className="font-semibold mb-2">How to get your Zeffy fundraising URL:</p>
                      <ol className="list-decimal ml-4 space-y-1">
                        <li>Log in to your Zeffy account</li>
                        <li>Create or edit your fundraising/donation form</li>
                        <li>Click "Share" or "Embed" button</li>
                        <li>Copy the embed URL (e.g., https://www.zeffy.com/embed/donation-form/your-form-id)</li>
                        <li>Paste it in the text area below</li>
                      </ol>
                      <p className="mt-2 font-semibold">This form will appear on the home page "Support Us" card</p>
                    </div>
                  </div>
                )}

                {setting.key === 'zeffy_registration_embed' && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-4">
                    <div className="text-sm text-blue-900">
                      <p className="font-semibold mb-2">How to get your Zeffy registration form URL:</p>
                      <ol className="list-decimal ml-4 space-y-1">
                        <li>Log in to your Zeffy account</li>
                        <li>Create or edit your ticketing/registration form</li>
                        <li>Click "Share" or "Embed" button</li>
                        <li>Copy the embed URL (e.g., https://www.zeffy.com/embed/ticketing/your-form-id)</li>
                        <li>Paste it in the text area below</li>
                      </ol>
                      <p className="mt-2 font-semibold">This form will appear on the /register page</p>
                    </div>
                  </div>
                )}

                {setting.key === 'zeffy_fundraising_donation_embed' && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-4">
                    <div className="text-sm text-blue-900">
                      <p className="font-semibold mb-2">How to get your Zeffy donation form URL:</p>
                      <ol className="list-decimal ml-4 space-y-1">
                        <li>Log in to your Zeffy account</li>
                        <li>Create or edit your donation form</li>
                        <li>Click "Share" or "Embed" button</li>
                        <li>Copy the embed URL (e.g., https://www.zeffy.com/embed/donation-form/your-form-id)</li>
                        <li>Paste it in the text area below</li>
                      </ol>
                      <p className="mt-2 font-semibold">This form will appear on the /fundraising page</p>
                    </div>
                  </div>
                )}

                {setting.key === 'zeffy_fundraising_leaderboard_embed' && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-4">
                    <div className="text-sm text-blue-900">
                      <p className="font-semibold mb-2">How to get your Zeffy leaderboard URL:</p>
                      <ol className="list-decimal ml-4 space-y-1">
                        <li>Log in to your Zeffy account</li>
                        <li>Go to your fundraising campaign settings</li>
                        <li>Click "Share" or "Embed" button</li>
                        <li>Copy the leaderboard embed URL (e.g., https://www.zeffy.com/embed/leaderboard/your-campaign-id)</li>
                        <li>Paste it in the text area below</li>
                      </ol>
                      <p className="mt-2 font-semibold">This leaderboard will appear on the /fundraising page</p>
                    </div>
                  </div>
                )}

                <textarea
                  value={editValues[setting.key] || ''}
                  onChange={(e) => setEditValues({ ...editValues, [setting.key]: e.target.value })}
                  placeholder="Enter setting value"
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent font-mono text-sm"
                />

                {saveStatus && saveStatus.key === setting.key && (
                  <div className={`mt-4 p-4 rounded-lg border-l-4 flex items-start gap-3 ${
                    saveStatus.success
                      ? 'bg-green-50 border-green-600'
                      : 'bg-red-50 border-red-600'
                  }`}>
                    {saveStatus.success ? (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <p className={saveStatus.success ? 'text-green-800 font-semibold' : 'text-red-800 font-semibold'}>
                      {saveStatus.message}
                    </p>
                  </div>
                )}

                <button
                  onClick={() => handleSave(setting.key)}
                  disabled={saving === setting.key}
                  className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed mt-4"
                >
                  <Save className="w-4 h-4" />
                  {saving === setting.key ? 'Saving...' : 'Save Setting'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
