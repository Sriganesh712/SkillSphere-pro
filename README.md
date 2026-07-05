# 🌐 SkillSphere – AI-Powered Skill Exchange & Learning Ecosystem

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933.svg)](https://nodejs.org/)
[![AI-Powered](https://img.shields.io/badge/AI-OpenAI%20%7C%20VectorDB-orange.svg)]()

> **SkillSphere** is a next-generation interactive learning and skill-exchange platform that leverages AI recommendation engines, dynamic learning roadmaps, real-time peer mentorship, and verified skill credentialing to democratize education and skill growth.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Running the Application](#running-the-application)
- [API Documentation](#-api-documentation)
- [AI & Recommendation Engine](#-ai--recommendation-engine)
- [Deployment Guide](#-deployment-guide)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 Overview

SkillSphere bridges the gap between learning and teaching by connecting individuals with complementary skill sets. Powered by artificial intelligence, SkillSphere analyzes user learning goals, skill profiles, and learning velocity to generate tailored skill growth roadmaps, automate peer matching, and provide 24/7 AI-tutor support.

---

## ✨ Key Features

### 🎯 1. AI-Driven Skill Matching & Peer Exchange
- **Smart Recommendations**: Matches mentors and learners based on skill affinity, availability, and language preferences.
- **Skill Swap Marketplace**: Peer-to-peer credits system where teaching a skill earns credits to learn new skills.

### 🤖 2. Interactive AI Learning Assistant (SkillSphere Tutor)
- **Personalized Roadmaps**: Generates step-by-step learning paths tailored to career goals.
- **Context-Aware Assistance**: Instant feedback on coding challenges, design critiques, and conceptual queries.
- **Automated Quiz & Challenge Generator**: Dynamic quizzes generated based on current skill level.

### 🗺️ 3. Dynamic Learning Roadmaps
- Node-based interactive visualization of skills and prerequisites.
- Real-time progress tracking, checkpoint milestones, and practical project submissions.

### 💬 4. Collaborative Learning Hub
- **Real-Time Workspace**: Integrated code editor, markdown notes, and shared canvas.
- **Live Peer Sessions**: Integrated WebRTC audio/video calls with screensharing.

### 🏆 5. Verifiable Credentials & Gamification
- **Skill Matrix & Analytics**: Visual radar charts showing skill strengths and growth areas.
- **Blockchain / Cryptographic Badges**: Earn verifiable certificates upon completing milestones.
- **Leaderboards & Streak Tracking**: Gamified rewards to maintain daily learning momentum.

---

## 🏗️ System Architecture

```mermaid
graph TD
    User([User / Learner / Mentor]) -->|HTTPS / WSS| Frontend[React / Next.js Client]
    
    subgraph Frontend Layer
        Frontend --> AuthModule[Auth & User State]
        Frontend --> RoadmapView[Interactive Roadmap Engine]
        Frontend --> LiveCollab[WebRTC & Workspace]
    end

    Frontend -->|REST / GraphQL| API[Node.js / Express Gateway]
    
    subgraph Backend Services
        API --> UserService[User & Skill Matrix Service]
        API --> MatchEngine[Skill Matching Engine]
        API --> AIRoutes[AI Tutor & RAG Pipeline]
    end

    subgraph Data & Storage Layer
        UserService --> PrimaryDB[(PostgreSQL / MongoDB)]
        MatchEngine --> Cache[(Redis Cache)]
        AIRoutes --> VectorDB[(ChromaDB / Pinecone)]
        AIRoutes --> LLM[LLM Service / OpenAI API]
    end
```

---

## 🛠️ Tech Stack

| Domain | Technology | Description |
| --- | --- | --- |
| **Frontend** | React 18, TypeScript, Tailwind CSS, Framer Motion | Modern, responsive, high-performance UI |
| **State Management** | Zustand / Redux Toolkit | Centralized application state |
| **Backend** | Node.js, Express, TypeScript | RESTful APIs & WebSocket handling |
| **Database** | PostgreSQL / MongoDB | User profiles, skill graphs, sessions |
| **Caching & Pub/Sub** | Redis | Session storage & real-time message queuing |
| **Real-Time** | Socket.io, WebRTC | Live chat, screen sharing, collaborative coding |
| **AI / Vector Search**| LangChain, OpenAI API, ChromaDB / Pinecone | Semantic search & RAG-driven AI tutoring |
| **Containerization** | Docker, Docker Compose | Multi-container dev & deployment |

---

## 📁 Project Structure

```text
skillsphere/
├── client/                   # Frontend React Application
│   ├── public/               # Static assets & icons
│   ├── src/
│   │   ├── assets/           # Dynamic assets & styles
│   │   ├── components/       # Reusable UI components (Buttons, Modals, Radar)
│   │   ├── context/          # React Context providers (Auth, Theme)
│   │   ├── hooks/            # Custom React hooks
│   │   ├── pages/            # Page components (Dashboard, Roadmap, Marketplace)
│   │   ├── services/         # API clients (Axios, WebSockets)
│   │   ├── types/            # TypeScript type definitions
│   │   └── utils/            # Helper functions & formatters
│   ├── package.json
│   └── vite.config.ts
│
├── server/                   # Backend Node.js Service
│   ├── src/
│   │   ├── config/           # Database & env configurations
│   │   ├── controllers/      # Route request handlers
│   │   ├── middleware/       # Auth, rate-limiting, error handling
│   │   ├── models/           # DB schemas & models
│   │   ├── routes/           # API Endpoint definitions
│   │   ├── services/         # Business logic & AI/ML integration
│   │   └── index.ts          # Server entry point
│   ├── package.json
│   └── tsconfig.json
│
├── docker-compose.yml        # Docker composition for database & backend services
└── README.md                 # Project documentation
```

---

## ⚙️ Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) (Optional, for running Redis & DB containerized)
- An OpenAI API Key (or alternative LLM provider key)

---

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/skillsphere.git
   cd skillsphere
   ```

2. **Install Frontend Dependencies:**
   ```bash
   cd client
   npm install
   ```

3. **Install Backend Dependencies:**
   ```bash
   cd ../server
   npm install
   ```

---

### Environment Configuration

Create a `.env` file in both `client/` and `server/` directories based on the templates below.

#### Backend `.env` (`server/.env`):
```env
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
DATABASE_URL=postgresql://user:password@localhost:5432/skillsphere
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_super_secret_jwt_key
OPENAI_API_KEY=your_openai_api_key
VECTOR_DB_URL=http://localhost:8000
```

#### Frontend `.env` (`client/.env`):
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

### Running the Application

#### Option A: Running Locally

1. **Start Backend Server:**
   ```bash
   cd server
   npm run dev
   ```

2. **Start Frontend Client:**
   ```bash
   cd client
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`.

#### Option B: Running via Docker Compose

```bash
docker-compose up --build
```

---

## 📡 API Documentation

### Key API Endpoints

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Register new user | ❌ |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT | ❌ |
| `GET` | `/api/users/profile` | Get current user's profile & skill matrix | ✅ |
| `GET` | `/api/match/recommendations` | Get AI-matched mentors/learners | ✅ |
| `POST` | `/api/ai/roadmap` | Generate custom AI learning roadmap | ✅ |
| `POST` | `/api/ai/chat` | Stream response from AI Tutor | ✅ |
| `GET` | `/api/skills/search` | Search skills and categories | ❌ |

---

## 🧠 AI & Recommendation Engine

SkillSphere's intelligence layer operates on three core principles:
1. **Vector Embeddings**: User skill descriptions and learning goals are embedded using OpenAI `text-embedding-3-small` and indexed in a vector store.
2. **Cosine Similarity Search**: Peer matching queries vector proximity between "Skills Offered" and "Skills Sought" vectors.
3. **Retrieval-Augmented Generation (RAG)**: The AI Tutor queries structured learning documentation to provide reliable, non-hallucinated explanations.

---

## 🚢 Deployment Guide

### Deployment Options

- **Frontend**: Deploy `client/` to [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/).
- **Backend**: Deploy `server/` to [Render](https://render.com/), [Railway](https://railway.app/), or [AWS ECS].
- **Database**: Managed PostgreSQL (Supabase / Neon DB) and Redis (Upstash).

---

## 🤝 Contributing

We welcome contributions to SkillSphere! Please follow these steps:

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p center align="center">Made with ❤️ by the SkillSphere Team</p>
