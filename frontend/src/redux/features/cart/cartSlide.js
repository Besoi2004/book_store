import { createSlice } from '@reduxjs/toolkit'
import Swal from 'sweetalert2'

const loadCartFromStorage = () => {
    try {
        const saved = localStorage.getItem('cartItems')
        return saved ? JSON.parse(saved) : []
    } catch {
        return []
    }
}

const saveCartToStorage = (cartItems) => {
    try {
        localStorage.setItem('cartItems', JSON.stringify(cartItems))
    } catch {}
}

const initialState = {
    cartItems: loadCartFromStorage(),
}

const cartSlice = createSlice({
    name: 'cart',
    initialState: initialState,
    reducers:{
        addToCart: (state, action) => {
            const existingItem = state.cartItems.find(item => item._id === action.payload._id);
            if (!existingItem) {
                state.cartItems.push({ ...action.payload, quantity: 1 });
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Đã thêm vào giỏ hàng",
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                existingItem.quantity += 1;
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Đã tăng số lượng",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
            saveCartToStorage(state.cartItems);
        },
        updateQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const item = state.cartItems.find(item => item._id === id);
            if (item) {
                item.quantity = quantity;
            }
            saveCartToStorage(state.cartItems);
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter(item => item._id !== action.payload);
            saveCartToStorage(state.cartItems);
        },
        clearCart: (state) => {
            state.cartItems = [];
            saveCartToStorage([]);
        }
    }
})


export const { addToCart, removeFromCart, clearCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;