'use client';

import { useState } from 'react';

export default function TestLoginPage() {
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const testLogin = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/test/verify-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'admin@helpdesk.com',
                    password: 'admin123'
                })
            });
            const data = await response.json();
            setResult(data);
        } catch (error) {
            setResult({ error: String(error) });
        } finally {
            setLoading(false);
        }
    };

    const testActualLogin = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'admin@helpdesk.com',
                    password: 'admin123'
                })
            });
            const data = await response.json();
            setResult({ loginAPI: data, status: response.status });
        } catch (error) {
            setResult({ error: String(error) });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '40px', fontFamily: 'monospace' }}>
            <h1>Login Test Page</h1>

            <div style={{ marginTop: '20px' }}>
                <button
                    onClick={testLogin}
                    disabled={loading}
                    style={{
                        padding: '10px 20px',
                        marginRight: '10px',
                        background: '#0070f3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Testing...' : 'Test Credentials'}
                </button>

                <button
                    onClick={testActualLogin}
                    disabled={loading}
                    style={{
                        padding: '10px 20px',
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Testing...' : 'Test Login API'}
                </button>
            </div>

            {result && (
                <div style={{
                    marginTop: '20px',
                    padding: '20px',
                    background: '#f5f5f5',
                    borderRadius: '8px',
                    whiteSpace: 'pre-wrap'
                }}>
                    <h3>Result:</h3>
                    {JSON.stringify(result, null, 2)}
                </div>
            )}

            <div style={{ marginTop: '40px', padding: '20px', background: '#fffbeb', borderRadius: '8px' }}>
                <h3>Test Credentials:</h3>
                <p>Email: admin@helpdesk.com</p>
                <p>Password: admin123</p>
            </div>
        </div>
    );
}
