# 🗺️ PlaceSense

<div align="center">

![PlaceSense](https://img.shields.io/badge/PlaceSense-Discover%20Your%20Vibe-6366f1?style=for-the-badge)

**Discover places that match your mood**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](./LICENSE)

[🚀 Live Demo](#) • [📖 Documentation](#features) • [🐛 Report Bug](https://github.com/manishraje28/MoodMap/issues)

</div>

---

## ✨ Overview

PlaceSense is a modern, mood-based place discovery application that helps you find the perfect nearby spot based on how you're feeling. Whether you need a quiet café to work, a romantic restaurant for a date, or a quick bite on the go – PlaceSense has you covered.

### 🎯 Key Highlights

- 🆓 **100% Free** - No paid APIs, no hidden costs
- 🔒 **Privacy First** - Your location stays on your device
- 🌍 **Open Source** - Built with free & open-source tools
- 📱 **Responsive** - Works beautifully on all devices

---

## 🚀 Features

### 🎭 Mood-Based Discovery
Choose from 6 different moods to find places that match your vibe:
- ☕ **Work** - Quiet cafés with WiFi for productivity
- 💕 **Date** - Romantic spots for quality time
- 🍔 **Quick Bite** - Fast and convenient food options
- 💰 **Budget** - Affordable places that save money
- 🧘 **Chill** - Relaxing spots to unwind
- 🎯 **Adventure** - Exciting places to explore

### 🗺️ Interactive Map
- Real-time user location tracking
- Custom markers for places
- Click-to-highlight interaction between cards and markers
- Visual search radius indicator

### 🔍 Smart Search
- Adaptive search radius (auto-expands if few results)
- Fallback category search
- Intelligent scoring based on distance + relevance
- Caching for faster repeated searches

### ⚡ Filters & Sorting
- Sort by: Best Match, Distance, Name
- Max distance slider
- "Open Now" toggle (when data available)

### 🌙 Dark Mode
- System preference detection
- Smooth toggle animation
- Consistent theming throughout

### ♿ Accessibility
- Keyboard navigation support
- ARIA labels and roles
- Focus indicators
- Screen reader friendly

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 14 (App Router) |
| **UI Library** | React 19 |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 |
| **Maps** | Leaflet.js + react-leaflet |
| **Map Tiles** | OpenStreetMap |
| **Places API** | Overpass API (OSM) |
| **Icons** | Lucide React |
| **Theme** | next-themes |

---

## 📁 Project Structure

```
nearby-places/
├── app/
│   ├── components/          # Reusable UI components
│   │   ├── EmptyState.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── FilterPanel.tsx
│   │   ├── Footer.tsx
│   │   ├── HeroSection.tsx
│   │   ├── LocationStatus.tsx
│   │   ├── MapView.tsx
│   │   ├── MapWrapper.tsx
│   │   ├── MoodSelector.tsx
│   │   ├── Navbar.tsx
│   │   ├── PlaceCard.tsx
│   │   ├── PlaceCardSkeleton.tsx
│   │   └── index.ts
│   ├── constants/           # App configuration
│   │   └── index.ts
│   ├── providers/           # React context providers
│   │   └── ThemeProvider.tsx
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/               # Utility functions
│   │   ├── api.ts
│   │   ├── distance.ts
│   │   └── index.ts
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Main page component
├── public/                  # Static assets
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/manishraje28/MoodMap.git
   cd MoodMap/nearby-places
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Production Build

```bash
npm run build
npm start
```

---

## 🌐 Deployment

This app is optimized for deployment on **Vercel**:

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Deploy with one click!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/manishraje28/MoodMap)

---

## 🔧 Configuration

### Environment Variables

No environment variables required! This app uses only free, public APIs.

### Customization

Edit `app/constants/index.ts` to customize:
- Mood configurations (tags, colors, descriptions)
- Search radius settings
- Cache duration
- App metadata

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [OpenStreetMap](https://www.openstreetmap.org/) for map data
- [Overpass API](https://overpass-api.de/) for place queries
- [Leaflet](https://leafletjs.com/) for interactive maps
- [Lucide](https://lucide.dev/) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for styling

---

<div align="center">

Made with ❤️ using free & open-source tools

⭐ Star this repo if you found it helpful!

</div>
