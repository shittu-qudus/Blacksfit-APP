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
import { useAppSelector, useAppDispatch } from '../comps/hooks';
import {
  removeFromCart,
  incrementQuantity,
  clearCart,
  decrementFromCart,
} from '../comps/cartSlice';

const CartDisplay: React.FC = () => {
  const dispatch = useAppDispatch();
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
            {/* Product Image */}
            <Image
              source={item.photoUrl}
              style={styles.productImage}
              resizeMode="cover"
            />

            {/* Product Details */}
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productSize}>Size: {item.size}</Text>
              <Text style={styles.productPrice}>{formatCurrency(item.price)}</Text>
            </View>

            {/* Quantity Controls */}
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={[styles.quantityButton, styles.decrementButton]}
                onPress={() => handleDecrementFromCart(item.id)}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{item.quantity}</Text>
              <TouchableOpacity
                style={[styles.quantityButton, styles.incrementButton]}
                onPress={() => handleIncrement(item.id)}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>

         <View style={{flexDirection: 'column', alignItems: 'center',gap: 10}}>
               {/* Item Subtotal */}
            <View style={styles.subtotalContainer}>
              <Text style={styles.subtotalText}>
                {formatCurrency(item.price * item.quantity)}
              </Text>
            </View>

            {/* Remove Button */}
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveItem(item.id)}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
         </View>
        ))}
      </ScrollView>

      {/* Cart Total */}
      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: {formatCurrency(cartTotal)}</Text>
        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000000',
  },
  emptyContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 10,
    margin: 20,
    backgroundColor: '#1a1a1a',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#ffffff',
  },
  emptyText: {
    fontSize: 16,
    color: '#cccccc',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  clearButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#dc2626',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  clearButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  itemsContainer: {
    flex: 1,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  productDetails: {
    flex: 1,
    marginLeft: 16,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#ffffff',
  },
  productSize: {
    fontSize: 14,
    color: '#a0a0a0',
    marginBottom: 6,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  quantityButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 36,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  decrementButton: {
    backgroundColor: '#6b7280',
  },
  incrementButton: {
    backgroundColor: '#16a34a',
  },
  quantityButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  quantityText: {
    minWidth: 36,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
    marginHorizontal: 10,
    color: '#ffffff',
  },
  subtotalContainer: {
    minWidth: 100,
    alignItems: 'center',
    marginHorizontal: 12,
  },
  subtotalText: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#ffffff',
   
  },
  removeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#dc2626',
    borderRadius: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#ffffff',
    textAlign: 'center',
  },
  checkoutButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: '#2563eb',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CartDisplay;