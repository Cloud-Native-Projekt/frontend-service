# Frontend Service – Renewable Site Suitability

An interactive dashboard that helps evaluate German locations for combined solar and wind projects. Users pick a site on the map, tune project parameters, and instantly see weather trends, infrastructure distances, risk alerts, and balanced suitability scores backed by server-side analysis.

## Highlights

- 🗺️ **Map-first site selection** restricted to Germany, with instant validation and adaptable search radius.
- ⚙️ **Server actions** aggregate geospatial and meteorological datasets from dedicated backend services.
- 📊 **Material UI dashboard** visualises wind, temperature, sunshine, precipitation, grid connections, and regulatory flags.
- 🔄 **High-fidelity skeletons** keep the results layout stable during loading.

## Architecture at a Glance

```
app/
 ├─ layout.tsx         Next.js App Router shell and global theme
 ├─ page.tsx           Header + Body + Footer composition
components/
 ├─ Body.tsx           Two-step flow (location → results)
 ├─ location-step/     Map, radius & turbine controls, summary CTA
 └─ results-step/      Dashboard cards + skeleton + scores
actions/
 ├─ analyzeCoordinates Aggregates geo + weather data via server actions
 ├─ geoService.ts      Fetches grid & zoning metrics from GEO_SERVICE_URL
 └─ weatherService.ts  Fetches historic & forecast weather from WEATHER_SERVICE_URL
```

## Data Flow

1. **Location selection** – users click the map (`Map` + `CoordinateMarker`). Clicks outside Germany trigger a Snackbar warning.
2. **Project parameters** – radius (1–5 km) and hub height are managed via `useProjectConfig` and summarised in the sidebar cards.
3. **Analysis request** – `LocationStep` calls the server action `analyzeCoordinates`, which concurrently queries the geo and weather services using fetch with helpful error logging.
4. **Aggregation & normalisation** – distances, zoning flags, and weather statistics are merged into a unified `AnalysisData` shape.
5. **Scoring** – `calculateScores` derives solar and wind scores:
	- Solar: sunshine hours vs. clouds and rain, plus penalties for protected areas, forests, and grid distance.
	- Wind: shear-adjusted mean wind speed, gust risk, land-use penalties, and infrastructure proximity.
6. **Dashboard rendering** – `SuitabilityDashboard` shows charts, gauges, and warnings; `SuitabilityDashboardSkeleton` guarantees a stable layout while data loads.

## Getting Started

### Prerequisites

- Node.js **20+** (Node 24 is used in the Docker image)
- npm **10+**

### Installation

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Visit http://localhost:3000 and start selecting locations.

### Build and run production bundle

```bash
npm run build
npm run start
```

### Lint the project

```bash
npm run lint
```

## Environment Variables

Create a `.env` file (a sample exists already) with the service endpoints:

```properties
GEO_SERVICE_URL=http://localhost:8001
WEATHER_SERVICE_URL=http://localhost:8002
```

- `GEO_SERVICE_URL` – distance to power lines, substations, forest/protection/build-up flags.
- `WEATHER_SERVICE_URL` – weekly historic & forecast temperature, wind, sunshine, cloud cover, and precipitation.

Both URLs must resolve from the Next.js server (not just the browser) because they are called inside server actions.

## Docker Support

An optimised multi-stage `docker/Dockerfile` is provided:

1. Install dependencies once (including dev dependencies).
2. Build the Next.js app with Turbopack.
3. Copy the compiled output into a slim runtime image and reinstall only production deps.

Build and run locally:

```bash
docker build -t frontend-service .
docker run --rm -p 3000:3000 --env-file .env frontend-service
```

Ensure the geo and weather services are reachable from within the container (host networking or service hostnames).

## UI & Theming Notes

- `src/theme.ts` defines custom spacing tokens and component overrides used throughout cards, dialogs, buttons, and alerts.
- Skeletons mirror the final layout, helping prevent layout shifts while fetching remote data.
- All MUI components are wired for light mode, rounded corners, and consistent paddings.
