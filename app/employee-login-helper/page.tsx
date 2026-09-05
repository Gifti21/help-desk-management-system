"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EmployeeLoginHelper() {
    const router = useRouter();

    useEffect(() => {
        const autoLogin = async () => {
            try {
                console.log('Auto-logging in as employee...');

                const response = await fetch('/api/test/login-employee', {
                    method: 'POST',
                    credentials: 'include',
                });

                const data = await response.json();

                if (data.success) {
                    console.log('Login successful, redirecting...');
                    // Redirect back to create ticket page
                    window.location.href = '/employee/tickets/new';
                } else {
                    console.error('Login failed:', data.error);
                    alert('Login failed: ' + data.error);
                }
            } catch (error) {
                console.error('Auto-login error:', error);
                alert('Login error: ' + error);
            }
        };

        autoLogin();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold mb-2">Logging in as Employee...</h2>
                <p className="text-gray-600">Please wait while we set up your employee session.</p>
            </div>
        </div>
    );
}