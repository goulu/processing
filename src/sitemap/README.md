# Sitemap

Visualisation graphique et cartographie sous forme de graphe dynamique orienté par forces (*force-directed graph*) avec ressorts physiques et répulsion coulombienne.

Par **Marcel Salathé** & **Philippe Guglielmetti (Dr. Goulu)**.

---

## 📂 Contenu du dossier

| Fichier | Description |
| :--- | :--- |
| **`sitemap.pde`** | Sketch original **Processing (Java)** utilisant `htmlparser`, `traer.physics` et `traer.animation`. |
| **`sketch.js`** | Portage web interactif en **p5.js** avec simulation de ressorts, répulsion et caméra adaptative. |
| **`index.html`** | Page web avec presets de réseaux et barre d'outils. |
| **`style.css`** | Styles pour l'interface et l'infobulle (hover card). |

---

## 🚀 Utilisation

### Version Web (p5.js)
Lancez le serveur web local :
```bash
npm run dev
```
Puis ouvrez [`http://localhost:5173/src/sitemap/`](http://localhost:5173/src/sitemap/).

**Fonctionnalités interactives :**
- `Exemples de sites` : Préconfigurations (drgoulu.com blog, processing.org/p5js.org, arborescence hiérarchique).
- `Curseur Répulsion` : Force de répulsion électrostatique entre nœuds pour espacer le graphe.
- `Curseur Longueur des liens` : Distance d'équilibre des ressorts.
- `Centrage automatique` : Caméra dynamique qui s'adapte à la taille et au centre de masse du graphe.
- `Glisser-Déposer` : Déplacer n'importe quel nœud avec la souris pour voir la réaction élastique.
- `Création de nœuds` : Cliquer dans le vide pour faire pousser une nouvelle branche.

### Version Processing (Java)
1. Ouvrez `sitemap.pde` dans l'IDE [Processing](https://processing.org/).
2. Bibliothèques requises : `htmlparser`, `traer.physics`, `traer.animation`.
3. Lancez avec `Ctrl+R` / `Cmd+R`.
