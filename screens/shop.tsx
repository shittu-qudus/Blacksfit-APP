import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  Image,
  Animated,
  FlatList,
  StatusBar,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ListRenderItem,
  SafeAreaView,
  Pressable,
  Alert,
  Vibration,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, decrementFromCart } from '../comps/cartSlice';
import { addToFavorites, removeFromFavorites } from '../comps/favoritesSlice';
import { productData } from '../comps/productData';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

interface Product {
  id: number;
  name: string;
  size: number;
  price: number;
  photoUrl: string;
  fullimage?: string;
  description?: string;
}

interface CartItem {
  id: number;
  quantity: number;
  product: Product;
}

interface RootState {
  cart: {
    items: CartItem[];
    total: number;
  };
  favorites: {
    items: Product[];
  };
}

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

const ProductCard = React.memo(
  ({
    product,
    index,
    inCart,
    quantity,
    isFavorite,
    onOpen,
    onAdd,
    onRemove,
    onToggleFavorite,
  }: {
    product: Product;
    index: number;
    inCart: boolean;
    quantity: number;
    isFavorite: boolean;
    onOpen: () => void;
    onAdd: () => void;
    onRemove: () => void;
    onToggleFavorite: () => void;
  }) => {
    const [imageError, setImageError] = React.useState(false);

    const cardAnim = React.useRef(new Animated.Value(0)).current;
    const scaleAnim = React.useRef(new Animated.Value(1)).current;
    const heartScaleAnim = React.useRef(new Animated.Value(1)).current;

    React.useEffect(() => {
      Animated.timing(cardAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    }, [cardAnim, index]);

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    };

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

    const translateY = cardAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [20, 0],
    });

    const opacity = cardAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    return (
      <Animated.View
        style={[
          styles.card,
          inCart && styles.cardInCart,
          {
            opacity,
            transform: [{ translateY }, { scale: scaleAnim }],
          },
        ]}
      >
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

        <TouchableOpacity 
          activeOpacity={0.9} 
          onPress={onOpen} 
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={{ flex: 1 }}
        >
          <Image
  source={
    typeof product.photoUrl === 'number' 
      ? product.photoUrl 
      : { uri: product.photoUrl }
  }
  style={styles.cardImage}
  resizeMode="cover"
  onError={() => setImageError(true)}
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
      </Animated.View>
    );
  }
);

ProductCard.displayName = 'ProductCard';

const ScrollButton = ({
  direction,
  onPress,
  disabled,
}: {
  direction: 'left' | 'right';
  onPress: () => void;
  disabled: boolean;
}) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (!disabled) {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.controlButton, disabled && styles.controlDisabled]}
      activeOpacity={0.7}
    >
      <Animated.Text style={[styles.controlText, { transform: [{ scale: scaleAnim }] }]}>
        {direction === 'left' ? '◀' : '▶'}
      </Animated.Text>
    </TouchableOpacity>
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
  const heartScaleAnim = React.useRef(new Animated.Value(1)).current;

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

    const [imageError, setImageError] = React.useState(false);

    // reset image error when a different product is opened
    React.useEffect(() => {
      setImageError(false);
    }, [product]);
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
  onError={() => setImageError(true)}
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

