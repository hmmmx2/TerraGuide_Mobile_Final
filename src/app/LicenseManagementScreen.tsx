import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    Modal,
    Pressable
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AdminHeader } from '@/components/AdminHeader';
import { AdminNavBar } from '@/components/AdminNavBar';
import { Container } from '@/components/Container';
import { useAuth } from '@/context/AuthProvider';

// Types
interface LicenseApproval {
    id: string;
    userName: string;
    course: string;
    mentorProgramme: string;
    exam: string;
    status: 'approved' | 'reject' | 'pending';
}

interface LicenseRenewal {
    id: string;
    userName: string;
    startDate: string;
    expiredDate: string;
    payment: string;
    status: string;
    daysUntilExpiry: number;
}

// Edit State Interface
interface EditState {
    approvalEditing: boolean;
    renewalEditing: boolean;
    showStatusModal: boolean;
    selectedApprovalItem: LicenseApproval | null;
    selectedRenewalItem: LicenseRenewal | null;
    statusType: 'approval' | 'renewal';
}

// Mock data for License Approval Management
const mockApprovalData: LicenseApproval[] = [
    { id: '1', userName: 'Timmy He', course: 'Completed', mentorProgramme: 'Completed', exam: 'Pass', status: 'approved' },
    { id: '2', userName: 'Jimmy He', course: 'Completed', mentorProgramme: 'Completed', exam: 'Pass', status: 'approved' },
    { id: '3', userName: 'Gimmy He', course: 'Completed', mentorProgramme: 'Completed', exam: 'Pass', status: 'approved' },
    { id: '4', userName: 'Alvin He', course: 'Completed', mentorProgramme: 'Completed', exam: 'Pass', status: 'approved' },
    { id: '5', userName: 'Aaron He', course: 'Completed', mentorProgramme: 'Completed', exam: 'Pass', status: 'approved' },
    { id: '6', userName: 'Timmy He', course: 'Completed', mentorProgramme: 'Completed', exam: 'Failed', status: 'reject' },
    { id: '7', userName: 'Timmy He', course: 'Completed', mentorProgramme: 'Completed', exam: 'Failed', status: 'reject' },
    { id: '8', userName: 'Timmy He', course: 'Completed', mentorProgramme: 'In Progress', exam: 'Not Started', status: 'pending' },
    { id: '9', userName: 'Timmy He', course: 'Completed', mentorProgramme: 'Incomplete', exam: 'Not Started', status: 'pending' },
    { id: '10', userName: 'Timmy He', course: 'In Progress', mentorProgramme: 'Not Started', exam: 'Not Started', status: 'pending' },
    { id: '11', userName: 'Timmy He', course: 'In Progress', mentorProgramme: 'Not Started', exam: 'Not Started', status: 'pending' },
    { id: '12', userName: 'Timmy He', course: 'In Progress', mentorProgramme: 'Not Started', exam: 'Not Started', status: 'pending' },
];

// Mock data for License Renewal Management
const mockRenewalData: LicenseRenewal[] = [
    { id: '1', userName: 'Timmy He', startDate: '14/3/2023', expiredDate: '14/3/2026', payment: 'None', status: 'Expired', daysUntilExpiry: -30 },
    { id: '2', userName: 'Jimmy He', startDate: '19/3/2023', expiredDate: '19/3/2026', payment: 'Done', status: 'Renew Required', daysUntilExpiry: 45 },
    { id: '3', userName: 'Gimmy He', startDate: '14/3/2023', expiredDate: '14/3/2026', payment: 'Done', status: 'Renew Required', daysUntilExpiry: 45 },
    { id: '4', userName: 'Alvin He', startDate: '29/7/2020', expiredDate: '29/7/2023', payment: 'Done', status: 'Renewed', daysUntilExpiry: -500 },
    { id: '5', userName: 'Aaron He', startDate: '28/8/2023', expiredDate: '28/8/2026', payment: 'None', status: 'Expired', daysUntilExpiry: -100 },
    { id: '6', userName: 'Timmy He', startDate: '19/3/2023', expiredDate: '19/3/2026', payment: 'None', status: 'No Payment', daysUntilExpiry: 45 },
    { id: '7', userName: 'Timmy He', startDate: '14/3/2023', expiredDate: '14/3/2026', payment: 'Incomplete', status: 'No Payment', daysUntilExpiry: 45 },
    { id: '8', userName: 'Timmy He', startDate: '19/3/2023', expiredDate: '19/3/2026', payment: 'In Progress', status: 'No Payment', daysUntilExpiry: 45 },
    { id: '9', userName: 'Timmy He', startDate: '14/3/2023', expiredDate: '14/3/2026', payment: 'Incomplete', status: 'No Payment', daysUntilExpiry: 45 },
    { id: '10', userName: 'Timmy He', startDate: '19/3/2023', expiredDate: '19/3/2026', payment: 'Not Started', status: 'No Payment', daysUntilExpiry: 45 },
    { id: '11', userName: 'Timmy He', startDate: '14/3/2023', expiredDate: '14/3/2026', payment: 'Not Started', status: 'No Payment', daysUntilExpiry: 45 },
];

