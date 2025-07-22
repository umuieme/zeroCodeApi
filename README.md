# ZeroCodeApi

**ZeroCodeApi** is a no-code API builder platform built with Next.js and MongoDB. It enables developers, product teams, and startups to rapidly create backend APIs without writing code. Users can visually define data schemas or import from JSON Schema, generate RESTful CRUD endpoints automatically, and manage data through an intuitive dashboard — all with built-in validation, pagination, filtering, and secure user authentication via Clerk.

This is deployed in Vercel. You can access the website from this link
https://zero-code-api.vercel.app/

## Features

- **User Authentication & Management: (Sobha)** Powered by Clerk for signup, login, and user session management  
- **Project Management: (Yatin)** Create and manage multiple isolated projects per user  
- **Pagination and Filter: (Yatin)** Paginate and filter data
- **Endpoint & Schema Builder: (Umesh)** Visual UI to define endpoint details and JSON schema for data validation  
- **Dynamic API Generation: (Umesh)** Auto-generated CRUD REST endpoints for each schema  
- **Data Dashboard: (Sobha)** View, add, edit, delete records with form-based UI 
- **Schema-aware Validation: (Yatin)** Request validation using Zod schemas to ensure data integrity  
- **MongoDB Integration: (Umesh)** Dynamic collections per endpoint with flexible schema storage  
- **API Documentation: (Sobha)** Auto-generated OpenAPI docs powered by zod-to-openapi and Swagger UI  

## Tech Stack

- Frontend: Next.js (App Router), Tailwind CSS  
- Backend: Next.js API Routes  
- Database: MongoDB (native driver, Mongoose)  
- Authentication: Clerk  
- Validation: Zod  
- API Documentation: @asteasolutions/zod-to-openapi + Swagger UI  

## Getting Started

### Prerequisites

- Node.js (>=16)  
- MongoDB cluster or local instance  
- Clerk account and API keys

### Installation

1. Clone the repository  
2. Install dependencies:  
   ```bash
   npm install
3. Configure environment variables in .env
   ```
    MONGODB_URI=
    JWT_SECRET=
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
    CLERK_SECRET_KEY=
4. Run the development server:

    ```bash
    npm run dev
5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

