import { useState, useCallback, useRef, useEffect } from 'react'
import { BootstrapSelectableInput, type Item } from './BootstrapSelectableInput'

// Simulation d'une API
const simulateApiCall = async (searchTerm: string): Promise<Item[]> => {
  // Simuler un délai d'API
  await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500))
  
  // Données simulées
  const allItems: Item[] = [
    { id: '1', label: 'JavaScript', description: 'Langage de programmation dynamique' },
    { id: '2', label: 'TypeScript', description: 'Superset typé de JavaScript' },
    { id: '3', label: 'React', description: 'Bibliothèque pour construire des interfaces utilisateur' },
    { id: '4', label: 'Vue.js', description: 'Framework JavaScript progressif' },
    { id: '5', label: 'Angular', description: 'Plateforme de développement web' },
    { id: '6', label: 'Node.js', description: 'Runtime JavaScript côté serveur' },
    { id: '7', label: 'Python', description: 'Langage de programmation polyvalent' },
    { id: '8', label: 'Java', description: 'Langage de programmation orienté objet' },
    { id: '9', label: 'C#', description: 'Langage de programmation Microsoft' },
    { id: '10', label: 'PHP', description: 'Langage de script côté serveur' },
    { id: '11', label: 'Go', description: 'Langage compilé par Google' },
    { id: '12', label: 'Rust', description: 'Langage système sûr et rapide' },
    { id: '13', label: 'Swift', description: 'Langage pour iOS et macOS' },
    { id: '14', label: 'Kotlin', description: 'Langage pour Android et JVM' },
    { id: '15', label: 'Ruby', description: 'Langage de programmation expressif' },
  ]
  
  // Filtrer selon le terme de recherche
  return allItems.filter(item =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )
}

