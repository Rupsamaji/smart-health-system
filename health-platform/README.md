# PulseView — Intelligent Health Monitoring Platform

A portfolio project demonstrating a personal measurement dashboard, a Node.js/Express REST API, MongoDB persistence and an ESP32 integration template.

## Implemented in this repository
- Responsive dashboard for entering and reviewing heart-rate, SpO₂ and temperature readings.
- Express REST API with create/list/delete operations.
- Mongoose schema validation and request-level validation.
- Helmet security headers, restricted CORS and rate limiting.
- ESP32 HTTP POST template with clearly marked sensor placeholders.

## Run locally
### Requirements
Node.js 20+, MongoDB Community Server or MongoDB Atlas, and a browser.

### API
```bash
cd api
npm install
cp .env.example .env
```
Edit `.env` with your MongoDB connection string, then run:
```bash
npm run dev
``
API health check: `http://localhost:5000/api/health`.

### Dashboard
Serve the `dashboard` directory using VS Code Live Server or another static HTTP server. The default API URL is `http://localhost:5000`.

## API endpoints
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/health | Service health |
| GET | /api/measurements | Latest measurements |
| POST | /api/measurements | Save a measurement |
| DELETE | /api/measurements/{id} | Delete a measurement |

POST example:
```json
{"heartRate":72,"spo2":98,"temperatureC":36.7,"source":"manual","note":"Demo entry"}
```

## ESP32
Open `device/esp32_sensor_template.ino` in Arduino IDE. Configure Wi-Fi and the API host. Replace the placeholder sensor functions with hardware-specific, calibrated sensor drivers. The current values are demo placeholders, not actual sensor readings.

## Important limitations
This is an educational software demonstration, not a medical device. It does not diagnose disease, provide clinical risk predictions or generate treatment advice. No patient identity or authentication layer is implemented; do not store identifiable or sensitive real patient data. The ESP32 sketch is a connectivity template and has not been tested against physical hardware.
