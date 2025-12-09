import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Dimensions,
  StatusBar,
  Platform,
  Pressable,
  ScrollView,
  Alert,
  Vibration,
  Animated,
} from "react-native";

import { FontAwesome } from '@expo/vector-icons';

import { useAppDispatch, useAppSelector } from "./comps/hooks";
import { setProducts } from "./comps/productSlice";
import { addToCart, decrementFromCart } from "./comps/cartSlice";
import { addToFavorites, removeFromFavorites } from "./comps/favoritesSlice";
import { productData } from "./comps/productData";
import { useNavigation } from '@react-navigation/native';

type Product = {
  id: number;
  name: string;
  price: number;
  size?: string;
  photoUrl?: string;
  fullimage?: string;
  description?: string;
  [key: string]: any;
};

const SCREEN_WIDTH = Dimensions.get("window").width;
const CARD_WIDTH = 280;
const GAP = 16;

// Notification Service
class NotificationService {
  static async schedulePushNotification(title: string, body: string) {
    try {
      // Vibrate device
      Vibration.vibrate(100);
      
      // Show alert for immediate feedback
      Alert.alert(title, body);
    } catch (error) {
      console.log('Notification error:', error);
      // Fallback to simple alert
      Alert.alert(title, body);
    }
  }
}

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const products = useAppSelector((s: any) => s.products.products as Product[]);
  const cartItems = useAppSelector((s: any) => s.cart.items as any[]);
  const cartTotal = useAppSelector((s: any) => s.cart.total as number);
  const favorites = useAppSelector((s: any) => s.favorites.items as Product[]);

  const flatListRef = useRef<FlatList<Product> | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const navigateToCart = () => {
    (navigation as any).navigate('Cart');
  };

  const navigateToFavorites = () => {
    (navigation as any).navigate('Favorites');
  };

  useEffect(() => {
    if (!products || products.length === 0) {
      dispatch(setProducts(productData));
    }
  }, [dispatch, products]);

  const cartItemsMap = useMemo(
    () => new Map((cartItems || []).map((i: any) => [i.id, i])),
    [cartItems]
  );

  const favoritesMap = useMemo(
    () => new Map(favorites.map((item: Product) => [item.id, item])),
    [favorites]
  );

  const totalItemsInCart = useMemo(
    () => (cartItems || []).reduce((s: number, it: any) => s + (it.quantity || 0), 0),
    [cartItems]
  );

  const totalFavorites = favorites.length;

  const handleAddToCart = useCallback(
    (product: Product) => {
      dispatch(addToCart(product as any));
    },
    [dispatch]
  );

  const handleRemoveOneFromCart = useCallback(
    (productId: number) => {
      dispatch(decrementFromCart(productId));
    },
    [dispatch]
  );

  const handleToggleFavorite = async (product: Product) => {
    const isFavorite = favoritesMap.has(product.id);
    
    if (isFavorite) {
      dispatch(removeFromFavorites(product.id));
    } else {
      dispatch(addToFavorites(product as any));
      
      // Show push notification when adding to favorites
      await NotificationService.schedulePushNotification(
        'Added to Favorites! 💖',
        `${product.name} has been added to your favorites`
      );
    }
  };

  const openModal = useCallback((product: Product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
    setSelectedProduct(null);
  }, []);

  // FlatList scroll helpers
  const scrollLeft = useCallback(() => {
    if (!flatListRef.current) return;
    const to = Math.max(0, currentIndex - 2);
    flatListRef.current.scrollToIndex({ index: to, animated: true });
    setCurrentIndex(to);
  }, [currentIndex]);

  const scrollRight = useCallback(() => {
    if (!flatListRef.current || !products) return;
    const to = Math.min(products.length - 1, currentIndex + 2);
    flatListRef.current.scrollToIndex({ index: to, animated: true });
    setCurrentIndex(to);
  }, [currentIndex, products]);

  // Render item
  const renderItem = useCallback(
    ({ item, index }: { item: Product; index: number }) => {
      const inCart = cartItemsMap.has(item.id);
      const qty = cartItemsMap.get(item.id)?.quantity || 0;
      const isFavorite = favoritesMap.has(item.id);

      return (
        <ProductCard
          product={item}
          index={index}
          inCart={inCart}
          quantity={qty}
          isFavorite={isFavorite}
          onOpen={() => openModal(item)}
          onAdd={() => handleAddToCart(item)}
          onRemove={() => handleRemoveOneFromCart(item.id)}
          onToggleFavorite={() => handleToggleFavorite(item)}
        />
      );
    },
    [cartItemsMap, favoritesMap, openModal, handleAddToCart, handleRemoveOneFromCart, handleToggleFavorite]
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Fixed header row with icons */}
        <View style={styles.headerRow}>
          <Image source={require('./image/BLACKS.png')} style={styles.logo} />
          <View style={styles.headerIcons}>
            {/* Favorites Icon */}
            <TouchableOpacity onPress={navigateToFavorites} style={styles.iconContainer}>
              <FontAwesome name="heart" size={24} color="#fff" />
              {totalFavorites > 0 && (
                <View style={styles.iconBadge}>
                  <Text style={styles.iconBadgeText}>{totalFavorites}</Text>
                </View>
              )}
            </TouchableOpacity>
            
            {/* Cart Icon */}
            <TouchableOpacity onPress={navigateToCart} style={styles.iconContainer}>
              <FontAwesome name="shopping-cart" size={24} color="#fff" />
              {totalItemsInCart > 0 && (
                <View style={styles.iconBadge}>
                  <Text style={styles.iconBadgeText}>{totalItemsInCart}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <CartSummary
          totalItems={totalItemsInCart}
          cartTotal={cartTotal}
          cartItems={cartItems}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Our Latest Collection ({products?.length ?? 0})</Text>
          <Text style={styles.hint}>Swipe — or use arrows</Text>
        </View>

        <View style={styles.carouselWrap}>
          <FlatList
            ref={flatListRef}
            data={products}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: GAP }}
            keyExtractor={(p) => p.id.toString()}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={{ width: GAP }} />}
            onMomentumScrollEnd={(ev) => {
              const x = ev.nativeEvent.contentOffset.x;
              const index = Math.round(x / (CARD_WIDTH + GAP));
              setCurrentIndex(index);
            }}
            getItemLayout={(_, index) => ({
              length: CARD_WIDTH + GAP,
              offset: (CARD_WIDTH + GAP) * index,
              index,
            })}
            initialNumToRender={6}
            maxToRenderPerBatch={8}
          />
        </View>

        <View style={styles.controls}>
          <TouchableOpacity
            onPress={scrollLeft}
            disabled={currentIndex <= 0}
            style={[styles.controlButton, currentIndex <= 0 && styles.controlDisabled]}
          >
            <Text style={styles.controlText}>◀</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={scrollRight}
            disabled={products ? currentIndex >= products.length - 1 : true}
            style={[
              styles.controlButton,
              products && currentIndex >= products.length - 1 && styles.controlDisabled,
            ]}
          >
            <Text style={styles.controlText}>▶</Text>
          </TouchableOpacity>
        </View>

        {/* Modal */}
        <ProductModal
          visible={modalVisible}
          product={selectedProduct}
          onClose={closeModal}
          onAdd={(p) => {
            if (p) {
              handleAddToCart(p);
              closeModal();
            }
          }}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={selectedProduct ? favoritesMap.has(selectedProduct.id) : false}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

