"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Booking, Dress } from "@/types";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  TrendingUp,
  LogOut,
  Loader2,
  Search,
  XCircle,
  CheckCircle,
  Clock,
  Package,
} from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [dresses, setDresses] = useState<Dress[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "bookings" | "inventory">("overview");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      router.push("/admin/login");
      return;
    }

    const validateAccess = async () => {
      try {
        const res = await fetch("/api/auth", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.push("/admin/login");
          return;
        }

        const payload = await res.json();
        const parsed = JSON.parse(user);

        if (payload.user?.role !== "admin" || parsed.role !== "admin") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.push("/");
          return;
        }

        Promise.all([
          fetch("/api/bookings").then((r) => r.json()),
          fetch("/api/dresses").then((r) => r.json()),
        ]).then(([b, d]) => {
          setBookings(b);
          setDresses(d);
          setLoading(false);
        });
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/admin/login");
      }
    };

    validateAccess();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/admin/login");
  };

  const refreshBookings = async () => {
    setLoading(true);
    try {
      const [bookingsData, dressesData] = await Promise.all([
        fetch("/api/bookings").then((r) => r.json()),
        fetch("/api/dresses").then((r) => r.json()),
      ]);
      setBookings(bookingsData);
      setDresses(dressesData);
    } catch (error) {
      console.error("Failed to refresh data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id: string, status: string) => {
    await fetch("/api/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: status as Booking["status"] } : b))
    );
  };

  const filteredBookings = bookings.filter(
    (b) =>
      b.dressName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalBookings: bookings.length,
    totalRevenue: bookings.filter((b) => b.paymentStatus === "paid").reduce((sum, b) => sum + b.totalPrice, 0),
    activeRentals: bookings.filter((b) => b.status === "confirmed").length,
    totalDresses: dresses.length,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending": return <Clock className="w-4 h-4 text-yellow-500" />;
      case "completed": return <Package className="w-4 h-4 text-blue-500" />;
      case "cancelled": return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const renderReceipt = (booking: Booking) => {
    if (!booking.paymentReceipt) {
      return <span className="text-xs text-secondary-400">No receipt</span>;
    }

    if (booking.paymentReceipt.startsWith("data:image/")) {
      return (
        <a href={booking.paymentReceipt} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2">
          <img src={booking.paymentReceipt} alt="Payment receipt" className="h-12 w-12 object-cover rounded border border-secondary-200" />
          <span className="text-xs text-primary-600 underline">View</span>
        </a>
      );
    }

    return (
      <a href={booking.paymentReceipt} target="_blank" rel="noreferrer" className="text-xs text-primary-600 underline">
        View receipt
      </a>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-secondary-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-6 h-6 text-primary-600" />
            <h1 className="text-lg font-bold text-secondary-900">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={refreshBookings}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <TrendingUp className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {[
            { id: "overview", label: "Overview", icon: LayoutDashboard },
            { id: "bookings", label: "Bookings", icon: ShoppingBag },
            { id: "inventory", label: "Inventory", icon: Package },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-primary-600 text-white"
                  : "bg-white text-secondary-600 hover:bg-secondary-100 border border-secondary-200"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Total Bookings", value: stats.totalBookings, icon: ShoppingBag, color: "bg-blue-50 text-blue-600" },
                { label: "Revenue", value: formatPrice(stats.totalRevenue), icon: TrendingUp, color: "bg-green-50 text-green-600" },
                { label: "Active Rentals", value: stats.activeRentals, icon: Clock, color: "bg-yellow-50 text-yellow-600" },
                { label: "Total Dresses", value: stats.totalDresses, icon: Package, color: "bg-purple-50 text-purple-600" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-2xl border border-secondary-200 p-6">
                  <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
                  <p className="text-sm text-secondary-500">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-secondary-200 p-6">
              <h2 className="text-lg font-semibold text-secondary-900 mb-4">Recent Bookings</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-secondary-200">
                      <th className="text-left py-3 px-4 font-medium text-secondary-500">ID</th>
                      <th className="text-left py-3 px-4 font-medium text-secondary-500">Dress</th>
                      <th className="text-left py-3 px-4 font-medium text-secondary-500">Customer</th>
                      <th className="text-left py-3 px-4 font-medium text-secondary-500">Dates</th>
                      <th className="text-left py-3 px-4 font-medium text-secondary-500">Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-secondary-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.slice(0, 5).map((booking) => (
                      <tr key={booking.id} className="border-b border-secondary-100 hover:bg-secondary-50">
                        <td className="py-3 px-4 font-mono text-xs text-secondary-400">{booking.id.slice(0, 8)}</td>
                        <td className="py-3 px-4 font-medium text-secondary-900">{booking.dressName}</td>
                        <td className="py-3 px-4 text-secondary-600">{booking.userName}</td>
                        <td className="py-3 px-4 text-secondary-500">
                          {format(new Date(booking.startDate), "MMM d")} - {format(new Date(booking.endDate), "MMM d")}
                        </td>
                        <td className="py-3 px-4 font-medium text-primary-600">{formatPrice(booking.totalPrice)}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            booking.status === "confirmed" ? "bg-green-50 text-green-700" :
                            booking.status === "pending" ? "bg-yellow-50 text-yellow-700" :
                            booking.status === "completed" ? "bg-blue-50 text-blue-700" :
                            "bg-red-50 text-red-700"
                          }`}>
                            {getStatusIcon(booking.status)}
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Bookings */}
        {activeTab === "bookings" && (
          <div className="bg-white rounded-2xl border border-secondary-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-secondary-900">All Bookings</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-secondary-200">
                    <th className="text-left py-3 px-4 font-medium text-secondary-500">ID</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-500">Dress</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-500">Customer</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-500">Dates</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-500">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-500">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-secondary-100 hover:bg-secondary-50">
                      <td className="py-3 px-4 font-mono text-xs text-secondary-400">{booking.id.slice(0, 8)}</td>
                      <td className="py-3 px-4 font-medium text-secondary-900">{booking.dressName}</td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-secondary-900">{booking.userName}</p>
                          <p className="text-xs text-secondary-400">{booking.userEmail}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-secondary-500">
                        {format(new Date(booking.startDate), "MMM d")} - {format(new Date(booking.endDate), "MMM d, yyyy")}
                      </td>
                      <td className="py-3 px-4 font-medium text-primary-600">{formatPrice(booking.totalPrice)}</td>
                      <td className="py-3 px-4">{renderReceipt(booking)}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          booking.status === "confirmed" ? "bg-green-50 text-green-700" :
                          booking.status === "pending" ? "bg-yellow-50 text-yellow-700" :
                          booking.status === "completed" ? "bg-blue-50 text-blue-700" :
                          "bg-red-50 text-red-700"
                        }`}>
                          {getStatusIcon(booking.status)}
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          {booking.status === "pending" && (
                            <button
                              onClick={() => updateBookingStatus(booking.id, "confirmed")}
                              className="px-2 py-1 bg-green-50 text-green-600 rounded text-xs font-medium hover:bg-green-100"
                            >
                              Confirm
                            </button>
                          )}
                          {booking.status === "confirmed" && (
                            <button
                              onClick={() => updateBookingStatus(booking.id, "completed")}
                              className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium hover:bg-blue-100"
                            >
                              Complete
                            </button>
                          )}
                          {(booking.status === "pending" || booking.status === "confirmed") && (
                            <button
                              onClick={() => updateBookingStatus(booking.id, "cancelled")}
                              className="px-2 py-1 bg-red-50 text-red-600 rounded text-xs font-medium hover:bg-red-100"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Inventory */}
        {activeTab === "inventory" && (
          <div className="bg-white rounded-2xl border border-secondary-200 p-6">
            <h2 className="text-lg font-semibold text-secondary-900 mb-6">Dress Inventory</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-secondary-200">
                    <th className="text-left py-3 px-4 font-medium text-secondary-500">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-500">Category</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-500">Size</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-500">Color</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-500">Price/Day</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dresses.map((dress) => (
                    <tr key={dress.id} className="border-b border-secondary-100 hover:bg-secondary-50">
                      <td className="py-3 px-4 font-medium text-secondary-900">{dress.name}</td>
                      <td className="py-3 px-4 text-secondary-600">{dress.category}</td>
                      <td className="py-3 px-4 text-secondary-600">{dress.size.join(", ")}</td>
                      <td className="py-3 px-4 text-secondary-600">{dress.color}</td>
                      <td className="py-3 px-4 font-medium text-primary-600">{formatPrice(dress.price)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          dress.available ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                        }`}>
                          {dress.available ? "Available" : "Unavailable"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
