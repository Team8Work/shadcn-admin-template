import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { 
  Organization, 
  Department, 
  Project, 
  Team, 
  TeamMember, 
  User, 
  Role 
} from '../types/workManagement';

// Sample data for initial state
const sampleData: {
  organizations: Organization[];
  currentUser: User | null;
} = {
  organizations: [
    {
      id: '1',
      name: 'Acme Corporation',
      description: 'A global manufacturing company',
      departments: [
        {
          id: '101',
          name: 'Engineering',
          organizationId: '1',
          projects: [
            {
              id: '1001',
              name: 'Product Redesign',
              description: 'Redesigning our flagship product',
              departmentId: '101',
              teams: [
                {
                  id: '10001',
                  name: 'UI Team',
                  projectId: '1001',
                  description: 'Responsible for user interface redesign',
                  members: [
                    {
                      id: '100001',
                      userId: 'user2',
                      teamId: '10001',
                      role: 'Manager',
                      responsibilities: ['UI Design', 'User Testing']
                    },
                    {
                      id: '100002',
                      userId: 'user3',
                      teamId: '10001',
                      role: 'Member',
                      responsibilities: ['Frontend Development']
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: '102',
          name: 'Marketing',
          organizationId: '1',
          projects: [
            {
              id: '1002',
              name: 'Q4 Campaign',
              description: 'Marketing campaign for the fourth quarter',
              departmentId: '102',
              teams: [
                {
                  id: '10002',
                  name: 'Content Team',
                  projectId: '1002',
                  description: 'Responsible for content creation',
                  members: []
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  currentUser: {
    id: 'user1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'Admin'
  }
};

// Available users for team member assignment
export const availableUsers: User[] = [
  {
    id: 'user1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'Admin'
  },
  {
    id: 'user2',
    name: 'Manager User',
    email: 'manager@example.com',
    role: 'Manager'
  },
  {
    id: 'user3',
    name: 'Team Member',
    email: 'member@example.com',
    role: 'Member'
  },
  {
    id: 'user4',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Member'
  },
  {
    id: 'user5',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'Manager'
  }
];

interface WorkManagementState {
  organizations: Organization[];
  currentUser: User | null;
  switchUser: (userId: string) => void;
  
  // Organization operations
  addOrganization: (name: string, description: string) => void;
  updateOrganization: (id: string, name: string, description: string) => void;
  deleteOrganization: (id: string) => void;
  
  // Department operations
  addDepartment: (organizationId: string, name: string) => void;
  updateDepartment: (id: string, name: string) => void;
  deleteDepartment: (id: string) => void;
  
  // Project operations
  addProject: (departmentId: string, name: string, description: string) => void;
  updateProject: (id: string, name: string, description: string) => void;
  deleteProject: (id: string) => void;
  
  // Team operations
  addTeam: (projectId: string, name: string, description: string) => void;
  updateTeam: (id: string, name: string, description: string) => void;
  deleteTeam: (id: string) => void;
  
  // Team member operations
  addTeamMember: (teamId: string, userId: string, role: Role, responsibilities: string[]) => void;
  updateTeamMember: (id: string, role: Role, responsibilities: string[]) => void;
  deleteTeamMember: (id: string) => void;
}

export const useWorkManagementStore = create<WorkManagementState>()(
  persist(
    (set) => ({
      organizations: sampleData.organizations,
      currentUser: sampleData.currentUser,
      
      switchUser: (userId) => 
        set((state) => {
          const user = availableUsers.find(user => user.id === userId);
          return { ...state, currentUser: user || null };
        }),
      
      // Organization operations
      addOrganization: (name, description) => 
        set((state) => ({
          organizations: [
            ...state.organizations,
            {
              id: uuidv4(),
              name,
              description,
              departments: []
            }
          ]
        })),
      
      updateOrganization: (id, name, description) => 
        set((state) => ({
          organizations: state.organizations.map(org => 
            org.id === id ? { ...org, name, description } : org
          )
        })),
      
      deleteOrganization: (id) => 
        set((state) => ({
          organizations: state.organizations.filter(org => org.id !== id)
        })),
      
      // Department operations
      addDepartment: (organizationId, name) => 
        set((state) => ({
          organizations: state.organizations.map(org => 
            org.id === organizationId
              ? { 
                  ...org, 
                  departments: [
                    ...org.departments,
                    {
                      id: uuidv4(),
                      name,
                      organizationId,
                      projects: []
                    }
                  ]
                }
              : org
          )
        })),
      
      updateDepartment: (id, name) => 
        set((state) => ({
          organizations: state.organizations.map(org => ({
            ...org,
            departments: org.departments.map(dept => 
              dept.id === id ? { ...dept, name } : dept
            )
          }))
        })),
      
      deleteDepartment: (id) => 
        set((state) => ({
          organizations: state.organizations.map(org => ({
            ...org,
            departments: org.departments.filter(dept => dept.id !== id)
          }))
        })),
      
      // Project operations
      addProject: (departmentId, name, description) => 
        set((state) => ({
          organizations: state.organizations.map(org => ({
            ...org,
            departments: org.departments.map(dept => 
              dept.id === departmentId
                ? {
                    ...dept,
                    projects: [
                      ...dept.projects,
                      {
                        id: uuidv4(),
                        name,
                        description,
                        departmentId,
                        teams: []
                      }
                    ]
                  }
                : dept
            )
          }))
        })),
      
      updateProject: (id, name, description) => 
        set((state) => ({
          organizations: state.organizations.map(org => ({
            ...org,
            departments: org.departments.map(dept => ({
              ...dept,
              projects: dept.projects.map(proj => 
                proj.id === id ? { ...proj, name, description } : proj
              )
            }))
          }))
        })),
      
      deleteProject: (id) => 
        set((state) => ({
          organizations: state.organizations.map(org => ({
            ...org,
            departments: org.departments.map(dept => ({
              ...dept,
              projects: dept.projects.filter(proj => proj.id !== id)
            }))
          }))
        })),
      
      // Team operations
      addTeam: (projectId, name, description) => 
        set((state) => ({
          organizations: state.organizations.map(org => ({
            ...org,
            departments: org.departments.map(dept => ({
              ...dept,
              projects: dept.projects.map(proj => 
                proj.id === projectId
                  ? {
                      ...proj,
                      teams: [
                        ...proj.teams,
                        {
                          id: uuidv4(),
                          name,
                          description,
                          projectId,
                          members: []
                        }
                      ]
                    }
                  : proj
              )
            }))
          }))
        })),
      
      updateTeam: (id, name, description) => 
        set((state) => ({
          organizations: state.organizations.map(org => ({
            ...org,
            departments: org.departments.map(dept => ({
              ...dept,
              projects: dept.projects.map(proj => ({
                ...proj,
                teams: proj.teams.map(team => 
                  team.id === id ? { ...team, name, description } : team
                )
              }))
            }))
          }))
        })),
      
      deleteTeam: (id) => 
        set((state) => ({
          organizations: state.organizations.map(org => ({
            ...org,
            departments: org.departments.map(dept => ({
              ...dept,
              projects: dept.projects.map(proj => ({
                ...proj,
                teams: proj.teams.filter(team => team.id !== id)
              }))
            }))
          }))
        })),
      
      // Team member operations
      addTeamMember: (teamId, userId, role, responsibilities) => 
        set((state) => ({
          organizations: state.organizations.map(org => ({
            ...org,
            departments: org.departments.map(dept => ({
              ...dept,
              projects: dept.projects.map(proj => ({
                ...proj,
                teams: proj.teams.map(team => 
                  team.id === teamId
                    ? {
                        ...team,
                        members: [
                          ...team.members,
                          {
                            id: uuidv4(),
                            userId,
                            teamId,
                            role,
                            responsibilities
                          }
                        ]
                      }
                    : team
                )
              }))
            }))
          }))
        })),
      
      updateTeamMember: (id, role, responsibilities) => 
        set((state) => ({
          organizations: state.organizations.map(org => ({
            ...org,
            departments: org.departments.map(dept => ({
              ...dept,
              projects: dept.projects.map(proj => ({
                ...proj,
                teams: proj.teams.map(team => ({
                  ...team,
                  members: team.members.map(member => 
                    member.id === id ? { ...member, role, responsibilities } : member
                  )
                }))
              }))
            }))
          }))
        })),
      
      deleteTeamMember: (id) => 
        set((state) => ({
          organizations: state.organizations.map(org => ({
            ...org,
            departments: org.departments.map(dept => ({
              ...dept,
              projects: dept.projects.map(proj => ({
                ...proj,
                teams: proj.teams.map(team => ({
                  ...team,
                  members: team.members.filter(member => member.id !== id)
                }))
              }))
            }))
          }))
        }))
    }),
    {
      name: 'work-management-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
); 