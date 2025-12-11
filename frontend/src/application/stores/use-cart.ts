import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product } from "@/domain/entities";

interface CartState {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
    addItem: (product: Product, quantity?: number) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    getItem: (productId: string) => CartItem | undefined;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            totalItems: 0,
            totalPrice: 0,

            addItem: (product: Product, quantity = 1) => {
                const items = get().items;
                const existingItem = items.find((item) => item.product.id === product.id);

                let newItems: CartItem[];
                if (existingItem) {
                    // Update quantity of existing item
                    newItems = items.map((item) =>
                        item.product.id === product.id
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    );
                } else {
                    // Add new item
                    newItems = [...items, { product, quantity }];
                }

                const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
                const totalPrice = newItems.reduce(
                    (sum, item) => sum + item.product.price * item.quantity,
                    0
                );

                set({ items: newItems, totalItems, totalPrice });
            },

            removeItem: (productId: string) => {
                const items = get().items;
                const newItems = items.filter((item) => item.product.id !== productId);

                const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
                const totalPrice = newItems.reduce(
                    (sum, item) => sum + item.product.price * item.quantity,
                    0
                );

                set({ items: newItems, totalItems, totalPrice });
            },

            updateQuantity: (productId: string, quantity: number) => {
                if (quantity <= 0) {
                    get().removeItem(productId);
                    return;
                }

                const items = get().items;
                const newItems = items.map((item) =>
                    item.product.id === productId ? { ...item, quantity } : item
                );

                const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
                const totalPrice = newItems.reduce(
                    (sum, item) => sum + item.product.price * item.quantity,
                    0
                );

                set({ items: newItems, totalItems, totalPrice });
            },

            clearCart: () => {
                set({ items: [], totalItems: 0, totalPrice: 0 });
            },

            getItem: (productId: string) => {
                return get().items.find((item) => item.product.id === productId);
            },
        }),
        {
            name: "cart-storage",
        }
    )
);
