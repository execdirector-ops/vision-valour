import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { quillModules, quillFormats } from '../../lib/quillConfig';
import { Save, Upload } from 'lucide-react';
import { uploadImage } from './ImageUploadHandler';

interface VisionValourRideData {
  id: string;
  title: string;
  hero_image_url: string | null;
  content: string;
}

export default function ManageVisionValourRide() {
  const [pageData, setPageData] = useState<VisionValourRideData | null>(null);
  const [title, setTitle] = useState('');
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchPageData();
  }, []);

  async function fetchPageData() {
    try {
      const { data, error } = await supabase
        .from('vision_valour_ride_page')
        .select('*')
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setPageData(data);
        setTitle(data.title);
        setHeroImageUrl(data.hero_image_url || '');
        setContent(data.content);
      }
    } catch (error) {
      console.error('Error fetching page data:', error);
      setMessage('Error loading page data');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setMessage('');

    try {
      const pageDataToSave = {
        title,
        hero_image_url: heroImageUrl || null,
        content,
        updated_at: new Date().toISOString(),
      };

      if (pageData) {
        const { error } = await supabase
          .from('vision_valour_ride_page')
          .update(pageDataToSave)
          .eq('id', pageData.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('vision_valour_ride_page')
          .insert([pageDataToSave]);

        if (error) throw error;
      }

      setMessage('Page saved successfully!');
      await fetchPageData();
    } catch (error) {
      console.error('Error saving page:', error);
      setMessage('Error saving page');
    } finally {
      setSaving(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file);
      setHeroImageUrl(url);
      setMessage('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage('Error uploading image');
    } finally {
      setUploading(false);
    }
  }

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
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Vision & Valour Ride Page</h2>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Page Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Vision & Valour Ride"
          />
        </div>

        <div>
          <label htmlFor="heroImage" className="block text-sm font-medium text-gray-700 mb-2">
            Hero Image URL
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="heroImage"
              value={heroImageUrl}
              onChange={(e) => setHeroImageUrl(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg or /image.jpg"
            />
            <label className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 cursor-pointer">
              <Upload className="w-4 h-4" />
              {uploading ? 'Uploading...' : 'Upload'}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
          {heroImageUrl && (
            <div className="mt-2">
              <img
                src={heroImageUrl}
                alt="Hero preview"
                className="max-h-32 rounded-lg border border-gray-200"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Page Content
          </label>
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={quillModules}
            formats={quillFormats}
            className="bg-white"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-red-900 text-white rounded-lg hover:bg-red-800 disabled:bg-gray-400 transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          {message && (
            <span className={`text-sm ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
              {message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
