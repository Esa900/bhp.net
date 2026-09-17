import React, { useState } from 'react';
import { ArrowRight, Calendar, Clock, MapPin, Download, ExternalLink, Check } from 'lucide-react';
import { UPCOMING_EVENTS } from '../data';
import { useAdminData } from '../context/AdminDataContext';

interface UpcomingEventsProps {
  onOpenCalendar?: () => void;
}

export const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ onOpenCalendar }) => {
  const { events } = useAdminData();
  const event = events[0] || UPCOMING_EVENTS[0];
  const [showOptions, setShowOptions] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  // Generate .ics calendar download for Outlook / Apple Calendar
  const handleDownloadIcs = () => {
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//BHP Group Limited//Events Calendar//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:bhp-operational-review-20261020@bhp.com',
      'SUMMARY:BHP Operational Review - Q1 FY2027',
      'DESCRIPTION:BHP Operational Review for the quarter ended 30 September 2026. Webcast and presentation accessible at https://www.bhp.com',
      'LOCATION:Melbourne, Australia / Webcast Online',
      'DTSTART:20261019T213000Z', // 08:30 AEST on 20 Oct 2026
      'DTEND:20261019T230000Z',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'BHP_Operational_Review_20_Oct_2026.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloaded(true);
    setTimeout(() => {
      setDownloaded(false);
      setShowOptions(false);
    }, 2000);
  };

  // Google Calendar URL
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    'BHP Operational Review for the quarter ended 30 September 2026'
  )}&dates=20261019T213000Z/20261019T230000Z&details=${encodeURIComponent(
    'BHP Operational Review for the quarter ended 30 September 2026. Official results and management briefing at https://www.bhp.com'
  )}&location=${encodeURIComponent('Webcast Online / BHP Global Head Office, Melbourne')}`;

  return (
    <section id="upcoming-events-section" className="bg-[#F8F9FA] py-12 sm:py-16">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8">
          <h2
            id="upcoming-events-title"
            className="text-[30px] sm:text-[38px] font-extrabold text-[#111315] tracking-tight"
          >
            Upcoming Events
          </h2>
          <button
            id="all-events-link"
            type="button"
            onClick={onOpenCalendar}
            className="inline-flex items-center gap-1.5 text-base font-bold text-[#111315] hover:text-[#F25C05] transition-colors group cursor-pointer"
          >
            <span>Events</span>
            <ArrowRight className="w-4 h-4 text-[#F25C05] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Event Card */}
        <div
          id={`event-card-${event.id}`}
          className="relative bg-white rounded-r-xs p-6 sm:p-8 lg:p-10 shadow-xs border-y border-r border-gray-200/80 flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          {/* Thick Left Orange Accent Line */}
          <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-[#F25C05] rounded-l-xs" />

          <div className="flex items-start sm:items-center gap-6 sm:gap-10">
            {/* Date Block */}
            <div className="flex flex-col items-center justify-center text-center shrink-0 pr-4 sm:pr-8 border-r border-gray-200">
              <span className="text-[44px] sm:text-[52px] font-black text-[#111315] leading-none tracking-tight">
                {event.day}
              </span>
              <span className="text-sm font-black text-[#111315] uppercase tracking-wider mt-0.5">
                {event.month}
              </span>
              <span className="text-sm font-medium text-gray-400">
                {event.year}
              </span>
            </div>

            {/* Event Description */}
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#111315] tracking-tight">
                {event.title}
              </h3>
              <p className="mt-1 text-sm sm:text-base text-[#55585E]">
                {event.description}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-500 font-medium">
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#F25C05]" />
                  {event.time}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#F25C05]" />
                  {event.location}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action with Calendar options */}
          <div className="relative md:self-center shrink-0 pt-2 md:pt-0">
            <button
              type="button"
              id="add-to-calendar-btn"
              onClick={() => setShowOptions(!showOptions)}
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 hover:border-[#F25C05] hover:text-[#F25C05] text-[#111315] text-xs font-bold uppercase tracking-wider transition-colors rounded-xs shadow-xs"
            >
              <Calendar className="w-4 h-4 text-[#F25C05]" />
              <span>Add to calendar</span>
            </button>

            {/* Calendar format dropdown */}
            {showOptions && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded shadow-xl py-2 z-20 animate-in fade-in zoom-in-95 duration-150">
                <a
                  href={googleCalendarUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setShowOptions(false)}
                  className="w-full px-4 py-2.5 text-left text-xs font-bold text-[#111315] hover:bg-gray-50 flex items-center justify-between"
                >
                  <span>Google Calendar</span>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                </a>

                <button
                  type="button"
                  onClick={handleDownloadIcs}
                  className="w-full px-4 py-2.5 text-left text-xs font-bold text-[#111315] hover:bg-gray-50 flex items-center justify-between border-t border-gray-100"
                >
                  <span>Outlook / Apple (.ics)</span>
                  {downloaded ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Download className="w-3.5 h-3.5 text-[#F25C05]" />}
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
