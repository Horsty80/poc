# BootstrapSelectableInput - Structure Refactorisée

Ce document décrit la nouvelle structure du composant `BootstrapSelectableInput` après refactorisation pour améliorer la maintenabilité et réduire la complexité.

## Structure du projet

```
src/BootstrapSelectableInput/
├── index.ts                      # Point d'entrée principal avec exports
├── types.ts                      # Définitions de types et interfaces
├── context.tsx                   # Context React pour partager l'état
├── hooks.ts                      # Hook personnalisé pour la logique métier
├── BootstrapSelectableInput.tsx  # Composant principal orchestrateur
├── SelectedItems.tsx             # Composant pour afficher les éléments sélectionnés
├── SearchInput.tsx               # Composant pour l'input de recherche
├── ActionButtons.tsx             # Composant pour les boutons d'action
├── DropdownMenu.tsx              # Composant pour le menu déroulant
└── FormInfo.tsx                  # Composant pour les informations d'aide et erreurs
```

## Avantages de cette structure

### 1. **Séparation des responsabilités**
- Chaque composant a une responsabilité spécifique et bien définie
- La logique métier est centralisée dans le hook `useSelectableInputLogic`
- L'état est partagé via un contexte React

### 2. **Réduction de la complexité**
- Le composant principal (565 lignes) est maintenant divisé en 9 fichiers plus petits
- Chaque fichier fait entre 50-150 lignes, plus facile à comprendre et maintenir
- Code plus lisible et plus facile à déboguer

### 3. **Réutilisabilité**
- Les sous-composants peuvent être réutilisés dans d'autres contextes
- La logique métier dans le hook peut être réutilisée facilement
- Types partagés pour une meilleure cohérence

### 4. **Testabilité améliorée**
- Chaque composant peut être testé de manière isolée
- La logique métier peut être testée indépendamment de l'UI
- Plus facile de mocker les dépendances

## Description des fichiers

### `types.ts`
Contient toutes les définitions de types TypeScript :
- `Item` : Interface pour les éléments de la liste
- `BaseProps` : Props communes à tous les modes
- `SingleSelectionProps` : Props spécifiques au mode single
- `MultipleSelectionProps` : Props spécifiques au mode multiple
- `BootstrapSelectableInputProps` : Union type des props du composant

### `context.tsx`
Définit le contexte React pour partager l'état entre les composants :
- État de sélection (items sélectionnés, input value, etc.)
- Fonctions de manipulation de l'état
- Configuration (filtres, options)
- Provider et hook personnalisé pour l'utilisation

### `hooks.ts`
Contient la logique métier principale dans `useSelectableInputLogic` :
- Gestion de l'état local
- Filtrage des éléments
- Fonctions de sélection/désélection
- Création de nouveaux tags
- Logique de validation

### Composants UI

#### `SelectedItems.tsx`
Affiche les badges des éléments sélectionnés en mode multiple :
- Mode summary (compteur) ou détaillé (badges individuels)
- Boutons de suppression pour chaque élément

#### `SearchInput.tsx`
Gère l'input de recherche :
- Intégration avec Downshift
- Gestion des événements clavier
- Placeholder dynamique

#### `ActionButtons.tsx`
Contient les boutons d'action :
- Bouton toggle du menu
- Bouton toggle summary/détails (mode multiple)
- Bouton clear all (mode multiple)

#### `DropdownMenu.tsx`
Gère l'affichage du menu déroulant :
- Liste des éléments filtrés
- États de chargement
- Bouton "Sélectionner tout"
- Bouton "Créer nouveau tag"
- Sous-composants `SelectAllButton` et `CreateTagButton`

#### `FormInfo.tsx`
Affiche les informations contextuelles :
- Messages d'aide
- Messages d'erreur
- Compteur de sélections (mode multiple)

### `BootstrapSelectableInput.tsx`
Composant principal qui orchestre tous les sous-composants :
- Configuration de Floating UI pour le positionnement
- Configuration de Downshift pour la navigation
- Assemblage des composants
- Gestion du portal et du positionnement

## Utilisation

L'utilisation du composant reste identique à l'ancienne version :

```tsx
import { BootstrapSelectableInput } from './BootstrapSelectableInput'

// Mode single
<BootstrapSelectableInput
  items={items}
  itemSelection="single"
  onSelectionChange={(item) => console.log(item)}
/>

// Mode multiple
<BootstrapSelectableInput
  items={items}
  itemSelection="multiple"
  canSelectAll={true}
  onMultiSelectionChange={(items) => console.log(items)}
/>
```

## Migration

Pour migrer depuis l'ancienne version :

1. **Mise à jour des imports** : L'import principal reste le même
2. **Types disponibles** : Tous les types sont maintenant exportés depuis l'index
3. **Compatibilité** : L'API publique est 100% compatible avec l'ancienne version

## Développement

### Ajouter une nouvelle fonctionnalité

1. **Types** : Ajouter les nouveaux types dans `types.ts`
2. **Context** : Étendre l'interface du contexte si nécessaire
3. **Hook** : Implémenter la logique dans `hooks.ts`
4. **UI** : Créer un nouveau composant ou modifier un existant
5. **Principal** : Intégrer dans le composant principal

### Déboggage

La nouvelle structure facilite le déboggage :
- Utiliser les DevTools React pour inspecter le contexte
- Chaque composant peut être débogué indépendamment
- La logique métier est isolée dans le hook

Cette refactorisation améliore significativement la maintenabilité du code tout en préservant toutes les fonctionnalités existantes.
