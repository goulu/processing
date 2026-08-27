# Galaxy

Simulation de galaxie spirale en 3D / 2D avec rotation stellaire sur orbites elliptiques différentielles et facteur de torsion (*twisting factor*).

Par **Philippe Guglielmetti (Dr. Goulu)**, 2008.

Adapté d'une démo originale LUA/Demoniak 3D ([voir article](http://3dmon.wordpress.com/2007/08/26/simulation-de-galaxie-spirale/)).

---

## 📂 Contenu du dossier

| Fichier | Description |
| :--- | :--- |
| **`Galaxy.pde`** | Sketch original en **Processing (Java)**. |
| **`sketch.js`** | Portage web interactif en **p5.js**. |
| **`index.html`** | Page web avec interface glassmorphism et curseurs de contrôle. |
| **`style.css`** | Styles pour l'affichage plein écran. |
| **`flares.jpg`** | Texture de flare lumineux pour les étoiles. |

---

## 🚀 Utilisation

### Version Web (p5.js)
Lancez le serveur web local :
```bash
npm run dev
```
Puis ouvrez [`http://localhost:5173/src/galaxy/`](http://localhost:5173/src/galaxy/).

**Contrôles interactifs :**
- `Curseur Étoiles` : Nombre d'étoiles (500 à 8000).
- `Curseur Torsion (Twist)` / Touches `←` `→` : Ajuste la courbure des bras spiraux.
- `Curseur Ratio Ellipse` / Touches `↑` `↓` : Aplatissement de l'ellipse galactique.
- `Curseur Vitesse` : Vitesse de rotation orbitale.
- `Sélecteur Couleur` : Schémas de couleurs (Or chaud, Bleu Cosmique, Plasma, Gradient).
- `Espace` : Mettre en pause / reprendre.
- `R` : Réinitialiser la galaxie.

### Version Processing (Java)
1. Ouvrez `Galaxy.pde` dans l'IDE [Processing](https://processing.org/).
2. Lancez avec `Ctrl+R` / `Cmd+R`.
