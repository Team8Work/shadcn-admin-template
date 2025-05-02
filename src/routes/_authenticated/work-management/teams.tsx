import { createFileRoute } from '@tanstack/react-router'
import { useWorkManagementStore, availableUsers } from '@/stores/workManagementStore'
import { Button } from '@/components/ui/button'
import { PlusIcon, Pencil2Icon, TrashIcon } from '@radix-ui/react-icons'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Role } from '@/types/workManagement'

export const Route = createFileRoute('/_authenticated/work-management/teams')({
  component: TeamsPage,
})

function TeamsPage() {
  const { 
    organizations, 
    addTeam, 
    updateTeam, 
    deleteTeam, 
    addTeamMember, 
    updateTeamMember, 
    deleteTeamMember, 
    currentUser 
  } = useWorkManagementStore()
  
  const [selectedOrgId, setSelectedOrgId] = useState<string>('')
  const [selectedDeptId, setSelectedDeptId] = useState<string>('')
  const [selectedProjectId, setSelectedProjectId] = useState<string>('')
  
  // New Team State
  const [newTeamName, setNewTeamName] = useState('')
  const [newTeamDescription, setNewTeamDescription] = useState('')
  
  // Edit Team State
  const [editTeamId, setEditTeamId] = useState<string | null>(null)
  const [editTeamName, setEditTeamName] = useState('')
  const [editTeamDescription, setEditTeamDescription] = useState('')
  
  // New Team Member State
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)
  const [newMemberUserId, setNewMemberUserId] = useState('')
  const [newMemberRole, setNewMemberRole] = useState<Role>('Member')
  const [newMemberResponsibilities, setNewMemberResponsibilities] = useState('')
  
  // Edit Team Member State
  const [editMemberId, setEditMemberId] = useState<string | null>(null)
  const [editMemberRole, setEditMemberRole] = useState<Role>('Member')
  const [editMemberResponsibilities, setEditMemberResponsibilities] = useState('')

  // Handlers
  const handleAddTeam = () => {
    if (selectedProjectId && newTeamName.trim()) {
      addTeam(selectedProjectId, newTeamName, newTeamDescription)
      setNewTeamName('')
      setNewTeamDescription('')
    }
  }

  const handleEditTeam = () => {
    if (editTeamId && editTeamName.trim()) {
      updateTeam(editTeamId, editTeamName, editTeamDescription)
      setEditTeamId(null)
    }
  }

  const handleAddTeamMember = () => {
    if (selectedTeamId && newMemberUserId) {
      const responsibilities = newMemberResponsibilities.split(',').map(r => r.trim()).filter(Boolean)
      addTeamMember(selectedTeamId, newMemberUserId, newMemberRole, responsibilities)
      setNewMemberUserId('')
      setNewMemberRole('Member')
      setNewMemberResponsibilities('')
    }
  }

  const handleEditTeamMember = () => {
    if (editMemberId) {
      const responsibilities = editMemberResponsibilities.split(',').map(r => r.trim()).filter(Boolean)
      updateTeamMember(editMemberId, editMemberRole, responsibilities)
      setEditMemberId(null)
    }
  }

  const openEditTeamDialog = (team: { id: string; name: string; description: string }) => {
    setEditTeamId(team.id)
    setEditTeamName(team.name)
    setEditTeamDescription(team.description)
  }

  const openEditMemberDialog = (member: { id: string; role: Role; responsibilities: string[] }) => {
    setEditMemberId(member.id)
    setEditMemberRole(member.role)
    setEditMemberResponsibilities(member.responsibilities.join(', '))
  }

  const handleOrgChange = (orgId: string) => {
    setSelectedOrgId(orgId)
    setSelectedDeptId('')
    setSelectedProjectId('')
  }

  const handleDeptChange = (deptId: string) => {
    setSelectedDeptId(deptId)
    setSelectedProjectId('')
  }

  // Derived state
  const selectedOrg = organizations.find(org => org.id === selectedOrgId)
  const departments = selectedOrg ? selectedOrg.departments : []
  const selectedDept = departments.find(dept => dept.id === selectedDeptId)
  const projects = selectedDept ? selectedDept.projects : []
  const selectedProject = projects.find(proj => proj.id === selectedProjectId)
  
  const isAdmin = currentUser?.role === 'Admin'
  const isManagerOrAdmin = currentUser?.role === 'Admin' || currentUser?.role === 'Manager'

  const getUserName = (userId: string) => {
    const user = availableUsers.find(u => u.id === userId)
    return user ? user.name : 'Unknown User'
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Teams</h2>
        
        <div className="flex items-center gap-2">
          <Select value={selectedOrgId} onValueChange={handleOrgChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Organization" />
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
            onValueChange={handleDeptChange}
            disabled={!selectedOrgId || departments.length === 0}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map(dept => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select 
            value={selectedProjectId} 
            onValueChange={setSelectedProjectId}
            disabled={!selectedDeptId || projects.length === 0}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map(proj => (
                <SelectItem key={proj.id} value={proj.id}>
                  {proj.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {isManagerOrAdmin && selectedProjectId && (
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add Team
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Team</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                      placeholder="Team name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newTeamDescription}
                      onChange={(e) => setNewTeamDescription(e.target.value)}
                      placeholder="Team description"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button onClick={handleAddTeam}>Save</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Edit Team Dialog */}
      <Dialog open={!!editTeamId} onOpenChange={(open) => !open && setEditTeamId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Team</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editTeamName}
                onChange={(e) => setEditTeamName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editTeamDescription}
                onChange={(e) => setEditTeamDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTeamId(null)}>
              Cancel
            </Button>
            <Button onClick={handleEditTeam}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Team Member Dialog */}
      <Dialog open={!!editMemberId} onOpenChange={(open) => !open && setEditMemberId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select value={editMemberRole} onValueChange={(value) => setEditMemberRole(value as Role)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-responsibilities">Responsibilities</Label>
              <Textarea
                id="edit-responsibilities"
                value={editMemberResponsibilities}
                onChange={(e) => setEditMemberResponsibilities(e.target.value)}
                placeholder="Comma-separated list of responsibilities"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditMemberId(null)}>
              Cancel
            </Button>
            <Button onClick={handleEditTeamMember}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {!selectedOrgId || !selectedDeptId || !selectedProjectId ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Please select an organization, department, and project to view teams.</p>
        </div>
      ) : selectedProject?.teams.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No teams found in this project. Add one to get started.</p>
        </div>
      ) : (
        <ScrollArea className="h-[60vh]">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {selectedProject?.teams.map((team) => (
              <AccordionItem key={team.id} value={team.id} className="border rounded-lg overflow-hidden">
                <AccordionTrigger className="px-4 py-2 hover:bg-accent hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div>
                      <h3 className="text-lg font-medium">{team.name}</h3>
                      <p className="text-sm text-muted-foreground">{team.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{team.members.length} members</Badge>
                      
                      {isManagerOrAdmin && (
                        <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openEditTeamDialog(team)}
                          >
                            <Pencil2Icon className="h-4 w-4" />
                          </Button>
                          {isAdmin && (
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => deleteTeam(team.id)}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-md font-medium">Team Members</h4>
                    
                    {isManagerOrAdmin && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" onClick={() => setSelectedTeamId(team.id)}>
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Add Member
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Team Member</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="user">User</Label>
                              <Select value={newMemberUserId} onValueChange={setNewMemberUserId}>
                                <SelectTrigger>
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
                            <div className="grid gap-2">
                              <Label htmlFor="role">Role</Label>
                              <Select value={newMemberRole} onValueChange={(value) => setNewMemberRole(value as Role)}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Admin">Admin</SelectItem>
                                  <SelectItem value="Manager">Manager</SelectItem>
                                  <SelectItem value="Member">Member</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="responsibilities">Responsibilities</Label>
                              <Textarea
                                id="responsibilities"
                                value={newMemberResponsibilities}
                                onChange={(e) => setNewMemberResponsibilities(e.target.value)}
                                placeholder="Comma-separated list of responsibilities"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button onClick={handleAddTeamMember}>Add Member</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                  
                  {team.members.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">No members in this team yet.</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Responsibilities</TableHead>
                          {isManagerOrAdmin && <TableHead className="text-right">Actions</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {team.members.map((member) => (
                          <TableRow key={member.id}>
                            <TableCell>{getUserName(member.userId)}</TableCell>
                            <TableCell>
                              <Badge variant={member.role === 'Admin' ? 'default' : (member.role === 'Manager' ? 'secondary' : 'outline')}>
                                {member.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {member.responsibilities.map((resp, index) => (
                                  <Badge key={index} variant="outline" className="bg-background">
                                    {resp}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            {isManagerOrAdmin && (
                              <TableCell className="text-right">
                                <div className="flex justify-end space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => openEditMemberDialog(member)}
                                  >
                                    <Pencil2Icon className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => deleteTeamMember(member.id)}
                                  >
                                    <TrashIcon className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollArea>
      )}
    </div>
  )
} 