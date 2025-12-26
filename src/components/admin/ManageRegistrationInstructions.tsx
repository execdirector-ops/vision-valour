import { useState, useEffect } from 'react';
import { supabase, RegistrationInstructions } from '../../lib/supabase';
import { Save, Plus, Trash2 } from 'lucide-react';

export default function ManageRegistrationInstructions() {
  const [instructions, setInstructions] = useState<RegistrationInstructions | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    title: 'How to Register',
    instructions: [''],
    note_text: '',
    contact_email: '',
  });

  useEffect(() => {
    fetchInstructions();
  }, []);

  async function fetchInstructions() {
    try {
      const { data, error } = await supabase
        .from('registration_instructions')
        .select('*')
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setInstructions(data);
        setFormData({
          title: data.title,
          instructions: data.instructions,
          note_text: data.note_text,
          contact_email: data.contact_email,
        });
      }
    } catch (error) {
      console.error('Error fetching instructions:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setMessage('');

    try {
      if (instructions) {
        const { error } = await supabase
          .from('registration_instructions')
          .update({
            title: formData.title,
            instructions: formData.instructions.filter(i => i.trim() !== ''),
            note_text: formData.note_text,
            contact_email: formData.contact_email,
            updated_at: new Date().toISOString(),
          })
          .eq('id', instructions.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('registration_instructions')
          .insert([{
            title: formData.title,
            instructions: formData.instructions.filter(i => i.trim() !== ''),
            note_text: formData.note_text,
            contact_email: formData.contact_email,
            is_active: true,
          }]);

        if (error) throw error;
      }

      setMessage('Instructions saved successfully!');
      fetchInstructions();
    } catch (error) {
      console.error('Error saving instructions:', error);
      setMessage('Error saving instructions. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  function addInstruction() {
    setFormData({
      ...formData,
      instructions: [...formData.instructions, ''],
    });
  }

  function removeInstruction(index: number) {
    const newInstructions = formData.instructions.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      instructions: newInstructions.length > 0 ? newInstructions : [''],
    });
  }

  function updateInstruction(index: number, value: string) {
    const newInstructions = [...formData.instructions];
    newInstructions[index] = value;
    setFormData({
      ...formData,
      instructions: newInstructions,
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-900"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Registration Instructions</h2>

      {message && (
        <div className={`mb-4 p-4 rounded-lg ${message.includes('Error') ? 'bg-red-50 text-red-900' : 'bg-green-50 text-green-900'}`}>
          {message}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Section Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-gray-900">
              Instructions (displayed in numbered order)
            </label>
            <button
              onClick={addInstruction}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Step
            </button>
          </div>
          <div className="space-y-3">
            {formData.instructions.map((instruction, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="flex-shrink-0 w-8 h-10 bg-blue-600 text-white rounded flex items-center justify-center font-bold mt-0.5">
                  {index + 1}
                </span>
                <input
                  type="text"
                  value={instruction}
                  onChange={(e) => updateInstruction(index, e.target.value)}
                  placeholder={`Step ${index + 1}`}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                />
                {formData.instructions.length > 1 && (
                  <button
                    onClick={() => removeInstruction(index)}
                    className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Note Text
          </label>
          <textarea
            value={formData.note_text}
            onChange={(e) => setFormData({ ...formData, note_text: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
            placeholder="Additional note or disclaimer text..."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Contact Email
          </label>
          <input
            type="email"
            value={formData.contact_email}
            onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
            placeholder="contact@example.com"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-red-900 text-white rounded-lg hover:bg-red-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Saving...' : 'Save Instructions'}
        </button>
      </div>
    </div>
  );
}