export default function LicenseManagementScreen() {
    const router = useRouter();
    const { session } = useAuth();
    const [userName, setUserName] = useState('Admin');
    const [userRole, setUserRole] = useState<string>('');

    // Consolidated Edit State
    const [editState, setEditState] = useState<EditState>({
        approvalEditing: false,
        renewalEditing: false,
        showStatusModal: false,
        selectedApprovalItem: null,
        selectedRenewalItem: null,
        statusType: 'approval'
    });

    // Checkbox selection state for renewals
    const [selectedRenewalIds, setSelectedRenewalIds] = useState<string[]>([]);

    // Data States
    const [approvalData, setApprovalData] = useState<LicenseApproval[]>(mockApprovalData);
    const [filteredApprovalData, setFilteredApprovalData] = useState<LicenseApproval[]>(mockApprovalData);
    const [approvalSearchQuery, setApprovalSearchQuery] = useState('');

    const [renewalData, setRenewalData] = useState<LicenseRenewal[]>(mockRenewalData);
    const [filteredRenewalData, setFilteredRenewalData] = useState<LicenseRenewal[]>(mockRenewalData);
    const [renewalSearchQuery, setRenewalSearchQuery] = useState('');

    useEffect(() => {
        // Check user permissions
        if (session?.user) {
            const userMetadata = session.user.user_metadata;
            if (userMetadata) {
                setUserName(userMetadata.first_name || 'Admin');
                const role = userMetadata.role?.toString().trim().toLowerCase();
                setUserRole(role);

                if (role !== 'admin' && role !== 'controller') {
                    Alert.alert('Access Denied', 'You do not have permission to access this page.');
                    router.replace('/CourseScreen');
                    return;
                }
            }
        }
    }, [session, router]);

    // Filter approval data
    useEffect(() => {
        if (approvalSearchQuery.trim() === '') {
            setFilteredApprovalData(approvalData);
        } else {
            const filtered = approvalData.filter(item =>
                item.userName.toLowerCase().includes(approvalSearchQuery.toLowerCase()) ||
                item.course.toLowerCase().includes(approvalSearchQuery.toLowerCase()) ||
                item.mentorProgramme.toLowerCase().includes(approvalSearchQuery.toLowerCase()) ||
                item.exam.toLowerCase().includes(approvalSearchQuery.toLowerCase()) ||
                item.status.toLowerCase().includes(approvalSearchQuery.toLowerCase())
            );
            setFilteredApprovalData(filtered);
        }
    }, [approvalSearchQuery, approvalData]);

    // Filter renewal data
    useEffect(() => {
        if (renewalSearchQuery.trim() === '') {
            setFilteredRenewalData(renewalData);
        } else {
            const filtered = renewalData.filter(item =>
                item.userName.toLowerCase().includes(renewalSearchQuery.toLowerCase()) ||
                item.startDate.includes(renewalSearchQuery) ||
                item.expiredDate.includes(renewalSearchQuery) ||
                item.payment.toLowerCase().includes(renewalSearchQuery.toLowerCase()) ||
                item.status.toLowerCase().includes(renewalSearchQuery.toLowerCase())
            );
            setFilteredRenewalData(filtered);
        }
    }, [renewalSearchQuery, renewalData]);

    const getStatusColor = (status: string) => {
        const lowerStatus = status.toLowerCase();

        // License Approval Statuses
        if (lowerStatus.includes('approved')) return 'bg-green-100 text-green-800 border-green-200';
        if (lowerStatus.includes('reject')) return 'bg-red-100 text-red-800 border-red-200';
        if (lowerStatus.includes('pending')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';

        // License Renewal Statuses
        if (lowerStatus.includes('expired')) return 'bg-red-100 text-red-800 border-red-200';
        if (lowerStatus.includes('renewed')) return 'bg-green-100 text-green-800 border-green-200';
        if (lowerStatus.includes('renew required')) return 'bg-orange-100 text-orange-800 border-orange-200';
        if (lowerStatus.includes('no payment')) return 'bg-purple-100 text-purple-800 border-purple-200';

        return 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const handleSendLicense = (type: 'approval' | 'renewal', itemId: string) => {
        if (userRole !== 'controller') {
            Alert.alert('Permission Denied', 'Only controllers can send licenses.');
            return;
        }

        const itemType = type === 'approval' ? 'license' : 'renewal license';
        Alert.alert(
            'Confirm Send',
            `Are you sure you want to send the ${itemType} to this park guide?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Send',
                    onPress: () => {
                        Alert.alert('Success', `${itemType} sent successfully!`);
                        console.log(`Sending ${itemType} for item:`, itemId);
                    }
                }
            ]
        );
    };

    const handleDeleteApprovalItem = (itemId: string) => {
        if (userRole !== 'admin' && userRole !== 'controller') {
            Alert.alert('Permission Denied', 'Only admins and controllers can delete items.');
            return;
        }

        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this approval record?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        setApprovalData(prev => prev.filter(item => item.id !== itemId));
                        Alert.alert('Success', 'Approval record deleted successfully!');
                    }
                }
            ]
        );
    };

    const handleDeleteRenewalItem = (itemId: string) => {
        if (userRole !== 'admin' && userRole !== 'controller') {
            Alert.alert('Permission Denied', 'Only admins and controllers can delete items.');
            return;
        }

        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this renewal record?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        setRenewalData(prev => prev.filter(item => item.id !== itemId));
                        Alert.alert('Success', 'Renewal record deleted successfully!');
                    }
                }
            ]
        );
    };

    // Helper function to check if a renewal can be updated to "Renewed"
    const canBeRenewed = (renewal: LicenseRenewal): boolean => {
        const lowerStatus = renewal.status.toLowerCase();
        return !lowerStatus.includes('expired') && !lowerStatus.includes('no payment');
    };

    const handleSaveChanges = () => {
        // This function is now only for the "Save the changes" button
        // Renewal processing is handled in toggleRenewalEdit when clicking "Done"
        Alert.alert('Success', 'All changes have been saved successfully!');

        // Reset edit states
        setEditState(prev => ({
            ...prev,
            approvalEditing: false,
            renewalEditing: false
        }));

        // Clear checkbox selections
        setSelectedRenewalIds([]);
    };

    const handleEditApprovalStatus = (item: LicenseApproval) => {
        setEditState(prev => ({
            ...prev,
            selectedApprovalItem: item,
            statusType: 'approval',
            showStatusModal: true
        }));
    };

    const handleEditRenewalStatus = (item: LicenseRenewal) => {
        setEditState(prev => ({
            ...prev,
            selectedRenewalItem: item,
            statusType: 'renewal',
            showStatusModal: true
        }));
    };

    const handleStatusUpdate = (newStatus: string) => {
        if (editState.statusType === 'approval' && editState.selectedApprovalItem) {
            setApprovalData(prev =>
                prev.map(item =>
                    item.id === editState.selectedApprovalItem!.id
                        ? { ...item, status: newStatus as 'approved' | 'reject' | 'pending' }
                        : item
                )
            );
        } else if (editState.statusType === 'renewal' && editState.selectedRenewalItem) {
            setRenewalData(prev =>
                prev.map(item =>
                    item.id === editState.selectedRenewalItem!.id
                        ? { ...item, status: newStatus }
                        : item
                )
            );
        }

        setEditState(prev => ({
            ...prev,
            showStatusModal: false,
            selectedApprovalItem: null,
            selectedRenewalItem: null
        }));

        Alert.alert('Success', 'Status updated successfully!');
    };

    const toggleApprovalEdit = () => {
        setEditState(prev => ({
            ...prev,
            approvalEditing: !prev.approvalEditing
        }));
    };

    const toggleRenewalEdit = () => {
        // If we're currently in edit mode and clicking "Done", process the selected items first
        if (editState.renewalEditing) {
            handleRenewalSaveChanges();
        } else {
            // If we're entering edit mode, just toggle the state
            setEditState(prev => ({
                ...prev,
                renewalEditing: true
            }));
        }
    };

    const handleRenewalSaveChanges = () => {
        if (selectedRenewalIds.length > 0) {
            // Process renewal updates
            const selectedRenewals = renewalData.filter(renewal =>
                selectedRenewalIds.includes(renewal.id)
            );

            // Filter items that CAN be updated (exclude "Expired" and "No Payment")
            const renewableItems = selectedRenewals.filter(renewal => {
                const lowerStatus = renewal.status.toLowerCase();
                return !lowerStatus.includes('expired') && !lowerStatus.includes('no payment');
            });

            // Filter items that CANNOT be updated
            const nonRenewableItems = selectedRenewals.filter(renewal => {
                const lowerStatus = renewal.status.toLowerCase();
                return lowerStatus.includes('expired') || lowerStatus.includes('no payment');
            });

            if (renewableItems.length > 0) {
                // Update eligible items to "Renewed"
                setRenewalData(prev =>
                    prev.map(renewal => {
                        if (renewableItems.some(item => item.id === renewal.id)) {
                            return { ...renewal, status: 'Renewed' };
                        }
                        return renewal;
                    })
                );

                let message = `${renewableItems.length} renewal record(s) updated to "Renewed" successfully!`;

                if (nonRenewableItems.length > 0) {
                    const expiredCount = nonRenewableItems.filter(item =>
                        item.status.toLowerCase().includes('expired')
                    ).length;
                    const noPaymentCount = nonRenewableItems.filter(item =>
                        item.status.toLowerCase().includes('no payment')
                    ).length;

                    message += `\n\n${nonRenewableItems.length} item(s) could not be updated:`;
                    if (expiredCount > 0) message += `\n• ${expiredCount} expired license(s) (cannot be renewed)`;
                    if (noPaymentCount > 0) message += `\n• ${noPaymentCount} no payment status (cannot be renewed)`;
                }

                Alert.alert('Update Complete', message);
            } else if (nonRenewableItems.length > 0) {
                // No items can be renewed
                let message = 'No items could be updated to "Renewed".';

                const expiredCount = nonRenewableItems.filter(item =>
                    item.status.toLowerCase().includes('expired')
                ).length;
                const noPaymentCount = nonRenewableItems.filter(item =>
                    item.status.toLowerCase().includes('no payment')
                ).length;

                message += '\n\nSelected items cannot be updated:';
                if (expiredCount > 0) message += `\n• ${expiredCount} expired license(s)`;
                if (noPaymentCount > 0) message += `\n• ${noPaymentCount} no payment status`;

                Alert.alert('No Updates', message);
            }
        }

        // Exit edit mode and clear selections
        setEditState(prev => ({
            ...prev,
            renewalEditing: false
        }));
        setSelectedRenewalIds([]);
    };

    const closeStatusModal = () => {
        setEditState(prev => ({
            ...prev,
            showStatusModal: false,
            selectedApprovalItem: null,
            selectedRenewalItem: null
        }));
    };

    const handleCheckboxToggle = (renewalId: string) => {
        setSelectedRenewalIds(prev => {
            if (prev.includes(renewalId)) {
                return prev.filter(id => id !== renewalId);
            } else {
                return [...prev, renewalId];
            }
        });
    };

    const handleSelectAllCheckboxes = () => {
        if (selectedRenewalIds.length === filteredRenewalData.length) {
            setSelectedRenewalIds([]);
        } else {
            setSelectedRenewalIds(filteredRenewalData.map(item => item.id));
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F8F9FA]">
            <ScrollView className="flex-1">
                <Container className="py-6">
                    {/* Header */}
                    <AdminHeader
                        username={userName}
                        onDextAIPress={() => console.log('DextAI pressed')}
                        onNotificationPress={() => console.log('Notification pressed')}
                        onMenuPress={() => console.log('Menu pressed')}
                    />

                    {/* License Approval Management Section */}
                    <View className="mt-6">
                        <View className="flex-row justify-between items-start mb-4">
                            <View className="flex-1 mr-4">
                                <Text className="text-2xl font-bold text-gray-800 flex-wrap">
                                    License Approval Management
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={toggleApprovalEdit}
                                className="px-4 py-2"
                            >
                                <Text className="text-[#4E6E4E] text-sm font-medium">
                                    {editState.approvalEditing ? 'Done' : 'Edit'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Search Bar and Send Button */}
                        <View className="flex-row justify-between items-center mb-4">
                            <View className="flex-row items-center bg-white rounded-full px-4 py-2 flex-1 mr-3 shadow-sm">
                                <Ionicons name="search" size={16} color="#868795" />
                                <TextInput
                                    placeholder="Search"
                                    value={approvalSearchQuery}
                                    onChangeText={setApprovalSearchQuery}
                                    className="ml-2 flex-1 text-sm"
                                    placeholderTextColor="#868795"
                                />
                                {approvalSearchQuery.length > 0 && (
                                    <TouchableOpacity onPress={() => setApprovalSearchQuery('')}>
                                        <Ionicons name="close" size={16} color="#868795" />
                                    </TouchableOpacity>
                                )}
                            </View>

                            <TouchableOpacity
                                onPress={() => handleSendLicense('approval', 'bulk')}
                                disabled={userRole !== 'controller'}
                                className={`px-4 py-2 rounded-full shadow-sm ${
                                    userRole === 'controller' ? 'bg-[#6D7E5E]' : 'bg-gray-400'
                                }`}
                            >
                                <Text className="text-white text-sm font-medium">Send</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Approval Table Header */}
                        <View className="bg-[#E6ECD6] p-3 rounded-t-lg">
                            <View className="flex-row items-center">
                                <Text className="flex-1 font-semibold text-xs text-gray-700">User Name</Text>
                                <Text className="flex-1 font-semibold text-xs text-gray-700">Course</Text>
                                <Text className="flex-1 font-semibold text-xs text-gray-700">Mentor Programme</Text>
                                <Text className="flex-1 font-semibold text-xs text-gray-700">Exam</Text>
                                <Text className="w-20 font-semibold text-xs text-gray-700 text-center">Status</Text>
                                {editState.approvalEditing && (
                                    <Text className="w-12 font-semibold text-xs text-gray-700 text-center">Action</Text>
                                )}
                            </View>
                        </View>

                        {/* Approval Table Body */}
                        <View className="bg-white rounded-b-lg shadow-sm">
                            {filteredApprovalData.map((item, index) => (
                                <View
                                    key={item.id}
                                    className={`p-3 ${index !== filteredApprovalData.length - 1 ? 'border-b border-gray-100' : ''}`}
                                >
                                    <View className="flex-row items-center">
                                        <Text className="flex-1 text-xs text-gray-800">{item.userName}</Text>
                                        <Text className="flex-1 text-xs text-gray-600">{item.course}</Text>
                                        <Text className="flex-1 text-xs text-gray-600">{item.mentorProgramme}</Text>
                                        <Text className="flex-1 text-xs text-gray-600">{item.exam}</Text>

                                        <View className="w-20 items-center">
                                            <TouchableOpacity
                                                onPress={() => {
                                                    if (editState.approvalEditing && (userRole === 'admin' || userRole === 'controller')) {
                                                        handleEditApprovalStatus(item);
                                                    }
                                                }}
                                                disabled={!editState.approvalEditing || (userRole !== 'admin' && userRole !== 'controller')}
                                            >
                                                <View className={`px-2 py-1 rounded-md border ${getStatusColor(item.status)}`}>
                                                    <Text className="text-xs font-medium capitalize">{item.status}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>

                                        {editState.approvalEditing && (userRole === 'admin' || userRole === 'controller') && (
                                            <View className="w-12 items-center">
                                                <TouchableOpacity
                                                    onPress={() => handleDeleteApprovalItem(item.id)}
                                                    className="p-1"
                                                >
                                                    <Ionicons name="close" size={14} color="#ef4444" />
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* License Renewal Management Section */}
                    <View className="mt-8">
                        <View className="flex-row justify-between items-start mb-4">
                            <View className="flex-1 mr-4">
                                <Text className="text-2xl font-bold text-gray-800 flex-wrap">
                                    License Renewal Management
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={toggleRenewalEdit}
                                className="px-4 py-2"
                            >
                                <Text className="text-[#4E6E4E] text-sm font-medium">
                                    {editState.renewalEditing ? 'Done' : 'Edit'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Search Bar and Send Button */}
                        <View className="flex-row justify-between items-center mb-4">
                            <View className="flex-row items-center bg-white rounded-full px-4 py-2 flex-1 mr-3 shadow-sm">
                                <Ionicons name="search" size={16} color="#868795" />
                                <TextInput
                                    placeholder="Search"
                                    value={renewalSearchQuery}
                                    onChangeText={setRenewalSearchQuery}
                                    className="ml-2 flex-1 text-sm"
                                    placeholderTextColor="#868795"
                                />
                                {renewalSearchQuery.length > 0 && (
                                    <TouchableOpacity onPress={() => setRenewalSearchQuery('')}>
                                        <Ionicons name="close" size={16} color="#868795" />
                                    </TouchableOpacity>
                                )}
                            </View>

                            <TouchableOpacity
                                onPress={() => handleSendLicense('renewal', 'bulk')}
                                disabled={userRole !== 'controller'}
                                className={`px-4 py-2 rounded-full shadow-sm ${
                                    userRole === 'controller' ? 'bg-[#6D7E5E]' : 'bg-gray-400'
                                }`}
                            >
                                <Text className="text-white text-sm font-medium">Send</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Renewal Table Header */}
                        <View className="bg-[#E6ECD6] p-3 rounded-t-lg">
                            <View className="flex-row items-center">
                                <Text className="flex-1 font-semibold text-xs text-gray-700">User Name</Text>
                                <Text className="flex-1 font-semibold text-xs text-gray-700">Expired Date</Text>
                                <Text className="flex-1 font-semibold text-xs text-gray-700">Payment</Text>
                                <Text className="w-20 font-semibold text-xs text-gray-700 text-center">Status</Text>
                                <View className="w-16 items-center">
                                    {editState.renewalEditing ? (
                                        <TouchableOpacity onPress={handleSelectAllCheckboxes}>
                                            <View className={`w-8 h-8 border-2 rounded ${
                                                selectedRenewalIds.length === filteredRenewalData.length
                                                    ? 'bg-[#6D7E5E] border-[#6D7E5E]'
                                                    : 'bg-gray-300 border-gray-400'
                                            } items-center justify-center`}>
                                                {selectedRenewalIds.length === filteredRenewalData.length && (
                                                    <Ionicons name="checkmark" size={16} color="white" />
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                    ) : (
                                        <Text className="font-semibold text-xs text-gray-700">Check</Text>
                                    )}
                                </View>
                                {editState.renewalEditing && (
                                    <Text className="w-12 font-semibold text-xs text-gray-700 text-center">Action</Text>
                                )}
                            </View>
                        </View>

                        {/* Renewal Table Body */}
                        <View className="bg-white rounded-b-lg shadow-sm">
                            {filteredRenewalData.map((item, index) => (
                                <View
                                    key={item.id}
                                    className={`p-3 ${index !== filteredRenewalData.length - 1 ? 'border-b border-gray-100' : ''}`}
                                >
                                    <View className="flex-row items-center">
                                        <Text className="flex-1 text-xs text-gray-800">{item.userName}</Text>
                                        <Text className="flex-1 text-xs text-gray-600">{item.expiredDate}</Text>
                                        <Text className="flex-1 text-xs text-gray-600">{item.payment}</Text>

                                        <View className="w-20 items-center">
                                            <TouchableOpacity
                                                onPress={() => {
                                                    if (editState.renewalEditing && (userRole === 'admin' || userRole === 'controller')) {
                                                        handleEditRenewalStatus(item);
                                                    }
                                                }}
                                                disabled={!editState.renewalEditing || (userRole !== 'admin' && userRole !== 'controller')}
                                            >
                                                <View className={`px-1 py-1 rounded-md border ${getStatusColor(item.status)}`}>
                                                    <Text className="text-xs font-medium text-center">{item.status}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>

                                        <View className="w-16 items-center">
                                            {editState.renewalEditing ? (
                                                <TouchableOpacity onPress={() => handleCheckboxToggle(item.id)}>
                                                    <View className={`w-8 h-8 border-2 rounded ${
                                                        selectedRenewalIds.includes(item.id)
                                                            ? 'bg-[#6D7E5E] border-[#6D7E5E]'
                                                            : 'bg-gray-300 border-gray-400'
                                                    } items-center justify-center`}>
                                                        {selectedRenewalIds.includes(item.id) && (
                                                            <Ionicons name="checkmark" size={16} color="white" />
                                                        )}
                                                    </View>
                                                </TouchableOpacity>
                                            ) : (
                                                <View className="w-8 h-8 bg-gray-400 rounded" />
                                            )}
                                        </View>

                                        {editState.renewalEditing && (userRole === 'admin' || userRole === 'controller') && (
                                            <View className="w-12 items-center">
                                                <TouchableOpacity
                                                    onPress={() => handleDeleteRenewalItem(item.id)}
                                                    className="p-1"
                                                >
                                                    <Ionicons name="close" size={14} color="#ef4444" />
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Selection Info for Renewal Management */}
                    {editState.renewalEditing && selectedRenewalIds.length > 0 && (
                        <View className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <Text className="text-blue-800 text-sm font-medium text-center">
                                {selectedRenewalIds.length} renewal record(s) selected
                            </Text>
                            <Text className="text-blue-600 text-xs text-center mt-1">
                                Items with "Expired" or "No Payment" status cannot be updated. Click "Done" to process selected items.
                            </Text>
                        </View>
                    )}

                    {/* Save Changes Button - Only for additional manual saves if needed */}
                    {editState.approvalEditing && (
                        <View className="mt-8">
                            <TouchableOpacity
                                onPress={handleSaveChanges}
                                className="bg-[#6D7E5E] py-4 rounded-full shadow-sm"
                            >
                                <Text className="text-center text-white text-lg font-semibold">
                                    Save the changes
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </Container>
            </ScrollView>

            {/* Status Edit Modal */}
            <Modal
                visible={editState.showStatusModal}
                transparent
                animationType="fade"
                onRequestClose={closeStatusModal}
            >
                <Pressable
                    className="flex-1 bg-black bg-opacity-50 justify-center items-center"
                    onPress={closeStatusModal}
                >
                    <Pressable className="bg-white rounded-lg p-6 w-80 max-w-[90%]">
                        <Text className="text-lg font-bold text-center mb-4">Edit Status</Text>
                        <Text className="text-sm text-gray-600 text-center mb-6">
                            Select new status for {editState.statusType === 'approval' ? editState.selectedApprovalItem?.userName : editState.selectedRenewalItem?.userName}
                        </Text>

                        {editState.statusType === 'approval' ? (
                            // Approval Status Options
                            <>
                                {['approved', 'reject', 'pending'].map((status) => (
                                    <TouchableOpacity
                                        key={status}
                                        onPress={() => handleStatusUpdate(status)}
                                        className={`p-3 rounded-lg mb-2 ${
                                            editState.selectedApprovalItem?.status === status
                                                ? 'bg-[#6D7E5E]'
                                                : 'bg-gray-100'
                                        }`}
                                    >
                                        <Text className={`text-center font-medium capitalize ${
                                            editState.selectedApprovalItem?.status === status
                                                ? 'text-white'
                                                : 'text-gray-800'
                                        }`}>
                                            {status}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </>
                        ) : (
                            // Renewal Status Options
                            <>
                                {['Expired', 'Renew Required', 'Renewed', 'No Payment'].map((status) => (
                                    <TouchableOpacity
                                        key={status}
                                        onPress={() => handleStatusUpdate(status)}
                                        className={`p-3 rounded-lg mb-2 ${
                                            editState.selectedRenewalItem?.status === status
                                                ? 'bg-[#6D7E5E]'
                                                : 'bg-gray-100'
                                        }`}
                                    >
                                        <Text className={`text-center font-medium ${
                                            editState.selectedRenewalItem?.status === status
                                                ? 'text-white'
                                                : 'text-gray-800'
                                        }`}>
                                            {status}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </>
                        )}

                        <TouchableOpacity
                            onPress={closeStatusModal}
                            className="mt-4 p-3 border border-gray-300 rounded-lg"
                        >
                            <Text className="text-center text-gray-600 font-medium">Cancel</Text>
                        </TouchableOpacity>
                    </Pressable>
                </Pressable>
            </Modal>

            <AdminNavBar activeRoute="/LicenseManagementScreen" />
        </SafeAreaView>
    );
}