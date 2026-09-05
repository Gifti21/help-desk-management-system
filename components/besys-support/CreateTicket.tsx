"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PAGE_BACKGROUND } from "@/lib/colors";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { SuccessView } from "./CreateTicket/SuccessView";
import { CreateTicketHeaderSection } from "./CreateTicket/CreateTicketHeaderSection";
import { TicketForm } from "./CreateTicket/TicketForm";
import { useEmployeeProfile } from "@/lib/hooks/useEmployeeProfile";
import type { TicketCategory, TicketPriority } from "@/lib/types/ticket";
import { createEmployeeTicket, getTicketFormData } from "@/lib/api/employee";

export function CreateTicket() {
  const router = useRouter();
  const { profile } = useEmployeeProfile();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [priority, setPriority] = useState<TicketPriority>("MEDIUM");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoadingFormData, setIsLoadingFormData] = useState(true);
  const [formData, setFormData] = useState<{
    categories: Array<{ id: string; name: string }>;
  }>({ categories: [] });
  const [error, setError] = useState("");

  // Load form data on mount
  useEffect(() => {
    loadFormData();
  }, []);

  const loadFormData = async () => {
    try {
      setIsLoadingFormData(true);
      setError(""); // Clear any previous errors

      console.log('Loading form data...');
      const data = await getTicketFormData();
      console.log('Form data loaded:', data);

      setFormData({ categories: data.categories });

      // Check if categories exist
      if (data.categories.length === 0) {
        setError('No categories available. Please ask an admin to create ticket categories first through the admin portal (/admin/categories).');
      }

      console.log(`Loaded ${data.categories.length} categories`);
    } catch (error: any) {
      console.error('Failed to load form data:', error);
      let errorMessage = error.message || 'Failed to load form data';

      // Special handling for authentication errors
      if (errorMessage.includes('Unauthorized') || errorMessage.includes('Employee access required')) {
        errorMessage = 'Please login as an employee to create tickets. Go to /test-employee-login to test.';
      }

      setError(errorMessage);
    } finally {
      setIsLoadingFormData(false);
    }
  };

  const isFormReady = title.trim().length > 0 && description.trim().length > 0 && categoryId && categoryId.length > 0 && !isLoadingFormData;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormReady) return;

    setIsSubmitting(true);
    setError("");

    try {
      await createEmployeeTicket({
        title: title.trim(),
        description: description.trim(),
        priority: priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
        categoryId,
      });

      setShowSuccess(true);

      // Redirect after showing success
      setTimeout(() => {
        router.push("/employee/dashboard");
      }, 2000);
    } catch (error: any) {
      console.error('Failed to create ticket:', error);
      setError(error.message || 'Failed to create ticket');
      setIsSubmitting(false);
    }
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

      <div className="flex-1 lg:pl-[280px] flex flex-col">
        <DashboardHeader
          userName={profile.fullName}
          userInitials={profile.initials}
          role="EMPLOYEE"
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-2xl mx-auto">
            <CreateTicketHeaderSection />
            <TicketForm
              title={title}
              description={description}
              categoryId={categoryId}
              priority={priority}
              isSubmitting={isSubmitting}
              isFormReady={isFormReady}
              isLoadingFormData={isLoadingFormData}
              formData={formData}
              error={error}
              onTitleChange={setTitle}
              onDescriptionChange={setDescription}
              onCategoryChange={setCategoryId}
              onPriorityChange={setPriority}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
