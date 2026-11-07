---
name: coding-standards-server
description: >-
  Coding standards, architectural guidelines, naming conventions, and best practices
  for developing the backend API and server application (apps/server). Use this skill
  when working on Express routes, controllers, services, repositories, or database operations.
---

# TaskPilot Server Coding Standards (`apps/server`)

Follow these guidelines and rules when creating, modifying, or refactoring code in the server application (`apps/server`).

---

## 0. Context & Efficiency Guideline

- **Context Window & Tool Efficiency**:
  - Do not make any unnecessary tool call or use any file which is not relevant in the context window.

---

## 1. General Architectural & Code Standards

- **Core Principle**:
  - Follow the DRY (Don't Repeat Yourself) principle.
- **Contracts & Shared Types**:
  - Types that are used by both `server` and `client` are defined in `@repo/contracts`.
  - Types that are only used by apps are defined in their respective `types/` folder.
- **Domain & Module Separation**:
  - Every package separates files module-wise (e.g., code related to a module `user` is in a separate file `user.ts`). These files are then grouped in a folder domain-wise (e.g., `@repo/contracts` groups `user.ts` in a `response/` folder).
- **Packages & Code Sharing**:
  - If code is used in multiple apps, it should be in a separate package.
  - Packages export types and functions that are used by apps.
  - **Dependency Boundary**: No package should import from another package; only apps can import from packages.
  - Package names must follow the `@repo/<packagename>` format.
- **Naming Conventions**:
  - Files should be named in `kebab-case`.
  - Functions and variables should be named in `camelCase`.
- **Code Style & Syntax Rules**:
  - Use `const` instead of `let` when possible.
  - Use arrow functions instead of function declarations.
  - Use `async`/`await` instead of promises.
  - Use destructuring to extract values from objects and arrays.
  - Use template literals instead of string concatenation.
  - Use ternary operator instead of `if-else` statement when there is only one `if` and one `else`.
- **Validation**:
  - Zod schemas that are used in multiple places should be defined as common schemas in `@repo/validation`.
- **Quality**:
  - Keep the code clean, simple, readable, organized, and maintainable.

---

## 2. Server-Specific Standards

- **Layered Endpoint Architecture**:
  - Always break down an API endpoint into controller, services, and repository.
  - Only routes, services, controllers, and repositories are defined in a module folder (`src/modules/<module>/`). Code supporting these files are in a separate file with name same as module in their respective domain folder.
- **Type Annotations**:
  - Always add type annotation to final response in controllers (Define these interfaces in `@repo/config`).
- **Validation Middleware**:
  - Always use validation middleware for all routes (unless it doesn't have any request body, query or params). Define schemas for such routes in `@repo/validation`.
- **Repositories & Database Operations**:
  - Always define generic db functions in repositories and use them in that particular module.
  - In create repository functions, throw `Error('[Entity] insert returned no row')` to satisfy TypeScript when a row is expected.
- **Services & Business Logic**:
  - In service functions for update operations, an `if` branch is required after the update db call which checks the condition in the `where` clause and throws an application error if that condition fails.
- **Function Naming Conventions**:
  - Repository functions: `actionResource` (e.g., `updateUser`).
  - Service and Controller functions: `actionResourceService` / `actionResourceController` (e.g., `updateUserService`, `updateUserController`).
- **Module Autonomy**:
  - A module should be self-contained and should not depend on other modules.

