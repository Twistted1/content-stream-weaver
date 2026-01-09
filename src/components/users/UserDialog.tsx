import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { User, roles, permissions, rolePermissions } from "./usersData";

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
  onSave: (data: Partial<User>) => void;
  mode: "create" | "edit" | "role";
}

export const UserDialog = ({
  open,
  onOpenChange,
  user,
  onSave,
  mode,
}: UserDialogProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<User["role"]>("member");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
      setSelectedPermissions(user.permissions);
    } else {
      setName("");
      setEmail("");
      setRole("member");
      setSelectedPermissions(rolePermissions.member);
    }
  }, [user, open]);

  const handleRoleChange = (newRole: User["role"]) => {
    setRole(newRole);
    setSelectedPermissions(rolePermissions[newRole] || []);
  };

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((p) => p !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSave = () => {
    if (mode === "create") {
      onSave({
        name: name || email.split("@")[0],
        email,
        role,
        status: "pending",
        permissions: selectedPermissions,
      });
    } else if (mode === "role") {
      onSave({ role, permissions: selectedPermissions });
    } else {
      onSave({ name, email, permissions: selectedPermissions });
    }
    onOpenChange(false);
  };

  const getTitle = () => {
    switch (mode) {
      case "create":
        return "Invite Team Member";
      case "role":
        return "Change Role";
      default:
        return "Edit User";
    }
  };

  const getDescription = () => {
    switch (mode) {
      case "create":
        return "Send an invitation to join your team";
      case "role":
        return `Update role and permissions for ${user?.name}`;
      default:
        return "Update user information and permissions";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {mode !== "role" && (
            <>
              {mode === "edit" && (
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  disabled={mode === "edit"}
                />
              </div>
            </>
          )}

          {(mode === "create" || mode === "role") && (
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={role} onValueChange={(v) => handleRoleChange(v as User["role"])}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      <div>
                        <div className="font-medium">{r.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {r.description}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label>Permissions</Label>
            <div className="border rounded-lg p-3 space-y-3 max-h-48 overflow-y-auto">
              {permissions.map((permission) => (
                <div key={permission.id} className="flex items-start space-x-3">
                  <Checkbox
                    id={permission.id}
                    checked={selectedPermissions.includes(permission.id)}
                    onCheckedChange={() => handlePermissionToggle(permission.id)}
                  />
                  <div className="grid gap-0.5">
                    <label
                      htmlFor={permission.id}
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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={mode === "create" && !email}>
            {mode === "create" ? "Send Invitation" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
