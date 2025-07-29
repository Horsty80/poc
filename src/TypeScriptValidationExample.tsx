// Fichier d'exemple pour démontrer la validation TypeScript
import { BootstrapSelectableInput } from './BootstrapSelectableInput'

const mockItems = [
  { id: '1', label: 'Item 1' },
  { id: '2', label: 'Item 2' },
  { id: '3', label: 'Item 3' },
]

export function TypeScriptValidationExample() {
  // ✅ Utilisation correcte - mode single sans canSelectAll
  const validSingleMode = (
    <BootstrapSelectableInput
      items={mockItems}
      itemSelection="single"
      onSelectionChange={(item) => console.log(item)}
    />
  )

  // ✅ Utilisation correcte - mode multiple avec canSelectAll
  const validMultipleMode = (
    <BootstrapSelectableInput
      items={mockItems}
      itemSelection="multiple"
      canSelectAll={true}
      onMultiSelectionChange={(items) => console.log(items)}
    />
  )

  // ❌ ERREUR TypeScript - ne peut pas utiliser canSelectAll avec mode single
  const invalidSingleWithSelectAll = (
    <BootstrapSelectableInput
      items={mockItems}
      itemSelection="single"
      canSelectAll={true} // ❌ TypeScript Error: Property 'canSelectAll' does not exist on type 'SingleSelectionProps'
      onSelectionChange={(item) => console.log(item)}
    />
  )

  // ❌ ERREUR TypeScript - ne peut pas utiliser onSelectionChange avec mode multiple
  const invalidMultipleWithSingleCallback = (
    <BootstrapSelectableInput
      items={mockItems}
      itemSelection="multiple"
      onSelectionChange={(item) => console.log(item)} // ❌ TypeScript Error: Property 'onSelectionChange' does not exist on type 'MultipleSelectionProps'
    />
  )

  // ❌ ERREUR TypeScript - ne peut pas utiliser maxSelections avec mode single
  const invalidSingleWithMaxSelections = (
    <BootstrapSelectableInput
      items={mockItems}
      itemSelection="single"
      maxSelections={3} // ❌ TypeScript Error: Property 'maxSelections' does not exist on type 'SingleSelectionProps'
      onSelectionChange={(item) => console.log(item)}
    />
  )

  return (
    <div>
      <h3>Exemples de validation TypeScript</h3>
      <p>Ce fichier démontre comment TypeScript empêche les combinaisons invalides de props.</p>
      
      <div>
        <h4>✅ Utilisation valide - Mode single</h4>
        {validSingleMode}
      </div>
      
      <div>
        <h4>✅ Utilisation valide - Mode multiple avec Select All</h4>
        {validMultipleMode}
      </div>
      
      {/* Les exemples commentés ci-dessous causeraient des erreurs TypeScript */}
      {/* {invalidSingleWithSelectAll} */}
      {/* {invalidMultipleWithSingleCallback} */}
      {/* {invalidSingleWithMaxSelections} */}
    </div>
  )
}
