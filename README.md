# Farm Management System
A web-based dashboard for managing farm plots, crops, and agricultural activities. This system allows farmers to track plot status, manage crop lifecycles, and view analytics through an intuitive interface.

# Live Demo
- Application: https://smart-farm-project-management-7en9ov1kd.vercel.app/
- Backend API: https://smart-farm-project-management-production.up.railway.app/api/plots
- GitHub Repository: https://github.com/Pavitra2001/smart-farm-project-management

<img width="1904" height="633" alt="image" src="https://github.com/user-attachments/assets/c6b12279-dece-4729-9b01-9fc9d099c184" />

# System Architecture
<img width="285" height="366" alt="image" src="https://github.com/user-attachments/assets/6bedb09e-568e-4141-afb5-c8afc76187ba" />

## Frontend Dashboard (React.js)
- Displays farm plots with current status
- Provides action buttons (water, fertilize, harvest, plant)
- Shows analytics charts and statistics

## Backend Services (Node.js + Express)
- Exposes REST API endpoints for farm operations
- Processes business logic (growth calculations, status updates)
- Validates user actions
- Manages farm data updates

## Data Simulation
- Uses JavaScript objects to store plot information
- Tracks crop growth, watering dates, and attention alerts

# Technology Choices
## Frontend Stack
- React.js - Component-based UI framework for interactive dashboards
- Recharts - Professional charting library for analytics visualization
- CSS3 - Custom styling with modern design patterns
- Fetch API - HTTP client for backend communication

## Backend Stack
- Node.js - JavaScript runtime for server-side development
- Express.js - Web framework for REST API development
- CORS - Middleware for cross-origin requests
- JSON - Data format for API communication

## Deployment
- Vercel - Frontend hosting with automatic GitHub integration
- Railway - Backend hosting with continuous deployment
- GitHub - Version control and source code management

# Local Development Setup
1. Clone Repository
   - git clone https://github.com/Pavitra2001/smart-farm-project-management.git
2. Setup Backend
   - cd backend
   - npm install
   - npm start
3. Setup Frontend
   - cd frontend
   - npm install
   - npm start

# Future Features
The next features to implement would be Weather Simulation System. We can add environmental conditions that affect crop growth rates, watering frequency, and harvest timing. This would include sunny days boosting growth, rainy days reducing water needs, and drought conditions requiring more frequent watering.
We can also add User Authentication & Multi-Farm Support, which will enable multiple farmers to manage separate farms with user accounts, allowing agricultural consultants to oversee multiple operations and farmers to collaborate on shared plots.
