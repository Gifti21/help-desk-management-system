# Help Desk Management System - Project Structure Guide

Welcome! This guide will help you understand where to write code in the Help Desk Management System. Think of this project like a house - each folder is a room with a specific purpose.

## 🏠 What is a Project Structure?

A project structure is how we organize files in a coding project. Just like you organize your computer with folders for documents, pictures, and music, we organize code files so they're easy to find and work with.

---

## 📁 Root Directory Structure (The Main Rooms)

```
help-desk-management-system/
├── app/                    # 🖥️ Frontend pages and Backend API routes
├── components/             # 🧩 Reusable UI building blocks
├── prisma/                 # 🗄️ Database design and setup
├── public/                 # 🖼️ Images, icons, and static files
├── lib/                    # 🛠️ Helper tools and configurations
├── types/                  # 📝 TypeScript type definitions
├── hooks/                  # 🎣 Custom React hooks (empty - for you to add)
├── utils/                  # 🔧 Utility functions (empty - for you to add)
├── services/               # 🏢 Business logic (empty - for you to add)
├── constants/              # 📋 Fixed values (empty - for you to add)
├── .env                    # 🔒 Secret settings (database password, etc.)
├── .env.example            # 📄 Example of what .env should contain
├── package.json            # 📦 List of tools and libraries we use
├── tsconfig.json           # ⚙️ TypeScript settings
├── next.config.ts          # ⚙️ Next.js settings
└── README.md               # 📖 Project documentation
```

### What Each Folder Does (In Simple Terms):

