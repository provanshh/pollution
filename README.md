EcoWard is a real-time, ward‑level air quality intelligence platform. It helps city administrators and citizens:

- Visualize hyper‑local AQI across wards on an interactive map  
- Track live changes to air quality and pollutant levels  
- Explore trends and policy scenarios for targeted mitigation  
- Provide citizen‑friendly views and a voice assistant on top of the data  

This project is a React + TypeScript single-page application powered by a simulated live sensor network and Gemini for AI capabilities.

## Features

### 1. Landing Experience
- Hero section with a live national pollution grid concept
- Search any ward/city via the **“Search Ward / City”** bar
- Live ticker of wards with AQI and PM2.5
- CTA to open the full **National Dashboard**

### 2. Real-time Dashboard
- **Ward-wise live AQI updates** (simulated every 5 seconds)
- **Interactive Ward Map**
  - Heatmap-style coloring by AQI level
  - Click on wards to see detailed analytics
- **Ward Analytics Panel**
  - Detailed AQI metrics and pollutants (e.g. PM2.5)
  - Comparative analytics across wards
- **Live Monitor Card**
  - Current status of the selected ward
  - Quick-glance health of the region

### 3. Trends & Insights
- Trends view (time-series style, via `TrendsView`) for:
  - Historical and comparative trends across wards
  - Visualizations using `recharts`

### 4. City Governance / Admin View
Admin dashboard for city authorities (`AdminView`):

- **Policy Simulation Lab**
  - Toggle interventions:
    - Odd–Even Traffic
    - Construction Ban
    - Industrial Curfew
  - See **projected city‑wide AQI** and % reduction based on interventions
- **Key Metrics**
  - Critical wards count
  - Active violations (industrial, construction)
  - Pending actions
  - Smog gun deployments
- **Ward Performance Table**
  - Ward‑wise status (Alert / Stable)
  - AQI level
  - Primary pollution source
  - Traffic index bar
  - Recommended action (e.g. Deploy Smog Guns, Traffic Diversion)

### 5. Citizen View
Citizen‑facing view (`CitizenView`) tailored for:
- Simple interpretation of AQI
- Health and exposure guidance
- Localized information for everyday decisions

### 6. Voice Assistant
Global **Voice Assistant** (`VoiceAssistant`) to:
- Answer questions like “How bad is the air in [ward]?”  
- Surface important metrics conversationally
- Use Gemini (`geminiService.ts`) under the hood for responses

---

## Tech Stack

- **Frontend Framework:** React 19 + TypeScript
- **Build Tool:** Vite
- **Charts:** `recharts`
- **Icons:** `lucide-react`
- **AI SDK:** `@google/genai` (Gemini)
- **Styling:** Tailwind‑style utility classes (via CSS setup in the app)
- **Bundler/Dev Server:** Vite

---

## Getting Started

### Prerequisites

- **Node.js** (LTS recommended)
- **npm** (comes with Node)

### 1. Install Dependencies

From the project root:

```bash
npm install
```

### 2. Configure Environment

Create a `.env.local` file in the project root (if it doesn’t exist) and set your Gemini API key:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

> The app uses `@google/genai` via `services/geminiService.ts` to power the voice assistant and AI features.

### 3. Run in Development Mode

```bash
npm run dev
```

By default, Vite will start the dev server (commonly on `http://localhost:5173` – check the terminal output).

---

## Available Scripts

All scripts are defined in `package.json`:

- **`npm run dev`** – Start the Vite dev server
- **`npm run build`** – Build the app for production
- **`npm run preview`** – Preview the production build locally

---

## Project Structure (High-level)

```text
.
├── App.tsx                 # Root app, view switching, live update loop
├── index.tsx               # React entry point
├── index.html              # HTML shell for Vite
├── components/
│   ├── AdminView.tsx       # City governance dashboard & policy simulation
│   ├── CitizenView.tsx     # Citizen-focused view
│   ├── LandingPage.tsx     # Hero, search, live ticker, satellite section
│   ├── LiveMonitorCard.tsx # Key metrics for selected ward
│   ├── Navigation.tsx      # Top navigation & view selection
│   ├── TrendsView.tsx      # Trends and historical-style views
│   ├── VoiceAssistant.tsx  # Voice/AI assistant component
│   ├── WardAnalytics.tsx   # Detailed analytics for a selected ward
│   ├── WardMap.tsx         # Interactive ward map/heatmap
│   └── WardSearch.tsx      # Ward / city search component
├── services/
│   ├── dataService.ts      # Ward data model, initial data & live simulation
│   └── geminiService.ts    # Gemini client & prompt helpers
├── types.ts                # Shared TypeScript types (Ward, ViewMode, etc.)
├── package.json            # Dependencies & scripts
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration
```

---

## Data & Simulation

The app uses a simulated data layer (`services/dataService.ts`) to:

- Generate an initial set of **wards** with:
  - AQI value
  - AQI category
  - Pollutant readings (e.g., PM2.5)
  - Primary sources and traffic index
- Periodically **simulate live updates** every 5 seconds via:
  - `simulateLiveUpdate(previousWardState)`

This allows the UI to behave as if connected to a real sensor grid, while remaining fully local and self-contained.

---

## Deployment

Any static hosting provider that supports a SPA built with Vite will work:

1. Build the production bundle:

   ```bash
   npm run build
   ```

2. Serve the contents of the generated `dist/` folder using:
   - Vercel / Netlify / Cloudflare Pages
   - Nginx / Apache
   - Static file hosting of your choice

> Make sure your `GEMINI_API_KEY` is configured appropriately in the deployment environment (or via a secure secret manager) if you intend to keep AI features enabled.

---

## Notes & Future Enhancements

Potential next steps:

- Hook the data layer to **real AQI APIs** or municipal sensor data
- Add **user authentication** for different roles (admin vs citizen)
- Implement **exportable reports** (PDF/CSV) from AdminView
- Integrate push alerts for severe AQI levels in specific wards

---

## License

Add your preferred license here (e.g., MIT, Apache-2.0), or mark as proprietary if applicable.