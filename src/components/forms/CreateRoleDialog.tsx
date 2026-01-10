import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CreateRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (roleData: any) => void;
  loading?: boolean;
}

export function CreateRoleDialog({ open, onOpenChange, onSubmit, loading = false }: CreateRoleDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    display_name: '',
    description: '',
    color: '#6B7280'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    // Reset form
    setFormData({
      name: '',
      display_name: '',
      description: '',
      color: '#6B7280'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Role</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="role_name">Role Name *</Label>
              <Input
                id="role_name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="custom_role"
                required
              />
            </div>
            <div>
              <Label htmlFor="role_display_name">Display Name *</Label>
              <Input
                id="role_display_name"
                value={formData.display_name}
                onChange={(e) => setFormData({...formData, display_name: e.target.value})}
                placeholder="Custom Role"
                required
              />
            </div>
            <div>
              <Label htmlFor="role_description">Description</Label>
              <Textarea
                id="role_description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Describe the role's purpose and responsibilities"
              />
            </div>
            <div>
              <Label htmlFor="role_color">Color</Label>
              <Input
                id="role_color"
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
              {loading ? "Creating..." : "Create Role"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}