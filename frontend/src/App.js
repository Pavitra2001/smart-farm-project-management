import React, { useState, useEffect } from 'react';
import './App.css';
import Analytics from './Analytics';

const API_BASE_URL = 'https://smart-farm-project-management-production.up.railway.app/api';

function App() {
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Fetch farm data when component loads
  useEffect(() => {
    fetchPlots();
  }, []);

  const fetchPlots = async () => {
    try {
      console.log('Fetching plots from backend...');
      const response = await fetch(`${API_BASE_URL}/plots`);
      const data = await response.json();
      console.log('Received data:', data);
      setPlots(data.plots);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching plots:', err);
      setError('Failed to load farm data');
      setLoading(false);
    }
  };

  // NEW: Water a plot function
  const waterPlot = async (plotId) => {
    try {
      console.log(`Watering plot ${plotId}...`);
      const response = await fetch(`${API_BASE_URL}/plots/${plotId}/water`, {
        method: 'PATCH'
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Watering successful:', result);
        // Refresh the plots to show updated data
        fetchPlots();
      } else {
        console.error('Failed to water plot');
      }
    } catch (err) {
      console.error('Error watering plot:', err);
    }
  };

  // NEW: Harvest a plot function
  const harvestPlot = async (plotId) => {
    try {
      console.log(`Harvesting plot ${plotId}...`);
      const response = await fetch(`${API_BASE_URL}/plots/${plotId}/harvest`, {
        method: 'PATCH'
      });
      
      const result = await response.json();
      
      if (response.ok) {
        console.log('Harvest successful:', result);
        // Refresh the plots to show updated data
        fetchPlots();
      } else {
        console.error('Harvest failed:', result.error);
        alert(`Cannot harvest: ${result.error}`);
      }
    } catch (err) {
      console.error('Error harvesting plot:', err);
    }
  };

  // Calculate plots that need attention
  const plotsNeedingAttention = plots.filter(plot => plot.needsAttention);

  // Fertilize a plot function
  const fertilizePlot = async (plotId) => {
    try {
      console.log(`Fertilizing plot ${plotId}...`);
      const response = await fetch(`${API_BASE_URL}/plots/${plotId}/fertilize`, {
        method: 'PATCH'
      });
      
      const result = await response.json();
      
      if (response.ok) {
        console.log('Fertilizing successful:', result);
        // Refresh the plots to show updated data
        fetchPlots();
      } else {
        console.error('Fertilizing failed:', result.error);
        alert(`Cannot fertilize: ${result.error}`);
      }
    } catch (err) {
      console.error('Error fertilizing plot:', err);
    }
  };

  // NEW: Plant a crop in empty plot
  const plantCrop = async (plotId, cropType) => {
    try {
      console.log(`Planting ${cropType} in plot ${plotId}...`);
      const response = await fetch(`${API_BASE_URL}/plots/${plotId}/plant`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cropType })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        console.log('Planting successful:', result);
        // Refresh the plots to show updated data
        fetchPlots();
      } else {
        console.error('Planting failed:', result.error);
        alert(`Cannot plant: ${result.error}`);
      }
    } catch (err) {
      console.error('Error planting crop:', err);
    }
  };

  // NEW: Handle crop planting with user input
  const handlePlantCrop = (plotId) => {
    const cropType = prompt('What crop would you like to plant?\n\nSuggestions: tomatoes, corn, carrots, wheat, potatoes, peppers');
    
    if (cropType && cropType.trim() !== '') {
      plantCrop(plotId, cropType.trim());
    }
  };

  // Add a new plot to the farm
  const addNewPlot = async () => {
    try {
      console.log('Adding new plot...');
      const response = await fetch(`${API_BASE_URL}/plots`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const result = await response.json();
      
      if (response.ok) {
        console.log('New plot added:', result);
        // Refresh the plots to show the new plot
        fetchPlots();
      } else {
        console.error('Failed to add plot:', result.error);
        alert('Failed to add new plot');
      }
    } catch (err) {
      console.error('Error adding plot:', err);
    }
  };

  // Delete a plot from the farm
  const deletePlot = async (plotId) => {
    if (!window.confirm(`Are you sure you want to delete Plot ${plotId}? This action cannot be undone.`)) {
      return;
    }
    
    try {
      console.log(`Deleting plot ${plotId}...`);
      const response = await fetch(`${API_BASE_URL}/plots/${plotId}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (response.ok) {
        console.log('Plot deleted:', result);
        // Refresh the plots to show updated list
        fetchPlots();
      } else {
        console.error('Delete failed:', result.error);
        alert(`Cannot delete: ${result.error}`);
      }
    } catch (err) {
      console.error('Error deleting plot:', err);
    }
  };

  if (loading) return <div>Loading farm data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
  <div className="App">
    {/* Updated Header with Add Button */}
    <header className="modern-header">
      <div className="header-content">
        <h1>🌾 Smart Farm Dashboard</h1>
        <div className="header-stats">
          <span>Total Plots: {plots.length}</span>
          <span>Active: {plots.filter(p => p.status !== 'empty').length}</span>
        </div>
      </div>
      
      {/* Navigation Tabs with Add Button */}
      <nav className="nav-tabs">
        <button 
          className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          🏠 Dashboard
        </button>
        <button 
          className={`nav-tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📊 Analytics
        </button>
        <button 
          className="btn-add-plot"
          onClick={addNewPlot}
        >
          ➕ Add New Plot
        </button>
      </nav>
    </header>

    {/* Alert Banner */}
    {plotsNeedingAttention.length > 0 && (
      <div className="alert-banner">
        ⚠️ {plotsNeedingAttention.length} plot(s) need attention!
      </div>
    )}

    {/* Main Content */}
    <main className="main-content">
      {activeTab === 'dashboard' && (
        <div className="dashboard-tab">
          {/* Remove the old dashboard-header section */}
          
          {/* Plots Grid with Delete Button */}
          <div className="plots-container">
            {plots.map(plot => (
              <div 
                key={plot.id} 
                className={`plot-card ${plot.needsAttention ? 'needs-attention' : ''}`}
              >
                <button 
                  className="delete-icon"
                  onClick={() => deletePlot(plot.id)}
                  title={`Delete Plot ${plot.id}`}
                >
                  🗑️
                </button>

                <h3>Plot {plot.id}: {plot.cropType}</h3>
                <p><strong>Status:</strong> {plot.status}</p>
                <p><strong>Last Watered:</strong> {plot.lastWatered}</p>
                <p><strong>Growth:</strong> {plot.growthProgress}%</p>
                <p><strong>Needs Attention:</strong> {plot.needsAttention ? '⚠️ YES' : '✅ NO'}</p>
                
                <div className="actions">
                  {plot.status === 'empty' ? (
                    <button 
                      className="btn-plant"
                      onClick={() => handlePlantCrop(plot.id)}
                    >
                      🌱 Plant Crop
                    </button>
                  ) : (
                    <>
                      <button 
                        className="btn-water"
                        onClick={() => waterPlot(plot.id)}
                      >
                        💧 Water
                      </button>
                      <button 
                        className="btn-fertilize"
                        onClick={() => fertilizePlot(plot.id)}
                      >
                        🌱 Fertilize
                      </button>
                      <button 
                        className="btn-harvest"
                        onClick={() => harvestPlot(plot.id)}
                      >
                        ✂️ Harvest
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <Analytics plots={plots} />
      )}
    </main>
  </div>
);
}

export default App;
