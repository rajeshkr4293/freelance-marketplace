**Online Marketplace for Freelancers (Fiverr-Like Platform)**

A full-stack MERN application that allows freelancers to offer services and clients to purchase them, manage orders, and leave reviews — inspired by platforms like Fiverr and Upwork.

This project focuses on real-world backend logic, role-based systems, and end-to-end application flow, with a minimal frontend to demonstrate functionality.

---
**Project Overview**

The platform supports two main roles:

Client – can browse gigs, place orders, and leave reviews

Freelancer – can create gigs, manage orders, and track earnings

Key marketplace flows implemented:

Gig → Order → Completion → Review

---

**Features
 Authentication & Authorization**

User registration and login using JWT

Role-based access control (CLIENT / FREELANCER)

Secure protected routes

Token-based session handling

---

**Gigs (Services)**

Freelancer can create gigs

Public gig listing

View gig details

Backend validation for ownership and role

---

**Orders**

Client can place orders for gigs

Freelancer can update order status

Order lifecycle:

PENDING → IN_PROGRESS → COMPLETED

Orders linked to buyer, seller, and gig

---

**Reviews**

Client can leave a review only after order completion

One review per order enforced

Reviews are publicly visible on gig pages

Backend enforces all review rules (no frontend manipulation)

---

**Dashboards**

**Freelancer Dashboard**

Total orders

Completed orders

Total earnings (server-side aggregation)

**Client Dashboard**

Total purchases

Completed purchases

---

**Navigation**

Simple navigation bar for:

Home (Gigs)

Create Gig

Client Dashboard

Freelancer Dashboard

Login / Register / Logout

Navigation is intentionally minimal to keep focus on backend logic.

---

**Tech Stack**

**Backend**

Node.js

Express.js

MongoDB + Mongoose

JWT Authentication

Role-based middleware

RESTful APIs

**Frontend**

React.js

React Router

Axios

Minimal UI (logic-focused)

---

**Project Structure**

freelance-marketplace/
│
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── config/
│   └── server.js
│
├── client/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── api/
│   │   └── App.js
│
└── README.md

---











