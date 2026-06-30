import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

const DataContext = createContext({});

export function DataProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [marques, setMarques] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/produits"),
      api.get("/categories"),
      api.get("/marques"),
    ]).then(([prods, cats, mars]) => {
      setProducts(Array.isArray(prods) ? prods : []);
      setCategories(Array.isArray(cats) ? cats : []);
      setMarques(Array.isArray(mars) ? mars : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <DataContext.Provider value={{ products, categories, marques, loading }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
