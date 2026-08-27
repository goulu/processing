# Processing & p5.js Creative Coding

Ce dépôt regroupe des sketches d'art génératif, de simulations physiques et d'algorithmes visuels développés en **[Processing](https://processing.org/) (Java)** et en **[p5.js](https://p5js.org/) (JavaScript)** par **Philippe Guglielmetti ([Dr. Goulu](https://www.goulu.net/))**.

Chaque projet dispose de son propre dossier autonome regroupant son code source Processing (Java), son portage interactif p5.js (Web) et sa documentation dédiée.

---

## 📁 Projets disponibles

| Projet | Processing (Java) | p5.js (Web) | Description |
| :--- | :---: | :---: | :--- |
| **[`galaxy/`](file:///home/goulu/Documents/develop/processing/galaxy)** | `Galaxy.pde` | `sketch.js` | Simulation de galaxie spirale à rotation différentielle et torsion. |
| **[`nbody/`](file:///home/goulu/Documents/develop/processing/nbody)** | `NBody.pde` | `sketch.js` | Dynamique gravitationnelle du Système Solaire (`system.xml`) et orbites. |
| **[`random-tiling/`](file:///home/goulu/Documents/develop/processing/random-tiling)** | `RandomTiling.pde` | `sketch.js` | Pavage planaire aléatoire distribué selon Riemann-Zeta. |
| **[`sitemap/`](file:///home/goulu/Documents/develop/processing/sitemap)** | `sitemap.pde` | `sketch.js` | Graphe orienté par forces physiques (ressorts et répulsion). |

---

## 🚀 Démarrage rapide

### 1. Version Web (p5.js)

Prérequis : [Node.js](https://nodejs.org/) (v18+)

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement (Hub et sketches)
npm run dev

# Créer un nouveau projet p5.js autonome avec son README
npm run new:p5 mon-nouveau-sketch
```

Accédez au Hub à l'adresse [`http://localhost:5173/`](http://localhost:5173/) ou directement à un sketch (ex : [`http://localhost:5173/galaxy/`](http://localhost:5173/galaxy/)).

### 2. Version Processing (Java)

1. Téléchargez l'IDE [Processing](https://processing.org/download).
2. Ouvrez le fichier `.pde` correspondant (ex: `galaxy/Galaxy.pde`, `nbody/NBody.pde`, etc.).
3. Exécutez avec `Ctrl+R` / `Cmd+R`.

---

## 📄 Licence

MIT - [Philippe Guglielmetti](https://github.com/goulu)
