# Invoker Simulator 🔮

A highly-polished, 3D interactive web-based simulator and training game for the Dota 2 hero **Invoker**. Built to help players master their spell-casting muscle memory through immersive visual and audio feedback, wrapped in a premium modern UI.

![Invoker Simulator - Gameplay](public/asset/screenshots/Screenshot%202026-06-22%20212602.png)
![Invoker Simulator - Pose Configurator](public/asset/screenshots/Screenshot%202026-06-22%20212651.png)
## 🚀 Features

### 🎮 Multiple Game Modes
- **Practice Mode**: A relaxed environment to learn spell combinations at your own pace.
- **Challenge Mode**: A progressive difficulty ladder (Easy, Normal, Hard, Invoker) featuring combo scaling, randomized targeting, and a strict lives system.
- **Time Trial**: A high-octane race against the clock to see how many spells you can correctly invoke in 60 seconds.

### 🎭 3D Interactive WebGL Engine
Built on top of `Three.js` and `@react-three/fiber`, the game features a fully rigged 3D Invoker model right in your browser:
- **Head Tracking**: Invoker's head dynamically follows your mouse cursor across the screen.
- **Procedural Physics**: His 24-bone cape utilizes procedural sine-wave math to simulate cloth inertia and cascading momentum as he breathes and casts.
- **Stutter-Free Orb Rendering**: Optimized WebGL lighting engine that scales Quas, Wex, and Exort orbs seamlessly without triggering expensive shader recompilation lag spikes, allowing buttery-smooth performance even on lower-end devices.

### 🦴 Custom Pose Configurator Lab
Navigate to the `/config` route to unlock the **Pose Configurator Lab**. This developer tool allows you to:
- Individually manipulate 3D bone rotations (Spine, Head, Arms, Forearms, Wrists, and all 10 multi-jointed fingers).
- Preview animations and model offsets in real-time.
- Easily extract your perfectly crafted poses using the built-in "Copy Config" clipboard functionality.

### ⚙️ Customizable Settings
- **Persistent Keybinds**: Fully rebindable keys for Quas (Q), Wex (W), Exort (E), Invoke (R), and cast slots (D, F) powered by `zustand` local storage persistence.
- **Volume Control**: Integrated `howler.js` soundboard for authentic Dota 2 spell effects and voice lines, complete with adjustable volume sliders.

### 💎 Premium Glassmorphic UI
- Designed using **Tailwind CSS** with state-of-the-art visual aesthetics.
- Features heavy backdrop-blurs, vibrant dynamic gradient shadows, custom scrolling containers, and buttery CSS micro-animations that make the interface feel alive.

## 🛠️ Tech Stack

- **Framework**: React 18 (TypeScript)
- **3D Rendering**: Three.js, React Three Fiber, React Three Drei
- **State Management**: Zustand (with persist middleware)
- **Styling**: Tailwind CSS + Custom CSS Modules
- **Audio Engine**: Howler.js
- **Keybinding**: react-hotkeys-hook

## 💻 Getting Started

### Prerequisites
Make sure you have Node.js and npm installed on your machine.

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/invoker-game.git
cd invoker-game
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite).

## 🚀 Deployment
This project is fully optimized for production builds. To create a production-ready bundle:

```bash
npm run build
```
The output will be generated in the `dist` folder, ready to be hosted on Vercel, Netlify, or any static hosting service.

## 🤝 Contributing
Contributions, issues, and feature requests are always welcome! Feel free to check the issues page if you want to contribute.

## 📝 License
This project is purely for educational/training purposes. Dota 2, Invoker, and all related audio/visual assets are the property of Valve Corporation.
