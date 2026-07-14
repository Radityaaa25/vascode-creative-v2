# Vascode Creative V2

Vascode Creative is a modern single-page application (SPA) landing page for a creative agency & production house. This project serves as a digital storefront to showcase services, portfolios, and provides a direct communication channel for prospective clients.

## 🚀 Features

- **Responsive & Modern Design**: Built with React, Tailwind CSS, and shadcn-ui, offering a premium and smooth user experience with glassmorphism effects and animations.
- **Bilingual Support (EN/ID)**: Full bilingual system for wider audience reach.
- **Lead Generation via WhatsApp**: Direct integration with WhatsApp for each service to convert visitors into clients efficiently.
- **Dynamic Portfolio Showcase**: Interactive portfolio grid with categories and detail modals.
- **Performance Optimized**: Fast load times, responsive images, and optimized animations using Framer Motion.

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript 5
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS + shadcn-ui + Framer Motion
- **State Management & Data**: TanStack React Query 5
- **Routing**: React Router 6
- **Package Manager**: pnpm

## 📦 Project Structure

This project is set up as a monorepo using pnpm workspaces and Turborepo.

```
vascode_V2/
├── apps/                 # Application packages
├── PRD.md                # Product Requirements Document
├── package.json          # Root workspace configuration
├── turbo.json            # Turborepo configuration
└── README.md             # Project documentation
```

## 💻 Getting Started

### Prerequisites
- Node.js (v18+)
- pnpm (v9+)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd vascode_V2
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm run dev
   ```

4. Build for production:
   ```bash
   pnpm run build
   ```

## 🌐 Deployment

This project is configured for deployment on GitHub Pages. The build process creates optimized static assets that can be served easily.

```bash
pnpm run build
```

## 📄 License

This project is private and proprietary to Vascode Creative.
