import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Calendar as CalendarIcon, Coffee, Users, Utensils, Wine, Wrench, Fuel, Hotel, Croissant, ChevronDown, ChevronUp } from 'lucide-react';

interface RideCalendarDay {
  id: string;
  day_number: number;
  date: string | null;
  title: string;
  description: string;
  events: RideCalendarEvent[];
  isExpanded?: boolean;
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

export default function CalendarPage() {
  const [calendarDays, setCalendarDays] = useState<RideCalendarDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCalendarData() {
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

        const daysWithEvents = (daysData || []).map(day => ({
          ...day,
          events: (eventsData || []).filter(event => event.day_id === day.id),
          isExpanded: false
        }));

        setCalendarDays(daysWithEvents);
      } catch (error) {
        console.error('Error fetching calendar data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCalendarData();
  }, []);

  const toggleDay = (dayId: string) => {
    setCalendarDays(days =>
      days.map(day =>
        day.id === dayId ? { ...day, isExpanded: !day.isExpanded } : day
      )
    );
  };

  const expandAll = () => {
    setCalendarDays(days => days.map(day => ({ ...day, isExpanded: true })));
  };

  const collapseAll = () => {
    setCalendarDays(days => days.map(day => ({ ...day, isExpanded: false })));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'rest_day':
        return Coffee;
      case 'luncheon':
        return Utensils;
      case 'supper':
        return Utensils;
      case 'dinner':
        return Wine;
      case 'social':
        return Users;
      case 'maintenance':
        return Wrench;
      case 'gas_stop':
        return Fuel;
      case 'hotel':
        return Hotel;
      case 'breakfast':
        return Croissant;
      default:
        return CalendarIcon;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'rest_day':
        return 'Rest Day';
      case 'luncheon':
        return 'Luncheon';
      case 'supper':
        return 'Supper';
      case 'dinner':
        return 'Dinner';
      case 'social':
        return 'Social Event';
      case 'maintenance':
        return 'Maintenance';
      case 'gas_stop':
        return 'Gas Stop';
      case 'hotel':
        return 'Hotel';
      case 'breakfast':
        return 'Breakfast';
      default:
        return 'Event';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'rest_day':
        return 'bg-green-100 text-green-800';
      case 'luncheon':
        return 'bg-orange-100 text-orange-800';
      case 'supper':
        return 'bg-rose-100 text-rose-800';
      case 'dinner':
        return 'bg-red-100 text-red-800';
      case 'social':
        return 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return 'bg-gray-100 text-gray-800';
      case 'gas_stop':
        return 'bg-yellow-100 text-yellow-800';
      case 'hotel':
        return 'bg-purple-100 text-purple-800';
      case 'breakfast':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    // Parse date string as local time to avoid timezone shifts
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatTimeRange = (event: RideCalendarEvent) => {
    if (event.start_time && event.end_time) {
      return `${formatTime(event.start_time)} - ${formatTime(event.end_time)}`;
    } else if (event.start_time) {
      return formatTime(event.start_time);
    } else if (event.time) {
      return event.time;
    }
    return '';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="bg-gradient-to-r from-red-900 to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-4">13-Day Ride Calendar</h1>
          <p className="text-xl text-red-100">
            Join us at any point during our journey across Canada
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Hotel className="w-4 h-4 text-purple-800" />
              <span className="text-sm font-medium text-gray-700">Hotels</span>
            </div>
            <div className="flex items-center gap-2">
              <Croissant className="w-4 h-4 text-amber-800" />
              <span className="text-sm font-medium text-gray-700">Breakfasts</span>
            </div>
            <div className="flex items-center gap-2">
              <Utensils className="w-4 h-4 text-orange-800" />
              <span className="text-sm font-medium text-gray-700">Luncheons</span>
            </div>
            <div className="flex items-center gap-2">
              <Utensils className="w-4 h-4 text-rose-800" />
              <span className="text-sm font-medium text-gray-700">Suppers</span>
            </div>
            <div className="flex items-center gap-2">
              <Wine className="w-4 h-4 text-red-800" />
              <span className="text-sm font-medium text-gray-700">Dinners</span>
            </div>
            <div className="flex items-center gap-2">
              <Fuel className="w-4 h-4 text-yellow-800" />
              <span className="text-sm font-medium text-gray-700">Gas Stops</span>
            </div>
            <div className="flex items-center gap-2">
              <Coffee className="w-4 h-4 text-green-800" />
              <span className="text-sm font-medium text-gray-700">Rest Days</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-800" />
              <span className="text-sm font-medium text-gray-700">Social Events</span>
            </div>
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-gray-800" />
              <span className="text-sm font-medium text-gray-700">Maintenance</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mb-6">
          <button
            onClick={expandAll}
            className="px-4 py-2 bg-red-900 text-white rounded-lg hover:bg-red-800 transition-colors font-medium"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Collapse All
          </button>
        </div>

        <div className="grid gap-6">
          {calendarDays.map((day) => (
            <div
              key={day.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border-l-8 border-red-900"
            >
              <button
                onClick={() => toggleDay(day.id)}
                className="w-full p-6 md:p-8 text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-red-900 text-white px-4 py-2 rounded-full text-lg font-bold">
                        Day {day.day_number}
                      </span>
                      {day.date && (
                        <span className="text-xl font-semibold text-gray-900">
                          {formatDate(day.date)}
                        </span>
                      )}
                      {day.events.length > 0 && (
                        <span className="text-sm text-gray-600 font-medium">
                          ({day.events.length} {day.events.length === 1 ? 'event' : 'events'})
                        </span>
                      )}
                    </div>
                    {day.description && !day.isExpanded && (
                      <p className="text-gray-700 leading-relaxed line-clamp-2">
                        {day.description}
                      </p>
                    )}
                  </div>
                  <div className="ml-4">
                    {day.isExpanded ? (
                      <ChevronUp className="w-6 h-6 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-600" />
                    )}
                  </div>
                </div>
              </button>

              {day.isExpanded && (
                <div className="px-6 md:px-8 pb-6 md:pb-8">
                  {day.description && (
                    <p className="text-gray-700 leading-relaxed mb-6">
                      {day.description}
                    </p>
                  )}

                  {day.events.length > 0 ? (
                    <div className="space-y-4">
                      {day.events.map((event) => {
                        const primaryCategory = event.category[0] || 'other';
                        const CategoryIcon = getCategoryIcon(primaryCategory);

                        return (
                          <div
                            key={event.id}
                            className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                          >
                            <div className="flex items-start gap-3">
                              <CategoryIcon className="w-5 h-5 text-red-900 flex-shrink-0 mt-1" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                  <h4 className="font-bold text-gray-900">{event.title}</h4>
                                  {event.category.map((cat) => (
                                    <span
                                      key={cat}
                                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(cat)}`}
                                    >
                                      {getCategoryLabel(cat)}
                                    </span>
                                  ))}
                                </div>
                                {event.description && (
                                  <p className="text-gray-700 text-sm mb-2 whitespace-pre-line">{event.description}</p>
                                )}
                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                  {formatTimeRange(event) && (
                                    <span className="font-bold text-red-900 text-base">{formatTimeRange(event)}</span>
                                  )}
                                  {event.location && (
                                    <span className="font-medium">{event.location}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic text-center py-4">
                      No events scheduled for this day yet
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
