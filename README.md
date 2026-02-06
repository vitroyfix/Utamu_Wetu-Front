# Utamu Wetu - Organic Grocery Store

A modern, full-stack organic grocery e-commerce platform built with Next.js and Django. Utamu Wetu connects customers with fresh, organic produce and healthy products through an intuitive web interface.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Running the Project](#running-the-project)
- [Deployment](#deployment)
- [API Integration](#api-integration)

---

## 🎯 Project Overview

**Utamu Wetu** is a comprehensive e-commerce platform for organic grocery shopping. The application features a responsive frontend built with Next.js and React, connected to a Django GraphQL backend that manages products, categories, orders, and user accounts.

**Key Highlights:**
- 🌱 Organic product marketplace
- 🛒 Shopping cart functionality
- 💳 Secure checkout process
- 🔍 Advanced product search and filtering
- 📱 Fully responsive design
- 🎨 Modern UI with Tailwind CSS
- 🔐 JWT authentication

---

## ✨ Features

### Customer Features
- **Product Browse** - Explore organic products by category and tags
- **Search Functionality** - Real-time product search with filters
- **Product Details** - Detailed product information with pricing and inventory
- **Shopping Cart** - Add/remove products, manage quantities
- **Checkout** - Multi-step checkout process with order summary
- **User Authentication** - Sign up, login, and account management
- **Wishlist/Favorites** - Save products for later
- **Rewards System** - Track and redeem user rewards

### Admin Features (Backend)
- **Product Management** - Add, edit, delete products
- **Category Management** - Organize products into categories
- **Order Management** - Track and fulfill orders
- **User Management** - Manage customer accounts
- **Analytics** - View sales data and customer insights

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) 16.1.2 - React framework with server-side rendering
- **Language**: [TypeScript](https://www.typescriptlang.org/) 5 - Type-safe JavaScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) 4 - Utility-first CSS framework
- **UI Components**: [Lucide React](https://lucide.dev/) - Beautiful icon library
- **GraphQL Client**: [Apollo Client](https://www.apollographql.com/docs/react/) 4.1 - GraphQL state management
- **Carousel**: [Swiper](https://swiperjs.com/) 12 - Touch slider component

### Backend
- **Framework**: Django - Python web framework
- **API**: Graphene Django - GraphQL API
- **Database**: PostgreSQL - Relational database
- **Authentication**: Django JWT - Token-based auth
- **CORS**: django-cors-headers - Cross-origin support

### DevOps & Deployment
- **Frontend Hosting**: [Vercel](https://vercel.com/) - Serverless Next.js deployment
- **Backend Hosting**: [Render](https://render.com/) - Cloud platform for Django
- **Containerization**: Docker - Application containerization
- **Version Control**: Git

---

## 📁 Project Structure

```
utamu-wetu/
├── src/
│   ├── app/                          # Next.js app directory
│   │   ├── page.tsx                 # Homepage
│   │   ├── layout.tsx               # Root layout wrapper
│   │   ├── globals.css              # Global styles
│   │   ├── cart/
│   │   │   └── page.tsx            # Shopping cart page
│   │   ├── checkout/
│   │   │   └── page.tsx            # Checkout process
│   │   ├── product/
│   │   │   └── [slug]/
│   │   │       └── page.tsx        # Individual product detail page
│   │   └── shop/
│   │       └── page.tsx            # Product listing/shop page
│   │
│   ├── components/                  # Reusable React components
│   │   ├── home/
│   │   │   ├── Hero.tsx            # Main banner/hero section
│   │   │   ├── CategoryBanners.tsx  # Category display cards
│   │   │   ├── PopularProducts.tsx  # Featured products section
│   │   │   ├── DailyBestSells.tsx  # Daily deals section
│   │   │   ├── DealsOfTheDay.tsx   # Time-limited offers
│   │   │   ├── ProductShowcase.tsx  # Product showcase carousel
│   │   │   └── NewsIcon.tsx         # Newsletter signup
│   │   ├── layout/
│   │   │   ├── Navbar.tsx          # Navigation header
│   │   │   └── Footer.tsx          # Footer component
│   │   ├── product/
│   │   │   ├── DailyBestCard.tsx   # Product card component
│   │   │   └── ProductSidebar.tsx   # Product filters/sidebar
│   │   ├── ui/
│   │   │   └── Button.tsx          # Reusable button component
│   │   └── VoucherItem.tsx          # Voucher/discount card
│   │
│   ├── hooks/                       # Custom React hooks
│   │   ├── useStore.ts             # Zustand store management
│   │   └── useUserRewards.ts       # User rewards tracking
│   │
│   ├── lib/                         # Utility functions & config
│   │   ├── apollo-client.ts        # Apollo Client setup (reference)
│   │   ├── ApolloWrapper.tsx       # Apollo Provider wrapper (active)
│   │   ├── mutations.ts            # GraphQL mutations
│   │   ├── queries.ts              # GraphQL queries
│   │   └── searchUtils.ts          # Search functionality helpers
│   │
│   └── types/
│       └── store.ts                # TypeScript type definitions
│
├── public/                          # Static assets
│   ├── favicon.ico
│   └── images/
│
├── .env.local                       # Local dev environment variables
├── .env.production                  # Production environment variables
├── next.config.ts                   # Next.js configuration
├── tailwind.config.ts              # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
├── package.json                     # Dependencies and scripts
├── Dockerfile                       # Docker containerization
├── docker-compose.yml              # Docker compose setup
├── eslint.config.mjs               # ESLint configuration
└── README.md                        # This file
```

### Key File Descriptions

#### `/src/lib/`
- **apollo-client.ts** - Standalone Apollo Client configuration (reference pattern)
- **ApolloWrapper.tsx** - Active Apollo Provider component used in layout
- **queries.ts** - All GraphQL queries (GetCategories, SearchProducts, etc.)
- **mutations.ts** - GraphQL mutations (CreateOrder, AddToCart, etc.)
- **searchUtils.ts** - Helper functions for product search and filtering

#### `/src/components/`
- **Navbar.tsx** - Navigation with search, cart, and user menu
- **Hero.tsx** - Main banner section on homepage
- **PopularProducts.tsx** - Grid of featured products
- **DailyBestSells.tsx** - Carousel of daily best sellers
- **ProductShowcase.tsx** - Dynamic product showcase sections
- **ProductSidebar.tsx** - Filters for category, price, weight, tags

#### `/src/hooks/`
- **useStore.ts** - Global state management for cart, user data
- **useUserRewards.ts** - Hook for managing user loyalty points

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ and npm
- **Python** 3.9+ (for backend development)
- **Git** for version control
- **Docker** (optional, for containerization)

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/your-org/utamu-wetu.git
cd utamu-wetu
```

#### 2. Install Frontend Dependencies
```bash
npm install
```

#### 3. Install Backend Dependencies (if developing locally)
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

---

## 🔧 Environment Configuration

### Frontend Environment Variables

Create `.env.local` for local development:
```dotenv
# Local Development (Django backend at localhost)
NEXT_PUBLIC_GRAPHQL_URI=http://localhost:8000/graphql/
```

Create `.env.production` for production:
```dotenv
# Production (Render backend)
NEXT_PUBLIC_GRAPHQL_URI=https://utamu-wetu-back.onrender.com/graphql/
```

### Vercel Deployment
Set environment variable in [Vercel Dashboard](https://vercel.com/dashboard):
```
Key: NEXT_PUBLIC_GRAPHQL_URI
Value: https://utamu-wetu-back.onrender.com/graphql/
Environments: Production, Preview
```

### Backend Environment Variables (Django)
Create `.env` in your Django backend repository:
```dotenv
DEBUG=False
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1,utamu-wetu-back.onrender.com,utamuwetu-2s377s68z-vitroyfixs-projects.vercel.app
DATABASE_URL=postgresql://user:password@localhost:5432/utamu_wetu
```

---

## 📦 Running the Project

### Development Mode

#### Frontend Only
```bash
npm run dev
```
The app will run at `http://localhost:3000`

#### Frontend + Backend (Docker)
```bash
docker-compose up
```
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

### Production Build

#### Build Frontend
```bash
npm run build
npm start
```

#### Build Backend (Django)
```bash
python manage.py collectstatic
gunicorn core.wsgi:application
```

### Linting
```bash
npm run lint
```

---

## 🔌 API Integration

### GraphQL Endpoints

The frontend communicates with the Django backend via GraphQL at:
- **Development**: `http://localhost:8000/graphql/`
- **Production**: `https://utamu-wetu-back.onrender.com/graphql/`

### Key GraphQL Queries

**Get All Products**
```graphql
query GetProducts {
  allProducts {
    id
    title
    price
    image
    slug
    totalStock
  }
}
```

**Get Product by Slug**
```graphql
query GetProductBySlug($slug: String!) {
  productBySlug(slug: $slug) {
    id
    title
    description
    price
    image
    totalStock
  }
}
```

**Get Categories**
```graphql
query GetCategories {
  allCategories {
    id
    name
    image
    slug
  }
  allWeights {
    id
    value
    unit
  }
  allTags {
    id
    name
  }
}
```

**Search Products**
```graphql
query SearchProducts($searchTerm: String, $categoryName: String) {
  allProducts(search: $searchTerm, categoryName: $categoryName) {
    id
    title
    price
    image
    slug
  }
}
```

### Authentication

The app uses JWT (JSON Web Token) authentication:
1. User logs in via GraphQL mutation
2. Backend returns JWT token
3. Token stored in browser `localStorage`
4. Token automatically included in `Authorization` header for all requests

```typescript
// From ApolloWrapper.tsx
const token = localStorage.getItem("token");
headers: {
  authorization: token ? `JWT ${token}` : "",
}
```

---

## 🌐 Deployment

### Frontend Deployment (Vercel)

The frontend is automatically deployed to Vercel when code is pushed to `main` branch.

**Production URL**: https://utamuwetu-2s377s68z-vitroyfixs-projects.vercel.app

**Steps:**
1. Push code to main branch
2. Vercel auto-detects and builds
3. Preview deployments available for pull requests
4. Production deployment on merge to main

### Backend Deployment (Render)

The backend is deployed on Render with auto-redeploy on git push.

**Production URL**: https://utamu-wetu-back.onrender.com

**Steps:**
1. Push changes to Django repository
2. Render detects webhook and builds
3. Deploys to production automatically
4. Logs available in Render dashboard

### CORS Configuration

For production, ensure Django CORS is configured for your Vercel domain:

```python
# core/settings.py
CORS_ALLOWED_ORIGINS = [
    "https://utamuwetu-2s377s68z-vitroyfixs-projects.vercel.app",
    "http://localhost:3000",
]

CSRF_TRUSTED_ORIGINS = [
    "https://utamuwetu-2s377s68z-vitroyfixs-projects.vercel.app",
    "http://localhost:3000",
]

SECURE_SSL_REDIRECT = True
```

---

## 🐳 Docker Setup

### Build and Run with Docker Compose

```bash
docker-compose up --build
```

This will:
- Start Next.js frontend at port 3000
- Start Django backend at port 8000
- Mount volumes for hot-reloading

### Dockerfile

The project includes a Dockerfile for containerization:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
```

---

## 📊 Project Statistics

| Metric | Value |
|--------|-------|
| Frontend Pages | 5 (Home, Shop, Product Detail, Cart, Checkout) |
| Components | 15+ reusable components |
| Custom Hooks | 2 |
| GraphQL Queries | 5+ |
| GraphQL Mutations | 10+ |
| TypeScript Coverage | ~95% |
| CSS Framework | Tailwind CSS 4 |
| Node Version | 20+ |
| React Version | 19 |
| Next.js Version | 16 |

---

## 🔒 Security Features

- ✅ JWT authentication for secure user sessions
- ✅ HTTPS only communication in production
- ✅ CSRF token protection
- ✅ CORS properly configured
- ✅ Secure cookie settings (HttpOnly, Secure, SameSite)
- ✅ Environment variables for sensitive data
- ✅ Type-safe code with TypeScript

---

## 📱 Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is private and proprietary.

---

## 📞 Support & Contact

For questions or issues, please contact the development team or open an issue in the repository.

---

## 🚀 Roadmap

- [ ] Mobile app version (React Native)
- [ ] Multi-language support (i18n)
- [ ] Advanced analytics dashboard
- [ ] Subscription delivery options
- [ ] Social features (reviews, ratings)
- [ ] Payment gateway integration
- [ ] Inventory management system
- [ ] Email notifications

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Django Documentation](https://docs.djangoproject.com/)
- [GraphQL Documentation](https://graphql.org/learn/)

---

**Built with ❤️ for organic grocery lovers**
