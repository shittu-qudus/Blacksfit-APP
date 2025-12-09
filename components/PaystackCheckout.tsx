// components/PaystackCheckout.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Modal,
} from 'react-native';
import { useAppSelector, useAppDispatch } from '../comps/hooks';
import { clearCart } from '../comps/cartSlice';
import CustomPaystackWebView from './CustomPaystackWebView';

// Define the Paystack response type
interface PaystackResponse {
  reference: string;
  status: string;
  trans: string;
  transaction: string;
  trxref: string;
  message: string;
}

// Define customer details interface
interface CustomerDetails {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  size: string;
}

const PaystackCheckout: React.FC = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(state => state.cart.items);
  const cartTotal = useAppSelector(state => state.cart.total);
  
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    size: '',
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showPaystackModal, setShowPaystackModal] = useState(false);
  const [emailStatus, setEmailStatus] = useState<string>('');

  // Test Paystack configuration - REPLACE WITH YOUR ACTUAL TEST KEY
  const PAYSTACK_PUBLIC_KEY = 'pk_test_c3b60cc948314aa02441a2c964e31a2238051185';

  const handleInputChange = (field: keyof CustomerDetails, value: string) => {
    setCustomerDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!customerDetails.email || !customerDetails.firstName || !customerDetails.lastName) {
      Alert.alert('Error', 'Please fill in all required fields (email, first name, last name)');
      return false;
    }

    if (cartItems.length === 0 || cartTotal <= 0) {
      Alert.alert('Error', 'Your cart is empty or invalid');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerDetails.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    return true;
  };

  const startPayment = () => {
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    setShowPaystackModal(true);
  };

  // Test card details for demonstration
  const showTestCardDetails = () => {
    Alert.alert(
      'Test Card Details',
      `Use these test details for payment:
      
💳 Card Number: 408 408 408 408 408 1
📅 Expiry: Any future date
🔐 CVV: 408
🔒 PIN: 1234
📱 OTP: 123456

📧 Email: ${customerDetails.email || 'any_email@test.com'}

Note: This is a test payment. No real money will be charged.`,
      [{ text: 'OK', style: 'default' }]
    );
  };

  const sendOrderConfirmation = async (orderDetails: PaystackResponse) => {
    setEmailStatus('Sending order confirmation...');

    try {
      // Simulate API call to your backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const orderData = {
        customerName: `${customerDetails.firstName} ${customerDetails.lastName}`,
        customerEmail: customerDetails.email,
        customerPhone: customerDetails.phone,
        customerAddress: customerDetails.address,
        preferredSize: customerDetails.size,
        orderTotal: cartTotal,
        orderItems: cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity
        })),
        transactionReference: orderDetails.reference,
        paymentStatus: orderDetails.status,
        orderDate: new Date().toISOString()
      };

      console.log('Order data to send to backend:', orderData);
      
      // In a real app, you would send this to your backend API
      // const response = await fetch('https://your-backend.com/api/orders', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(orderData),
      // });
      
      setEmailStatus('Order confirmation sent!');
      setTimeout(() => setEmailStatus(''), 3000);
      
    } catch (error: any) {
      console.error('Order confirmation failed:', error);
      setEmailStatus('Failed to send order confirmation');
      setTimeout(() => setEmailStatus(''), 5000);
    }
  };

  const handlePaymentSuccess = async (response: PaystackResponse) => {
    try {
      console.log('Payment successful:', response);
      
      // Store current state before clearing cart
      const currentCustomerDetails = { ...customerDetails };
      const currentCartItems = [...cartItems];
      const currentCartTotal = cartTotal;
      
      // Send order confirmation
      await sendOrderConfirmation(response);
      
      // Clear cart
      dispatch(clearCart());
      
      // Show success message
      Alert.alert(
        'Payment Successful! 🎉',
        `Thank you for your purchase, ${currentCustomerDetails.firstName}!
        
📦 Order Reference: ${response.reference}
💰 Amount Paid: ₦${currentCartTotal.toLocaleString()}
📧 Confirmation sent to: ${currentCustomerDetails.email}

Your items will be processed and shipped soon.`,
        [
          {
            text: 'Continue Shopping',
            onPress: () => {
              setShowForm(false);
              setShowPaystackModal(false);
              setCustomerDetails({
                email: '',
                firstName: '',
                lastName: '',
                phone: '',
                address: '',
                size: '',
              });
            }
          }
        ]
      );
      
    } catch (error) {
      console.error('Error in payment success handler:', error);
      Alert.alert(
        'Payment Processed',
        `Payment was successful but there was an error processing your order details. 
        
Please contact support with this reference: ${response.reference}`
      );
    } finally {
      setIsProcessing(false);
      setShowPaystackModal(false);
    }
  };

  const handlePaymentClose = () => {
    console.log('Payment modal closed by user');
    setShowPaystackModal(false);
    setIsProcessing(false);
  };

  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Add items to cart to proceed with checkout</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Checkout</Text>
      
      {/* Status Display */}
      {emailStatus ? (
        <View style={[
          styles.statusContainer,
          emailStatus.includes('failed') || emailStatus.includes('Error') 
            ? styles.errorStatus 
            : styles.successStatus
        ]}>
          <Text style={styles.statusText}>{emailStatus}</Text>
        </View>
      ) : null}
      
      {!showForm ? (
        <View>
          <View style={styles.summaryContainer}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            <Text style={styles.summaryText}>
              <Text style={styles.label}>Items:</Text> {cartItems.length}
            </Text>
            <Text style={styles.summaryText}>
              <Text style={styles.label}>Total:</Text> ₦{cartTotal.toLocaleString()}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => setShowForm(true)}
          >
            <Text style={styles.buttonText}>Proceed to Payment</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <Text style={styles.sectionTitle}>Customer Details</Text>
          
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address *</Text>
              <TextInput
                style={styles.input}
                value={customerDetails.email}
                onChangeText={(value) => handleInputChange('email', value)}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfInput]}>
                <Text style={styles.label}>First Name *</Text>
                <TextInput
                  style={styles.input}
                  value={customerDetails.firstName}
                  onChangeText={(value) => handleInputChange('firstName', value)}
                  placeholder="First Name"
                />
              </View>
              
              <View style={[styles.inputGroup, styles.halfInput]}>
                <Text style={styles.label}>Last Name *</Text>
                <TextInput
                  style={styles.input}
                  value={customerDetails.lastName}
                  onChangeText={(value) => handleInputChange('lastName', value)}
                  placeholder="Last Name"
                />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={customerDetails.phone}
                onChangeText={(value) => handleInputChange('phone', value)}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Preferred Size</Text>
              <TextInput
                style={styles.input}
                value={customerDetails.size}
                onChangeText={(value) => handleInputChange('size', value)}
                placeholder="Enter your preferred size"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Delivery Address</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={customerDetails.address}
                onChangeText={(value) => handleInputChange('address', value)}
                placeholder="Enter your delivery address"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </View>
          
          <View style={styles.orderSummary}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            {cartItems.map(item => (
              <View key={item.id} style={styles.orderItem}>
                <Text style={styles.itemText}>{item.name} x {item.quantity}</Text>
                <Text style={styles.itemText}>₦{(item.price * item.quantity).toLocaleString()}</Text>
              </View>
            ))}
            <View style={styles.divider} />
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalAmount}>₦{cartTotal.toLocaleString()}</Text>
            </View>
          </View>

          {/* Test Card Info Button */}
          <TouchableOpacity 
            style={styles.testInfoButton}
            onPress={showTestCardDetails}
          >
            <Text style={styles.testInfoButtonText}>📋 View Test Card Details</Text>
          </TouchableOpacity>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => setShowForm(false)}
            >
              <Text style={styles.secondaryButtonText}>Back</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.primaryButton,
                isProcessing && styles.disabledButton
              ]}
              onPress={startPayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  Pay ₦{cartTotal.toLocaleString()}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Paystack WebView Modal */}
          <Modal
            visible={showPaystackModal}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={handlePaymentClose}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Complete Payment</Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={handlePaymentClose}
                >
                  <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>
              </View>
              
              <CustomPaystackWebView
                paystackKey={PAYSTACK_PUBLIC_KEY}
                amount={cartTotal}
                email={customerDetails.email}
                firstName={customerDetails.firstName}
                lastName={customerDetails.lastName}
                phone={customerDetails.phone}
                onSuccess={handlePaymentSuccess}
                onClose={handlePaymentClose}
                visible={showPaystackModal}
              />
            </View>
          </Modal>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  summaryContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  orderSummary: {
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 20,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemText: {
    fontSize: 14,
    color: '#555',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  testInfoButton: {
    backgroundColor: '#ffc107',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ffa000',
  },
  testInfoButtonText: {
    color: '#856404',
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6c757d',
    minWidth: 80,
  },
  secondaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    padding: 20,
  },
  statusContainer: {
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    borderWidth: 1,
  },
  successStatus: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
  },
  errorStatus: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
  },
  statusText: {
    fontSize: 14,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
  },
});

export default PaystackCheckout;