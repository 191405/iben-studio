# IBEN STUDIO — Enterprise Full-Stack Web Application

> **Building what Nigeria needs next.**  
> A multidisciplinary studio operating at the intersection of **Software Engineering**, **Solar Infrastructure**, and **Heritage Beadwork & Beaded Fashion**. Est. Lagos.

[![CI/CD Pipeline](https://github.com/iben-studio/website/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/iben-studio/website/actions/workflows/ci-cd.yml)
[![Docker Support](https://img.shields.io/badge/Docker-Enabled-blue?logo=docker)](./Dockerfile)
[![Architecture](https://img.shields.io/badge/Architecture-Senior%20Engineer-gold)](./ARCHITECTURE.md)

---

## 🏛️ Executive Architecture Overview

IBEN Studio is engineered with an **Enterprise Senior Engineer Backend Architecture** (`/server`) and a **Figma-Level Atomic Design System Frontend** (`/css/tokens.css`). 

For a complete breakdown of sequence diagrams, CI/CD pipelines, and mathematical models for solar engineering calculations, please see [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## 🚀 Quick Start (Local Development)

### 1. Run with Docker Compose (Recommended)

To start the enterprise REST API and static frontend inside a hardened container:

```bash
docker-compose up --build -d
```
- **Frontend & API Host**: `http://localhost:3000`
- **Health Check Endpoint**: `http://localhost:3000/api/v1/health`

### 2. Run Backend & Frontend Locally without Docker

1. **Install Backend Dependencies**:
   ```bash
   cd server
   npm install
   ```

2. **Start the Development API Server**:
   ```bash
   npm run dev
   ```

3. **Run Automated Unit Tests**:
   ```bash
   npm test
   ```

---

## 🔌 Core Enterprise API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/health` | System health, uptime, and memory telemetry |
| `POST` | `/api/v1/solar/calculate` | Advanced mathematical solar load, battery & ROI estimator |
| `GET` | `/api/v1/portfolio` | Retrieve filterable case studies by discipline |
| `POST` | `/api/v1/inquiries` | Submit client inquiry with automated validation & status tracking |
| `POST` | `/api/v1/beadwork/quote` | Calculate pricing & material specs for bespoke beaded fashion |

---

## 🎨 Figma-Level Design Tokens

All visual styles use structured CSS Custom Properties defined in `css/tokens.css`:
- **Color Palette**: Onyx (`#111`), Cream (`#F7F4EF`), Luxury Gold (`#C89B3C`), Solar Terra Cotta (`#B85235`).
- **Typography Scale**: Editorial Playfair Display serif headlines paired with Space Grotesk sans precision.
- **Micro-Interactions**: Glassmorphic modals, live API health badges, interactive solar sliders, and real-time form validation.
