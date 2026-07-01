# Model Logic & Schema Design

*This file outlines the database models, schemas, validations, and relational mapping within the project.*

---

> **Current Implementation Status**: Actual database integrations are pending. We are using structured JSON files (`data/products.json`, `data/blogs.json`) to mock relational data and schema logic.

## 1. Schema Definitions & Entities

### Entity: `User`
*   **Description:** Stores user profile and authentication status information.
*   **Fields:**
    *   `id`: Primary Key (UUID/String)
    *   `email`: String (Unique, Indexed)
    *   `createdAt`: Timestamp
*   **Relations:** Has many `Posts`, Has one `Profile`.

---

### Entity: `Post`
*   **Description:** Represents user-generated posts.
*   **Fields:**
    *   `id`: Primary Key
    *   `title`: String
    *   `content`: Text
    *   `authorId`: Foreign Key referencing `User(id)`
*   **Relations:** Belongs to `User`.

## 2. Database Connections & Configurations
*   **Connection Lifecycle:** (e.g., Singleton pattern for client instantiation)
*   **Pooling Config:**

## 3. Data Integrity & Validation Rules
*   **Database Constraints:**
*   **Application-level Validations:**
