import { API_ENDPOINTS } from '../config/api';

export const cartService = {
  async getCart() {
    const response = await fetch(API_ENDPOINTS.cart, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch cart');
    }
    
    return response.json();
  },

  async addToCart(bookId, quantity = 1) {
    const response = await fetch(API_ENDPOINTS.cart, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bookId, quantity }),
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add to cart');
    }
    
    return response.json();
  },

  async updateCartItem(bookId, quantity) {
    const response = await fetch(`${API_ENDPOINTS.cart}/${bookId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity }),
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update cart');
    }
    
    return response.json();
  },

  async removeFromCart(bookId) {
    const response = await fetch(`${API_ENDPOINTS.cart}/${bookId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to remove from cart');
    }
    
    return response.json();
  },
};
