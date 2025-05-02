import { createFileRoute, Outlet, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { LuBriefcase } from 'react-icons/lu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useWorkManagementStore, availableUsers } from '@/stores/workManagementStore'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/work-management')({
  component: WorkManagementRoute,
})

export default function WorkManagementRoute() {
  const { currentUser, switchUser } = useWorkManagementStore()
  const navigate = useNavigate()
  
  // Determine active tab based on the current URL
  const pathname = window.location.pathname
  const activeTab = pathname.includes('/organizations') 
    ? 'organizations' 
    : pathname.includes('/departments')
    ? 'departments'
    : pathname.includes('/projects')
    ? 'projects'
    : pathname.includes('/teams')
    ? 'teams'
    : 'overview'

  const handleSwitchUser = (userId: string) => {
    switchUser(userId)
  }

  const handleTabChange = (value: string) => {
    switch (value) {
      case 'overview':
        navigate({ to: '/work-management' })
        break
      case 'organizations':
        navigate({ to: '/work-management/organizations' })
        break
      case 'departments':
        navigate({ to: '/work-management/departments' })
        break
      case 'projects':
        navigate({ to: '/work-management/projects' })
        break
      case 'teams':
        navigate({ to: '/work-management/teams' })
        break
    }
  }

  return (
    <div className="container mx-auto py-4">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LuBriefcase className="h-6 w-6" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Work Management System</h1>
            <p className="text-sm text-muted-foreground">
              Manage your organization's structure, departments, projects, and teams
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex flex-col mr-4">
            <span className="text-sm font-medium mb-1">Current User:</span>
            <Select value={currentUser?.id} onValueChange={handleSwitchUser}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                {availableUsers.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} ({user.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Link to="/">
            <Button variant="default">
              Dashboard
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Work Management</CardTitle>
          <CardDescription>
            View and manage your organizations, departments, projects, and teams
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="organizations">Organizations</TabsTrigger>
              <TabsTrigger value="departments">Departments</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="teams">Teams</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} className="space-y-4">
              {activeTab === 'overview' ? (
                <div>
                  <h2 className="text-xl font-semibold">Welcome to Work Management System</h2>
                  <p>Use the tabs above to navigate through different sections of the system.</p>
                </div>
              ) : (
                <Outlet />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
} 