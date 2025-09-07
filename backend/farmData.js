// farmData.js
const farmPlots = [
  {
    id: 1,
    cropType: "Tomatoes",
    status: "Growing",
    lastWatered: "2025-08-20",
    growthProgress: 55,
    needsAttention: false
  },
  {
    id: 2,
    cropType: "Corn",
    status: "Ready to Harvest",
    lastWatered: "2025-08-29",
    growthProgress: 100,
    needsAttention: true
  },
  {
    id: 3,
    cropType: "Carrots",
    status: "Planted",
    lastWatered: "2025-09-1",
    growthProgress: 30,
    needsAttention: true
  }
];

module.exports = { farmPlots };