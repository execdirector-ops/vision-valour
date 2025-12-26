import { useState, FormEvent } from 'react';
import { supabase } from '../lib/supabase';
import { Video, CheckCircle, Upload } from 'lucide-react';

export default function VideosPage() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    url: '',
    description: '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const { error } = await supabase.from('media_submissions').insert([{
        ...formData,
        media_type: 'video'
      }]);

      if (error) throw error;

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        url: '',
        description: '',
      });

      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError('Failed to submit video. Please try again.');
      console.error('Error submitting video:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="bg-gradient-to-r from-red-900 to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <Video className="w-12 h-12" />
            <h1 className="text-5xl font-bold">Videos</h1>
          </div>
          <p className="text-xl text-red-100">
            Share your videos from our events
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <Upload className="w-8 h-8 text-red-900" />
            <h2 className="text-3xl font-bold text-gray-900">Share Your Videos</h2>
          </div>

          <p className="text-gray-700 text-lg mb-8">
            Have videos from our rides and events? Share them with us! Your submissions will be sent to our team at exec.director@motorcycletourism.ca
          </p>

          {success && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-6 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-green-900">Video Submitted!</h3>
                <p className="text-green-800">Thank you for sharing. We'll review your submission.</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
              <p className="text-red-900 font-semibold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="url" className="block text-sm font-semibold text-gray-900 mb-2">
                Video URL *
              </label>
              <input
                type="url"
                id="url"
                name="url"
                required
                value={formData.url}
                onChange={handleChange}
                placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent transition-all"
              />
              <p className="text-sm text-gray-600 mt-2">
                Upload your video to YouTube, Vimeo, or another video platform and paste the link here
              </p>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell us about this video (optional)"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-red-900 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-800 transition-all shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Video'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
