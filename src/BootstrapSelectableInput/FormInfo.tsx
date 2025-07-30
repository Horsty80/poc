import { useSelectableInputContext } from './context'

interface FormInfoProps {
  helpText?: string
  isInvalid: boolean
  errorMessage?: string
}

export const FormInfo = ({ helpText, isInvalid, errorMessage }: FormInfoProps) => {
  const { itemSelection, selectedItems, maxSelections } = useSelectableInputContext()

  return (
    <>
      {/* Indicateur de limite de sélection */}
      {itemSelection === 'multiple' && maxSelections && selectedItems.length > 0 && (
        <div className="mt-1">
          <small className="text-muted">
            {selectedItems.length}/{maxSelections} sélection(s)
          </small>
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
    </>
  )
}
