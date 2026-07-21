"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState(false);

  const isValidEmail = useMemo(() => /.+@.+\..+/.test(email.trim()), [email]);
  const isFormReady = isValidEmail && password.trim().length >= 6;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowError(!isFormReady || email.trim().toLowerCase() !== "client@besys.com" || password !== "BESYS2026!");
  };

  return (
    <div className="min-h-screen bg-[#f7f9f8] px-4 py-8 text-[#1a1d1c] sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto flex max-w-5xl flex-col overflow-hidden rounded-[24px] border border-[#e3ece8] bg-white shadow-[0_20px_70px_rgba(22,51,43,0.12)] sm:rounded-[28px] lg:flex-row">
        <div className="relative flex flex-1 flex-col justify-center bg-[#16332b] px-8 py-10 text-white sm:px-10 lg:px-12 lg:py-14">
          <Link href="/" className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-white/90 transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2fd9c4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#16332b]">
            <ArrowLeft className="h-4 w-4" />
            Back to support portal
          </Link>

          <div className="inline-flex w-fit rounded-full border border-[#2fd9c4]/40 bg-[#2fd9c4]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-[#8ef1e0]">
            CLIENT ACCESS
          </div>

          <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">Welcome back</h1>
          <p className="mt-4 max-w-md text-lg leading-8 text-[#9bb0ab]">
            Sign in with your BESYS client credentials to continue tracking support requests.
          </p>

          <div className="pointer-events-none absolute bottom-4 right-4 opacity-20 lg:bottom-6 lg:right-6">
            <Image 
              src="/besys-logo.jpg" 
              alt="BESYS Technologies PLC logo" 
              width={96} 
              height={96}
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </div>

        <div className="flex-1 px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
          <div className="mb-6 rounded-[20px] border border-[#e3ece8] bg-[#f7f9f8] p-4 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#16332b]">SECURE ACCESS</p>
            <p className="mt-2 text-sm leading-7 text-[#6b6e6c]">
              Use the credentials provided by BESYS to view your tickets and respond to support updates.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            {showError ? (
              <div className="rounded-2xl border border-[#f1b8b4] bg-[#fff5f3] px-4 py-3 text-sm text-[#9f3d37] shadow-sm">
                That email or password isn&apos;t right.
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

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold text-[#16332b]">
                Password
              </label>
              <div className="flex items-center gap-3 rounded-2xl border border-[#d9e4de] bg-[#f7f9f8] px-4 py-3 transition focus-within:border-[#2fd9c4] focus-within:ring-2 focus-within:ring-[#2fd9c4]/20">
                <Lock className="h-5 w-5 text-[#6b6e6c]" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setShowError(false);
                  }}
                  placeholder="Enter your password"
                  className="w-full bg-transparent text-sm text-[#1a1d1c] outline-none placeholder:text-[#6b6e6c]"
                  aria-invalid={showError}
                />
                <button
                  type="button"
                  className="rounded-full p-1 text-[#6b6e6c] transition hover:text-[#16332b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2fd9c4] focus-visible:ring-offset-2"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-sm font-semibold text-[#2fd9c4] transition hover:text-[#24c3b0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2fd9c4] focus-visible:ring-offset-2">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={!isFormReady}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#2fd9c4] px-5 py-3 text-base font-semibold text-[#16332b] transition hover:bg-[#24c3b0] disabled:cursor-not-allowed disabled:bg-[#aeece4] disabled:text-[#4d5f5a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2fd9c4] focus-visible:ring-offset-2"
            >
              Log in
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[#6b6e6c]">
            Don&apos;t have login details? Contact your <span className="font-semibold text-[#1a1d1c]">BESYS account manager</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
