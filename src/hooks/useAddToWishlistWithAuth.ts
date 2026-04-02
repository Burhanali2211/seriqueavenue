import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../contexts/WishlistContext';
import { Product } from '../types';

interface UseAddToWishlistWithAuthReturn {
  handleAddToWishlist: (product: Product) => void;
}

export const useAddToWishlistWithAuth = (): UseAddToWishlistWithAuthReturn => {
  const { user, showAuthModal } = useAuth();
  const { addItem: addToWishlist } = useWishlist();

  const handleAddToWishlist = (product: Product) => {
    // Check if user is authenticated
    if (user) {
      // User is logged in, add item to wishlist directly
      addToWishlist(product);
    } else {
      // User is not logged in, show authentication modal
      showAuthModal(product, 'wishlist');
    }
  };

  return {
    handleAddToWishlist
  };
};