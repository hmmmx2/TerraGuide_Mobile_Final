export interface LicenseApproval {
    id: string;
    userName: string;
    course: string;
    mentorProgramme: string;
    exam: string;
    status: 'approved' | 'reject' | 'pending';
    dateSubmitted: string;
    reviewedBy?: string;
    reviewDate?: string;
}

export interface LicenseRenewal {
    id: string;
    userName: string;
    startDate: string;
    expiredDate: string;
    payment: string;
    status: string;
    daysUntilExpiry: number;
    renewalFee: number;
    emailAlertsSent: number[];
    licenseNumber?: string;
}

export interface EmailAlert {
    userId: string;
    daysBeforeExpiry: number;
    sentDate: string;
    emailStatus: 'sent' | 'failed' | 'pending';
}

export type LicenseStatus =
    | 'approved'
    | 'reject'
    | 'pending'
    | 'expired'
    | 'renewed'
    | 'no_payment'
    | 'renew_required';