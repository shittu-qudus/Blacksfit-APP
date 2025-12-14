// src/screens/SignupScreen.js
import React, { useState } from 'react';
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
import { supabase } from '../lib/supabase'; // Adjust path as needed

const SignupScreen = ({ navigation  }: { navigation: any }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: ''
  });

  const validatePassword = (pwd: string) => {
    let score = 0;
    let messages = [];
    
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    
    if (score === 4) messages.push('Strong password');
    else if (score >= 2) messages.push('Moderate password');
    else messages.push('Weak password');
    
    return { score, message: messages.join(' • ') };
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (text.length > 0) {
      setPasswordStrength(validatePassword(text));
    } else {
      setPasswordStrength({ score: 0, message: '' });
    }
  };

  const handleSignup = async () => {
    // Validation
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (!password) {
      Alert.alert('Error', 'Please enter a password');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (passwordStrength.score < 2) {
      Alert.alert('Weak Password', 'Please use a stronger password for security');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: {
            full_name: name.trim(),
            signup_method: 'email_password',
            app_name: 'blacksfits',
            created_at: new Date().toISOString()
          },
          emailRedirectTo: 'blacksfits://auth/callback'
        }
      });

      if (error) {
        // Handle specific error cases
        if (error.message.includes('already registered')) {
          Alert.alert(
            'Account Exists',
            'An account with this email already exists. Would you like to sign in instead?',
            [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'Sign In', 
                onPress: () => navigation.navigate('Login', { prefillEmail: email })
              }
            ]
          );
          return;
        }
        
        if (error.message.includes('rate limit')) {
          Alert.alert('Too Many Attempts', 'Please wait a few minutes before trying again');
          return;
        }
        
        throw error;
      }

      if (data.user && data.user.identities && data.user.identities.length === 0) {
        Alert.alert('Account Exists', 'This email is already registered. Please sign in.');
        return;
      }

      // Success
      Alert.alert(
        'Account Created!',
        'A confirmation email has been sent to your address. Please verify your email to activate your account.',
        [
          {
            text: 'Check Email',
            onPress: () => {
              navigation.navigate('CheckEmail', { 
                email, 
                type: 'signup',
                canResend: true 
              });
            }
          },
          {
            text: 'Continue',
            style: 'default',
            onPress: () => {
              // Optionally auto-navigate to login
              navigation.navigate('Login', { 
                message: 'Please check your email to confirm your account'
              });
            }
          }
        ]
      );

      // Clear form on success
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setPasswordStrength({ score: 0, message: '' });

    } catch (error) {
      console.error('Signup Error:', error);
      Alert.alert(
        'Signup Failed',
        (error as Error).message || 'An error occurred during signup. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength.score === 0) return '#666';
    if (passwordStrength.score === 1) return '#FF3B30'; // Red
    if (passwordStrength.score === 2) return '#FF9500'; // Orange
    if (passwordStrength.score === 3) return '#FFCC00'; // Yellow
    return '#34C759'; // Green
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join blacksfits and start your fitness journey</Text>

          {/* Full Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="John Doe"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
              autoComplete="name"
              editable={!loading}
            />
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              editable={!loading}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Create a strong password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={handlePasswordChange}
              secureTextEntry
              autoComplete="password-new"
              editable={!loading}
            />
            {password.length > 0 && (
              <View style={styles.passwordStrengthContainer}>
                <View style={styles.strengthMeter}>
                  <View 
                    style={[
                      styles.strengthBar, 
                      { 
                        width: `${(passwordStrength.score / 4) * 100}%`,
                        backgroundColor: getPasswordStrengthColor()
                      }
                    ]} 
                  />
                </View>
                <Text style={[styles.passwordHint, { color: getPasswordStrengthColor() }]}>
                  {passwordStrength.message}
                </Text>
              </View>
            )}
            <Text style={styles.passwordRequirements}>
              • At least 8 characters • Include uppercase & numbers • Add special characters for strength
            </Text>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={[
                styles.input,
                confirmPassword && password !== confirmPassword && styles.inputError
              ]}
              placeholder="Re-enter your password"
              placeholderTextColor="#999"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoComplete="password-new"
              editable={!loading}
            />
            {confirmPassword && password !== confirmPassword && (
              <Text style={styles.errorText}>Passwords do not match</Text>
            )}
          </View>

          {/* Terms & Conditions */}
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By creating an account, you agree to our{' '}
              <Text style={styles.linkText}>Terms of Service</Text> and{' '}
              <Text style={styles.linkText}>Privacy Policy</Text>
            </Text>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Already have account */}
          <TouchableOpacity 
            onPress={() => navigation.navigate('Login')}
            style={styles.secondaryButton}
            disabled={loading}
          >
            <Text style={styles.secondaryButtonText}>
              Already have an account? Sign In
            </Text>
          </TouchableOpacity>

          {/* Magic Link Option */}
          <TouchableOpacity 
            onPress={() => navigation.navigate('Login', { showMagicLink: true })}
            style={styles.textButton}
            disabled={loading}
          >
            <Text style={styles.textButtonText}>
              Prefer passwordless login? Use Magic Link
            </Text>
          </TouchableOpacity>
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
  title: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#888',
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
  inputError: {
    borderColor: '#FF3B30',
    borderWidth: 2,
  },
  passwordStrengthContainer: {
    marginTop: 8,
  },
  strengthMeter: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    overflow: 'hidden',
  },
  strengthBar: {
    height: '100%',
    borderRadius: 2,
  },
  passwordHint: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  passwordRequirements: {
    fontSize: 11,
    color: '#666',
    marginTop: 8,
    lineHeight: 14,
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
  },
  termsContainer: {
    marginBottom: 24,
    padding: 12,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
  },
  termsText: {
    fontSize: 12,
    color: '#aaa',
    lineHeight: 16,
  },
  linkText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#34C759',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#34C759',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
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
  },
  secondaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  textButton: {
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  textButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default SignupScreen;