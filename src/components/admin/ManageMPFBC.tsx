import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Upload, Heart } from 'lucide-react';
import ReactQuill, { Quill } from 'react-quill';
import { uploadImage } from './ImageUploadHandler';

interface MPFBCData {
  id: string;
  title: string;
  hero_image_url: string | null;
  subtitle: string | null;
  website_url: string | null;
  facebook_url: string | null;
  content: string;
  updated_at: string;
}

interface ManageMPFBCProps {
  onSave?: () => void;
}

export default function ManageMPFBC({ onSave }: ManageMPFBCProps) {
  const [pageData, setPageData] = useState<MPFBCData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    hero_image_url: '',
    subtitle: '',
    website_url: '',
    facebook_url: '',
    content: '',
  });
  const contentQuillRef = useRef<ReactQuill>(null);

  useEffect(() => {
    fetchPageData();
  }, []);

  async function fetchPageData() {
    try {
      const { data, error } = await supabase
        .from('mpfbc_page')
        .select('*')
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setPageData(data);
        setEditForm({
          title: data.title || '',
          hero_image_url: data.hero_image_url || '',
          subtitle: data.subtitle || '',
          website_url: data.website_url || '',
          facebook_url: data.facebook_url || '',
          content: data.content || '',
        });
      }
    } catch (error) {
      console.error('Error fetching page data:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async () => {
    if (!pageData) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('mpfbc_page')
        .update({
          title: editForm.title,
          hero_image_url: editForm.hero_image_url,
          subtitle: editForm.subtitle,
          website_url: editForm.website_url,
          facebook_url: editForm.facebook_url,
          content: editForm.content,
          updated_at: new Date().toISOString(),
        })
        .eq('id', pageData.id);

      if (error) throw error;

      await fetchPageData();
      alert('Page updated successfully!');
      if (onSave) {
        onSave();
      }
    } catch (error) {
      console.error('Error updating page:', error);
      alert('Failed to update page. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleHeroImageUpload = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        setUploading(true);
        try {
          const imageUrl = await uploadImage(file);
          setEditForm({ ...editForm, hero_image_url: imageUrl });
        } catch (error) {
          alert('Failed to upload hero image. Please try again.');
        } finally {
          setUploading(false);
        }
      }
    };
  };

  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        setUploading(true);
        try {
          const imageUrl = await uploadImage(file);
          const quill = contentQuillRef.current?.getEditor();
          if (quill) {
            const range = quill.getSelection();
            const position = range?.index || 0;
            quill.insertEmbed(position, 'image', imageUrl);
            quill.setSelection(position + 1, 0);
          }
        } catch (error) {
          console.error('Upload error:', error);
          alert('Failed to upload image. Please try again.');
        } finally {
          setUploading(false);
        }
      }
    };
  }, []);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ align: [] }],
          ['link', 'image'],
          [{ color: [] }, { background: [] }],
          ['blockquote'],
          ['clean'],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      imageResize: {
        parchment: Quill.import('parchment'),
        modules: ['Resize', 'DisplaySize', 'Toolbar']
      }
    }),
    [imageHandler]
  );

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'align',
    'link',
    'image',
    'color',
    'background',
    'blockquote',
  ];

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
        <div className="flex items-center gap-3">
          <Heart className="w-8 h-8 text-red-900" />
          <h2 className="text-3xl font-bold text-gray-900">Manage MPFBC Page</h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Page Title</label>
            <input
              type="text"
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Subtitle
            </label>
            <input
              type="text"
              value={editForm.subtitle}
              onChange={(e) => setEditForm({ ...editForm, subtitle: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
              placeholder="Canada's only military charity dedicated to supporting blind and visually impaired children"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              MPFBC Website URL
            </label>
            <input
              type="url"
              value={editForm.website_url}
              onChange={(e) => setEditForm({ ...editForm, website_url: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
              placeholder="https://www.mpfbc.ca"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Facebook Page URL
            </label>
            <input
              type="url"
              value={editForm.facebook_url}
              onChange={(e) => setEditForm({ ...editForm, facebook_url: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
              placeholder="https://www.facebook.com/mpfbc"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Main Content
            </label>
            {uploading && (
              <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm text-blue-700 font-medium">Uploading image...</span>
              </div>
            )}
            <div className="bg-white rounded-lg border-2 border-gray-300">
              <ReactQuill
                ref={contentQuillRef}
                theme="snow"
                value={editForm.content}
                onChange={(content) => setEditForm({ ...editForm, content })}
                modules={modules}
                formats={formats}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 bg-red-900 text-white rounded-lg hover:bg-red-800 transition-colors disabled:opacity-50 flex items-center gap-2 font-semibold"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
