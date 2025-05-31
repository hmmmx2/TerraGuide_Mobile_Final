//useLicenseManagement.ts

import { useState, useEffect, useCallback } from 'react';
import { LicenseApproval, LicenseRenewal } from '@/types/licenseManagement';
import {
    calculateDaysUntilExpiry,
    shouldSendEmailAlert,
    isEligibleForRenewal,
    categorizeRenewalItems,
    generateRenewalUpdateMessage
} from '@/utils/licenseManagementUtils';

export const useLicenseManagement = () => {
    const [approvals, setApprovals] = useState<LicenseApproval[]>([]);
    const [renewals, setRenevals] = useState<LicenseRenewal[]>([]);
    const [loading, setLoading] = useState(false);

    // Send email alerts for renewals
    const checkAndSendEmailAlerts = useCallback(async () => {
        const alertsToSend = renewals.filter(shouldSendEmailAlert);

        for (const renewal of alertsToSend) {
            try {
                // In real app, call email service API
                console.log(`Sending email alert to ${renewal.userName} - ${renewal.daysUntilExpiry} days until expiry`);

                // Update emailAlertsSent array
                const alertDay = renewal.daysUntilExpiry <= 5 ? 5 : renewal.daysUntilExpiry <= 15 ? 15 : 30;
                setRenevals(prev =>
                    prev.map(r =>
                        r.id === renewal.id
                            ? { ...r, emailAlertsSent: [...r.emailAlertsSent, alertDay] }
                            : r
                    )
                );
            } catch (error) {
                console.error('Failed to send email alert:', error);
            }
        }
    }, [renewals]);

    // Update approval status
    const updateApprovalStatus = useCallback(async (approvalId: string, status: 'approved' | 'reject' | 'pending'): Promise<boolean> => {
        setLoading(true);
        try {
            setApprovals(prev =>
                prev.map(approval =>
                    approval.id === approvalId
                        ? { ...approval, status, reviewDate: new Date().toISOString() }
                        : approval
                )
            );
            return true;
        } catch (error) {
            console.error('Error updating approval status:', error);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    // Update single renewal status
    const updateRenewalStatus = useCallback(async (renewalId: string, status: string): Promise<boolean> => {
        setLoading(true);
        try {
            setRenevals(prev =>
                prev.map(renewal =>
                    renewal.id === renewalId
                        ? { ...renewal, status }
                        : renewal
                )
            );
            return true;
        } catch (error) {
            console.error('Error updating renewal status:', error);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    // Bulk update renewals - main function for checkbox-based renewals
    const bulkUpdateRenewals = useCallback(async (renewalIds: string[]): Promise<{
        success: boolean;
        message: string;
        updatedCount: number;
        skippedCount: number;
    }> => {
        setLoading(true);

        try {
            // Get selected renewal items
            const selectedRenewals = renewals.filter(renewal => renewalIds.includes(renewal.id));

            // Filter eligible items (not expired or no payment)
            const eligibleItems = selectedRenewals.filter(isEligibleForRenewal);
            const nonEligibleItems = selectedRenewals.filter(r => !isEligibleForRenewal(r));

            // Update eligible items to "Renewed"
            if (eligibleItems.length > 0) {
                setRenevals(prev =>
                    prev.map(renewal => {
                        if (eligibleItems.some(item => item.id === renewal.id)) {
                            return { ...renewal, status: 'Renewed' };
                        }
                        return renewal;
                    })
                );
            }

            // Generate user-friendly message
            const message = generateRenewalUpdateMessage(eligibleItems, nonEligibleItems);

            return {
                success: true,
                message,
                updatedCount: eligibleItems.length,
                skippedCount: nonEligibleItems.length
            };

        } catch (error) {
            console.error('Error bulk updating renewals:', error);
            return {
                success: false,
                message: 'An error occurred while updating renewals. Please try again.',
                updatedCount: 0,
                skippedCount: renewalIds.length
            };
        } finally {
            setLoading(false);
        }
    }, [renewals]);

    // Send license (for controllers)
    const sendLicense = useCallback(async (type: 'approval' | 'renewal', itemId: string): Promise<boolean> => {
        setLoading(true);
        try {
            // In real app, this would call API to send email with license
            console.log(`Sending ${type} license for item:`, itemId);

            if (type === 'approval') {
                // Mark approval as processed
                setApprovals(prev =>
                    prev.map(approval =>
                        approval.id === itemId
                            ? { ...approval, status: 'approved' }
                            : approval
                    )
                );
            } else {
                // Mark renewal as processed
                setRenevals(prev =>
                    prev.map(renewal =>
                        renewal.id === itemId
                            ? { ...renewal, status: 'Renewed' }
                            : renewal
                    )
                );
            }

            return true;
        } catch (error) {
            console.error('Error sending license:', error);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    // Update renewal payment status
    const updatePaymentStatus = useCallback(async (renewalId: string, paymentStatus: string): Promise<boolean> => {
        setLoading(true);
        try {
            setRenevals(prev =>
                prev.map(renewal =>
                    renewal.id === renewalId
                        ? { ...renewal, payment: paymentStatus }
                        : renewal
                )
            );
            return true;
        } catch (error) {
            console.error('Error updating payment status:', error);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    // Get license statistics
    const getLicenseStats = useCallback(() => {
        const approvalStats = {
            total: approvals.length,
            approved: approvals.filter(a => a.status === 'approved').length,
            pending: approvals.filter(a => a.status === 'pending').length,
            rejected: approvals.filter(a => a.status === 'reject').length,
        };

        const renewalStats = {
            total: renewals.length,
            expired: renewals.filter(r => r.daysUntilExpiry < 0).length,
            expiringSoon: renewals.filter(r => r.daysUntilExpiry > 0 && r.daysUntilExpiry <= 30).length,
            renewed: renewals.filter(r => r.status === 'Renewed').length,
            unpaid: renewals.filter(r => r.payment === 'None' || r.payment === 'Not Started').length,
            requiresRenewal: renewals.filter(r => r.status === 'Renew Required').length,
        };

        return { approvalStats, renewalStats };
    }, [approvals, renewals]);

    // Get renewals that can be processed (for UI feedback)
    const getProcessableRenewals = useCallback((renewalIds: string[]) => {
        const selectedRenewals = renewals.filter(renewal => renewalIds.includes(renewal.id));
        return categorizeRenewalItems(selectedRenewals);
    }, [renewals]);

    // Check for email alerts every hour
    useEffect(() => {
        const interval = setInterval(checkAndSendEmailAlerts, 60 * 60 * 1000); // 1 hour
        return () => clearInterval(interval);
    }, [checkAndSendEmailAlerts]);

    return {
        approvals,
        renewals,
        loading,
        setApprovals,
        setRenevals,
        updateApprovalStatus,
        updateRenewalStatus,
        bulkUpdateRenewals,
        sendLicense,
        updatePaymentStatus,
        getLicenseStats,
        getProcessableRenewals,
        checkAndSendEmailAlerts
    };
};