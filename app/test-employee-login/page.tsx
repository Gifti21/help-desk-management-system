"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TestEmployeeLoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const router = useRouter();

    const loginAsEmployee = async () => {
        setIsLoading(true);
        setResult(null);

        try {
            const response = await fetch('/api/test/login-employee', {
                method: 'POST',
                credentials: 'include',
            });

            const data = await response.json();
            setResult(data);

            if (data.success) {
                // Redirect to employee create ticket page after 2 seconds
                setTimeout(() => {
                    router.push('/employee/tickets/new');
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
                <h1 className="text-2xl font-bold text-center mb-6">Test Employee Login</h1>

                <div className="text-center mb-6">
                    <p className="text-gray-600 mb-4">
                        This page helps you test the employee portal by automatically logging in as an employee user.
                    </p>

                    <button
                        onClick={loginAsEmployee}
                        disabled={isLoading}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                    >
                        {isLoading ? 'Logging in...' : 'Login as Employee'}
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
                                <p>Department: {result.user.department}</p>
                                <p className="mt-2 text-sm">Redirecting to create ticket page...</p>
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
                            <a href="/employee/dashboard" className="text-blue-500 hover:underline">Employee Dashboard</a>
                            <span>|</span>
                            <a href="/employee/tickets/new" className="text-blue-500 hover:underline">Create Ticket</a>
                            <span>|</span>
                            <a href="/" className="text-blue-500 hover:underline">Home</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}