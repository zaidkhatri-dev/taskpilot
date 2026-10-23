export interface EmailJobData {
  from: string;
  to: string;
  subject: string;
  html: string;
}

export const TeamMemberShipEnum = { member: "member", admin: "admin" };
