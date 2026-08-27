# NBody

Simulation de dynamique gravitationnelle à $N$-corps avec intégration numérique de la loi de Newton, configurée à partir du système solaire réel (`system.xml`).

Par **Philippe Guglielmetti (Dr. Goulu)**.

---

## 📂 Contenu du dossier

| Fichier | Description |
| :--- | :--- |
| **`NBody.pde`** | Sketch original **Processing (Java)** utilisant la librairie `traer.physics`. |
| **`sketch.js`** | Portage web interactif en **p5.js** avec intégration numérique et tracé d'orbites. |
| **`index.html`** | Page web avec HUD de simulation et contrôles de caméra. |
| **`style.css`** | Styles pour l'affichage plein écran. |
| **`system.xml`** | Définition des corps célestes (masses, positions initiales, vecteurs vitesse). |

---

## 🚀 Utilisation

### Version Web (p5.js)
Lancez le serveur web local :
```bash
npm run dev
```
Puis ouvrez [`http://localhost:5173/src/NBody/`](http://localhost:5173/src/NBody/).

**Fonctionnalités interactives :**
- `Zoom` : Molette de la souris pour naviguer de l'échelle du système solaire global jusqu'aux lunes galiléennes.
- `Panoramique (Pan)` : Glisser-déposer à la souris pour déplacer la caméra.
- `Centrage prédéfini` : Sélecteur pour focus rapide sur le Soleil, les planètes telluriques, le système Terre-Lune, Jupiter ou Saturne.
- `Curseur de vitesse` : Ajustement de l'accélération temporelle (jours / seconde).
- `Traînées orbitales` : Tracé en temps réel des trajectoires elliptiques.

### Version Processing (Java)
1. Ouvrez `NBody.pde` dans l'IDE [Processing](https://processing.org/).
2. Bibliothèque requise : `traer.physics`.
3. Lancez avec `Ctrl+R` / `Cmd+R`.
