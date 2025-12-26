import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Upload, Mountain } from 'lucide-react';
import ReactQuill, { Quill } from 'react-quill';
import { uploadImage } from './ImageUploadHandler';

interface BlueberryMountainData {
  id: string;
  title: string;
  hero_image_url: string | null;
  content: string;
  walk_details: string;
  col_stone_memorial_info: string;
  brochure_url: string;
  updated_at: string;
}

export default function ManageBlueberryMountain() {
  const [pageData, setPageData] = useState<BlueberryMountainData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageOptions, setImageOptions] = useState({
    alignment: 'none',
    width: 'medium',
    border: false,
    caption: '',
  });
  const [pendingImageUrl, setPendingImageUrl] = useState<string | null>(null);
  const [currentEditor, setCurrentEditor] = useState<'content' | 'details' | 'memorial'>('content');
  const [editForm, setEditForm] = useState({
    title: '',
    hero_image_url: '',
    content: '',
    walk_details: '',
    col_stone_memorial_info: '',
    brochure_url: '',
  });
  const contentQuillRef = useRef<ReactQuill>(null);
  const detailsQuillRef = useRef<ReactQuill>(null);
  const memorialQuillRef = useRef<ReactQuill>(null);

  useEffect(() => {
    fetchPageData();
  }, []);

  async function fetchPageData() {
    try {
      const { data, error } = await supabase
        .from('blueberry_mountain_page')
        .select('*')
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setPageData(data);
        setEditForm({
          title: data.title || '',
          hero_image_url: data.hero_image_url || '',
          content: data.content || '',
          walk_details: data.walk_details || '',
          col_stone_memorial_info: data.col_stone_memorial_info || '',
          brochure_url: data.brochure_url || '',
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
        .from('blueberry_mountain_page')
        .update({
          title: editForm.title,
          hero_image_url: editForm.hero_image_url,
          content: editForm.content,
          walk_details: editForm.walk_details,
          col_stone_memorial_info: editForm.col_stone_memorial_info,
          brochure_url: editForm.brochure_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', pageData.id);

      if (error) throw error;

      await fetchPageData();
      alert('Page updated successfully!');
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

  const handleContentImageUpload = useCallback((editor: 'content' | 'details' | 'memorial') => {
    setCurrentEditor(editor);
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
          setPendingImageUrl(imageUrl);
          setShowImageModal(true);
        } catch (error) {
          alert('Failed to upload image. Please try again.');
        } finally {
          setUploading(false);
        }
      }
    };
  }, []);

  const insertImageWithOptions = () => {
    if (!pendingImageUrl) return;

    const { alignment, width, border, caption } = imageOptions;
    const quillRef = currentEditor === 'content' ? contentQuillRef :
                     currentEditor === 'details' ? detailsQuillRef : memorialQuillRef;
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    const range = quill.getSelection();
    const position = range?.index || 0;

    // Insert the image using Quill's native method
    quill.insertEmbed(position, 'image', pendingImageUrl);

    // Wait a tick for the DOM to update, then style the image
    setTimeout(() => {
      const editor = quill.root;
      const images = editor.querySelectorAll('img');
      const img = images[images.length - 1] as HTMLImageElement; // Get the last inserted image

      if (img && img.src === pendingImageUrl) {
        // Add class for click handling
        img.classList.add('editable-image', 'uploaded-image');

        // Apply size
        let maxWidth = '400px';
        if (width === 'small') maxWidth = '200px';
        else if (width === 'large') maxWidth = '600px';
        else if (width === 'full') maxWidth = '100%';

        img.style.maxWidth = maxWidth;
        img.style.height = 'auto';
        img.style.borderRadius = '8px';

        // Apply alignment
        if (alignment === 'left') {
          img.style.float = 'left';
          img.style.marginRight = '20px';
          img.style.marginBottom = '16px';
          img.style.marginTop = '8px';
          img.style.clear = 'left';
        } else if (alignment === 'right') {
          img.style.float = 'right';
          img.style.marginLeft = '20px';
          img.style.marginBottom = '16px';
          img.style.marginTop = '8px';
          img.style.clear = 'right';
        } else if (alignment === 'center') {
          img.style.display = 'block';
          img.style.marginLeft = 'auto';
          img.style.marginRight = 'auto';
          img.style.marginTop = '16px';
          img.style.marginBottom = '16px';
        } else {
          img.style.marginTop = '16px';
          img.style.marginBottom = '16px';
        }

        // Apply border
        if (border) {
          img.style.border = '3px solid #991b1b';
          img.style.padding = '4px';
          img.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        }

        // Handle caption by wrapping in figure
        if (caption) {
          const figure = document.createElement('figure');
          figure.className = 'image-figure';
          figure.style.margin = '16px 0';

          if (alignment === 'left') {
            figure.style.float = 'left';
            figure.style.marginRight = '20px';
            figure.style.clear = 'left';
          } else if (alignment === 'right') {
            figure.style.float = 'right';
            figure.style.marginLeft = '20px';
            figure.style.clear = 'right';
          } else if (alignment === 'center') {
            figure.style.display = 'block';
            figure.style.marginLeft = 'auto';
            figure.style.marginRight = 'auto';
            figure.style.textAlign = 'center';
          }

          const figcaption = document.createElement('figcaption');
          figcaption.className = 'image-caption';
          figcaption.textContent = caption;
          figcaption.style.fontSize = '14px';
          figcaption.style.color = '#6b7280';
          figcaption.style.fontStyle = 'italic';
          figcaption.style.textAlign = 'center';
          figcaption.style.marginTop = '8px';
          figcaption.style.padding = '0 8px';

          img.parentNode?.insertBefore(figure, img);
          figure.appendChild(img);
          figure.appendChild(figcaption);
        }
      }
    }, 10);

    setShowImageModal(false);
    setPendingImageUrl(null);
    setImageOptions({ alignment: 'none', width: 'medium', border: false, caption: '' });
  };

  const handleImageClick = (event: React.MouseEvent, editor: 'content' | 'details' | 'memorial') => {
    const target = event.target as HTMLElement;
    if (target.tagName === 'IMG' && target.classList.contains('editable-image')) {
      event.preventDefault();
      event.stopPropagation();

      setCurrentEditor(editor);
      const img = target as HTMLImageElement;
      const imgStyle = img.style;

      // Determine current settings from inline styles and classes
      let currentAlignment = 'none';
      if (imgStyle.float === 'left' || img.classList.contains('float-left')) {
        currentAlignment = 'left';
      } else if (imgStyle.float === 'right' || img.classList.contains('float-right')) {
        currentAlignment = 'right';
      } else if (imgStyle.display === 'block' || img.classList.contains('center-image')) {
        currentAlignment = 'center';
      }

      let currentWidth = 'medium';
      const maxWidth = imgStyle.maxWidth || '';
      if (maxWidth.includes('200px') || img.classList.contains('img-small')) {
        currentWidth = 'small';
      } else if (maxWidth.includes('600px') || img.classList.contains('img-large')) {
        currentWidth = 'large';
      } else if (maxWidth.includes('100%') || img.classList.contains('img-full')) {
        currentWidth = 'full';
      }

      const currentBorder = imgStyle.border.includes('3px') || img.classList.contains('img-border');

      // Check if image is in a figure with caption
      const figure = img.closest('figure');
      const caption = figure?.querySelector('figcaption')?.textContent || '';

      setPendingImageUrl(img.src);
      setImageOptions({
        alignment: currentAlignment,
        width: currentWidth,
        border: currentBorder,
        caption: caption
      });
      setShowImageModal(true);

      const quillRef = editor === 'content' ? contentQuillRef :
                       editor === 'details' ? detailsQuillRef : memorialQuillRef;
      const quill = quillRef.current?.getEditor();
      if (quill) {
        const imgElement = figure || img;
        const blot = Quill.find(imgElement);
        if (blot) {
          const index = quill.getIndex(blot);
          quill.deleteText(index, 1);
        }
      }
    }
  };

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
          image: () => handleContentImageUpload('content'),
        },
      },
    }),
    [handleContentImageUpload]
  );

  const detailsModules = useMemo(
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
          image: () => handleContentImageUpload('details'),
        },
      },
    }),
    []
  );

  const memorialModules = useMemo(
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
          image: () => handleContentImageUpload('memorial'),
        },
      },
    }),
    []
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
          <Mountain className="w-8 h-8 text-red-900" />
          <h2 className="text-3xl font-bold text-gray-900">Manage Blueberry Mountain</h2>
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
              Hero Image URL (Banner)
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={editForm.hero_image_url}
                onChange={(e) => setEditForm({ ...editForm, hero_image_url: e.target.value })}
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                placeholder="https://example.com/hero-image.jpg"
              />
              <button
                onClick={handleHeroImageUpload}
                disabled={uploading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
            {editForm.hero_image_url && (
              <div className="mt-4">
                <img
                  src={editForm.hero_image_url}
                  alt="Hero preview"
                  className="max-w-md rounded-lg shadow-lg"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Main Content
            </label>
            <div className="bg-white rounded-lg border-2 border-gray-300" onClick={(e) => handleImageClick(e, 'content')}>
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

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Walk Details (Sidebar)
            </label>
            <div className="bg-white rounded-lg border-2 border-gray-300" onClick={(e) => handleImageClick(e, 'details')}>
              <ReactQuill
                ref={detailsQuillRef}
                theme="snow"
                value={editForm.walk_details}
                onChange={(walk_details) => setEditForm({ ...editForm, walk_details })}
                modules={detailsModules}
                formats={formats}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Memorial & Location Information
            </label>
            <p className="text-sm text-gray-600 mb-2">
              Add information about the Col Stone Memorial location and other details about Blueberry Mountain
            </p>
            <div className="bg-white rounded-lg border-2 border-gray-300" onClick={(e) => handleImageClick(e, 'memorial')}>
              <ReactQuill
                ref={memorialQuillRef}
                theme="snow"
                value={editForm.col_stone_memorial_info}
                onChange={(col_stone_memorial_info) => setEditForm({ ...editForm, col_stone_memorial_info })}
                modules={memorialModules}
                formats={formats}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Brochure Link
            </label>
            <p className="text-sm text-gray-600 mb-2">
              Link to the Blueberry Mountain brochure (e.g., from the Documents section)
            </p>
            <input
              type="url"
              value={editForm.brochure_url}
              onChange={(e) => setEditForm({ ...editForm, brochure_url: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
              placeholder="https://example.com/documents/brochure.pdf"
            />
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

      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Image Options</h3>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Alignment</label>
                <select
                  value={imageOptions.alignment}
                  onChange={(e) => setImageOptions({ ...imageOptions, alignment: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                >
                  <option value="none">None</option>
                  <option value="left">Left (text wraps right)</option>
                  <option value="right">Right (text wraps left)</option>
                  <option value="center">Center</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Width</label>
                <select
                  value={imageOptions.width}
                  onChange={(e) => setImageOptions({ ...imageOptions, width: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                >
                  <option value="small">Small (200px)</option>
                  <option value="medium">Medium (400px)</option>
                  <option value="large">Large (600px)</option>
                  <option value="full">Full Width</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={imageOptions.border}
                    onChange={(e) => setImageOptions({ ...imageOptions, border: e.target.checked })}
                    className="w-5 h-5 text-red-900 border-gray-300 rounded focus:ring-red-900"
                  />
                  <span className="text-sm font-semibold text-gray-900">Add border with shadow</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Caption (optional)</label>
                <input
                  type="text"
                  value={imageOptions.caption}
                  onChange={(e) => setImageOptions({ ...imageOptions, caption: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                  placeholder="Image caption"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowImageModal(false);
                  setPendingImageUrl(null);
                  setImageOptions({ alignment: 'none', width: 'medium', border: false, caption: '' });
                }}
                className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={insertImageWithOptions}
                className="flex-1 px-4 py-2 bg-red-900 text-white rounded-lg hover:bg-red-800 transition-colors"
              >
                Insert Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
