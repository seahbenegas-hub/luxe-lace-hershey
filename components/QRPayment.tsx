"use client";

import { ChangeEvent, useState } from "react";
import { formatPrice } from "@/lib/utils";
import { CheckCircle, Upload, FileText } from "lucide-react";

interface QRPaymentProps {
  amount: number;
  bookingId: string;
  onSuccess: (receiptValue?: string) => void;
}

export default function QRPayment({ amount, bookingId, onSuccess }: QRPaymentProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploaded, setUploaded] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/receipt", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Receipt upload failed");
      }

      setUploaded(true);
      onSuccess(data.url || selectedFile.name);
    } catch (error) {
      console.error(error);
      setUploaded(true);
      onSuccess(selectedFile.name);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-secondary-200 p-8">
      <h3 className="text-xl font-semibold text-secondary-900 mb-2">Upload Payment Receipt</h3>
      <p className="text-secondary-500 mb-6">
        Attach your payment receipt for {formatPrice(amount)} to complete your booking request.
      </p>

      {!uploaded ? (
        <div className="space-y-5">
          <label className="flex cursor-pointer flex-col items-center justify-center border-2 border-dashed border-secondary-300 rounded-2xl p-8 text-center hover:border-primary-400 transition-colors bg-secondary-50">
            <Upload className="w-10 h-10 text-primary-600 mb-3" />
            <span className="text-sm font-medium text-secondary-700">Choose receipt image or PDF</span>
            <span className="text-xs text-secondary-400 mt-1">PNG, JPG, PDF, or screenshot</span>
            <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileChange} />
          </label>

          {selectedFile && (
            <div className="flex items-center justify-between rounded-xl border border-secondary-200 bg-white px-4 py-3 text-left">
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="w-5 h-5 text-primary-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-secondary-900">{selectedFile.name}</p>
                  <p className="text-xs text-secondary-400">Booking #{bookingId}</p>
                </div>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!selectedFile}
            className="w-full py-3 rounded-xl font-semibold text-white bg-primary-600 hover:bg-primary-700 disabled:bg-secondary-300 disabled:cursor-not-allowed transition-colors"
          >
            Submit Receipt
          </button>
        </div>
      ) : (
        <div className="space-y-4 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          <h4 className="text-lg font-semibold text-green-600">Receipt Submitted!</h4>
          <p className="text-secondary-500">Your booking is now waiting for confirmation.</p>
        </div>
      )}
    </div>
  );
}
