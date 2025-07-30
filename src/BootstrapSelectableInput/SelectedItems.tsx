import { useSelectableInputContext } from './context'

interface SelectedItemsProps {
  variant: string
}

export const SelectedItems = ({ variant }: SelectedItemsProps) => {
  const {
    itemSelection,
    selectedItems,
    internalSummaryMode,
    removeSelectedItem
  } = useSelectableInputContext()

  if (itemSelection !== 'multiple' || selectedItems.length === 0) {
    return null
  }

  return (
    <>
      {internalSummaryMode ? (
        <span className={`badge bg-${variant} me-1`}>
          {selectedItems.length} élément{selectedItems.length > 1 ? 's' : ''} sélectionné{selectedItems.length > 1 ? 's' : ''}
        </span>
      ) : (
        selectedItems.map((item) => (
          <span key={item.id} className={`badge bg-${variant} d-flex align-items-center gap-1 me-1`} style={{ fontSize: '0.75em' }}>
            {item.label}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                removeSelectedItem(item)
              }}
              className="btn-close btn-close-white"
              aria-label={`Supprimer ${item.label}`}
              style={{ fontSize: '0.5em' }}
            ></button>
          </span>
        ))
      )}
    </>
  )
}
