# Processing & p5.js Creative Coding

Ce dépôt regroupe des sketches d'art génératif, de simulations physiques et d'algorithmes visuels développés en **[Processing](https://processing.org/) (Java)** et en **[p5.js](https://p5js.org/) (JavaScript)**.

---

## 📁 Structure du projet

```text
├── Galaxy/                   # Processing (Java) : Simulation de galaxie spirale
│   ├── Galaxy.pde
│   └── flares.jpg
├── NBody/                    # Processing (Java) : Dynamique gravitationnelle N-corps
│   ├── NBody.pde
│   └── system.xml
├── random tiling/            # Processing (Java) : Pavage aléatoire géométrique
│   └── RandomTiling.pde
├── sitemap/                  # Processing (Java) : Visualisation cartographique de sitemap
│   └── sitemap.pde
├── p5js/                     # Sketches web p5.js
│   └── random-tiling/        # Portage web interactif de Random Tiling
├── templates/
│   └── p5-sketch/            # Modèle prêt à l'emploi pour nouveau sketch p5.js
├── scripts/
│   └── new-p5-sketch.js      # Générateur CLI pour nouveau sketch p5.js
├── index.html                # Galerie / hub web de prévisualisation
└── package.json              # Outillage Node.js / Vite / p5
```

---

## 🚀 Démarrage rapide

### 1. Développement Web avec p5.js

Prérequis : [Node.js](https://nodejs.org/) (v18+)

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement (Hub & sketches)
npm run dev

# Créer un nouveau sketch p5.js à partir du template
npm run new:p5 mon-nouveau-sketch
```

Le script `npm run new:p5 <nom>` génère automatiquement un nouveau dossier dans `p5js/<nom>` avec `index.html`, `sketch.js`, et `style.css`.

### 2. Exécution des sketches Processing (Java)

1. Téléchargez et installez l'IDE [Processing](https://processing.org/download).
2. Ouvrez le fichier `.pde` correspondant dans l'IDE (ex: `Galaxy/Galaxy.pde`).
3. Cliquez sur **Exécuter** (`Ctrl+R` ou `Cmd+R`).

---

## 🎨 Sketches disponibles

### Sketches Processing (Java)
- **Galaxy** : Rendu et dynamique spirale avec étoiles, poussières et flares lumineux.
- **NBody** : Simulation orbitale à N corps configurée par fichier XML.
- **Random Tiling** : Pavage planaire aléatoire non recouvrant distribué selon Riemann-Zeta.
- **Sitemap** : Arbre et cartographie de sites web.

### Sketches p5.js (Web)
- **Random Tiling** : Version interactive avec panneau de contrôle (cercles, étoiles, polygones, pause/reprise, redimensionnement dynamique).

---

## 📄 Licence

MIT - [Philippe Guglielmetti](https://github.com/goulu)
