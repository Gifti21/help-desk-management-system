import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { ToastProvider } from '@/components/ui/toast';
import { AdminShell } from './shell';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Mock user data for frontend-only demo
    const mockUser = {
        role: 'ADMIN',
        name: 'John Admin'
    };

    return (
        <ThemeProvider>
            <ToastProvider>
                <AdminShell role={mockUser.role} userName={mockUser.name}>
                    {children}
                </AdminShell>
            </ToastProvider>
        </ThemeProvider>
    );
}