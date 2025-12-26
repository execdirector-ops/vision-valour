import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { FileText, Shield, CheckCircle, AlertCircle } from 'lucide-react';

export default function WaiverPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showPassenger, setShowPassenger] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    date_of_birth: '',
    age: '',
    address: '',
    city_province_postal: '',
    phone: '',
    email: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    motorcycle_make_model: '',
    license_plate: '',
    license_province: '',
    has_passenger: false,
    is_minor: false,
    parent_guardian_name: '',
    rider_signature: '',
    agreed_to_terms: false,
    agreed_to_media: false,
  });

  const [passengerData, setPassengerData] = useState({
    passenger_full_name: '',
    passenger_date_of_birth: '',
    passenger_age: '',
    passenger_address: '',
    passenger_city_province_postal: '',
    passenger_phone: '',
    passenger_email: '',
    passenger_emergency_contact_name: '',
    passenger_emergency_contact_phone: '',
    passenger_is_minor: false,
    passenger_parent_guardian_name: '',
    passenger_signature: '',
    passenger_agreed_to_terms: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.agreed_to_terms || !formData.agreed_to_media) {
      setError('You must agree to all terms and conditions to submit this waiver.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (formData.rider_signature.toLowerCase() !== formData.full_name.toLowerCase()) {
      setError('Your signature must match your full legal name exactly.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (formData.has_passenger) {
      if (!passengerData.passenger_agreed_to_terms) {
        setError('Passenger must agree to all terms and conditions.');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (passengerData.passenger_signature.toLowerCase() !== passengerData.passenger_full_name.toLowerCase()) {
        setError('Passenger signature must match their full legal name exactly.');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    setSubmitting(true);

    try {
      const submissionData: any = {
        full_name: formData.full_name,
        date_of_birth: formData.date_of_birth,
        age: parseInt(formData.age),
        address: formData.address,
        city_province_postal: formData.city_province_postal,
        phone: formData.phone,
        email: formData.email,
        emergency_contact_name: formData.emergency_contact_name,
        emergency_contact_phone: formData.emergency_contact_phone,
        motorcycle_make_model: formData.motorcycle_make_model,
        license_plate: formData.license_plate,
        license_province: formData.license_province,
        has_passenger: formData.has_passenger,
        is_minor: formData.is_minor,
        parent_guardian_name: formData.is_minor ? formData.parent_guardian_name : null,
        rider_signature: formData.rider_signature,
        rider_signature_date: new Date().toISOString(),
        parent_guardian_signature: formData.is_minor ? formData.parent_guardian_name : null,
        parent_guardian_signature_date: formData.is_minor ? new Date().toISOString() : null,
      };

      if (formData.has_passenger) {
        submissionData.passenger_full_name = passengerData.passenger_full_name;
        submissionData.passenger_date_of_birth = passengerData.passenger_date_of_birth;
        submissionData.passenger_age = parseInt(passengerData.passenger_age);
        submissionData.passenger_address = passengerData.passenger_address;
        submissionData.passenger_city_province_postal = passengerData.passenger_city_province_postal;
        submissionData.passenger_phone = passengerData.passenger_phone;
        submissionData.passenger_email = passengerData.passenger_email;
        submissionData.passenger_emergency_contact_name = passengerData.passenger_emergency_contact_name;
        submissionData.passenger_emergency_contact_phone = passengerData.passenger_emergency_contact_phone;
        submissionData.passenger_is_minor = passengerData.passenger_is_minor;
        submissionData.passenger_parent_guardian_name = passengerData.passenger_is_minor ? passengerData.passenger_parent_guardian_name : null;
        submissionData.passenger_signature = passengerData.passenger_signature;
        submissionData.passenger_signature_date = new Date().toISOString();
        submissionData.passenger_parent_guardian_signature = passengerData.passenger_is_minor ? passengerData.passenger_parent_guardian_name : null;
        submissionData.passenger_parent_guardian_signature_date = passengerData.passenger_is_minor ? new Date().toISOString() : null;
      }

      const { data: insertedData, error: submitError } = await supabase
        .from('waiver_submissions')
        .insert([submissionData])
        .select();

      if (submitError) {
        console.error('Supabase error details:', submitError);
        throw new Error(`Database error: ${submitError.message}`);
      }

      console.log('Waiver submitted successfully:', insertedData);

      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY;

        const emailPayload: any = {
          fullName: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          dateOfBirth: formData.date_of_birth,
          age: formData.age,
          address: formData.address,
          cityProvincePostal: formData.city_province_postal,
          emergencyContact: formData.emergency_contact_name,
          emergencyPhone: formData.emergency_contact_phone,
          motorcycleMakeModel: formData.motorcycle_make_model,
          licensePlate: formData.license_plate,
          licenseProvince: formData.license_province,
          hasPassenger: formData.has_passenger,
          isMinor: formData.is_minor,
          parentGuardianName: formData.is_minor ? formData.parent_guardian_name : null,
        };

        if (formData.has_passenger) {
          emailPayload.passengerInfo = {
            fullName: passengerData.passenger_full_name,
            email: passengerData.passenger_email,
            phone: passengerData.passenger_phone,
            dateOfBirth: passengerData.passenger_date_of_birth,
            age: passengerData.passenger_age,
            emergencyContact: passengerData.passenger_emergency_contact_name,
            emergencyPhone: passengerData.passenger_emergency_contact_phone,
            isMinor: passengerData.passenger_is_minor,
          };
        }

        await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-waiver-notification`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ waiverData: emailPayload }),
          }
        );
      } catch (emailError) {
        console.error('Error sending notification email:', emailError);
      }

      setSubmitted(true);
      window.scrollTo(0, 0);
    } catch (err) {
      console.error('Error submitting waiver:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`There was an error submitting your waiver: ${errorMessage}. Please try again or contact us for assistance.`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle className="w-16 h-16 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Waiver Submitted Successfully!</h1>
            <p className="text-lg text-gray-700 mb-6">
              Thank you for submitting your waiver for Ride for Vision & Valour 2026. We have received your information and will contact you with further details.
            </p>
            <p className="text-gray-600 mb-8">
              A confirmation has been recorded with your email: <strong>{formData.email}</strong>
            </p>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 text-left">
              <h3 className="font-bold text-gray-900 mb-2">Next Steps:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Check your email for confirmation details</li>
                <li>• Complete your registration payment if not already done</li>
                <li>• Review the event schedule and route information</li>
                <li>• Prepare your motorcycle and safety gear</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="bg-gradient-to-r from-red-900 to-red-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <FileText className="w-12 h-12" />
            <div>
              <h1 className="text-4xl font-bold">Online Waiver Form</h1>
              <p className="text-red-100 text-lg">Ride for Vision & Valour 2026</p>
            </div>
          </div>
          <p className="text-red-50">Event Dates: June 23 - July 5, 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-red-900 mb-1">Error</h3>
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl shadow-xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <Shield className="w-8 h-8 text-amber-700 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Waiver & Release Agreement</h2>
                <p className="text-gray-700">Please read carefully before proceeding</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 mb-6 max-h-96 overflow-y-auto border-2 border-gray-300">
              <div className="prose prose-sm max-w-none text-gray-800 space-y-4">
                <h3 className="font-bold text-lg">ASSUMPTION OF RISK AND RELEASE OF LIABILITY</h3>

                <p><strong>1. VOLUNTARY PARTICIPATION</strong></p>
                <p>I am voluntarily participating in the Ride for Vision & Valour 2026 organized by the Canadian Motorcycle Tourism Association. I understand that motorcycle riding involves inherent risks including serious injury, permanent disability, death, property damage, mechanical failure, road hazards, weather conditions, and actions of other riders or motorists.</p>

                <p><strong>2. ACKNOWLEDGMENT OF RISKS</strong></p>
                <p>I fully understand and acknowledge the risks associated with motorcycle riding and participation in this multi-day charity ride. I accept full responsibility for any and all risks of injury, death, or property damage that may occur during my participation.</p>

                <p><strong>3. RELEASE AND WAIVER OF LIABILITY</strong></p>
                <p>I hereby RELEASE, WAIVE, DISCHARGE, and COVENANT NOT TO SUE: Canadian Motorcycle Tourism Association (CMTA), Canadian Military Tourism Association, Ride for Vision & Valour, Military Police Fund for Blind Children, Veterans Memorial Gardens & Interpretive Centre, all Event sponsors and partners, and all officers, directors, employees, volunteers, and agents of these organizations.</p>
                <p>I release the Released Parties from ANY AND ALL LIABILITY, CLAIMS, DEMANDS, ACTIONS, AND CAUSES OF ACTION whatsoever arising out of or related to any loss, damage, injury, or death that may be sustained by me or my property during participation in the Event, WHETHER CAUSED BY THE NEGLIGENCE OF THE RELEASED PARTIES OR OTHERWISE.</p>

                <p><strong>4. INDEMNIFICATION</strong></p>
                <p>I agree to INDEMNIFY, DEFEND, AND HOLD HARMLESS the Released Parties from and against any and all claims, actions, suits, procedures, costs, expenses, damages, and liabilities, including attorney's fees, arising out of or related to my participation in the Event.</p>

                <p><strong>5. MEDICAL TREATMENT</strong></p>
                <p>I authorize the Released Parties to obtain or provide emergency medical treatment if necessary. I agree to be financially responsible for any medical costs incurred. The Released Parties assume no responsibility for any injury or damage that might result from such treatment.</p>

                <p><strong>6. INSURANCE AND COMPLIANCE</strong></p>
                <p>I certify that I possess a valid motorcycle operator's license, my motorcycle is properly registered and insured, my motorcycle is in safe operating condition, I will wear appropriate safety gear including a helmet, I will obey all traffic laws, and I will not operate my motorcycle under the influence of alcohol or drugs.</p>

                <p><strong>7. PHOTO, VIDEO, AND MEDIA RELEASE</strong></p>
                <p>I grant the Organizations the absolute right to photograph, film, videotape, and record my image, likeness, voice, and participation in the Event. I understand such media may be used for promotional materials, social media, fundraising, news releases, and educational purposes. I will receive no compensation and waive any right to inspect or approve the finished product.</p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  required
                  checked={formData.agreed_to_terms}
                  onChange={(e) => setFormData({ ...formData, agreed_to_terms: e.target.checked })}
                  className="w-5 h-5 text-red-900 border-2 border-gray-300 rounded focus:ring-2 focus:ring-red-900 mt-1"
                />
                <span className="text-sm text-gray-900">
                  <strong>I acknowledge and agree</strong> to the Assumption of Risk, Release of Liability, and Indemnification provisions. I understand that I am giving up substantial rights, including my right to sue. *
                </span>
              </label>

              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  required
                  checked={formData.agreed_to_media}
                  onChange={(e) => setFormData({ ...formData, agreed_to_media: e.target.checked })}
                  className="w-5 h-5 text-red-900 border-2 border-gray-300 rounded focus:ring-2 focus:ring-red-900 mt-1"
                />
                <span className="text-sm text-gray-900">
                  <strong>I consent</strong> to the Photo, Video, and Media Release provisions. I grant permission to use my image, likeness, and voice for promotional and educational purposes. *
                </span>
              </label>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Rider Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  required
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Age *
                </label>
                <input
                  type="number"
                  required
                  min="16"
                  max="99"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  City/Province/Postal Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city_province_postal}
                  onChange={(e) => setFormData({ ...formData, city_province_postal: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                  placeholder="e.g., Grande Prairie, AB T8V 1Y1"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Emergency Contact Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.emergency_contact_name}
                  onChange={(e) => setFormData({ ...formData, emergency_contact_name: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Emergency Contact Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.emergency_contact_phone}
                  onChange={(e) => setFormData({ ...formData, emergency_contact_phone: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Motorcycle Make/Model *
                </label>
                <input
                  type="text"
                  required
                  value={formData.motorcycle_make_model}
                  onChange={(e) => setFormData({ ...formData, motorcycle_make_model: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                  placeholder="e.g., Harley-Davidson Road King"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  License Plate *
                </label>
                <input
                  type="text"
                  required
                  value={formData.license_plate}
                  onChange={(e) => setFormData({ ...formData, license_plate: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Province/State *
                </label>
                <input
                  type="text"
                  required
                  value={formData.license_province}
                  onChange={(e) => setFormData({ ...formData, license_province: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                  placeholder="e.g., AB"
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.has_passenger}
                    onChange={(e) => {
                      setFormData({ ...formData, has_passenger: e.target.checked });
                      setShowPassenger(e.target.checked);
                    }}
                    className="w-5 h-5 text-red-900 border-2 border-gray-300 rounded focus:ring-2 focus:ring-red-900"
                  />
                  <span className="text-sm font-semibold text-gray-900">
                    I will be carrying a passenger
                  </span>
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.is_minor}
                    onChange={(e) => setFormData({ ...formData, is_minor: e.target.checked })}
                    className="w-5 h-5 text-red-900 border-2 border-gray-300 rounded focus:ring-2 focus:ring-red-900"
                  />
                  <span className="text-sm font-semibold text-gray-900">
                    I am under 18 years of age
                  </span>
                </label>
              </div>

              {formData.is_minor && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Parent/Guardian Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.parent_guardian_name}
                    onChange={(e) => setFormData({ ...formData, parent_guardian_name: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                  />
                </div>
              )}
            </div>
          </div>

          {showPassenger && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Passenger Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Passenger Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required={formData.has_passenger}
                    value={passengerData.passenger_full_name}
                    onChange={(e) => setPassengerData({ ...passengerData, passenger_full_name: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    required={formData.has_passenger}
                    value={passengerData.passenger_date_of_birth}
                    onChange={(e) => setPassengerData({ ...passengerData, passenger_date_of_birth: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Age *
                  </label>
                  <input
                    type="number"
                    required={formData.has_passenger}
                    min="1"
                    max="99"
                    value={passengerData.passenger_age}
                    onChange={(e) => setPassengerData({ ...passengerData, passenger_age: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    required={formData.has_passenger}
                    value={passengerData.passenger_address}
                    onChange={(e) => setPassengerData({ ...passengerData, passenger_address: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    City/Province/Postal Code *
                  </label>
                  <input
                    type="text"
                    required={formData.has_passenger}
                    value={passengerData.passenger_city_province_postal}
                    onChange={(e) => setPassengerData({ ...passengerData, passenger_city_province_postal: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required={formData.has_passenger}
                    value={passengerData.passenger_phone}
                    onChange={(e) => setPassengerData({ ...passengerData, passenger_phone: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required={formData.has_passenger}
                    value={passengerData.passenger_email}
                    onChange={(e) => setPassengerData({ ...passengerData, passenger_email: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Emergency Contact Name *
                  </label>
                  <input
                    type="text"
                    required={formData.has_passenger}
                    value={passengerData.passenger_emergency_contact_name}
                    onChange={(e) => setPassengerData({ ...passengerData, passenger_emergency_contact_name: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Emergency Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required={formData.has_passenger}
                    value={passengerData.passenger_emergency_contact_phone}
                    onChange={(e) => setPassengerData({ ...passengerData, passenger_emergency_contact_phone: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={passengerData.passenger_is_minor}
                      onChange={(e) => setPassengerData({ ...passengerData, passenger_is_minor: e.target.checked })}
                      className="w-5 h-5 text-red-900 border-2 border-gray-300 rounded focus:ring-2 focus:ring-red-900"
                    />
                    <span className="text-sm font-semibold text-gray-900">
                      Passenger is under 18 years of age
                    </span>
                  </label>
                </div>

                {passengerData.passenger_is_minor && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Passenger's Parent/Guardian Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={passengerData.passenger_parent_guardian_name}
                      onChange={(e) => setPassengerData({ ...passengerData, passenger_parent_guardian_name: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                    />
                  </div>
                )}

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Passenger Signature (Type Full Legal Name) *
                  </label>
                  <input
                    type="text"
                    required={formData.has_passenger}
                    value={passengerData.passenger_signature}
                    onChange={(e) => setPassengerData({ ...passengerData, passenger_signature: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent font-serif text-xl"
                    placeholder="Type your full legal name"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    By typing your name, you are electronically signing this waiver
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      required={formData.has_passenger}
                      checked={passengerData.passenger_agreed_to_terms}
                      onChange={(e) => setPassengerData({ ...passengerData, passenger_agreed_to_terms: e.target.checked })}
                      className="w-5 h-5 text-red-900 border-2 border-gray-300 rounded focus:ring-2 focus:ring-red-900 mt-1"
                    />
                    <span className="text-sm text-gray-900">
                      <strong>Passenger Agreement:</strong> I have read and fully understand all terms and conditions of this waiver, release of liability, and media consent. I voluntarily agree to be bound by all provisions.
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Rider Signature</h2>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Type Your Full Legal Name to Sign *
              </label>
              <input
                type="text"
                required
                value={formData.rider_signature}
                onChange={(e) => setFormData({ ...formData, rider_signature: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent font-serif text-2xl"
                placeholder="Type your full legal name"
              />
              <p className="text-xs text-gray-600 mt-2">
                By typing your name above, you certify that you have read this Waiver, Release of Liability, and Media Consent form in its entirety, fully understand its terms, and acknowledge that you are signing this agreement freely and voluntarily. Your typed name serves as your legal electronic signature with the same legal effect as a handwritten signature.
              </p>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <p className="text-sm text-gray-800">
                <strong>Date of Signature:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={submitting || !formData.agreed_to_terms || !formData.agreed_to_media || !formData.rider_signature}
              className="bg-red-900 text-white px-12 py-4 rounded-lg font-bold text-lg hover:bg-red-800 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed shadow-xl"
            >
              {submitting ? 'Submitting...' : 'Submit Waiver'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
