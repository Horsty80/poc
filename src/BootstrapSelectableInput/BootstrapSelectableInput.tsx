import { useEffect } from 'react'
import { useCombobox } from 'downshift'
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  size,
  autoPlacement,
  FloatingPortal
} from '@floating-ui/react'

import { SelectableInputProvider } from './context'
import { useSelectableInputLogic } from './hooks'
import { SelectedItems } from './SelectedItems'
import { SearchInput } from './SearchInput'
import { ActionButtons } from './ActionButtons'
import { DropdownMenu } from './DropdownMenu'
import { FormInfo } from './FormInfo'

import type { BootstrapSelectableInputProps } from './types'
import '../BootstrapSelectableInput.css'

export function BootstrapSelectableInput(props: BootstrapSelectableInputProps) {
  const {
    placeholder,
    placement = 'auto',
    enableFlip = true,
    portal = true,
    size: inputSize,
    variant = 'primary',
    label,
    helpText,
    isInvalid = false,
    errorMessage,
    appendTo,
    itemSelection = 'single',
    canSelectAll = false,
    // Props pour l'état de chargement
    isLoading = false,
    loadingText = "Chargement...",
    noResultsText = "Aucun résultat"
  } = props

  // Utiliser le hook pour la logique métier
  const contextValue = useSelectableInputLogic(props)
  
  const {
    selectedItem,
    inputValue,
    setInputValue,
    filteredItems,
    onInputChange
  } = contextValue

  // Placeholder statique
  const effectivePlaceholder = placeholder || (itemSelection === 'multiple' 
    ? "Sélectionnez des éléments..."
    : "Sélectionnez un élément...")

  // Configuration de Floating UI
  const { refs, floatingStyles, placement: finalPlacement } = useFloating({
    placement: placement === 'auto' ? undefined : placement === 'top' ? 'top-start' : 'bottom-start',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(4),
      enableFlip && flip(),
      shift({ padding: 8 }),
      size({
        apply({ availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            maxHeight: `${Math.min(300, availableHeight)}px`,
          })
        },
        padding: 8,
      }),
      placement === 'auto' && autoPlacement({
        allowedPlacements: ['top-start', 'bottom-start'],
      }),
    ].filter(Boolean),
  })

  // Gérer l'élément de référence personnalisé
  useEffect(() => {
    if (appendTo && refs.setReference) {
      const targetElement = document.querySelector(appendTo)
      if (targetElement) {
        refs.setReference(targetElement as Element)
      }
    }
  }, [appendTo, refs.setReference])

  // Configuration de Downshift
  const {
    getInputProps,
    getItemProps,
    getMenuProps,
    highlightedIndex,
    isOpen,
    getToggleButtonProps,
  } = useCombobox({
    items: filteredItems,
    selectedItem: itemSelection === 'single' ? selectedItem : null,
    inputValue,
    onInputValueChange: ({ inputValue: newInputValue }) => {
      setInputValue(newInputValue || '')
      onInputChange?.(newInputValue || '')
    },
    onSelectedItemChange: ({ selectedItem: newSelectedItem }) => {
      if (itemSelection === 'multiple') {
        if (newSelectedItem) {
          contextValue.handleMultiSelect(newSelectedItem)
        }
      } else {
        contextValue.setSelectedItem(newSelectedItem || null)
        contextValue.onSelectionChange?.(newSelectedItem || null)
      }
    },
    itemToString: (item) => item?.label || '',
  })

  // Classes Bootstrap pour le bouton
  const buttonClasses = [
    'btn',
    `btn-outline-${variant}`,
    inputSize && `btn-${inputSize}`,
    'border-start-0'
  ].filter(Boolean).join(' ')

  const menuContent = (
    <DropdownMenu
      isOpen={isOpen}
      isLoading={isLoading}
      loadingText={loadingText}
      noResultsText={noResultsText}
      getMenuProps={getMenuProps}
      getItemProps={getItemProps}
      highlightedIndex={highlightedIndex}
      floatingStyles={floatingStyles}
      refs={refs}
      canSelectAll={canSelectAll}
    />
  )

  return (
    <SelectableInputProvider value={contextValue}>
      <div className="bootstrap-selectable-container">
        {label && (
          <label className="form-label fw-bold">
            {label}
            {isInvalid && <span className="text-danger ms-1">*</span>}
          </label>
        )}
        
        <div className="input-group" ref={appendTo ? undefined : refs.setReference}>
          <div className={`form-control p-1 d-flex flex-wrap align-items-center gap-1 ${isInvalid ? 'is-invalid' : ''}`} 
               style={{ minHeight: inputSize === 'lg' ? '48px' : inputSize === 'sm' ? '31px' : '38px' }}>
            
            {/* Badges des éléments sélectionnés en mode multiple */}
            <SelectedItems variant={variant} />
            
            {/* Input de recherche */}
            <SearchInput 
              placeholder={effectivePlaceholder}
              getInputProps={getInputProps}
            />
          </div>
          
          {/* Boutons d'action */}
          <ActionButtons
            isLoading={isLoading}
            isOpen={isOpen}
            getToggleButtonProps={getToggleButtonProps}
            buttonClasses={buttonClasses}
          />
        </div>
        
        {/* Informations et erreurs */}
        <FormInfo
          helpText={helpText}
          isInvalid={isInvalid}
          errorMessage={errorMessage}
        />
        
        {/* Menu déroulant */}
        {portal ? (
          <FloatingPortal>
            {menuContent}
          </FloatingPortal>
        ) : (
          menuContent
        )}
        
        {/* Badge de statut */}
        {isOpen && (
          <div className="position-absolute top-0 end-0 translate-middle">
            <span className={`badge rounded-pill bg-${variant}`}>
              {finalPlacement?.startsWith('top') ? '↑' : '↓'}
              <span className="visually-hidden">Direction du menu</span>
            </span>
          </div>
        )}
      </div>
    </SelectableInputProvider>
  )
}
