import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/work-management/')({
  component: WorkManagementIndex,
})

function WorkManagementIndex() {
  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg shadow-sm p-4 border">
          <h3 className="font-medium mb-2">Organizations</h3>
          <p className="text-muted-foreground text-sm">Manage your organization structure</p>
        </div>
        <div className="bg-card rounded-lg shadow-sm p-4 border">
          <h3 className="font-medium mb-2">Departments</h3>
          <p className="text-muted-foreground text-sm">Organize departments within organizations</p>
        </div>
        <div className="bg-card rounded-lg shadow-sm p-4 border">
          <h3 className="font-medium mb-2">Projects</h3>
          <p className="text-muted-foreground text-sm">Track projects across departments</p>
        </div>
        <div className="bg-card rounded-lg shadow-sm p-4 border">
          <h3 className="font-medium mb-2">Teams</h3>
          <p className="text-muted-foreground text-sm">Manage teams and team members</p>
        </div>
      </div>
    </div>
  )
} 