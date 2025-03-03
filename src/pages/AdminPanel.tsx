import React, { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Pencil, Plus, Search, Settings, Trash, User, Users, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProductManagement from "@/components/admin/ProductManagement";

// Mock user data
const mockUsers = [
  { id: "1", name: "Admin User", email: "admin@scanify.com", role: "admin", status: "active", lastLogin: "Today, 10:30 AM" },
  { id: "2", name: "Regular User", email: "user@scanify.com", role: "user", status: "active", lastLogin: "Yesterday, 2:15 PM" },
  { id: "3", name: "John Smith", email: "john@example.com", role: "user", status: "inactive", lastLogin: "1 week ago" },
  { id: "4", name: "Sarah Johnson", email: "sarah@example.com", role: "user", status: "active", lastLogin: "Yesterday, 9:45 AM" },
  { id: "5", name: "Robert Davis", email: "robert@example.com", role: "user", status: "active", lastLogin: "3 days ago" },
];

// Mock system settings
const mockSettings = [
  { id: "1", name: "Enable Email Notifications", value: true, category: "Notifications" },
  { id: "2", name: "Two-Factor Authentication", value: false, category: "Security" },
  { id: "3", name: "Auto-generate Invoices", value: true, category: "Billing" },
  { id: "4", name: "Dark Mode Default", value: false, category: "Appearance" },
  { id: "5", name: "Data Backup", value: true, category: "System" },
  { id: "6", name: "User Activity Logging", value: true, category: "Security" },
  { id: "7", name: "Email Reports", value: false, category: "Reporting" },
];

export default function AdminPanel() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState(mockUsers);
  const [settings, setSettings] = useState(mockSettings);
  const [searchQuery, setSearchQuery] = useState("");
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  // Redirect non-admin users
  React.useEffect(() => {
    if (!isAdmin) {
      toast({
        title: "Access denied",
        description: "You don't have permission to access the admin panel.",
        variant: "destructive",
        duration: 5000,
      });
      navigate("/dashboard");
    }
  }, [isAdmin, navigate, toast]);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSettingChange = (id: string, newValue: boolean) => {
    const updatedSettings = settings.map(setting => 
      setting.id === id ? { ...setting, value: newValue } : setting
    );
    setSettings(updatedSettings);
    
    // Find the setting name for the toast
    const settingName = settings.find(s => s.id === id)?.name;
    
    toast({
      title: `Setting updated`,
      description: `${settingName} has been ${newValue ? 'enabled' : 'disabled'}.`,
      duration: 3000,
    });
  };

  const deleteUser = (userId: string) => {
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    setUserToDelete(null);
    
    toast({
      title: "User deleted",
      description: "The user has been removed from the system.",
      duration: 3000,
    });
  };

  if (!isAdmin) {
    return null; // Prevent rendering if not admin
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">
            Manage users, products, system settings, and administrative functions.
          </p>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="users" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center">
              <Package className="h-4 w-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              System Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <Card className="neo">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage user accounts and permissions</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search users..."
                      className="w-[250px] pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-10"></TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map(user => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <User className="h-4 w-4" />
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge variant={user.role === "admin" ? "default" : "outline"}>
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={user.status === "active" ? "default" : "secondary"}>
                                {user.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{user.lastLogin}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <AlertDialog open={userToDelete === user.id} onOpenChange={(open) => !open && setUserToDelete(null)}>
                                  <AlertDialogTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                      onClick={() => setUserToDelete(user.id)}
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete User</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete {user.name}? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        className="bg-red-500 hover:bg-red-600"
                                        onClick={() => deleteUser(user.id)}
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center">
                            No users found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredUsers.length} of {users.length} users
                </div>
                <div className="space-x-2">
                  <Button variant="outline">Export Users</Button>
                  <Button>Batch Actions</Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="products">
            <ProductManagement />
          </TabsContent>
          
          <TabsContent value="settings">
            <Card className="neo">
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure global system settings and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {["Security", "Billing", "Notifications", "Appearance", "System", "Reporting"].map(category => {
                    const categorySettings = settings.filter(s => s.category === category);
                    if (categorySettings.length === 0) return null;
                    
                    return (
                      <div key={category}>
                        <h3 className="text-lg font-medium mb-4">{category}</h3>
                        <div className="space-y-4">
                          {categorySettings.map(setting => (
                            <div key={setting.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                              <div>
                                <Label htmlFor={`setting-${setting.id}`} className="text-base">
                                  {setting.name}
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                  {setting.value ? "Enabled" : "Disabled"}
                                </p>
                              </div>
                              <Switch
                                id={`setting-${setting.id}`}
                                checked={setting.value}
                                onCheckedChange={(checked) => handleSettingChange(setting.id, checked)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t pt-6">
                <Button>Save All Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
