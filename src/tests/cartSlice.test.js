/**
 * Unit tests for cartSlice Redux reducer and selectors
 * Covers: adding, removing, quantity adjustments, clearing cart, and selectors
 */
import { describe, it, expect } from 'vitest';
import cartReducer, {
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  clearCart,
  selectCartItems,
  selectCartCount,
  selectCartTotal,
  selectIsInCart,
} from '../store/cartSlice';

describe('cartSlice', () => {
  const item1 = { id: 1, title: 'iPhone 14', price: 1000 };
  const item2 = { id: 2, title: 'MacBook Pro', price: 2000 };

  it('returns default initial state with empty items array', () => {
    const state = cartReducer(undefined, { type: '@@INIT' });
    expect(state.items).toEqual([]);
  });

  it('addToCart adds a new item with quantity 1', () => {
    const state = cartReducer({ items: [] }, addToCart(item1));
    expect(state.items).toEqual([{ ...item1, quantity: 1 }]);
  });

  it('addToCart increments quantity when item already exists in cart', () => {
    const stateWithItem = { items: [{ ...item1, quantity: 1 }] };
    const state = cartReducer(stateWithItem, addToCart(item1));
    expect(state.items).toEqual([{ ...item1, quantity: 2 }]);
  });

  it('removeFromCart removes item by id', () => {
    const stateWithItems = { items: [{ ...item1, quantity: 1 }, { ...item2, quantity: 2 }] };
    const state = cartReducer(stateWithItems, removeFromCart(1));
    expect(state.items).toEqual([{ ...item2, quantity: 2 }]);
  });

  it('incrementQuantity increases item quantity by 1', () => {
    const stateWithItem = { items: [{ ...item1, quantity: 2 }] };
    const state = cartReducer(stateWithItem, incrementQuantity(1));
    expect(state.items[0].quantity).toBe(3);
  });

  it('decrementQuantity decreases item quantity when greater than 1', () => {
    const stateWithItem = { items: [{ ...item1, quantity: 3 }] };
    const state = cartReducer(stateWithItem, decrementQuantity(1));
    expect(state.items[0].quantity).toBe(2);
  });

  it('decrementQuantity removes item when quantity is 1', () => {
    const stateWithItem = { items: [{ ...item1, quantity: 1 }] };
    const state = cartReducer(stateWithItem, decrementQuantity(1));
    expect(state.items).toEqual([]);
  });

  it('clearCart empties the cart items array', () => {
    const stateWithItems = { items: [{ ...item1, quantity: 2 }, { ...item2, quantity: 1 }] };
    const state = cartReducer(stateWithItems, clearCart());
    expect(state.items).toEqual([]);
  });

  describe('Cart Selectors', () => {
    const cartState = {
      cart: {
        items: [
          { ...item1, quantity: 2 }, // $1000 * 2 = $2000
          { ...item2, quantity: 1 }, // $2000 * 1 = $2000
        ],
      },
    };

    it('selectCartItems returns items array', () => {
      expect(selectCartItems(cartState)).toEqual(cartState.cart.items);
    });

    it('selectCartCount returns total item count (sum of quantities)', () => {
      expect(selectCartCount(cartState)).toBe(3);
    });

    it('selectCartTotal returns total monetary sum', () => {
      expect(selectCartTotal(cartState)).toBe(4000);
    });

    it('selectIsInCart checks if product exists in cart', () => {
      expect(selectIsInCart(1)(cartState)).toBe(true);
      expect(selectIsInCart(99)(cartState)).toBe(false);
    });
  });
});
