// src/screens/LoginScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { supabase } from '../lib/supabase';

const LoginScreen = ({ navigation}: { navigation: any }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState('email'); 
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState('magic');

  // Check for existing session
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      // REMOVED unnecessary arrow function - directly navigate
      navigation.navigate('MainApp'); // Check if this is the correct name
    }
  };

  // Send Magic Link
  const sendMagicLink = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: 'blacksfits://auth/callback',
        },
      });

      if (error) throw error;

      setStep('verify');
      Alert.alert(
        'Magic Link Sent!',
        `Check your email (${email}) for a secure login link.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('CheckEmail', { 
              email, 
              type: 'magic',
              canResend: true 
            })
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', (error as Error).message || 'Failed to send magic link');
    } finally {
      setLoading(false);
    }
  };

  // Email/Password Sign In
  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      Alert.alert('Success', 'Welcome back to blacksfits!');
      // REMOVED unnecessary arrow function - directly navigate
      navigation.navigate('MainApp'); // Check if this is the correct name
    } catch (error) {
      if ((error as Error).message?.includes('Invalid login credentials')) {
        Alert.alert(
          'Invalid Credentials',
          'The email or password is incorrect.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Reset Password', 
              onPress: () => handlePasswordReset() 
            },
            { 
              text: 'Try Magic Link', 
              onPress: () => {
                setAuthMode('magic');
                setStep('email');
              }
            }
          ]
        );
      } else {
        Alert.alert('Error', (error as Error).message || 'Failed to sign in');
      }
    } finally {
      setLoading(false);
    }
  };

  // Password Reset
  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'blacksfits://auth/reset-password',
      });

      if (error) throw error;

      Alert.alert(
        'Reset Email Sent!',
        `Check your email (${email}) for password reset instructions.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('CheckEmail', {
              email,
              type: 'reset',
              canResend: true
            })
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error',  (error as Error).message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  // Resend Verification
  const resendVerification = async () => {
    setLoading(true);
    try {
      if (authMode === 'magic') {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: 'blacksfits://auth/callback' },
        });
        if (error) throw error;
        Alert.alert('Success', 'New magic link sent!');
      }
    } catch (error) {
      Alert.alert('Error', (error as Error).message || 'Failed to resend');
    } finally {
      setLoading(false);
    }
  };

  // Simplified UI - Removed signup functionality since you have a separate SignupScreen
  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          {/* Logo/Header */}
          <View style={styles.header}>
            <Text style={styles.appName}>blacksfits</Text>
            <Text style={styles.tagline}>Your Fitness Journey Starts Here</Text>
          </View>

          <Text style={styles.title}>
            {step === 'email' ? 'Welcome Back' : 'Check Your Email'}
          </Text>
          
          <Text style={styles.subtitle}>
            {step === 'email' 
              ? 'Enter your email to continue' 
              : `We sent a login link to ${email}`
            }
          </Text>

          {/* Email Input */}
          {step !== 'verify' && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="your@email.com"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                editable={!loading}
              />
            </View>
          )}

          {/* Password Input */}
          {step === 'password' && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
                editable={!loading}
              />
              <TouchableOpacity 
                style={styles.forgotPassword}
                onPress={handlePasswordReset}
              >
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Action Buttons */}
          {step === 'email' ? (
            <>
              {/* Magic Link Button */}
              <TouchableOpacity 
                style={[styles.button, styles.magicButton]} 
                onPress={sendMagicLink}
                disabled={loading}
              >
                {loading && authMode === 'magic' ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Send Magic Link</Text>
                )}
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Sign In with Password */}
              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={() => {
                  setAuthMode('signin');
                  setStep('password');
                }}
                disabled={loading}
              >
                <Text style={styles.secondaryButtonText}>Sign In with Password</Text>
              </TouchableOpacity>

              {/* Create Account */}
              <TouchableOpacity 
                onPress={() => navigation.navigate('Signup')}
                style={styles.textButton}
                disabled={loading}
              >
                <Text style={styles.textButtonText}>
                  Create New Account
                </Text>
              </TouchableOpacity>
            </>
          ) : step === 'password' ? (
            /* Password Step */
            <>
              <TouchableOpacity 
                style={[styles.button, loading && styles.buttonDisabled]} 
                onPress={handleSignIn}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Sign In</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={() => {
                  setStep('email');
                  setPassword('');
                }}
                disabled={loading}
              >
                <Text style={styles.secondaryButtonText}>Back</Text>
              </TouchableOpacity>
            </>
          ) : (
            /* Verify Step */
            <>
              <Text style={styles.verificationText}>
                Tap the login link sent to your email to securely access your account.
              </Text>

              <TouchableOpacity 
                style={[styles.button, loading && styles.buttonDisabled]} 
                onPress={resendVerification}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Resend Magic Link</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={() => {
                  setStep('email');
                  setEmail('');
                }}
                disabled={loading}
              >
                <Text style={styles.secondaryButtonText}>Use a different email</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appName: {
    fontSize: 42,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#aaa',
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    fontSize: 16,
    color: '#ffffff',
  },
  verificationText: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  magicButton: {
    backgroundColor: '#007AFF',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#0a0a0a',
    fontSize: 18,
    fontWeight: '700',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#333',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#666',
    fontWeight: '600',
  },
  secondaryButton: {
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444',
    backgroundColor: 'transparent',
    marginTop: 12,
  },
  secondaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  textButton: {
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  textButtonText: {
    color: '#888',
    fontSize: 14,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 12,
  },
  forgotPasswordText: {
    color: '#007AFF',
    fontSize: 14,
  },
});

export default LoginScreen;