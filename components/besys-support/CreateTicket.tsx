"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PAGE_BACKGROUND } from "@/lib/colors";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Footer } from "@/components/layout/Footer";
import { SuccessView } from "./CreateTicket/SuccessView";
import { CreateTicketHeaderSection } from "./CreateTicket/CreateTicketHeaderSection";
import { TicketForm } from "./CreateTicket/TicketForm";
import type { TicketCategory, TicketPriority } from "@/lib/types/ticket";

export function CreateTicket() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<TicketCategory>("Hardware");
  const [priority, setPriority] = useState<TicketPriority>("Medium");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const isFormReady = title.trim().length > 0 && description.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormReady) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);

      // Redirect after showing success
      setTimeout(() => {
        router.push("/employee/dashboard");
      }, 2000);
    }, 1500);
  };

  const handleCancel = () => {
    router.push("/employee/dashboard");
  };

  if (showSuccess) {
    return <SuccessView />;
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: PAGE_BACKGROUND }}
    >
      <Sidebar role="EMPLOYEE" />

      <div className="flex-1 lg:pl-[280px] flex flex-col pb-[120px]">
        <DashboardHeader
          userName="Jamie Smith"
          userInitials="JS"
          role="EMPLOYEE"
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-2xl mx-auto">
            <CreateTicketHeaderSection />
            <TicketForm
              title={title}
              description={description}
              category={category}
              priority={priority}
              isSubmitting={isSubmitting}
              isFormReady={isFormReady}
              onTitleChange={setTitle}
              onDescriptionChange={setDescription}
              onCategoryChange={setCategory}
              onPriorityChange={setPriority}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>
        </main>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40">
        <Footer />
      </div>
    </div>
  );
}
