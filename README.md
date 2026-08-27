# Processing & p5.js Creative Coding

Ce dépôt regroupe des sketches d'art génératif, de simulations physiques et d'algorithmes visuels développés en **[Processing](https://processing.org/) (Java)** et en **[p5.js](https://p5js.org/) (JavaScript)**.

Chaque script dispose de son propre dossier regroupant son code source Processing, son implémentation p5.js (le cas échéant) et sa documentation dédiée.

---

## 📁 Structure du projet

```text
├── Galaxy/                   # Processing (Java) : Simulation de galaxie spirale
│   ├── Galaxy.pde
│   ├── flares.jpg
│   └── README.md
├── NBody/                    # Processing (Java) : Dynamique gravitationnelle N-corps
│   ├── NBody.pde
│   ├── system.xml
│   └── README.md
├── random-tiling/            # Processing + p5.js : Pavage aléatoire géométrique
│   ├── RandomTiling.pde      # Code Processing Java
│   ├── index.html            # Interface web p5.js
│   ├── sketch.js             # Code p5.js
│   ├── style.css             # Styles du sketch
│   └── README.md             # Documentation et principes mathématiques
├── sitemap/                  # Processing (Java) : Visualisation cartographique de sitemap
│   ├── sitemap.pde
│   └── README.md
├── templates/
│   └── p5-sketch/            # Modèle prêt à l'emploi pour nouveau sketch p5.js
├── scripts/
│   └── new-p5-sketch.js      # Générateur CLI pour nouveau projet p5.js
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

# Créer un nouveau projet p5.js autonome avec son README
npm run new:p5 mon-nouveau-sketch
```

### 2. Exécution des sketches Processing (Java)

1. Téléchargez et installez l'IDE [Processing](https://processing.org/download).
2. Ouvrez le fichier `.pde` correspondant dans l'IDE (ex: `Galaxy/Galaxy.pde`, `random-tiling/RandomTiling.pde`).
3. Cliquez sur **Exécuter** (`Ctrl+R` ou `Cmd+R`).

---

## 📄 Licence

MIT - [Philippe Guglielmetti](https://github.com/goulu)
