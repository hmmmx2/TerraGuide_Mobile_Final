import { User, UserRole } from '@/types/user';

export const filterUsers = (users: User[], searchQuery: string): User[] => {
    if (!searchQuery.trim()) return users;

    const query = searchQuery.toLowerCase();
    return users.filter(user =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.designation.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
    );
};

export const sortUsers = (users: User[], sortBy: 'name' | 'email' | 'role' | 'createdAt' = 'name'): User[] => {
    return [...users].sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'email':
                return a.email.localeCompare(b.email);
            case 'role':
                const roleOrder = { admin: 0, controller: 1, user: 2 };
                return roleOrder[a.role] - roleOrder[b.role];
            case 'createdAt':
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            default:
                return 0;
        }
    });
};

export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const generateUserId = (): string => {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const getUserStats = (users: User[]) => {
    const total = users.length;
    const active = users.filter(user => user.isActive).length;
    const byRole = users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
    }, {} as Record<UserRole, number>);

    return {
        total,
        active,
        inactive: total - active,
        admins: byRole.admin || 0,
        controllers: byRole.controller || 0,
        users: byRole.user || 0
    };
};