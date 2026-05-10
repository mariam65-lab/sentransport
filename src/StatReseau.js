import './StatReseau.css';

function StatReseau({ lignes }) {
  const totalArrets = lignes.reduce((sum, l) => sum + l.arrets, 0);
  const ligneMax = lignes.reduce((max, l) => l.arrets > max.arrets ? l : max, lignes[0]);

  return (
    <div className="stat-reseau">
      <div className="stat-item">
        <span className="stat-chiffre">{lignes.length}</span>
        <span className="stat-label">lignes</span>
      </div>
      <div className="stat-item">
        <span className="stat-chiffre">{totalArrets}</span>
        <span className="stat-label">arrêts total</span>
      </div>
      <div className="stat-item">
        <span className="stat-chiffre">Ligne {ligneMax.numero}</span>
        <span className="stat-label">plus d'arrêts</span>
      </div>
    </div>
  );
}

export default StatReseau;