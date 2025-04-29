# Impulse: Real-Time Buyer Psychology Tracker

![Impulse Banner](https://via.placeholder.com/800x150/6366f1/ffffff?text=Impulse+-+Buyer+Psychology+Tracker)

## 📋 Overview

Impulse is a gamified web application that helps business owners visualize customer behavior and emotional triggers driving sales and cart abandonments. The app simulates real retail behavior like a psychology experiment, making data visualization fun, interactive, and insightful.

## ✨ Features

- **Buyer Persona Generator** - Create custom shopper profiles with defined mood, intent, and behavioral traits
- **Interactive Funnel Builder** - Design and customize your sales process with multiple steps and friction points
- **Real-Time Simulations** - Watch animated personas navigate through your funnel with realistic behavior
- **Abandonment Inspector** - Analyze why and where customers drop off with detailed insights
- **Fix & Retry Sandbox** - Test modifications to your funnel and see immediate results
- **Snapshot Generator** - Create shareable insights cards with statistics and recommendations

## 🛠️ Technology Stack

- React 18 with Vite for fast development
- TailwindCSS 3 for styling
- Framer Motion for animations
- Zustand for state management
- Recharts for data visualization
- React Router for navigation
- html2canvas for exporting images

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/KiriManii/impulse.git
cd impulse

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🧪 Usage Guide

1. **Dashboard** - View your personas and funnels at a glance
2. **Create Personas** - Define shopper types with different behaviors and traits
3. **Build Funnels** - Set up your sales process with customizable steps
4. **Run Simulations** - Select a persona and watch how they interact with your funnel
5. **Analyze Results** - Review completion rates and abandonment reasons
6. **Make Improvements** - Use the Fix & Retry Sandbox to optimize conversion rates

## 📁 Project Structure

```
impulse/
├── public/               # Static assets
├── src/
│   ├── components/       # React components
│   │   ├── layout/       # Layout components (Header, Sidebar)
│   │   ├── personas/     # Persona-related components
│   │   ├── funnel/       # Funnel-related components
│   │   ├── insights/     # Analysis components
│   │   └── shared/       # Reusable components
│   ├── hooks/            # Custom React hooks
│   ├── stores/           # Zustand state stores
│   ├── data/             # Default data models
│   ├── utils/            # Utility functions
│   ├── pages/            # Page components
│   ├── App.jsx           # Main App component
│   └── main.jsx          # Entry point
└── README.md             # Project documentation
```

## 🔮 Future Enhancements

- Integration with real e-commerce platforms
- Advanced analytics with ML-based recommendations
- More detailed customer behavior models
- Multi-user collaboration features
- Custom theme options

## 📄 License

MIT License

## 🙏 Credits

Developed by KiriManii