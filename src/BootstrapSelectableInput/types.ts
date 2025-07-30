export interface Item {
  id: string
  label: string
  description?: string
}

// Props de base communes
export interface BaseProps {
  items?: Item[] // Optionnel en mode async
  placeholder?: string
  placement?: 'top' | 'bottom' | 'auto'
  enableFlip?: boolean
  portal?: boolean
  size?: 'sm' | 'lg' // Tailles Bootstrap
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'
  label?: string // Label pour le champ
  helpText?: string // Texte d'aide
  isInvalid?: boolean // État d'erreur
  errorMessage?: string // Message d'erreur
  appendTo?: string // Sélecteur CSS pour l'élément de référence (ex: "#my-container", ".my-class")
  // Props pour l'état de chargement
  isLoading?: boolean // Indique que des données sont en cours de chargement
  loadingText?: string // Texte affiché pendant le chargement
  noResultsText?: string // Texte affiché quand aucun résultat
  onInputChange?: (value: string) => void // Callback appelé quand l'input change (pour déclencher des recherches)
}

// Props pour le mode single
export interface SingleSelectionProps extends BaseProps {
  itemSelection?: 'single'
  onSelectionChange?: (item: Item | null) => void
  createTag?: boolean // Option pour créer de nouveaux éléments à la volée (défaut: false)
  onCreateTag?: (label: string) => Item | Promise<Item> // Callback pour créer un nouvel élément
  // Ces propriétés ne sont pas autorisées en mode single
  onMultiSelectionChange?: never
  maxSelections?: never
  summaryMode?: never
  canSelectAll?: never
}

// Props pour le mode multiple
export interface MultipleSelectionProps extends BaseProps {
  itemSelection: 'multiple'
  onMultiSelectionChange?: (items: Item[]) => void
  maxSelections?: number // Nombre maximum de sélections (optionnel, uniquement pour 'multiple')
  summaryMode?: boolean // Mode résumé pour l'affichage des sélections multiples
  canSelectAll?: boolean // Option pour sélectionner tous les éléments (défaut: false)
  createTag?: boolean // Option pour créer de nouveaux éléments à la volée (défaut: false)
  onCreateTag?: (label: string) => Item | Promise<Item> // Callback pour créer un nouvel élément
  // Cette propriété n'est pas autorisée en mode multiple
  onSelectionChange?: never
}

// Union type pour les props du composant
export type BootstrapSelectableInputProps = SingleSelectionProps | MultipleSelectionProps

export type SelectionMode = 'single' | 'multiple'
