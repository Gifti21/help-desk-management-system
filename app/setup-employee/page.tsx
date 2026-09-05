"use client";

import { useState } from 'react';

export default function SetupEmployeePage() {
    const [result, setResult] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const setupEmployee = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/test/setup-employee', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            setResult(data);
        } catch (error: any) {
            setResult({
                success: false,
                error: error.message
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold text-center mb-6">Setup Employee User</h1>

                <div className="text-center mb-8">
                    <p className="text-gray-600 mb-6">
                        This will create or update the employee user for testing the CreateTicket functionality.
                    </p>

                    <button
                        onClick={setupEmployee}
                        disabled={isLoading}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50"
                    >
                        {isLoading ? 'Setting up...' : 'Setup Employee User'}
                    </button>
                </div>

                {result && (
                    <div className={`p-6 rounded-lg border-2 ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <h3 className={`font-bold text-lg mb-4 ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                            {result.success ? '✅ Success!' : '❌ Error'}
                        </h3>

                        {result.success ? (
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-green-700 mb-2">Employee Details:</h4>
                                    <div className="bg-white p-4 rounded border">
                                        <p><strong>Name:</strong> {result.employee.name}</p>
                                        <p><strong>Email:</strong> {result.employee.email}</p>
                                        <p><strong>Role:</strong> {result.employee.role}</p>
                                        <p><strong>Department:</strong> {result.employee.department}</p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-green-700 mb-2">Login Credentials:</h4>
                                    <div className="bg-blue-50 p-4 rounded border border-blue-200">
                                        <p><strong>Email:</strong> <code className="bg-blue-100 px-2 py-1 rounded">{result.credentials.email}</code></p>
                                        <p><strong>Password:</strong> <code className="bg-blue-100 px-2 py-1 rounded">{result.credentials.password}</code></p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-green-700 mb-2">Next Steps:</h4>
                                    <ol className="list-decimal list-inside space-y-2 text-sm">
                                        <li>Go to the <a href="/" className="text-blue-500 underline">main login page</a></li>
                                        <li>Use the credentials above to login</li>
                                        <li>Navigate to <a href="/employee/tickets/new" className="text-blue-500 underline">Create Ticket</a></li>
                                        <li>The form should now load categories properly</li>
                                    </ol>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <p className="text-red-700 mb-2"><strong>Error:</strong> {result.error}</p>
                                {result.details && (
                                    <p className="text-red-600 text-sm">{result.details}</p>
                                )}
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-8 pt-6 border-t">
                    <h3 className="font-semibold mb-4">Quick Links:</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <a
                            href="/"
                            className="bg-green-500 hover:bg-green-600 text-white text-center py-2 px-4 rounded"
                        >
                            Main Login Page
                        </a>
                        <a
                            href="/employee/tickets/new"
                            className="bg-purple-500 hover:bg-purple-600 text-white text-center py-2 px-4 rounded"
                        >
                            Create Ticket (Direct)
                        </a>
                        <a
                            href="/employee/dashboard"
                            className="bg-orange-500 hover:bg-orange-600 text-white text-center py-2 px-4 rounded"
                        >
                            Employee Dashboard
                        </a>
                        <a
                            href="/admin/users"
                            className="bg-gray-500 hover:bg-gray-600 text-white text-center py-2 px-4 rounded"
                        >
                            Admin Users (Check)
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}