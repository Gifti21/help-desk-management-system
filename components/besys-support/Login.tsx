"use client";

import { useMemo, useState } from "react";
import { PAGE_BACKGROUND, BORDER_GREY, PRIMARY_TEXT } from "@/lib/colors";
import { LoginLeftPanel } from "./Login/LoginLeftPanel";
import { LoginForm } from "./Login/LoginForm";

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
