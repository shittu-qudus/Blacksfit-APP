// components/CartDisplay.tsx - WORKING VERSION
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '../comps/hooks';
import {
  removeFromCart,
  incrementQuantity,
  clearCart,
  decrementFromCart,
} from '../comps/cartSlice';

// Define navigation types
type CartStackParamList = {
  CartDisplay: undefined;
  PaystackCheckout: undefined;
};

type CartNavigationProp = {
  navigate: (screen: keyof CartStackParamList) => void;
};

const CartDisplay: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<CartNavigationProp>();
  const cartItems = useAppSelector(state => state.cart.items);
  const cartTotal = useAppSelector(state => state.cart.total);

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleRemoveItem = (itemId: number) => {
    dispatch(removeFromCart(itemId));
  };

  const handleIncrement = (itemId: number) => {
    dispatch(incrementQuantity(itemId));
  };

  const handleDecrementFromCart = (itemId: number) => {
    dispatch(decrementFromCart(itemId));
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to clear your cart?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => dispatch(clearCart()),
        },
      ]
    );
  };

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  // SIMPLE CHECKOUT FUNCTION - This will work now!
  const handleCheckout = () => {
    console.log('Navigating to PaystackCheckout...');
    
    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart before checkout.');
      return;
    }

    // This should work now with the fixed navigation structure
    navigation.navigate('PaystackCheckout');
  };

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
        <Text style={styles.emptyText}>Add some products to see them here!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          Shopping Cart ({totalQuantity} {totalQuantity === 1 ? 'item' : 'items'})
        </Text>
        <TouchableOpacity style={styles.clearButton} onPress={handleClearCart}>
          <Text style={styles.clearButtonText}>Clear Cart</Text>
        </TouchableOpacity>
      </View>

      {/* Cart Items */}
      <ScrollView style={styles.itemsContainer} showsVerticalScrollIndicator={false}>
        {cartItems.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <Image
              source={item.photoUrl}
              style={styles.productImage}
              resizeMode="cover"
            />

            <View style={styles.productDetails}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productSize}>Size: {item.size}</Text>
              <Text style={styles.productPrice}>{formatCurrency(item.price)}</Text>
            </View>

            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={quantityButtonStyle('decrement')}
                onPress={() => handleDecrementFromCart(item.id)}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{item.quantity}</Text>
              <TouchableOpacity
                style={quantityButtonStyle('increment')}
                onPress={() => handleIncrement(item.id)}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.subtotalContainer}>
              <Text style={styles.subtotalText}>
                {formatCurrency(item.price * item.quantity)}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveItem(item.id)}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Cart Total & Checkout */}
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>{formatCurrency(cartTotal)}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.checkoutButton} 
          onPress={handleCheckout}
        >
          <Text style={styles.checkoutButtonText}>
            Proceed to Checkout - ₦{cartTotal.toLocaleString()}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    margin: 20,
    backgroundColor: 'white',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  clearButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#dc3545',
    borderRadius: 3,
  },
  clearButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  itemsContainer: {
    flex: 1,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 5,
    marginBottom: 10,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  productDetails: {
    flex: 1,
    marginLeft: 15,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productSize: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  quantityButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 3,
    minWidth: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  quantityText: {
    minWidth: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    marginHorizontal: 8,
  },
  subtotalContainer: {
    minWidth: 100,
    alignItems: 'flex-end',
    marginHorizontal: 10,
  },
  subtotalText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  removeButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#dc3545',
    borderRadius: 3,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  footer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28a745',
  },
  checkoutButton: {
    paddingVertical: 15,
    backgroundColor: '#28a745',
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

// Dynamic styling for quantity buttons
const quantityButtonStyle = (type: 'decrement' | 'increment') => {
  return {
    ...styles.quantityButton,
    backgroundColor: type === 'decrement' ? '#6c757d' : '#28a745',
  };
};

export default CartDisplay;