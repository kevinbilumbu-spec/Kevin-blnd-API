# PAIE-GOUV Dashboard

Tableau de bord React + Vite pour la gestion de la paie, des agents, des réclamations et des rapports administratifs.

## Description

Cette application offre une interface de gestion RH pour les fonctionnaires, avec :
- gestion des agents et des fiches de paie
- simulation de cycles de paie
- suivi des contentieux et réclamations
- génération de rapports imprimables
- export CSV / transmission bancaire simulée

## Prérequis

- Node.js (version compatible avec Vite)
- npm ou un autre gestionnaire de packages compatible

## Installation

1. Ouvrir un terminal dans le dossier du projet
2. Installer les dépendances :

```bash
npm install
```

## Scripts utiles

- `npm run dev` : démarre le serveur de développement Vite
- `npm run build` : construit l'application pour la production
- `npm run preview` : prévisualise le build de production
- `npm run lint` : exécute `tsc --noEmit` pour vérifier la validité TypeScript

## Structure principale

- `src/App.tsx` : application principale avec navigation par onglets
- `src/components/` : composants React pour agents, paie, réclamations, banque et rapports
- `src/data/mockData.ts` : données initiales de démonstration
- `src/types.ts` : types TypeScript partagés

## Note

L'environnement actuel de l'agent ne fournit pas `node`/`npm`, donc l'application n'a pas été construite ici. En local, utilisez les commandes ci-dessus pour vérifier et démarrer le projet.
