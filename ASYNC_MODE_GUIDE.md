# Guide du Mode Asynchrone

## 🚀 Utilisation du composant en mode asynchrone

Le composant `BootstrapSelectableInput` supporte maintenant le mode asynchrone de manière simple et flexible.

### 📋 Props pour le mode asynchrone

```typescript
interface AsyncProps {
  isLoading?: boolean // Indique l'état de chargement
  loadingText?: string // Texte affiché pendant le chargement (défaut: "Chargement...")
  noResultsText?: string // Texte affiché quand aucun résultat (défaut: "Aucun résultat")
  onInputChange?: (value: string) => void // Callback appelé quand l'input change
}
```

### 🔧 Implémentation côté parent

```typescript
import { useState, useCallback, useRef, useEffect } from 'react'
import { BootstrapSelectableInput } from './BootstrapSelectableInput'

export function AsyncExample() {
  const [items, setItems] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  
  // Ref pour gérer le debounce
  const debounceRef = useRef<number | undefined>(undefined)
  
  // Fonction pour charger les items avec debounce
  const handleInputChange = useCallback((searchTerm: string) => {
    // Annuler le précédent timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    
    // Si le terme de recherche est vide, vider les résultats
    if (!searchTerm.trim()) {
      setItems([])
      return
    }
    
    // Debounce de 300ms
    debounceRef.current = setTimeout(async () => {
      setIsLoading(true)
      try {
        const results = await fetchFromAPI(searchTerm)
        setItems(results)
      } catch (error) {
        console.error('Erreur lors de la recherche:', error)
        setItems([])
      } finally {
        setIsLoading(false)
      }
    }, 300)
  }, [])
  
  // Nettoyer le timeout au démontage
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  return (
    <BootstrapSelectableInput
      items={items}
      isLoading={isLoading}
      onInputChange={handleInputChange}
      onSelectionChange={setSelectedItem}
      placeholder="Tapez pour rechercher..."
      loadingText="Recherche en cours..."
      noResultsText="Aucun résultat trouvé"
    />
  )
}
```

### 🎯 Avantages de cette approche

- ✅ **Simplicité** : Le composant reste simple et focalisé sur l'UI
- ✅ **Flexibilité** : Compatible avec toute API (REST, GraphQL, WebSocket, etc.)
- ✅ **Contrôle total** : Le parent gère debounce, cache, retry, annulation
- ✅ **Réutilisabilité** : Peut être utilisé avec différentes sources de données
- ✅ **Performance** : Pas de logique asynchrone complexe dans le composant

### 🔄 Modes supportés

#### Mode Single
```typescript
<BootstrapSelectableInput
  items={items}
  isLoading={isLoading}
  onInputChange={handleInputChange}
  onSelectionChange={setSelectedItem}
  // ... autres props
/>
```

#### Mode Multiple
```typescript
<BootstrapSelectableInput
  items={items}
  isLoading={isLoading}
  onInputChange={handleInputChange}
  itemSelection="multiple"
  onMultiSelectionChange={setSelectedItems}
  maxSelections={5}
  canSelectAll
  // ... autres props
/>
```

### 🎨 Indicateurs visuels

Le composant affiche automatiquement :
- **Spinner dans le bouton toggle** pendant le chargement
- **Spinner dans le menu** avec texte personnalisable
- **Message "Aucun résultat"** personnalisable
- **Désactivation des interactions** pendant le chargement

### 🚫 Limitations

- Le filtrage côté client est désactivé en mode async (les items sont affichés tels quels)
- La logique de debounce doit être implémentée côté parent
- La gestion d'erreurs doit être gérée côté parent

### 📝 Exemple complet

Voir le fichier `AsyncBootstrapExample.tsx` pour un exemple complet d'implémentation avec simulation d'API.
