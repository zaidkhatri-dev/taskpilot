---
name: coding-standards
description: >-
  Coding standards, architectural guidelines, naming conventions, and best practices
  for developing across the TaskPilot monorepo (server, client, packages).
---

# TaskPilot Coding Standards

Follow these guidelines and rules when creating, modifying, or refactoring code in the TaskPilot repository.

---

## 1. General Architectural & Code Standards

- **Core Principle**:
  - Follow the DRY (Don't Repeat Yourself) principle.
- **Contracts & Shared Types**:
  - Types that are used by both `server` and `client` are defined in `@repo/contracts`.
  - Types that are only used by apps are defined in their respective `types/` folder.
- **Domain & Module Separation**:
  - Every package separates files module-wise (e.g., code related to a module `user` is in a separate file `user.ts`).
  - These files are then grouped in a folder domain-wise (e.g., `@repo/contracts` groups `user.ts` in a `response/` folder).
  - Package files and internal structures must also be organized domain-wise.
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

## 2. Server Standards (`apps/server`)

- **Layered Endpoint Architecture**:
  - Always break down an API endpoint into controller, services, and repository.
  - Only routes, services, controllers, and repositories are defined in a module folder (`src/modules/<module>/`). Code supporting these files are in a separate file with name same as module in their respective domain folder.
- **Type Annotations**:
  - Always add type annotation to final response in controllers (Define these interfaces in `@repo/config`).
- **Validation Middleware**:
  - Always use validation middleware for all routes (unless it doesn't have any request body, query or params). Define schemas for such routes in `@repo/validation`.
- **Repositories & Database Operations**:
  - Always define generic db functions in repositories and use them in that particular module.
- **Function Naming Conventions**:
  - Repository functions: `actionResource` (e.g., `updateUser`).
  - Service and Controller functions: `actionResourceService` / `actionResourceController` (e.g., `updateUserService`, `updateUserController`).
- **Module Autonomy**:
  - A module should be self-contained and should not depend on other modules.

---

## 3. Client Standards (`apps/client`)

- **Folder & Structure Conventions**:
  - `hooks` and `lib` are defined in separate folders named `hooks` and `lib` respectively.
  - Actions and utility functions are defined in separate folders named `actions` and `utils` inside `lib`.
  - Components are defined in a separate folder named `components`.
  - Every action and util function which are of the same module are written in the same file.
  - Components of the same module are grouped together in a folder.
- **Component Props & Decomposition**:
  - Define interface for props in that particular component file.
  - Break down big components into smaller components, each in their own file under a common module folder.
  - Use object destructuring to extract values from props.
- **React Imports & Hooks**:
  - Use object destructuring to use functions and hooks from React.