export function AsyncBootstrapExample() {
  // États pour le mode single
  const [singleItems, setSingleItems] = useState<Item[]>([])
  const [singleIsLoading, setSingleIsLoading] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  
  // États pour le mode multiple
  const [multipleItems, setMultipleItems] = useState<Item[]>([])
  const [multipleIsLoading, setMultipleIsLoading] = useState(false)
  const [selectedItems, setSelectedItems] = useState<Item[]>([])
  
  // Refs pour gérer le debounce
  const singleDebounceRef = useRef<number | undefined>(undefined)
  const multipleDebounceRef = useRef<number | undefined>(undefined)
  
  // Fonction pour charger les items en mode single avec debounce
  const handleSingleInputChange = useCallback((searchTerm: string) => {
    // Annuler le précédent timeout
    if (singleDebounceRef.current) {
      clearTimeout(singleDebounceRef.current)
    }
    
    // Si le terme de recherche est vide, vider les résultats
    if (!searchTerm.trim()) {
      setSingleItems([])
      return
    }
    
    // Debounce de 300ms
    singleDebounceRef.current = setTimeout(async () => {
      setSingleIsLoading(true)
      try {
        const results = await simulateApiCall(searchTerm)
        setSingleItems(results)
      } catch (error) {
        console.error('Erreur lors de la recherche:', error)
        setSingleItems([])
      } finally {
        setSingleIsLoading(false)
      }
    }, 300)
  }, [])
  
  // Fonction pour charger les items en mode multiple avec debounce
  const handleMultipleInputChange = useCallback((searchTerm: string) => {
    // Annuler le précédent timeout
    if (multipleDebounceRef.current) {
      clearTimeout(multipleDebounceRef.current)
    }
    
    // Si le terme de recherche est vide, vider les résultats
    if (!searchTerm.trim()) {
      setMultipleItems([])
      return
    }
    
    // Debounce de 300ms
    multipleDebounceRef.current = setTimeout(async () => {
      setMultipleIsLoading(true)
      try {
        const results = await simulateApiCall(searchTerm)
        setMultipleItems(results)
      } catch (error) {
        console.error('Erreur lors de la recherche:', error)
        setMultipleItems([])
      } finally {
        setMultipleIsLoading(false)
      }
    }, 300)
  }, [])
  
  // Nettoyer les timeouts au démontage
  useEffect(() => {
    return () => {
      if (singleDebounceRef.current) {
        clearTimeout(singleDebounceRef.current)
      }
      if (multipleDebounceRef.current) {
        clearTimeout(multipleDebounceRef.current)
      }
    }
  }, [])

  return (
    <div className="container mt-5">
      <div className="row mb-4">
        <div className="col">
          <h2 className="mb-3">
            <i className="bi bi-cloud-arrow-down me-2 text-primary"></i>
            Exemple d'utilisation asynchrone
          </h2>
          <div className="alert alert-info">
            <i className="bi bi-info-circle me-2"></i>
            <strong>Mode asynchrone :</strong> Les données sont chargées dynamiquement via une API simulée. 
            Tapez au moins un caractère pour déclencher la recherche avec un debounce de 300ms.
          </div>
        </div>
      </div>
      
      <div className="row">
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-header bg-primary text-white">
              <h5 className="card-title mb-0">
                <i className="bi bi-search me-2"></i>
                Mode Single - Recherche asynchrone
              </h5>
            </div>
            <div className="card-body">
              <BootstrapSelectableInput
                items={singleItems}
                isLoading={singleIsLoading}
                onInputChange={handleSingleInputChange}
                onSelectionChange={setSelectedItem}
                placeholder="Tapez pour rechercher un langage..."
                label="Langage de programmation"
                helpText="Commencez à taper pour voir les résultats"
                loadingText="Recherche en cours..."
                noResultsText="Aucun langage trouvé"
                variant="primary"
              />
              
              {selectedItem && (
                <div className="mt-3">
                  <h6 className="text-primary">
                    <i className="bi bi-check-circle me-2"></i>
                    Sélection actuelle :
                  </h6>
                  <div className="alert alert-primary">
                    <div className="d-flex align-items-start">
                      <i className="bi bi-code-slash me-3 mt-1 text-primary"></i>
                      <div>
                        <strong>{selectedItem.label}</strong>
                        {selectedItem.description && (
                          <div className="text-muted">
                            <small>{selectedItem.description}</small>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-header bg-success text-white">
              <h5 className="card-title mb-0">
                <i className="bi bi-list-check me-2"></i>
                Mode Multiple - Recherche asynchrone
              </h5>
            </div>
            <div className="card-body">
              <BootstrapSelectableInput
                items={multipleItems}
                isLoading={multipleIsLoading}
                onInputChange={handleMultipleInputChange}
                itemSelection="multiple"
                onMultiSelectionChange={setSelectedItems}
                placeholder="Tapez pour rechercher des langages..."
                label="Stack technologique"
                helpText="Sélectionnez plusieurs langages pour votre stack"
                loadingText="Recherche en cours..."
                noResultsText="Aucun langage trouvé"
                variant="success"
                maxSelections={5}
                canSelectAll
                summaryMode
              />
              
              {selectedItems.length > 0 && (
                <div className="mt-3">
                  <h6 className="text-success">
                    <i className="bi bi-collection me-2"></i>
                    Stack sélectionnée ({selectedItems.length}) :
                  </h6>
                  <div className="alert alert-success">
                    {selectedItems.map(item => (
                      <div key={item.id} className="d-flex align-items-start mb-2">
                        <i className="bi bi-arrow-right me-3 mt-1 text-success"></i>
                        <div>
                          <strong>{item.label}</strong>
                          {item.description && (
                            <div className="text-muted">
                              <small>{item.description}</small>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="row mt-5">
        <div className="col">
          <div className="card">
            <div className="card-header bg-light">
              <h5 className="card-title mb-0">
                <i className="bi bi-code-square me-2 text-dark"></i>
                Comment implémenter le mode asynchrone
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h6 className="text-primary">
                    <i className="bi bi-gear me-2"></i>
                    Props nécessaires
                  </h6>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <code className="text-primary">isLoading</code> : boolean pour l'état de chargement
                    </li>
                    <li className="list-group-item">
                      <code className="text-primary">onInputChange</code> : callback pour les changements d'input
                    </li>
                    <li className="list-group-item">
                      <code className="text-primary">items</code> : tableau des résultats de recherche
                    </li>
                  </ul>
                </div>
                
                <div className="col-md-6">
                  <h6 className="text-success">
                    <i className="bi bi-plus-circle me-2"></i>
                    Props optionnelles
                  </h6>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <code className="text-success">loadingText</code> : texte pendant le chargement
                    </li>
                    <li className="list-group-item">
                      <code className="text-success">noResultsText</code> : texte si aucun résultat
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-4">
                <h6 className="text-warning">
                  <i className="bi bi-lightbulb me-2"></i>
                  Gestion côté parent
                </h6>
                <div className="bg-light p-3 rounded">
                  <ol className="mb-0">
                    <li>Implémenter le <strong>debounce</strong> dans <code>onInputChange</code></li>
                    <li>Gérer l'état <strong>isLoading</strong> pendant les appels API</li>
                    <li>Mettre à jour le tableau <strong>items</strong> avec les résultats</li>
                    <li>Gérer les <strong>erreurs</strong> et les cas limites</li>
                  </ol>
                </div>
              </div>
              
              <div className="mt-3">
                <div className="alert alert-warning">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  <strong>Avantages :</strong> Cette approche donne un contrôle total sur la logique asynchrone 
                  (cache, retry, annulation de requêtes, etc.) tout en gardant le composant simple et réutilisable.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
