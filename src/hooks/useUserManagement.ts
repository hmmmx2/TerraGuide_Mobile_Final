import { useState, useEffect, useCallback } from 'react';
import { User, NewUser, UserRole } from '@/types/user';
import { filterUsers, sortUsers, generateUserId } from '@/utils/userUtils';

export const useUserManagement = (initialUsers: User[] = []) => {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [filteredUsers, setFilteredUsers] = useState<User[]>(initialUsers);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'name' | 'email' | 'role' | 'createdAt'>('name');
    const [loading, setLoading] = useState(false);

    // Filter and sort users when search query, sort option, or users change
    useEffect(() => {
        const filtered = filterUsers(users, searchQuery);
        const sorted = sortUsers(filtered, sortBy);
        setFilteredUsers(sorted);
    }, [users, searchQuery, sortBy]);

    const addUser = useCallback(async (newUserData: NewUser): Promise<boolean> => {
        setLoading(true);
        try {
            const newUser: User = {
                ...newUserData,
                id: generateUserId(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
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
    }, []);

    const updateUserRole = useCallback(async (userId: string, newRole: UserRole): Promise<boolean> => {
        setLoading(true);
        try {
            setUsers(prev =>
                prev.map(user =>
                    user.id === userId
                        ? { ...user, role: newRole, updatedAt: new Date().toISOString() }
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

    const deleteUser = useCallback(async (userId: string): Promise<boolean> => {
        setLoading(true);
        try {
            setUsers(prev => prev.filter(user => user.id !== userId));
            return true;
        } catch (error) {
            console.error('Error deleting user:', error);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const toggleUserStatus = useCallback(async (userId: string): Promise<boolean> => {
        setLoading(true);
        try {
            setUsers(prev =>
                prev.map(user =>
                    user.id === userId
                        ? { ...user, isActive: !user.isActive, updatedAt: new Date().toISOString() }
                        : user
                )
            );
            return true;
        } catch (error) {
            console.error('Error toggling user status:', error);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        users,
        filteredUsers,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        loading,
        addUser,
        updateUserRole,
        deleteUser,
        toggleUserStatus
    };
};