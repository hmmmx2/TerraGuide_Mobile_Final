export interface User {
    id: string;
    name: string;
    email: string;
    designation: string;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
    isActive?: boolean;
    lastLogin?: string;
}

export type UserRole = 'admin' | 'controller' | 'user';

export interface NewUser {
    name: string;
    email: string;
    designation: string;
    role: UserRole;
}

export interface UserFormData extends NewUser {
    password?: string;
    confirmPassword?: string;
}

export interface RoleOption {
    label: string;
    value: UserRole;
    description: string;
    permissions: string[];
}