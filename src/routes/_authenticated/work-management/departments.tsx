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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export const Route = createFileRoute('/_authenticated/work-management/departments')({
  component: DepartmentsPage,
})

export default function DepartmentsPage() {
  const { organizations, addDepartment, updateDepartment, deleteDepartment, currentUser } = useWorkManagementStore()
  const [selectedOrgId, setSelectedOrgId] = useState<string>('')
  const [newDeptName, setNewDeptName] = useState('')
  const [editDeptId, setEditDeptId] = useState<string | null>(null)
  const [editDeptName, setEditDeptName] = useState('')

  const handleAddDepartment = () => {
    if (selectedOrgId && newDeptName.trim()) {
      addDepartment(selectedOrgId, newDeptName)
      setNewDeptName('')
    }
  }

  const handleEditDepartment = () => {
    if (editDeptId && editDeptName.trim()) {
      updateDepartment(editDeptId, editDeptName)
      setEditDeptId(null)
    }
  }

  const openEditDialog = (dept: { id: string; name: string }) => {
    setEditDeptId(dept.id)
    setEditDeptName(dept.name)
  }

  const selectedOrg = organizations.find(org => org.id === selectedOrgId)
  const isAdmin = currentUser?.role === 'Admin'
  const isManagerOrAdmin = currentUser?.role === 'Admin' || currentUser?.role === 'Manager'

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Departments</h2>
        
        <div className="flex items-center gap-2">
          <Select value={selectedOrgId} onValueChange={setSelectedOrgId}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select an organization" />
            </SelectTrigger>
            <SelectContent>
              {organizations.map(org => (
                <SelectItem key={org.id} value={org.id}>
                  {org.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {isManagerOrAdmin && selectedOrgId && (
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add Department
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Department</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newDeptName}
                      onChange={(e) => setNewDeptName(e.target.value)}
                      placeholder="Department name"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button onClick={handleAddDepartment}>Save</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Edit Department Dialog */}
      <Dialog open={!!editDeptId} onOpenChange={(open) => !open && setEditDeptId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editDeptName}
                onChange={(e) => setEditDeptName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDeptId(null)}>
              Cancel
            </Button>
            <Button onClick={handleEditDepartment}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {!selectedOrgId ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Please select an organization to view its departments.</p>
        </div>
      ) : selectedOrg?.departments.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No departments found in this organization. Add one to get started.</p>
        </div>
      ) : (
        <ScrollArea className="h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedOrg?.departments.map((dept) => (
              <Card key={dept.id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle>{dept.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mt-2">
                    <p className="text-sm font-medium">Projects: {dept.projects.length}</p>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/50 p-2">
                  <div className="flex justify-end space-x-2 w-full">
                    {isManagerOrAdmin && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openEditDialog(dept)}
                        >
                          <Pencil2Icon className="h-4 w-4" />
                        </Button>
                        {isAdmin && (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => deleteDepartment(dept.id)}
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