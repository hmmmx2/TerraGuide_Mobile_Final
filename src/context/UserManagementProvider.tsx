// context/UserManagementProvider.tsx

import React, { createContext, useContext, useState, useCallback } from 'react';

// Types
interface User {
    id: string;
    name: string;
    email: string;
    designation: string;
    role: 'admin' | 'controller' | 'user';
    createdAt: string;
    updatedAt: string;
    isActive?: boolean;
}

interface NewUser {
    name: string;
    email: string;
    designation: string;
    role: 'admin' | 'controller' | 'user';
}

type UserRole = 'admin' | 'controller' | 'user';

interface UserManagementContextType {
    users: User[];
    addUser: (newUser: NewUser) => Promise<boolean>;
    updateUserRole: (userId: string, newRole: UserRole) => Promise<boolean>;
    deleteUser: (userId: string) => Promise<boolean>;
    loading: boolean;
}

// Mock initial data
const initialUsers: User[] = [
    {
        id: '1',
        name: 'Timmy He',
        email: 'timmyhe@gmail.com',
        designation: 'Senior Manager',
        role: 'controller',
        createdAt: '2024-01-15',
        updatedAt: '2024-01-15',
        isActive: true
    },
    {
        id: '2',
        name: 'Jimmy He',
        email: 'jimmyhe@gmail.com',
        designation: 'Manager',
        role: 'controller',
        createdAt: '2024-01-16',
        updatedAt: '2024-01-16',
        isActive: true
    },
    {
        id: '3',
        name: 'Gimmy He',
        email: 'gimmyhe@gmail.com',
        designation: 'Business Analyst',
        role: 'admin',
        createdAt: '2024-01-17',
        updatedAt: '2024-01-17',
        isActive: true
    },
    {
        id: '4',
        name: 'Alvin He',
        email: 'alvinhe@gmail.com',
        designation: 'Regional Developer',
        role: 'admin',
        createdAt: '2024-01-18',
        updatedAt: '2024-01-18',
        isActive: true
    },
    {
        id: '5',
        name: 'Aaron He',
        email: 'aaronhe@gmail.com',
        designation: 'Senior Park Guide',
        role: 'admin',
        createdAt: '2024-01-19',
        updatedAt: '2024-01-19',
        isActive: true
    },
    {
        id: '6',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@gmail.com',
        designation: 'Senior Park Guide',
        role: 'admin',
        createdAt: '2024-01-20',
        updatedAt: '2024-01-20',
        isActive: true
    },
    {
        id: '7',
        name: 'Mike Chen',
        email: 'mike.chen@gmail.com',
        designation: '',
        role: 'user',
        createdAt: '2024-01-21',
        updatedAt: '2024-01-21',
        isActive: true
    },
    {
        id: '8',
        name: 'Lisa Wong',
        email: 'lisa.wong@gmail.com',
        designation: '',
        role: 'user',
        createdAt: '2024-01-22',
        updatedAt: '2024-01-22',
        isActive: true
    },
];

// Create Context
const UserManagementContext = createContext<UserManagementContextType | undefined>(undefined);

// Provider Component
export const UserManagementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [loading, setLoading] = useState(false);

    // Generate unique ID
    const generateUserId = (): string => {
        return Math.max(...users.map(u => parseInt(u.id)), 0) + 1 + '';
    };

    // Add new user
    const addUser = useCallback(async (newUserData: NewUser): Promise<boolean> => {
        setLoading(true);
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));

            const newUser: User = {
                ...newUserData,
                id: generateUserId(),
                createdAt: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
                updatedAt: new Date().toISOString().split('T')[0],
                isActive: true
            };

            setUsers(prev => [...prev, newUser]);
            return true;
        } catch (error) {
            console.error('Error adding user:', error);
            return false;
        } finally {
            setLoading(false);
        }
    }, [users]);

    // Update user role
    const updateUserRole = useCallback(async (userId: string, newRole: UserRole): Promise<boolean> => {
        setLoading(true);
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 300));

            setUsers(prev =>
                prev.map(user =>
                    user.id === userId
                        ? { ...user, role: newRole, updatedAt: new Date().toISOString().split('T')[0] }
                        : user
                )
            );
            return true;
        } catch (error) {
            console.error('Error updating user role:', error);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    // Delete user
    const deleteUser = useCallback(async (userId: string): Promise<boolean> => {
        setLoading(true);
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 300));

            setUsers(prev => prev.filter(user => user.id !== userId));
            return true;
        } catch (error) {
            console.error('Error deleting user:', error);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const value: UserManagementContextType = {
        users,
        addUser,
        updateUserRole,
        deleteUser,
        loading
    };

    return (
        <UserManagementContext.Provider value={value}>
            {children}
        </UserManagementContext.Provider>
    );
};

// Custom hook to use the context
export const useUserManagement = (): UserManagementContextType => {
    const context = useContext(UserManagementContext);
    if (!context) {
        throw new Error('useUserManagement must be used within a UserManagementProvider');
    }
    return context;
};