import { useState } from 'react'
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
import './FloatingSelectableInput.css'

interface Item {
  id: string
  label: string
}

interface FloatingSelectableInputProps {
  items: Item[]
  placeholder?: string
  onSelectionChange?: (item: Item | null) => void
  placement?: 'top' | 'bottom' | 'auto' // Placement préféré
  enableFlip?: boolean // Permettre le retournement automatique
  portal?: boolean // Utiliser un portal pour le rendu
}

export function FloatingSelectableInput({ 
  items, 
  placeholder = "Sélectionnez un élément...", 
  onSelectionChange,
  placement = 'auto',
  enableFlip = true,
  portal = true
}: FloatingSelectableInputProps) {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [inputValue, setInputValue] = useState('')

  // Filtrer les éléments selon la saisie
  const filteredItems = items.filter(item =>
    item.label.toLowerCase().includes(inputValue.toLowerCase())
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
            maxHeight: `${Math.min(200, availableHeight)}px`,
          })
        },
        padding: 8,
      }),
      placement === 'auto' && autoPlacement({
        allowedPlacements: ['top-start', 'bottom-start'],
      }),
    ].filter(Boolean),
  })

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

  const menuContent = (
    <ul 
      {...getMenuProps()} 
      ref={refs.setFloating}
      style={floatingStyles}
      className={`floating-selectable-menu ${isOpen ? 'open' : ''} ${finalPlacement?.startsWith('top') ? 'placement-top' : 'placement-bottom'}`}
    >
      {isOpen && filteredItems.map((item, index) => (
        <li
          key={item.id}
          {...getItemProps({
            item,
            index,
            className: `floating-selectable-item ${
              highlightedIndex === index ? 'highlighted' : ''
            } ${selectedItem?.id === item.id ? 'selected' : ''}`,
          })}
        >
          {item.label}
        </li>
      ))}
    </ul>
  )

  return (
    <div className="floating-selectable-container">
      <div className="floating-input-wrapper" ref={refs.setReference}>
        <input
          {...getInputProps({
            placeholder,
            className: "floating-selectable-input",
          })}
        />
        <button
          type="button"
          {...getToggleButtonProps()}
          className="floating-toggle-button"
          aria-label="toggle menu"
        >
          {finalPlacement?.startsWith('top') ? '⌃' : '⌄'}
        </button>
      </div>
      
      {portal ? (
        <FloatingPortal>
          {menuContent}
        </FloatingPortal>
      ) : (
        menuContent
      )}
      
      {/* Indicateur de placement pour debug */}
      {isOpen && (
        <div className="placement-indicator">
          Placement: {finalPlacement || 'auto'}
        </div>
      )}
    </div>
  )
}
