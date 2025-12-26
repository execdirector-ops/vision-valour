import { useEffect, useState } from 'react';
import { supabase, Registration, Event } from '../../lib/supabase';
import { Download, Trash2 } from 'lucide-react';

export default function ManageRegistrations() {
  const [registrations, setRegistrations] = useState<(Registration & { event?: Event })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  async function fetchRegistrations() {
    try {
      const { data: regs, error: regsError } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (regsError) throw regsError;

      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('*');

      if (eventsError) throw eventsError;

      const eventsMap = new Map(events?.map(e => [e.id, e]) || []);
      const registrationsWithEvents = regs?.map(reg => ({
        ...reg,
        event: reg.event_id ? eventsMap.get(reg.event_id) : undefined,
      })) || [];

      setRegistrations(registrationsWithEvents);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this registration?')) return;

    try {
      const { error } = await supabase.from('registrations').delete().eq('id', id);
      if (error) throw error;
      await fetchRegistrations();
    } catch (error) {
      console.error('Error deleting registration:', error);
    }
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Event', 'First Name', 'Last Name', 'Email', 'Phone', 'Motorcycle', 'Emergency Contact'];
    const rows = registrations.map(reg => [
      new Date(reg.created_at).toLocaleDateString(),
      reg.event?.title || 'N/A',
      reg.first_name,
      reg.last_name,
      reg.email,
      reg.phone,
      reg.motorcycle_info,
      reg.emergency_contact,
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registrations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Registrations</h2>
          <p className="text-gray-600">View and manage event registrations</p>
        </div>
        {registrations.length > 0 && (
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all"
          >
            <Download className="w-5 h-5" />
            Export CSV
          </button>
        )}
      </div>

      {registrations.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-600 text-lg">No registrations yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {registrations.map((reg) => (
            <div key={reg.id} className="border-2 border-gray-200 rounded-xl p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      {reg.first_name} {reg.last_name}
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong className="text-gray-700">Email:</strong> {reg.email}
                      </p>
                      {reg.phone && (
                        <p>
                          <strong className="text-gray-700">Phone:</strong> {reg.phone}
                        </p>
                      )}
                      {reg.motorcycle_info && (
                        <p>
                          <strong className="text-gray-700">Motorcycle:</strong> {reg.motorcycle_info}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong className="text-gray-700">Event:</strong>{' '}
                      {reg.event?.title || 'N/A'}
                    </p>
                    <p>
                      <strong className="text-gray-700">Registered:</strong>{' '}
                      {new Date(reg.created_at).toLocaleString()}
                    </p>
                    {reg.emergency_contact && (
                      <p>
                        <strong className="text-gray-700">Emergency Contact:</strong>{' '}
                        {reg.emergency_contact}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(reg.id)}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-all ml-4"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
