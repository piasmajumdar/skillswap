# SkillSwap

SkillSwap is a modern freelance marketplace that connects clients with skilled freelancers. Clients can publish tasks, review proposals, select freelancers, and make payments. Freelancers can discover suitable opportunities, submit proposals, manage accepted projects, deliver their work, and build a public professional profile.

The platform supports three different user roles:

- **Client** — posts tasks, manages proposals, hires freelancers, makes payments, and reviews completed work.
- **Freelancer** — browses available tasks, submits proposals, manages active projects, submits deliverables, and tracks earnings.
- **Administrator** — manages users, monitors platform tasks and payments, and blocks or unblocks user accounts when necessary.

## Live Website

[Visit the live SkillSwap website](https://skillswap-nine-amber.vercel.app/)

## Source Code

- **Client repository:** [piasmajumdar/skillswap](https://github.com/piasmajumdar/skillswap)
- **Server repository:** [piasmajumdar/skillswap-server](https://github.com/piasmajumdar/skillswap-server)

## Main Features

### User authentication and accounts

- Email and password registration and login
- Google social authentication
- Account status and blocked-account handling
- Role-based access for clients, freelancers, and administrators
- Protected dashboard pages and backend API requests
- User profile editing with name, profile image, skills, and biography

### Public marketplace

- Landing page with marketplace highlights and platform statistics
- Browse open freelance tasks
- Search and filter tasks by relevant information
- Browse freelancer profiles
- View freelancer skills, biography, ratings, completed jobs, and reviews
- View individual task and freelancer detail pages
- Responsive marketplace experience for mobile, tablet, and desktop devices

### Client dashboard

- Client dashboard overview with task and project information
- Create new freelance tasks with title, description, category, budget, and deadline
- View, edit, and delete open tasks
- Review proposals submitted for a task
- Reject proposals or select a freelancer
- Pay for accepted proposals through Stripe Checkout
- View payment and task history
- Submit reviews and ratings after project completion

### Freelancer dashboard

- Freelancer dashboard overview
- Browse and submit proposals for open tasks
- Set a proposed budget, estimated delivery time, and cover note
- View submitted proposals and their statuses
- Manage active and completed projects
- Submit project deliverable links
- Track earnings and completed work
- Manage freelancer profile information and skills
- View client reviews and overall ratings

### Administrator dashboard

- View platform statistics and dashboard summaries
- Monitor registered users and their roles
- Block or unblock user accounts
- Review all posted tasks
- Delete eligible open tasks
- Monitor completed payments and transaction information

### Payments and project workflow

- Stripe Checkout integration for secure client payments
- Payment confirmation after returning from Stripe Checkout
- Proposal-to-payment workflow for selected freelancers
- Project status tracking from open to in-progress and completed
- Deliverable submission and project completion flow
- Payment and transaction history for administrative review

## Technology Stack

### Frontend

- Next.js 16 with the App Router
- React 19
- Tailwind CSS
- Better Auth for authentication
- HeroUI components
- Stripe.js for client-side payment integration
- Responsive layouts with light and dark theme support

### Backend and data

- Express.js REST API
- MongoDB database
- Better Auth with MongoDB adapter
- JWT verification for protected API endpoints
- Stripe server integration for checkout and payment confirmation

The backend API is maintained in the companion `skillswap-server` project.

## npm Packages Used

### Production dependencies

| Package | Purpose |
| --- | --- |
| `@better-auth/mongo-adapter` | MongoDB adapter for Better Auth |
| `@heroui/react` | Reusable user interface components |
| `@heroui/styles` | HeroUI styling support |
| `@stripe/stripe-js` | Stripe Checkout client integration |
| `better-auth` | Authentication, sessions, and JWT support |
| `cookie` | Cookie parsing and handling |
| `jsonwebtoken` | JWT utilities |
| `lucide-react` | UI icon library |
| `mongodb` | MongoDB database client |
| `motion` | Animations and transitions |
| `next` | React framework, routing, and server rendering |
| `next-themes` | Light and dark theme management |
| `react` | User interface library |
| `react-dom` | React DOM rendering |
| `react-icons` | Additional icon library |
| `react-toastify` | Toast notifications and feedback messages |
| `stripe` | Stripe server-side API integration |

### Development dependencies

| Package | Purpose |
| --- | --- |
| `@gravity-ui/icons` | Additional development-time icons |
| `@tailwindcss/postcss` | Tailwind CSS PostCSS integration |
| `babel-plugin-react-compiler` | React compiler support |
| `eslint` | JavaScript and React linting |
| `eslint-config-next` | Next.js ESLint rules |
| `tailwindcss` | Utility-first CSS framework |

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm
- A MongoDB database
- Stripe API credentials for payment features
- Google OAuth credentials if Google login is enabled

### Installation

```bash
npm install
```

Create a `.env` file in the project root and configure the required authentication, database, backend, Google OAuth, and Stripe environment variables.

Start the frontend development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

```bash
npm run dev    # Start the development server
npm run build  # Create a production build
npm run start  # Start the production server
npm run lint   # Run ESLint
```
