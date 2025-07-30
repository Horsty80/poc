import { useSelectableInputContext } from './context'

interface SearchInputProps {
  placeholder: string
  getInputProps: any
  onKeyDown?: (event: React.KeyboardEvent) => void
}

export const SearchInput = ({ placeholder, getInputProps, onKeyDown }: SearchInputProps) => {
  const {
    selectedItems,
    itemSelection,
    canCreateNewTag,
    inputValue,
    createNewTag
  } = useSelectableInputContext()

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // Gérer la touche Entrée pour créer un nouveau tag
    if (event.key === 'Enter' && canCreateNewTag) {
      event.preventDefault()
      createNewTag(inputValue)
    }
    onKeyDown?.(event)
  }

  const effectivePlaceholder = (itemSelection === 'multiple' && selectedItems.length > 0) ? '' : placeholder

  return (
    <input
      {...getInputProps({
        placeholder: effectivePlaceholder,
        className: 'border-0 outline-0 flex-grow-1',
        style: { 
          minWidth: '120px',
          background: 'transparent',
          boxShadow: 'none'
        },
        onKeyDown: handleKeyDown
      })}
    />
  )
}
