# 🌍 Pave the Way
*A civic technology platform empowering Charlotte residents to help shape sustainable transportation infrastructure.*

---

## 🧭 Overview
**Pave the Way** is a full-stack web application designed to collect transportation needs and preferences from the citizens of **Charlotte, North Carolina** through a community survey. Using **AI-powered analysis** and **mapping tools**, the app generates **eco-friendly route recommendations** to help guide the city’s infrastructure planning under the **P.A.V.E. Act**.

When a user submits a survey, their data is processed through the **Perplexity AI API**, which analyzes their route and returns optimized, environmentally conscious alternatives. These recommendations are visualized using **Mapbox**, showing both the existing and the hypothetical eco-friendly route along with sustainability metrics and suggestions for new infrastructure.

---

## 🌟 Core Features
### 🚶‍♀️ Citizen-Focused Survey
- Collects travel needs, destinations, and preferred modes of transport (walking, biking, bus, etc.)
- Provides both **anonymous** and **account-based** participation

### 🧠 AI-Powered Recommendations
- Integrates with **Perplexity AI API** to analyze user-submitted travel routes  
- Suggests **eco-friendly infrastructure improvements** such as sidewalks, bus routes, or bike lanes  
- Returns key metrics:
  - Estimated **carbon emission reductions**
  - **Accessibility score**
  - **Reduced travel distance**

### 🗺️ Interactive Mapping
- Visualizes both **current route** and **AI-generated hypothetical route**  

### 👥 User Accounts & Data Management
- Users can create an account to:
  - Save past surveys and results  
  - View stored metrics/route data
- However, accounts are **not required** to complete the survey  
- Accounts include **full CRUD functionality**:
  - **Create** an account  
  - **Read** and display user details  
  - **Update** account information  
  - **Delete** an account 

### 🏙️ Civic & Environmental Impact
- Aims to support **Charlotte’s sustainability and accessibility goals** under the **P.A.V.E. Act**  
- Can provide city planners with **data-driven recommendations** for eco-friendly infrastructure investment  

---

## 🧩 Tech Stack

**Front-End**
- **React** (for UI and state management)
- **Bootstrap** for responsive design
- **Mapbox** for map rendering and route visualization
- **Fetch API** for client-server communication

**Back-End**
- 🟩 **Node.js** and **Express.js** (API routes, authentication, and business logic)
- 🧠 **Perplexity AI API** for generating optimized infrastructure suggestions
- 🗄️ **SQL / PostgreSQL** (hosted) for user and survey data
- ⚙️ **dotenv** for environment variable configuration

**Dev Tools**
- npm  
- Git & GitHub for version control  
- Concurrently to run backend and frontend simultaneously 
- Railway (or similar service) for SQL database hosting


