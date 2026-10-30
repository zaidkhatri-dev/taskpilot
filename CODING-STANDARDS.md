General
- Follow the DRY (Don't Repeat Yourself) principle.
- types that are used by server and client are defined in @repo/contracts
- types that are only used by apps are defined in there types folder
- Every package seperates files modules wise. ie: code related to a module user is in a seperate file user.ts. These files are then grouped in a folder domain wise. eg @repo/contracts groups user.ts in a response folder.
- Only routes, services, controllers and repositories are defined in a module folder. Code supporting these files are in a separate file with name same as module in their respective domain folder.
- If a code is used in multiple apps, it should be in a seperate package.
- packages export types and functions that are used by apps.
- no package should import from another package, only apps can import from packages.
- files should be named in kebab-case and functions/variables should be named in camelCase
- use const instead of let when possible
- package names should be in @repo/packagename format
- use arrow functions instead of function declarations
- use async/await instead of promises
- use destructuring to extract values from objects and arrays
- use template literals instead of string concatenation
- use ternary operator instead of if-else statement when there is only one if and one else
- package files are also organized domain wise
- zod schemas that are used in multiple places should be defined as common schemas in @repo/validation
- keep the code clean, simple, readable, organized and maintainable

Client

- Define interface for props in that particular component file.
- Break down big components into smaller components, each in their own file under a common module folder.
- Use object destructuring to extract values from props.
- Use object destructuring to use functions and hooks from react.
- hooks, lib are defined in a seperate folder named hooks and lib respectively.
- actions and utility functions are defined in a seperate folder named actions and utils inside lib.
- components are defined in a seperate folder named components.
- Every action and util function which are of the same module are written in same file.
- Components of same module are grouped together in a folder.

Server

- Always break down an api endpoint into controller, services and repository.
- Always add type annotation to final response in controllers (Define these interfaces in @repo/config)
- Always use validation middleware for all routes (unless it doesn't have any request body, query or params). Define schemas for such routes in @repo/validation
- Always define generic db functions in repositories and use them in that particular module.
- Naming convention for repository functions - actionResource eg -: updateUser
- Naming convention for service and controller functions - actionResourceService/Controller eg -: updateUserService/updateUserController
- A module should be self contained and should not depend on other modules.
