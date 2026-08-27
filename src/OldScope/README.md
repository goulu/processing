# OldScope

Simulateur d'oscilloscope cathodique (CRT) vintage avec rémanence phosphorescente, grille de réticule analogique et figures de Lissajous.

Par **Philippe Guglielmetti (Dr. Goulu)**.

---

## 📂 Contenu du dossier

| Fichier | Description |
| :--- | :--- |
| **`scope.pde`** | Sketch **Processing (Java)** simulant les figures de Lissajous et l'afterglow phosphorescent. |
| **`sketch.js`** | Version **p5.js** interactive avec halo phosphoreux, modes X-Y, Y-T, modulation et synthèse harmonique de Fourier. |
| **`index.html`** | Interface web avec potentiomètres de fréquences et sélection de type de phosphore. |
| **`style.css`** | Feuilles de style du simulateur d'oscilloscope. |

---

## 🚀 Utilisation

### Version Web (p5.js)
Lancez le serveur web local :
```bash
npm run dev
```
Puis ouvrez [`http://localhost:5173/src/OldScope/`](http://localhost:5173/src/OldScope/) ou directement sur [GitHub Pages](https://goulu.github.io/processing/src/OldScope/).

**Fonctionnalités :**
- `Modes de signal` :
  - **Mode X-Y (Figures de Lissajous)** : Harmoniques et déphasage $f_x : f_y$.
  - **Mode Y-T (Balayage temporel)** : Visualisation de signal sinusoïdal classique.
  - **Modulation AM / Battements** : Signal modulé en amplitude.
  - **Superposition Harmonique (Fourier)** : Synthèse de signaux carrés par harmoniques impaires.
- `Fréquences & Déphasage` : Ajustement de $f_x$, $f_y$ et de la vitesse de phase.
- `Types de phosphore` : Vert P1 classique, Ambre P3, Cyan P7.

### Version Processing (Java)
1. Ouvrez `scope.pde` dans l'IDE [Processing](https://processing.org/).
2. Touches clavier : `1`/`2` pour modifier $f_x$, `3`/`4` pour $f_y$, `M` pour changer de mode, `C` pour la couleur, `Espace` pour figer la phase.
3. Exécutez avec `Ctrl+R` / `Cmd+R`.
