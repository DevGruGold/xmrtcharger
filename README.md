# XMRT Charger - Professional Grade Battery Management

## Project Overview
**XMRT Charger** is an advanced battery monitoring and optimization application that provides professional-grade charging solutions with real-time analytics and Web3 integration.

## URLs
- **Production**: https://lovable.dev/projects/35597a9a-9180-4404-9954-97044476b300
- **GitHub**: https://github.com/DevGruGold/charger-boost-mode

## Features

### Core Battery Management
- **Real-time Battery Monitoring**: Live tracking of battery status, charging state, and power levels
- **Health Score Analytics**: Advanced battery health scoring with degradation level analysis
- **Charging Mode Selection**: Multiple charging modes (turbo, balanced, eco) with optimization
- **Temperature Monitoring**: Real-time temperature gauging and thermal impact analysis
- **Port Quality Detection**: Automatic charging port quality assessment and recommendations

### Advanced Analytics
- **Charging History**: Historical charging data analysis and efficiency tracking
- **Issue Detection**: Automated detection of battery and charging issues
- **Performance Optimization**: AI-powered coaching for optimal charging practices
- **Device-Specific Tips**: Customized recommendations based on device type and usage patterns
- **Efficiency Monitoring**: Real-time charging efficiency calculation and reporting

### Web3 Integration
- **Crypto Donations**: Web3Modal integration for cryptocurrency donations
- **XMRT Token Support**: Native integration with XMRT ecosystem
- **Ethereum Mainnet**: Full Ethereum blockchain connectivity with Wagmi

### User Interface
- **Professional Dashboard**: Clean, modern interface with comprehensive data visualization
- **Mobile Responsive**: Fully responsive design optimized for all device sizes
- **Dark/Light Themes**: Theme switching with system preference detection
- **Interactive Charts**: Real-time charging graphs and performance metrics

## Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: shadcn/ui + Radix UI + Tailwind CSS
- **Web3**: Wagmi + Web3Modal + Viem
- **Backend**: Supabase integration for data persistence
- **Charts**: Recharts for data visualization
- **State Management**: React Query (TanStack Query)

## Data Architecture
- **Battery API**: Browser Battery Status API for real-time monitoring
- **Supabase**: Cloud database for user data and charging history
- **Local Storage**: Client-side caching for performance optimization
- **Web3 Providers**: Ethereum provider integration for blockchain connectivity

## Installation & Development

```bash
# Clone the repository
git clone https://github.com/DevGruGold/charger-boost-mode.git
cd charger-boost-mode

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Setup
Create a `.env` file with the following variables:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_WEB3MODAL_PROJECT_ID=your_web3modal_project_id
```

## User Guide
1. **Connect Device**: Open the app on a supported device with Battery Status API
2. **Monitor Battery**: View real-time battery status and health metrics
3. **Select Charging Mode**: Choose optimal charging mode based on your needs
4. **Follow Recommendations**: Implement AI-powered optimization suggestions
5. **Track History**: Monitor charging patterns and efficiency over time
6. **Web3 Features**: Connect wallet for donations and XMRT ecosystem access

## Browser Compatibility
- Chrome/Chromium-based browsers (full support)
- Firefox (limited Battery API support)
- Safari (WebKit Battery Status API when available)

## Deployment
- **Platform**: Vercel/Netlify recommended for static deployment
- **Status**: ✅ Active Development
- **Last Updated**: October 2025

## Contributing
This project is part of the XMRT ecosystem. For contributions:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request with detailed description

## License
Proprietary - XMRT Ecosystem
