# Help Desk Management System

A help desk system for managing support tickets. Users can create tickets, assign them to team members, and track their progress.

## What This Project Does

This is a web application where:
- **Employees** can create support tickets when they have problems
- **Agents** can view and manage tickets assigned to them
- **Admins** can manage users, departments, and settings

## Features

- Create and track support tickets
- Assign tickets to team members
- Add comments to tickets for collaboration
- Organize tickets by categories and departments
- Different user roles with different permissions

## Technologies Used

- **Next.js** - The web framework (like React but with extra features)
- **TypeScript** - JavaScript with type checking (helps prevent errors)
- **Prisma** - Tool to interact with the database
- **PostgreSQL** - The database where all data is stored
- **Tailwind CSS** - For styling the user interface
- **NextAuth** - For handling user login/logout

## What You Need Before Starting

1. **Node.js** (version 18 or higher) - Download from [nodejs.org](https://nodejs.org)
2. **PostgreSQL** - A database program. You can install it locally or use a cloud service like Supabase
3. **Git** - For cloning the repository (optional if you have the code already)

## Step-by-Step Setup Guide

### Step 1: Get the Code

If you have the code already, skip this step. Otherwise:

```bash
git clone <repository-url>
cd help-desk-management-system
```

### Step 2: Install Dependencies

This downloads all the libraries the project needs:

```bash
npm install
```

*This might take a few minutes. You'll see lots of text scrolling by - that's normal!*

### Step 3: Set Up Your Database

You need a PostgreSQL database running. Here are two options:

 Use a local PostgreSQL installation**
1. Install PostgreSQL on your computer
2. Create a new database called `helpdesk_db`
3. Remember your username and password


### Step 4: Configure Environment Variables

Environment variables are settings that your app needs but shouldn't be shared publicly (like passwords).

1. Copy the example file:
```bash
cp .env.example .env
```

2. Open the `.env` file in a text editor and update it:

```env
# Database connection - replace with your actual database details
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/helpdesk_db?schema=public"

# NextAuth settings
NEXTAUTH_SECRET="any-random-string-here"
NEXTAUTH_URL="http://localhost:3000"
```

**What to put in DATABASE_URL:**
- If using local PostgreSQL: `postgresql://postgres:YOUR_PASSWORD@localhost:5432/helpdesk_db?schema=public`
- If using Supabase: Copy the connection string from Supabase dashboard

**What to put in NEXTAUTH_SECRET:**
- Any random string works for development
- For production, generate a secure one with: `openssl rand -base64 32`

### Step 5: Set Up the Database Tables

Run this command to create all the tables in your database:

```bash
npx prisma migrate dev
```

*This reads the `prisma/schema.prisma` file and creates the matching tables in your database.*

### Step 6: Start the Application

```bash
npm run dev
```

You should see something like:
```
✓ Ready in 2.3s
○ Local: http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Understanding the API

The application has API endpoints that the frontend uses to get and send data. Here's what they do:

### Authentication (Login/Logout)
- `POST /api/auth/signin` - User logs in
- `POST /api/auth/signout` - User logs out
- `GET /api/auth/session` - Check if user is logged in

### Tickets (The main feature)
- `GET /api/tickets` - Get list of tickets (what you see depends on your role)
- `POST /api/tickets` - Create a new ticket
- `GET /api/tickets/[id]` - Get details of one specific ticket
- `PATCH /api/tickets/[id]` - Update a ticket (change status, assign to someone, etc.)
- `DELETE /api/tickets/[id]` - Delete a ticket (only admins can do this)
- `GET /api/tickets/[id]/comments` - Get all comments on a ticket
- `POST /api/tickets/[id]/comments` - Add a new comment to a ticket

### Departments
- `GET /api/departments` - Get all departments
- `POST /api/departments` - Create a new department (only admins)
- `GET /api/departments/[id]` - Get details of one department
- `PATCH /api/departments/[id]` - Update a department (only admins)
- `DELETE /api/departments/[id]` - Delete a department (only admins)

### Users
- `GET /api/users` - Get all users (only admins and agents)
- `POST /api/users` - Create a new user (only admins)
- `GET /api/users/[id]` - Get details of one user
- `PATCH /api/users/[id]` - Update a user
- `DELETE /api/users/[id]` - Delete a user (only admins)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create a new category (only admins)
- `GET /api/categories/[id]` - Get details of one category
- `PATCH /api/categories/[id]` - Update a category (only admins)
- `DELETE /api/categories/[id]` - Delete a category (only admins)

## User Roles Explained

Different users have different permissions:

- **ADMIN** - Can do everything: manage users, departments, categories, and all tickets
- **AGENT** - Can view and manage tickets in their department, can see other users
- **EMPLOYEE** - Can only create tickets and view their own tickets, can update their own profile

## Database Structure

The application stores data in these main tables:

- **Users** - All the people who use the system
- **Departments** - Different teams or groups (like IT, HR, Support)
- **Categories** - Types of tickets (like Hardware, Software, Network)
- **Tickets** - The actual support requests
- **Comments** - Messages added to tickets

You can see the full structure in the `prisma/schema.prisma` file.

## Useful Commands for Development

### View or Edit Database Visually
```bash
npx prisma studio
```
*This opens a visual tool where you can see and edit all data in your database.*

### Update Database Structure
If you change the `prisma/schema.prisma` file, run:
```bash
npx prisma migrate dev
```
*This updates your database to match the new schema.*

### Reset the Database (Warning: Deletes all data!)
```bash
npx prisma migrate reset
```
*Use this only if you want to start fresh with an empty database.*

## Troubleshooting

### "Database connection failed" error
- Make sure your PostgreSQL database is running
- Check that your DATABASE_URL in `.env` is correct
- Verify your database username and password

### "Module not found" errors
- Run `npm install` again to make sure all dependencies are installed

### Migration errors
- Make sure your database exists
- Check that you have the right permissions to create tables

### Port already in use
If you see "port 3000 is already in use", either:
- Close the other application using port 3000, or
- Run `npm run dev -- -p 3001` to use port 3001 instead

## Getting Help

If you're stuck:
1. Check the error message in your terminal
2. Make sure you followed all the setup steps
3. Try searching for the error online
4. Ask a me or fuad

