---
name: coding-standards-client
description: >-
  Coding standards, architectural guidelines, naming conventions, and best practices
  for developing the frontend web client application (apps/client). Use this skill
  when working on React/Next.js client code, UI components, client hooks, forms, actions, or client state.
---

# TaskPilot Client Coding Standards (`apps/client`)

Follow these guidelines and rules when creating, modifying, or refactoring code in the client application (`apps/client`).

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

## 2. Client-Specific Standards

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
  - Use `useActionState` for forms (`POST`/`PATCH`/`PUT`), `useQuery` for fetching data (`GET`), and `useMutation` for rest of it (`DELETE`).
- **Buttons & UI Rules**:
  - Form submit buttons should be primary, size = default, and have full width of the form.
  - Action buttons can be primary or secondary, size = large, and should have appropriate width (not full screen).
  - Button text should be only two words — verb noun. Use icons when noun is an entity.
  - Every Next.js link (`next/link`) should have `cursor-default` Tailwind class on it.
- **Typography & Layout Hierarchy**:
  - Font size hierarchy:
    - Pages with only message (like error page): heading - `xl`, paragraph (supporting text) - `default`.
    - Pages with data: heading - `lg`, other data (like text, input labels, button text, etc) - `default`. If hierarchy, then start from `default` and move to `sm` (as needed).
    - Do not change font sizes for components defined in `@components/ui`, they have fixed font sizes.
  - Pages with only message should always be centered.
- **Dialogs & Modals (`apps/client/components/ui/dialog.tsx`)**:
  - Do not use a header description (`DialogDescription`).
  - The dialog title should follow the format: `<Action> a/your <new/current> <entity>` (e.g., "Create a new board", "Update your current workspace").

