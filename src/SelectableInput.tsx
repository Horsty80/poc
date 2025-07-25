import { useState } from 'react'
import { useCombobox } from 'downshift'
import './SelectableInput.css'

interface Item {
  id: string
  label: string
}

interface SelectableInputProps {
  items: Item[]
  placeholder?: string
  onSelectionChange?: (item: Item | null) => void
  openDirection?: 'up' | 'down' // Prop pour contrôler la direction d'ouverture
}

export function SelectableInput({ 
  items, 
  placeholder = "Sélectionnez un élément...", 
  onSelectionChange,
  openDirection = 'down'
}: SelectableInputProps) {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [inputValue, setInputValue] = useState('')

  // Filtrer les éléments selon la saisie
  const filteredItems = items.filter(item =>
    item.label.toLowerCase().includes(inputValue.toLowerCase())
  )

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

  return (
    <div className="selectable-input-container">
      <div className="input-wrapper">
        <input
          {...getInputProps({
            placeholder,
            className: "selectable-input",
          })}
        />
        <button
          type="button"
          {...getToggleButtonProps()}
          className="toggle-button"
          aria-label="toggle menu"
        >
          ⌄
        </button>
      </div>
      
      <ul {...getMenuProps()} className={`selectable-input-menu ${isOpen ? 'open' : ''} ${openDirection === 'up' ? 'open-upward' : ''}`}>
        {isOpen && filteredItems.map((item, index) => (
          <li
            key={item.id}
            {...getItemProps({
              item,
              index,
              className: `selectable-input-item ${
                highlightedIndex === index ? 'highlighted' : ''
              } ${selectedItem?.id === item.id ? 'selected' : ''}`,
            })}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  )
}
