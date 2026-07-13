# Model Logic & Schema Design

*This file outlines the database models, schemas, validations, and relational mapping within the project.*

---

> **Current Implementation Status**: Actual relational database integrations are pending. We are using structured JSON files in the `data/` directory (`products.json`, `blogs.json`, `users.json`, `categories.json`, `settings.json`) to mock schema logic and persistence.

## 1. Schema Definitions & Entities

### Entity: `User` (`data/users.json`)
*   **Description:** Stores user profile, roles, and authentication status.
*   **Fields:**
    *   `id`: Primary Key (String)
    *   `email`: String (Unique)
    *   `password`: String (Plaintext in mock, should be hashed in prod)
    *   `name`: String
    *   `role`: Enum (`Admin`, `Moderator`, `ContentWriter`, `Normal`)
    *   `emailVerified`: Boolean
    *   `createdAt`, `modifiedAt`: Timestamp

---

### Entity: `Blog` (`data/blogs.json`)
*   **Description:** Represents content articles in the tech blog.
*   **Fields:**
    *   `id`: Primary Key (Number)
    *   `title`: String
    *   `slug`: String (Generated from title)
    *   `excerpt`: String
    *   `content`: HTML String (Tiptap output)
    *   `category`: String (References `categories.json`)
    *   `status`: Enum (`draft`, `published`, `trash`)
    *   `date`: Date String
    *   `readTime`: String
    *   `author`: String
    *   `seo`: Object (`metaTitle`, `metaDescription`, `keywords`)

---

### Entity: `Device/Product` (`data/products.json`)
*   **Description:** Stores smartphone specification data for the catalog and comparison tool.
*   **Fields:**
    *   `id`: Primary Key (String)
    *   `name`, `brand`: String
    *   `image`: URL String
    *   `price`: Number
    *   `specs`: Nested Object containing categories (Display, Processor, Camera, Battery, OS).
    *   `features`: Array of Strings
    *   `colors`: Array of Strings

---

### Entity: `Settings` (`data/settings.json`)
*   **Description:** Global application configuration.
*   **Fields:**
    *   `seo`: Global SEO metadata rules and overrides (title, description, keywords).
    *   `typography`: Dynamic CSS size configurations for headers, text, and buttons.
    *   `ai`: Multiple AI providers configurations (`enableAiFeatures`, `provider`, `model`, `apiKey`, `temperature`, `systemPrompt`).
    *   `advertisements`: Ad network configurations, injection frequency rules, and placements.
    *   `appearance`: Theming (light/dark mode) and layout/grid display limits.
    *   `analytics`: Tracking IDs for Google Analytics, Search Console, and native visitor stats.
    *   `media`: Upload limits, CDN configurations, and automatic WebP conversion toggles.
    *   `security`: Recaptcha keys, rate limiting, login attempt protections, and backup schedules.
    *   `maintenance`: Maintenance mode toggles and custom offline messaging.
    *   `socialMedia`: Profile links for external brand channels.
    *   `comments`: Comment approval toggles.
    *   `localization`: Site language and timezone defaults.

## 2. Database Connections & Configurations
*   **Storage Mechanism:** File System (`fs/promises`). Data is read/written asynchronously to the `data/` folder.
*   **Concurrency:** Write operations lock files momentarily during standard execution.

## 3. Data Integrity & Validation Rules
*   **Categories Referential Integrity:** If a category is deleted, related blogs are automatically moved to `"Uncategorized"`. If renamed, they are reassigned.
*   **Status Guards:** Published blogs cannot be directly trashed or deleted; they must be changed to `draft` first.
