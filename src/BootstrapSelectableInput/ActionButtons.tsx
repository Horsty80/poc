import { useSelectableInputContext } from './context'

interface ActionButtonsProps {
  isLoading: boolean
  isOpen: boolean
  getToggleButtonProps: any
  buttonClasses: string
}

export const ActionButtons = ({ 
  isLoading, 
  isOpen, 
  getToggleButtonProps, 
  buttonClasses 
}: ActionButtonsProps) => {
  const {
    itemSelection,
    selectedItems,
    internalSummaryMode,
    setInternalSummaryMode,
    clearAllSelections
  } = useSelectableInputContext()

  return (
    <>
      {/* Bouton toggle principal */}
      <button
        type="button"
        {...getToggleButtonProps()}
        className={buttonClasses}
        aria-label="toggle menu"
      >
        {isLoading ? (
          <div className="spinner-border spinner-border-sm" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        ) : isOpen ? (
          <i className="bi bi-chevron-up"></i>
        ) : (
          <i className="bi bi-chevron-down"></i>
        )}
      </button>
      
      {/* Boutons pour le mode multiple */}
      {itemSelection === 'multiple' && selectedItems.length > 0 && (
        <>
          {/* Bouton pour basculer le mode summary */}
          <button
            type="button"
            onClick={() => setInternalSummaryMode(!internalSummaryMode)}
            className="btn btn-outline-info"
            aria-label="toggle summary mode"
            title={internalSummaryMode ? "Afficher les détails" : "Afficher le résumé"}
          >
            <i className={`bi ${internalSummaryMode ? 'bi-list-ul' : 'bi-card-text'}`}></i>
          </button>
          
          {/* Bouton pour effacer toutes les sélections */}
          <button
            type="button"
            onClick={clearAllSelections}
            className="btn btn-outline-secondary"
            aria-label="clear all selections"
            title="Effacer toutes les sélections"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </>
      )}
    </>
  )
}
