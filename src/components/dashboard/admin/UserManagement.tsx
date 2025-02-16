import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, Pencil, Trash2, Shield } from "lucide-react";

export interface User {
  id: string;
  username: string;
  email: string;
  role: "admin" | "user" | "viewer";
  status: "active" | "inactive";
  lastLogin: string;
}

interface UserManagementProps {
  onStatusChange?: (status: { type: string; message: string }) => void;
}

const UserManagement = ({ onStatusChange }: UserManagementProps) => {
  const [users, setUsers] = useState<User[]>(defaultUsers);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<Partial<User>>({
    username: "",
    email: "",
    role: "user",
    status: "active",
  });

  const handleAddUser = () => {
    if (!newUser.username || !newUser.email) return;

    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      username: newUser.username,
      email: newUser.email,
      role: newUser.role as "admin" | "user" | "viewer",
      status: newUser.status as "active" | "inactive",
      lastLogin: "Never",
    };

    setUsers([...users, user]);
    setShowAddDialog(false);
    setNewUser({ username: "", email: "", role: "user", status: "active" });
    onStatusChange?.({ type: "success", message: "User added successfully" });
  };

  const handleEditUser = () => {
    if (!editingUser) return;

    setUsers(users.map((u) => (u.id === editingUser.id ? editingUser : u)));
    setEditingUser(null);
    onStatusChange?.({ type: "success", message: "User updated successfully" });
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((u) => u.id !== id));
    onStatusChange?.({ type: "success", message: "User deleted successfully" });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500/20 text-red-400";
      case "user":
        return "bg-green-500/20 text-green-400";
      case "viewer":
        return "bg-blue-500/20 text-blue-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    return status === "active"
      ? "bg-green-500/20 text-green-400"
      : "bg-gray-500/20 text-gray-400";
  };

  return (
    <div className="space-y-6 p-6">
      <Card className="bg-black border-green-500/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-green-400 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            User Management
          </CardTitle>
          <Button
            onClick={() => setShowAddDialog(true)}
            className="bg-green-500 hover:bg-green-600 text-black font-semibold"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-green-500/20">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-green-400">Username</TableHead>
                  <TableHead className="text-green-400">Email</TableHead>
                  <TableHead className="text-green-400">Role</TableHead>
                  <TableHead className="text-green-400">Status</TableHead>
                  <TableHead className="text-green-400">Last Login</TableHead>
                  <TableHead className="text-green-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group hover:bg-green-500/5"
                  >
                    <TableCell className="font-medium text-gray-300">
                      {user.username}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${getRoleBadgeColor(user.role)} capitalize`}
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${getStatusBadgeColor(
                          user.status,
                        )} capitalize`}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {user.lastLogin}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setEditingUser(user)}
                          className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteUser(user.id)}
                          className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-black border-green-500/50">
          <DialogHeader>
            <DialogTitle className="text-green-400">Add New User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-green-300">Username</Label>
              <Input
                value={newUser.username}
                onChange={(e) =>
                  setNewUser({ ...newUser, username: e.target.value })
                }
                className="bg-black border-green-500/50 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-green-300">Email</Label>
              <Input
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                className="bg-black border-green-500/50 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-green-300">Role</Label>
              <Select
                value={newUser.role}
                onValueChange={(value) =>
                  setNewUser({ ...newUser, role: value as any })
                }
              >
                <SelectTrigger className="bg-black border-green-500/50 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-green-500/50">
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleAddUser}
              className="bg-green-500 hover:bg-green-600 text-black font-semibold"
            >
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent className="bg-black border-green-500/50">
          <DialogHeader>
            <DialogTitle className="text-green-400">Edit User</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-green-300">Username</Label>
                <Input
                  value={editingUser.username}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      username: e.target.value,
                    })
                  }
                  className="bg-black border-green-500/50 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-green-300">Email</Label>
                <Input
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                  className="bg-black border-green-500/50 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-green-300">Role</Label>
                <Select
                  value={editingUser.role}
                  onValueChange={(value) =>
                    setEditingUser({
                      ...editingUser,
                      role: value as "admin" | "user" | "viewer",
                    })
                  }
                >
                  <SelectTrigger className="bg-black border-green-500/50 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-green-500/50">
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-green-300">Status</Label>
                <Select
                  value={editingUser.status}
                  onValueChange={(value) =>
                    setEditingUser({
                      ...editingUser,
                      status: value as "active" | "inactive",
                    })
                  }
                >
                  <SelectTrigger className="bg-black border-green-500/50 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-green-500/50">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={handleEditUser}
              className="bg-green-500 hover:bg-green-600 text-black font-semibold"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const defaultUsers: User[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@example.com",
    role: "admin",
    status: "active",
    lastLogin: "2024-03-20 15:30",
  },
  {
    id: "2",
    username: "user1",
    email: "user1@example.com",
    role: "user",
    status: "active",
    lastLogin: "2024-03-19 12:45",
  },
  {
    id: "3",
    username: "viewer1",
    email: "viewer1@example.com",
    role: "viewer",
    status: "inactive",
    lastLogin: "2024-03-18 09:15",
  },
];

export default UserManagement;
