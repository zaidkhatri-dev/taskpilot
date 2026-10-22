import { ErrorMapper } from "@/types/error.js";
import { DatabaseError } from "pg";
import {
  CONTENT_NOT_EMPTY,
  EMAIL_FORMAT_CHECK,
  NAME_LENGTH_CHECK,
  TITLE_LENGTH_CHECK,
  USERNAME_CHARS_CHECK,
  USERNAME_LENGTH_CHECK,
  USER_TEAM_IDX,
  FIRST_NAME_LENGTH_CHECK,
  LAST_NAME_LENGTH_CHECK,
} from "@repo/db/constraints";

// ─── Unique Constraint Messages (PG error code: 23505) ───────────────────────
// Constraint names follow Drizzle/Postgres naming: <table>_<column>_key or
// named uniqueIndex identifiers defined in the schema.

const UNIQUE_CONSTRAINT_MESSAGES: Readonly<Record<string, string>> = {
  // users (Postgres default naming: <table>_<column>_key)
  users_username_key: "This username is already taken.",
  users_email_key: "An account with this email already exists.",

  // team membership (schema-defined uniqueIndex)
  [USER_TEAM_IDX]: "User is already a member of this team.",
};

// ─── Foreign Key Constraint Messages (PG error code: 23503) ──────────────────
// Scenario A: Insert/Update — parent record missing
// Scenario B: Delete — child records block deletion (onDelete: "restrict")

const FOREIGN_KEY_CONSTRAINT_MESSAGES: Readonly<Record<string, string>> = {
  // organizations → users (onDelete: restrict — blocks deletion of user who is an admin)
  organizations_admin_id_users_id_fkey: "The specified user does not exist.",

  // teams → organizations (onDelete: cascade — parent missing on insert)
  teams_organization_id_organizations_id_fkey:
    "The specified organization does not exist.",

  // boards → teams (onDelete: cascade — parent missing on insert)
  boards_team_id_teams_id_fkey: "The specified team does not exist.",

  // sections → boards (onDelete: cascade — parent missing on insert)
  sections_board_id_boards_id_fkey: "The specified board does not exist.",

  // issues → sections (onDelete: cascade — parent missing on insert)
  issues_section_id_sections_id_fkey: "The specified section does not exist.",

  // issues → users (onDelete: set null — assignee missing on insert)
  issues_assigned_to_id_users_id_fkey:
    "The specified user to assign does not exist.",

  // comments → users (onDelete: cascade — parent missing on insert)
  comments_commented_by_users_id_fkey:
    "The user who commented could not be found.",

  // comments → issues (onDelete: cascade — parent missing on insert)
  comments_issue_id_issues_id_fkey: "The specified issue does not exist.",

  // membership → users (onDelete: cascade — parent missing on insert)
  team_memberships_user_id_users_id_fkey:
    "The specified user account does not exist.",

  // membership → organizations (onDelete: cascade — parent missing on insert)
  team_memberships_team_id_teams_id_fkey: "The specified team does not exist.",
};

// ─── Restrict Constraint Messages (PG error code: 23001) ──────────────────────

const RESTRICT_CONSTRAINT_MESSAGES: Readonly<Record<string, string>> = {
  // organizations → users (onDelete: restrict — blocks deletion of user who is an admin)
  organizations_admin_id_users_id_fkey:
    "Cannot delete this user because they are an admin of an organization.",
};

// ─── Check Constraint Messages (PG error code: 23514) ────────────────────────

const CHECK_CONSTRAINT_MESSAGES: Readonly<Record<string, string>> = {
  // users (schema-defined names)
  [EMAIL_FORMAT_CHECK]: "The provided email address is not valid.",
  [USERNAME_CHARS_CHECK]:
    "Username may only contain lowercase letters, numbers, underscores, and dots.",
  [USERNAME_LENGTH_CHECK]: "Username must be between 1 and 30 characters.",

  // organizations & boards (shared schema-defined name)
  [NAME_LENGTH_CHECK]: "Name must be between 1 and 100 characters.",

  // sections & issues (shared schema-defined name)
  [TITLE_LENGTH_CHECK]: "Title must be between 1 and 200 characters.",

  // comments (schema-defined name)
  [CONTENT_NOT_EMPTY]: "Comment content cannot be empty or blank.",

  [FIRST_NAME_LENGTH_CHECK]: "First name must be between 1 and 50 characters.",
  [LAST_NAME_LENGTH_CHECK]: "Last name must be between 1 and 50 characters.",
};

