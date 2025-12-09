import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product, CartItem } from "./types";


interface CartState {
    items: CartItem[];
    total: number;
}

const initialState: CartState = {
    items: [],
    total: 0,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart(state, action: PayloadAction<Product>) {
            const existingItem = state.items.find(item => item.id === action.payload.id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({ ...action.payload, quantity: 1 });
            }
            
            // Calculate total
            state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        },
        
        // Fixed: renamed from 'eleninate' to 'decrementFromCart' and fixed logic
        decrementFromCart(state, action: PayloadAction<number>) {
            const existingItem = state.items.find(item => item.id === action.payload);
            
            if (existingItem && existingItem.quantity > 1) {
                existingItem.quantity -= 1;
            } else if (existingItem && existingItem.quantity === 1) {
                // Remove item if quantity would become 0
                state.items = state.items.filter(item => item.id !== action.payload);
            }
            
            // Calculate total
            state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        },
        
        removeFromCart(state, action: PayloadAction<number>) {
            state.items = state.items.filter(item => item.id !== action.payload);
            state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        },
        
        incrementQuantity(state, action: PayloadAction<number>) {
            const item = state.items.find(item => item.id === action.payload);
            if (item) {
                item.quantity += 1;
                state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            }
        },
        
        decrementQuantity(state, action: PayloadAction<number>) {
            const item = state.items.find(item => item.id === action.payload);
            if (item && item.quantity > 1) {
                item.quantity -= 1;
                state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            }
        },
        
        clearCart(state) {
            state.items = [];
            state.total = 0;
        }
    },
});

export const {
    addToCart,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    decrementFromCart
} = cartSlice.actions;

export default cartSlice.reducer;