
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "./types";

interface ProductState {
    products: Product[];
    loading: boolean;
}

const initialState: ProductState = {
    products: [],
    loading: false
};

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        setProducts(state, action: PayloadAction<Product[]>) {
            state.products = action.payload;
           
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        }
    },
});

export const { setProducts, setLoading } = productSlice.actions;
export default productSlice.reducer;
  
