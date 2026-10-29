# BookLeaf Author Support & Communication Portal

A full-stack support portal for BookLeaf authors and operations
administrators. Authors can access their books and royalty information,
submit support tickets, and track replies. Admins can triage tickets,
prioritize work, update statuses, assign tickets, add internal notes,
and use AI-assisted ticket classification and response drafting.

> **Security note:** Credentials and API keys pasted into chat or other
> shared places should be treated as exposed. They are intentionally
> **not** included in this README. Rotate the Groq/Gemini keys and
> replace any exposed database/JWT secrets. Keep real `.env` files out
> of version control.

## Contents

-   [Features](#features)
-   [Technology Stack](#technology-stack)
-   [Architecture](#architecture)
-   [Prerequisites](#prerequisites)
-   [Project Setup](#project-setup)
-   [Environment Variables](#environment-variables)
-   [Database Schema](#database-schema)
-   [Seed Data](#seed-data)
-   [API Documentation](#api-documentation)
-   [API Endpoint Summary](#api-endpoint-summary)
-   [Authentication and
    Authorization](#authentication-and-authorization)
-   [AI Integration](#ai-integration)
-   [Ticket Workflow](#ticket-workflow)
-   [Validation and Error Handling](#validation-and-error-handling)
-   [Running the Application](#running-the-application)
-   [Troubleshooting](#troubleshooting)
-   [Assignment Coverage](#assignment-coverage)
-   [Future Improvements](#future-improvements)

## Features

### Author Portal

-   Email/password authentication.
-   Author-specific dashboard and profile.
-   View books linked to the logged-in author.
-   Display book metadata, publication status, sales, and royalty
    figures.
-   Submit support tickets with a related book or a
    general/account-level query.
-   View submitted tickets, ticket status, and support replies.
-   View replies from the support team on ticket details.
-   Optional attachment UI can be added; file storage is not assumed to
    be implemented.

### Admin Portal

-   Admin dashboard and support ticket queue.
-   View tickets submitted by all authors.
-   Filter tickets by search text, status, priority, category, and date.
-   Sort unresolved tickets ahead of resolved/closed tickets, with
    higher priority first and older tickets first within the same
    priority.
-   View ticket details and author/book context.
-   Update ticket status.
-   Assign tickets to an admin.
-   Add public replies and internal notes.
-   AI-assisted ticket classification and priority suggestions.
-   AI-drafted replies that an admin can review and edit before sending.

### API and Documentation

-   REST API built with NestJS.
-   PostgreSQL relational database.
-   Request validation with NestJS `ValidationPipe`.
-   Cookie parsing and credentialed CORS configuration.
-   Swagger/OpenAPI interactive documentation.

## Technology Stack

  -----------------------------------------------------------------------
  Layer                               Technology
  ----------------------------------- -----------------------------------
  Frontend                            Next.js, React, TypeScript,
                                      Tailwind CSS

  Backend                             NestJS, TypeScript

  Database                            PostgreSQL

  ORM                                 TypeORM (where configured in the
                                      project)

  API documentation                   Swagger / OpenAPI via
                                      `@nestjs/swagger`

  Authentication                      Email/password, JWT access/refresh
                                      token flow, cookies

  AI provider                         Groq API, configured through
                                      backend environment variables

  Package manager                     pnpm
  -----------------------------------------------------------------------

## Architecture

``` text
Browser
  |
  | Next.js UI
  | NEXT_PUBLIC_API_URL
  v
NestJS REST API
  |-- Authentication and role guards
  |-- Author profile and book endpoints
  |-- Author ticket endpoints
  |-- Admin ticket queue and management endpoints
  |-- AI classification and reply-drafting service
  |
  v
PostgreSQL (bookleaf_db)
  |-- users
  |-- books
  |-- tickets
  |-- admin_ticket_replies
```

The browser should call the backend API. AI provider keys and database
credentials must remain on the backend and must never use a
`NEXT_PUBLIC_` environment variable.

## Prerequisites

Install the following:

-   Node.js (use a version compatible with the project; Node.js 22 or
    newer is recommended if supported by the installed dependencies).
-   pnpm.
-   PostgreSQL.
-   Git (optional, for cloning/version control).

Confirm installation:

``` bash
node --version
pnpm --version
psql --version
```

## Project Setup

The repository structure may differ. The commands below assume separate
frontend and backend folders.

### 1. Database

Create a PostgreSQL database:

``` sql
CREATE DATABASE bookleaf_db;
```

Connect to `bookleaf_db` and apply the project's migrations or schema
SQL. The core tables described in this README are `users`, `books`,
`tickets`, and `admin_ticket_replies`.

If password hashing uses PostgreSQL's `crypt()` and `gen_salt()`
functions in seed SQL, enable `pgcrypto` first:

``` sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

Do not run seed inserts repeatedly unless the seed script is idempotent;
unique email and author-code constraints may cause duplicate-key errors.

### 2. Backend

From the backend directory:

``` bash
pnpm install
pnpm add @nestjs/swagger
pnpm run start:dev
```

The API defaults to port `3000`, unless `PORT` is configured.

Swagger UI should be available at:

``` text
http://localhost:3000/api-docs
```

### 3. Frontend

From the frontend directory:

``` bash
pnpm install
pnpm run dev
```

The frontend has been configured to use:

``` env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

The frontend development server in this setup uses port `3001`. If the
actual port differs, update the backend's `FRONTEND_URL` to match it.

## Environment Variables

Create a local `.env` file in the backend directory. Use placeholders
below and fill them with newly generated credentials in your local
environment.

### Backend `.env.example`

``` env
# Server
PORT=3000
FRONTEND_URL=http://localhost:3001

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=replace_with_your_local_database_password
DB_DATABASE=bookleaf_db

# JWT: generate strong, unique random values
JWT_ACCESS_SECRET=replace_with_a_long_random_access_secret
JWT_REFRESH_SECRET=replace_with_a_different_long_random_refresh_secret

# AI provider (backend only)
GROQ_API_KEY=replace_with_your_groq_api_key
GROQ_MODEL=openai/gpt-oss-20b

# Optional Gemini configuration if the project uses Gemini
# GEMINI_API_KEY=replace_with_your_gemini_api_key
# GEMINI_MODEL=your_available_gemini_model
```

### Frontend `.env.local`

``` env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Environment security

-   Never commit `.env`, `.env.local`, database passwords, JWT secrets,
    or provider keys.
-   Ensure `.env*` is covered by `.gitignore`, while allowing a safe
    `.env.example`.
-   Rotate any provider key that has been pasted into a chat, ticket,
    repository, screenshot, or other shared channel.
-   Use different JWT secrets for access and refresh tokens.
-   Do not expose AI provider keys through `NEXT_PUBLIC_*` variables.
-   For production, use a secret manager or protected deployment
    environment variables.

## Database Schema

The supplied schema contains these main tables.

### `users`

Stores author and admin accounts.

  Column                       Description
  ---------------------------- --------------------------------------------------------
  `id`                         Primary key
  `author_code`                Unique author code; nullable for admin accounts
  `name`                       Display name
  `email`                      Unique email address
  `password_hash`              Password hash; never return this from an API
  `role`                       Enum role, default `AUTHOR`; admin records use `ADMIN`
  `phone`, `city`              Optional contact/profile details
  `joined_date`                Optional join date
  `refresh_token_hash`         Optional refresh-token hash
  `created_at`, `updated_at`   Audit timestamps

### `books`

Stores books associated with authors.

  Column                            Description
  --------------------------------- -----------------------------------
  `id`                              Primary key
  `book_code`                       Unique book identifier
  `title`, `isbn`, `genre`          Book metadata
  `publication_date`, `status`      Publication details
  `mrp`                             Maximum retail price
  `author_royalty_per_copy`         Royalty per sold copy
  `total_copies_sold`               Total sales count
  `total_royalty_earned`            Earned royalty total
  `royalty_paid`                    Royalty already paid
  `royalty_pending`                 Outstanding royalty
  `last_royalty_payout_date`        Most recent payout date
  `print_partner`, `available_on`   Distribution/printing information
  `author_id`                       Foreign key to `users.id`

### `tickets`

Stores author support requests.

  -----------------------------------------------------------------------
  Column                              Description
  ----------------------------------- -----------------------------------
  `id`                                Primary key

  `subject`                           Ticket subject

  `description`                       Author's query

  `category`                          AI-suggested or admin-selected
                                      category

  `priority`                          Priority value; supplied schema
                                      defaults to `Medium`

  `status`                            Workflow status; supplied schema
                                      defaults to `Open`

  `created_at`, `updated_at`          Ticket timestamps

  `author_id`                         Foreign key to `users.id`

  `book_id`                           Optional foreign key to `books.id`;
                                      set null if book is deleted

  `assigned_admin_id`                 Optional admin user reference; set
                                      null if admin is deleted

  `ai_suggested_reply`                Optional AI-generated draft
  -----------------------------------------------------------------------

### `admin_ticket_replies`

Stores admin replies and internal notes.

  -----------------------------------------------------------------------
  Column                              Description
  ----------------------------------- -----------------------------------
  `id`                                Primary key

  `message`                           Reply or note text

  `is_internal`                       `true` means internal note; `false`
                                      means author-visible reply

  `created_at`                        Creation timestamp

  `ticket_id`                         Foreign key to `tickets.id`;
                                      cascades on ticket deletion

  `admin_id`                          Foreign key to `users.id`; cascades
                                      on user deletion
  -----------------------------------------------------------------------

An index on `(ticket_id, created_at)` supports fetching ticket replies
in chronological order.

### Important consistency note

The supplied SQL uses values such as `Open`, `Medium`, and
`In Progress`, while the frontend examples use uppercase values such as
`OPEN`, `MEDIUM`, and `IN_PROGRESS`. Normalize values consistently in
the API layer or standardize them in the database. Otherwise, filters
and style maps may fail to match records.

## Seed Data

The supplied seed data creates ten author accounts and book records
associated with those authors. It also identifies an admin account in
the `users` table.

For local development:

1.  Enable `pgcrypto` if using `crypt()` / `gen_salt()`.
2.  Insert the author and admin users.
3.  Insert books using the matching author email or ID.
4.  Add sample tickets for testing the author and admin workflows.
5.  Confirm the admin account has the `ADMIN` role and can log in.

**Do not publish real or shared demo passwords in this README.** Use
local-only test credentials managed outside source control, and change
any credentials that have been shared.

## API Documentation

Swagger is configured in the NestJS bootstrap file using
`SwaggerModule`.

Expected local URL:

``` text
http://localhost:3000/api-docs
```

Swagger discovers controller routes automatically. DTO schemas,
examples, response models, and authentication behavior may need
decorators such as:

-   `@ApiTags()`
-   `@ApiOperation()`
-   `@ApiResponse()`
-   `@ApiProperty()`
-   `@ApiBearerAuth()`

For cookie-based authentication, Swagger's Bearer authorization alone
does not automatically send the browser's authentication cookies. Test
cookie-authenticated endpoints through the UI only if the Swagger setup
is explicitly configured to support that authentication flow; otherwise
use the frontend or an API client with the appropriate cookies.

## API Endpoint Summary

The following endpoints are visible in the current Swagger setup.
Confirm request DTOs, response shapes, guards, and status codes against
the implementation.

  -------------------------------------------------------------------------------
  Method                  Endpoint                        Purpose
  ----------------------- ------------------------------- -----------------------
  `GET`                   `/`                             API root/health
                                                          response

  `POST`                  `/auth/login`                   Log in

  `POST`                  `/auth/refresh`                 Refresh authentication
                                                          tokens

  `POST`                  `/auth/logout`                  Log out

  `GET`                   `/auth/me`                      Get current
                                                          authenticated account

  `GET`                   `/users/me`                     Get current user
                                                          profile

  `GET`                   `/books`                        List books available to
                                                          the authenticated
                                                          author

  `GET`                   `/books/{id}`                   Get a book by ID

  `POST`                  `/tickets`                      Create a support ticket

  `GET`                   `/tickets/my-tickets`           List tickets belonging
                                                          to the authenticated
                                                          author

  `GET`                   `/admin/tickets`                Admin ticket queue
                                                          across authors

  `GET`                   `/admin/tickets/{id}`           Get ticket details

  `PATCH`                 `/admin/tickets/{id}/status`    Update ticket status

  `POST`                  `/admin/tickets/{id}/replies`   Add an admin reply or
                                                          internal note
  -------------------------------------------------------------------------------

The exact endpoints may vary as the application evolves. Use the live
Swagger UI as the source of truth for the running backend.

### Suggested request examples

#### Login

`POST /auth/login`

Use the request body shown by the `LoginDto` schema in Swagger. Do not
assume a request format that differs from the DTO implemented by the
backend.

#### Create ticket

`POST /tickets`

The request should contain the subject and description, plus the
optional book reference/category fields supported by the project's
`CreateTicketDto`.

#### Update ticket status

`PATCH /admin/tickets/{id}/status`

Use the status values accepted by `UpdateTicketStatusDto`.

#### Add a reply or internal note

`POST /admin/tickets/{id}/replies`

Use the message and `is_internal`/equivalent field accepted by
`CreateTicketReplyDto`. Internal notes must not be exposed in
author-facing ticket responses.

## Authentication and Authorization

-   Authentication is email/password based.
-   The application has `AUTHOR` and `ADMIN` roles.
-   Access and refresh tokens are configured using backend environment
    variables.
-   Cookie parsing is enabled in NestJS.
-   CORS allows the configured frontend origin and credentials.
-   Global validation uses `ValidationPipe` with `whitelist`,
    `forbidNonWhitelisted`, and `transform`.

Authorization requirements:

-   Authors must only access their own profile, books, tickets, and
    public replies.
-   Admins may access the cross-author ticket queue and manage tickets.
-   The backend must enforce ownership and role checks; hiding frontend
    links is not sufficient.
-   Internal notes (`is_internal = true`) must never appear in author
    API responses.
-   Never return `password_hash` or `refresh_token_hash` in API
    responses.

## AI Integration

The backend is configured to use an AI provider through environment
variables. The supplied configuration references Groq with a
configurable model. Confirm that the selected model is available for the
account and provider at runtime.

### Ticket classification and priority

When a ticket is created, the AI service should classify it into one of
these categories:

1.  Royalty & Payments
2.  ISBN & Metadata Issues
3.  Printing & Quality
4.  Distribution & Availability
5.  Book Status & Production Updates
6.  General Inquiry

Priority should be one of `Critical`, `High`, `Medium`, or `Low`. The
admin must be able to override the AI suggestion.

### AI-drafted responses

When an admin opens a ticket, the system can generate a suggested
response using:

-   Ticket subject and description.
-   Relevant book details, where applicable.
-   Relevant BookLeaf Knowledge Base content.
-   A concise support-agent tone and a requirement not to invent policy
    or account facts.

The admin must be able to edit and approve the draft before sending it
to the author.

### Reliability and cost controls

-   Ticket creation must succeed even if the AI provider is unavailable
    or rate-limited.
-   Use a deterministic fallback category and priority when
    classification fails.
-   Allow admins to write replies manually when response generation
    fails.
-   Send only the relevant knowledge-base excerpts and ticket context
    instead of the entire database or all ticket history.
-   Avoid including passwords, tokens, or unnecessary personal data in
    prompts.
-   Log provider errors and latency without logging secrets or sensitive
    ticket contents.
-   Consider caching stable knowledge-base context and limiting
    retries/token usage.

### Model choice

Groq is configured as the current provider because it offers an
OpenAI-compatible API and supports configurable models. Model
availability, rate limits, pricing, and data handling depend on the
selected model and current provider terms. The backend should keep the
provider/model configurable rather than hardcoding it into frontend
code.

## Ticket Workflow

A typical ticket lifecycle is:

1.  Author logs in and submits a ticket.
2.  Backend validates the request and associates the ticket with the
    authenticated author.
3.  AI suggests a category and priority; fallback values are used if AI
    fails.
4.  Ticket appears in the admin queue.
5.  Admin reviews the ticket, changes category/priority if needed, and
    assigns it.
6.  Admin generates or edits a draft response.
7.  Admin sends a public reply or adds an internal note.
8.  Public replies become visible to the author; internal notes remain
    admin-only.
9.  Admin updates the ticket status as work progresses.
10. Author sees the latest status and public replies.

For near-real-time updates, polling can be used initially. WebSockets or
Server-Sent Events can be added if the assignment requires stronger
real-time behavior.

## Validation and Error Handling

The NestJS application configures:

``` typescript
new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
});
```

Recommended API behavior:

-   `400 Bad Request` for invalid input.
-   `401 Unauthorized` for missing or invalid authentication.
-   `403 Forbidden` for authenticated users without the required
    role/ownership.
-   `404 Not Found` for a missing ticket/book.
-   `429 Too Many Requests` when rate limiting applies.
-   `500 Internal Server Error` only for unexpected failures, with no
    sensitive details exposed.

AI failures should not prevent a ticket from being created or a manual
reply from being sent.

## Running the Application

### Backend

``` bash
pnpm install
pnpm run start:dev
```

### Frontend

``` bash
pnpm install
pnpm run dev
```

### Verify

1.  Confirm PostgreSQL is running and the `bookleaf_db` database exists.
2.  Confirm backend environment variables are loaded.
3.  Open the frontend at the configured Next.js development URL.
4.  Open Swagger at `http://localhost:3000/api-docs`.
5.  Log in with a local test author and verify that only their
    books/tickets are visible.
6.  Log in with the local admin account and verify the cross-author
    ticket queue.
7.  Create a ticket and verify classification/priority or fallback
    behavior.
8.  Send a public reply and verify it appears in the author's ticket
    view.
9.  Add an internal note and verify it is not visible to the author.

## Troubleshooting

### Swagger shows routes but empty schemas

Routes are discovered from NestJS controllers, but DTO properties may
not be described. Add `@ApiProperty()` to DTO fields and use concrete
DTO classes rather than interfaces for request/response schemas.

### Swagger endpoint returns unauthorized

Check the endpoint's guards and authentication mechanism. Bearer-token
authorization and cookie-based authentication are not interchangeable
without configuration.

### Ticket queue displays zero records

-   Inspect the JSON returned by `GET /admin/tickets`.
-   Confirm the database contains ticket records.
-   Confirm the backend query joins author and book data correctly.
-   Normalize API field names to the frontend `AdminTicket` type.
-   Normalize status and priority casing between database, API, and UI.
-   Ensure the response is an array or the documented paginated response
    shape.

### PostgreSQL seed script fails on `gen_salt`

Run:

``` sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

The database user must have permission to enable the extension.

### `EADDRINUSE` on port 3000

Another process is using port `3000`. On Windows, find the process:

``` powershell
netstat -ano | findstr :3000
```

Then stop the relevant process only if it is safe to do so:

``` powershell
taskkill /PID <PID> /F
```

Alternatively, configure a different `PORT` and update the frontend API
URL.

### pnpm reports ignored build scripts

Run `pnpm approve-builds` and approve only packages whose build scripts
you trust. Then run `pnpm install` again.

## Assignment Coverage

  ------------------------------------------------------------------------
  Requirement                         Implementation area
  ----------------------------------- ------------------------------------
  Author login                        Auth controller/service and frontend
                                      login

  Author-specific books               Books API with authenticated author
                                      ownership

  Submit support query                `POST /tickets`

  Author's ticket list                `GET /tickets/my-tickets`

  Admin ticket queue                  `GET /admin/tickets`

  Ticket detail                       `GET /admin/tickets/{id}`

  Status updates                      `PATCH /admin/tickets/{id}/status`

  Admin replies/internal notes        `POST /admin/tickets/{id}/replies`

  AI classification and priority      Backend AI classification service

  AI-drafted response                 Backend AI response-generation
                                      service and admin ticket UI

  REST API documentation              Swagger UI at `/api-docs`

  Role-based access                   JWT authentication and
                                      role/ownership guards

  Input validation                    NestJS `ValidationPipe` and DTO
                                      validation
  ------------------------------------------------------------------------

Implementation details should be verified against the final codebase
before submission.

## Future Improvements

-   Add pagination and server-side filtering for large ticket queues.
-   Add a proper audit trail for status, priority, category, and
    assignment changes.
-   Add attachment storage using a controlled object-storage service.
-   Add automated tests for role-based access and internal-note
    visibility.
-   Add rate limiting, structured logging, and request correlation IDs.
-   Add ticket notifications and real-time updates.
-   Add CI checks for formatting, linting, type checking, and tests.
-   Export a versioned OpenAPI JSON document as part of the release
    process.

------------------------------------------------------------------------

**Project:** BookLeaf Author Support & Communication Portal\
**API documentation:** `http://localhost:3000/api-docs`\
**Local database:** `bookleaf_db`


## Database Seeding (Authors, Admin, and Books)

Use this section to populate a local development database with the sample authors, one admin account, and the sample books. Run it only after creating the schema and enabling `pgcrypto`.

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

### Seed users

The script below inserts the ten sample authors and one admin. It skips existing emails so it can be rerun without duplicate-email errors.

> **Local development only:** these are demo credentials. Change them before any shared, staging, or production deployment. Never publish real credentials.

```sql
INSERT INTO users
  (author_code, name, email, password_hash, role, phone, city, joined_date)
VALUES
  ('AUTH001', 'Priya Sharma', 'priya.sharma@email.com', crypt('Author@123', gen_salt('bf', 12)), 'AUTHOR', '+91-98765-43210', 'Mumbai', '2023-03-15'),
  ('AUTH002', 'Rohit Kapoor', 'rohit.kapoor@email.com', crypt('Author@123', gen_salt('bf', 12)), 'AUTHOR', '+91-87654-32109', 'Delhi', '2022-11-08'),
  ('AUTH003', 'Ananya Reddy', 'ananya.reddy@email.com', crypt('Author@123', gen_salt('bf', 12)), 'AUTHOR', '+91-76543-21098', 'Hyderabad', '2024-02-20'),
  ('AUTH004', 'Vikram Joshi', 'vikram.joshi@email.com', crypt('Author@123', gen_salt('bf', 12)), 'AUTHOR', '+91-65432-10987', 'Pune', '2023-07-12'),
  ('AUTH005', 'Meera Nair', 'meera.nair@email.com', crypt('Author@123', gen_salt('bf', 12)), 'AUTHOR', '+91-54321-09876', 'Kochi', '2023-01-05'),
  ('AUTH006', 'Arjun Malhotra', 'arjun.malhotra@email.com', crypt('Author@123', gen_salt('bf', 12)), 'AUTHOR', '+91-43210-98765', 'Chandigarh', '2024-06-01'),
  ('AUTH007', 'Sneha Kulkarni', 'sneha.kulkarni@email.com', crypt('Author@123', gen_salt('bf', 12)), 'AUTHOR', '+91-32109-87654', 'Bangalore', '2022-09-18'),
  ('AUTH008', 'Farhan Sheikh', 'farhan.sheikh@email.com', crypt('Author@123', gen_salt('bf', 12)), 'AUTHOR', '+91-21098-76543', 'Lucknow', '2023-10-01'),
  ('AUTH009', 'Kavita Deshmukh', 'kavita.deshmukh@email.com', crypt('Author@123', gen_salt('bf', 12)), 'AUTHOR', '+91-10987-65432', 'Nagpur', '2024-04-10'),
  ('AUTH010', 'Diya Chatterjee', 'diya.chatterjee@email.com', crypt('Author@123', gen_salt('bf', 12)), 'AUTHOR', '+91-09876-54321', 'Kolkata', '2023-05-22')
ON CONFLICT (email) DO NOTHING;
```

Create the admin account separately. If the email already exists, verify its role and reset its password through a safe local-only procedure rather than creating a duplicate account.

```sql
INSERT INTO users
  (author_code, name, email, password_hash, role, phone, city, joined_date)
VALUES
  (NULL, 'BookLeaf Admin', 'admin@bookleaf.com',
   crypt('Admin@123', gen_salt('bf', 12)),
   'ADMIN', '+91-9000000000', 'Meerut', CURRENT_DATE)
ON CONFLICT (email) DO NOTHING;
```

### Local demo login credentials

For the local seed data above, the intended demo passwords are:

| Account type | Email | Password |
|---|---|---|
| Author | `priya.sharma@email.com` | `Author@123` |
| Author | `rohit.kapoor@email.com` | `Author@123` |
| Author | `ananya.reddy@email.com` | `Author@123` |
| Author | `vikram.joshi@email.com` | `Author@123` |
| Author | `meera.nair@email.com` | `Author@123` |
| Author | `arjun.malhotra@email.com` | `Author@123` |
| Author | `sneha.kulkarni@email.com` | `Author@123` |
| Author | `farhan.sheikh@email.com` | `Author@123` |
| Author | `kavita.deshmukh@email.com` | `Author@123` |
| Author | `diya.chatterjee@email.com` | `Author@123` |
| Admin | `admin@bookleaf.com` | `Admin@123` |

These credentials work only if the corresponding seed SQL has been run and the account's password hash was created using the matching password. The `ON CONFLICT (email) DO NOTHING` clauses do not update an existing account's password or role.

**Local development only:** do not reuse these credentials in production or expose them in a public repository. Change them before any shared or production deployment.

### Seed books

This script links each book to its author by email instead of assuming that generated numeric IDs will always be the same. It skips book codes that already exist.

```sql
INSERT INTO books (
  book_code, author_id, title, isbn, genre, publication_date, status,
  mrp, author_royalty_per_copy, total_copies_sold, total_royalty_earned,
  royalty_paid, royalty_pending, last_royalty_payout_date, print_partner,
  available_on
)
SELECT
  v.book_code, u.id, v.title, v.isbn, v.genre, v.publication_date::date,
  v.status, v.mrp, v.royalty_per_copy, v.copies_sold, v.royalty_earned,
  v.royalty_paid, v.royalty_pending, v.last_payout::date, v.print_partner,
  v.available_on
FROM (
  VALUES
    ('BK001','priya.sharma@email.com','Whispers of the Ganges','978-93-5XXXX-01-1','Literary Fiction','2023-06-20','Published & Live',399::numeric,35::numeric,342,11970::numeric,8400::numeric,3570::numeric,'2025-10-15','In-House',ARRAY['Amazon India','Flipkart','BookLeaf Store']::text[]),
    ('BK002','priya.sharma@email.com','The Saffron Diaries','978-93-5XXXX-02-8','Non-Fiction / Memoir','2024-01-10','Published & Live',450::numeric,42::numeric,189,7938::numeric,7938::numeric,0::numeric,'2025-12-01','In-House',ARRAY['Amazon India','BookLeaf Store']::text[]),
    ('BK003','rohit.kapoor@email.com','Code & Karma','978-93-5XXXX-03-5','Self-Help / Technology','2023-02-14','Published & Live',350::numeric,30::numeric,876,26280::numeric,21000::numeric,5280::numeric,'2025-09-01','Repro India',ARRAY['Amazon India','Flipkart','Amazon US','BookLeaf Store']::text[]),
    ('BK004','rohit.kapoor@email.com','Startup Sutra','978-93-5XXXX-04-2','Business / Entrepreneurship','2024-05-22','Published & Live',499::numeric,48::numeric,1203,57744::numeric,50000::numeric,7744::numeric,'2025-11-15','In-House',ARRAY['Amazon India','Flipkart','Amazon US','Amazon UK','BookLeaf Store']::text[]),
    ('BK005','ananya.reddy@email.com','Between Two Temples','978-93-5XXXX-05-9','Historical Fiction','2024-07-05','Published & Live',425::numeric,38::numeric,67,2546::numeric,0::numeric,2546::numeric,NULL,NULL,ARRAY['Amazon India','BookLeaf Store']::text[]),
    ('BK006','vikram.joshi@email.com','Debugging Life','978-93-5XXXX-06-6','Self-Help','2023-11-30','Published & Live',299::numeric,25::numeric,534,13350::numeric,10000::numeric,3350::numeric,'2025-08-20','In-House',ARRAY['Amazon India','Flipkart','BookLeaf Store']::text[]),
    ('BK007','vikram.joshi@email.com','The Last Monsoon','978-93-5XXXX-07-3','Poetry','2024-08-15','Published & Live',199::numeric,15::numeric,123,1845::numeric,1845::numeric,0::numeric,'2025-12-01','In-House',ARRAY['Amazon India','BookLeaf Store']::text[]),
    ('BK008','meera.nair@email.com','Cardamom & Chaos','978-93-5XXXX-08-0','Contemporary Fiction','2023-04-18','Published & Live',375::numeric,32::numeric,445,14240::numeric,14240::numeric,0::numeric,'2025-12-01','Repro India',ARRAY['Amazon India','Flipkart','BookLeaf Store']::text[]),
    ('BK009','meera.nair@email.com','Letters from Lakshadweep','978-93-5XXXX-09-7','Travel / Non-Fiction','2024-03-01','Published & Live',550::numeric,55::numeric,201,11055::numeric,8000::numeric,3055::numeric,'2025-10-15','In-House',ARRAY['Amazon India','Amazon US','BookLeaf Store']::text[]),
    ('BK010','arjun.malhotra@email.com','Turban Tales','978-93-5XXXX-10-3','Humor / Essays','2024-09-10','Published & Live',325::numeric,28::numeric,88,2464::numeric,0::numeric,2464::numeric,NULL,'In-House',ARRAY['Amazon India','BookLeaf Store']::text[]),
    ('BK011','sneha.kulkarni@email.com','The Algorithm of Love','978-93-5XXXX-11-0','Romance','2022-12-25','Published & Live',299::numeric,25::numeric,1567,39175::numeric,35000::numeric,4175::numeric,'2025-11-15','Repro India',ARRAY['Amazon India','Flipkart','Amazon US','BookLeaf Store']::text[]),
    ('BK012','sneha.kulkarni@email.com','Ctrl+Alt+Delete My Ex','978-93-5XXXX-12-7','Romance / Humor','2024-02-14','Published & Live',350::numeric,30::numeric,723,21690::numeric,18000::numeric,3690::numeric,'2025-10-15','In-House',ARRAY['Amazon India','Flipkart','BookLeaf Store']::text[]),
    ('BK013','sneha.kulkarni@email.com','Midnight in Mysore','978-93-5XXXX-13-4','Thriller',NULL,'In Production - Cover Design',NULL::numeric,NULL::numeric,0,0::numeric,0::numeric,0::numeric,NULL,NULL,ARRAY[]::text[]),
    ('BK014','farhan.sheikh@email.com','Ghazal of the Forgotten','978-93-5XXXX-14-1','Poetry / Urdu Literature','2024-01-26','Published & Live',250::numeric,20::numeric,156,3120::numeric,3120::numeric,0::numeric,'2025-12-01','Epitome Books',ARRAY['Amazon India','BookLeaf Store']::text[]),
    ('BK015','kavita.deshmukh@email.com','Raising Roots','978-93-5XXXX-15-8','Parenting / Non-Fiction',NULL,'In Production - Typesetting',NULL::numeric,NULL::numeric,0,0::numeric,0::numeric,0::numeric,NULL,NULL,ARRAY[]::text[]),
    ('BK016','kavita.deshmukh@email.com','The Nagpur Notebooks','978-93-5XXXX-16-5','Essays / Memoir','2024-11-05','Published & Live',299::numeric,25::numeric,34,850::numeric,0::numeric,850::numeric,NULL,'In-House',ARRAY['Amazon India','BookLeaf Store']::text[]),
    ('BK017','diya.chatterjee@email.com','Durga’s Daughters','978-93-5XXXX-17-2','Literary Fiction','2023-10-15','Published & Live',475::numeric,45::numeric,612,27540::numeric,25000::numeric,2540::numeric,'2025-11-15','Repro India',ARRAY['Amazon India','Flipkart','Amazon US','BookLeaf Store']::text[]),
    ('BK018','diya.chatterjee@email.com','Howrah Nights','978-93-5XXXX-18-9','Crime / Thriller','2025-01-20','Published & Live',399::numeric,35::numeric,45,1575::numeric,0::numeric,1575::numeric,NULL,'In-House',ARRAY['Amazon India','BookLeaf Store']::text[])
) AS v(
  book_code, author_email, title, isbn, genre, publication_date, status,
  mrp, royalty_per_copy, copies_sold, royalty_earned, royalty_paid,
  royalty_pending, last_payout, print_partner, available_on
)
JOIN users u ON u.email = v.author_email
ON CONFLICT (book_code) DO NOTHING;
```

### Verify the seed data

```sql
SELECT role, COUNT(*) AS user_count
FROM users
GROUP BY role
ORDER BY role;

SELECT COUNT(*) AS book_count FROM books;

SELECT b.book_code, b.title, u.name AS author
FROM books b
JOIN users u ON u.id = b.author_id
ORDER BY b.book_code;
```

If the `users.role` enum uses values other than `AUTHOR` and `ADMIN`, adjust the seed values to match the enum definition. The sample script assumes those two enum values are supported.
