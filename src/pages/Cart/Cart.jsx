import { Link, useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, Shield, Truck } from "lucide-react";
import { useCart } from "../../context/CartContext";

const LIVRAISON = 5.99;
const LIVRAISON_OFFERTE_SEUIL = 50;

export default function Cart() {
  const { items, removeFromCart, updateQuantity, total, count } = useCart();
  const navigate = useNavigate();

  const livraison = total >= LIVRAISON_OFFERTE_SEUIL ? 0 : LIVRAISON;
  const totalTTC = total + livraison;

  if (items.length === 0) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-gray-300" />
          </div>
          <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-3">Votre panier est vide</h2>
          <p className="text-gray-500 text-sm mb-8">Découvrez notre catalogue et ajoutez des produits à votre panier.</p>
          <Link
            to="/catalogue"
            className="inline-flex items-center gap-2 bg-orange text-white font-semibold px-8 py-3 rounded-xl hover:bg-orange-dark transition-colors"
          >
            Voir le catalogue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-playfair text-3xl font-bold text-gray-900 mb-8">
          Mon panier{" "}
          <span className="text-orange">({count} article{count > 1 ? "s" : ""})</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des articles */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.key} className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                <div className="flex gap-4">
                  {/* Image */}
                  <div
                    className="flex-shrink-0 rounded-xl overflow-hidden"
                    style={{ width: 100, height: 100 }}
                  >
                    <div
                      style={{
                        background: `linear-gradient(135deg, ${item.couleurFond} 0%, ${item.couleurFond}cc 100%)`,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 36,
                      }}
                    >
                      {item.emoji}
                    </div>
                  </div>

                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider">{item.marque}</p>
                        <Link
                          to={`/produit/${item.id}`}
                          className="font-semibold text-gray-900 text-sm hover:text-forest transition-colors line-clamp-2 leading-snug mt-0.5"
                        >
                          {item.nom}
                        </Link>
                        <div className="flex gap-2 mt-1">
                          {item.taille && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                              Taille : {item.taille}
                            </span>
                          )}
                          {item.couleur && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded flex items-center gap-1">
                              <span
                                className="w-3 h-3 rounded-full inline-block"
                                style={{ backgroundColor: item.couleur }}
                              />
                              Couleur
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.key)}
                        className="text-gray-300 hover:text-red-400 transition-colors p-1 flex-shrink-0"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantité */}
                      <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-2">
                        <button
                          onClick={() => updateQuantity(item.key, item.quantite - 1)}
                          disabled={item.quantite <= 1}
                          className="py-1.5 text-gray-500 hover:text-forest disabled:opacity-30 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-semibold w-6 text-center">{item.quantite}</span>
                        <button
                          onClick={() => updateQuantity(item.key, item.quantite + 1)}
                          className="py-1.5 text-gray-500 hover:text-forest transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Prix */}
                      <div className="text-right">
                        <p className="font-bold text-orange">{(item.prix * item.quantite).toFixed(2)} €</p>
                        {item.quantite > 1 && (
                          <p className="text-xs text-gray-400">{item.prix.toFixed(2)} € / unité</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Retour catalogue */}
            <Link
              to="/catalogue"
              className="inline-flex items-center gap-2 text-forest text-sm font-semibold hover:gap-3 transition-all mt-2"
            >
              <ArrowLeft size={16} />
              Continuer mes achats
            </Link>
          </div>

          {/* Récapitulatif */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-5 text-lg">Récapitulatif</h3>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sous-total ({count} articles)</span>
                  <span className="font-medium">{total.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Livraison</span>
                  {livraison === 0 ? (
                    <span className="text-green-600 font-semibold">Offerte ✓</span>
                  ) : (
                    <span className="font-medium">{livraison.toFixed(2)} €</span>
                  )}
                </div>
                {livraison > 0 && (
                  <p className="text-xs text-orange">
                    Plus que {(LIVRAISON_OFFERTE_SEUIL - total).toFixed(2)} € pour la livraison offerte !
                  </p>
                )}
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-900">Total TTC</span>
                  <span className="font-bold text-orange text-xl">{totalTTC.toFixed(2)} €</span>
                </div>
              </div>

              <button
                onClick={() => navigate("/commander")}
                className="w-full bg-orange hover:bg-orange-dark text-white font-bold py-4 rounded-xl transition-colors shadow-lg hover:shadow-orange/30 mb-3"
              >
                Commander →
              </button>

              {/* Sécurité */}
              <div className="flex items-center justify-center gap-2 text-gray-400 text-xs mb-4">
                <Shield size={14} />
                Paiement 100% sécurisé
              </div>

              <div className="flex justify-center gap-3">
                {["VISA", "Mastercard", "PayPal"].map((brand) => (
                  <span key={brand} className="text-xs font-bold text-gray-400 border border-gray-200 px-2 py-1 rounded">
                    {brand}
                  </span>
                ))}
              </div>

              {/* Livraison */}
              <div className="mt-4 bg-gray-50 rounded-lg p-3 flex items-center gap-2">
                <Truck size={16} className="text-forest flex-shrink-0" />
                <p className="text-xs text-gray-600">
                  Livraison estimée sous <strong>2-4 jours ouvrés</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
