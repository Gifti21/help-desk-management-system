"use client";

import { useState } from "react";
import { BODY_TEXT_GREY, BORDER_GREY, PRIMARY_TEXT } from "@/lib/colors";
import { BODY_SM, FONT_FAMILY, FONT_WEIGHT } from "@/lib/fonts";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface ProfileSectionProps {
  name: string;
  email: string;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onSave: () => void;
}

export function ProfileSection({ name, email, onNameChange, onEmailChange, onSave }: ProfileSectionProps) {
  return (
    <Card variant="elevated" className="p-6 mb-6" style={{ borderColor: BORDER_GREY }}>
      <h2
        className="mb-6"
        style={{
          fontFamily: FONT_FAMILY.primary,
          fontSize: "1.25rem",
          lineHeight: "1.5",
          fontWeight: 600,
          letterSpacing: "0.01em",
          color: "#16332B",
        }}
      >
        Profile Information
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            className="block mb-2"
            style={{
              fontFamily: FONT_FAMILY.primary,
              fontSize: BODY_SM.size,
              lineHeight: BODY_SM.lineHeight,
              fontWeight: FONT_WEIGHT.medium,
              letterSpacing: BODY_SM.letterSpacing,
              color: BODY_TEXT_GREY,
            }}
          >
            Full Name
          </label>
          <Input
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Enter your full name"
          />
        </div>
        
        <div>
          <label
            className="block mb-2"
            style={{
              fontFamily: FONT_FAMILY.primary,
              fontSize: BODY_SM.size,
              lineHeight: BODY_SM.lineHeight,
              fontWeight: FONT_WEIGHT.medium,
              letterSpacing: BODY_SM.letterSpacing,
              color: BODY_TEXT_GREY,
            }}
          >
            Email Address
          </label>
          <Input
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="Enter your email"
            type="email"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={onSave}>Save Changes</Button>
      </div>
    </Card>
  );
}
