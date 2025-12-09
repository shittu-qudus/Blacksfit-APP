// screens/FavoritesScreen.tsx
import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { removeFromFavorites } from '../comps/favoritesSlice';
import { addToCart } from '../comps/cartSlice';

interface Product {
  id: number;
  name: string;
  price: number;
  size?: string;
  photoUrl?: string;
  fullimage?: string;
}

const FavoritesScreen: React.FC = () => {
    
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const favorites = useSelector((state: any) => state.favorites.items);

  const handleRemoveFavorite = (productId: number) => {
    dispatch(removeFromFavorites(productId));
  };

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product as any));
    // Optional: Show notification when adding from favorites
    // NotificationService.schedulePushNotification('Added to Cart', `${product.name} was added to your cart from favorites!`);
  };

  const renderFavoriteItem = ({ item }: { item: Product }) => (
    <View style={styles.favoriteItem}>
      <Image
        source={{ uri: item.photoUrl || item.fullimage }}
        style={styles.productImage}
        resizeMode="cover"
      />
      
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productSize}>Size: {item.size || 'N/A'}</Text>
        <Text style={styles.productPrice}>₦{item.price.toLocaleString()}</Text>
        
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.addToCartBtn}
            onPress={() => handleAddToCart(item)}
          >
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <TouchableOpacity
        style={styles.removeBtn}
        onPress={() => handleRemoveFavorite(item.id)}
      >
        <FontAwesome name="heart" size={20} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <FontAwesome name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Favorites</Text>
          <View style={styles.placeholder} />
        </View>

        {favorites.length === 0 ? (
          <View style={styles.emptyState}>
            <FontAwesome name="heart-o" size={64} color="#666" />
            <Text style={styles.emptyStateTitle}>No favorites yet</Text>
            <Text style={styles.emptyStateText}>
              Tap the heart icon on products to add them to your favorites
            </Text>
          </View>
        ) : (
          <FlatList
            data={favorites}
            renderItem={renderFavoriteItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  listContent: {
    padding: 16,
  },
  favoriteItem: {
    flexDirection: 'row',
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  productName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  productSize: {
    color: '#ccc',
    fontSize: 14,
  },
  productPrice: {
    color: '#2b8ef3',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 8,
  },
  addToCartBtn: {
    backgroundColor: '#2b8ef3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  removeBtn: {
    padding: 8,
    alignSelf: 'flex-start',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default FavoritesScreen;