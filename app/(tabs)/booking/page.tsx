"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import BookingCalendar from "@/components/BookingCalendar";
import ReceiptUpload from "@/components/QRPayment";
import { Booking, Dress } from "@/types";
import { formatPrice, calculateTotalPrice, generateId } from "@/lib/utils";
import { eachDayOfInterval, isSameDay, format, startOfDay, addDays } from "date-fns";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary-600" /></div>}>
      <BookingPageContent />
    </Suspense>
  );
}

function BookingPageContent() {
  const searchParams = useSearchParams();
  const dressId = searchParams.get("dress");

  const [dresses, setDresses] = useState<Dress[]>([]);
  const [selectedDress, setSelectedDress] = useState<Dress | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [extraDays, setExtraDays] = useState(0);
  const [size, setSize] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [step, setStep] = useState<"select" | "details" | "receipt" | "confirmed">("select");
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/dresses")
      .then((res) => res.json())
      .then((data: Dress[]) => {
        setDresses(data);
        if (dressId) {
          const found = data.find((d) => d.id === dressId);
          if (found) setSelectedDress(found);
        }
        setLoading(false);
      });
  }, [dressId]);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const user = JSON.parse(stored);
      setUserName(user.name || "");
      setUserEmail(user.email || "");
    }
  }, []);

  useEffect(() => {
    if (!selectedDress) {
      setBookedDates([]);
      return;
    }

    fetch("/api/bookings")
      .then((res) => res.json())
      .then((data: Booking[]) => {
        const conflicts = data.filter(
          (booking) => booking.dressId === selectedDress.id && booking.status !== "cancelled"
        );

        const dates = conflicts.flatMap((booking) => {
          const start = startOfDay(new Date(booking.startDate));
          const end = startOfDay(new Date(booking.endDate));
          return eachDayOfInterval({ start, end });
        });

        setBookedDates(dates);
      })
      .catch(() => setBookedDates([]));
  }, [selectedDress]);

  useEffect(() => {
    if (!startDate) {
      setEndDate(null);
      return;
    }

    const rentalDays = 3 + extraDays;
    setEndDate(addDays(startDate, rentalDays - 1));
  }, [startDate, extraDays]);

  const BASE_RENTAL_PRICE = selectedDress ? selectedDress.price : 0;
  const EXTRA_DAY_PRICE = selectedDress ? selectedDress.additionalDayPrice ?? 0 : 0;

  const totalPrice = startDate && endDate
    ? BASE_RENTAL_PRICE + extraDays * EXTRA_DAY_PRICE
    : 0;

  const hasBookingConflict = Boolean(
    selectedDress && startDate && endDate && bookedDates.some((date) => {
      const day = startOfDay(date);
      return day >= startOfDay(startDate) && day <= startOfDay(endDate);
    })
  );

  const isThreeDayWindowValid = Boolean(
    selectedDress && startDate && endDate && endDate.getTime() - startDate.getTime() <= (2 + extraDays) * 24 * 60 * 60 * 1000
  );

  const handleContinue = () => {
    setError("");
    if (step === "select") {
      if (!selectedDress) {
        setError("Please select a dress");
        return;
      }
      if (!startDate || !endDate) {
        setError("Please select rental dates");
        return;
      }
      if (!isThreeDayWindowValid) {
        setError("Each booking is limited to 3 days only. Please choose a valid 3-day rental window.");
        return;
      }
      if (hasBookingConflict) {
        setError("This dress is already booked for one or more of the selected dates. Please choose another 3-day window.");
        return;
      }
      setStep("details");
    } else if (step === "details") {
      if (!size || !userName || !userEmail) {
        setError("Please fill in all fields");
        return;
      }
      setStep("receipt");
    }
  };

  const handlePaymentSuccess = async (receiptValue?: string) => {
    const newBookingId = crypto.randomUUID();
    setBookingId(newBookingId);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: newBookingId,
          dressId: selectedDress!.id,
          dressName: selectedDress!.name,
          userEmail,
          userName,
          startDate: startDate!.toISOString(),
          endDate: endDate!.toISOString(),
          totalPrice,
          status: "confirmed",
          paymentStatus: "paid",
          paymentReceipt: receiptValue || "receipt-uploaded",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(`Booking failed: ${errorData.details || errorData.error}`);
        console.error("Booking API error:", errorData);
        return;
      }

      // Store user info in localStorage so My Rentals can fetch their bookings
      localStorage.setItem("user", JSON.stringify({
        email: userEmail,
        name: userName,
      }));

      setStep("confirmed");
    } catch (err) {
      setError(`Error saving booking: ${err instanceof Error ? err.message : "Unknown error"}`);
      console.error("Booking error:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-secondary-900 mb-8">Book Your Dress</h1>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {["Select Dress", "Your Details", "Receipt", "Confirmed"].map((s, i) => {
          const steps = ["select", "details", "receipt", "confirmed"];
          const currentStep = steps.indexOf(step);
          return (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                i <= currentStep ? "bg-primary-600 text-white" : "bg-secondary-200 text-secondary-500"
              }`}>
                {i < currentStep ? <CheckCircle className="w-5 h-5" /> : i + 1}
              </div>
              <span className={`text-sm hidden sm:block ${i <= currentStep ? "text-secondary-900 font-medium" : "text-secondary-400"}`}>
                {s}
              </span>
              {i < 3 && <div className={`flex-1 h-1 rounded ${i < currentStep ? "bg-primary-600" : "bg-secondary-200"}`} />}
            </div>
          );
        })}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Step 1: Select Dress & Dates */}
      {step === "select" && (
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-secondary-200 p-6">
            <h2 className="text-lg font-semibold text-secondary-900 mb-4">1. Select a Dress</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-2">
              {dresses.map((dress) => (
                <button
                  key={dress.id}
                  onClick={() => setSelectedDress(dress)}
                  className={`text-left rounded-xl border-2 p-3 transition-all ${
                    selectedDress?.id === dress.id
                      ? "border-primary-500 bg-primary-50"
                      : "border-secondary-200 hover:border-secondary-300"
                  }`}
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
                    <Image src={dress.image} alt={dress.name} fill className="object-cover" />
                  </div>
                  <p className="font-medium text-sm text-secondary-900 line-clamp-1">{dress.name}</p>
                  <p className="text-primary-600 text-sm font-semibold">3-Day Rent Fee: {formatPrice(dress.price)}</p>
                  <p className="text-secondary-500 text-xs">Additional day: {formatPrice(dress.additionalDayPrice ?? 0)}</p>
                </button>
              ))}
            </div>
          </div>

          {selectedDress && (
            <div className="bg-white rounded-2xl border border-secondary-200 p-6">
              <h2 className="text-lg font-semibold text-secondary-900 mb-4">2. Select Rental Dates</h2>
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-700">Rental Length</p>
                  <p className="text-xs text-secondary-500">3-Day Rent Fee: {formatPrice(selectedDress.price)}. Additional day: {formatPrice(selectedDress.additionalDayPrice ?? 0)}.</p>
                </div>
                <label className="flex items-center gap-2 text-sm text-secondary-700">
                  <span>Extra days</span>
                  <select
                    value={extraDays}
                    onChange={(e) => setExtraDays(Number(e.target.value))}
                    className="px-3 py-2 bg-secondary-50 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value={0}>0</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                  </select>
                </label>
              </div>

              <BookingCalendar
                selectedStart={startDate}
                selectedEnd={endDate}
                onSelectStart={setStartDate}
                onSelectEnd={setEndDate}
                blockedDates={bookedDates}
                extraDays={extraDays}
              />
              {startDate && endDate && (
                <div className="mt-4 p-4 bg-primary-50 rounded-xl">
                  <p className="text-sm text-secondary-600">
                    <span className="font-semibold">Selected:</span>{" "}
                    {format(startDate, "MMM d, yyyy")} - {format(endDate, "MMM d, yyyy")}
                  </p>
                  <p className="text-sm text-secondary-600 mt-1">
                    <span className="font-semibold">Price:</span>{" "}
                    <span className="text-primary-600 font-bold">{formatPrice(totalPrice)}</span>
                    <span className="ml-2 text-xs text-secondary-500">
                      ({formatPrice(BASE_RENTAL_PRICE)} base + {extraDays} extra day{extraDays === 1 ? "" : "s"} @ {formatPrice(EXTRA_DAY_PRICE)})
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleContinue}
            className="w-full py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
          >
            Continue to Details
          </button>
        </div>
      )}

      {/* Step 2: Details */}
      {step === "details" && selectedDress && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-secondary-200 p-6">
            <h2 className="text-lg font-semibold text-secondary-900 mb-4">Rental Summary</h2>
            <div className="flex gap-4 mb-4">
              <div className="relative w-24 h-32 rounded-lg overflow-hidden flex-shrink-0">
                <Image src={selectedDress.image} alt={selectedDress.name} fill className="object-cover" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900">{selectedDress.name}</h3>
                <p className="text-sm text-secondary-500">{format(startDate!, "MMM d")} - {format(endDate!, "MMM d, yyyy")}</p>
                <p className="text-primary-600 font-bold mt-1">{formatPrice(totalPrice)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-secondary-200 p-6">
            <h2 className="text-lg font-semibold text-secondary-900 mb-4">Your Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Juan Dela Cruz"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Email</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="juan@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Size</label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select size</option>
                  {selectedDress.size.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setStep("select")}
              className="flex-1 py-3 bg-secondary-100 text-secondary-700 rounded-xl font-semibold hover:bg-secondary-200 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleContinue}
              className="flex-1 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
            >
              Proceed to Receipt Upload
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Receipt Upload */}
      {step === "receipt" && (
        <ReceiptUpload
          amount={totalPrice}
          bookingId={bookingId || "pending"}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* Step 4: Confirmed */}
      {step === "confirmed" && (
        <div className="bg-white rounded-2xl border border-secondary-200 p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-secondary-900 mb-2">Booking Confirmed!</h2>
          <p className="text-secondary-500 mb-6">
            Your booking <span className="font-mono font-semibold">#{bookingId}</span> has been confirmed.
            We've sent a confirmation email to {userEmail}.
          </p>
          <div className="bg-secondary-50 rounded-xl p-6 text-left max-w-md mx-auto mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-secondary-400">Dress</p>
                <p className="font-medium text-secondary-900">{selectedDress?.name}</p>
              </div>
              <div>
                <p className="text-secondary-400">Size</p>
                <p className="font-medium text-secondary-900">{size}</p>
              </div>
              <div>
                <p className="text-secondary-400">Start Date</p>
                <p className="font-medium text-secondary-900">{format(startDate!, "MMM d, yyyy")}</p>
              </div>
              <div>
                <p className="text-secondary-400">End Date</p>
                <p className="font-medium text-secondary-900">{format(endDate!, "MMM d, yyyy")}</p>
              </div>
              <div>
                <p className="text-secondary-400">Total Paid</p>
                <p className="font-medium text-primary-600">{formatPrice(totalPrice)}</p>
              </div>
              <div>
                <p className="text-secondary-400">Receipt</p>
                <p className="font-medium text-green-600">Uploaded</p>
              </div>
            </div>
          </div>
          <a
            href="/my-rentals"
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
          >
            View My Rentals
          </a>
        </div>
      )}
    </div>
  );
}
