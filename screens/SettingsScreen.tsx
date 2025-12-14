// src/screens/SettingsScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput,
  Modal,
  Pressable
} from 'react-native';
import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as Clipboard from 'expo-clipboard';

// Define user type
interface User {
  id: string;
  email: string;
  updated_at?: string;
  created_at?: string;
  // Add other user properties as needed
}

interface SettingsScreenProps {
  navigation: {
    reset: (params: { index: number; routes: Array<{ name: string }> }) => void;
  };
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  useEffect(() => {
    loadUserSettings();
    checkNotificationPermissions();
  }, []);

  const loadUserSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser({
          id: user.id,
          email: user.email || '',
          updated_at: user.updated_at,
          created_at: user.created_at
        });
      }
      
      // Load saved settings
      const settings = await AsyncStorage.getItem('blacksfit_settings');
      if (settings) {
        const parsed = JSON.parse(settings);
        setNotificationsEnabled(parsed.notificationsEnabled || false);
        setDarkMode(parsed.darkMode !== undefined ? parsed.darkMode : true);
        setBiometricEnabled(parsed.biometricEnabled || false);
        setAutoSync(parsed.autoSync !== undefined ? parsed.autoSync : true);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkNotificationPermissions = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      setNotificationsEnabled(status === 'granted');
    } catch (error) {
      console.error('Error checking notifications:', error);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const settings = {
        notificationsEnabled,
        darkMode,
        biometricEnabled,
        autoSync,
        lastUpdated: new Date().toISOString()
      };
      
      await AsyncStorage.setItem('blacksfit_settings', JSON.stringify(settings));
      Alert.alert('Success', 'Settings saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all password fields');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (!user?.email) {
      Alert.alert('Error', 'User email not found');
      return;
    }

    setSaving(true);
    try {
      // First verify current password by signing in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword
      });

      if (signInError) {
        throw new Error('Current password is incorrect');
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;

      Alert.alert(
        'Success',
        'Password updated successfully',
        [
          {
            text: 'OK',
            onPress: () => {
              setShowChangePassword(false);
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
            }
          }
        ]
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update password';
      Alert.alert('Error', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const toggleNotifications = async () => {
    try {
      if (!notificationsEnabled) {
        const { status } = await Notifications.requestPermissionsAsync();
        setNotificationsEnabled(status === 'granted');
      } else {
        setNotificationsEnabled(false);
      }
      saveSettings();
    } catch (error) {
      console.error('Error toggling notifications:', error);
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await supabase.auth.signOut();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Welcome' }],
              });
            } catch (error) {
              console.error('Error signing out:', error);
            }
          }
        }
      ]
    );
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') {
      Alert.alert('Error', 'Please type DELETE to confirm account deletion');
      return;
    }

    Alert.alert(
      'Delete Account',
      'This action is irreversible. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: async () => {
            setSaving(true);
            try {
              Alert.alert(
                'Account Deletion Request',
                'Please contact support at support@blacksfit.com to delete your account.',
                [{ text: 'OK' }]
              );
              setShowDeleteAccount(false);
              setDeleteConfirm('');
            } catch (error) {
              Alert.alert('Error', 'Failed to process deletion request');
            } finally {
              setSaving(false);
            }
          }
        }
      ]
    );
  };

  const copyUserId = async () => {
    if (user?.id) {
      try {
        await Clipboard.setStringAsync(user.id);
        Alert.alert('Copied', 'User ID copied to clipboard');
      } catch (error) {
        console.error('Error copying to clipboard:', error);
      }
    }
  };

  const copyEmail = async () => {
    if (user?.email) {
      try {
        await Clipboard.setStringAsync(user.email);
        Alert.alert('Copied', 'Email copied to clipboard');
      } catch (error) {
        console.error('Error copying email:', error);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>Loading settings...</Text>
      </View>
    );
  }

  interface SettingItemProps {
    title: string;
    description?: string;
    rightComponent: React.ReactNode;
  }

  const SettingItem: React.FC<SettingItemProps> = ({ title, description, rightComponent }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingTextContainer}>
        <Text style={styles.settingTitle}>{title}</Text>
        {description && <Text style={styles.settingDescription}>{description}</Text>}
      </View>
      {rightComponent}
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Manage your account and preferences</Text>
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <SettingItem
          title="Email"
          description={user?.email || 'Not available'}
          rightComponent={
            <TouchableOpacity 
              style={styles.copyButton} 
              onPress={copyEmail}
              disabled={!user?.email}
            >
              <Text style={styles.copyButtonText}>Copy</Text>
            </TouchableOpacity>
          }
        />
        
        <SettingItem
          title="User ID"
          description={user?.id ? `${user.id.substring(0, 8)}...` : 'Not available'}
          rightComponent={
            <TouchableOpacity 
              style={styles.copyButton} 
              onPress={copyUserId}
              disabled={!user?.id}
            >
              <Text style={styles.copyButtonText}>Copy</Text>
            </TouchableOpacity>
          }
        />
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setShowChangePassword(true)}
        >
          <Text style={styles.actionButtonText}>Change Password</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.dangerButton]}
          onPress={() => setShowDeleteAccount(true)}
        >
          <Text style={[styles.actionButtonText, styles.dangerButtonText]}>Delete Account</Text>
        </TouchableOpacity>
      </View>

      {/* Preferences Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <SettingItem
          title="Push Notifications"
          description="Receive workout reminders and updates"
          rightComponent={
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: '#333', true: '#007AFF' }}
              thumbColor={notificationsEnabled ? '#ffffff' : '#888'}
            />
          }
        />
        
        <SettingItem
          title="Dark Mode"
          description="Use dark theme (blacksfit default)"
          rightComponent={
            <Switch
              value={darkMode}
              onValueChange={() => {
                setDarkMode(!darkMode);
                saveSettings();
              }}
              trackColor={{ false: '#333', true: '#007AFF' }}
              thumbColor={darkMode ? '#ffffff' : '#888'}
            />
          }
        />
        
        <SettingItem
          title="Biometric Login"
          description="Use fingerprint or face ID"
          rightComponent={
            <Switch
              value={biometricEnabled}
              onValueChange={() => {
                setBiometricEnabled(!biometricEnabled);
                saveSettings();
              }}
              trackColor={{ false: '#333', true: '#007AFF' }}
              thumbColor={biometricEnabled ? '#ffffff' : '#888'}
            />
          }
        />
        
        <SettingItem
          title="Auto Sync"
          description="Automatically sync workout data"
          rightComponent={
            <Switch
              value={autoSync}
              onValueChange={() => {
                setAutoSync(!autoSync);
                saveSettings();
              }}
              trackColor={{ false: '#333', true: '#007AFF' }}
              thumbColor={autoSync ? '#ffffff' : '#888'}
            />
          }
        />
      </View>

      {/* App Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
        <SettingItem
          title="App Version"
          description="blacksfits v1.0.0"
          rightComponent={null}
        />
        
        <SettingItem
          title="Account Created"
          description={user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
          rightComponent={null}
        />
        
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Terms of Service</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Privacy Policy</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Contact Support</Text>
        </TouchableOpacity>
      </View>

      {/* Actions Section */}
      <View style={styles.section}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.saveButton]}
          onPress={saveSettings}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={[styles.actionButtonText, styles.saveButtonText]}>
              Save Settings
            </Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.signOutButton]}
          onPress={handleSignOut}
        >
          <Text style={[styles.actionButtonText, styles.signOutButtonText]}>
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>

      {/* Change Password Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showChangePassword}
        onRequestClose={() => setShowChangePassword(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Password</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Current Password"
              placeholderTextColor="#666"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              autoCapitalize="none"
            />
            
            <TextInput
              style={styles.modalInput}
              placeholder="New Password"
              placeholderTextColor="#666"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              autoCapitalize="none"
            />
            
            <TextInput
              style={styles.modalInput}
              placeholder="Confirm New Password"
              placeholderTextColor="#666"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
            />
            
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setShowChangePassword(false)}
              >
                <Text style={styles.modalButtonTextCancel}>Cancel</Text>
              </Pressable>
              
              <Pressable
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleChangePassword}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.modalButtonTextConfirm}>Update</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showDeleteAccount}
        onRequestClose={() => setShowDeleteAccount(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Account</Text>
            <Text style={styles.modalWarning}>
              ⚠️ This action cannot be undone. All your data will be permanently deleted.
            </Text>
            <Text style={styles.modalDescription}>
              To confirm, type "DELETE" below:
            </Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Type DELETE to confirm"
              placeholderTextColor="#666"
              value={deleteConfirm}
              onChangeText={setDeleteConfirm}
              autoCapitalize="characters"
            />
            
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setShowDeleteAccount(false)}
              >
                <Text style={styles.modalButtonTextCancel}>Cancel</Text>
              </Pressable>
              
              <Pressable
                style={[styles.modalButton, styles.modalButtonDanger]}
                onPress={handleDeleteAccount}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.modalButtonTextConfirm}>Delete Account</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.footer}>
        <Text style={styles.footerText}>blacksfits © 2024</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#888',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
    paddingLeft: 8,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#888',
    lineHeight: 18,
  },
  copyButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  copyButtonText: {
    color: '#007AFF',
    fontSize: 12,
    fontWeight: '600',
  },
  actionButton: {
    backgroundColor: '#1a1a1a',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  dangerButton: {
    borderColor: '#FF3B30',
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  dangerButtonText: {
    color: '#FF3B30',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#ffffff',
  },
  signOutButton: {
    backgroundColor: 'transparent',
    borderColor: '#FF3B30',
  },
  signOutButtonText: {
    color: '#FF3B30',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalWarning: {
    color: '#FF9500',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalDescription: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: '#0a0a0a',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  modalButtonCancel: {
    backgroundColor: '#333',
  },
  modalButtonConfirm: {
    backgroundColor: '#007AFF',
  },
  modalButtonDanger: {
    backgroundColor: '#FF3B30',
  },
  modalButtonTextCancel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonTextConfirm: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    padding: 24,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  footerText: {
    color: '#666',
    fontSize: 12,
  },
});

export default SettingsScreen;