
import React from "react";
import MainLayout from "@/layouts/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BarChart, DollarSign, Package, QrCode, ShoppingCart, Users } from "lucide-react";
import { LineChart, Line, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from "@/lib/utils";
import ProductList from "@/components/ProductList";

const data = [
  { name: "Jan", total: 1500 },
  { name: "Feb", total: 2300 },
  { name: "Mar", total: 1900 },
  { name: "Apr", total: 2800 },
  { name: "May", total: 2500 },
  { name: "Jun", total: 3200 },
  { name: "Jul", total: 3800 },
];

const productData = [
  { name: "Product A", sales: 400 },
  { name: "Product B", sales: 300 },
  { name: "Product C", sales: 520 },
  { name: "Product D", sales: 280 },
  { name: "Product E", sales: 390 },
];

const recentInvoices = [
  { id: "#INV-001", customer: "John Doe", amount: 350.99, date: "May 15, 2023" },
  { id: "#INV-002", customer: "Alice Smith", amount: 120.50, date: "May 14, 2023" },
  { id: "#INV-003", customer: "Bob Johnson", amount: 550.00, date: "May 13, 2023" },
  { id: "#INV-004", customer: "Emma Davis", amount: 220.75, date: "May 10, 2023" },
];

export default function Dashboard() {
  const { user, isAdmin } = useAuth();

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back, {user?.name}</h1>
          <p className="text-muted-foreground">
            Here's an overview of your billing activity and statistics.
          </p>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Total Revenue",
              value: "₹12,543.00",
              change: "+12.5%",
              icon: <DollarSign className="h-5 w-5 text-primary" />,
              description: "Revenue this month",
            },
            {
              title: "Invoices",
              value: "324",
              change: "+8.2%",
              icon: <ShoppingCart className="h-5 w-5 text-primary" />,
              description: "Invoices this month",
            },
            {
              title: "Products",
              value: "132",
              change: "+3.1%",
              icon: <Package className="h-5 w-5 text-primary" />,
              description: "Active products",
            },
            {
              title: isAdmin ? "Users" : "Scans",
              value: isAdmin ? "7" : "582",
              change: isAdmin ? "+1" : "+24.3%",
              icon: isAdmin ? (
                <Users className="h-5 w-5 text-primary" />
              ) : (
                <QrCode className="h-5 w-5 text-primary" />
              ),
              description: isAdmin ? "Active users" : "Scans this month",
            },
          ].map((card, index) => (
            <Card key={index} className="neo overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <div className="h-9 w-9 rounded-full flex items-center justify-center">
                  {card.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <span className={cn(
                    "mr-1 rounded-sm px-1 py-0.5 text-xs font-medium",
                    card.change.startsWith("+") ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"
                  )}>
                    {card.change}
                  </span>
                  <span>{card.description}</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-[600px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4 neo">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Revenue</CardTitle>
                    <CardDescription>Revenue overview for the past 7 months</CardDescription>
                  </div>
                  <div>
                    <Button variant="outline" size="sm">
                      <BarChart className="h-4 w-4 mr-2" />
                      View Report
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart
                      data={data}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="total" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2} 
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card className="col-span-3 neo">
                <CardHeader>
                  <CardTitle>Top Products</CardTitle>
                  <CardDescription>Top selling products</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <RechartsBarChart
                      data={productData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} horizontal={false} />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip />
                      <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            
            <Card className="neo">
              <CardHeader>
                <CardTitle>Recent Invoices</CardTitle>
                <CardDescription>Latest billing activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-4 p-4 font-medium text-sm">
                    <div>Invoice</div>
                    <div>Customer</div>
                    <div>Amount</div>
                    <div>Date</div>
                  </div>
                  <div className="divide-y">
                    {recentInvoices.map((invoice, index) => (
                      <div key={index} className="grid grid-cols-4 p-4 text-sm items-center">
                        <div className="font-medium">{invoice.id}</div>
                        <div>{invoice.customer}</div>
                        <div>₹{invoice.amount.toFixed(2)}</div>
                        <div>{invoice.date}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 text-right">
                  <Button variant="outline" size="sm">View All Invoices</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="products" className="space-y-6">
            <ProductList />
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-6">
            <Card className="neo">
              <CardHeader>
                <CardTitle>Advanced Analytics</CardTitle>
                <CardDescription>Detailed metrics and performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">Detailed analytics will be available soon!</p>
                  <Button>Generate Report</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
