# AutoMarketer AI - Agent Guidelines

This file provides essential information for agentic coding agents working in this React + TypeScript Vite project.

## Project Overview
AutoMarketer AI is an AI-powered marketing automation platform built with React 19, TypeScript, and Vite. This is an optimized frontend demo/showcase application featuring a streamlined, high-impact feature set.

## Commands

### Development
```bash
npm run dev          # Start development server on port 3000
npm run start        # Alias for dev
```

### Build & Deployment
```bash
npm run build        # Production build to dist/
npm run preview      # Preview production build
```

### Testing & Linting
⚠️ **No testing framework is currently configured** - consider adding Vitest for unit tests
⚠️ **No linting is currently configured** - consider adding ESLint + Prettier

## Optimized Feature Set

### ✅ ACTIVE FEATURES (High Value)
1. **Dashboard** - Analytics overview with KPI cards and charts
2. **Campaign Manager** - Create and manage marketing campaigns
3. **AI Content Generator** - AI-powered content creation with multiple tones/platforms
4. **Content Calendar** - Visual calendar for scheduling posts across platforms
5. **Template Library** - 50+ proven marketing templates with copy functionality
6. **Lead Management** - Track and score leads
7. **Analytics** - Detailed campaign performance metrics with charts
8. **Settings** - User preferences and account management
9. **Profile** - User profile and account settings

### ❌ REMOVED FEATURES (Low Value)
- ~~Competitor Analysis~~ - Not practical without real API data
- ~~Brand Hub~~ - Too vague, doesn't add value for demo
- ~~AI Chat Assistant~~ - Distracting from core functionality
- ~~Audience Builder~~ - Overlapped with Leads, confusing UX

## File Structure
```
src/
├── components/ui/      # Reusable UI components (Button, Input, Modal, Select)
├── components/layout/  # Layout components (Layout with navigation)
├── contexts/          # React contexts (AuthContext)
├── features/          # Feature-based modules
│   ├── auth/          # Authentication (Login, Register)
│   ├── dashboard/     # Dashboard with analytics overview
│   ├── campaigns/     # Campaign management system
│   ├── content-studio/ # AI content generation
│   ├── calendar/      # Content scheduling calendar
│   ├── templates/     # Marketing template library
│   ├── leads/         # Lead management and scoring
│   ├── analytics/     # Performance analytics and charts
│   ├── settings/      # User settings
│   └── profile/       # User profile
├── services/          # API services (aiService)
├── types/             # TypeScript type definitions
└── index.tsx          # App entry point
```

## Import Conventions
```typescript
// React imports first
import React, { useState, useEffect } from 'react';

// Third-party libraries
import { useNavigate, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// Internal imports with @ alias
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { Platform, Tone } from '@/types';
```

## Navigation Structure

### Sidebar Menu (Simplified)
- **Main**: Dashboard, Campaigns, AI Content
- **Content**: Calendar, Templates
- **Growth**: Leads, Analytics, Settings

### Routes
- `/` - Dashboard
- `/campaigns` - Campaign Manager
- `/generate` - AI Content Generator
- `/calendar` - Content Calendar
- `/templates` - Template Library
- `/leads` - Lead Management
- `/analytics` - Analytics
- `/settings` - Settings
- `/profile` - Profile

## Component Patterns
- Use functional components with TypeScript interfaces
- Default exports for main components, named exports for utilities
- Props interfaces extend HTML element attributes when appropriate
- Use React.FC for components with props

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  ...props
}) => {
  // Component logic
};
```

## TypeScript Conventions
- Use strict TypeScript configuration (ES2022 target)
- Interfaces for object shapes, types for unions/primitives
- Enum for constant sets (Platform, Tone)
- Proper typing for API responses and component props

## CSS & Styling
- Use Tailwind CSS classes for styling
- CSS custom properties for theming (defined in :root)
- Responsive design with mobile-first approach
- Consistent spacing and color tokens
- Dark mode support with `dark:` prefixes

## State Management
- React Context for global state (AuthContext)
- Local useState for component state
- Custom hooks for complex logic
- localStorage for persistence (user authentication)

## Error Handling
- Try-catch blocks for async operations
- Graceful fallbacks for API failures
- User-friendly error messages
- Loading states with disabled buttons

## API Integration
- Singleton pattern for API client (aiService.ts)
- Mock mode for development (controlled by REACT_APP_USE_MOCKS)
- Environment variables for configuration
- Fallback to mock data on API failures

## Environment Variables
```bash
REACT_APP_N8N_WEBHOOK_URL    # Webhook URL for live mode
REACT_APP_USE_MOCKS          # Toggle mock mode (default: true)
HUGGINGFACE_API_TOKEN        # AI service authentication
```

## Development Workflow

### Before Making Changes
1. Read existing components to understand patterns
2. Follow the established file structure
3. Use TypeScript interfaces for all props
4. Ensure responsive design considerations

### Component Creation
1. Create components in appropriate feature directory
2. Export interfaces alongside components
3. Follow naming conventions (PascalCase for components)
4. Include proper TypeScript types
5. Use semantic HTML elements

### Code Organization
- Group related imports
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks
- Use consistent naming patterns
- Add JSDoc comments for complex functions

## Architecture Notes

### Technology Stack
- React 19 with TypeScript
- Vite for build tooling
- React Router DOM for navigation
- Lucide React for icons
- Recharts for data visualization

### Key Patterns
- Feature-based module organization
- Singleton API client with mock fallbacks
- Component composition over inheritance
- Context-based state management

### Integration Points
- Mock data for demo purposes
- AI content generation via aiService
- localStorage for data persistence
- Environment-based configuration

## Testing Recommendations (Not Implemented)
- Consider adding Vitest for unit testing
- Test components with React Testing Library
- Mock API responses in tests
- Test user flows and interactions

## Linting Recommendations (Not Implemented)
- Consider ESLint with TypeScript rules
- Add Prettier for code formatting
- Configure pre-commit hooks
- Use consistent import ordering

## Optimization Notes
- Build size: ~734 kB (after minification)
- 2372 modules transformed successfully
- Frontend-only demo (no backend required)
- Optimized for showcase and presentation
