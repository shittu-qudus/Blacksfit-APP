// src/screens/LoginScreen.js
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

const LoginScreen = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState('');
  const [userEnteredCode, setUserEnteredCode] = useState('');
  const [step, setStep] = useState('email');
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  const FORMSPREE_FORM_ID = 'xnnwjqgb';
  
  const ZAPIER_WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/25464359/uf1qjb3/';

  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendToZapierWebhook = async (email: string, code: string, type = 'login_verification') => {
    try {
      const webhookData = {
        email: email,
        verification_code: code,
        type: type,
        timestamp: new Date().toISOString(),
        subject: `Your Login Code: ${code}`,
        message: `Your verification code is: ${code}. Use this code to complete your login.`,
       
        user_email: email,
        code: code,
        login_code: code
      };

      console.log('Sending to Zapier webhook:', webhookData);

      const response = await fetch(ZAPIER_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
      });

      if (response.ok) {
        console.log('Zapier webhook successful');
        return true;
      } else {
        console.log('Zapier webhook failed:', response.status);
        const errorText = await response.text();
        console.log('Zapier error response:', errorText);
        return false;
      }
    } catch (error) {
      console.error('Zapier webhook error:', error);
      return false;
    }
  };

  const sendVerificationCode = async () => {
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
      const code = generateVerificationCode();
      setGeneratedCode(code);

      console.log('Generated code:', code, 'for email:', email);

      // Send to Zapier webhook FIRST (primary method)
      const webhookSuccess = await sendToZapierWebhook(email, code, 'login_verification');

      if (!webhookSuccess) {
        // Fallback: Send via Formspree directly
        console.log('Zapier failed, using Formspree fallback');
        await fetch(`https://formspree.io/f/${FORMSPREE_FORM_ID}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            _subject: `Your Login Code: ${code}`,
            _replyto: email,
            email: email,
            verification_code: code,
            message: `Your verification code is: ${code}`,
            type: 'login_verification',
            timestamp: new Date().toISOString()
          }),
        });
      }

      setStep('verify');
      Alert.alert('Code Sent!', 'Check your email for the verification code');
      
    } catch (error) {
      console.error('Send Error:', error);
      Alert.alert(
        'Failed to Send Code', 
        'Please check your internet connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const verifyCodeAndLogin = () => {
    if (!userEnteredCode) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }

    if (userEnteredCode === generatedCode) {
      Alert.alert('Success', 'Welcome back!');
      // Navigate to main app
      navigation.navigate('MainDrawer');
    } else {
      Alert.alert('Invalid Code', 'The code you entered is incorrect. Please try again.');
    }
  };

  const resendCode = async () => {
    const newCode = generateVerificationCode();
    setGeneratedCode(newCode);

    try {
      // Try Zapier webhook first
      const webhookSuccess = await sendToZapierWebhook(email, newCode, 'login_verification_resend');
      
      if (!webhookSuccess) {
        // Fallback to Formspree
        await fetch(`https://formspree.io/f/${FORMSPREE_FORM_ID}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            _subject: `Your New Login Code: ${newCode}`,
            _replyto: email,
            email: email,
            verification_code: newCode,
            message: `Your new verification code is: ${newCode}`,
            type: 'login_verification_resend'
          }),
        });
      }
      
      Alert.alert('New Code Sent!', 'Check your email for the new verification code');
    } catch (error) {
      Alert.alert('Error', 'Failed to resend code. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <Text style={styles.title}>
            {step === 'email' ? 'Welcome' : 'Check Your Email'}
          </Text>
          <Text style={styles.subtitle}>
            {step === 'email' 
              ? 'Enter your email to continue' 
              : `We sent a code to ${email}`
            }
          </Text>

          {step === 'email' ? (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  editable={!loading}
                />
              </View>

              <TouchableOpacity 
                style={[styles.button, loading && styles.buttonDisabled]} 
                onPress={sendVerificationCode}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Continue with Email</Text>
                )}
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity 
                onPress={() => navigation.navigate('Signup')}
                style={styles.secondaryButton}
              >
                <Text style={styles.secondaryButtonText}>Create New Account</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Verification Code</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter 6-digit code"
                  placeholderTextColor="#999"
                  value={userEnteredCode}
                  onChangeText={setUserEnteredCode}
                  keyboardType="number-pad"
                  maxLength={6}
                  autoFocus={true}
                />
                <Text style={styles.codeHint}>
                  Enter the 6-digit code sent to your email
                </Text>
              </View>

              <TouchableOpacity 
                style={styles.button} 
                onPress={verifyCodeAndLogin}
              >
                <Text style={styles.buttonText}>Verify & Continue</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={resendCode}
              >
                <Text style={styles.secondaryButtonText}>Resend Code</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.textButton}
                onPress={() => setStep('email')}
              >
                <Text style={styles.textButtonText}>Use a different email</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// ... keep your existing styles exactly as they are ...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
  },
  inputContainer: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  codeHint: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#007AFF',
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
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#666',
    fontWeight: '600',
  },
  secondaryButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#007AFF',
    backgroundColor: 'transparent',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textButton: {
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  textButtonText: {
    color: '#666',
    fontSize: 14,
  },
});

export default LoginScreen;