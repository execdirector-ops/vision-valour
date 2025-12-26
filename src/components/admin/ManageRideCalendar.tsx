import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Calendar, Plus, Edit2, Trash2, Save, X } from 'lucide-react';

interface RideCalendarDay {
  id: string;
  day_number: number;
  date: string | null;
  title: string;
  description: string;
}

interface RideCalendarEvent {
  id: string;
  day_id: string;
  title: string;
  description: string;
  time: string;
  start_time: string | null;
  end_time: string | null;
  location: string;
  category: string[];
  order_index: number;
}

export default function ManageRideCalendar() {
  const [days, setDays] = useState<RideCalendarDay[]>([]);
  const [events, setEvents] = useState<RideCalendarEvent[]>([]);
  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<string | null>(null);
  const [addingEventForDay, setAddingEventForDay] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const [dayForm, setDayForm] = useState({
    date: '',
    title: '',
    description: '',
  });

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    time: '',
    start_time: '',
    end_time: '',
    location: '',
    category: ['other'] as string[],
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const { data: daysData, error: daysError } = await supabase
        .from('ride_calendar_days')
        .select('*')
        .order('day_number', { ascending: true });

      if (daysError) throw daysError;

      const { data: eventsData, error: eventsError } = await supabase
        .from('ride_calendar_events')
        .select('*')
        .order('start_time', { ascending: true, nullsFirst: false })
        .order('order_index', { ascending: true });

      if (eventsError) throw eventsError;

      setDays(daysData || []);
      setEvents(eventsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage('Error loading calendar data');
    } finally {
      setLoading(false);
    }
  }

  function startEditingDay(day: RideCalendarDay) {
    setEditingDay(day.id);
    setDayForm({
      date: day.date || '',
      title: day.title,
      description: day.description,
    });
  }

  function cancelEditingDay() {
    setEditingDay(null);
    setDayForm({ date: '', title: '', description: '' });
  }

  async function saveDay(dayId: string) {
    try {
      const { error } = await supabase
        .from('ride_calendar_days')
        .update({
          date: dayForm.date || null,
          title: dayForm.title,
          description: dayForm.description,
          updated_at: new Date().toISOString(),
        })
        .eq('id', dayId);

      if (error) throw error;

      setMessage('Day updated successfully!');
      setEditingDay(null);
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating day:', error);
      setMessage('Error updating day');
    }
  }

  function startAddingEvent(dayId: string) {
    setAddingEventForDay(dayId);
    setEventForm({
      title: '',
      description: '',
      time: '',
      start_time: '',
      end_time: '',
      location: '',
      category: ['other'],
    });
  }

  function cancelAddingEvent() {
    setAddingEventForDay(null);
    setEventForm({ title: '', description: '', time: '', start_time: '', end_time: '', location: '', category: ['other'] });
  }

  function toggleCategory(category: string) {
    setEventForm(prev => {
      const categories = prev.category;
      if (categories.includes(category)) {
        const newCategories = categories.filter(c => c !== category);
        return { ...prev, category: newCategories.length > 0 ? newCategories : ['other'] };
      } else {
        const newCategories = categories.includes('other') ? [category] : [...categories, category];
        return { ...prev, category: newCategories };
      }
    });
  }

  async function saveNewEvent(dayId: string) {
    if (!eventForm.title.trim()) {
      setMessage('Event title is required');
      return;
    }

    try {
      const dayEvents = events.filter(e => e.day_id === dayId);
      const maxOrder = dayEvents.length > 0 ? Math.max(...dayEvents.map(e => e.order_index)) : -1;

      const { error } = await supabase
        .from('ride_calendar_events')
        .insert({
          day_id: dayId,
          title: eventForm.title,
          description: eventForm.description,
          time: eventForm.time,
          start_time: eventForm.start_time || null,
          end_time: eventForm.end_time || null,
          location: eventForm.location,
          category: eventForm.category,
          order_index: maxOrder + 1,
        });

      if (error) throw error;

      setMessage('Event added successfully!');
      setAddingEventForDay(null);
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error adding event:', error);
      setMessage('Error adding event');
    }
  }

  function startEditingEvent(event: RideCalendarEvent) {
    setEditingEvent(event.id);
    setEventForm({
      title: event.title,
      description: event.description,
      time: event.time,
      start_time: event.start_time || '',
      end_time: event.end_time || '',
      location: event.location,
      category: event.category,
    });
  }

  function cancelEditingEvent() {
    setEditingEvent(null);
    setEventForm({ title: '', description: '', time: '', start_time: '', end_time: '', location: '', category: ['other'] });
  }

  async function updateEvent(eventId: string) {
    if (!eventForm.title.trim()) {
      setMessage('Event title is required');
      return;
    }

    try {
      const { error } = await supabase
        .from('ride_calendar_events')
        .update({
          title: eventForm.title,
          description: eventForm.description,
          time: eventForm.time,
          start_time: eventForm.start_time || null,
          end_time: eventForm.end_time || null,
          location: eventForm.location,
          category: eventForm.category,
          updated_at: new Date().toISOString(),
        })
        .eq('id', eventId);

      if (error) throw error;

      setMessage('Event updated successfully!');
      setEditingEvent(null);
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating event:', error);
      setMessage('Error updating event');
    }
  }

  async function deleteEvent(eventId: string) {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const { error } = await supabase
        .from('ride_calendar_events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      setMessage('Event deleted successfully!');
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting event:', error);
      setMessage('Error deleting event');
    }
  }

  function formatTime(timeString: string | null) {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  }

  function formatTimeRange(event: RideCalendarEvent) {
    if (event.start_time && event.end_time) {
      return `${formatTime(event.start_time)} - ${formatTime(event.end_time)}`;
    } else if (event.start_time) {
      return formatTime(event.start_time);
    } else if (event.time) {
      return event.time;
    }
    return '';
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="w-8 h-8 text-red-900" />
          <h2 className="text-2xl font-bold text-gray-900">Manage 13-Day Ride Calendar</h2>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {message}
        </div>
      )}

      <div className="space-y-6">
        {days.map((day) => {
          const dayEvents = events.filter(e => e.day_id === day.id);
          const isEditingThisDay = editingDay === day.id;

          return (
            <div key={day.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="bg-red-900 text-white px-6 py-4">
                <h3 className="text-xl font-bold">Day {day.day_number}</h3>
              </div>

              <div className="p-6 space-y-4">
                {isEditingThisDay ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date (Optional)
                      </label>
                      <input
                        type="date"
                        value={dayForm.date}
                        onChange={(e) => setDayForm({ ...dayForm, date: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={dayForm.title}
                        onChange={(e) => setDayForm({ ...dayForm, title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={dayForm.description}
                        onChange={(e) => setDayForm({ ...dayForm, description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => saveDay(day.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={cancelEditingDay}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        {day.date && (
                          <p className="text-sm text-gray-600 mb-1">
                            {new Date(day.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        )}
                        <h4 className="text-xl font-bold text-gray-900">{day.title}</h4>
                        {day.description && (
                          <p className="text-gray-700 mt-2">{day.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => startEditingDay(day)}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit Day
                      </button>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-semibold text-gray-900">Events for this day</h5>
                        <button
                          onClick={() => startAddingEvent(day.id)}
                          className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                        >
                          <Plus className="w-4 h-4" />
                          Add Event
                        </button>
                      </div>

                      {addingEventForDay === day.id && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Event Title *
                            </label>
                            <input
                              type="text"
                              value={eventForm.title}
                              onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Categories (Select one or more)
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              {['hotel', 'breakfast', 'luncheon', 'supper', 'dinner', 'gas_stop', 'rest_day', 'social', 'maintenance', 'other'].map((cat) => (
                                <label key={cat} className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={eventForm.category.includes(cat)}
                                    onChange={() => toggleCategory(cat)}
                                    className="rounded text-red-600 focus:ring-red-500"
                                  />
                                  <span className="text-sm text-gray-700 capitalize">{cat.replace('_', ' ')}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Start Time
                              </label>
                              <input
                                type="time"
                                value={eventForm.start_time}
                                onChange={(e) => setEventForm({ ...eventForm, start_time: e.target.value })}
                                min="08:00"
                                max="20:00"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                End Time
                              </label>
                              <input
                                type="time"
                                value={eventForm.end_time}
                                onChange={(e) => setEventForm({ ...eventForm, end_time: e.target.value })}
                                min="08:00"
                                max="20:00"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Location
                            </label>
                            <input
                              type="text"
                              value={eventForm.location}
                              onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Description
                            </label>
                            <textarea
                              value={eventForm.description}
                              onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => saveNewEvent(day.id)}
                              className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                            >
                              <Save className="w-4 h-4" />
                              Save Event
                            </button>
                            <button
                              onClick={cancelAddingEvent}
                              className="flex items-center gap-2 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm"
                            >
                              <X className="w-4 h-4" />
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {dayEvents.length > 0 ? (
                        <div className="space-y-3">
                          {dayEvents.map((event) => (
                            <div key={event.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              {editingEvent === event.id ? (
                                <div className="space-y-3">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Event Title *
                                    </label>
                                    <input
                                      type="text"
                                      value={eventForm.title}
                                      onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Categories (Select one or more)
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                      {['hotel', 'breakfast', 'luncheon', 'supper', 'dinner', 'gas_stop', 'rest_day', 'social', 'maintenance', 'other'].map((cat) => (
                                        <label key={cat} className="flex items-center gap-2 cursor-pointer">
                                          <input
                                            type="checkbox"
                                            checked={eventForm.category.includes(cat)}
                                            onChange={() => toggleCategory(cat)}
                                            className="rounded text-red-600 focus:ring-red-500"
                                          />
                                          <span className="text-sm text-gray-700 capitalize">{cat.replace('_', ' ')}</span>
                                        </label>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Start Time
                                      </label>
                                      <input
                                        type="time"
                                        value={eventForm.start_time}
                                        onChange={(e) => setEventForm({ ...eventForm, start_time: e.target.value })}
                                        min="08:00"
                                        max="20:00"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        End Time
                                      </label>
                                      <input
                                        type="time"
                                        value={eventForm.end_time}
                                        onChange={(e) => setEventForm({ ...eventForm, end_time: e.target.value })}
                                        min="08:00"
                                        max="20:00"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Location
                                    </label>
                                    <input
                                      type="text"
                                      value={eventForm.location}
                                      onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Description
                                    </label>
                                    <textarea
                                      value={eventForm.description}
                                      onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                                      rows={2}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    />
                                  </div>

                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => updateEvent(event.id)}
                                      className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                                    >
                                      <Save className="w-4 h-4" />
                                      Save
                                    </button>
                                    <button
                                      onClick={cancelEditingEvent}
                                      className="flex items-center gap-2 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm"
                                    >
                                      <X className="w-4 h-4" />
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                      <h6 className="font-bold text-gray-900">{event.title}</h6>
                                      {event.category.map((cat) => (
                                        <span key={cat} className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                                          {cat.replace('_', ' ')}
                                        </span>
                                      ))}
                                    </div>
                                    {event.description && (
                                      <p className="text-sm text-gray-700 mb-2 whitespace-pre-line">{event.description}</p>
                                    )}
                                    <div className="flex gap-4 text-sm text-gray-600">
                                      {formatTimeRange(event) && <span className="font-semibold text-red-900">{formatTimeRange(event)}</span>}
                                      {event.location && <span>{event.location}</span>}
                                    </div>
                                  </div>
                                  <div className="flex gap-2 ml-4">
                                    <button
                                      onClick={() => startEditingEvent(event)}
                                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                    >
                                      <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => deleteEvent(event.id)}
                                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic text-center py-4">No events for this day yet</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
