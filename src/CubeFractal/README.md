# 3D Cube Fractal

Génération et rendu 3D d'une fractale récursive de cubes de cristal avec éclairage spéculaire et navigation spatiale orbitale.

Par **Philippe Guglielmetti (Dr. Goulu)**.

Inspiré de *CrystalCubes* par Stinging Eyes (2008).

---

## 📂 Contenu du dossier

| Fichier | Description |
| :--- | :--- |
| **`cubefractal.pde`** | Sketch **Processing (Java)** 3D utilisant OpenGL / PeasyCam. |
| **`sketch.js`** | Version **p5.js (WebGL)** avec contrôles orbitaux et matériaux cristallins. |
| **`index.html`** | Interface web avec ajustement de profondeur et palettes de matériaux. |
| **`style.css`** | Styles pour l'affichage plein écran et la barre d'outils. |

---

## 🚀 Utilisation

### Version Web (p5.js)
Lancez le serveur web local :
```bash
npm run dev
```
Puis ouvrez [`http://localhost:5173/src/CubeFractal/`](http://localhost:5173/src/CubeFractal/) ou directement sur [GitHub Pages](https://goulu.github.io/processing/src/CubeFractal/).

**Contrôles interactifs :**
- `Profondeur` : Niveau de récursion fractale (1 à 5).
- `Facteur d'échelle` : Ratio de taille des sous-cubes (0.25 à 0.50).
- `Matériaux` : Cristal Améthyste, Émeraude & Jade, Or Impérial, Glace Cyan, Rubis Magmatique.
- `Navigation 3D` :
  - **Clic gauche & glisser** : Faire tourner la caméra autour du centre.
  - **Clic droit & glisser** : Déplacer la caméra (Pan).
  - **Molette** : Zoomer / dézoomer.

### Version Processing (Java)
1. Ouvrez `cubefractal.pde` dans l'IDE [Processing](https://processing.org/).
2. Bibliothèque requise : `peasycam`.
3. Lancez avec `Ctrl+R` / `Cmd+R`.
