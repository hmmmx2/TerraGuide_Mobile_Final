import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthProvider';
import { toast } from '@/components/CustomToast';

// Time in milliseconds before session expiry to show warning
const WARNING_BEFORE_EXPIRY = 5 * 60 * 1000; // 5 minutes

export const SessionExpiryWarning = () => {
  const { session } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(WARNING_BEFORE_EXPIRY / 1000);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const checkSessionExpiry = useCallback(async () => {
    if (!session) return;
    
    // Calculate time until expiry
    const expiresAt = new Date(session.expires_at * 1000);
    const now = new Date();
    const timeUntilExpiry = expiresAt.getTime() - now.getTime();
    
    // If session is about to expire, show warning
    if (timeUntilExpiry > 0 && timeUntilExpiry <= WARNING_BEFORE_EXPIRY) {
      setCountdown(Math.floor(timeUntilExpiry / 1000));
      setShowModal(true);
      
      // Start countdown timer
      if (timer) clearInterval(timer);
      const countdownTimer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownTimer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      setTimer(countdownTimer);
    }
  }, [session, timer]);

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) throw error;
      
      // Close modal and clear timer
      setShowModal(false);
      if (timer) clearInterval(timer);
      setTimer(null);
      
      toast.success('Session extended successfully');
    } catch (error: any) {
      console.error('Failed to refresh session:', error.message);
      toast.error('Failed to extend session. Please log in again.');
    }
  };

  useEffect(() => {
    // Check session expiry every minute
    const sessionCheckInterval = setInterval(checkSessionExpiry, 60 * 1000);
    
    // Initial check
    checkSessionExpiry();
    
    return () => {
      clearInterval(sessionCheckInterval);
      if (timer) clearInterval(timer);
    };
  }, [checkSessionExpiry, timer]);

  // Format countdown as MM:SS
  const formatCountdown = () => {
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!showModal) return null;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={showModal}
      onRequestClose={() => setShowModal(false)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Session Expiring Soon</Text>
          <Text style={styles.modalText}>
            Your session will expire in {formatCountdown()}. Would you like to extend it?
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.extendButton]}
              onPress={refreshSession}
            >
              <Text style={styles.buttonText}>Extend Session</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.logoutButton]}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.buttonTextSecondary}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#4E6E4E',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    minWidth: '45%',
    alignItems: 'center',
  },
  extendButton: {
    backgroundColor: '#6D7E5E',
  },
  logoutButton: {
    backgroundColor: '#E6ECD6',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonTextSecondary: {
    color: '#4E6E4E',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});