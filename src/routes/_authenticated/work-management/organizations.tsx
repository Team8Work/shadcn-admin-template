import { createFileRoute } from '@tanstack/react-router'
import { useWorkManagementStore } from '@/stores/workManagementStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { PlusIcon, Pencil2Icon, TrashIcon } from '@radix-ui/react-icons'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'

export const Route = createFileRoute('/_authenticated/work-management/organizations')({
  component: OrganizationsPage,
})

export default function OrganizationsPage() {
  const { organizations, addOrganization, updateOrganization, deleteOrganization, currentUser } = useWorkManagementStore()
  const [newOrgName, setNewOrgName] = useState('')
  const [newOrgDescription, setNewOrgDescription] = useState('')
  const [editOrgId, setEditOrgId] = useState<string | null>(null)
  const [editOrgName, setEditOrgName] = useState('')
  const [editOrgDescription, setEditOrgDescription] = useState('')

  const handleAddOrganization = () => {
    if (newOrgName.trim()) {
      addOrganization(newOrgName, newOrgDescription)
      setNewOrgName('')
      setNewOrgDescription('')
    }
  }

  const handleEditOrganization = () => {
    if (editOrgId && editOrgName.trim()) {
      updateOrganization(editOrgId, editOrgName, editOrgDescription)
      setEditOrgId(null)
    }
  }

  const openEditDialog = (org: { id: string; name: string; description: string }) => {
    setEditOrgId(org.id)
    setEditOrgName(org.name)
    setEditOrgDescription(org.description)
  }

  const isAdmin = currentUser?.role === 'Admin'

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Organizations</h2>
        
        {isAdmin && (
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Organization
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Organization</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newOrgName}
                    onChange={(e) => setNewOrgName(e.target.value)}
                    placeholder="Organization name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newOrgDescription}
                    onChange={(e) => setNewOrgDescription(e.target.value)}
                    placeholder="Organization description"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button onClick={handleAddOrganization}>Save</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Edit Organization Dialog */}
      <Dialog open={!!editOrgId} onOpenChange={(open) => !open && setEditOrgId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Organization</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editOrgName}
                onChange={(e) => setEditOrgName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editOrgDescription}
                onChange={(e) => setEditOrgDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOrgId(null)}>
              Cancel
            </Button>
            <Button onClick={handleEditOrganization}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {organizations.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No organizations found. Add one to get started.</p>
        </div>
      ) : (
        <ScrollArea className="h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {organizations.map((org) => (
              <Card key={org.id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle>{org.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{org.description}</p>
                  <div className="mt-4">
                    <p className="text-sm font-medium">Departments: {org.departments.length}</p>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/50 p-2">
                  <div className="flex justify-end space-x-2 w-full">
                    {isAdmin && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openEditDialog(org)}
                        >
                          <Pencil2Icon className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => deleteOrganization(org.id)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
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