/* -----------------------
   Small Components below
   ----------------------- */

const ProductCard: React.FC<{
  product: Product;
  index: number;
  inCart: boolean;
  quantity: number;
  isFavorite: boolean;
  onOpen: () => void;
  onAdd: () => void;
  onRemove: () => void;
  onToggleFavorite: () => void;
}> = ({ product, inCart, quantity, isFavorite, onOpen, onAdd, onRemove, onToggleFavorite }) => {
  const heartScaleAnim = useRef(new Animated.Value(1)).current;

  const handleHeartPress = () => {
    // Heart bounce animation
    Animated.sequence([
      Animated.spring(heartScaleAnim, {
        toValue: 1.3,
        useNativeDriver: true,
      }),
      Animated.spring(heartScaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
    
    onToggleFavorite();
  };

  return (
    <View style={[styles.card, inCart && styles.cardInCart]}>
      {/* Favorite Heart Button */}
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={handleHeartPress}
        accessibilityLabel={isFavorite ? `Remove ${product.name} from favorites` : `Add ${product.name} to favorites`}
      >
        <Animated.View style={{ transform: [{ scale: heartScaleAnim }] }}>
          <FontAwesome 
            name={isFavorite ? "heart" : "heart-o"} 
            size={20} 
            color={isFavorite ? "#ef4444" : "#fff"} 
          />
        </Animated.View>
      </TouchableOpacity>

      {inCart && (
        <View style={styles.inCartBadge}>
          <Text style={styles.inCartText}>In Cart: {quantity}</Text>
        </View>
      )}

      <TouchableOpacity activeOpacity={0.9} onPress={onOpen} style={{ flex: 1 }}>
      <Image
  source={
    typeof product.photoUrl === 'number' 
      ? product.photoUrl 
      : { uri: product.photoUrl }
  }
  style={styles.cardImage}
  resizeMode="cover"
/>
      </TouchableOpacity>

      <View style={styles.cardBody}>
        <Text numberOfLines={1} style={styles.cardTitle}>{product.name}</Text>
        <Text style={styles.cardSize}>Size: {product.size ?? "-"}</Text>
        <Text style={styles.cardPrice}>₦{(product.price || 0).toLocaleString()}</Text>

        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.addBtn} onPress={onAdd} accessibilityLabel={`Add ${product.name} to cart`}>
            <Text style={styles.addBtnText}>Add to Cart</Text>
          </TouchableOpacity>

          {inCart && (
            <TouchableOpacity style={styles.removeBtn} onPress={onRemove} accessibilityLabel={`Remove one ${product.name} from cart`}>
              <Text style={styles.removeBtnText}>Remove</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const ProductModal: React.FC<{
  visible: boolean;
  product: Product | null;
  onClose: () => void;
  onAdd: (p: Product | null) => void;
  onToggleFavorite: (p: Product) => void;
  isFavorite: boolean;
}> = ({ visible, product, onClose, onAdd, onToggleFavorite, isFavorite }) => {
  const heartScaleAnim = useRef(new Animated.Value(1)).current;

  const handleHeartPress = () => {
    if (product) {
      // Heart bounce animation
      Animated.sequence([
        Animated.spring(heartScaleAnim, {
          toValue: 1.3,
          useNativeDriver: true,
        }),
        Animated.spring(heartScaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();
      
      onToggleFavorite(product);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <ScrollView>
            <View style={styles.modalTop}>
              <Text style={styles.modalTitle}>{product?.name}</Text>
              <View style={styles.modalHeaderButtons}>
                <TouchableOpacity
                  style={styles.modalFavoriteButton}
                  onPress={handleHeartPress}
                  accessibilityLabel={isFavorite ? `Remove ${product?.name} from favorites` : `Add ${product?.name} to favorites`}
                >
                  <Animated.View style={{ transform: [{ scale: heartScaleAnim }] }}>
                    <FontAwesome 
                      name={isFavorite ? "heart" : "heart-o"} 
                      size={24} 
                      color={isFavorite ? "#ef4444" : "#fff"} 
                    />
                  </Animated.View>
                </TouchableOpacity>
                <Pressable onPress={onClose} accessibilityLabel="Close product details" style={styles.modalClose}>
                  <Text style={styles.modalCloseText}>×</Text>
                </Pressable>
              </View>
            </View>
           
           
               <Image
  source={
    typeof product?.fullimage === 'number'
      ? product?.fullimage
      : { uri: product?.fullimage }
  }
  style={styles.cardImage}
  resizeMode="cover"
/>
            <View style={{ padding: 12 }}>
              <Text style={styles.modalPrice}>₦{product ? product.price.toLocaleString() : "-"}</Text>
              <Text style={styles.modalText}>
                {product?.description ||
                  "This limited edition piece is crafted with premium materials for the Nigerian climate. Designed for comfort and style in urban environments."}
              </Text>

              <View style={{ marginTop: 12, flexDirection: "row", justifyContent: "flex-end", gap: 8 }}>
                <TouchableOpacity onPress={onClose} style={styles.modalSecondaryBtn}>
                  <Text style={styles.modalSecondaryText}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onAdd(product)}
                  style={styles.modalPrimaryBtn}
                  accessibilityLabel={`Add ${product?.name} to cart`}
                >
                  <Text style={styles.modalPrimaryText}>Add to Cart</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const CartSummary: React.FC<{ totalItems: number; cartTotal: number; cartItems: any[] }> = ({
  totalItems,
  cartTotal,
  cartItems,
}) => {
  return (
    <View style={styles.cartSummary}>
      <Text style={styles.cartTitle}>Cart Summary</Text>
      <Text style={styles.cartLine}>Total Items: <Text style={styles.cartStrong}>{totalItems}</Text></Text>
      <Text style={styles.cartLine}>Total Value: <Text style={styles.cartStrong}>₦{cartTotal?.toLocaleString?.() ?? 0}</Text></Text>

      {cartItems && cartItems.length > 0 && (
        <View style={{ marginTop: 8, flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
          {cartItems.map((it: any) => (
            <View key={it.id} style={styles.pill}>
              <Text style={styles.pillText}>{it.name} x{it.quantity}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

/* -----------------------
   Styles
   ----------------------- */
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#000",
  },
  container: {
    paddingHorizontal: 12,
    backgroundColor: "#000",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    position: "relative",
    padding: 8,
  },
  iconBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#ef4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  iconBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  cartIconContainer: {
    position: "relative",
    padding: 8,
  },
  cartBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#ef4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  cartSummary: {
    borderWidth: 1,
    borderColor: "#333",
    backgroundColor: "#060606",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  cartTitle: {
    color: "#fff",
    fontWeight: "700",
    marginBottom: 6,
  },
  cartLine: {
    color: "#ccc",
    marginBottom: 4,
  },
  cartStrong: {
    color: "#fff",
    fontWeight: "700",
  },
  pill: {
    backgroundColor: "#0b72d7",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginRight: 6,
    marginBottom: 6,
  },
  pillText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
  sectionHeader: {
    marginTop: 12,
    marginBottom: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  hint: {
    color: "#9aa4b2",
    fontSize: 12,
  },
  carouselWrap: {
    marginTop: 8,
    paddingVertical: 8,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#071018",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#222",
    elevation: 2,
  },
  cardInCart: {
    borderColor: "#2b8ef3",
    shadowColor: "#2b8ef3",
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  favoriteButton: {
    position: "absolute",
    top: 12,
    left: 12,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inCartBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#16a34a",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 5,
  },
  inCartText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },
  cardImage: {
    width: "100%",
    height: 160,
    backgroundColor: "#111",
  },
  cardBody: {
    padding: 12,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  cardSize: {
    color: "#b6c2cc",
    marginTop: 4,
    fontSize: 12,
  },
  cardPrice: {
    color: "#2b8ef3",
    fontWeight: "800",
    marginTop: 6,
    fontSize: 16,
  },
  cardActions: {
    marginTop: 8,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  addBtn: {
    flex: 1,
    backgroundColor: "#2b8ef3",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
  removeBtn: {
    flex: 1,
    backgroundColor: "#ef4444",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  removeBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
  controls: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#2b2b2b",
    alignItems: "center",
    justifyContent: "center",
  },
  controlDisabled: {
    opacity: 0.45,
  },
  controlText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 12,
  },
  modalCard: {
    backgroundColor: "#000",
    borderRadius: 12,
    overflow: "hidden",
    maxHeight: "90%",
  },
  modalTop: {
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalHeaderButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalFavoriteButton: {
    padding: 8,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    flex: 1,
  },
  modalClose: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  modalCloseText: {
    fontSize: 28,
    color: "#ef4444",
    fontWeight: "700",
  },
  modalImage: {
    width: "100%",
    height: 320,
    backgroundColor: "#111",
  },
  modalPrice: {
    color: "#2b8ef3",
    fontWeight: "800",
    fontSize: 18,
    marginBottom: 8,
  },
  modalText: {
    color: "#d1d5db",
    lineHeight: 20,
  },
  modalPrimaryBtn: {
    backgroundColor: "#2b8ef3",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  modalPrimaryText: {
    color: "#fff",
    fontWeight: "800",
  },
  modalSecondaryBtn: {
    backgroundColor: "#374151",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 8,
  },
  modalSecondaryText: {
    color: "#e5e7eb",
    fontWeight: "700",
  },
  logo: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },
});