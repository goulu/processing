# Busy Beaver (Castor Affairé)

Simulation des champions du problème du **Castor Affairé** (*Busy Beaver*) sur machine de Turing 1D et 2D (Turmite).

Par **Philippe Guglielmetti (Dr. Goulu)**.

---

## 📐 Principe Théorique

Le problème du Castor Affairé (*Busy Beaver* ou $BB$) consiste à trouver, parmi toutes les machines de Turing à $n$ états et 2 symboles $\{0, 1\}$ démarrant sur un ruban vierge (rempli de 0), celle qui écrit le plus grand nombre de 1 ($\Sigma(n)$) ou qui effectue le plus grand nombre d'étapes ($S(n)$) **avant de s'arrêter**.

### Champions connus :
- **BB(2)** : 6 pas, 4 uns
- **BB(3)** : 21 pas, 6 uns
- **BB(4)** : 107 pas, 13 uns
- **BB(5)** : $\ge 47\ 176\ 870$ pas, $4098$ uns (prouvé récemment en 2024 !)

---

## 📂 Contenu du dossier

| Fichier | Description |
| :--- | :--- |
| **`castor.pde`** | Sketch **Processing (Java)** avec visualisation spatio-temporelle. |
| **`sketch.js`** | Version **p5.js** interactive avec modes diagramme spatio-temporel, ruban défilant et Turmite 2D. |
| **`index.html`** | Interface web avec sélecteur de machine $BB(n)$, vitesse et pas-à-pas. |
| **`style.css`** | Feuilles de style du simulateur. |

---

## 🚀 Utilisation

### Version Web (p5.js)
Lancez le serveur web local :
```bash
npm run dev
```
Puis ouvrez [`http://localhost:5173/src/BusyBeaver/`](http://localhost:5173/src/BusyBeaver/) ou directement sur [GitHub Pages](https://goulu.github.io/processing/src/BusyBeaver/).

**Fonctionnalités :**
- `Choix de la machine` : $BB(2)$, $BB(3)$, $BB(4)$, $BB(5)$ et Turmite 2D.
- `Modes de visualisation` :
  - **Diagramme Espace-Temps** : Visualise l'évolution temporelle complète du ruban ligne par ligne.
  - **Ruban 1D** : Affiche les cases du ruban et la tête de lecture en gros plan.
  - **Turmite 2D** : Visualisation sur une grille plane 2D.
- `Contrôles` : Vitesse d'exécution (1 à 500 pas/frame), pause, pas-à-pas (*Step*).

### Version Processing (Java)
1. Ouvrez `castor.pde` dans l'IDE [Processing](https://processing.org/).
2. Touches clavier : `2`, `3`, `4`, `5` pour changer de machine, `R` pour réinitialiser.
3. Exécutez avec `Ctrl+R` / `Cmd+R`.
