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

      {/* Nouvelle section pour démontrer appendTo */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="card border-info">
            <div className="card-header bg-info text-white">
              <h2 className="card-title mb-0">
                <i className="bi bi-pin-map me-2"></i>
                Démonstration de appendTo
              </h2>
            </div>
            <div className="card-body">
              <p className="mb-4">
                La props <code>appendTo</code> permet de spécifier un élément de référence personnalisé 
                pour le positionnement du menu. Le menu se positionnera par rapport à cet élément 
                plutôt que par rapport à l'input.
              </p>
              
              <div className="row">
                <div className="col-md-8">
                  <div className="alert alert-light border">
                    <h5 className="alert-heading">Zone de référence personnalisée</h5>
                    <p>
                      Ce div avec l'id <code>#custom-reference</code> sert d'élément de référence 
                      pour le menu du composant ci-dessous.
                    </p>
                    <div 
                      id="custom-reference" 
                      className="bg-primary text-white p-3 rounded text-center mb-3"
                      style={{ cursor: 'pointer' }}
                    >
                      📍 Élément de référence personnalisé
                      <br />
                      <small>Le menu se positionnera par rapport à cette zone</small>
                    </div>
                    
                    <BootstrapSelectableInput
                      items={mockItemsWithDescriptions}
                      placeholder="Menu positionné sur l'élément ci-dessus"
                      label="Composant avec appendTo"
                      helpText="Le menu se positionnera par rapport à l'élément bleu ci-dessus"
                      variant="info"
                      appendTo="#custom-reference"
                      placement="bottom"
                      onSelectionChange={(item) => {
                        console.log('Sélection avec appendTo:', item)
                      }}
                    />
                  </div>
                </div>
                
                <div className="col-md-4">
                  <div className="card bg-light">
                    <div className="card-body">
                      <h6 className="card-title">
                        <i className="bi bi-code-slash me-2"></i>
                        Code utilisé
                      </h6>
                      <pre className="small mb-0">
{`<BootstrapSelectableInput
  items={items}
  appendTo="#custom-reference"
  placement="bottom"
  // ... autres props
/>`}
                      </pre>
                    </div>
                  </div>
                  
                  <div className="card bg-light mt-3">
                    <div className="card-body">
                      <h6 className="card-title">
                        <i className="bi bi-info-circle me-2"></i>
                        Types de sélecteurs
                      </h6>
                      <ul className="small mb-0">
                        <li><code>#myId</code> - Par ID</li>
                        <li><code>.myClass</code> - Par classe</li>
                        <li><code>[data-ref]</code> - Par attribut</li>
                        <li><code>div.container</code> - Complexe</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <hr className="my-4" />
              
              <div className="row">
                <div className="col-md-6">
                  <h5>Exemple avec sélecteur de classe</h5>
                  <div className="position-relative">
                    <div className="custom-ref-class bg-success text-white p-2 rounded mb-2 text-center">
                      🎯 Référence par classe CSS
                    </div>
                    <BootstrapSelectableInput
                      items={mockItemsWithDescriptions}
                      placeholder="Menu positionné sur l'élément vert"
                      label="Avec sélecteur de classe"
                      variant="success"
                      appendTo=".custom-ref-class"
                      placement="top"
                    />
                  </div>
                </div>
                
                <div className="col-md-6">
                  <h5>Comparaison sans appendTo</h5>
                  <div className="bg-warning text-dark p-2 rounded mb-2 text-center">
                    ⚡ Élément décoratif (ignoré)
                  </div>
                  <BootstrapSelectableInput
                    items={mockItemsWithDescriptions}
                    placeholder="Menu positionné normalement"
                    label="Sans appendTo"
                    variant="warning"
                    placement="top"
                  />
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
