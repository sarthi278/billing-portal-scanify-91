import React, { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { CreditCard, Download, FileDown, FileText, Filter, Plus, Search, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

// Mock invoices data
const mockInvoices = [
  { id: "INV-001", customer: "John Doe", date: "2023-05-15", amount: 350.99, status: "Paid", items: 5 },
  { id: "INV-002", customer: "Alice Smith", date: "2023-05-14", amount: 120.50, status: "Pending", items: 2 },
  { id: "INV-003", customer: "Bob Johnson", date: "2023-05-13", amount: 550.00, status: "Paid", items: 7 },
  { id: "INV-004", customer: "Emma Davis", date: "2023-05-10", amount: 220.75, status: "Overdue", items: 3 },
  { id: "INV-005", customer: "Michael Wilson", date: "2023-05-09", amount: 180.25, status: "Paid", items: 4 },
  { id: "INV-006", customer: "Olivia Brown", date: "2023-05-07", amount: 430.00, status: "Pending", items: 6 },
  { id: "INV-007", customer: "William Taylor", date: "2023-05-05", amount: 95.50, status: "Overdue", items: 1 },
  { id: "INV-008", customer: "Sophia Martinez", date: "2023-05-03", amount: 310.25, status: "Paid", items: 5 },
];

// Mock customers data
const mockCustomers = [
  { id: "1", name: "John Doe", email: "john@example.com", phone: "555-123-4567", invoices: 12, total: 1250.50 },
  { id: "2", name: "Alice Smith", email: "alice@example.com", phone: "555-987-6543", invoices: 8, total: 950.75 },
  { id: "3", name: "Bob Johnson", email: "bob@example.com", phone: "555-456-7890", invoices: 15, total: 1875.25 },
  { id: "4", name: "Emma Davis", email: "emma@example.com", phone: "555-789-0123", invoices: 5, total: 620.00 },
  { id: "5", name: "Michael Wilson", email: "michael@example.com", phone: "555-234-5678", invoices: 10, total: 1100.00 },
];

// Tabs interface
interface TabContentProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

const InvoicesTab: React.FC<TabContentProps> = ({ searchQuery, setSearchQuery }) => {
  const { toast } = useToast();
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const filteredInvoices = mockInvoices.filter(invoice => {
    const matchesSearch = 
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      invoice.customer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || 
      invoice.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });
  
  const toggleSelectAll = () => {
    if (selectedInvoices.length === filteredInvoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(filteredInvoices.map(invoice => invoice.id));
    }
  };
  
  const toggleInvoiceSelection = (invoiceId: string) => {
    if (selectedInvoices.includes(invoiceId)) {
      setSelectedInvoices(selectedInvoices.filter(id => id !== invoiceId));
    } else {
      setSelectedInvoices([...selectedInvoices, invoiceId]);
    }
  };
  
  const handleBatchAction = (action: string) => {
    if (selectedInvoices.length === 0) {
      toast({
        title: "No invoices selected",
        description: "Please select at least one invoice to perform this action.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Batch action initiated",
      description: `${action} action on ${selectedInvoices.length} selected invoices.`,
      duration: 3000,
    });
  };
  
  return (
    <Card className="neo">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Invoices</CardTitle>
          <CardDescription>Manage and track your billing invoices</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search invoices..."
              className="w-[250px] pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                <span>Status</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={selectedInvoices.length === filteredInvoices.length && filteredInvoices.length > 0}
                    onCheckedChange={toggleSelectAll}
                    aria-label="Select all invoices"
                  />
                </TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map(invoice => (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedInvoices.includes(invoice.id)}
                        onCheckedChange={() => toggleInvoiceSelection(invoice.id)}
                        aria-label={`Select invoice ${invoice.id}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.customer}</TableCell>
                    <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                    <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                    <TableCell>{invoice.items}</TableCell>
                    <TableCell>
                      <Badge variant={
                        invoice.status === "Paid" ? "default" : 
                        invoice.status === "Pending" ? "outline" : 
                        "destructive"
                      }>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No invoices found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6">
        <div className="flex items-center text-sm text-muted-foreground">
          <span>{selectedInvoices.length} of {filteredInvoices.length} selected</span>
        </div>
        <div className="space-x-2">
          <Button 
            variant="outline" 
            onClick={() => handleBatchAction("Download")}
            disabled={selectedInvoices.length === 0}
          >
            <FileDown className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button
            disabled={selectedInvoices.length === 0}
            onClick={() => handleBatchAction("Email")}
          >
            Send Invoices
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

const CustomersTab: React.FC<TabContentProps> = ({ searchQuery, setSearchQuery }) => {
  const filteredCustomers = mockCustomers.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <Card className="neo">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Customers</CardTitle>
          <CardDescription>Manage your customer information</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search customers..."
              className="w-[250px] pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button>
            <UserRound className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Invoices</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map(customer => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.invoices}</TableCell>
                    <TableCell>${customer.total.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        View Invoices
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No customers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6">
        <div className="text-sm text-muted-foreground">
          Showing {filteredCustomers.length} of {mockCustomers.length} customers
        </div>
        <Button variant="outline">Export Customers</Button>
      </CardFooter>
    </Card>
  );
};

export default function Billing() {
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Billing</h1>
          <p className="text-muted-foreground">
            Manage invoices, payments, and customer billing information.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Unpaid Invoices", value: "$2,504.00", description: "3 invoices pending" },
            { title: "Overdue Invoices", value: "$650.75", description: "2 invoices overdue" },
            { title: "Paid this Month", value: "$4,750.50", description: "+12% from last month" },
            { title: "Total Revenue", value: "$125,430.90", description: "All time" },
          ].map((stat, index) => (
            <Card key={index} className="neo">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="invoices" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="invoices" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Invoices
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center">
              <UserRound className="h-4 w-4 mr-2" />
              Customers
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="invoices">
            <InvoicesTab searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </TabsContent>
          
          <TabsContent value="customers">
            <CustomersTab searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
