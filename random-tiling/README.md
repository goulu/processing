# Random Tiling

Algorithme de pavage aléatoire non-recouvrant du plan par des formes géométriques de tailles décroissantes régies par une loi de puissance (fonction Zêta de Riemann).

Par **Philippe Guglielmetti (Dr. Goulu)**, 2011.

Inspiré des travaux de [Paul Bourke sur le Random Tiling](http://paulbourke.net/texture_colour/randomtile/) et [OpenProcessing](https://www.openprocessing.org/).

---

## 📐 Principe Mathématique

L'aire de chaque forme successive $i$ décroît selon une loi de puissance :
$$g(i) = i^{-c} \quad \text{avec } c > 1$$

L'aire totale théorique disponible est normalisée grâce à la série de Riemann :
$$\zeta(c) = \sum_{i=1}^{\infty} i^{-c}$$

Pour chaque étape :
1. Une forme est dimensionnée selon l'aire $A_i = A_{\text{total}} \cdot \frac{g(i)}{\zeta(c)}$.
2. Une position et orientation aléatoires sont tirées dans le canvas.
3. Si la forme n'intersecte aucune des formes déjà placées, elle est dessinée et enregistrée.
4. L'algorithme passe à la taille suivante jusqu'à saturation de l'espace.

---

## 📂 Contenu du dossier

| Fichier | Description |
| :--- | :--- |
| **`RandomTiling.pde`** | Version originale en **Processing (Java)**. |
| **`sketch.js`** | Portage web interactif en **p5.js**. |
| **`index.html`** | Page web d'exécution du sketch p5.js avec barre d'outils. |
| **`style.css`** | Styles pour l'affichage plein écran et l'interface glassmorphism. |

---

## 🎮 Utilisation

### Version Web (p5.js)
Lancez le serveur web local à la racine :
```bash
npm run dev
```
Puis ouvrez [`http://localhost:5173/random-tiling/`](http://localhost:5173/random-tiling/).

**Contrôles clavier / boutons :**
- `0` : Cercles
- `1` : Étoiles (pentagrammes)
- `3` : Triangles
- `4` : Carrés
- `5` : Pentagones
- `6` : Hexagones
- `Espace` : Mettre en pause / reprendre
- `R` : Réinitialiser le dessin

### Version Processing (Java)
1. Ouvrez `RandomTiling.pde` dans l'IDE [Processing](https://processing.org/).
2. Lancez avec `Ctrl+R` / `Cmd+R`.
