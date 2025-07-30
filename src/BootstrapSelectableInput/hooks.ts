import { useState, useMemo } from 'react'
import type { Item, BootstrapSelectableInputProps } from './types'
import type { SelectableInputContextValue } from './context'

export const useSelectableInputLogic = (props: BootstrapSelectableInputProps): SelectableInputContextValue => {
  const {
    items = [],
    onSelectionChange,
    onMultiSelectionChange,
    itemSelection = 'single',
    maxSelections,
    summaryMode = false,
    createTag = false,
    onCreateTag,
    onInputChange
  } = props

  // États de sélection
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [selectedItems, setSelectedItems] = useState<Item[]>([])
  const [inputValue, setInputValue] = useState('')
  const [internalSummaryMode, setInternalSummaryMode] = useState(summaryMode)

  // Filtrer les éléments selon la saisie
  const filteredItems = useMemo(() => {
    return items.filter(item =>
      item.label.toLowerCase().includes(inputValue.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(inputValue.toLowerCase()))
    )
  }, [items, inputValue])

  // Vérifier si l'input correspond exactement à un élément existant
  const exactMatch = useMemo(() => {
    return filteredItems.find(item => 
      item.label.toLowerCase() === inputValue.toLowerCase().trim()
    )
  }, [filteredItems, inputValue])

  // Vérifier si on peut créer un nouveau tag
  const canCreateNewTag = useMemo(() => {
    return createTag && 
      inputValue.trim().length > 0 && 
      !exactMatch &&
      (itemSelection === 'single' || !maxSelections || selectedItems.length < maxSelections)
  }, [createTag, inputValue, exactMatch, itemSelection, maxSelections, selectedItems.length])

  // Gestion de la sélection multiple
  const handleMultiSelect = (item: Item) => {
    const isAlreadySelected = selectedItems.some(selected => selected.id === item.id)
    let newSelectedItems: Item[]

    if (isAlreadySelected) {
      // Désélectionner l'élément
      newSelectedItems = selectedItems.filter(selected => selected.id !== item.id)
    } else {
      // Vérifier la limite maximale si définie
      if (maxSelections && selectedItems.length >= maxSelections) {
        return // Ne pas ajouter si la limite est atteinte
      }
      // Ajouter l'élément
      newSelectedItems = [...selectedItems, item]
    }

    setSelectedItems(newSelectedItems)
    onMultiSelectionChange?.(newSelectedItems)
  }

  // Fonction pour supprimer un élément sélectionné
  const removeSelectedItem = (itemToRemove: Item) => {
    const newSelectedItems = selectedItems.filter(item => item.id !== itemToRemove.id)
    setSelectedItems(newSelectedItems)
    onMultiSelectionChange?.(newSelectedItems)
  }

  // Fonction pour vider toutes les sélections
  const clearAllSelections = () => {
    setSelectedItems([])
    onMultiSelectionChange?.([])
  }

  // Fonction pour sélectionner tous les éléments filtrés
  const selectAllItems = () => {
    // Ne sélectionner que les éléments filtrés qui ne sont pas déjà sélectionnés
    const itemsToAdd = filteredItems.filter(item => 
      !selectedItems.some(selected => selected.id === item.id)
    )
    
    let newSelectedItems = [...selectedItems, ...itemsToAdd]
    
    // Respecter la limite maximale si définie
    if (maxSelections && newSelectedItems.length > maxSelections) {
      newSelectedItems = newSelectedItems.slice(0, maxSelections)
    }
    
    setSelectedItems(newSelectedItems)
    onMultiSelectionChange?.(newSelectedItems)
  }

  // Vérifier si tous les éléments filtrés sont sélectionnés
  const areAllFilteredItemsSelected = () => {
    return filteredItems.length > 0 && filteredItems.every(item =>
      selectedItems.some(selected => selected.id === item.id)
    )
  }

  // Fonction pour créer un nouveau tag
  const createNewTag = async (label: string) => {
    if (!onCreateTag || !createTag) return

    try {
      const newItem = await onCreateTag(label.trim())
      
      if (itemSelection === 'multiple') {
        // Mode multiple : ajouter aux sélections
        const existsInSelected = selectedItems.some(item => item.id === newItem.id)
        
        if (!existsInSelected) {
          // Vérifier la limite maximale si définie
          if (maxSelections && selectedItems.length >= maxSelections) {
            return // Ne pas ajouter si la limite est atteinte
          }
          
          const newSelectedItems = [...selectedItems, newItem]
          setSelectedItems(newSelectedItems)
          onMultiSelectionChange?.(newSelectedItems)
        }
      } else {
        // Mode single : sélectionner le nouvel élément
        setSelectedItem(newItem)
        onSelectionChange?.(newItem)
      }
      
      // Vider l'input après création
      setInputValue('')
    } catch (error) {
      console.error('Erreur lors de la création du tag:', error)
    }
  }

  return {
    // État de sélection
    selectedItem,
    selectedItems,
    inputValue,
    itemSelection,
    internalSummaryMode,
    
    // Actions de sélection
    setSelectedItem,
    setSelectedItems,
    setInputValue,
    setInternalSummaryMode,
    
    // Méthodes utilitaires
    handleMultiSelect,
    removeSelectedItem,
    clearAllSelections,
    selectAllItems,
    areAllFilteredItemsSelected,
    createNewTag,
    
    // Configuration
    filteredItems,
    maxSelections,
    createTag,
    canCreateNewTag,
    exactMatch,
    
    // Callbacks
    onSelectionChange,
    onMultiSelectionChange,
    onCreateTag,
    onInputChange
  }
}
