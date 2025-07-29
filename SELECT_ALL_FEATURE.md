# BootstrapSelectableInput - Fonctionnalités avancées

## Nouvelle fonctionnalité : `canSelectAll`

La prop `canSelectAll` permet d'ajouter un bouton "Sélectionner tout" / "Désélectionner tout" dans la liste déroulante du composant.

## Nouvelle fonctionnalité : `createTag`

La prop `createTag` permet de créer de nouveaux éléments à la volée en tapant du texte et en appuyant sur Entrée ou en cliquant sur le bouton "Créer". Cette fonctionnalité est disponible en mode `single` et `multiple`.

### ✅ Validation TypeScript

Le système de types empêche l'utilisation de `canSelectAll` avec le mode `single`, mais autorise `createTag` dans les deux modes :

```typescript
// ✅ Valide - Mode multiple avec Select All
<BootstrapSelectableInput
  items={items}
  itemSelection="multiple"
  canSelectAll={true}
  onMultiSelectionChange={(items) => console.log(items)}
/>

// ✅ Valide - Mode single avec Create Tag
<BootstrapSelectableInput
  items={items}
  itemSelection="single"
  createTag={true}
  onCreateTag={(label) => ({ id: Date.now().toString(), label })}
  onSelectionChange={(item) => console.log(item)}
/>

// ✅ Valide - Mode multiple avec Create Tag
<BootstrapSelectableInput
  items={items}
  itemSelection="multiple"
  createTag={true}
  onCreateTag={(label) => ({ id: Date.now().toString(), label })}
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
  - ✅ `onSelectionChange`, `createTag`, `onCreateTag`
  - ❌ `canSelectAll`, `onMultiSelectionChange`, `maxSelections`, `summaryMode`

- **`MultipleSelectionProps`** : Pour le mode `multiple`
  - ✅ `onMultiSelectionChange`, `canSelectAll`, `createTag`, `onCreateTag`, `maxSelections`, `summaryMode`
  - ❌ `onSelectionChange`

### Fonctionnement Select All

1. **Bouton dans la liste** : Quand `canSelectAll={true}`, un bouton apparaît en haut de la liste déroulante
2. **Respect des filtres** : Le "Select All" ne sélectionne que les éléments actuellement filtrés
3. **Respect des limites** : Si `maxSelections` est défini, le "Select All" respecte cette limite
4. **État intelligent** : Le bouton change automatiquement entre "Sélectionner tout" et "Désélectionner tout"

### Fonctionnement Create Tag

1. **Détection automatique** : Quand l'utilisateur tape du texte qui ne correspond à aucun élément existant
2. **Méthodes de création** :
   - **Touche Entrée** : Appuyer sur Entrée quand aucun élément n'est sélectionné dans la liste
   - **Bouton "Créer"** : Cliquer sur le bouton qui apparaît dans la liste déroulante
3. **Callback requis** : `onCreateTag` doit être fourni pour gérer la création
4. **Comportement selon le mode** :
   - **Mode single** : Le nouvel élément est automatiquement sélectionné et remplace l'ancienne sélection
   - **Mode multiple** : Le nouvel élément est automatiquement ajouté aux sélections existantes
5. **Respect des limites** : En mode multiple, respecte `maxSelections` si défini

### Exemples d'utilisation

```typescript
// Select All basique (mode multiple uniquement)
<BootstrapSelectableInput
  items={items}
  itemSelection="multiple"
  canSelectAll={true}
/>

// Create Tag mode single
<BootstrapSelectableInput
  items={items}
  itemSelection="single"
  createTag={true}
  onCreateTag={(label) => ({
    id: `custom-${Date.now()}`,
    label: label,
    description: "Framework créé par l'utilisateur"
  })}
/>

// Create Tag mode multiple
<BootstrapSelectableInput
  items={items}
  itemSelection="multiple"
  createTag={true}
  onCreateTag={(label) => ({
    id: `custom-${Date.now()}`,
    label: label,
    description: "Tag créé par l'utilisateur"
  })}
/>

// Select All avec limite
<BootstrapSelectableInput
  items={items}
  itemSelection="multiple"
  canSelectAll={true}
  maxSelections={3}  // Select All ne sélectionnera que les 3 premiers
/>

// Create Tag avec gestion asynchrone
<BootstrapSelectableInput
  items={items}
  itemSelection="multiple"
  createTag={true}
  onCreateTag={async (label) => {
    // Appel API pour créer le tag
    const response = await fetch('/api/tags', {
      method: 'POST',
      body: JSON.stringify({ label })
    })
    return response.json()
  }}
/>

// Exemple complet avec toutes les fonctionnalités
<BootstrapSelectableInput
  items={items}
  itemSelection="multiple"
  canSelectAll={true}
  createTag={true}
  maxSelections={5}
  onCreateTag={(label) => ({ id: Date.now().toString(), label })}
  onMultiSelectionChange={(items) => console.log(items)}
/>
```

### Interface utilisateur

**Select All :**
- **Icône** : □ pour "non sélectionné", ☑ pour "sélectionné"
- **Texte dynamique** : "Sélectionner tout" / "Désélectionner tout"
- **Compteur** : Affiche le nombre d'éléments filtrés quand il y a un filtre actif
- **Position** : En haut de la liste, séparé par une bordure

**Create Tag :**
- **Icône** : ➕ avec le texte "Créer"
- **Condition d'affichage** : Apparaît seulement quand le texte saisi ne correspond à aucun élément existant
- **Texte dynamique** : "Créer '[texte saisi]'"
- **Position** : Juste après le bouton Select All (si présent), séparé par une bordure
- **Disponibilité** : Mode `single` et `multiple`

### Comportement par défaut

- `canSelectAll` est `false` par défaut (disponible uniquement en mode `multiple`)
- `createTag` est `false` par défaut (disponible en mode `single` et `multiple`)
- TypeScript empêche l'utilisation de `canSelectAll` en mode `single`

### Props liées à Create Tag

- **`createTag`** (boolean, défaut: false) : Active la fonctionnalité de création de tags
- **`onCreateTag`** (function, requis si createTag=true) : Callback pour créer un nouvel élément
  - Signature : `(label: string) => Item | Promise<Item>`
  - Peut être synchrone ou asynchrone
  - Doit retourner un objet `Item` avec au minimum `id` et `label`
