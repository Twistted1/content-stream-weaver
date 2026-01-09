import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { permissions } from "./usersData";

interface RoleConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: { value: string; label: string; description: string; color: string };
  currentPermissions: string[];
  onSave: (permissions: string[]) => void;
}

export const RoleConfigDialog = ({
  open,
  onOpenChange,
  role,
  currentPermissions,
  onSave,
}: RoleConfigDialogProps) => {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(currentPermissions);

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((p) => p !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSave = () => {
    onSave(selectedPermissions);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Configure {role.label} Role</DialogTitle>
          <DialogDescription>
            Set the default permissions for the {role.label.toLowerCase()} role
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="border rounded-lg p-3 space-y-3">
            {permissions.map((permission) => (
              <div key={permission.id} className="flex items-start space-x-3">
                <Checkbox
                  id={`role-${permission.id}`}
                  checked={selectedPermissions.includes(permission.id)}
                  onCheckedChange={() => handlePermissionToggle(permission.id)}
                />
                <div className="grid gap-0.5">
                  <label
                    htmlFor={`role-${permission.id}`}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {permission.label}
                  </label>
                  <p className="text-xs text-muted-foreground">
                    {permission.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Configuration</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
