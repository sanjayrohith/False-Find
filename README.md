# 📰 Truth Teller - Fake News Detector

<div align="center">

![Truth Teller](https://img.shields.io/badge/Truth%20Teller-Fake%20News%20Detector-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat-square&logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=flat-square&logo=tailwindcss)

**Separate fact from fiction with our intelligent news verification tool**

[Live Demo](#) • [Features](#-features) • [Installation](#-installation) • [Usage](#-usage)

</div>

---

## 🎯 Overview

**Truth Teller** is a modern web application designed to help users identify potentially misleading or fake news content. With a beautiful newspaper-inspired UI, it analyzes text for common markers of misinformation and provides a detailed verification report.

> *"In an era of information overload, truth matters."*

## ✨ Features

- 🔍 **Smart Analysis** - Detects sensationalist language, credibility markers, and structural patterns
- 📊 **Confidence Scoring** - Provides a percentage-based confidence level for each analysis
- 📜 **Detailed Reports** - Shows specific reasons for the verdict with clear explanations
- 🗂️ **History Tracking** - Keeps a local history of past analyses for reference
- 🌓 **Dark Mode Support** - Beautiful UI that adapts to your system preferences
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- 🎨 **Newspaper Aesthetic** - Unique vintage newspaper-inspired design

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI Framework |
| **TypeScript** | Type Safety |
| **Vite** | Build Tool & Dev Server |
| **Tailwind CSS** | Styling |
| **shadcn/ui** | UI Components |
| **React Router** | Navigation |
| **React Query** | Data Management |
| **Lucide Icons** | Iconography |

## 📦 Installation

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, or pnpm

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/truth-teller.git

# Navigate to the project directory
cd truth-teller

# Install dependencies
npm install
# or
bun install

# Start the development server
npm run dev
# or
bun dev
```

The application will be available at `http://localhost:8080`

## 🚀 Usage

1. **Enter News Content** - Paste a news headline, article excerpt, or any text you want to verify
2. **Analyze** - Click the "Investigate This Story" button to start the analysis
3. **Review Results** - Get a detailed verdict (Verified, Fake, or Uncertain) with:
   - Confidence percentage
   - Detailed reasons for the verdict
   - Visual indicators and stamps

## 📁 Project Structure

```
truth-teller/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── ui/          # shadcn/ui components
│   │   ├── NewsInput.tsx
│   │   ├── VerdictDisplay.tsx
│   │   └── HistoryPanel.tsx
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   ├── pages/           # Page components
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
├── index.html           # HTML template
├── tailwind.config.ts   # Tailwind configuration
├── vite.config.ts       # Vite configuration
└── package.json         # Dependencies
```

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🎨 Customization

### Theming

The application uses CSS variables for theming. You can customize colors in `src/index.css`:

```css
:root {
  --background: 40 30% 96%;
  --foreground: 30 10% 15%;
  --primary: 30 10% 20%;
  /* ... more variables */
}
```

### Analysis Rules

The fake news detection logic can be customized in `src/hooks/useFakeNewsDetector.ts` by modifying:
- `SENSATIONALIST_WORDS` - Words that indicate sensational content
- `CREDIBILITY_PHRASES` - Phrases that indicate credible sourcing

## ⚠️ Disclaimer

This tool is intended for **educational and demonstration purposes only**. It uses heuristic-based analysis and should not be considered a definitive source for fact-checking. Always verify news through multiple reputable sources before sharing.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Made with ❤️ for a more informed world**

*Fighting Misinformation One Story at a Time*

</div>
# False-Find
