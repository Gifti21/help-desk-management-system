"use client";

import { useState, useEffect } from 'react';

export default function DebugCategoriesPage() {
    const [testResults, setTestResults] = useState<any>({});
    const [isLoading, setIsLoading] = useState(false);

    const runTests = async () => {
        setIsLoading(true);
        const results: any = {};

        try {
            // Test 1: Check categories without auth
            console.log('Test 1: Checking categories...');
            const catResponse = await fetch('/api/test/categories');
            const catData = await catResponse.json();
            results.categoriesTest = {
                status: catResponse.status,
                data: catData
            };

            // Test 2: Try to login as employee
            console.log('Test 2: Logging in as employee...');
            const loginResponse = await fetch('/api/test/login-employee', {
                method: 'POST',
                credentials: 'include'
            });
            const loginData = await loginResponse.json();
            results.loginTest = {
                status: loginResponse.status,
                data: loginData
            };

            // Test 3: Try form data endpoint with auth
            console.log('Test 3: Getting form data with auth...');
            const formResponse = await fetch('/api/employee/ticket-form-data', {
                credentials: 'include'
            });
            const formData = await formResponse.json();
            results.formDataTest = {
                status: formResponse.status,
                data: formData
            };

        } catch (error: any) {
            results.error = error.message;
        }

        setTestResults(results);
        setIsLoading(false);
    };

    useEffect(() => {
        runTests();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Category Debug Page</h1>

                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <button
                            onClick={runTests}
                            disabled={isLoading}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                        >
                            {isLoading ? 'Running Tests...' : 'Run Tests'}
                        </button>

                        <a
                            href="/employee/tickets/new"
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                        >
                            Go to Create Ticket
                        </a>
                    </div>

                    {Object.keys(testResults).length > 0 && (
                        <div className="space-y-6">
                            {testResults.categoriesTest && (
                                <div className="border rounded p-4">
                                    <h3 className="font-semibold text-lg mb-2">Categories Test (No Auth)</h3>
                                    <p className="text-sm text-gray-600 mb-2">Status: {testResults.categoriesTest.status}</p>
                                    <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                                        {JSON.stringify(testResults.categoriesTest.data, null, 2)}
                                    </pre>
                                </div>
                            )}

                            {testResults.loginTest && (
                                <div className="border rounded p-4">
                                    <h3 className="font-semibold text-lg mb-2">Employee Login Test</h3>
                                    <p className="text-sm text-gray-600 mb-2">Status: {testResults.loginTest.status}</p>
                                    <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                                        {JSON.stringify(testResults.loginTest.data, null, 2)}
                                    </pre>
                                </div>
                            )}

                            {testResults.formDataTest && (
                                <div className="border rounded p-4">
                                    <h3 className="font-semibold text-lg mb-2">Form Data Test (With Auth)</h3>
                                    <p className="text-sm text-gray-600 mb-2">Status: {testResults.formDataTest.status}</p>
                                    <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                                        {JSON.stringify(testResults.formDataTest.data, null, 2)}
                                    </pre>
                                </div>
                            )}

                            {testResults.error && (
                                <div className="border border-red-300 bg-red-100 rounded p-4">
                                    <h3 className="font-semibold text-lg mb-2 text-red-800">Error</h3>
                                    <p className="text-red-700">{testResults.error}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}