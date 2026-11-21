---
name: coding-standards-client
description: >-
  Coding standards and conventions for the frontend web client (apps/client). Use when
  working on React/Next.js client code, UI components, client hooks, forms, actions, or
  client state.
---

# TaskPilot Client Standards (`apps/client`)

## 1. General

- **Types**: Types shared by `server` and `client` live in `@repo/contracts`. App-only types live in the app's `types/` folder.
- **Validation**: Zod schemas used in multiple places live in `@repo/validation`.
- **Module separation**: One file per module (e.g. `user.ts`), grouped in folders by domain.
- **Packages**: Code used by multiple apps goes in a package named `@repo/<name>`. Packages must not import from other packages. Only apps import from packages.
- **Style**:
  - Files are `kebab-case`.
  - Use arrow functions, not function declarations.
  - Use `@/` import aliases.

## 2. Structure

- `hooks/`, `lib/`, and `components/` are top-level folders.
- `lib/actions/` and `lib/utils/` hold actions and utils. All actions and utils for one module go in the same file.
- Components of the same module are grouped in one folder. Split large components into smaller ones, one per file, in that folder.
- Define the props interface in the component's own file.
- Default export names for routing files: `error.tsx` → `RouteError`, `page.tsx` → `RoutePage`, `layout.tsx` → `RouteLayout`.

## 3. Data & Forms

- **Hook choice**: `useActionState` for forms, `useQuery` for fetching, `useMutation` for side effects and mutations.
- **Toasts and errors**:
  - `useActionState`: render the toast in the component that uses it.
  - `useMutation`: render the toast in the hook that defines it.
  - `useQuery`: throw the error in the hook and again in the component that uses the hook.
- **Query keys**: All keys live in `@/hooks/keys.ts`. Never inline key arrays. Add a key
  only for a new `useQuery`, or for a prefix key used to invalidate/remove a group of
  queries (name it `*Base` or `scope`). Delete keys that nothing references, whether a
  hook or an invalidate/remove call.
- **Cache invalidation**:
  - Invalidate only the queries the mutation could have changed. Never invalidate "to be safe".
  - Forms (`useActionState`): call `invalidateQueries` in the `useEffect` that watches `state?.submissionId`, right after the success toast.
  - Mutations (`useMutation`): call `invalidateQueries` / `removeQueries` in `onSuccess`, in the same hook file.
  - Call custom and Next.js hooks (e.g. `useRouter()`) at the hook's top level, never inside `onSuccess` / `onError`.
  - **Prefix matching**: Query keys are hierarchical and TanStack Query matches by prefix.
    Invalidate or remove with the narrowest key that covers the change. A list key must
    never be a prefix of other queries' keys (e.g. `workspaces.all` is `["workspaces",
    "list"]`, not `["workspaces"]`). Never call `removeQueries` with a list key.
  - **Delete / Leave**: `removeQueries` with the resource's `scope` key (covers all child
    queries for that resource), then `invalidateQueries` with the parent list key.
  - Invalidate `queryKeys.session` only if auth state changes (e.g. `isOnboarded`). Do not invalidate it on workspace delete or leave.
  - Reference implementation: `useProcessWorkspaceInvitation` (top-level hooks, conditional invalidation, toast placement) and `useDeleteWorkspace` (remove-then-invalidate) in `hooks/workspace.ts`.
- **Update forms**: Track dirty state with `isUnchanged` from `@/lib/utils/miscellaneous`. Disable submit when the form is unchanged or `isPending`.

## 4. UI

- **Buttons**:
  - Form submit: primary, default size, full form width.
  - Action buttons: primary or secondary, large size, content-fit width.
  - Button text is two words, verb + noun. Use an icon when the noun is an entity.
- **Links**: Every `next/link` gets the `cursor-default` class.
- **Font sizes** (never override sizes inside `@components/ui`):
  - Message-only pages (e.g. error): heading `xl`, supporting text `default`, centered.
  - Data pages: heading `lg`, everything else `default`, stepping down to `sm` for hierarchy.
  - Settings pages: heading `text-2xl font-semibold tracking-tight text-foreground` with `mb-8`, page padding `pt-16 pb-20 px-6`.
- **Dialogs** (`components/ui/dialog.tsx`): No `DialogDescription`. Title format is `<Action> a/your <new/current> <entity>` (e.g. "Create a new board").