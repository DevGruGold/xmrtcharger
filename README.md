# XMRT Charger ⚡

> **Professional-Grade Battery Monitoring & Optimization Platform with Real-Time Device Engagement**

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)]()
[![Platform](https://img.shields.io/badge/platform-web-orange.svg)]()

## 🌟 Overview

**XMRT Charger** is a sophisticated battery monitoring and charging optimization platform that combines real-time device analytics, AI-powered drain analysis, and blockchain-based Proof-of-Participation (PoP) rewards. Built for the modern connected ecosystem, it provides professional-grade insights into device battery health, charging patterns, and optimization opportunities.

### Live Application
- **Production URL**: https://xmrtcharger.vercel.app
- **GitHub Repository**: https://github.com/DevGruGold/charger-boost-mode

---

## 🚀 Core Features

### 🔋 Intelligent Battery Monitoring
- **Real-Time Status Tracking**: Live monitoring of battery level, charging state, and power consumption
- **AI-Powered Drain Analysis**: Automatic detection of rapid discharge causes with actionable recommendations
  - CPU pressure monitoring via Compute Pressure API
  - Active media playback detection
  - Long-task identification (>50ms blocking operations)
  - Memory usage tracking
  - Network activity analysis
- **Specific Cause Detection**: Identifies exact drain sources (video playback, high CPU usage, multiple tabs, active downloads, GPU-intensive operations)
- **Confidence Scoring**: High/medium/low confidence ratings for detected issues

### 📊 Advanced Analytics & Health Monitoring
- **Battery Health Score**: Comprehensive health assessment with degradation tracking
- **Charging Efficiency Analysis**: Real-time efficiency calculations based on speed and duration
- **Port Quality Detection**: Automatic assessment of charging port condition
- **Temperature Impact Monitoring**: Thermal analysis and recommendations
- **Historical Trends**: Visual charts showing charging patterns over time
- **Session Tracking**: Detailed logs of all charging sessions with efficiency metrics

### 🎯 Real-Time Device Engagement System

#### Device Connection Monitoring
- **Automatic Connection Tracking**: Detects device connections/disconnections automatically
- **Heartbeat System**: 30-second heartbeat intervals to maintain active session status
- **Device Fingerprinting**: Stable device identification across sessions
- **Session Management**: Full lifecycle tracking (connect → active → disconnect)

#### Activity Logging
- **Comprehensive Event Recording**: Logs all device activities to `device_activity_log`
- **Categories**: Connection, charging, calibration, battery health, system events, user actions, anomalies
- **Severity Levels**: Info, warning, error, critical
- **Metadata Enrichment**: IP address, user agent, device type, browser, OS captured

#### Engagement Commands (Indirect Device Control)
- **Remote Command Issuance**: AI agents can issue commands to connected devices via database flags
- **Command Types**: 
  - `show_notification` - Display user notifications
  - `collect_diagnostics` - Request detailed diagnostic data
  - `optimize_charging` - Trigger charging optimization routines
  - `update_settings` - Modify device-specific settings
- **Priority Levels**: 1-10 priority system for command execution
- **Status Tracking**: pending → sent → acknowledged → executed → completed/failed
- **Expiration Management**: Commands can have TTL for time-sensitive operations

### 🏆 Proof-of-Participation (PoP) System

#### PoP Event Types
- **Charging Session Completed**: Rewards for sustained charging sessions (minimum duration requirements)
- **Calibration Performed**: Bonus points for battery calibration contributions
- **Health Optimization**: Recognition for following optimization recommendations
- **Data Contribution**: Points for sharing battery health data with the ecosystem
- **Anomaly Detection**: Rewards for reporting genuine battery issues

#### PoP Calculation
- **Dynamic Point System**: Based on session duration, efficiency, and battery contribution
- **Confidence Scoring**: 0.0-1.0 confidence level for each event
- **Validation Logic**: Server-side validation prevents gaming/fraud
- **Duplicate Detection**: Prevents double-claiming within configurable time windows
- **Immutable Ledger**: All PoP events stored in append-only ledger table

#### Integration with XMRT-DAO
- **Token Distribution**: PoP points eligible for XMRT token rewards
- **Governance Participation**: PoP score influences voting power in DAO decisions
- **Reputation System**: Long-term PoP accumulation builds user reputation
- **Incentive Alignment**: Rewards genuine participation and ecosystem contribution

### 🌐 Supabase Edge Functions (Real-Time Backend)

#### 1. `monitor-device-connections`
**Purpose**: Tracks device connection lifecycle and manages session state

**Events**:
- `connect`: Initializes new device session, logs IP/device info
- `disconnect`: Closes session, calculates total duration
- `heartbeat`: Updates last_heartbeat timestamp (every 30s)

**Features**:
- Automatic stale session cleanup (>5min without heartbeat)
- Battery level tracking (start/end)
- Session duration calculation
- Activity logging for all connection events

#### 2. `record-battery-data`
**Purpose**: Stores battery readings and calculates health metrics

**Captured Data**:
- Battery level, charging status
- Charging/discharging time remaining
- Charging speed classification
- Temperature impact assessment
- Drain analysis metadata

**Analysis**:
- Recent reading aggregation (last 20 readings)
- Health confidence scoring (low/medium/high based on data volume)
- Average efficiency calculation
- Session count tracking

#### 3. `validate-pop-event`
**Purpose**: Validates and records Proof-of-Participation events

**Validation Rules**:
- Minimum session duration requirements
- Charging efficiency thresholds
- Duplicate event detection (configurable time windows)
- Confidence score calculation based on event type and metrics

**Point Calculation**:
```typescript
// Base formula
base_points = duration_minutes / 10.0
efficiency_multiplier = clamp(efficiency / 100, 0.8, 1.2)
duration_multiplier = clamp(1.0 + (duration - 30) / 120, 1.0, 1.5)
pop_points = (base_points * efficiency_multiplier * duration_multiplier) + battery_contribution
```

#### 4. `aggregate-device-metrics`
**Purpose**: Generates hourly/daily metric summaries for dashboards

**Aggregated Metrics**:
- Active device count
- Total connections/disconnections
- Charging session count
- Total PoP points earned
- Anomaly detection count
- Commands issued/executed
- Average session duration
- Average charging efficiency

**Output**: Stored in `device_metrics_summary` for dashboard visualization

### 🎨 Charging Optimization
- **Multiple Charging Modes**:
  - 🚀 **Turbo Mode**: Maximum charging speed with active cooling
  - ⚖️ **Balanced Mode**: Optimal balance of speed and battery health
  - 🌱 **Eco Mode**: Battery longevity prioritized over speed
- **AI Optimization Coach**: Step-by-step guidance for optimal charging practices
- **Device-Specific Recommendations**: Customized tips based on device type (phone, tablet, laptop)
- **Dynamic Task System**: Interactive checklist for optimization implementation

### 🔗 Web3 Integration
- **Crypto Donations**: WalletConnect v2 integration for cryptocurrency donations
- **XMRT Token Support**: Native integration with XMRT ecosystem
- **Ethereum Mainnet**: Full blockchain connectivity via Wagmi + Viem
- **Multi-Wallet Support**: MetaMask, WalletConnect, Coinbase Wallet, Rainbow

---

## 🏗️ Technical Architecture

### Frontend Stack
```
React 18.3.1          → Modern React with hooks and concurrent features
TypeScript 5.x        → Type-safe development
Vite 5.x              → Lightning-fast build tool and dev server
Tailwind CSS 3.x      → Utility-first styling with custom design system
shadcn/ui             → High-quality accessible UI components
Radix UI              → Unstyled, accessible component primitives
Recharts              → Powerful charting library for data visualization
```

### Backend Infrastructure
```
Supabase PostgreSQL   → Primary database with RLS security
Supabase Edge Functions → Serverless Deno runtime for backend logic
Supabase Realtime     → WebSocket-based real-time subscriptions
```

### Web3 Libraries
```
Wagmi 1.4.x           → React hooks for Ethereum
Viem 1.21.x           → TypeScript Ethereum library
Web3Modal 2.7.x       → Beautiful wallet connection UI
```

### Browser APIs
```
Battery Status API    → Real-time battery monitoring
Compute Pressure API  → CPU load detection (Chrome 115+)
Performance Observer  → Long task and resource monitoring
Media Session API     → Active media playback detection
Page Visibility API   → Tab activity tracking
```

---

## 🗄️ Database Schema

### Core Tables

#### `devices`
Unique device records identified by stable fingerprint
```sql
- id: uuid (PK)
- device_fingerprint: text (unique)
- device_type: text (phone|tablet|pc|unknown)
- os: text
- browser: text
- worker_id: text (optional)
- wallet_address: text (optional)
- session_keys: text[]
- first_seen_at: timestamptz
- last_seen_at: timestamptz
- is_active: boolean
- metadata: jsonb
```

#### `device_connection_sessions`
Active/historical connection sessions
```sql
- id: uuid (PK)
- device_id: uuid (FK → devices)
- session_key: text (unique per session)
- connected_at: timestamptz
- disconnected_at: timestamptz (nullable)
- is_active: boolean
- last_heartbeat: timestamptz
- battery_level_start: integer
- battery_level_end: integer (nullable)
- total_duration_seconds: integer (nullable)
- charging_sessions_count: integer
- commands_received: integer
- commands_executed: integer
- ip_address: inet
- user_agent: text
- app_version: text
- metadata: jsonb
```

#### `device_activity_log`
Comprehensive activity event logging
```sql
- id: uuid (PK)
- device_id: uuid (FK → devices)
- session_id: uuid (FK → device_connection_sessions, nullable)
- occurred_at: timestamptz
- category: activity_category (enum)
  - connection, charging, calibration, battery_health, 
    system_event, user_action, anomaly
- activity_type: text
- severity: activity_severity (enum)
  - info, warning, error, critical
- description: text
- details: jsonb
- user_id: text (nullable)
- wallet_address: text (nullable)
- is_anomaly: boolean
- is_pop_eligible: boolean
- pop_points: numeric
- tags: text[]
- metadata: jsonb
```

#### `engagement_commands`
Indirect device command/control system
```sql
- id: uuid (PK)
- device_id: uuid (FK → devices, nullable)
- session_id: uuid (FK → device_connection_sessions, nullable)
- target_all: boolean
- command_type: command_type (enum)
  - show_notification, collect_diagnostics, 
    optimize_charging, update_settings
- command_payload: jsonb
- priority: integer (1-10)
- status: command_status (enum)
  - pending, sent, acknowledged, executed, failed, expired
- issued_by: text (e.g., 'eliza', 'system')
- issued_at: timestamptz
- sent_at: timestamptz (nullable)
- acknowledged_at: timestamptz (nullable)
- executed_at: timestamptz (nullable)
- expires_at: timestamptz (nullable)
- execution_result: jsonb (nullable)
- error_message: text (nullable)
- metadata: jsonb
```

#### `pop_events_ledger`
Immutable Proof-of-Participation ledger
```sql
- id: uuid (PK)
- device_id: uuid (FK → devices)
- session_id: uuid (FK → device_connection_sessions, nullable)
- user_id: text (nullable)
- wallet_address: text (nullable)
- event_type: pop_event_type (enum)
  - charging_session_completed, calibration_performed,
    health_optimization, data_contribution, anomaly_detection
- occurred_at: timestamptz
- pop_points: numeric
- confidence_score: real (0.0-1.0)
- validation_status: validation_status (enum)
  - pending, validated, rejected
- event_data: jsonb
- validator: text (nullable)
- validated_at: timestamptz (nullable)
- metadata: jsonb
- created_at: timestamptz (immutable)
```

#### `battery_readings`
Time-series battery telemetry data
```sql
- id: uuid (PK)
- device_id: uuid (FK → devices)
- session_id: uuid (FK → device_connection_sessions)
- timestamp: timestamptz
- battery_level: integer (0-100)
- is_charging: boolean
- charging_time_remaining: integer (seconds, nullable)
- discharging_time_remaining: integer (seconds, nullable)
- charging_speed: text (nullable)
- temperature_impact: text (nullable)
- metadata: jsonb (includes drain_analysis)
```

#### `charging_sessions`
Completed charging session records
```sql
- id: uuid (PK)
- device_id: uuid (FK → devices)
- session_id: uuid (FK → device_connection_sessions, nullable)
- started_at: timestamptz
- ended_at: timestamptz (nullable)
- start_level: integer
- end_level: integer (nullable)
- duration_seconds: integer (nullable)
- charging_speed: text (nullable)
- efficiency_score: integer (nullable)
- optimization_mode: text (nullable)
- port_quality: text (nullable)
- metadata: jsonb
```

#### `device_metrics_summary`
Aggregated hourly/daily metrics for dashboards
```sql
- id: uuid (PK)
- summary_date: date
- summary_hour: integer (nullable, 0-23 for hourly)
- active_devices_count: integer
- total_connections: integer
- total_charging_sessions: integer
- total_pop_points_earned: numeric
- total_anomalies_detected: integer
- total_commands_issued: integer
- total_commands_executed: integer
- avg_session_duration_seconds: numeric
- avg_charging_efficiency: numeric
- top_event_types: text[]
- top_device_ids: uuid[]
- detailed_metrics: jsonb
```

### SQL Functions

#### `calculate_charging_pop_points(duration_minutes, efficiency, battery_contribution)`
Calculates PoP points for charging sessions using the formula:
```
base_points = duration_minutes / 10.0
efficiency_multiplier = clamp(efficiency / 100, 0.8, 1.2)
duration_multiplier = clamp(1.0 + (duration - 30) / 120, 1.0, 1.5)
RETURN (base_points * efficiency_multiplier * duration_multiplier) + battery_contribution
```

#### `disconnect_device_session(session_id)`
Helper function to gracefully close a device session with duration calculation

#### `update_session_heartbeat(session_id)`
Updates last_heartbeat timestamp for active session monitoring

### Database Views

#### `active_devices_view`
Real-time view of currently connected devices with enriched metadata

#### `pop_leaderboard_view`
Ranked view of top PoP earners (by device, user, wallet)

#### `recent_activity_dashboard`
Recent activity events optimized for dashboard rendering

---

## 🚀 Getting Started

### Prerequisites
```bash
Node.js >= 18.x
npm >= 9.x
```

### Installation

```bash
# Clone repository
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

### Environment Configuration

Create a `.env` file in the project root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Web3Modal Configuration
VITE_WEB3MODAL_PROJECT_ID=your-walletconnect-project-id

# Optional: Custom Configuration
VITE_APP_VERSION=1.0.0
VITE_ENABLE_ANALYTICS=true
```

### Supabase Setup

1. **Create a Supabase Project**: https://supabase.com/dashboard
2. **Run Migrations**: Execute SQL migrations from `supabase/migrations/`
3. **Deploy Edge Functions**: Functions are auto-deployed via Supabase CLI
4. **Configure RLS Policies**: Review and enable Row-Level Security policies
5. **Set Secrets**: Add required secrets in Supabase Dashboard → Project Settings → Edge Functions

### Web3Modal Setup

1. Create a project at https://cloud.walletconnect.com/
2. Copy your Project ID to `.env` as `VITE_WEB3MODAL_PROJECT_ID`

---

## 📱 Browser Compatibility

### Full Support (Battery Status API)
- ✅ Google Chrome 38+ / Chromium
- ✅ Microsoft Edge 79+ (Chromium-based)
- ✅ Opera 25+
- ✅ Samsung Internet 4.0+

### Partial Support
- ⚠️ Firefox (Battery API removed for privacy reasons in v52+)
- ⚠️ Safari (No Battery Status API support)

### Fallback Experience
When Battery Status API is unavailable, the app provides:
- Device detection and optimization tips
- Browser compatibility guidance
- Educational content on battery health
- Manual charging mode selection

---

## 🎯 Usage Guide

### For End Users

1. **Connect Your Device**
   - Open https://xmrtcharger.vercel.app on a supported browser
   - The app automatically detects and registers your device
   - Heartbeat system maintains active connection

2. **Monitor Battery Health**
   - View real-time battery status on the Monitor tab
   - Check health score and degradation level
   - Review charging efficiency and port quality

3. **Optimize Charging**
   - Navigate to Optimize tab
   - Select charging mode (Turbo/Balanced/Eco)
   - Follow AI coach recommendations
   - Complete optimization tasks for best results

4. **View Device-Specific Tips**
   - Switch to Tips tab
   - Review customized recommendations for your device type
   - Implement battery longevity best practices

5. **Track History**
   - Access Health tab to see historical trends
   - Review past charging sessions
   - Monitor efficiency improvements over time

6. **Earn PoP Rewards**
   - Complete charging sessions (minimum 10 minutes)
   - Perform battery calibrations
   - Follow optimization recommendations
   - PoP points are automatically calculated and recorded
   - Connect wallet to link PoP with your XMRT-DAO identity

### For Developers / Integrators

#### Accessing Device Connection Data
```typescript
import { supabase } from '@/integrations/supabase/client';

// Get active devices
const { data: activeDevices } = await supabase
  .from('active_devices_view')
  .select('*');

// Subscribe to real-time connection changes
const channel = supabase
  .channel('device-connections')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'device_connection_sessions'
  }, (payload) => {
    console.log('Connection event:', payload);
  })
  .subscribe();
```

#### Issuing Engagement Commands
```typescript
// Call the edge function to issue a command
const { data, error } = await supabase.functions.invoke('issue-engagement-command', {
  body: {
    deviceId: 'device-uuid-here', // or targetAll: true
    commandType: 'show_notification',
    commandPayload: {
      title: 'Charging Complete',
      message: 'Your device is fully charged. Unplug to preserve battery health.',
      priority: 'high'
    },
    priority: 8,
    expiresInMinutes: 5,
    issuedBy: 'system'
  }
});
```

#### Validating PoP Events
```typescript
// Validate a PoP event
const { data, error } = await supabase.functions.invoke('validate-pop-event', {
  body: {
    deviceId: 'device-uuid',
    sessionId: 'session-uuid',
    eventType: 'charging_session_completed',
    eventData: {
      duration_minutes: 45,
      start_level: 25,
      end_level: 95,
      efficiency: 88,
      charging_speed: 'fast'
    },
    userId: 'user-id-optional',
    walletAddress: '0x...' // optional
  }
});

console.log('PoP points earned:', data.popPoints);
```

---

## 🔐 Security Considerations

### Row-Level Security (RLS)
All Supabase tables have RLS policies enabled:
- Public read access for dashboards and leaderboards
- Service role access required for sensitive operations
- User-specific data isolation where applicable

### Edge Function Security
- JWT verification disabled for public-facing endpoints (monitor-device-connections, validate-pop-event)
- Service role key used for internal database operations
- Input validation and sanitization on all endpoints
- Rate limiting recommended for production deployments

### Client-Side Security
- No sensitive API keys exposed in frontend code
- Environment variables used for all external service credentials
- CORS policies configured for Supabase and edge functions

---

## 📊 Performance Benchmarks

### Frontend Performance
- **First Contentful Paint (FCP)**: <1.2s
- **Time to Interactive (TTI)**: <2.5s
- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)

### Edge Function Performance
- **Cold Start**: ~150ms
- **Warm Execution**: ~20-50ms
- **Database Query Latency**: <100ms (average)

### Real-Time Monitoring
- **Heartbeat Interval**: 30 seconds
- **Activity Log Latency**: <500ms
- **Battery Reading Frequency**: Every 2 minutes (configurable)

---

## 🛣️ Roadmap

### Phase 1: ✅ Core Infrastructure (Completed)
- [x] Real-time battery monitoring
- [x] Device connection tracking
- [x] Edge function architecture
- [x] PoP system implementation
- [x] Engagement command system

### Phase 2: 🚧 Enhanced Analytics (In Progress)
- [ ] Machine learning-based discharge prediction
- [ ] Advanced anomaly detection algorithms
- [ ] Predictive battery health modeling
- [ ] Cross-device correlation analysis

### Phase 3: 📅 Ecosystem Integration (Planned)
- [ ] XMRT-DAO governance voting integration
- [ ] Token distribution automation based on PoP
- [ ] Multi-chain support (Polygon, Arbitrum)
- [ ] NFT badges for achievement milestones

### Phase 4: 📅 Mobile Apps (Future)
- [ ] Native iOS app (Swift/SwiftUI)
- [ ] Native Android app (Kotlin/Jetpack Compose)
- [ ] React Native cross-platform option

---

## 🤝 Contributing

We welcome contributions from the community! Please follow these guidelines:

1. **Fork the Repository**
2. **Create a Feature Branch**: `git checkout -b feature/amazing-feature`
3. **Commit Changes**: `git commit -m 'Add amazing feature'`
4. **Push to Branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request** with detailed description

### Development Guidelines
- Follow TypeScript best practices
- Maintain 80%+ test coverage for new features
- Use semantic commit messages
- Update documentation for API changes

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Supabase** for providing the backend infrastructure
- **WalletConnect** for Web3 connectivity
- **shadcn/ui** for beautiful, accessible components
- **XMRT Community** for ongoing support and feedback

---

## 📞 Support & Contact

- **Documentation**: https://docs.xmrt.dev (coming soon)
- **GitHub Issues**: https://github.com/DevGruGold/charger-boost-mode/issues
- **Twitter**: [@XMRT_Official](https://twitter.com/XMRT_Official)
- **Discord**: [Join XMRT Community](https://discord.gg/xmrt)

---

<div align="center">

**Built with ❤️ by the XMRT Ecosystem**

*Empowering connected devices through real-time monitoring and proof-of-participation*

[Website](https://xmrtcharger.vercel.app) • [Documentation](https://docs.xmrt.dev) • [Twitter](https://twitter.com/XMRT_Official) • [Discord](https://discord.gg/xmrt)

</div>
