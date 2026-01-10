import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface AssignRolesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (selectedRoles: string[]) => void;
  user: any;
  roles: any[];
  currentRoles: string[];
  loading?: boolean;
}

export function AssignRolesDialog({ 
  open, 
  onOpenChange, 
  onSubmit, 
  user, 
  roles, 
  currentRoles, 
  loading = false 
}: AssignRolesDialogProps) {
  const [selectedRoles, setSelectedRoles] = useState<string[]>(currentRoles);

  React.useEffect(() => {
    setSelectedRoles(currentRoles);
  }, [currentRoles]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(selectedRoles);
  };

  const toggleRole = (roleId: string) => {
    setSelectedRoles(prev => 
      prev.includes(roleId) 
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Assign Roles: {user?.full_name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label>Select Roles</Label>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {roles.map(role => (
                  <div key={role.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`role-${role.id}`}
                      checked={selectedRoles.includes(role.id)}
                      onChange={() => toggleRole(role.id)}
                      className="rounded"
                    />
                    <label htmlFor={`role-${role.id}`} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: role.color }}
                      />
                      {role.display_name}
                      {role.is_system_role && (
                        <Badge variant="outline" className="text-xs">System</Badge>
                      )}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Assigning..." : "Assign Roles"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}