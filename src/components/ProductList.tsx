
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Search, ShoppingCart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Product } from "./admin/ProductManagement";

// Reuse the mock product data
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

const ProductList: React.FC = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [products] = useState<Product[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<{product: Product, quantity: number}[]>([]);

  // Filter products based on search query
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add to cart function
  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      // Update quantity if product already in cart
      const updatedCart = cart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updatedCart);
    } else {
      // Add new item to cart
      setCart([...cart, { product, quantity: 1 }]);
    }
    
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
      duration: 3000,
    });
  };

  return (
    <Card className="neo">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Product Catalog</CardTitle>
          <CardDescription>Browse available products</CardDescription>
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
          {cart.length > 0 && (
            <Button variant="outline">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart ({cart.reduce((total, item) => total + item.quantity, 0)})
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Availability</TableHead>
                {!isAdmin && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={product.stock > 10 ? "default" : (product.stock > 0 ? "secondary" : "destructive")}>
                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </TableCell>
                    {!isAdmin && (
                      <TableCell className="text-right">
                        <Button 
                          variant="success" 
                          size="sm" 
                          onClick={() => addToCart(product)}
                          disabled={product.stock <= 0}
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Add to Cart
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 5 : 6} className="h-24 text-center">
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
          {isAdmin ? (
            <Button variant="outline">Export Catalog</Button>
          ) : (
            <Button variant="outline">Download Price List</Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductList;