const Shop: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartTotal = useSelector((state: RootState) => state.cart.total);
  const favorites = useSelector((state: RootState) => state.favorites.items);

  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [bestSellingScrollIndex, setBestSellingScrollIndex] = React.useState(0);
  const [newArrivalsScrollIndex, setNewArrivalsScrollIndex] = React.useState(0);

  const shopProducts = React.useMemo<Product[]>(() => (productData as Product[]).slice(0, 6), []);
  const suggestedProducts = React.useMemo<Product[]>(() => (productData as Product[]).slice(6, 12), []);
  
  const cartItemsMap = React.useMemo(
    () => new Map(cartItems.map((item) => [item.id, item])),
    [cartItems]
  );

  const favoritesMap = React.useMemo(
    () => new Map(favorites.map((item: Product) => [item.id, item])),
    [favorites]
  );

  const bestSellingFlatListRef = React.useRef<FlatList<Product> | null>(null);
  const newArrivalsFlatListRef = React.useRef<FlatList<Product> | null>(null);

  const navigateToCart = () => {
    (navigation as any).navigate('Cart');
  };

  const navigateToFavorites = () => {
    (navigation as any).navigate('Favorites');
  };

  const totalItemsInCart = React.useMemo(
    () => (cartItems || []).reduce((s: number, it: any) => s + (it.quantity || 0), 0),
    [cartItems]
  );

  const totalFavorites = favorites.length;

  const scrollBestSellingLeft = () => {
    if (bestSellingScrollIndex > 0) {
      const newIndex = bestSellingScrollIndex - 1;
      setBestSellingScrollIndex(newIndex);
      bestSellingFlatListRef.current?.scrollToIndex({
        index: newIndex,
        animated: true,
      });
    }
  };

  const scrollBestSellingRight = () => {
    if (bestSellingScrollIndex < shopProducts.length - 1) {
      const newIndex = bestSellingScrollIndex + 1;
      setBestSellingScrollIndex(newIndex);
      bestSellingFlatListRef.current?.scrollToIndex({
        index: newIndex,
        animated: true,
      });
    }
  };

  const scrollNewArrivalsLeft = () => {
    if (newArrivalsScrollIndex > 0) {
      const newIndex = newArrivalsScrollIndex - 1;
      setNewArrivalsScrollIndex(newIndex);
      newArrivalsFlatListRef.current?.scrollToIndex({
        index: newIndex,
        animated: true,
      });
    }
  };

  const scrollNewArrivalsRight = () => {
    if (newArrivalsScrollIndex < suggestedProducts.length - 1) {
      const newIndex = newArrivalsScrollIndex + 1;
      setNewArrivalsScrollIndex(newIndex);
      newArrivalsFlatListRef.current?.scrollToIndex({
        index: newIndex,
        animated: true,
      });
    }
  };

  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedProduct(null);
  };

  const handleAddToCart = (productId: number) => {
    const product = [...shopProducts, ...suggestedProducts].find((p) => p.id === productId);
    if (product) {
      dispatch(addToCart(product as any));
    }
  };

  const handleRemoveOneFromCart = (productId: number) => {
    dispatch(decrementFromCart(productId));
  };

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

  const getItemQuantityInCart = (productId: number) => {
    return cartItemsMap.get(productId)?.quantity || 0;
  };

  const isItemInCart = (productId: number) => {
    return cartItemsMap.has(productId);
  };

  const isItemFavorite = (productId: number) => {
    return favoritesMap.has(productId);
  };

  const heroAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(heroAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [heroAnim]);

  const heroTranslateY = heroAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [30, 0],
  });

  const renderProductCard: ListRenderItem<Product> = ({ item, index }) => (
    <ProductCard
      product={item}
      index={index}
      inCart={isItemInCart(item.id)}
      quantity={getItemQuantityInCart(item.id)}
      isFavorite={isItemFavorite(item.id)}
      onOpen={() => openModal(item)}
      onAdd={() => handleAddToCart(item.id)}
      onRemove={() => handleRemoveOneFromCart(item.id)}
      onToggleFavorite={() => handleToggleFavorite(item)}
    />
  );

  const handleBestSellingScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / (CARD_WIDTH + GAP));
    setBestSellingScrollIndex(index);
  };

  const handleNewArrivalsScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / (CARD_WIDTH + GAP));
    setNewArrivalsScrollIndex(index);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Fixed header row with icons */}
        <View style={styles.headerRow}>
          <Text style={styles.h1}>Blacksfit Shop</Text>
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

        {/* Hero Section */}
        <Animated.View
          style={[
            styles.heroSection,
            {
              opacity: heroAnim,
              transform: [{ translateY: heroTranslateY }],
            },
          ]}
        >
          <Text style={styles.heroTitle}>Welcome to Our Shop</Text>
          <Text style={styles.heroSubtitle}>Discover amazing products at great prices</Text>
        </Animated.View>

        {/* Best Selling Products */}
        <View style={styles.productsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Best Selling ({shopProducts.length})</Text>
            <Text style={styles.hint}>Swipe — or use arrows</Text>
          </View>

          <View style={styles.carouselWrap}>
            <FlatList<Product>
              ref={bestSellingFlatListRef}
              data={shopProducts}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: GAP }}
              keyExtractor={(p) => p.id.toString()}
              renderItem={renderProductCard}
              ItemSeparatorComponent={() => <View style={{ width: GAP }} />}
              onMomentumScrollEnd={handleBestSellingScroll}
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
            <ScrollButton 
              direction="left" 
              onPress={scrollBestSellingLeft} 
              disabled={bestSellingScrollIndex === 0} 
            />
            <ScrollButton
              direction="right"
              onPress={scrollBestSellingRight}
              disabled={bestSellingScrollIndex >= shopProducts.length - 1}
            />
          </View>
        </View>

        {/* New Arrivals */}
        {suggestedProducts.length > 0 && (
          <View style={styles.productsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>New Arrivals ({suggestedProducts.length})</Text>
              <Text style={styles.hint}>Swipe — or use arrows</Text>
            </View>

            <View style={styles.carouselWrap}>
              <FlatList<Product>
                ref={newArrivalsFlatListRef}
                data={suggestedProducts}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: GAP }}
                keyExtractor={(p) => p.id.toString()}
                renderItem={renderProductCard}
                ItemSeparatorComponent={() => <View style={{ width: GAP }} />}
                onMomentumScrollEnd={handleNewArrivalsScroll}
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
              <ScrollButton 
                direction="left" 
                onPress={scrollNewArrivalsLeft} 
                disabled={newArrivalsScrollIndex === 0} 
              />
              <ScrollButton
                direction="right"
                onPress={scrollNewArrivalsRight}
                disabled={newArrivalsScrollIndex >= suggestedProducts.length - 1}
              />
            </View>
          </View>
        )}

        {/* Product Modal */}
        <ProductModal
          visible={modalVisible}
          product={selectedProduct}
          onClose={closeModal}
          onAdd={(p) => {
            if (p) {
              handleAddToCart(p.id);
              closeModal();
            }
          }}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={selectedProduct ? isItemFavorite(selectedProduct.id) : false}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

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
  h1: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    flex: 1,
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
  heroSection: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#d1d5db',
    textAlign: 'center',
  },
  productsSection: {
    marginTop: 20,
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
});

export default Shop;