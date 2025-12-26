import { useEffect, useState } from 'react';
import { supabase, ContactSubmission } from '../../lib/supabase';
import { Mail, MailOpen, Trash2 } from 'lucide-react';

export default function ManageContacts() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  async function fetchContacts() {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  }

  const toggleRead = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ is_read: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      await fetchContacts();
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const { error } = await supabase.from('contact_submissions').delete().eq('id', id);
      if (error) throw error;
      await fetchContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900"></div>
      </div>
    );
  }

  const unreadCount = contacts.filter(c => !c.is_read).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Messages</h2>
        <p className="text-gray-600">
          View and manage contact form submissions
          {unreadCount > 0 && (
            <span className="ml-2 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
              {unreadCount} unread
            </span>
          )}
        </p>
      </div>

      {contacts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-600 text-lg">No messages yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={`border-2 rounded-xl p-6 ${
                contact.is_read ? 'border-gray-200 bg-white' : 'border-red-200 bg-red-50'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{contact.name}</h3>
                    {!contact.is_read && (
                      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">{contact.email}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    {new Date(contact.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => toggleRead(contact.id, contact.is_read)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all"
                  >
                    {contact.is_read ? (
                      <>
                        <Mail className="w-4 h-4" />
                        Unread
                      </>
                    ) : (
                      <>
                        <MailOpen className="w-4 h-4" />
                        Read
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
              <div className="border-t pt-4">
                <p className="text-sm font-semibold text-gray-900 mb-2">Subject: {contact.subject}</p>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">{contact.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
