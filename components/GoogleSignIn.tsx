"use client";

import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

interface GoogleSignInProps {
  onSuccess?: (email: string, name: string) => void;
  onError?: (error: any) => void;
}

export default function GoogleSignIn({ onSuccess, onError }: GoogleSignInProps) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return <p className="text-red-600 text-sm">Google Client ID not configured</p>;
  }

  const handleSuccess = (credentialResponse: any) => {
    try {
      const decoded: any = jwtDecode(credentialResponse.credential);
      const email = decoded.email;
      const name = decoded.name;

      // Store in localStorage for booking flow
      localStorage.setItem("user", JSON.stringify({
        email,
        name,
        googleId: decoded.sub,
      }));

      if (onSuccess) {
        onSuccess(email, name);
      }
    } catch (error) {
      console.error("Failed to decode Google token:", error);
      if (onError) onError(error);
    }
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => {
            console.error("Login failed");
            if (onError) onError("Login failed");
          }}
          width="400"
        />
      </div>
    </GoogleOAuthProvider>
  );
}
