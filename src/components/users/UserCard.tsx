import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MoreHorizontal, 
  Edit, 
  Key, 
  Trash2, 
  UserCheck, 
  UserX,
  Copy,
} from "lucide-react";
import { User, getStatusColor, getRoleColor } from "./usersData";

interface UserCardProps {
  user: User;
  selected: boolean;
  onSelect: (checked: boolean) => void;
  onEdit: () => void;
  onChangeRole: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
}

export const UserCard = ({
  user,
  selected,
  onSelect,
  onEdit,
  onChangeRole,
  onToggleStatus,
  onDelete,
}: UserCardProps) => {
  const statusColor = getStatusColor(user.status);
  const roleColor = getRoleColor(user.role);

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
      <Checkbox
        checked={selected}
        onCheckedChange={onSelect}
        aria-label={`Select ${user.name}`}
      />
      
      <Avatar className="h-10 w-10">
        <AvatarImage src={user.avatar} />
        <AvatarFallback>
          {user.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{user.name}</div>
        <div className="text-sm text-muted-foreground truncate">{user.email}</div>
      </div>

      <Badge className={roleColor} variant={roleColor ? undefined : "outline"}>
        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
      </Badge>

      <Badge className={statusColor} variant={statusColor ? undefined : "secondary"}>
        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
      </Badge>

      <div className="text-sm text-muted-foreground hidden md:block w-24">
        {user.lastActive}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit User
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onChangeRole}>
            <Key className="mr-2 h-4 w-4" />
            Change Role
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.email)}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Email
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onToggleStatus}>
            {user.status === "active" ? (
              <>
                <UserX className="mr-2 h-4 w-4" />
                Deactivate
              </>
            ) : (
              <>
                <UserCheck className="mr-2 h-4 w-4" />
                Activate
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Remove User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
