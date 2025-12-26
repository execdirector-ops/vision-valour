import { useState, FormEvent } from 'react';
import { supabase } from '../lib/supabase';
import { CheckCircle, Phone, Mail } from 'lucide-react';

const ProtectedEmail = ({ user, domain, label }: { user: string; domain: string; label: string }) => {
  const email = `${user}@${domain}`;

  const handleClick = () => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <button
        onClick={handleClick}
        className="text-gray-600 hover:text-red-900 transition-colors text-left break-all"
        aria-label={`Email ${label}`}
      >
        {user}
        <span aria-hidden="true">@</span>
        {domain}
      </button>
    </div>
  );
};

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const { error } = await supabase.from('contact_submissions').insert([formData]);

      if (error) throw error;

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });

      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error('Error submitting contact form:', err);
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
          <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-red-100">
            Get in touch with us for questions, support, or to get involved
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a Message</h2>

            {success && (
              <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-6 rounded-lg flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-green-900">Message Sent!</h3>
                  <p className="text-green-800">We'll get back to you soon.</p>
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
                  Name *
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
                <label htmlFor="subject" className="block text-sm font-semibold text-gray-900 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-red-900 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-800 transition-all shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Have questions about our rides, want to get involved, or need more information?
                We'd love to hear from you. Reach out to us through this form or use the contact
                information below.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-red-900" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Phone</h3>
                    <a href="tel:+17809330182" className="text-gray-600 hover:text-red-900 transition-colors">780-933-0182</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-red-900" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Email</h3>
                    <div className="space-y-2">
                      <ProtectedEmail
                        user="ridecaptain"
                        domain="visionandvalour.ca"
                        label="Ride Captain"
                      />
                      <ProtectedEmail
                        user="exec.director"
                        domain="motorcycletourism.ca"
                        label="Executive Director"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-white rounded-2xl shadow-xl p-8 border-2 border-red-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Join Our Community</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Stay updated on upcoming events, news, and ways to support our mission.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                Follow us on social media and subscribe to our newsletter to be part of our
                growing community of riders and supporters.
              </p>
              <a
                href="https://www.facebook.com/groups/819884517486255"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-red-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-800 transition-all shadow-lg hover:shadow-xl"
              >
                Join Our Facebook Group
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
