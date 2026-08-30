"use client";

import { useRouter } from "next/navigation";
import GoogleSignIn from "@/components/GoogleSignIn";
import { ArrowRight } from "lucide-react";

export default function ConsumerSignInPage() {
  const router = useRouter();

  const handleGoogleSignInSuccess = (email: string, name: string) => {
    // User info is stored in localStorage by GoogleSignIn component
    // Redirect to booking page
    router.push("/booking");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">Book Your Dream Dress</h1>
          <p className="text-secondary-500">Sign in to get started with your rental</p>
        </div>

        {/* Sign-In Card */}
        <div className="bg-white rounded-2xl border border-secondary-200 p-8 shadow-sm space-y-6">
          
          {/* Google Sign-In */}
          <div>
            <p className="text-sm text-secondary-600 text-center mb-4 font-medium">Sign in with Google</p>
            <GoogleSignIn 
              onSuccess={handleGoogleSignInSuccess}
              onError={(error) => console.error("Sign-in failed:", error)}
            />
          </div>

          <button
            onClick={() => router.push("/booking")}
            className="w-full py-3 bg-secondary-100 text-secondary-900 rounded-xl font-semibold hover:bg-secondary-200 transition-colors flex items-center justify-center gap-2"
          >
            <span>Continue without account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Footer Info */}
        <p className="text-center text-xs text-secondary-500 mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
