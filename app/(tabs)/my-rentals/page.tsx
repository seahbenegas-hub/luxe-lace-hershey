"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Booking } from "@/types";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import { Loader2, Calendar, Package, Clock, CheckCircle, XCircle } from "lucide-react";

export default function MyRentalsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const user = JSON.parse(stored);
      setUserEmail(user.email);
    }
  }, []);

  useEffect(() => {
    if (!userEmail) {
      setLoading(false);
      return;
    }
    fetch(`/api/bookings?email=${encodeURIComponent(userEmail)}`)
      .then((res) => res.json())
      .then((data) => {
        setBookings(data);
        setLoading(false);
      });
  }, [userEmail]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed": return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "pending": return <Clock className="w-5 h-5 text-yellow-500" />;
      case "completed": return <Package className="w-5 h-5 text-blue-500" />;
      case "cancelled": return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-secondary-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-50 text-green-700 border-green-200";
      case "pending": return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "completed": return "bg-blue-50 text-blue-700 border-blue-200";
      case "cancelled": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-secondary-50 text-secondary-700 border-secondary-200";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!userEmail) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <Package className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-secondary-900 mb-2">Sign In Required</h2>
        <p className="text-secondary-500">Please sign in to view your rental history.</p>
        <a href="/admin/login" className="inline-block mt-6 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors">
          Sign In
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900">My Rentals</h1>
        <p className="text-secondary-500 mt-1">Track and manage your dress rentals</p>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-secondary-200">
          <Package className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">No rentals yet</h3>
          <p className="text-secondary-500 mb-6">You haven't rented any dresses yet.</p>
          <a href="/catalog" className="inline-block px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors">
            Browse Catalog
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-2xl border border-secondary-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-secondary-900">{booking.dressName}</h3>
                      <p className="text-sm text-secondary-400 font-mono">#{booking.id}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-secondary-600">
                      <Calendar className="w-4 h-4 text-secondary-400" />
                      <span>{format(new Date(booking.startDate), "MMM d")} - {format(new Date(booking.endDate), "MMM d, yyyy")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-secondary-600">
                      <span className="font-semibold text-primary-600">{formatPrice(booking.totalPrice)}</span>
                      <span className="text-xs text-secondary-400">total</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-secondary-500">
                    <span className="flex items-center gap-1">
                      {getStatusIcon(booking.status)}
                      Payment: {booking.paymentStatus}
                    </span>
                    <span>Booked on {format(new Date(booking.createdAt), "MMM d, yyyy")}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
