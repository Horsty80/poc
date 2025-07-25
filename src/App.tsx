import { useState } from 'react'
import { SelectableInput } from './SelectableInput'
import './App.css'

// Données d'exemple pour tester le composant
const mockItems = [
  { id: '1', label: 'React' },
  { id: '2', label: 'Vue.js' },
  { id: '3', label: 'Angular' },
  { id: '4', label: 'Svelte' },
  { id: '5', label: 'Solid.js' },
  { id: '6', label: 'Next.js' },
  { id: '7', label: 'Nuxt.js' },
  { id: '8', label: 'Gatsby' },
  { id: '9', label: 'Remix' },
  { id: '10', label: 'Astro' },
]

function App() {
  const [selectedFramework, setSelectedFramework] = useState<any>(null)

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Test du composant SelectableInput</h1>
      <p>Ce composant utilise Downshift pour la gestion de l'état et de l'interaction.</p>
      
      <div style={{ marginTop: '40px' }}>
        <h2>Sélectionnez un framework :</h2>
        <SelectableInput
          items={mockItems}
          placeholder="Tapez pour rechercher un framework..."
          onSelectionChange={(item) => {
            setSelectedFramework(item)
            console.log('Framework sélectionné:', item)
          }}
        />
        
        {selectedFramework && (
          <div style={{ 
            marginTop: '20px', 
            padding: '16px', 
            backgroundColor: '#f0f9ff', 
            borderRadius: '8px',
            border: '1px solid #0ea5e9'
          }}>
            <strong>Framework sélectionné :</strong> {selectedFramework.label}
          </div>
        )}
      </div>
      
      <div style={{ marginTop: '40px' }}>
        <h2>Test de la direction du menu :</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <h3>Menu vers le bas (par défaut)</h3>
          <SelectableInput
            items={mockItems}
            placeholder="Menu vers le bas..."
            onSelectionChange={(item) => {
              console.log('Sélection vers le bas:', item)
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>Menu vers le haut</h3>
          <SelectableInput
            items={mockItems}
            placeholder="Menu vers le haut..."
            openDirection="up"
            onSelectionChange={(item) => {
              console.log('Sélection vers le haut:', item)
            }}
          />
        </div>
      </div>

      <div style={{ marginTop: '40px', fontSize: '14px', color: '#666' }}>
        <h3>Fonctionnalités testées :</h3>
        <ul>
          <li>✅ Filtrage des éléments en temps réel</li>
          <li>✅ Navigation au clavier (flèches haut/bas, Enter, Escape)</li>
          <li>✅ Bouton pour ouvrir/fermer la liste</li>
          <li>✅ Fermeture automatique lors de la sélection</li>
          <li>✅ Mise en surbrillance de l'élément actif</li>
          <li>✅ Animation d'ouverture/fermeture</li>
          <li>🆕 Direction du menu contrôlée par prop (up/down)</li>
        </ul>
      </div>
    </div>
  )
}

export default App
