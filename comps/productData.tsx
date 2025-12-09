import { Product } from "./types";

export const productData: Product[] = [
  { 
    id: 1, 
    name: "The Atlantic City piece", 
    photoUrl: require("../image/ATL.jpeg"), 
    fullimage: require("../image/FULLATL.jpg"), 
    size: 42, 
    price: 40000 
  },
  { 
    id: 2, 
    name: "Eyo Adimu piece", 
    photoUrl: require("../image/eyofront.png"), 
    fullimage: require("../image/eyo.jpeg"), 
    size: 44, 
    price: 40000 
  },
  { 
    id: 6, 
    name: "Ibadan brown roof piece", 
    photoUrl: require("../image/ibadan.png"),
    fullimage: require("../image/FULLIB.jpg"), 
    size: 44, 
    price: 40000 
  },
  { 
    id: 9, 
    name: "Kwara state piece", 
    photoUrl: require("../image/map.jpeg"), 
    fullimage: require("../image/mapk.jpeg"), 
    size: 44, 
    price: 40000 
  },
  { 
    id: 10, 
    name: "Ogun piece", 
    photoUrl: require("../image/ogun.jpeg"), 
    fullimage: require("../image/FULLOGUN.jpg"), 
    size: 44, 
    price: 40000 
  },
  { 
    id: 11, 
    name: "Lagos street piece", 
    photoUrl: require("../image/bus.jpeg"),
    fullimage: require("../image/FULLBUS.png"), 
    size: 44, 
    price: 40000 
  },
  { 
    id: 12, 
    name: "Kurmi piece", 
    photoUrl: require("../image/kurmifront.png"),
    fullimage: require("../image/newfullk.png"), 
    size: 44, 
    price: 40000 
  },
];