- **app/**: This is where most of your code goes. It contains both the pages users see (frontend) and the code that talks to the database (backend/API).
- **components/**: Reusable pieces of UI like buttons, forms, cards. Think of these as LEGO blocks you can use anywhere.
- **prisma/**: This is where we define what our database looks like - what tables exist, what columns they have, etc.
- **public/**: Static files like images, logos, icons that don't change.
- **lib/**: Important helper files that connect to the database and handle authentication.
- **types/**: TypeScript definitions - these help prevent errors by telling the computer what kind of data to expect.
- **hooks/, utils/, services/, constants/**: Currently empty folders where you'll add your own helper code as the project grows.
- **.env**: A secret file that contains sensitive information like database passwords. NEVER share this file!
 
---
 
## 🚀 App Directory (Where Most of Your Code Goes)

The `app/` folder is the most important folder. It's where you'll write most of your code. It contains:

- **Frontend**: The pages users see in their browser (like the dashboard, ticket list, login page)
- **Backend**: The API routes that handle data (like creating tickets, getting user info)

### What's Inside the App Folder:

```
app/
├── api/                    # 🔌 Backend API routes (data handling)
│   ├── auth/              # 🔐 Login/logout functionality
│   ├── tickets/           # 🎫 Ticket creation and management
│   ├── users/             # 👥 User management
│   ├── departments/       # 🏢 Department management
│   └── categories/        # 📂 Category management
├── layout.tsx             # 🎨 Main layout (header, footer, etc.)
├── page.tsx               # 🏠 Home page (what users see first)
├── globals.css            # 🎨 Global styles (colors, fonts)
└── favicon.ico            # 🖼️ Browser tab icon
```

### How to Create New Pages (Frontend):

**What is a page?** A page is what users see in their browser - like the login page, dashboard, or ticket list.

**How to create a page:**
1. Create a new folder inside `app/` (for example: `app/dashboard/`)
2. Inside that folder, create a file named `page.tsx`
3. Write your React code in `page.tsx`

**Example:**
- Create folder: `app/dashboard/`
- Create file: `app/dashboard/page.tsx`
- Users can now visit: `http://localhost:3000/dashboard`

**Optional:** You can also add a `layout.tsx` file in the same folder if you want a special layout for just that page (like a sidebar that only appears on the dashboard).
 
---
 
## 🔌 API Routes (Backend - Data Handling)

**What is an API route?** An API route is like a waiter in a restaurant. The frontend (customer) asks for data, and the API route (waiter) goes to the database (kitchen), gets the data, and brings it back.

All API routes are in `app/api/`. This is where the backend code lives.

### Current API Routes (Already Created):

#### 1. Authentication (`app/api/auth/[...nextauth]/route.ts`)
- **What it does:** Handles login, logout, and keeps users logged in
- **Status:** Already implemented - you don't need to change this
- **Note:** Uses NextAuth.js library for authentication

#### 2. Tickets (`app/api/tickets/`)
```
tickets/
├── route.ts              # List all tickets OR create a new ticket
└── [id]/
    ├── route.ts          # Get one ticket, update it, or delete it
    └── comments/
        └── route.ts      # Get comments OR add a new comment
```
- **What you'll write here:** Code to create tickets, update ticket status, assign tickets to technicians

#### 3. Users (`app/api/users/`)
```
users/
├── route.ts              # List all users OR create a new user
└── [id]/
    └── route.ts          # Get one user, update them, or delete them
```
- **What you'll write here:** Code to manage users, change their roles (employee, technician, admin)

#### 4. Departments (`app/api/departments/`)
```
departments/
├── route.ts              # List all departments OR create a new department
└── [id]/
    └── route.ts          # Get one department, update it, or delete it
```
- **What you'll write here:** Code to manage departments (IT, HR, Finance, etc.)

#### 5. Categories (`app/api/categories/`)
```
categories/
├── route.ts              # List all categories OR create a new category
└── [id]/
    └── route.ts          # Get one category, update it, or delete it
```
- **What you'll write here:** Code to manage ticket categories (Software, Hardware, Printer, etc.)

### How to Create a New API Route:

**Step 1:** Create a folder in `app/api/` (for example: `app/api/reports/`)

**Step 2:** Create a file named `route.ts` inside that folder

**Step 3:** Write your code using this template:

```typescript
// app/api/your-resource/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET request - used to fetch data
export async function GET(request: NextRequest) {
  try {
    // Example: Get all items from database
    const items = await prisma.yourModel.findMany();
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

// POST request - used to create new data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Example: Create a new item
    const newItem = await prisma.yourModel.create({
      data: body
    });
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
```

**Common HTTP Methods:**
- **GET**: Fetch data (like reading a book)
- **POST**: Create new data (like writing a new page)
- **PUT**: Update existing data (like editing a page)
- **DELETE**: Remove data (like tearing out a page)
 
---
 
## 🎨 Components Directory (Reusable UI Building Blocks)

**What is a component?** A component is like a LEGO block. It's a piece of UI (like a button, form, or card) that you can reuse in different places. Instead of writing the same code over and over, you create a component once and use it wherever you need it.

### Component Folder Structure:

```
components/
├── dashboard/            # 📊 Dashboard-specific widgets and cards
├── forms/               # 📝 Form components (login, create ticket, etc.)
├── layout/              # 🏗️ Layout components (header, sidebar, footer)
└── ui/                  # 🧩 Basic UI building blocks (button, input, card)
```

### Where to Put Your Components:

#### 1. UI Components (`components/ui/`)
- **What goes here:** Basic building blocks like buttons, inputs, cards, modals
- **When to use here:** When you need a simple UI element that could be used anywhere in the app
- **Examples:** `Button.tsx`, `Input.tsx`, `Card.tsx`, `Modal.tsx`

#### 2. Form Components (`components/forms/`)
- **What goes here:** Complete forms that users fill out
- **When to use here:** When you're creating or modifying a form
- **Examples:** `CreateTicketForm.tsx`, `LoginForm.tsx`, `EditUserForm.tsx`

#### 3. Dashboard Components (`components/dashboard/`)
- **What goes here:** Special widgets and cards for the dashboard
- **When to use here:** When you're building dashboard features
- **Examples:** `TicketList.tsx`, `StatsCard.tsx`, `TicketCard.tsx`, `Chart.tsx`

#### 4. Layout Components (`components/layout/`)
- **What goes here:** Navigation, header, sidebar, footer
- **When to use here:** When you're working on the overall page layout
- **Examples:** `Header.tsx`, `Sidebar.tsx`, `Footer.tsx`, `Navbar.tsx`

### How to Create a Component:

**Step 1:** Choose the right folder based on what you're building

**Step 2:** Create a file with a descriptive name (use PascalCase - capitalize each word)

**Step 3:** Write your React component using this template:

```typescript
// components/ui/Button.tsx
export default function Button({ children, onClick, type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      {children}
    </button>
  );
}
```

**Step 4:** Use your component in any page:

```typescript
// app/dashboard/page.tsx
import Button from '@/components/ui/Button';

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Button onClick={() => alert('Clicked!')}>Click Me</Button>
    </div>
  );
}
```
 
---
 
## 🗄️ Database (Prisma - Where Data Lives)

**What is Prisma?** Prisma is a tool that helps us work with the database. Think of it as a translator - you write code in a simple way, and Prisma translates it into database language.

**What is the database?** The database is like a giant Excel spreadsheet that stores all the application data (users, tickets, comments, etc.).

### Database Folder Structure:

```
prisma/
├── schema.prisma        # 📋 The blueprint of your database (tables, columns, etc.)
└── migrations/          # 📜 History of all changes made to the database
```

### Current Database Tables (Already Created):

- **User**: Stores employee information (name, email, password, role)
- **Department**: Stores company departments (IT, HR, Finance, etc.)
- **Category**: Stores ticket categories (Software, Hardware, Printer, etc.)
- **Ticket**: Stores support tickets (title, description, status, priority)
- **Comment**: Stores ticket comments and conversations

### Special Values (Enums):

**Enums** are like dropdown menus with fixed options:

- **Role** (User types): ADMIN, AGENT, EMPLOYEE
- **TicketStatus** (Where the ticket is in the process): OPEN, IN_PROGRESS, RESOLVED, CLOSED
- **Priority** (How urgent the ticket is): LOW, MEDIUM, HIGH, CRITICAL

### When to Modify the Schema:

You'll need to edit `prisma/schema.prisma` when:
- You want to add a new table (like Attachments or Notifications)
- You want to add a new field to an existing table (like adding a "phone number" field to User)
- You want to change how tables relate to each other

### How to Make Database Changes:

**Step 1:** Open `prisma/schema.prisma` and make your changes

**Step 2:** Run this command in your terminal to apply the changes:

```bash
npx prisma migrate dev --name describe-your-change
```

**Example:** If you added a phone number field, you might run:
```bash
npx prisma migrate dev --name add-phone-number-to-user
```

**Step 3:** Run this command to update Prisma's understanding of your database:

```bash
npx prisma generate
```

**Important:** Always run these commands after changing the schema, or your code won't work with the database!
 
---
 
## 📚 Supporting Directories (Helper Folders)

These folders contain helper code that supports the main application.

### lib/ - Important Helper Files
```
lib/
├── auth.ts              # 🔐 Authentication setup (login/logout configuration)
└── prisma.ts            # 🗄️ Database connection setup
```
- **What's in here:** Important configuration files that connect the app to the database and handle authentication
- **Should you modify this?** Generally no - these are core configurations. Only modify if you're adding a new library or changing how authentication works.

### types/ - TypeScript Type Definitions
```
types/
└── next-auth.d.ts       # TypeScript types for authentication
```
- **What's in here:** TypeScript definitions that help prevent errors by telling the computer what kind of data to expect
- **When to add here:** If you create custom data types that aren't already defined

### hooks/ - Custom React Hooks (Currently Empty)
- **What goes here:** Reusable logic that can be shared between components
- **When to add here:** If you find yourself writing the same logic in multiple components, create a hook
- **Examples:** `useTickets.ts` (to fetch tickets), `useAuth.ts` (to check if user is logged in)

### utils/ - Utility Functions (Currently Empty)
- **What goes here:** Small helper functions that do one specific thing
- **When to add here:** When you need a simple function that could be used anywhere
- **Examples:** `formatDate.ts` (to format dates nicely), `validateEmail.ts` (to check if email is valid)

### services/ - Business Logic (Currently Empty)
- **What goes here:** Complex business rules that don't belong in API routes
- **When to add here:** When your API routes get too complicated, move the complex logic here
- **Examples:** `ticketService.ts` (rules for how tickets are assigned), `notificationService.ts` (how notifications are sent)

### constants/ - Fixed Values (Currently Empty)
- **What goes here:** Values that never change, like lists of options
- **When to add here:** When you have fixed lists of values used throughout the app
- **Examples:** `ticketStatuses.ts` (list of all possible ticket statuses), `priorities.ts` (list of priority levels)
 
---
 
## 📝 Where to Write Code for Specific Features

This section tells you exactly which files to create for each feature in the application.

### 🔐 Authentication (Login/Logout)
- **Backend API**: Already done! `app/api/auth/[...nextauth]/route.ts` ✅
- **Frontend Form**: Create `components/forms/LoginForm.tsx`
- **Frontend Page**: Create `app/login/page.tsx`

### 🎫 Ticket Management
- **Backend API**: Already exists at `app/api/tickets/route.ts` and `app/api/tickets/[id]/route.ts`
- **Frontend Components** (you'll create these):
  - `components/forms/CreateTicketForm.tsx` - Form to create new tickets
  - `components/dashboard/TicketList.tsx` - List of all tickets
  - `components/dashboard/TicketCard.tsx` - Single ticket display card
- **Frontend Pages** (you'll create these):
  - `app/tickets/page.tsx` - Page showing all tickets
  - `app/tickets/[id]/page.tsx` - Page showing ticket details

### 👥 User Management (Admin Only)
- **Backend API**: Already exists at `app/api/users/route.ts` and `app/api/users/[id]/route.ts`
- **Frontend Component**: Create `components/forms/UserForm.tsx`
- **Frontend Page**: Create `app/admin/users/page.tsx`

### 🏢 Department Management (Admin Only)
- **Backend API**: Already exists at `app/api/departments/route.ts`
- **Frontend Component**: Create `components/forms/DepartmentForm.tsx`
- **Frontend Page**: Create `app/admin/departments/page.tsx`

### 📊 Dashboards (Different for Each Role)
- **Employee Dashboard**: Create `app/dashboard/employee/page.tsx`
- **Technician Dashboard**: Create `app/dashboard/technician/page.tsx`
- **Admin Dashboard**: Create `app/dashboard/admin/page.tsx`
- **Dashboard Components**: Create in `components/dashboard/` (stats cards, charts, ticket lists)

### 💬 Comments & Conversations
- **Backend API**: Already exists at `app/api/tickets/[id]/comments/route.ts`
- **Frontend Component**: Create `components/dashboard/CommentThread.tsx`
- **Frontend Page**: This will be part of the ticket detail page (`app/tickets/[id]/page.tsx`)

### 📎 File Uploads
- **Backend API**: Create new endpoint at `app/api/uploads/route.ts`
- **Frontend Component**: Create `components/forms/FileUpload.tsx`

### 📈 Reports (Admin Only)
- **Backend API**: Create at `app/api/reports/route.ts`
- **Frontend Component**: Create `components/dashboard/ReportChart.tsx`
- **Frontend Page**: Create `app/admin/reports/page.tsx`
 
---
 
## 🔧 Development Workflow (How to Work on This Project)

This section explains the day-to-day process of working on the project.

### Step 1: Making Database Changes

If you need to change the database (add a table, add a field, etc.):

```bash
# First, edit the prisma/schema.prisma file
# Then run this command to apply your changes:
npx prisma migrate dev --name describe-what-you-did

# Example: npx prisma migrate dev --name add-phone-number-field

# Finally, run this to update Prisma:
npx prisma generate
```

### Step 2: Starting the Development Server

To see your changes in the browser:

```bash
npm run dev
```

Then open your browser and go to: `http://localhost:3000`

**Tip:** Keep this terminal open while you work. It will show you any errors.

### Step 3: Testing Your API Routes

Before building the frontend, test your API routes to make sure they work:

- **Option 1:** Use Postman (a popular API testing tool)
- **Option 2:** Use Thunder Client (a VS Code extension)
- **Option 3:** Use curl command in terminal

**Example API URL:** `http://localhost:3000/api/tickets`

### Step 4: Writing Good Code

Follow these best practices:

- **Keep components small** - Each component should do one thing well
- **Use TypeScript** - It helps catch errors before you run the code
- **Reuse code** - If you write the same thing twice, make it a component or utility function
- **Follow the structure** - Don't create new top-level folders, use the existing ones
- **Test as you go** - Don't wait until the end to test
 
---
 
## 📂 File Naming Rules (How to Name Your Files)

Naming files correctly helps keep the project organized. Here are the rules:

### Component Files (PascalCase)
- **Rule:** Capitalize the first letter of each word
- **Examples:** `TicketCard.tsx`, `CreateTicketForm.tsx`, `Button.tsx`
- **Where:** In the `components/` folder

### Page Files (Fixed Names)
- **Rule:** Always use the exact names `page.tsx` and `layout.tsx`
- **Examples:** `page.tsx` (the page content), `layout.tsx` (optional page layout)
- **Where:** Inside any folder in `app/`

### API Route Files (Fixed Name)
- **Rule:** Always use the exact name `route.ts`
- **Examples:** `route.ts`
- **Where:** Inside any folder in `app/api/`

### Utility Files (camelCase)
- **Rule:** Lowercase first letter, capitalize subsequentwords
- **Examples:** `formatDate.ts`, `validateEmail.ts`, `calculateTotal.ts`
- **Where:** In the `utils/` folder

### Type Files (camelCase with .d.ts)
- **Rule:** camelCase naming with `.d.ts` extension
- **Examples:** `ticket.d.ts`, `user.d.ts`
- **Where:** In the `types/` folder

**Why does this matter?** Consistent naming makes files easier to find and helps the computer understand what each file does.
 
---
 
## 🎯 Quick Reference (Cheat Sheet)

Use this table to quickly find where to put your code:

| I want to... | I should create/edit this file |
|--------------|-------------------------------|
| Create a new page | `app/your-page/page.tsx` |
| Create an API endpoint | `app/api/your-endpoint/route.ts` |
| Create a UI component (button, card) | `components/ui/YourComponent.tsx` |
| Create a form component | `components/forms/YourForm.tsx` |
| Change the database structure | `prisma/schema.prisma` |
| Add TypeScript types | `types/your-types.d.ts` |
| Create a custom hook | `hooks/useYourHook.ts` |
| Add a utility function | `utils/yourFunction.ts` |
| Add business logic | `services/yourService.ts` |
| Add constants (fixed values) | `constants/yourConstants.ts` |
 
---
 
## 💡 Tips for Success (Read This!)

Here are some tips to help you succeed in this project:

1. **Start by reading existing code** - Before writing new code, look at files like `app/api/tickets/route.ts` to understand how things work. Copy the patterns you see.

2. **Follow the structure** - Don't create new top-level folders. Use the folders that already exist. This keeps the project organized.

3. **Always use TypeScript** - All your files should end in `.ts` or `.tsx`. TypeScript helps catch errors before you run the code.

4. **Test your APIs first** - Before building the frontend (what users see), test your backend API routes using Postman or a similar tool. Make sure the data is working correctly.

5. **Make reusable components** - If you create a component that could be used in multiple places (like a button), put it in `components/ui/` so everyone can use it.

6. **Keep API routes simple** - If your API route code gets too complicated, move the complex logic to the `services/` folder.

7. **Design the database first** - Before writing code, think about what data you need. Design it in `prisma/schema.prisma` first.

8. **Keep secrets safe** - Never put passwords or API keys in your code. Put them in the `.env` file and NEVER commit `.env` to GitHub.

9. **Ask for help** - If you're stuck, don't spend hours struggling. Ask a mentor or teammate for help.

10. **Commit often** - Save your work to Git frequently with clear messages describing what you did.

---

## 🚦 Getting Started Checklist (Do This First!)

Before you start coding, make sure you've completed these steps:

### Setup Steps:

- [ ] **Install PostgreSQL** - This is the database software we're using
- [ ] **Configure `.env` file** - Add your database URL and any other secrets (copy from `.env.example`)
- [ ] **Run database setup** - Execute `npx prisma migrate dev` to create the database tables
- [ ] **Generate Prisma client** - Run `npx prisma generate` to set up the database connection
- [ ] **Start the development server** - Run `npm run dev` and check that `http://localhost:3000` works
- [ ] **Read existing code** - Look at the API routes to understand the patterns used in this project

### Ready to Code?

- [ ] **Pick a simple feature to start** - Don't try to build everything at once. Start with something simple like the ticket list page.
- [ ] **Test your changes** - After each change, test it to make sure it works
- [ ] **Ask questions** - If you're unsure about something, ask!

---

## 🆘 Need Help?

If you're stuck or unsure where to put your code:

1. **Check this guide first** - Look at the relevant section above
2. **Look at existing code** - Find similar code that already exists and copy the pattern
3. **Ask a mentor** - Don't hesitate to ask for help
4. **Search online** - Many common problems have solutions online

---

**Remember:** This guide is here to help you. Refer to it whenever you're unsure where to write code. Good luck! 🚀