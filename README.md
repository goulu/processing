# Processing & p5.js Creative Coding

[![GitHub Pages](https://img.shields.io/badge/Live_Demo-goulu.github.io%2Fprocessing-38bdf8?style=for-the-badge&logo=github&logoColor=white)](https://goulu.github.io/processing/)
[![OpenProcessing](https://img.shields.io/badge/OpenProcessing-@Goulu-ed225d?style=for-the-badge&logo=processingfoundation&logoColor=white)](https://openprocessing.org/@Goulu)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> 🌐 **Démonstration en ligne (Hub interactif)** : **[https://goulu.github.io/processing/](https://goulu.github.io/processing/)**

---

Ce dépôt regroupe des sketches d'art génératif, de simulations physiques et d'algorithmes visuels développés en **[Processing](https://processing.org/) (Java)** et en **[p5.js](https://p5js.org/) (JavaScript)** par **Philippe Guglielmetti ([Dr. Goulu](https://www.goulu.net/))**.

Tous les sketches sont organisés dans le dossier **[`src/`](file:///home/goulu/Documents/develop/processing/src)**. Chaque projet dispose d'un dossier autonome regroupant son code source Processing (Java), son portage interactif p5.js (Web) et sa documentation dédiée.

---

## 🎨 Projets & Démonstrations interactives

| Projet | Version Web (p5.js) | Processing (Java) | Description |
| :--- | :---: | :---: | :--- |
| **[`src/Galaxy/`](file:///home/goulu/Documents/develop/processing/src/Galaxy)** | **[▶ Lancer Galaxy](https://goulu.github.io/processing/src/Galaxy/)** | `Galaxy.pde` | Simulation de galaxie spirale à rotation différentielle et torsion. |
| **[`src/NBody/`](file:///home/goulu/Documents/develop/processing/src/NBody)** | **[▶ Lancer N-Body](https://goulu.github.io/processing/src/NBody/)** | `NBody.pde` | Dynamique gravitationnelle du Système Solaire (`system.xml`) et orbites. |
| **[`src/RandomTiling/`](file:///home/goulu/Documents/develop/processing/src/RandomTiling)** | **[▶ Lancer Random Tiling](https://goulu.github.io/processing/src/RandomTiling/)** | `RandomTiling.pde` | Pavage planaire aléatoire distribué selon Riemann-Zeta. |
| **[`src/Sitemap/`](file:///home/goulu/Documents/develop/processing/src/Sitemap)** | **[▶ Lancer Sitemap](https://goulu.github.io/processing/src/Sitemap/)** | `sitemap.pde` | Graphe orienté par forces physiques (ressorts et répulsion). |
| **[`src/TSPart/`](file:///home/goulu/Documents/develop/processing/src/TSPart)** | **[▶ Lancer TSP Art](https://goulu.github.io/processing/src/TSPart/)** | `tspart.pde` | Dessin continu d'une seule ligne basé sur le voyageur de commerce (Mona Lisa). |
| **[`src/CubeFractal/`](file:///home/goulu/Documents/develop/processing/src/CubeFractal)** | **[▶ Lancer Cube Fractal](https://goulu.github.io/processing/src/CubeFractal/)** | `cubefractal.pde` | Fractale 3D récursive de cubes de cristal avec navigation orbitale. |
| **[`src/BusyBeaver/`](file:///home/goulu/Documents/develop/processing/src/BusyBeaver)** | **[▶ Lancer Busy Beaver](https://goulu.github.io/processing/src/BusyBeaver/)** | `castor.pde` | Champions du Castor Affairé (Machine de Turing 1D et Turmite 2D). |
| **[`src/OldScope/`](file:///home/goulu/Documents/develop/processing/src/OldScope)** | **[▶ Lancer OldScope](https://goulu.github.io/processing/src/OldScope/)** | `scope.pde` | Oscilloscope cathodique vintage, figures de Lissajous et phosphore rémanent. |

---

## 🚀 Démarrage rapide

### 1. Accès direct en ligne
Testez tous les sketches directement dans votre navigateur sans rien installer :
👉 **[https://goulu.github.io/processing/](https://goulu.github.io/processing/)**

### 2. Développement Web local avec p5.js

Prérequis : [Node.js](https://nodejs.org/) (v18+)

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement local (Hub et sketches)
npm run dev

# Créer un nouveau projet p5.js autonome dans src/
npm run new:p5 MonNouveauSketch
```

### 3. Exécution Processing (Java)

1. Téléchargez l'IDE [Processing](https://processing.org/download).
2. Ouvrez le fichier `.pde` correspondant (ex: `src/Galaxy/Galaxy.pde`, `src/NBody/NBody.pde`, `src/RandomTiling/RandomTiling.pde`, `src/Sitemap/sitemap.pde`).
3. Exécutez avec `Ctrl+R` / `Cmd+R`.

---

## 📄 Licence

MIT - [Philippe Guglielmetti](https://github.com/goulu)
