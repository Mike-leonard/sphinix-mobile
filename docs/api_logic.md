# API Logics & Route Handler Architecture

*This file outlines the REST API design, Route Handlers, middleware, authentication, and request validation logic.*

---

> **Current Implementation Status**: We are currently utilizing static JSON data (`data/products.json` & `data/blogs.json`) and bypassing full API route handlers for UI prototyping. The patterns below describe the *target architecture* for the production backend.

## 1. Directory Structure
*   API Route Handlers are located in: `app/api/...`

## 2. Global Middleware & Security
*   **Authentication Middleware:**
*   **Rate Limiting:**
*   **CORS Configuration:**

## 3. Route Index & Specifications

### Endpoint: `GET /api/...`
*   **Description:**
*   **Request Headers:**
*   **Request Query/Body Params:**
*   **Success Response (200 OK):**
*   **Error Responses:**

---

### Endpoint: `POST /api/...`
*   **Description:**
*   **Request Headers:**
*   **Request Query/Body Params:**
*   **Success Response (201 Created):**
*   **Error Responses:**

## 4. Error Handling & Validation Guidelines
*   **Request Validation:** (e.g., Zod schemas)
*   **Error Standard:** (e.g., RFC 7807 Problem Details)
