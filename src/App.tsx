import { useState } from 'react'
import { SelectableInput } from './SelectableInput'
import { FloatingSelectableInput } from './FloatingSelectableInput'
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
  const [selectedFloatingFramework, setSelectedFloatingFramework] = useState<any>(null)

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Test des composants SelectableInput</h1>
      <p>Comparaison entre le composant basique et celui avec Floating UI.</p>
      
      <div style={{ marginTop: '40px' }}>
        <h2>1. Composant basique avec Downshift :</h2>
        <SelectableInput
          items={mockItems}
          placeholder="Tapez pour rechercher un framework..."
          onSelectionChange={(item) => {
            setSelectedFramework(item)
            console.log('Framework sélectionné (basique):', item)
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
        <h2>2. Composant avec Floating UI :</h2>
        <FloatingSelectableInput
          items={mockItems}
          placeholder="Tapez pour rechercher un framework (avec Floating UI)..."
          onSelectionChange={(item) => {
            setSelectedFloatingFramework(item)
            console.log('Framework sélectionné (Floating UI):', item)
          }}
        />
        
        {selectedFloatingFramework && (
          <div style={{ 
            marginTop: '20px', 
            padding: '16px', 
            backgroundColor: '#f0fdf4', 
            borderRadius: '8px',
            border: '1px solid #22c55e'
          }}>
            <strong>Framework sélectionné (Floating UI) :</strong> {selectedFloatingFramework.label}
          </div>
        )}
      </div>
      
      <div style={{ marginTop: '40px' }}>
        <h2>Test des différentes configurations Floating UI :</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <h3>Placement automatique</h3>
            <FloatingSelectableInput
              items={mockItems}
              placeholder="Auto placement..."
              placement="auto"
              onSelectionChange={(item) => console.log('Auto:', item)}
            />
          </div>
          
          <div>
            <h3>Toujours en bas</h3>
            <FloatingSelectableInput
              items={mockItems}
              placeholder="Toujours en bas..."
              placement="bottom"
              enableFlip={false}
              onSelectionChange={(item) => console.log('Bottom:', item)}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <h3>Toujours en haut</h3>
            <FloatingSelectableInput
              items={mockItems}
              placeholder="Toujours en haut..."
              placement="top"
              enableFlip={false}
              onSelectionChange={(item) => console.log('Top:', item)}
            />
          </div>
          
          <div>
            <h3>Avec flip activé</h3>
            <FloatingSelectableInput
              items={mockItems}
              placeholder="Avec retournement..."
              placement="bottom"
              enableFlip={true}
              onSelectionChange={(item) => console.log('Flip:', item)}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <h3>Sans portal</h3>
            <FloatingSelectableInput
              items={mockItems}
              placeholder="Sans portal..."
              portal={false}
              onSelectionChange={(item) => console.log('No portal:', item)}
            />
          </div>
          
          <div>
            <h3>Avec portal (par défaut)</h3>
            <FloatingSelectableInput
              items={mockItems}
              placeholder="Avec portal..."
              portal={true}
              onSelectionChange={(item) => console.log('With portal:', item)}
            />
          </div>
        </div>
      </div>

      <div style={{ marginTop: '40px', fontSize: '14px', color: '#666' }}>
        <h3>Fonctionnalités comparées :</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <h4>Composant basique (SelectableInput)</h4>
            <ul>
              <li>✅ Filtrage des éléments en temps réel</li>
              <li>✅ Navigation au clavier</li>
              <li>✅ Bouton toggle</li>
              <li>✅ Direction contrôlée par prop (up/down)</li>
              <li>✅ CSS simple et prévisible</li>
              <li>✅ Plus léger (moins de dépendances)</li>
            </ul>
          </div>
          
          <div>
            <h4>Composant Floating UI (FloatingSelectableInput)</h4>
            <ul>
              <li>✅ Toutes les fonctionnalités du basique</li>
              <li>🆕 Positionnement intelligent automatique</li>
              <li>🆕 Gestion des collisions avec les bords</li>
              <li>🆕 Redimensionnement selon l'espace disponible</li>
              <li>🆕 Portal pour éviter les problèmes de z-index</li>
              <li>🆕 Middleware personnalisables</li>
              <li>🆕 Animation adaptée au placement</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Section pour tester le positionnement en bas de page */}
      <div style={{ marginTop: '40px', paddingTop: '40px', borderTop: '2px dashed #e2e8f0' }}>
        <h2>Test en bas de page (pour tester le flip automatique) :</h2>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
          Ces composants devraient automatiquement s'ouvrir vers le haut quand il n'y a pas assez d'espace en bas.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '100px' }}>
          <div>
            <h3>Composant basique (direction manuelle)</h3>
            <SelectableInput
              items={mockItems}
              placeholder="Direction manuelle vers le haut..."
              openDirection="up"
              onSelectionChange={(item) => console.log('Manual up:', item)}
            />
          </div>
          
          <div>
            <h3>Floating UI (flip automatique)</h3>
            <FloatingSelectableInput
              items={mockItems}
              placeholder="Flip automatique..."
              placement="bottom"
              enableFlip={true}
              onSelectionChange={(item) => console.log('Auto flip:', item)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
