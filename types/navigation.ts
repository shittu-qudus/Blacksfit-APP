// types/navigation.ts
export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  MainDrawer: undefined;
  Cart: undefined;
  PaystackCheckout: undefined;
};

export type CartStackParamList = {
  CartDisplay: undefined;
  PaystackCheckout: undefined;
};

export type DrawerParamList = {
  MainTabs: undefined;
  Cart: undefined;
  FAQ: undefined;
  Settings: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}