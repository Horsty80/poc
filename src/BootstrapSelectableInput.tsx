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
}

export function BootstrapSelectableInput({ 
  items, 
  placeholder = "Sélectionnez un élément...", 
  onSelectionChange,
  placement = 'auto',
  enableFlip = true,
  portal = true,
  size: inputSize,
  variant = 'primary',
  label,
  helpText,
  isInvalid = false,
  errorMessage,
  appendTo
}: BootstrapSelectableInputProps) {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [inputValue, setInputValue] = useState('')

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
    selectedItem,
    inputValue,
    onInputValueChange: ({ inputValue: newInputValue }) => {
      setInputValue(newInputValue || '')
    },
    onSelectedItemChange: ({ selectedItem: newSelectedItem }) => {
      setSelectedItem(newSelectedItem || null)
      onSelectionChange?.(newSelectedItem || null)
    },
    itemToString: (item) => item?.label || '',
  })

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
      {isOpen && filteredItems.map((item, index) => (
        <li
          key={item.id}
          {...getItemProps({
            item,
            index,
            className: `list-group-item list-group-item-action d-flex justify-content-between align-items-start ${
              highlightedIndex === index ? `active` : ''
            } ${selectedItem?.id === item.id ? 'list-group-item-success' : ''}`,
          })}
          style={{ cursor: 'pointer' }}
        >
          <div className="ms-2 me-auto">
            <div className="fw-bold">{item.label}</div>
            {item.description && (
              <small className={highlightedIndex === index ? 'text-white-50' : 'text-muted'}>
                {item.description}
              </small>
            )}
          </div>
          {selectedItem?.id === item.id && (
            <span className="badge bg-success rounded-pill">
              <i className="bi bi-check-lg"></i>
            </span>
          )}
        </li>
      ))}
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
            placeholder,
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
      </div>
      
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
