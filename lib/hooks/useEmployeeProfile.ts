import { useState, useEffect } from 'react';
import { getEmployeeProfile } from '@/lib/api/employee';

interface UserProfile {
    fullName: string;
    initials: string;
    firstName: string;
    lastName: string;
    email: string;
}

export function useEmployeeProfile() {
    const [profile, setProfile] = useState<UserProfile>({
        fullName: 'Employee',
        initials: 'E',
        firstName: 'Employee',
        lastName: '',
        email: '',
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setIsLoading(true);
            const data = await getEmployeeProfile();
            const initials = `${data.firstName.charAt(0)}${data.lastName.charAt(0)}`.toUpperCase();
            setProfile({
                fullName: data.fullName,
                initials,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
            });
        } catch (err) {
            console.error('Failed to load profile:', err);
            setError(err instanceof Error ? err.message : 'Failed to load profile');
        } finally {
            setIsLoading(false);
        }
    };

    return { profile, isLoading, error };
}
