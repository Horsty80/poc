import { useState, useEffect } from 'react'
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
import './BootstrapSelectableInput.css'

interface Item {
  id: string
  label: string
  description?: string // Ajout d'une description optionnelle
}

interface BootstrapSelectableInputProps {
  items: Item[]
  placeholder?: string
  onSelectionChange?: (item: Item | null) => void
  onMultiSelectionChange?: (items: Item[]) => void
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
  multiSelect?: boolean // Mode sélection multiple
  maxSelections?: number // Nombre maximum de sélections (optionnel)
}

export function BootstrapSelectableInput({ 
  items, 
  placeholder, 
  onSelectionChange,
  onMultiSelectionChange,
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
  multiSelect = false,
  maxSelections
}: BootstrapSelectableInputProps) {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [selectedItems, setSelectedItems] = useState<Item[]>([])
  const [inputValue, setInputValue] = useState('')

  // Placeholder dynamique basé sur le mode
  const effectivePlaceholder = placeholder || (multiSelect 
    ? (selectedItems.length > 0 
        ? `${selectedItems.length} élément(s) sélectionné(s)` 
        : "Sélectionnez des éléments...")
    : "Sélectionnez un élément...")

  // Filtrer les éléments selon la saisie
  const filteredItems = items.filter(item =>
    item.label.toLowerCase().includes(inputValue.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(inputValue.toLowerCase()))
  )

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
    selectedItem: multiSelect ? null : selectedItem,
    inputValue,
    onInputValueChange: ({ inputValue: newInputValue }) => {
      setInputValue(newInputValue || '')
    },
    onSelectedItemChange: ({ selectedItem: newSelectedItem }) => {
      if (multiSelect) {
        if (newSelectedItem) {
          handleMultiSelect(newSelectedItem)
        }
      } else {
        setSelectedItem(newSelectedItem || null)
        onSelectionChange?.(newSelectedItem || null)
      }
    },
    itemToString: (item) => item?.label || '',
  })

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

  // Classes Bootstrap pour l'input
  const inputClasses = [
    'form-control',
    inputSize && `form-control-${inputSize}`,
    isInvalid && 'is-invalid'
  ].filter(Boolean).join(' ')

  // Classes Bootstrap pour le bouton
  const buttonClasses = [
    'btn',
    `btn-outline-${variant}`,
    inputSize && `btn-${inputSize}`,
    'border-start-0'
  ].filter(Boolean).join(' ')

  const menuContent = (
    <ul 
      {...getMenuProps()} 
      ref={refs.setFloating}
      style={{
        ...floatingStyles,
        minWidth: '200px'
      }}
      className={`bootstrap-floating-menu list-group shadow-lg ${isOpen ? 'show' : ''}`}
    >
      {isOpen && filteredItems.length === 0 && inputValue && (
        <li className="list-group-item text-muted fst-italic">
          <i className="bi bi-search me-2"></i>
          Aucun résultat pour "{inputValue}"
        </li>
      )}
      {isOpen && multiSelect && maxSelections && selectedItems.length >= maxSelections && (
        <li className="list-group-item text-warning fst-italic">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Limite de sélection atteinte ({maxSelections} maximum)
        </li>
      )}
      {isOpen && filteredItems.map((item, index) => {
        const isSelected = multiSelect 
          ? selectedItems.some(selected => selected.id === item.id)
          : selectedItem?.id === item.id
        
        return (
          <li
            key={item.id}
            {...getItemProps({
              item,
              index,
              className: `list-group-item list-group-item-action d-flex justify-content-between align-items-start ${
                highlightedIndex === index ? `active` : ''
              } ${isSelected ? 'list-group-item-success' : ''}`,
            })}
            style={{ cursor: 'pointer' }}
          >
            <div className="ms-2 me-auto">
              <div className="fw-bold">
                {multiSelect && (
                  <i className={`bi ${isSelected ? 'bi-check-square-fill' : 'bi-square'} me-2`}></i>
                )}
                {item.label}
              </div>
              {item.description && (
                <small className={highlightedIndex === index ? 'text-white-50' : 'text-muted'}>
                  {item.description}
                </small>
              )}
            </div>
            {isSelected && (
              <span className="badge bg-success rounded-pill">
                <i className="bi bi-check-lg"></i>
              </span>
            )}
          </li>
        )
      })}
    </ul>
  )

  return (
    <div className="bootstrap-selectable-container">
      {label && (
        <label className="form-label fw-bold">
          {label}
          {isInvalid && <span className="text-danger ms-1">*</span>}
        </label>
      )}
      
      <div className="input-group" ref={appendTo ? undefined : refs.setReference}>
        <input
          {...getInputProps({
            placeholder: effectivePlaceholder,
            className: inputClasses,
          })}
        />
        <button
          type="button"
          {...getToggleButtonProps()}
          className={buttonClasses}
          aria-label="toggle menu"
        >
          {isOpen ? (
            <i className="bi bi-chevron-up"></i>
          ) : (
            <i className="bi bi-chevron-down"></i>
          )}
        </button>
        {multiSelect && selectedItems.length > 0 && (
          <button
            type="button"
            onClick={clearAllSelections}
            className="btn btn-outline-secondary"
            aria-label="clear all selections"
            title="Effacer toutes les sélections"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        )}
      </div>
      
      {/* Affichage des éléments sélectionnés en mode multiselect */}
      {multiSelect && selectedItems.length > 0 && (
        <div className="mt-2">
          <div className="d-flex flex-wrap gap-1">
            {selectedItems.map((item) => (
              <span key={item.id} className={`badge bg-${variant} d-flex align-items-center gap-1`}>
                {item.label}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeSelectedItem(item)
                  }}
                  className="btn-close btn-close-white btn-sm"
                  aria-label={`Supprimer ${item.label}`}
                  style={{ fontSize: '0.6em' }}
                ></button>
              </span>
            ))}
          </div>
          {maxSelections && (
            <small className="text-muted mt-1 d-block">
              {selectedItems.length}/{maxSelections} sélection(s)
            </small>
          )}
        </div>
      )}
      
      {/* Messages d'aide et d'erreur */}
      {(helpText || errorMessage) && (
        <div className="form-text">
          {isInvalid && errorMessage ? (
            <span className="text-danger">
              <i className="bi bi-exclamation-triangle me-1"></i>
              {errorMessage}
            </span>
          ) : helpText ? (
            <span className="text-muted">
              <i className="bi bi-info-circle me-1"></i>
              {helpText}
            </span>
          ) : null}
        </div>
      )}
      
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
  )
}
