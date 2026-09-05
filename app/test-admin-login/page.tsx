op
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TestAdminLoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const router = useRouter();

    const loginAsAdmin = async () => {
        setIsLoading(true);
        setResult(null);

        try {
            const response = await fetch('/api/test/login-admin', {
                method: 'POST',
                credentials: 'include',
            });

            const data = await response.json();
            setResult(data);

            if (data.success) {
                // Redirect to admin tickets page after 2 seconds
                setTimeout(() => {
                    router.push('/admin/tickets');
                }, 2000);
            }
        } catch (error: any) {
            setResult({
                success: false,
                error: error.message || 'Login failed'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-center mb-6">Test Admin Login</h1>

                <div className="text-center mb-6">
                    <p className="text-gray-600 mb-4">
                        This page helps you test the admin portal by automatically logging in as an admin user.
                    </p>

                    <button
                        onClick={loginAsAdmin}
                        disabled={isLoading}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                    >
                        {isLoading ? 'Logging in...' : 'Login as Admin'}
                    </button>
                </div>

                {result && (
                    <div className={`p-4 rounded-md ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        <h3 className="font-semibold mb-2">
                            {result.success ? 'Success!' : 'Error'}
                        </h3>

                        {result.success ? (
                            <div>
                                <p>Logged in as: {result.user.name} ({result.user.email})</p>
                                <p>Role: {result.user.role}</p>
                                <p>Department: {result.user.department}</p>
                                <p className="mt-2 text-sm">Redirecting to admin tickets page...</p>
                            </div>
                        ) : (
                            <div>
                                <p>{result.error}</p>
                                {result.details && <p className="text-sm mt-1">{result.details}</p>}
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-6 text-center">
                    <div className="text-sm text-gray-500">
                        <p>Quick Links:</p>
                        <div className="mt-2 space-x-2">
                            <a href="/admin/tickets" className="text-red-500 hover:underline">Admin Tickets</a>
                            <span>|</span>
                            <a href="/admin/dashboard" className="text-red-500 hover:underline">Admin Dashboard</a>
                            <span>|</span>
                            <a href="/test-employee-login" className="text-blue-500 hover:underline">Employee Login</a>
                            <span>|</span>
                            <a href="/" className="text-gray-500 hover:underline">Home</a>
                        </div>
                    </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded">
                    <p className="text-sm text-blue-700">
                        <strong>Testing Flow:</strong><br />
                        1. Login as employee → Create tickets<br />
                        2. Login as admin → View all tickets (including employee-created ones)
                    </p>
                </div>
            </div>
        </div>
    );
}