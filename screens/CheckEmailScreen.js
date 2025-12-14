// src/screens/CheckEmailScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { supabase } from '../lib/supabase';

const CheckEmailScreen = ({ route, navigation }) => {
  const { email, type = 'magic', canResend = true } = route.params || {};
  const [loading, setLoading] = useState(false);

  const resendEmail = async () => {
    setLoading(true);
    try {
      if (type === 'magic') {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: 'blacksfits://auth/callback' },
        });
        if (error) throw error;
        Alert.alert('Success', 'New magic link sent!');
      } else if (type === 'signup') {
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email,
          options: { emailRedirectTo: 'blacksfits://auth/callback' },
        });
        if (error) throw error;
        Alert.alert('Success', 'Confirmation email resent!');
      } else if (type === 'reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: 'blacksfits://auth/reset-password',
        });
        if (error) throw error;
        Alert.alert('Success', 'Reset email resent!');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to resend email');
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'magic': return 'Check Your Email';
      case 'signup': return 'Confirm Your Account';
      case 'reset': return 'Reset Your Password';
      default: return 'Check Your Email';
    }
  };

  const getMessage = () => {
    switch (type) {
      case 'magic':
        return 'We\'ve sent a secure login link to your email address. Tap the link in the email to sign in to blacksfits.';
      case 'signup':
        return 'We\'ve sent a confirmation email to your address. Please verify your account by clicking the link in the email.';
      case 'reset':
        return 'We\'ve sent password reset instructions to your email. Follow the link to set a new password.';
      default:
        return 'Check your email for further instructions.';
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={styles.appName}>blacksfits</Text>
        
        <Text style={styles.title}>{getTitle()}</Text>
        
        <Text style={styles.emailLabel}>Email sent to:</Text>
        <Text style={styles.email}>{email}</Text>
        
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>{getMessage()}</Text>
          
          <View style={styles.tips}>
            <Text style={styles.tipTitle}>Tips:</Text>
            <Text style={styles.tip}>• Check your spam or junk folder</Text>
            <Text style={styles.tip}>• Make sure you entered the correct email</Text>
            <Text style={styles.tip}>• Links expire after 24 hours</Text>
          </View>
        </View>

        {canResend && (
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={resendEmail}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Resend Email</Text>
            )}
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.secondaryButtonText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#0a0a0a',
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 40,
    marginTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
  },
  emailLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  email: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 40,
  },
  messageBox: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 12,
    marginBottom: 40,
    width: '100%',
  },
  messageText: {
    color: '#aaa',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  tips: {
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 20,
  },
  tipTitle: {
    color: '#fff',
    fontWeight: '600',
    marginBottom: 8,
  },
  tip: {
    color: '#888',
    fontSize: 14,
    marginBottom: 4,
  },
  button: {
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#0a0a0a',
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryButton: {
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444',
    backgroundColor: 'transparent',
    width: '100%',
  },
  secondaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CheckEmailScreen;