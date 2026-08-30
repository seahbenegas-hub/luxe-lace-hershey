"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import { Loader2, CheckCircle, Download } from "lucide-react";

interface QRPaymentProps {
  amount: number;
  bookingId: string;
  onSuccess: () => void;
}

export default function QRPayment({ amount, bookingId, onSuccess }: QRPaymentProps) {
  const [qrData, setQrData] = useState<string>("");
  const [status, setStatus] = useState<"loading" | "pending" | "paid">("loading");

  useEffect(() => {
    // Simulate QR code generation
    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, 200, 200);
      ctx.fillStyle = "black";
      // Draw a simple pattern simulating QR code
      for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 20; j++) {
          if (Math.random() > 0.5) {
            ctx.fillRect(i * 10, j * 10, 10, 10);
          }
        }
      }
      // Draw positioning squares
      ctx.fillRect(10, 10, 40, 40);
      ctx.fillRect(150, 10, 40, 40);
      ctx.fillRect(10, 150, 40, 40);
      ctx.clearRect(20, 20, 20, 20);
      ctx.clearRect(160, 20, 20, 20);
      ctx.clearRect(20, 160, 20, 20);
    }
    setQrData(canvas.toDataURL());
    setStatus("pending");

    // Simulate payment confirmation after 5 seconds
    const timer = setTimeout(() => {
      setStatus("paid");
      onSuccess();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onSuccess]);

  const downloadReceipt = () => {
    const receipt = `
Luxe & Lace — Hershey - PAYMENT RECEIPT
=============================
Booking ID: ${bookingId}
Amount: ${formatPrice(amount)}
Payment Method: QRPH
Status: PAID
Date: ${new Date().toLocaleString()}
=============================
Thank you for your business!
    `;
    const blob = new Blob([receipt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt-${bookingId}.txt`;
    a.click();
  };

  return (
    <div className="bg-white rounded-2xl border border-secondary-200 p-8 text-center">
      <h3 className="text-xl font-semibold text-secondary-900 mb-2">QRPH Payment</h3>
      <p className="text-secondary-500 mb-6">Scan the QR code to pay {formatPrice(amount)}</p>

      {status === "loading" && (
        <div className="flex justify-center py-8">
          <Loader2 className="w-12 h-12 animate-spin text-primary-600" />
        </div>
      )}

      {status === "pending" && qrData && (
        <div className="space-y-4">
          <div className="inline-block p-4 bg-white rounded-xl shadow-lg border border-secondary-200">
            <img src={qrData} alt="QR Code" className="w-48 h-48" />
          </div>
          <p className="text-sm text-secondary-400 animate-pulse">
            Waiting for payment confirmation...
          </p>
        </div>
      )}

      {status === "paid" && (
        <div className="space-y-4">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          <h4 className="text-lg font-semibold text-green-600">Payment Successful!</h4>
          <p className="text-secondary-500">Your booking has been confirmed.</p>
          <button
            onClick={downloadReceipt}
            className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-900 text-white rounded-lg text-sm font-medium hover:bg-secondary-800 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Receipt
          </button>
        </div>
      )}
    </div>
  );
}
