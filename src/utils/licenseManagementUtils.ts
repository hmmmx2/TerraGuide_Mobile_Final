import { LicenseRenewal, EmailAlert } from '@/types/licenseManagement';

export const calculateDaysUntilExpiry = (expiredDate: string): number => {
    const today = new Date();
    const expiry = new Date(expiredDate.split('/').reverse().join('-')); // Convert DD/MM/YYYY to YYYY-MM-DD
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

export const shouldSendEmailAlert = (renewal: LicenseRenewal): boolean => {
    const daysUntilExpiry = renewal.daysUntilExpiry;
    const alertDays = [30, 15, 5];

    return alertDays.some(days =>
        daysUntilExpiry <= days &&
        daysUntilExpiry > 0 &&
        !renewal.emailAlertsSent.includes(days)
    );
};

export const getNextAlertDay = (daysUntilExpiry: number): number | null => {
    const alertDays = [30, 15, 5];
    return alertDays.find(days => daysUntilExpiry <= days) || null;
};

export const getLicenseStatusColor = (status: string): string => {
    const lowerStatus = status.toLowerCase();

    if (lowerStatus.includes('approved')) return 'bg-green-100 text-green-800 border-green-200';
    if (lowerStatus.includes('reject')) return 'bg-red-100 text-red-800 border-red-200';
    if (lowerStatus.includes('pending')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (lowerStatus.includes('expired')) return 'bg-red-100 text-red-800 border-red-200';
    if (lowerStatus.includes('renewed')) return 'bg-green-100 text-green-800 border-green-200';
    if (lowerStatus.includes('no payment')) return 'bg-orange-100 text-orange-800 border-orange-200';

    return 'bg-gray-100 text-gray-800 border-gray-200';
};

export const isEligibleForApproval = (approval: { course: string; mentorProgramme: string; exam: string }): boolean => {
    return (
        approval.course.toLowerCase() === 'completed' &&
        approval.mentorProgramme.toLowerCase() === 'completed' &&
        approval.exam.toLowerCase() === 'pass'
    );
};

export const generateLicenseNumber = (userName: string): string => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const initials = userName.split(' ').map(name => name.charAt(0)).join('').toUpperCase();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');

    return `PG-${year}${month}-${initials}-${random}`;
};

export const formatRenewalFee = (amount: number): string => {
    return `RM${amount.toFixed(2)}`;
};

export const getRenewalPriority = (renewal: LicenseRenewal): 'high' | 'medium' | 'low' => {
    if (renewal.daysUntilExpiry < 0) return 'high'; // Expired
    if (renewal.daysUntilExpiry <= 5) return 'high'; // Expires soon
    if (renewal.daysUntilExpiry <= 15) return 'medium'; // Expires in 2 weeks
    return 'low';
};