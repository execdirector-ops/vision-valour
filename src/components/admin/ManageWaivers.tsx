import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { FileText, Trash2, Eye, XCircle, Download } from 'lucide-react';

interface WaiverSubmission {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  age: number;
  motorcycle_make_model: string;
  has_passenger: boolean;
  passenger_full_name: string | null;
  created_at: string;
  payment_status: string;
  registration_fee_amount: number | null;
  passenger_fee_amount: number | null;
  packet_issued: boolean;
  admin_notes: string | null;
  date_of_birth: string;
  address: string;
  city_province_postal: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  license_plate: string;
  license_province: string;
  is_minor: boolean;
  parent_guardian_name: string | null;
  rider_signature: string;
  rider_signature_date: string;
  passenger_date_of_birth: string | null;
  passenger_age: number | null;
  passenger_address: string | null;
  passenger_city_province_postal: string | null;
  passenger_phone: string | null;
  passenger_email: string | null;
  passenger_emergency_contact_name: string | null;
  passenger_emergency_contact_phone: string | null;
  passenger_is_minor: boolean;
  passenger_parent_guardian_name: string | null;
  passenger_signature: string | null;
  passenger_signature_date: string | null;
}

export default function ManageWaivers() {
  const [waivers, setWaivers] = useState<WaiverSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWaiver, setSelectedWaiver] = useState<WaiverSubmission | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchWaivers();
  }, []);

  async function fetchWaivers() {
    try {
      const { data, error } = await supabase
        .from('waiver_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWaivers(data || []);
    } catch (error) {
      console.error('Error fetching waivers:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this waiver submission?')) return;

    try {
      const { error } = await supabase
        .from('waiver_submissions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchWaivers();
      if (selectedWaiver?.id === id) {
        setSelectedWaiver(null);
      }
    } catch (error) {
      console.error('Error deleting waiver:', error);
      alert('Error deleting waiver. Please try again.');
    }
  }

  async function handleUpdateStatus(id: string, status: string) {
    try {
      const { error } = await supabase
        .from('waiver_submissions')
        .update({ payment_status: status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      await fetchWaivers();
      if (selectedWaiver?.id === id) {
        setSelectedWaiver({ ...selectedWaiver, payment_status: status });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status. Please try again.');
    }
  }

  async function handleUpdatePacketStatus(id: string, issued: boolean) {
    try {
      const { error } = await supabase
        .from('waiver_submissions')
        .update({ packet_issued: issued, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      await fetchWaivers();
      if (selectedWaiver?.id === id) {
        setSelectedWaiver({ ...selectedWaiver, packet_issued: issued });
      }
    } catch (error) {
      console.error('Error updating packet status:', error);
      alert('Error updating packet status. Please try again.');
    }
  }

  async function handleUpdateNotes(id: string, notes: string) {
    try {
      const { error } = await supabase
        .from('waiver_submissions')
        .update({ admin_notes: notes, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      await fetchWaivers();
    } catch (error) {
      console.error('Error updating notes:', error);
      alert('Error updating notes. Please try again.');
    }
  }

  const exportToCSV = () => {
    const headers = [
      'Submission Date', 'Full Name', 'Email', 'Phone', 'Age', 'DOB',
      'Address', 'City/Province/Postal', 'Emergency Contact', 'Emergency Phone',
      'Motorcycle', 'License Plate', 'Province', 'Has Passenger',
      'Passenger Name', 'Passenger Age', 'Passenger Email', 'Passenger Phone',
      'Payment Status', 'Registration Fee', 'Passenger Fee', 'Packet Issued', 'Notes'
    ];

    const rows = waivers.map(w => [
      new Date(w.created_at).toLocaleString(),
      w.full_name,
      w.email,
      w.phone,
      w.age,
      w.date_of_birth,
      w.address,
      w.city_province_postal,
      w.emergency_contact_name,
      w.emergency_contact_phone,
      w.motorcycle_make_model,
      w.license_plate,
      w.license_province,
      w.has_passenger ? 'Yes' : 'No',
      w.passenger_full_name || '',
      w.passenger_age || '',
      w.passenger_email || '',
      w.passenger_phone || '',
      w.payment_status,
      w.registration_fee_amount || '',
      w.passenger_fee_amount || '',
      w.packet_issued ? 'Yes' : 'No',
      w.admin_notes || ''
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `waiver-submissions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredWaivers = filterStatus === 'all'
    ? waivers
    : waivers.filter(w => w.payment_status === filterStatus);

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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Waiver Submissions</h2>
          <p className="text-gray-600">
            {waivers.length} total submission{waivers.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-all"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'pending', 'paid', 'completed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
              filterStatus === status
                ? 'bg-red-900 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {status === 'all' && ` (${waivers.length})`}
            {status !== 'all' && ` (${waivers.filter(w => w.payment_status === status).length})`}
          </button>
        ))}
      </div>

      {selectedWaiver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8">
            <div className="bg-red-900 text-white p-6 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8" />
                <div>
                  <h3 className="text-2xl font-bold">{selectedWaiver.full_name}</h3>
                  <p className="text-red-100">Submitted: {new Date(selectedWaiver.created_at).toLocaleString()}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedWaiver(null)}
                className="text-white hover:bg-red-800 p-2 rounded-lg transition-all"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Payment Status</label>
                  <select
                    value={selectedWaiver.payment_status}
                    onChange={(e) => handleUpdateStatus(selectedWaiver.id, e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                    <input
                      type="checkbox"
                      checked={selectedWaiver.packet_issued}
                      onChange={(e) => handleUpdatePacketStatus(selectedWaiver.id, e.target.checked)}
                      className="w-4 h-4"
                    />
                    Participant Packet Issued
                  </label>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-bold text-gray-900 mb-3">Rider Information</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="font-semibold">Email:</span> {selectedWaiver.email}</div>
                  <div><span className="font-semibold">Phone:</span> {selectedWaiver.phone}</div>
                  <div><span className="font-semibold">Age:</span> {selectedWaiver.age}</div>
                  <div><span className="font-semibold">DOB:</span> {selectedWaiver.date_of_birth}</div>
                  <div className="col-span-2"><span className="font-semibold">Address:</span> {selectedWaiver.address}</div>
                  <div className="col-span-2"><span className="font-semibold">City/Province/Postal:</span> {selectedWaiver.city_province_postal}</div>
                  <div><span className="font-semibold">Emergency Contact:</span> {selectedWaiver.emergency_contact_name}</div>
                  <div><span className="font-semibold">Emergency Phone:</span> {selectedWaiver.emergency_contact_phone}</div>
                  <div className="col-span-2"><span className="font-semibold">Motorcycle:</span> {selectedWaiver.motorcycle_make_model}</div>
                  <div><span className="font-semibold">License Plate:</span> {selectedWaiver.license_plate}</div>
                  <div><span className="font-semibold">Province:</span> {selectedWaiver.license_province}</div>
                  {selectedWaiver.is_minor && (
                    <div className="col-span-2 bg-yellow-100 p-2 rounded">
                      <span className="font-semibold">Minor - Parent/Guardian:</span> {selectedWaiver.parent_guardian_name}
                    </div>
                  )}
                </div>
              </div>

              {selectedWaiver.has_passenger && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <h4 className="font-bold text-gray-900 mb-3">Passenger Information</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="col-span-2"><span className="font-semibold">Name:</span> {selectedWaiver.passenger_full_name}</div>
                    <div><span className="font-semibold">Age:</span> {selectedWaiver.passenger_age}</div>
                    <div><span className="font-semibold">DOB:</span> {selectedWaiver.passenger_date_of_birth}</div>
                    <div><span className="font-semibold">Email:</span> {selectedWaiver.passenger_email}</div>
                    <div><span className="font-semibold">Phone:</span> {selectedWaiver.passenger_phone}</div>
                    <div className="col-span-2"><span className="font-semibold">Address:</span> {selectedWaiver.passenger_address}</div>
                    <div className="col-span-2"><span className="font-semibold">City/Province/Postal:</span> {selectedWaiver.passenger_city_province_postal}</div>
                    <div><span className="font-semibold">Emergency Contact:</span> {selectedWaiver.passenger_emergency_contact_name}</div>
                    <div><span className="font-semibold">Emergency Phone:</span> {selectedWaiver.passenger_emergency_contact_phone}</div>
                    {selectedWaiver.passenger_is_minor && (
                      <div className="col-span-2 bg-yellow-100 p-2 rounded">
                        <span className="font-semibold">Minor - Parent/Guardian:</span> {selectedWaiver.passenger_parent_guardian_name}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Admin Notes</label>
                <textarea
                  value={selectedWaiver.admin_notes || ''}
                  onChange={(e) => setSelectedWaiver({ ...selectedWaiver, admin_notes: e.target.value })}
                  onBlur={(e) => handleUpdateNotes(selectedWaiver.id, e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                  rows={3}
                  placeholder="Add internal notes..."
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Rider Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Passenger
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredWaivers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No waiver submissions found
                  </td>
                </tr>
              ) : (
                filteredWaivers.map((waiver) => (
                  <tr key={waiver.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(waiver.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {waiver.full_name}
                      {waiver.is_minor && <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Minor</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {waiver.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {waiver.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {waiver.has_passenger ? (
                        <span className="text-green-600 font-semibold">Yes</span>
                      ) : (
                        <span className="text-gray-400">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        waiver.payment_status === 'completed' ? 'bg-green-100 text-green-800' :
                        waiver.payment_status === 'paid' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {waiver.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedWaiver(waiver)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(waiver.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
