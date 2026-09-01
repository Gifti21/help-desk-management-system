"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PAGE_BACKGROUND, BORDER_GREY, PRIMARY_TEXT } from "@/lib/colors";
import { LoginLeftPanel } from "./Login/LoginLeftPanel";
import { LoginForm } from "./Login/LoginForm";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isValidEmail = useMemo(() => /.+@.+\..+/.test(email.trim()), [email]);
  const isFormReady = isValidEmail && password.trim().length >= 6;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormReady) {
      setShowError(true);
      return;
    }

    setIsLoading(true);
    setShowError(false);

    try {
      console.log('[LOGIN] Submitting login request...');

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();
      console.log('[LOGIN] Response:', { success: data.success, role: data.user?.role });

      if (!response.ok || !data.success) {
        console.error('[LOGIN] Login failed:', data.error);
        setShowError(true);
        setIsLoading(false);
        return;
      }

      const role = data.user?.role;
      console.log('[LOGIN] Login successful, redirecting based on role:', role);

      if (role === "ADMIN") {
        router.push("/admin");
      } else if (role === "AGENT") {
        router.push("/dashboard/technician");
      } else {
        router.push("/employee/dashboard");
      }
    } catch (error) {
      console.error('[LOGIN] Login error:', error);
      setShowError(true);
      setIsLoading(false);
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setShowError(false);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setShowError(false);
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8 lg:py-12" style={{ backgroundColor: PAGE_BACKGROUND, color: PRIMARY_TEXT }}>
      <div className="mx-auto flex max-w-5xl flex-col overflow-hidden rounded-[24px] border bg-white sm:rounded-[28px] lg:flex-row" style={{ borderColor: BORDER_GREY, boxShadow: '0 20px 70px rgba(22, 51, 43, 0.12)' }}>
        <LoginLeftPanel />
        <LoginForm
          email={email}
          password={password}
          showPassword={showPassword}
          showError={showError}
          onEmailChange={handleEmailChange}
          onPasswordChange={handlePasswordChange}
          onTogglePassword={() => setShowPassword((value) => !value)}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
