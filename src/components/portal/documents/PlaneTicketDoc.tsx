import React from 'react';
import { ApplicantProfile } from '../../../types/portal';
import { Plane, Calendar, MapPin, User, CheckCircle2, QrCode, ShieldCheck, Clock, Luggage } from 'lucide-react';

interface DocumentProps {
  profile: ApplicantProfile;
}

export const PlaneTicketDoc: React.FC<DocumentProps> = ({ profile }) => {
  const ticketNo = profile.ticketNumber || 'QF-948201';
  const airline = profile.airlineName || 'Qantas Airways';
  const flightRoute = profile.flightRoute || 'London Heathrow (LHR) -> Perth International (PER)';

  return (
    <div className="bg-white text-gray-900 font-sans p-6 sm:p-10 max-w-4xl mx-auto border border-gray-300 shadow-sm relative overflow-hidden print:p-0 print:border-none">
      {/* Airline Header */}
      <div className="border-b-4 border-[#E0001B] pb-6 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#E0001B] text-white flex flex-col items-center justify-center font-bold text-xs rounded-lg shadow-sm">
            <Plane className="w-8 h-8 text-white -rotate-45" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#E0001B]">
              INTERNATIONAL FLIGHT TRAVEL ITINERARY & ELECTRONIC TICKET
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-gray-900">
              {airline} • Relocation Travel Booking
            </h1>
            <p className="text-xs text-gray-600">
              Approved Skilled Migration Transit Facility • Australian Customs Border Clearance
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[10px] uppercase font-bold text-gray-400">Electronic Ticket No</div>
          <div className="font-mono text-sm sm:text-base font-black text-[#E0001B]">
            {ticketNo}
          </div>
          <div className="text-[10px] text-emerald-700 font-bold mt-0.5 flex items-center justify-end gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>CONFIRMED / SEAT ALLOCATED</span>
          </div>
        </div>
      </div>

      {/* Flight Boarding Pass Style Card */}
      <div className="bg-[#FAF0F1] border-2 border-dashed border-[#E0001B]/40 rounded-xl p-6 mb-6 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3 md:col-span-2">
            <div className="text-xs uppercase font-bold text-gray-500">Passenger Details</div>
            <div className="text-xl font-black text-gray-900">{profile.fullName}</div>
            <div className="flex items-center gap-4 text-xs text-gray-700">
              <span><strong>Passport:</strong> {profile.documentNumber}</span>
              <span><strong>Visa Ref:</strong> {profile.referenceNumber}</span>
            </div>

            <div className="pt-3 border-t border-gray-200 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-gray-500 block">Flight Route</span>
                <span className="font-bold text-gray-900">{flightRoute}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Travel Date</span>
                <span className="font-bold text-gray-900">{profile.grantDate}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Baggage Allowance</span>
                <span className="font-bold text-gray-900">2x 32kg Checked + Cabin</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-gray-200 text-center">
            <QrCode className="w-20 h-20 text-gray-900 mb-2" />
            <span className="text-[10px] font-mono text-gray-600">ETKT-{ticketNo}</span>
            <span className="text-[10px] font-bold text-emerald-700 uppercase mt-1">DVS Verified</span>
          </div>
        </div>
      </div>

      {/* Booking Particulars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-6">
        <div className="p-4 border border-gray-300 rounded-lg bg-[#F8FAFC] space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-2">
            Passenger Credentials
          </span>
          <div className="flex justify-between py-1 border-b border-gray-200">
            <span className="text-gray-500">Passenger Name:</span>
            <span className="font-bold text-gray-900">{profile.fullName}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-200">
            <span className="text-gray-500">Nationality:</span>
            <span className="font-medium text-gray-900">{profile.nationality}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-200">
            <span className="text-gray-500">Assigned Corporate Sponsor:</span>
            <span className="font-medium text-gray-900">{profile.sponsorName}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-500">Arrival Destination:</span>
            <span className="font-medium text-gray-900">{profile.workLocation}</span>
          </div>
        </div>

        <div className="p-4 border border-gray-300 rounded-lg bg-[#F8FAFC] space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-2">
            Flight Logistics & Relocation Schedule
          </span>
          <div className="flex justify-between py-1 border-b border-gray-200">
            <span className="text-gray-500">Ticket Issue Reference:</span>
            <span className="font-mono font-bold text-gray-900">{ticketNo}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-200">
            <span className="text-gray-500">Visa Subclass:</span>
            <span className="font-medium text-gray-900">{profile.visaSubclass}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-200">
            <span className="text-gray-500">Airport Transfer & Quarantine:</span>
            <span className="font-medium text-emerald-700">Pre-Cleared for Entry</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-500">Travel Status:</span>
            <span className="font-bold text-emerald-800">Confirmed Booking</span>
          </div>
        </div>
      </div>

      {/* Security Seal */}
      <div className="p-4 bg-gray-50 border border-gray-300 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-[#E0001B] text-white flex items-center justify-center font-bold">
            <Plane className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-gray-900">Commercial Relocation Travel Authority</div>
            <div className="text-gray-500 text-[11px]">
              IATA Verified e-Ticket • Commonwealth Border Force Entry Authorization Attached
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
