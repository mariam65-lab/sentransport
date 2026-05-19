import { useState, useEffect } from 'react';
import './App.css';
import Header from './Header';
import Recherche from './Recherche';
import LigneBus from './LigneBus';
import DetailLigne from './DetailLigne';
import Footer from './Footer';

function App() {
  // ── ÉTATS (STATES) ──────────────────────────────────────────
  const [lignes, setLignes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [recherche, setRecherche] = useState("");
  const [ligneSelectionnee, setLigneSelectionnee] = useState(null);

  // ── EXERCICE 1 : FONCTION DE CHARGEMENT ─────────────────────
  // Fonction séparée pour pouvoir être appelée au démarrage et via le bouton
  function chargerLignes() {
    setChargement(true);
    setErreur(null);
    fetch("http://localhost:5000/lignes")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur serveur : " + response.status);
        }
        return response.json();
      })
      .then((data) => {
        setLignes(data);
        setChargement(false);
      })
      .catch((error) => {
        setErreur(error.message);
        setChargement(false);
      });
  }

  // Lancement du fetch au montage du composant
  useEffect(() => {
    chargerLignes();
  }, []);

  // ── LOGIQUE DE FILTRE ───────────────────────────────────────
  const lignesFiltrees = lignes.filter((l) =>
    l.depart.toLowerCase().includes(recherche.toLowerCase()) ||
    l.arrivee.toLowerCase().includes(recherche.toLowerCase()) ||
    l.numero.includes(recherche)
  );

  // ── EXERCICE 3 : CHARGEMENT DES DÉTAILS AU CLIC ─────────────
  function handleClickLigne(ligne) {
    if (ligneSelectionnee && ligneSelectionnee.id === ligne.id) {
      // Si on reclique sur la même ligne, on ferme le détail
      setLigneSelectionnee(null);
    } else {
      // Appel API pour récupérer les détails spécifiques (arrêts, etc.)
      fetch(`http://localhost:5000/lignes/${ligne.id}`)
        .then((res) => res.json())
        .then((data) => setLigneSelectionnee(data))
        .catch(() => setLigneSelectionnee(ligne)); // Fallback si l'API détail échoue
    }
  }

  // ── RENDU : ÉCRAN DE CHARGEMENT ────────────────────────────
  if (chargement) {
    return (
      <div className="App">
        <Header />
        <main className="contenu">
          <p className="message-chargement">Chargement des lignes...</p>
        </main>
      </div>
    );
  }

  // ── RENDU : ÉCRAN D'ERREUR ─────────────────────────────────
  if (erreur) {
    return (
      <div className="App">
        <Header />
        <main className="contenu">
          <div className="message-erreur">
            <p>Impossible de charger les lignes.</p>
            <p className="erreur-detail">{erreur}</p>
            <p>Vérifiez que le serveur Flask est lancé (python api/app.py).</p>
            <button className="btn-recharger" onClick={chargerLignes}>
              🔄 Réessayer
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ── RENDU : APPLICATION NORMALE ────────────────────────────
  return (
    <div className="App">
      <Header />
      <main className="contenu">
        <Recherche valeur={recherche} onChange={setRecherche} />

        {/* Bouton Recharger (Exercice 1) */}
        <button className="btn-recharger" onClick={chargerLignes}>
          🔄 Recharger
        </button>

        <p className="resultat-recherche">
          {lignesFiltrees.length} ligne
          {lignesFiltrees.length > 1 ? "s" : ""} trouvée
          {lignesFiltrees.length > 1 ? "s" : ""}
        </p>

        <div className="liste-lignes">
          {lignesFiltrees.map((ligne) => (
            <LigneBus
              key={ligne.id}
              numero={ligne.numero}
              depart={ligne.depart}
              arrivee={ligne.arrivee}
              arrets={ligne.arrets}
              estSelectionnee={
                ligneSelectionnee && ligneSelectionnee.id === ligne.id
              }
              onClick={() => handleClickLigne(ligne)}
            />
          ))}
        </div>

        {/* Affichage des détails si une ligne est sélectionnée */}
        {ligneSelectionnee && <DetailLigne ligne={ligneSelectionnee} />}
      </main>
      <Footer />
    </div>
  );
}

export default App;