const express = require('express');
const cors = require('cors');
const { farmPlots } = require('./farmData');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Smart Farm Server is running!' });
});

// Get all farm plots
app.get('/api/plots', (req, res) => {
  res.json({ plots: farmPlots });
});

// NEW: Water a specific plot
app.patch('/api/plots/:id/water', (req, res) => {
  const plotId = parseInt(req.params.id);
  
  // Find the plot
  const plot = farmPlots.find(p => p.id === plotId);
  
  if (!plot) {
    return res.status(404).json({ error: 'Plot not found' });
  }
  
  // Update plot - simulate watering
  plot.lastWatered = new Date().toISOString().split('T')[0]; // Today's date
  plot.needsAttention = false;
  
  // If plot was dry, increase growth a bit
  if (plot.growthProgress < 100) {
    plot.growthProgress = Math.min(100, plot.growthProgress + 10);
  }
  
  res.json({ 
    message: `Plot ${plotId} watered successfully!`,
    plot: plot 
  });
});

// NEW: Harvest a specific plot
app.patch('/api/plots/:id/harvest', (req, res) => {
  const plotId = parseInt(req.params.id);
  
  console.log(`🌾 Harvest request for plot ${plotId}`);
  
  // Find the plot
  const plot = farmPlots.find(p => p.id === plotId);
  
  if (!plot) {
    console.log(`❌ Plot ${plotId} not found`);
    return res.status(404).json({ error: 'Plot not found' });
  }
  
  // Check if ready to harvest
  if (plot.growthProgress < 100) {
    console.log(`❌ Plot ${plotId} not ready to harvest (${plot.growthProgress}%)`);
    return res.status(400).json({ error: 'Crop not ready to harvest yet' });
  }
  
  console.log(`📊 Before harvest:`, plot);
  
  // Reset plot after harvest
  plot.status = 'Empty';
  plot.cropType = 'None';
  plot.growthProgress = 0;
  plot.needsAttention = true; // Needs replanting
  plot.lastWatered = 'Never';
  
  console.log(`✅ After harvest:`, plot);
  
  res.json({ 
    message: `Plot ${plotId} harvested successfully! Ready for replanting.`,
    plot: plot 
  });
});

  // Fertilize a specific plot
  app.patch('/api/plots/:id/fertilize', (req, res) => {
    const plotId = parseInt(req.params.id);
    
    console.log(`🌱 Fertilize request for plot ${plotId}`);
    
    // Find the plot
    const plot = farmPlots.find(p => p.id === plotId);
    
    if (!plot) {
      console.log(`❌ Plot ${plotId} not found`);
      return res.status(404).json({ error: 'Plot not found' });
    }

    // Check if plot has crops to fertilize
    if (plot.status === 'Empty' || plot.cropType === 'none') {
      console.log(`❌ Plot ${plotId} is empty - nothing to fertilize`);
      return res.status(400).json({ error: 'Cannot fertilize empty plot' });
    }
    
    console.log(`📊 Before fertilizing:`, plot);
    
    // Fertilizing boosts growth significantly
    if (plot.growthProgress < 100) {
      plot.growthProgress = Math.min(100, plot.growthProgress + 20); // Bigger boost than watering
    }
    
    // Update status if growth reaches 100%
    if (plot.growthProgress >= 100) {
      plot.status = 'Ready to Harvest';
      plot.needsAttention = true; // Ready for harvest
    }
    
    console.log(`✅ After fertilizing:`, plot);
    
    res.json({ 
      message: `Plot ${plotId} fertilized successfully! Growth boosted.`,
      plot: plot 
    });
  });

  // Plant a crop in an empty plot
  app.patch('/api/plots/:id/plant', (req, res) => {
    const plotId = parseInt(req.params.id);
    const { cropType } = req.body;
    
    console.log(`🌱 Plant request for plot ${plotId} with crop: ${cropType}`);
    
    // Find the plot
    const plot = farmPlots.find(p => p.id === plotId);
    
    if (!plot) {
      console.log(`❌ Plot ${plotId} not found`);
      return res.status(404).json({ error: 'Plot not found' });
    }

    // Check if plot is empty
    if (plot.status !== 'Empty') {
      console.log(`❌ Plot ${plotId} is not empty`);
      return res.status(400).json({ error: 'Plot is not empty - harvest first' });
    }

    // Validate crop type
    if (!cropType || cropType.trim() === '') {
      console.log(`❌ No crop type provided`);
      return res.status(400).json({ error: 'Crop type is required' });
    }
    
    console.log(`📊 Before planting:`, plot);
    
    // Plant the new crop
    plot.cropType = cropType.toLowerCase();
    plot.status = 'Planted';
    plot.growthProgress = 10; // Start with some initial growth
    plot.lastWatered = new Date().toISOString().split('T')[0]; // Today
    plot.needsAttention = false; // Just planted, no immediate attention needed
    
    console.log(`✅ After planting:`, plot);
    
    res.json({ 
      message: `${cropType} planted successfully in Plot ${plotId}!`,
      plot: plot 
    });
  });

  app.post('/api/plots', (req, res) => {
    console.log('🆕 Adding new plot to farm');
    
    // Find the next available ID
    const nextId = Math.max(...farmPlots.map(p => p.id)) + 1;
    
    // Create new empty plot
    const newPlot = {
      id: nextId,
      cropType: 'none',
      status: 'empty',
      lastWatered: 'never',
      growthProgress: 0,
      needsAttention: true // New plot needs planting
    };
    
    // Add to farm
    farmPlots.push(newPlot);
    
    console.log(`✅ New plot ${nextId} added:`, newPlot);
    
    res.json({ 
      message: `New plot ${nextId} added to your farm!`,
      plot: newPlot,
      totalPlots: farmPlots.length
    });
  });

  // Delete a plot from the farm
  app.delete('/api/plots/:id', (req, res) => {
    const plotId = parseInt(req.params.id);
    
    console.log(`🗑️ Delete request for plot ${plotId}`);
    
    // Find plot index
    const plotIndex = farmPlots.findIndex(p => p.id === plotId);
    
    if (plotIndex === -1) {
      console.log(`❌ Plot ${plotId} not found`);
      return res.status(404).json({ error: 'Plot not found' });
    }
    
    // Don't allow deleting if only 1 plot remains
    if (farmPlots.length <= 1) {
      console.log(`❌ Cannot delete - minimum 1 plot required`);
      return res.status(400).json({ error: 'Cannot delete - farm must have at least 1 plot' });
    }
    
    // Remove the plot
    const deletedPlot = farmPlots.splice(plotIndex, 1)[0];
    
    console.log(`✅ Plot ${plotId} deleted:`, deletedPlot);
    
    res.json({ 
      message: `Plot ${plotId} deleted successfully!`,
      deletedPlot: deletedPlot,
      remainingPlots: farmPlots.length
    });
  });

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});