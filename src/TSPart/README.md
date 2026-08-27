# TSP Art

Dessin d'art en trait continu basé sur la résolution du problème du voyageur de commerce (*Traveling Salesman Problem - TSP*).

Par **Philippe Guglielmetti (Dr. Goulu)**.

Inspiré du célèbre challenge TSP de l'Université de Waterloo et des travaux de Robert Bosch (*Mona Lisa 100K TSP*).

---

## 📐 Principe

1. Une image (ex: *La Joconde*) est échantillonnée par densité de points stippling (ex: 100 000 villes).
2. Un algorithme d'optimisation heuristique (LKH / Algorithme Génétique de Yuichi Nagata) trouve un tour fermé reliant tous les points avec la distance minimale (longueur record de 5 757 191 pour Mona Lisa).
3. Le tracé s'effectue en une seule ligne continue ininterrompue, commençant par le centre (le visage) pour révéler progressivement le chef-d'œuvre.

---

## 📂 Contenu du dossier

| Fichier | Description |
| :--- | :--- |
| **`tspart.pde`** | Sketch **Processing (Java)** lisant `mona-lisa100K.tsp` et `monalisa_5757191.tour`. |
| **`sketch.js`** | Version interactive en **p5.js** avec prévisualisation immédiate et chargeur de fichiers TSPLIB. |
| **`index.html`** | Interface web avec contrôles de styles (encre, sépia, cyan, or) et vitesse de tracé. |
| **`style.css`** | Feuilles de style de l'application web. |

---

## 🚀 Utilisation

### Version Web (p5.js)
Lancez le serveur web local :
```bash
npm run dev
```
Puis ouvrez [`http://localhost:5173/src/TSPart/`](http://localhost:5173/src/TSPart/) ou directement sur [GitHub Pages](https://goulu.github.io/processing/src/TSPart/).

**Fonctionnalités :**
- `Modèles` : Mona Lisa TSP, Spirale de Fermat continue, Courbe de Hilbert.
- `Segments par frame` : Ajustement de la vitesse de tracé continu (10 à 1500 segments/frame).
- `Styles d'encre` : Encre noire, sépia vintage, luminescence cyan, or cosmique.
- `Chargeur de fichier (.tsp / .tour)` : Déposez n'importe quelle instance TSPLIB personnalisée.

### Version Processing (Java)
1. Téléchargez les fichiers de données [Mona Lisa 100K TSP](https://www.math.uwaterloo.ca/tsp/data/ml/monalisa.html) (`mona-lisa100K.tsp` et `monalisa_5757191.tour`) et placez-les dans `src/TSPart/`.
2. Ouvrez `tspart.pde` dans l'IDE [Processing](https://processing.org/).
3. Exécutez avec `Ctrl+R` / `Cmd+R`.
