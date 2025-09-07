import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const Analytics = ({ plots }) => {
  // Prepare data for growth progress chart
  const growthData = plots.map(plot => ({
    name: `Plot ${plot.id}`,
    crop: plot.cropType,
    growth: plot.growthProgress,
    status: plot.status
  }));

  // Prepare data for crop distribution pie chart
  const cropCounts = plots.reduce((acc, plot) => {
    const crop = plot.cropType === 'none' ? 'empty' : plot.cropType;
    acc[crop] = (acc[crop] || 0) + 1;
    return acc;
  }, {});

  const cropData = Object.entries(cropCounts).map(([crop, count]) => ({
    name: crop,
    value: count
  }));

  // Farm statistics
  const totalPlots = plots.length;
  const activePlots = plots.filter(p => p.status !== 'empty').length;
  const readyToHarvest = plots.filter(p => p.status === 'ready_to_harvest').length;
  const averageGrowth = Math.round(plots.reduce((sum, p) => sum + p.growthProgress, 0) / totalPlots);

  // Colors for pie chart
  const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <div className="analytics-container">
      <h2>📊 Farm Analytics</h2>
      
      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{totalPlots}</h3>
          <p>Total Plots</p>
        </div>
        <div className="stat-card">
          <h3>{activePlots}</h3>
          <p>Active Plots</p>
        </div>
        <div className="stat-card">
          <h3>{readyToHarvest}</h3>
          <p>Ready to Harvest</p>
        </div>
        <div className="stat-card">
          <h3>{averageGrowth}%</h3>
          <p>Average Growth</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Growth Progress Chart */}
        <div className="chart-container">
          <h3>Growth Progress by Plot</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [value + '%', 'Growth']}
                labelFormatter={(label) => {
                  const plot = growthData.find(p => p.name === label);
                  return `${label}: ${plot?.crop}`;
                }}
              />
              <Legend />
              <Bar dataKey="growth" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Crop Distribution Chart */}
        <div className="chart-container">
          <h3>Crop Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={cropData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {cropData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;