import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface EditRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (roleData: any) => void;
  role: any;
  loading?: boolean;
}

export function EditRoleDialog({ open, onOpenChange, onSubmit, role, loading = false }: EditRoleDialogProps) {
  const [formData, setFormData] = useState({
    display_name: role?.display_name || '',
    description: role?.description || '',
    color: role?.color || '#6B7280'
  });

  React.useEffect(() => {
    if (role) {
      setFormData({
        display_name: role.display_name || '',
        description: role.description || '',
        color: role.color || '#6B7280'
      });
    }
  }, [role]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Role: {role?.display_name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit_role_display_name">Display Name *</Label>
              <Input
                id="edit_role_display_name"
                value={formData.display_name}
                onChange={(e) => setFormData({...formData, display_name: e.target.value})}
                placeholder="Custom Role"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit_role_description">Description</Label>
              <Textarea
                id="edit_role_description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Describe the role's purpose and responsibilities"
              />
            </div>
            <div>
              <Label htmlFor="edit_role_color">Color</Label>
              <Input
                id="edit_role_color"
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({...formData, color: e.target.value})}
              />
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
              {loading ? "Updating..." : "Update Role"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}