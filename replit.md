# SHAAD-n-SHIFA E-commerce Platform

## Overview

SHAAD-n-SHIFA is a traditional fashion e-commerce website specializing in kurta collections. The platform allows customers to browse products by category, add items to their cart, and place orders via WhatsApp integration. The application is built as a full-stack web application with a React frontend and Express.js backend, designed to showcase traditional Indian fashion with a modern shopping experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom color scheme reflecting traditional aesthetics (warm oranges, browns, and neutrals)
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Context for cart management, TanStack Query for server state
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **API Design**: RESTful API endpoints for products, orders, and cart operations
- **Development**: TypeScript throughout with ESM modules
- **Process Management**: PM2 for production deployment

### Data Storage Solutions
- **Primary Database**: PostgreSQL for persistent data storage
- **ORM**: Drizzle ORM with Zod schema validation
- **Local Storage**: Browser localStorage for cart persistence
- **Database Schema**: 
  - Users table for authentication
  - Products table with categories, pricing, and inventory
  - Orders table for order management
  - Order items table for order line items

### Authentication and Authorization
- **User Management**: Basic user authentication system with username/password
- **Session Management**: Express sessions with PostgreSQL session store
- **Security**: Prepared statements through ORM to prevent SQL injection

### External Dependencies

#### Database Services
- **Neon Database**: Serverless PostgreSQL hosting platform
- **Connection Pooling**: @neondatabase/serverless for optimized database connections

#### Frontend Libraries
- **UI Framework**: React with extensive Radix UI component ecosystem
- **Styling**: Tailwind CSS with PostCSS for utility-first styling
- **Forms**: React Hook Form with Hookform resolvers for form validation
- **Date Handling**: date-fns for date manipulation and formatting
- **Icons**: Lucide React for consistent iconography

#### Development Tools
- **Build System**: Vite with React plugin and TypeScript support
- **Code Quality**: TypeScript for type safety across the entire stack
- **Development Enhancement**: Replit-specific plugins for development experience
- **Font Loading**: Google Fonts integration (Playfair Display, Inter)

#### Communication Integration
- **WhatsApp Business**: Direct integration for order placement and customer communication
- **Custom WhatsApp Helper**: Utility functions to format cart data and generate WhatsApp messages

#### Deployment Infrastructure
- **Web Server**: Nginx for reverse proxy and static file serving
- **Process Management**: PM2 for application process management and monitoring
- **Server Environment**: Ubuntu Server with Node.js runtime
- **Database Migration**: Drizzle Kit for schema management and migrations