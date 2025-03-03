
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Barcode, CheckCircle, LucideShield } from "lucide-react";

export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      toast({
        title: "Login successful",
        description: "Welcome to Scanify Billing Portal!",
        duration: 3000,
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role: "admin" | "user") => {
    setIsLoading(true);
    try {
      if (role === "admin") {
        await login("admin@scanify.com", "password");
      } else {
        await login("user@scanify.com", "password");
      }
      toast({
        title: "Demo login successful",
        description: `You're now logged in as a ${role}.`,
        duration: 3000,
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Login failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Hero Section */}
      <div className="w-full lg:w-3/5 bg-gradient-to-br from-primary/90 to-primary/70 text-white p-8 lg:p-16 flex flex-col justify-center animate-fade-in">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary font-bold text-2xl">
              S
            </div>
            <h1 className="text-3xl font-bold">Scanify</h1>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight leading-tight">
            The Modern Billing Solution <br />with Integrated Scanning
          </h2>
          
          <p className="text-lg mb-8 opacity-90 leading-relaxed">
            Streamline your billing process with our intuitive platform. Manage invoices, scan barcodes, and track payments - all in one place.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: <Barcode className="h-8 w-8 mb-3" />,
                title: "Barcode Scanning",
                description: "Instantly scan products and add them to your invoices"
              },
              {
                icon: <CheckCircle className="h-8 w-8 mb-3" />,
                title: "Role-Based Access",
                description: "Specific permissions for administrators and users"
              },
              {
                icon: <LucideShield className="h-8 w-8 mb-3" />,
                title: "Secure Billing",
                description: "Industry-standard security for all your billing data"
              }
            ].map((feature, index) => (
              <div key={index} className="glass p-6 rounded-lg hover:shadow-xl transition-all duration-300">
                {feature.icon}
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="opacity-80">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Login Section */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 lg:p-16 animate-fade-in">
        <Card className="w-full max-w-md neo">
          <CardHeader>
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Button variant="link" className="text-xs p-0 h-auto font-normal" type="button">
                    Forgot password?
                  </Button>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or try a demo account
                  </span>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleDemoLogin("admin")}
                  disabled={isLoading}
                  className="w-full"
                >
                  Admin Demo
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDemoLogin("user")}
                  disabled={isLoading}
                  className="w-full"
                >
                  User Demo
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-2">
            <div className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Button variant="link" className="p-0 h-auto font-normal">
                Create account
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