// ─── Not-Null Constraint Column Messages (PG error code: 23502) ──────────────

const NOT_NULL_COLUMN_MESSAGES: Readonly<Record<string, string>> = {
  // users
  email: "Email address is required.",

  // organizations
  admin_id: "Admin is required.",

  // teams
  organization_id: "Organization is required.",

  // boards
  team_id: "Team is required.",
  title: "Title is required.",
  position: "Position is required.",

  // issues
  section_id: "Section is required.",
  assigned_to_id: "Assignee is required.",

  // comments
  content: "Comment content is required.",
  commented_by_id: "Author information is required.",
  issue_id: "Issue reference is required.",

  // team memberships
  user_id: "User reference is required.",
  role: "Member role is required.",
};

// ─── Mapper ───────────────────────────────────────────────────────────────────

export const dbErrorMapper = (err: DatabaseError): ErrorMapper => {
  console.error({
    message: err.message,
    code: err.code,
    detail: err.detail,
    constraint: err.constraint,
    table: err.table,
    column: err.column,
    schema: err.schema,
  });

  switch (err.code) {
    // Unique violation
    case "23505": {
      const message =
        (err.constraint && UNIQUE_CONSTRAINT_MESSAGES[err.constraint]) ||
        "Resource already exists.";
      return {
        message,
        statusCode: 409,
      };
    }

    // Foreign key violation
    case "23503": {
      const message =
        (err.constraint && FOREIGN_KEY_CONSTRAINT_MESSAGES[err.constraint]) ||
        "Related resource does not exist.";
      return {
        message,
        statusCode: 409,
      };
    }

    // Not-null violation
    case "23502": {
      const message =
        (err.column && NOT_NULL_COLUMN_MESSAGES[err.column]) ||
        (err.column
          ? `${err.column} is required.`
          : "Required field is missing.");
      return {
        message,
        statusCode: 400,
      };
    }

    // Check constraint violation
    case "23514": {
      const message =
        (err.constraint && CHECK_CONSTRAINT_MESSAGES[err.constraint]) ||
        "Data violates business rules.";
      return {
        message,
        statusCode: 400,
      };
    }

    // Invalid text representation (e.g. malformed UUID, bad enum value)
    case "22P02": {
      return {
        message: "Invalid input format.",
        statusCode: 400,
      };
    }

    // String data right truncation (value too long for column)
    case "22001": {
      return {
        message: "The provided value exceeds the maximum allowed length.",
        statusCode: 400,
      };
    }

    // Exclusion constraint violation
    case "23P01": {
      return {
        message: "This record conflicts with an existing entry.",
        statusCode: 409,
      };
    }

    // Restrict violation (triggered by onDelete: "restrict")
    case "23001": {
      const message =
        (err.constraint && RESTRICT_CONSTRAINT_MESSAGES[err.constraint]) ||
        "Cannot delete this resource because it is referenced by other records.";
      return {
        message,
        statusCode: 409,
      };
    }

    // Numeric value out of range
    case "22003": {
      return {
        message: "The provided numeric value is out of the allowed range.",
        statusCode: 400,
      };
    }

    // Deadlock detected
    case "40P01": {
      return {
        message: "A conflict occurred. Please try again.",
        statusCode: 409,
      };
    }

    // Serialization failure (concurrent update collision)
    case "40001": {
      return {
        message:
          "The request could not be completed due to a conflict. Please retry.",
        statusCode: 409,
      };
    }

    // Undefined column / relation (schema mismatch — developer error)
    case "42703":
    case "42P01": {
      return {
        message: "Something went wrong.",
        statusCode: 500,
      };
    }

    default:
      return {
        message: "Something went wrong.",
        statusCode: 500,
      };
  }
};
