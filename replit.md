# IDSR Frontend Application

## Recent Changes
- **January 8, 2026**: Project replicated from user's ZIP file. Vue 2 + Vuetify 2 application successfully deployed on Replit with all original components, views, and styles.

## Overview

IDSR (IDSRFE) is a Vue.js 2 frontend application for a product catalog and user management system. The application appears to be an e-commerce or inventory management interface for a security products company ("Seguridad Rosario"). It provides product browsing with filtering by brand and category, user management capabilities, and legal pages (privacy policy, terms and conditions).

The frontend communicates with an external backend API hosted at `seguridadrosario.com/IDSRBE` for data operations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Framework
- **Vue.js 2.7.x** - The application uses Vue 2 with the Options API pattern
- **Vue CLI 5.0** - Build tooling and development server configuration
- **Single Page Application (SPA)** - Uses Vue Router in history mode for client-side routing

### UI Component Libraries
- **Vuetify 2.6** - Primary Material Design component framework providing the UI foundation
- **BootstrapVue 2.23** - Secondary component library for additional form components and icons
- Custom CSS styling in `src/assets/css/` for specific component overrides

### State Management
- **Vuex 3.6** - Centralized state management storing:
  - User authentication state (usuario, emailUsuario, adminUser, usuarioId)
  - Product catalog data (productos, marcas, categorias)
  - Filter states (idMarca, idCategoria, idOrden, textSearch)
  - Application configuration (urlService, sucursales)
- **Event Bus** - Simple Vue instance for cross-component communication (`src/store/bus.js`)

### Routing Structure
- `/` - Home page
- `/productos` - Products catalog view
- `/manageUsers` - Admin user management
- `/privacidad` - Privacy policy
- `/terminos` - Terms and conditions

### Date Handling
- **Moment.js** with Vue-Moment plugin for date formatting and manipulation
- **date-fns** available as alternative date utility library

### Notifications
- **Vue-Alertify** - Dialog and notification system for user feedback

### Persistence
- **localStorage** - Used for persisting user session data (usuario, emailUsuario, admin, usuarioId)

### Development Server
- Configured to run on port 5000
- WebSocket configuration for hot module replacement
- Allows all hosts for Replit compatibility

## External Dependencies

### Backend API
- **Primary API**: `https://seguridadrosario.com/IDSRBE`
- The backend appears to be a .NET application (based on localhost:7039 development URL pattern)
- Handles authentication, product data, user management, and business logic

### CDN Resources
- **Google Fonts** - Roboto font family
- **Material Design Icons** - Icon font from jsDelivr CDN

### Key NPM Packages
| Package | Purpose |
|---------|---------|
| vuetify | Material Design UI components |
| bootstrap-vue | Additional UI components |
| vue-router | Client-side routing |
| vuex | State management |
| moment / vue-moment | Date formatting |
| vue-alertify | Notifications/dialogs |
| vue-loading-overlay | Loading indicators |

### Build Requirements
- Node.js compatible with Vue CLI 5.0
- npm for package management
- Run `npm install` then `npm run serve` for development