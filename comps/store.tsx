
import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./productSlice";
import cartReducer from "./cartSlice";
import favoritesReducer from './favoritesSlice'
export const store = configureStore({
    reducer: {
        products: productReducer,
        cart: cartReducer,
          favorites: favoritesReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;