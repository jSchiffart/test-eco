import React, { useState } from 'react';
import './App.css';

const BUTTONS = [
  { label: 'Pomoideas', value: 'pomoideas' },
  { label: 'Button 2', value: 'button2' },
  { label: 'Button 3', value: 'button3' },
  { label: 'Button 4', value: 'button4' },
];

function App() {
  const [selected, setSelected] = useState<string>('pomoideas');
  const [area, setArea] = useState<string>('');

  const handleButtonClick = (value: string) => {
    setSelected(value);
    setArea(''); // Reset area when changing selection
  };

  const handleAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArea(e.target.value);
  };

  const getAmount = () => {
    const num = parseFloat(area);
    if (isNaN(num)) return 0;
    return num * 2;
  };

  return (
    <div className="App">
      <div className="form-container">
        <h1>Selection Flow</h1>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          {BUTTONS.map((btn) => (
            <button
              key={btn.value}
              onClick={() => handleButtonClick(btn.value)}
              style={{
                background: selected === btn.value ? '#4a90e2' : '#eee',
                color: selected === btn.value ? '#fff' : '#333',
                border: 'none',
                borderRadius: '4px',
                padding: '0.75rem 1.5rem',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {selected === 'pomoideas' && (
          <div className="input-group" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label htmlFor="area">Área:</label>
            <input
              type="text"
              id="area"
              value={area}
              onChange={handleAreaChange}
              placeholder="Enter area"
              style={{ width: '120px' }}
            />
            <span style={{ fontWeight: 600, color: '#4a90e2' }}>€ {getAmount()}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
