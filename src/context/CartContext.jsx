import { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext(null);

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD": {
      const key = `${action.payload.product.id}-${action.payload.taille}-${action.payload.couleur}`;
      const existing = state.items.find((i) => i.key === key);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.key === key ? { ...i, quantite: i.quantite + action.payload.quantite } : i
          ),
        };
      }
      return {
        ...state,
        items: [
          ...state.items,
          { ...action.payload.product, key, taille: action.payload.taille, couleur: action.payload.couleur, quantite: action.payload.quantite },
        ],
      };
    }
    case "REMOVE":
      return { ...state, items: state.items.filter((i) => i.key !== action.payload) };
    case "UPDATE_QTY":
      return {
        ...state,
        items: state.items.map((i) =>
          i.key === action.payload.key ? { ...i, quantite: Math.max(1, action.payload.quantite) } : i
        ),
      };
    case "CLEAR":
      return { ...state, items: [] };
    case "LOAD":
      return { ...state, items: action.payload };
    default:
      return state;
  }
};

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    const saved = localStorage.getItem("chassepro-cart");
    if (saved) {
      const items = JSON.parse(saved).map(i => ({ ...i, prix: Number(i.prix), prix_barre: i.prix_barre ? Number(i.prix_barre) : null }));
      dispatch({ type: "LOAD", payload: items });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chassepro-cart", JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = (product, taille = "", couleur = "", quantite = 1) =>
    dispatch({ type: "ADD", payload: { product: { ...product, prix: Number(product.prix), prix_barre: product.prix_barre ? Number(product.prix_barre) : null }, taille, couleur, quantite } });

  const removeFromCart = (key) => dispatch({ type: "REMOVE", payload: key });

  const updateQuantity = (key, quantite) => dispatch({ type: "UPDATE_QTY", payload: { key, quantite } });

  const clearCart = () => dispatch({ type: "CLEAR" });

  const total = state.items.reduce((sum, i) => sum + Number(i.prix) * i.quantite, 0);
  const count = state.items.reduce((sum, i) => sum + i.quantite, 0);

  return (
    <CartContext.Provider value={{ items: state.items, addToCart, removeFromCart, updateQuantity, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
