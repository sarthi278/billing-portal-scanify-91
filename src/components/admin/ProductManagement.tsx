import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger, 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Edit, Plus, Search, Trash } from "lucide-react";

// Product type definition
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sku: string;
  category: string;
  stock: number;
}

// Mock product data
const mockProducts: Product[] = [
  { 
    id: "1", 
    name: "Product A", 
    description: "Description for Product A", 
    price: 99.99, 
    sku: "SKU-001", 
    category: "Electronics", 
    stock: 25 
  },
  { 
    id: "2", 
    name: "Product B", 
    description: "Description for Product B", 
    price: 49.99, 
    sku: "SKU-002", 
    category: "Office Supplies", 
    stock: 120 
  },
  { 
    id: "3", 
    name: "Product C", 
    description: "Description for Product C", 
    price: 149.99, 
    sku: "SKU-003", 
    category: "Electronics", 
    stock: 5 
  },
  { 
    id: "4", 
    name: "Product D", 
    description: "Description for Product D", 
    price: 29.99, 
    sku: "SKU-004", 
    category: "Home Goods", 
    stock: 42 
  },
];

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  sku: string;
  category: string;
  stock: string;
}

const initialFormData: ProductFormData = {
  name: "",
  description: "",
  price: "",
  sku: "",
  category: "",
  stock: "",
};

const ProductManagement: React.FC = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);

  // Filter products based on search query
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle add product
  const handleAddProduct = () => {
    // Validate form
    if (!formData.name || !formData.price || !formData.sku) {
      toast({
        title: "Validation Error",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }

    // Create new product
    const newProduct: Product = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      sku: formData.sku,
      category: formData.category,
      stock: parseInt(formData.stock) || 0,
    };

    // Add to products array
    setProducts([...products, newProduct]);
    
    // Reset form and close dialog
    setFormData(initialFormData);
    setIsAddDialogOpen(false);
    
    toast({
      title: "Product Added",
      description: `${newProduct.name} has been added successfully.`,
    });
  };

  // Handle edit product
  const handleEditProduct = () => {
    if (!selectedProduct) return;
    
    // Validate form
    if (!formData.name || !formData.price || !formData.sku) {
      toast({
        title: "Validation Error",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }

    // Update product
    const updatedProducts = products.map(product => 
      product.id === selectedProduct.id 
        ? {
            ...product,
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            sku: formData.sku,
            category: formData.category,
            stock: parseInt(formData.stock) || 0,
          }
        : product
    );

    setProducts(updatedProducts);
    setIsEditDialogOpen(false);
    setSelectedProduct(null);
    setFormData(initialFormData);
    
    toast({
      title: "Product Updated",
      description: `${formData.name} has been updated successfully.`,
    });
  };

  // Handle delete product
  const handleDeleteProduct = (id: string) => {
    const productToDelete = products.find(product => product.id === id);
    const updatedProducts = products.filter(product => product.id !== id);
    setProducts(updatedProducts);
    
    toast({
      title: "Product Deleted",
      description: `${productToDelete?.name} has been deleted successfully.`,
    });
  };

  // Open edit dialog and populate form
  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      sku: product.sku,
      category: product.category,
      stock: product.stock.toString(),
    });
    setIsEditDialogOpen(true);
  };

  return (
    <Card className="neo">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Product Management</CardTitle>
          <CardDescription>Manage your products inventory</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="w-[250px] pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                  Fill out the form below to add a new product to inventory.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU *</Label>
                    <Input 
                      id="sku" 
                      name="sku" 
                      value={formData.sku} 
                      onChange={handleInputChange} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input 
                    id="description" 
                    name="description" 
                    value={formData.description} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹) *</Label>
                    <Input 
                      id="price" 
                      name="price" 
                      type="number" 
                      min="0" 
                      step="0.01" 
                      value={formData.price} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input 
                      id="category" 
                      name="category" 
                      value={formData.category} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input 
                      id="stock" 
                      name="stock" 
                      type="number" 
                      min="0" 
                      value={formData.stock} 
                      onChange={handleInputChange} 
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddProduct}>Save Product</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell>₹{product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={product.stock > 10 ? "default" : (product.stock > 0 ? "secondary" : "destructive")}>
                        {product.stock} {product.stock === 1 ? 'item' : 'items'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => openEditDialog(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No products found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6">
        <div className="text-sm text-muted-foreground">
          Showing {filteredProducts.length} of {products.length} products
        </div>
        <div className="space-x-2">
          <Button variant="outline">Export Products</Button>
          <Button variant="print">
            Print Catalog
          </Button>
        </div>
      </CardFooter>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the product information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Product Name *</Label>
                <Input 
                  id="edit-name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-sku">SKU *</Label>
                <Input 
                  id="edit-sku" 
                  name="sku" 
                  value={formData.sku} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input 
                id="edit-description" 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price (₹) *</Label>
                <Input 
                  id="edit-price" 
                  name="price" 
                  type="number" 
                  min="0" 
                  step="0.01" 
                  value={formData.price} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Input 
                  id="edit-category" 
                  name="category" 
                  value={formData.category} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-stock">Stock</Label>
                <Input 
                  id="edit-stock" 
                  name="stock" 
                  type="number" 
                  min="0" 
                  value={formData.stock} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditProduct}>Update Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Product Dialog - Update the Price label */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Fill out the form below to add a new product to inventory.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU *</Label>
                <Input 
                  id="sku" 
                  name="sku" 
                  value={formData.sku} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input 
                id="description" 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹) *</Label>
                <Input 
                  id="price" 
                  name="price" 
                  type="number" 
                  min="0" 
                  step="0.01" 
                  value={formData.price} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input 
                  id="category" 
                  name="category" 
                  value={formData.category} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input 
                  id="stock" 
                  name="stock" 
                  type="number" 
                  min="0" 
                  value={formData.stock} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddProduct}>Save Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ProductManagement;
