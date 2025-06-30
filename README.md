# Agent Flow - A2A Demo

**A Digital Workbench demonstrating True Agent-to-Agent (A2A) Communication**

## 🎯 Project Overview

Agent Flow is a web application that demonstrates the power of **True Agent-to-Agent (A2A) Communication** through seamless autonomous collaboration between AI agents. Users interact with a single **Orchestrator Agent** and observe as it automatically coordinates with specialized agents (PM, Analyst, Designer) to create comprehensive project documentation.

### Key Innovation
- **Single-point interaction**: Users only need to interact with one Orchestrator Agent
- **Autonomous collaboration**: Watch the magic of A2A happening without human intervention
- **Transparent delegation**: Real-time visualization of task delegation and artifact transfer between agents

## 🚀 Features

### Core Capabilities
- **Orchestrator-Centric Interface**: Single chat interface with visual dashboard for A2A process observation
- **Autonomous A2A Delegation**: Automatic request analysis and task delegation to appropriate specialist agents
- **Transparent A2A Visualization**: Real-time display of delegation, task execution, and artifact transfer
- **Unified Result Synthesis**: Comprehensive final output from all specialist agent contributions
- **Multi-Artifact Generation**: Automated creation of specialized documents (requirements.md, design specs, etc.)

### Specialized Agents
- **PM Agent**: Project management, sprint planning, backlog refinement
- **Analyst Agent**: Business analysis, requirements gathering, technical specifications
- **Designer Agent**: UI/UX design, visual specifications, design system management

## 🛠 Technology Stack

### Frontend
- **Next.js 15.3.4** - React framework with App Router
- **TypeScript** - Type safety and enhanced developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **Zustand** - Lightweight state management

### Development Tools
- **Turbo** - High-performance build system for monorepos
- **ESLint** - Code linting and quality assurance
- **Jest** - Testing framework

### Architecture
- **Monorepo Structure** - Organized with Turbo for scalability
- **Component-based Architecture** - Reusable UI components
- **State Management** - Centralized store for workbench operations

## 📁 Project Structure

```
a2a-demo/
├── apps/
│   └── web/                    # Next.js web application
│       ├── src/
│       │   ├── app/           # App Router pages
│       │   ├── components/    # Reusable UI components
│       │   │   ├── ui/       # Base UI components
│       │   │   └── workbench/ # Workbench-specific components
│       │   ├── lib/          # Utility functions
│       │   └── store/        # State management
│       └── public/           # Static assets
├── docs/                     # Project documentation
│   ├── architecture/         # Technical architecture docs
│   ├── prd/                 # Product requirements
│   ├── project-brief/       # Project overview and planning
│   └── stories/             # User stories and acceptance criteria
└── packages/                # Shared packages (future)
```

## 🚦 Getting Started

### Prerequisites
- **Node.js** 18+ 
- **npm** 10+

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd a2a-demo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server for all apps
- `npm run build` - Build all applications for production
- `npm run lint` - Run ESLint across all packages
- `npm run clean` - Clean build artifacts

## 🎮 How to Use

1. **Start a Session**: Open the application and begin interacting with the Orchestrator Agent
2. **Make a Request**: Describe your project needs in natural language
3. **Observe A2A Magic**: Watch as the Orchestrator automatically:
   - Analyzes your request
   - Delegates tasks to specialist agents
   - Coordinates autonomous collaboration
   - Synthesizes comprehensive results
4. **Review Results**: Receive complete project documentation generated through A2A collaboration

## 📋 MVP Scope

### ✅ Included in MVP
- Single Orchestrator Agent interface
- Autonomous A2A task delegation
- Real-time A2A process visualization
- Unified result synthesis from multiple agents
- Multi-artifact generation capabilities

### ❌ Out of MVP Scope
- Multiple simultaneous agent interactions
- Session persistence and reload
- User account system and authentication
- Advanced workflow customization

## 🎯 Success Metrics

- **Business Goal**: Successfully demonstrate company's AI agentic system capabilities to leadership
- **User Success**: Users can generate complete, well-structured project documentation in a single session (under 15 minutes)

## 🏗 Architecture Highlights

- **Agent-to-Agent Protocol**: Implements or simulates Google's A2A protocol for seamless inter-agent communication
- **Centralized Orchestration**: Single point of control with distributed specialist execution
- **Real-time Visualization**: Transparent view into autonomous agent collaboration
- **Artifact Management**: Structured handling of generated documents and specifications

## 🤝 Contributing

This is a demonstration project showcasing A2A capabilities. For development:

1. Follow the existing code structure and patterns
2. Maintain TypeScript type safety
3. Use the established component architecture
4. Test thoroughly before submitting changes

## 📄 License

This project is private and proprietary.

## 📞 Support

For questions about this demonstration or A2A implementation details, please contact the development team.

---

**Demonstrating the future of AI agent collaboration - where autonomous coordination creates comprehensive results through seamless A2A communication.**