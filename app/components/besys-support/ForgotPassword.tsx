"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showError, setShowError] = useState(false);

  const isValidEmail = /.+@.+\..+/.test(email.trim());
  const isFormReady = isValidEmail;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isFormReady) {
      setShowError(true);
      return;
    }
    setIsSubmitted(true);
    setShowError(false);
  };

  return (
    <div className="min-h-screen bg-[#f7f9f8] px-4 py-8 text-[#1a1d1c] sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto flex max-w-5xl flex-col overflow-hidden rounded-[24px] border border-[#e3ece8] bg-white shadow-[0_20px_70px_rgba(22,51,43,0.12)] sm:rounded-[28px] lg:flex-row">
        <div className="relative flex flex-1 flex-col justify-center bg-[#16332b] px-8 py-10 text-white sm:px-10 lg:px-12 lg:py-14">
          <Link href="/login" className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-white/90 transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2fd9c4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#16332b]">
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>

          <div className="inline-flex w-fit rounded-full border border-[#2fd9c4]/40 bg-[#2fd9c4]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-[#8ef1e0]">
            PASSWORD RESET
          </div>

          <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">Reset your password</h1>
          <p className="mt-4 max-w-md text-lg leading-8 text-[#9bb0ab]">
            {isSubmitted
              ? "Check your email for a password reset link."
              : "Enter your email address and we'll send you a link to reset your password."}
          </p>

          <div className="pointer-events-none absolute bottom-4 right-4 opacity-20 lg:bottom-6 lg:right-6">
            <svg viewBox="0 0 96 96" className="h-24 w-24" fill="currentColor" aria-hidden="true">
              <path d="M24 12c0-6.627 5.373-12 12-12s12 5.373 12 12v12h-4V12c0-4.418-3.582-8-8-8s-8 3.582-8 8v12h-4V12zm40 0c0-6.627 5.373-12 12-12s12 5.373 12 12v12h-4V12c0-4.418-3.582-8-8-8s-8 3.582-8 8v12h-4V12z" />
            </svg>
          </div>
        </div>

        <div className="flex-1 px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
          <div className="mb-6 rounded-[20px] border border-[#e3ece8] bg-[#f7f9f8] p-4 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#16332b]">SECURE RECOVERY</p>
            <p className="mt-2 text-sm leading-7 text-[#6b6e6c]">
              We'll send a secure link to your email address. This link will expire in 24 hours.
            </p>
          </div>

          {!isSubmitted ? (
            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              {showError ? (
                <div className="rounded-2xl border border-[#f1b8b4] bg-[#fff5f3] px-4 py-3 text-sm text-[#9f3d37] shadow-sm">
                  Please enter a valid email address.
                </div>
              ) : null}

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[#16332b]">
                  Email address
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-[#d9e4de] bg-[#f7f9f8] px-4 py-3 transition focus-within:border-[#2fd9c4] focus-within:ring-2 focus-within:ring-[#2fd9c4]/20">
                  <Mail className="h-5 w-5 text-[#6b6e6c]" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setShowError(false);
                    }}
                    placeholder="name@company.com"
                    className="w-full bg-transparent text-sm text-[#1a1d1c] outline-none placeholder:text-[#6b6e6c]"
                    aria-invalid={showError}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!isFormReady}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#2fd9c4] px-5 py-3 text-base font-semibold text-[#16332b] transition hover:bg-[#24c3b0] disabled:cursor-not-allowed disabled:bg-[#aeece4] disabled:text-[#4d5f5a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2fd9c4] focus-visible:ring-offset-2"
              >
                Send reset link
                <ArrowRight className="h-5 w-5" />
              </button>
            </form>
          ) : (
            <div className="rounded-2xl border border-[#2fd9c4]/40 bg-[#e5f9f6] px-5 py-4">
              <p className="text-sm font-semibold text-[#16332b]">Reset link sent!</p>
              <p className="mt-2 text-sm leading-7 text-[#6b6e6c]">
                If an account exists with <span className="font-semibold text-[#1a1d1c]">{email}</span>, you'll receive a password reset link shortly.
              </p>
            </div>
          )}

          <p className="mt-8 text-center text-sm text-[#6b6e6c]">
            Remember your password?{" "}
            <Link href="/login" className="font-semibold text-[#2fd9c4] transition hover:text-[#24c3b0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2fd9c4] focus-visible:ring-offset-2">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
