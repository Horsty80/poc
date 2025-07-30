import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import type { Item, SelectionMode } from './types'

export interface SelectableInputContextValue {
  // État de sélection
  selectedItem: Item | null
  selectedItems: Item[]
  inputValue: string
  itemSelection: SelectionMode
  internalSummaryMode: boolean
  
  // Actions de sélection
  setSelectedItem: (item: Item | null) => void
  setSelectedItems: (items: Item[]) => void
  setInputValue: (value: string) => void
  setInternalSummaryMode: (mode: boolean) => void
  
  // Méthodes utilitaires
  handleMultiSelect: (item: Item) => void
  removeSelectedItem: (item: Item) => void
  clearAllSelections: () => void
  selectAllItems: () => void
  areAllFilteredItemsSelected: () => boolean
  createNewTag: (label: string) => Promise<void>
  
  // Configuration
  filteredItems: Item[]
  maxSelections?: number
  createTag: boolean
  canCreateNewTag: boolean
  exactMatch?: Item
  
  // Callbacks
  onSelectionChange?: (item: Item | null) => void
  onMultiSelectionChange?: (items: Item[]) => void
  onCreateTag?: (label: string) => Item | Promise<Item>
  onInputChange?: (value: string) => void
}

const SelectableInputContext = createContext<SelectableInputContextValue | null>(null)

export const useSelectableInputContext = () => {
  const context = useContext(SelectableInputContext)
  if (!context) {
    throw new Error('useSelectableInputContext must be used within a SelectableInputProvider')
  }
  return context
}

export interface SelectableInputProviderProps {
  children: ReactNode
  value: SelectableInputContextValue
}

export const SelectableInputProvider = ({ children, value }: SelectableInputProviderProps) => {
  return (
    <SelectableInputContext.Provider value={value}>
      {children}
    </SelectableInputContext.Provider>
  )
}
