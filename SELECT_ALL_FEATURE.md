# BootstrapSelectableInput - Fonctionnalité Select All

## Nouvelle fonctionnalité : `canSelectAll`

La prop `canSelectAll` permet d'ajouter un bouton "Sélectionner tout" / "Désélectionner tout" dans la liste déroulante du composant.

### ✅ Validation TypeScript

Le système de types empêche l'utilisation de `canSelectAll` avec le mode `single` :

```typescript
// ✅ Valide - Mode multiple avec Select All
<BootstrapSelectableInput
  items={items}
  itemSelection="multiple"
  canSelectAll={true}
  onMultiSelectionChange={(items) => console.log(items)}
/>

// ❌ Erreur TypeScript - canSelectAll non autorisé en mode single
<BootstrapSelectableInput
  items={items}
  itemSelection="single"  // ou undefined (défaut)
  canSelectAll={true}     // ❌ Erreur de compilation !
  onSelectionChange={(item) => console.log(item)}
/>
```

### Types de props

Le composant utilise une union de types discriminants :

- **`SingleSelectionProps`** : Pour le mode `single` (défaut)
  - ✅ `onSelectionChange`
  - ❌ `canSelectAll`, `onMultiSelectionChange`, `maxSelections`, `summaryMode`

- **`MultipleSelectionProps`** : Pour le mode `multiple`
  - ✅ `onMultiSelectionChange`, `canSelectAll`, `maxSelections`, `summaryMode`
  - ❌ `onSelectionChange`

### Fonctionnement

1. **Bouton dans la liste** : Quand `canSelectAll={true}`, un bouton apparaît en haut de la liste déroulante
2. **Respect des filtres** : Le "Select All" ne sélectionne que les éléments actuellement filtrés
3. **Respect des limites** : Si `maxSelections` est défini, le "Select All" respecte cette limite
4. **État intelligent** : Le bouton change automatiquement entre "Sélectionner tout" et "Désélectionner tout"

### Exemples d'utilisation

```typescript
// Basique
<BootstrapSelectableInput
  items={items}
  itemSelection="multiple"
  canSelectAll={true}
/>

// Avec limite
<BootstrapSelectableInput
  items={items}
  itemSelection="multiple"
  canSelectAll={true}
  maxSelections={3}  // Select All ne sélectionnera que les 3 premiers
/>

// Avec filtres
// L'utilisateur tape "React" -> Select All ne sélectionnera que les items filtrés
<BootstrapSelectableInput
  items={items}
  itemSelection="multiple"
  canSelectAll={true}
/>
```

### Interface utilisateur

- **Icône** : □ pour "non sélectionné", ☑ pour "sélectionné"
- **Texte dynamique** : "Sélectionner tout" / "Désélectionner tout"
- **Compteur** : Affiche le nombre d'éléments filtrés quand il y a un filtre actif
- **Position** : En haut de la liste, séparé par une bordure

### Comportement par défaut

- `canSelectAll` est `false` par défaut
- Disponible uniquement en mode `multiple`
- TypeScript empêche son utilisation en mode `single`
