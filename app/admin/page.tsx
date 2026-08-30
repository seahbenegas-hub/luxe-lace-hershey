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
  Edit3,
  Save,
  X,
  Trash2,
  Upload,
} from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [dresses, setDresses] = useState<Dress[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "bookings" | "inventory">("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingDressId, setEditingDressId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [inventoryError, setInventoryError] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [editForm, setEditForm] = useState<{
    name: string;
    description: string;
    price: string;
    image: string;
    sizeText: string;
    category: string;
    color: string;
    available: boolean;
  } | null>(null);

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
          fetch("/api/bookings", { cache: "no-store" }).then((r) => r.json()),
          fetch("/api/dresses", { cache: "no-store" }).then((r) => r.json()),
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
        fetch("/api/bookings", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/dresses", { cache: "no-store" }).then((r) => r.json()),
      ]);
      setBookings(bookingsData);
      setDresses(dressesData);
    } catch (error) {
      console.error("Failed to refresh data:", error);
    } finally {
      setLoading(false);
    }
  };

  const beginEditDress = (dress: Dress) => {
    setIsAddingNew(false);
    setEditingDressId(dress.id);
    setEditForm({
      name: dress.name,
      description: dress.description,
      price: String(dress.price),
      image: dress.image,
      sizeText: dress.size.join(", "),
      category: dress.category,
      color: dress.color,
      available: dress.available,
    });
  };

  const beginAddDress = () => {
    setEditingDressId(null);
    setIsAddingNew(true);
    setEditForm({
      name: "New Dress",
      description: "",
      price: "0",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop",
      sizeText: "XS, S, M, L",
      category: "New",
      color: "Neutral",
      available: true,
    });
  };

  const cancelEditDress = () => {
    setEditingDressId(null);
    setIsAddingNew(false);
    setEditForm(null);
  };

  const uploadDressImage = async (file: File) => {
    setInventoryError("");
    setImageUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/dress-image", { method: "POST", body: formData });
      const result = await res.json();

      if (!res.ok) {
        setInventoryError(result.error || "Failed to upload dress image");
        return;
      }

      setEditForm((current) => current ? { ...current, image: result.url } : current);
    } catch {
      setInventoryError("Failed to upload dress image");
    } finally {
      setImageUploading(false);
    }
  };

  const saveDressEdits = async () => {
    if (!editForm) return;
    setInventoryError("");

    const payload = {
      ...(isAddingNew ? {} : { id: editingDressId }),
      name: editForm.name.trim(),
      description: editForm.description.trim(),
      price: Number(editForm.price),
      image: editForm.image.trim(),
      size: editForm.sizeText
        .split(",")
        .map((size) => size.trim())
        .filter(Boolean),
      category: editForm.category.trim(),
      color: editForm.color.trim(),
      available: editForm.available,
      occasion: "General",
    };

    const method = isAddingNew ? "POST" : "PATCH";
    const res = await fetch("/api/dresses", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(isAddingNew ? payload : { id: editingDressId, updates: payload }),
    });

    if (!res.ok) {
      const result = await res.json().catch(() => null);
      setInventoryError(result?.error || "Failed to save dress");
      return;
    }

    const savedDress = await res.json();

    if (isAddingNew) {
      setDresses((prev) => [savedDress, ...prev]);
    } else {
      setDresses((prev) => prev.map((dress) => (dress.id === editingDressId ? { ...dress, ...savedDress } : dress)));
    }

    cancelEditDress();
  };

  const deleteDress = async (dressId: string) => {
    if (!confirm("Are you sure you want to delete this dress?")) {
      return;
    }

    setInventoryError("");
    const res = await fetch("/api/dresses", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: dressId }),
    });

    if (!res.ok) {
      const result = await res.json().catch(() => null);
      setInventoryError(result?.error || "Failed to delete dress");
      return;
    }

    setDresses((prev) => prev.filter((dress) => dress.id !== dressId));
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

  const deleteBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) {
      return;
    }

    const res = await fetch("/api/bookings", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: bookingId }),
    });

    if (!res.ok) {
      const result = await res.json().catch(() => null);
      alert(result?.error || "Failed to delete booking");
      return;
    }

    setBookings((prev) => prev.filter((booking) => booking.id !== bookingId));
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
                          <button
                            onClick={() => deleteBooking(booking.id)}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 rounded text-xs font-medium hover:bg-red-100"
                          >
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-secondary-900">Dress Inventory</h2>
              <button
                onClick={beginAddDress}
                className="px-3 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
              >
                + Add Dress
              </button>
            </div>

            {inventoryError && (
              <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{inventoryError}</p>
            )}

            {isAddingNew && editForm && (
              <div className="mb-6 rounded-xl border border-dashed border-primary-200 bg-primary-50 p-4 space-y-3">
                <div className="grid md:grid-cols-2 gap-3">
                  <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} placeholder="Dress name" className="p-2 border border-secondary-200 rounded-lg" />
                  <input value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} placeholder="Category" className="p-2 border border-secondary-200 rounded-lg" />
                  <input value={editForm.color} onChange={(e) => setEditForm({ ...editForm, color: e.target.value })} placeholder="Color" className="p-2 border border-secondary-200 rounded-lg" />
                  <input type="number" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} placeholder="Price" className="p-2 border border-secondary-200 rounded-lg" />
                  <input value={editForm.sizeText} onChange={(e) => setEditForm({ ...editForm, sizeText: e.target.value })} placeholder="Sizes: XS, S, M" className="md:col-span-2 p-2 border border-secondary-200 rounded-lg" />
                  <input value={editForm.image} onChange={(e) => setEditForm({ ...editForm, image: e.target.value })} placeholder="Image URL" className="md:col-span-2 p-2 border border-secondary-200 rounded-lg" />
                  <label className="md:col-span-2 flex items-center gap-2 p-2 border border-secondary-200 rounded-lg bg-white text-sm text-secondary-600 cursor-pointer">
                    <Upload className="w-4 h-4" />
                    {imageUploading ? "Uploading image..." : "Upload dress photo"}
                    <input
                      type="file"
                      accept="image/*"
                      disabled={imageUploading}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) uploadDressImage(file);
                      }}
                      className="sr-only"
                    />
                  </label>
                  <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} placeholder="Description" className="md:col-span-2 p-2 border border-secondary-200 rounded-lg min-h-[80px]" />
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-secondary-700">
                    <input type="checkbox" checked={editForm.available} onChange={(e) => setEditForm({ ...editForm, available: e.target.checked })} />
                    Available
                  </label>
                  <div className="flex gap-2">
                    <button onClick={saveDressEdits} disabled={imageUploading} className="inline-flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"> <Save className="w-4 h-4" /> Save Dress </button>
                    <button onClick={cancelEditDress} className="inline-flex items-center gap-1 px-3 py-2 bg-secondary-200 text-secondary-700 rounded-lg text-sm font-medium hover:bg-secondary-300"> <X className="w-4 h-4" /> Cancel </button>
                  </div>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-secondary-200">
                    <th className="text-left py-3 px-4 font-medium text-secondary-500">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-500">Category</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-500">Size</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-500">Image</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-500">Price/Day</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-500">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dresses.map((dress) => {
                    const isEditing = editingDressId === dress.id && editForm;

                    return (
                      <tr key={dress.id} className="border-b border-secondary-100 hover:bg-secondary-50 align-top">
                        <td className="py-3 px-4 font-medium text-secondary-900">
                          {isEditing ? (
                            <input
                              value={editForm.name}
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                              className="w-full p-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          ) : (
                            dress.name
                          )}
                        </td>
                        <td className="py-3 px-4 text-secondary-600">
                          {isEditing ? (
                            <input
                              value={editForm.category}
                              onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                              className="w-full p-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          ) : (
                            dress.category
                          )}
                        </td>
                        <td className="py-3 px-4 text-secondary-600">
                          {isEditing ? (
                            <input
                              value={editForm.sizeText}
                              onChange={(e) => setEditForm({ ...editForm, sizeText: e.target.value })}
                              className="w-full p-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          ) : (
                            dress.size.join(", ")
                          )}
                        </td>
                        <td className="py-3 px-4 text-secondary-600">
                          {isEditing ? (
                            <input
                              value={editForm.image}
                              onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                              className="w-full p-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          ) : (
                            <img src={dress.image} alt={dress.name} className="h-12 w-12 object-cover rounded-lg border border-secondary-200" />
                          )}
                        </td>
                        <td className="py-3 px-4 font-medium text-primary-600">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editForm.price}
                              onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                              className="w-24 p-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          ) : (
                            formatPrice(dress.price)
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {isEditing ? (
                            <label className="flex items-center gap-2 text-sm text-secondary-700">
                              <input
                                type="checkbox"
                                checked={editForm.available}
                                onChange={(e) => setEditForm({ ...editForm, available: e.target.checked })}
                              />
                              Available
                            </label>
                          ) : (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              dress.available ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                            }`}>
                              {dress.available ? "Available" : "Unavailable"}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {isEditing ? (
                            <div className="flex gap-2">
                              <button
                                onClick={saveDressEdits}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium hover:bg-green-100"
                              >
                                <Save className="w-3 h-3" /> Save
                              </button>
                              <button
                                onClick={cancelEditDress}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-secondary-100 text-secondary-700 rounded text-xs font-medium hover:bg-secondary-200"
                              >
                                <X className="w-3 h-3" /> Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <button
                                onClick={() => beginEditDress(dress)}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-primary-50 text-primary-700 rounded text-xs font-medium hover:bg-primary-100"
                              >
                                <Edit3 className="w-3 h-3" /> Edit
                              </button>
                              <button
                                onClick={() => deleteDress(dress.id)}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 rounded text-xs font-medium hover:bg-red-100"
                              >
                                <Trash2 className="w-3 h-3" /> Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
