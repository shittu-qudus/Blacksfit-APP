import { ImageSourcePropType } from "react-native"

export interface Product {
    id: number;
    name: string;
    photoUrl: ImageSourcePropType;
    size: number;
    price: number;
    fullimage: ImageSourcePropType;
}

export interface CartItem extends Product {
    quantity: number;
}

export interface Api {
    id: number;
    title: string;
    body: string;
}