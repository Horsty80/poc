import { useState } from 'react'
import { BootstrapSelectableInput } from './BootstrapSelectableInput'
import './App.css'

const mockItemsWithDescriptions = [
  { id: '1', label: 'React', description: 'Une bibliothèque JavaScript pour créer des interfaces utilisateur' },
  { id: '2', label: 'Vue.js', description: 'Le framework JavaScript progressif' },
  { id: '3', label: 'Angular', description: 'Plateforme pour construire des applications web mobiles et desktop' },
  { id: '4', label: 'Svelte', description: 'Un compilateur pour créer des interfaces utilisateur rapides' },
  { id: '5', label: 'Solid.js', description: 'Une bibliothèque JavaScript déclarative et efficace' },
]

function App() {
  const [selectedBootstrapFramework, setSelectedBootstrapFramework] = useState<any>(null)

  return (
    <div className="container-fluid" style={{ padding: '40px' }}>
      <div className="row">
        <div className="col-12">
          <h1 className="display-4 mb-4">Composant Bootstrap + Floating UI + Downshift</h1>
          <p className="lead mb-5">
            Démonstration du composant avec Bootstrap, Floating UI et Downshift.
          </p>
        </div>
      </div>

      <div className="row mb-5">
        <div className="col-12">
          <div className="card border-primary">
            <div className="card-header bg-primary text-white">
              <h2 className="card-title mb-0">
                <i className="bi bi-bootstrap me-2"></i>
                Composant avec Bootstrap + Floating UI
              </h2>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <BootstrapSelectableInput
                    items={mockItemsWithDescriptions}
                    placement='top'
                    placeholder="Rechercher un framework..."
                    label="Framework de développement"
                    helpText="Sélectionnez votre framework JavaScript préféré"
                    variant="primary"
                    onSelectionChange={(item) => {
                      setSelectedBootstrapFramework(item)
                      console.log('Framework sélectionné (Bootstrap):', item)
                    }}
                  />
                </div>
                <div className="col-md-6">
                  {selectedBootstrapFramework && (
                    <div className="alert alert-success" role="alert">
                      <h4 className="alert-heading">
                        <i className="bi bi-check-circle-fill me-2"></i>
                        Framework sélectionné
                      </h4>
                      <p><strong>{selectedBootstrapFramework.label}</strong></p>
                      {selectedBootstrapFramework.description && (
                        <p className="mb-0">{selectedBootstrapFramework.description}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <hr className="my-4" />
              
              <div className="row">
                <div className="col-md-6">
                  <h5>Tailles et variantes</h5>
                  <div className="mb-3">
                    <BootstrapSelectableInput
                      items={mockItemsWithDescriptions}
                      placeholder="Taille large"
                      label="Large"
                      size="lg"
                      variant="success"
                    />
                  </div>
                  <div className="mb-3">
                    <BootstrapSelectableInput
                      items={mockItemsWithDescriptions}
                      placeholder="Taille normale"
                      label="Normal"
                      variant="info"
                    />
                  </div>
                  <div className="mb-3">
                    <BootstrapSelectableInput
                      items={mockItemsWithDescriptions}
                      placeholder="Taille petite"
                      label="Small"
                      size="sm"
                      variant="warning"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <h5>États de validation</h5>
                  <div className="mb-3">
                    <BootstrapSelectableInput
                      items={mockItemsWithDescriptions}
                      placeholder="État normal"
                      label="Normal"
                      helpText="Sélectionnez votre framework préféré"
                    />
                  </div>
                  <div className="mb-3">
                    <BootstrapSelectableInput
                      items={mockItemsWithDescriptions}
                      placeholder="État invalide"
                      label="Invalide"
                      isInvalid={true}
                      errorMessage="Veuillez sélectionner un framework"
                    />
                  </div>
                  <div className="mb-3">
                    <BootstrapSelectableInput
                      items={mockItemsWithDescriptions}
                      placeholder="Avec variant danger"
                      label="Variant danger"
                      variant="danger"
                      isInvalid={true}
                      errorMessage="Erreur critique"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
