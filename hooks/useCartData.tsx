// hooks/useCartData.ts
import { useAppSelector, useAppDispatch } from '../comps/hooks';
import { 
    addToCart, 
    removeFromCart, 
    incrementQuantity, 
    decrementQuantity, 
    clearCart,
    decrementFromCart 
} from '../comps/cartSlice';
import { Product } from '../comps/types';

export const useCartData = () => {
    const dispatch = useAppDispatch();
    
    // Get cart state
    const cartItems = useAppSelector(state => state.cart.items);
    const cartTotal = useAppSelector(state => state.cart.total);
    
    // Calculated values
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const uniqueItemsCount = cartItems.length;
    const isEmpty = cartItems.length === 0;
    
    // Cart actions
    const actions = {
        addItem: (product: Product) => dispatch(addToCart(product)),
        removeItem: (itemId: number) => dispatch(removeFromCart(itemId)),
        incrementItem: (itemId: number) => dispatch(incrementQuantity(itemId)),
        decrementItem: (itemId: number) => dispatch(decrementQuantity(itemId)),
        decrementFromCartItem: (itemId: number) => dispatch(decrementFromCart(itemId)),
        clearAllItems: () => dispatch(clearCart()),
    };
    
    // Helper functions
    const helpers = {
        isItemInCart: (itemId: number) => cartItems.some(item => item.id === itemId),
        getItemQuantity: (itemId: number) => {
            const item = cartItems.find(item => item.id === itemId);
            return item ? item.quantity : 0;
        },
        getItemById: (itemId: number) => cartItems.find(item => item.id === itemId),
        getItemSubtotal: (itemId: number) => {
            const item = cartItems.find(item => item.id === itemId);
            return item ? item.price * item.quantity : 0;
        }
    };
    
    return {
        // Cart state
        cartItems,
        cartTotal,
        totalQuantity,
        uniqueItemsCount,
        isEmpty,
        
        // Actions
        ...actions,
        
        // Helpers
        ...helpers
    };
};

// Usage example:
/*
const MyComponent = () => {
    const { 
        cartItems, 
        cartTotal, 
        totalQuantity,
        addItem, 
        removeItem, 
        isItemInCart,
        getItemQuantity 
    } = useCartData();
    
    return (
        <div>
            <h2>Cart ({totalQuantity} items)</h2>
            <p>Total: ₦{cartTotal.toLocaleString()}</p>
            
            {cartItems.map(item => (
                <div key={item.id}>
                    <span>{item.name} - Qty: {item.quantity}</span>
                    <button onClick={() => removeItem(item.id)}>Remove</button>
                </div>
            ))}
        </div>
    );
};
*/