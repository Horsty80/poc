import { useSelectableInputContext } from './context'

interface DropdownMenuProps {
  isOpen: boolean
  isLoading: boolean
  loadingText: string
  noResultsText: string
  getMenuProps: any
  getItemProps: any
  highlightedIndex: number
  floatingStyles: any
  refs: any
  canSelectAll: boolean
}

export const DropdownMenu = ({
  isOpen,
  isLoading,
  loadingText,
  noResultsText,
  getMenuProps,
  getItemProps,
  highlightedIndex,
  floatingStyles,
  refs,
  canSelectAll
}: DropdownMenuProps) => {
  const {
    filteredItems,
    inputValue,
    itemSelection,
    selectedItems,
    selectedItem,
    maxSelections,
    // canSelectAll, // Temporairement commenté
    canCreateNewTag,
    createNewTag,
    selectAllItems,
    areAllFilteredItemsSelected,
    setSelectedItems,
    onMultiSelectionChange
  } = useSelectableInputContext()

  if (!isOpen) {
    return null
  }

  return (
    <ul 
      {...getMenuProps()} 
      ref={refs.setFloating}
      style={{
        ...floatingStyles,
        minWidth: '200px'
      }}
      className={`bootstrap-floating-menu list-group shadow-lg ${isOpen ? 'show' : ''}`}
    >
      {/* Indicateur de chargement */}
      {isLoading && (
        <li className="list-group-item text-center py-3">
          <div className="d-flex align-items-center justify-content-center">
            <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
            <span className="text-muted">{loadingText}</span>
          </div>
        </li>
      )}
      
      {/* Aucun résultat */}
      {!isLoading && filteredItems.length === 0 && inputValue && (
        <li className="list-group-item text-muted fst-italic">
          <i className="bi bi-search me-2"></i>
          {noResultsText}
        </li>
      )}
      
      {/* Message limite de sélection */}
      {itemSelection === 'multiple' && maxSelections && selectedItems.length >= maxSelections && (
        <li className="list-group-item text-warning fst-italic">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Limite de sélection atteinte ({maxSelections} maximum)
        </li>
      )}
      
      {/* Bouton Select All/Deselect All pour le mode multiple */}
      {itemSelection === 'multiple' && canSelectAll && filteredItems.length > 0 && !isLoading && (
        <SelectAllButton 
          areAllSelected={areAllFilteredItemsSelected()}
          onSelectAll={selectAllItems}
          onDeselectAll={() => {
            const itemsToRemove = filteredItems.map(item => item.id)
            const newSelectedItems = selectedItems.filter(item => !itemsToRemove.includes(item.id))
            setSelectedItems(newSelectedItems)
            onMultiSelectionChange?.(newSelectedItems)
          }}
          filteredCount={filteredItems.length}
          hasFilter={!!inputValue}
        />
      )}

      {/* Option pour créer un nouveau tag */}
      {canCreateNewTag && !isLoading && (
        <CreateTagButton 
          inputValue={inputValue}
          onCreateTag={createNewTag}
        />
      )}
      
      {/* Liste des éléments */}
      {filteredItems.map((item, index) => {
        const isSelected = itemSelection === 'multiple' 
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
                {itemSelection === 'multiple' && (
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
}

interface SelectAllButtonProps {
  areAllSelected: boolean
  onSelectAll: () => void
  onDeselectAll: () => void
  filteredCount: number
  hasFilter: boolean
}

const SelectAllButton = ({ 
  areAllSelected, 
  onSelectAll, 
  onDeselectAll, 
  filteredCount, 
  hasFilter 
}: SelectAllButtonProps) => {
  return (
    <li className="list-group-item list-group-item-action border-bottom border-secondary">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          if (areAllSelected) {
            onDeselectAll()
          } else {
            onSelectAll()
          }
        }}
        className="btn btn-sm btn-outline-primary w-100 d-flex align-items-center justify-content-center"
      >
        <i className={`bi ${areAllSelected ? 'bi-check-square-fill' : 'bi-square'} me-2`}></i>
        {areAllSelected ? 'Désélectionner tout' : 'Sélectionner tout'}
        {hasFilter && ` (${filteredCount})`}
      </button>
    </li>
  )
}

interface CreateTagButtonProps {
  inputValue: string
  onCreateTag: (value: string) => Promise<void>
}

const CreateTagButton = ({ inputValue, onCreateTag }: CreateTagButtonProps) => {
  return (
    <li className="list-group-item list-group-item-action border-bottom border-secondary">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onCreateTag(inputValue)
        }}
        className="btn btn-sm btn-outline-success w-100 d-flex align-items-center justify-content-center"
      >
        <i className="bi bi-plus-circle me-2"></i>
        Créer "{inputValue.trim()}"
      </button>
    </li>
  )
}
