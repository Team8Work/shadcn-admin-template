export type Role = 'Admin' | 'Manager' | 'Member';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface TeamMember {
  id: string;
  userId: string;
  teamId: string;
  role: Role;
  responsibilities: string[];
}

export interface Team {
  id: string;
  name: string;
  projectId: string;
  description: string;
  members: TeamMember[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  departmentId: string;
  teams: Team[];
}

export interface Department {
  id: string;
  name: string;
  organizationId: string;
  projects: Project[];
}

export interface Organization {
  id: string;
  name: string;
  description: string;
  departments: Department[];
} 