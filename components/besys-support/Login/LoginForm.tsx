import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import {
  DARK_GREEN,
  TEAL_PRIMARY,
  TEAL_HOVER,
  BORDER_GREY,
  BODY_TEXT_GREY,
  PRIMARY_TEXT,
  INPUT_BORDER,
  ERROR,
  PAGE_BACKGROUND,
} from "@/lib/colors";
import {
  HEADING_LG,
  BODY_REGULAR,
  BODY_SM,
  CAPTION_REGULAR,
  INPUT_REGULAR,
  FONT_FAMILY,
  FONT_WEIGHT,
} from "@/lib/fonts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface LoginFormProps {
  email: string;
  password: string;
  showPassword: boolean;
  showError: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onTogglePassword: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function LoginForm({
  email,
  password,
  showPassword,
  showError,
  onEmailChange,
  onPasswordChange,
  onTogglePassword,
  onSubmit,
}: LoginFormProps) {
  return (
    <div className="flex-1 px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
      <Card variant="bordered" className="mb-6 p-4 sm:p-5">
        <p
          className="font-semibold uppercase"
          style={{
            fontFamily: FONT_FAMILY.primary,
            fontSize: CAPTION_REGULAR.size,
            lineHeight: CAPTION_REGULAR.lineHeight,
            fontWeight: CAPTION_REGULAR.weight,
            letterSpacing: CAPTION_REGULAR.letterSpacing,
            color: DARK_GREEN,
          }}
        >
          SECURE ACCESS
        </p>
        <p
          className="mt-2"
          style={{
            fontFamily: FONT_FAMILY.primary,
            fontSize: BODY_REGULAR.size,
            lineHeight: BODY_REGULAR.lineHeight,
            fontWeight: BODY_REGULAR.weight,
            letterSpacing: BODY_REGULAR.letterSpacing,
            color: BODY_TEXT_GREY,
          }}
        >
          Use the credentials provided by BESYS to view your tickets and respond
          to support updates.
        </p>
      </Card>

      <form className="space-y-5" onSubmit={onSubmit} noValidate>
        {showError ? (
          <div
            className="rounded-2xl border px-4 py-3 shadow-sm"
            style={{
              borderColor: ERROR.border,
              backgroundColor: ERROR.background,
              color: ERROR.text,
              fontFamily: FONT_FAMILY.primary,
              fontSize: BODY_REGULAR.size,
              lineHeight: BODY_REGULAR.lineHeight,
              fontWeight: BODY_REGULAR.weight,
              letterSpacing: BODY_REGULAR.letterSpacing,
            }}
          >
            That email or password isn&apos;t right.
          </div>
        ) : null}

        <div>
          <label
            htmlFor="email"
            className="mb-2 block font-semibold"
            style={{
              fontFamily: FONT_FAMILY.primary,
              fontSize: BODY_REGULAR.size,
              lineHeight: BODY_REGULAR.lineHeight,
              fontWeight: FONT_WEIGHT.semibold,
              letterSpacing: BODY_REGULAR.letterSpacing,
              color: DARK_GREEN,
            }}
          >
            Email address
          </label>
          <Input
            id="email"
            type="email"
            icon={Mail}
            iconPosition="left"
            value={email}
            onChange={(event) => {
              onEmailChange(event.target.value);
            }}
            placeholder="name@company.com"
            aria-invalid={showError}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block font-semibold"
            style={{
              fontFamily: FONT_FAMILY.primary,
              fontSize: BODY_REGULAR.size,
              lineHeight: BODY_REGULAR.lineHeight,
              fontWeight: FONT_WEIGHT.semibold,
              letterSpacing: BODY_REGULAR.letterSpacing,
              color: DARK_GREEN,
            }}
          >
            Password
          </label>
          <div
            className="flex items-center gap-3 rounded-2xl border px-4 py-3 transition focus-within:ring-2"
            style={
              {
                borderColor: INPUT_BORDER,
                backgroundColor: PAGE_BACKGROUND,
                "--tw-ring-color": TEAL_PRIMARY,
                "--tw-ring-color-light": "rgba(47, 217, 196, 0.2)",
              } as React.CSSProperties
            }
          >
            <Lock className="h-5 w-5" style={{ color: BODY_TEXT_GREY }} />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => {
                onPasswordChange(event.target.value);
              }}
              placeholder="Enter your password"
              className="w-full bg-transparent outline-none"
              style={{
                fontFamily: FONT_FAMILY.primary,
                fontSize: INPUT_REGULAR.size,
                lineHeight: INPUT_REGULAR.lineHeight,
                fontWeight: INPUT_REGULAR.weight,
                letterSpacing: INPUT_REGULAR.letterSpacing,
                color: PRIMARY_TEXT,
              }}
              aria-invalid={showError}
            />
            <button
              type="button"
              className="rounded-full p-1 transition focus-visible:outline-none focus-visible:ring-2"
              style={
                {
                  color: BODY_TEXT_GREY,
                  "--tw-ring-color": TEAL_PRIMARY,
                } as React.CSSProperties
              }
              onMouseEnter={(e) => (e.currentTarget.style.color = DARK_GREEN)}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = BODY_TEXT_GREY)
              }
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={onTogglePassword}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <Button type="submit" fullWidth size="md">
          Log in
          <ArrowRight className="h-5 w-5" />
        </Button>
      </form>

      <p
        className="mt-8 text-center"
        style={{
          fontFamily: FONT_FAMILY.primary,
          fontSize: BODY_REGULAR.size,
          lineHeight: BODY_REGULAR.lineHeight,
          fontWeight: BODY_REGULAR.weight,
          letterSpacing: BODY_REGULAR.letterSpacing,
          color: BODY_TEXT_GREY,
        }}
      >
        Don&apos;t have login details? Contact your{" "}
        <span className="font-semibold" style={{ color: PRIMARY_TEXT }}>
          BESYS account manager
        </span>
        .
      </p>
    </div>
  );
}
