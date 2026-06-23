# 🎬 BenPlayer v1.0

BenPlayer is a high-performance, ultra-lightweight custom video wrapper engine built entirely from scratch. Engineered with a minimal footprint, it drops heavy standard pre-packaged libraries (like Plyr or Video.js) in favor of deep structural control over the native HTML5 Media API, React hooks, and Next.js.

Designed with a sharp, high-contrast **Crimson Red & Dark Cinematic HUD** theme, it provides seamless multi-quality integration completely controlled through URL query parameters—making it perfect for embedding, external iFraming, and stateless streaming deployment on free Vercel hosting.

---

## Key Engineering Features

- **Dynamic Multi-Quality Mesh Architecture:** Resolves, parses, and injects separate resolution tiers (`1080p`, `720p`, `480p`, `360p`) dynamically passed directly via browser URL inputs.
- **YouTube-Style Adaptive Buffer Mapping:** Listens directly to the browser backend HTML5 progress download ticks to paint an elegant transparent gray preload track overlay.
- **Complete Stateless Session Recovery:** Dynamically registers unique local namespaces utilizing cryptographic title slugs inside `LocalStorage` to flawlessly save and resume playback seconds and lock chosen video qualities.
- **Bi-Directional Event Synchronization:** Volume controls loop natively through event emitters (`volumechange`) preventing interface state desynchronization between mixed keyboard adjustments and mouse slider drags.
- **Secure Cross-Origin Layering:** Configured with a protective `no-referrer-when-downgrade` meta mesh layout policy to safely secure payload deliveries from rigid streaming servers.
- **Crash-Proof Edge Cases Management:** Integrated strict state guards tracking `isMetadataLoaded` and finite duration metrics to mathematically prevent runtime element crashes and invalid-state media exceptions.
- **Pro HUD Overlays:** Keyboard shortcut triggers (Space, F, M, Arrows) and screen-split double-click seek zones fire sleek glowing neon indicators mid-screen.

---

## Directory Architecture

```text
src/
├── app/
│   ├── layout.tsx         # Global security layers & configurations
│   ├── page.tsx           # Asynchronous server component parameter extraction
│   └── docs/
│       └── page.tsx       # Live query parameter implementation schema
└── components/
    └── BenPlayer/
        ├── index.tsx      # Core State Machine Engine
        ├── types.ts       # Structural data contract interfaces
        └── Controls/
            ├── ProgressBar.tsx   # Mouse seek calculations & buffer tracking
            └── VolumeControl.tsx # Slider handler and bi-directional mute toggles
```

---

## ⚙️ Getting Started (Local Development)

### 1. Installation

Clone the repository and spin up dependencies natively inside your terminal environment:

```bash
git clone https://github.com/AlsaeedHasan/ben-player.git
cd ben-player
npm install
```

### 2. Run Local Development

Launch the engine on Turbopack local compilers:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) inside your web browser to test.

---

## 📊 Integration Query Schema

To dynamically stream custom payloads without touching source-code lines, append values directly into the pipeline schema using GET standard structures:

```text
http://localhost:3000/?title=Video_Title&url1080=YOUR_LINK&url720=YOUR_LINK
```

- **Documentation Portal:** Access live blueprint parameters at `/docs`.

---

## 🛣️ Roadmap for v2.0 Extensions

- Native **HLS (.m3u8)** and **DASH** chunked processing utilizing raw MSE wrapper modules.
- WebVTT Subtitle custom styled track overlays.
- Dynamic responsive multi-touch swiping zones engineered natively for iOS and Android mobile wrappers.

---

Developed with engineering focus and absolute control by **[Alsaeed Hasan](https://www.linkedin.com/in/alsaeed-hasan)** 🚀

## 📄 License

This project is licensed under the **[MIT License](LICENSE)**.
