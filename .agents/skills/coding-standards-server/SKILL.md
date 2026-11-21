---
name: coding-standards-server
description: >-
  Architecture and conventions for the backend API (apps/server). Use when
  working on Express routes, controllers, services, repositories, or database operations.
---

# TaskPilot Server Standards (`apps/server`)

Code style (const, arrow functions, naming, `@/` imports, etc.) is enforced by ESLint; don't restate or hand-fix it.

## Structure
- Every endpoint is split into route, controller, service and repository inside `src/modules/<module>/`. Only those four file types live there. Supporting code goes in a file named after the module in the matching domain folder.
- Modules are self-contained and never import from other modules.
- Types shared by server and client live in `@repo/contracts`; app-only types live in the app's `types/` folder.
- Zod schemas used in more than one place live in `@repo/validation`.
- Packages never import other packages; only apps import packages.

## Controllers
- Annotate the final response with its response type.
- Every route with a body, query or params uses the validation middleware, with its schema in `@repo/validation`.

## Repositories
- Define generic DB functions and reuse them within the module.
- Name them `actionResource` (e.g. `updateUser`).
- In create functions, throw `Error('[Entity] insert returned no row')` when no row comes back.

## Services
- Name them `actionResourceService`; controllers are `actionResourceController`.
- Update services:
  1. Compare input to the existing record with `isUnchanged` (`@/utils/miscellaneous.js`) and return the existing record early if nothing changed.
  2. After the update call, check the `where` condition and throw an application error if it failed.