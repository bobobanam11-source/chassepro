import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ nom: "", prenom: "", email: "", telephone: "", sujet: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #0f2318 0%, #1B3A2D 100%)" }} className="py-14 px-4 text-center">
        <h1 className="font-playfair text-4xl font-bold text-cream mb-3">Contactez-nous</h1>
        <p className="text-cream/70 text-lg max-w-xl mx-auto">
          Notre équipe d'experts chasseurs est à votre disposition pour répondre à toutes vos questions.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Formulaire */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
              <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-6">Envoyer un message</h2>

              {sent ? (
                <div className="text-center py-12">
                  <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
                  <h3 className="font-playfair text-xl font-bold text-gray-900 mb-2">Message envoyé !</h3>
                  <p className="text-gray-500 text-sm">
                    Merci {form.prenom}, nous vous répondrons sous 24h.
                  </p>
                  <button
                    onClick={() => { setSent(false); setForm({ nom: "", prenom: "", email: "", telephone: "", sujet: "", message: "" }); }}
                    className="mt-6 text-forest underline text-sm font-medium"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { name: "nom", label: "Nom", type: "text" },
                      { name: "prenom", label: "Prénom", type: "text" },
                    ].map(({ name, label, type }) => (
                      <div key={name}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{label} *</label>
                        <input
                          type={type}
                          name={name}
                          value={form[name]}
                          onChange={handleChange}
                          required
                          placeholder={label}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest transition-colors"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="votre@email.fr"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                      <input
                        type="tel"
                        name="telephone"
                        value={form.telephone}
                        onChange={handleChange}
                        placeholder="06 XX XX XX XX"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sujet *</label>
                    <select
                      name="sujet"
                      value={form.sujet}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest transition-colors bg-white"
                    >
                      <option value="">Sélectionner un sujet</option>
                      <option value="commande">Commande</option>
                      <option value="retour">Retour produit</option>
                      <option value="sav">Service après-vente</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Décrivez votre demande en détail..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-orange hover:bg-orange-dark text-white font-bold py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-orange/30"
                  >
                    <Send size={18} />
                    Envoyer le message
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Infos contact */}
          <div className="lg:col-span-2 space-y-5">
            {[
              {
                icon: MapPin,
                title: "Notre adresse",
                content: "12 Rue de la Forêt\n75008 Paris, France",
              },
              {
                icon: Phone,
                title: "Téléphone",
                content: "+33 1 23 45 67 89",
              },
              {
                icon: Mail,
                title: "Email",
                content: "contact@chassepro.fr",
              },
              {
                icon: Clock,
                title: "Horaires",
                content: "Lun–Ven : 9h–18h\nSamedi : 9h–13h",
              },
            ].map(({ icon: Icon, title, content }) => (
              <div key={title} className="bg-white rounded-xl shadow-sm p-5 flex gap-4 items-start">
                <div className="w-10 h-10 bg-forest/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-forest" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-0.5">{title}</p>
                  <p className="text-gray-500 text-sm whitespace-pre-line">{content}</p>
                </div>
              </div>
            ))}

            {/* Bloc réponse */}
            <div
              className="rounded-2xl p-6 text-center"
              style={{ background: "linear-gradient(135deg, #1B3A2D 0%, #2d5a40 100%)" }}
            >
              <div className="text-3xl mb-3">💬</div>
              <h3 className="font-playfair text-lg font-bold text-cream mb-2">
                Réponse rapide garantie
              </h3>
              <p className="text-cream/70 text-sm leading-relaxed">
                Notre équipe d'experts chasseurs vous répond sous <strong className="text-orange">24h ouvrées</strong>. 
                Pas de réponse automatique — seulement des vrais conseils de vrais passionnés.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
