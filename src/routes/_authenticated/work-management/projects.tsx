import { createFileRoute } from '@tanstack/react-router'
import { useWorkManagementStore } from '@/stores/workManagementStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { PlusIcon, Pencil2Icon, TrashIcon } from '@radix-ui/react-icons'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export const Route = createFileRoute('/_authenticated/work-management/projects')({
  component: ProjectsPage,
})

export default function ProjectsPage() {
  const { organizations, addProject, updateProject, deleteProject, currentUser } = useWorkManagementStore()
  const [selectedOrgId, setSelectedOrgId] = useState<string>('')
  const [selectedDeptId, setSelectedDeptId] = useState<string>('')
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectDescription, setNewProjectDescription] = useState('')
  const [editProjectId, setEditProjectId] = useState<string | null>(null)
  const [editProjectName, setEditProjectName] = useState('')
  const [editProjectDescription, setEditProjectDescription] = useState('')

  const handleAddProject = () => {
    if (selectedDeptId && newProjectName.trim()) {
      addProject(selectedDeptId, newProjectName, newProjectDescription)
      setNewProjectName('')
      setNewProjectDescription('')
    }
  }

  const handleEditProject = () => {
    if (editProjectId && editProjectName.trim()) {
      updateProject(editProjectId, editProjectName, editProjectDescription)
      setEditProjectId(null)
    }
  }

  const openEditDialog = (project: { id: string; name: string; description: string }) => {
    setEditProjectId(project.id)
    setEditProjectName(project.name)
    setEditProjectDescription(project.description)
  }

  const selectedOrg = organizations.find(org => org.id === selectedOrgId)
  const departments = selectedOrg ? selectedOrg.departments : []
  const selectedDept = departments.find(dept => dept.id === selectedDeptId)
  
  const isAdmin = currentUser?.role === 'Admin'
  const isManagerOrAdmin = currentUser?.role === 'Admin' || currentUser?.role === 'Manager'

  const handleOrgChange = (orgId: string) => {
    setSelectedOrgId(orgId)
    setSelectedDeptId('')
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Projects</h2>
        
        <div className="flex items-center gap-2">
          <Select value={selectedOrgId} onValueChange={handleOrgChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select organization" />
            </SelectTrigger>
            <SelectContent>
              {organizations.map(org => (
                <SelectItem key={org.id} value={org.id}>
                  {org.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select 
            value={selectedDeptId} 
            onValueChange={setSelectedDeptId}
            disabled={!selectedOrgId || departments.length === 0}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map(dept => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {isManagerOrAdmin && selectedDeptId && (
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add Project
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Project</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      placeholder="Project name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newProjectDescription}
                      onChange={(e) => setNewProjectDescription(e.target.value)}
                      placeholder="Project description"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button onClick={handleAddProject}>Save</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Edit Project Dialog */}
      <Dialog open={!!editProjectId} onOpenChange={(open) => !open && setEditProjectId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editProjectName}
                onChange={(e) => setEditProjectName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editProjectDescription}
                onChange={(e) => setEditProjectDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditProjectId(null)}>
              Cancel
            </Button>
            <Button onClick={handleEditProject}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {!selectedOrgId ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Please select an organization and department to view projects.</p>
        </div>
      ) : !selectedDeptId ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Please select a department to view its projects.</p>
        </div>
      ) : selectedDept?.projects.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No projects found in this department. Add one to get started.</p>
        </div>
      ) : (
        <ScrollArea className="h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedDept?.projects.map((project) => (
              <Card key={project.id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle>{project.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                  <div className="mt-4">
                    <p className="text-sm font-medium">Teams: {project.teams.length}</p>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/50 p-2">
                  <div className="flex justify-end space-x-2 w-full">
                    {isManagerOrAdmin && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openEditDialog(project)}
                        >
                          <Pencil2Icon className="h-4 w-4" />
                        </Button>
                        {isAdmin && (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => deleteProject(project.id)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
} 