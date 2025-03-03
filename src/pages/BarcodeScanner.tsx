import React, { useState, useRef, useEffect } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Barcode, Camera, CameraOff, Check, IndianRupee, Printer, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import PrintableInvoice from "@/components/PrintableInvoice";

const productDatabase = [
  { barcode: "1234567890", name: "Product A", price: 19.99, sku: "SKU-001", category: "Electronics" },
  { barcode: "2345678901", name: "Product B", price: 29.99, sku: "SKU-002", category: "Clothing" },
  { barcode: "3456789012", name: "Product C", price: 9.99, sku: "SKU-003", category: "Food" },
  { barcode: "4567890123", name: "Product D", price: 39.99, sku: "SKU-004", category: "Home Goods" },
  { barcode: "5678901234", name: "Product E", price: 14.99, sku: "SKU-005", category: "Electronics" },
];

interface ScannedProduct {
  barcode: string;
  name: string;
  price: number;
  quantity: number;
  sku: string;
  category: string;
}

export default function BarcodeScanner() {
  const [scannedProducts, setScannedProducts] = useState<ScannedProduct[]>([]);
  const [manualBarcode, setManualBarcode] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraAvailable, setIsCameraAvailable] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const printableInvoiceRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const newTotal = scannedProducts.reduce((sum, product) => {
      return sum + (product.price * product.quantity);
    }, 0);
    setTotalAmount(newTotal);
  }, [scannedProducts]);

  const startScanning = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsCameraAvailable(false);
      toast({
        title: "Camera access unavailable",
        description: "Your device doesn't support camera access or permission was denied.",
        variant: "destructive",
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
        
        setTimeout(() => {
          const randomIndex = Math.floor(Math.random() * productDatabase.length);
          const detectedProduct = productDatabase[randomIndex];
          handleProductScanned(detectedProduct.barcode);
          
          stopScanning();
        }, 2000);
      }
    } catch (error) {
      setIsCameraAvailable(false);
      toast({
        title: "Camera access denied",
        description: "Please grant camera permission to scan barcodes.",
        variant: "destructive",
      });
      console.error("Error accessing camera:", error);
    }
  };

  const stopScanning = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const handleProductScanned = (barcode: string) => {
    const foundProduct = productDatabase.find(product => product.barcode === barcode);
    
    if (foundProduct) {
      const existingProductIndex = scannedProducts.findIndex(p => p.barcode === barcode);
      
      if (existingProductIndex >= 0) {
        const updatedProducts = [...scannedProducts];
        updatedProducts[existingProductIndex].quantity += 1;
        setScannedProducts(updatedProducts);
      } else {
        setScannedProducts([
          ...scannedProducts,
          { ...foundProduct, quantity: 1 }
        ]);
      }
      
      toast({
        title: "Product scanned",
        description: `${foundProduct.name} has been added to the list.`,
        duration: 3000,
      });
    } else {
      toast({
        title: "Product not found",
        description: `No product found with barcode ${barcode}.`,
        variant: "destructive",
      });
    }
    
    setManualBarcode("");
  };

  const handleManualScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualBarcode) {
      handleProductScanned(manualBarcode);
    }
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity > 0) {
      const updatedProducts = [...scannedProducts];
      updatedProducts[index].quantity = newQuantity;
      setScannedProducts(updatedProducts);
    }
  };

  const removeProduct = (index: number) => {
    const updatedProducts = [...scannedProducts];
    updatedProducts.splice(index, 1);
    setScannedProducts(updatedProducts);
  };

  const clearAll = () => {
    setScannedProducts([]);
    toast({
      title: "List cleared",
      description: "All scanned products have been removed.",
    });
  };

  const generateInvoice = () => {
    if (scannedProducts.length === 0) {
      toast({
        title: "No products",
        description: "Please scan at least one product before creating an invoice.",
        variant: "destructive",
      });
      return;
    }
    
    const invoiceNumber = `INV-${Math.floor(100000 + Math.random() * 900000)}`;
    const invoiceDate = new Date().toLocaleDateString('en-IN');
    
    const invoiceData = {
      invoiceNumber,
      invoiceDate,
      items: scannedProducts,
      subtotal: totalAmount,
      tax: totalAmount * 0.10,
      total: totalAmount + (totalAmount * 0.10),
      currency: "₹"
    };
    
    setInvoiceData(invoiceData);
    setShowInvoice(true);
    
    toast({
      title: "Invoice generated",
      description: `Invoice #${invoiceNumber} has been created successfully.`,
      duration: 3000,
    });
    
    setScannedProducts([]);
  };

  const processPayment = () => {
    if (scannedProducts.length === 0) {
      toast({
        title: "No products",
        description: "Please scan at least one product to proceed with payment.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Payment processed",
      description: "Payment completed successfully. Generating invoice...",
      duration: 3000,
    });
    
    generateInvoice();
  };

  const printInvoice = () => {
    if (invoiceData) {
      const printContents = printableInvoiceRef.current?.innerHTML || '';
      const originalContents = document.body.innerHTML;
      
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };

  const closeInvoice = () => {
    setShowInvoice(false);
    setInvoiceData(null);
  };

  const goToBilling = () => {
    navigate('/billing');
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Barcode Scanner</h1>
          <p className="text-muted-foreground">
            Scan product barcodes to add them to your invoice.
          </p>
        </div>

        {showInvoice && invoiceData ? (
          <PrintableInvoice 
            invoiceNumber={invoiceData.invoiceNumber}
            invoiceDate={invoiceData.invoiceDate}
            items={invoiceData.items}
            subtotal={invoiceData.subtotal}
            tax={invoiceData.tax}
            total={invoiceData.total}
            currency="₹"
            onClose={closeInvoice}
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              <Card className="neo overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Barcode className="mr-2 h-5 w-5" />
                    Scanner
                  </CardTitle>
                  <CardDescription>
                    Use your camera to scan barcodes or enter them manually
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {isScanning ? (
                    <div className="relative w-full h-64 bg-black rounded-md overflow-hidden animate-fade-in">
                      <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-64 h-2 bg-primary/50 animate-pulse"></div>
                      </div>
                      <div className="absolute inset-0 border-2 border-primary/50 rounded-md"></div>
                      <div className="absolute top-2 right-2">
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          onClick={stopScanning}
                        >
                          <CameraOff className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm">
                        Scanning for barcodes...
                      </div>
                      <canvas ref={canvasRef} className="hidden"></canvas>
                    </div>
                  ) : (
                    <div className="w-full h-64 rounded-md border-2 border-dashed flex items-center justify-center bg-muted/30">
                      {isCameraAvailable ? (
                        <div className="text-center p-6">
                          <Camera className="h-10 w-10 mb-4 mx-auto text-muted-foreground" />
                          <h3 className="font-medium mb-2">Camera Scanner</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Point your camera at a barcode to scan it automatically
                          </p>
                          <Button onClick={startScanning}>
                            <Camera className="mr-2 h-4 w-4" />
                            Start Camera
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center p-6">
                          <CameraOff className="h-10 w-10 mb-4 mx-auto text-muted-foreground" />
                          <h3 className="font-medium mb-2">Camera Unavailable</h3>
                          <p className="text-sm text-muted-foreground">
                            Camera access is unavailable. Please use manual entry.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="pt-2">
                    <h3 className="text-sm font-medium mb-2">Manual Entry</h3>
                    <form onSubmit={handleManualScan} className="flex space-x-2">
                      <div className="flex-1">
                        <Input
                          type="text"
                          placeholder="Enter barcode number"
                          value={manualBarcode}
                          onChange={(e) => setManualBarcode(e.target.value)}
                        />
                      </div>
                      <Button type="submit" variant="secondary">
                        <Search className="mr-2 h-4 w-4" />
                        Search
                      </Button>
                    </form>
                    <p className="text-xs text-muted-foreground mt-2">
                      For demo purposes, try these barcodes: 1234567890, 2345678901, 3456789012
                    </p>
                  </div>
                </CardContent>
                
                <CardFooter className="bg-muted/30 border-t px-6 py-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Check className="h-4 w-4 mr-1 text-green-600" />
                    Ready to scan
                  </div>
                </CardFooter>
              </Card>

              <Card className="neo">
                <CardHeader>
                  <CardTitle>Scanned Products</CardTitle>
                  <CardDescription>
                    Products that have been scanned or manually entered
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {scannedProducts.length > 0 ? (
                    <div className="rounded-md border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead className="w-10"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {scannedProducts.map((product, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{product.name}</TableCell>
                              <TableCell>{product.sku}</TableCell>
                              <TableCell>₹{product.price.toFixed(2)}</TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-1">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => updateQuantity(index, product.quantity - 1)}
                                  >
                                    -
                                  </Button>
                                  <Input
                                    type="number"
                                    min="1"
                                    value={product.quantity}
                                    onChange={(e) => updateQuantity(index, parseInt(e.target.value) || 1)}
                                    className="w-16 h-8 text-center"
                                  />
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => updateQuantity(index, product.quantity + 1)}
                                  >
                                    +
                                  </Button>
                                </div>
                              </TableCell>
                              <TableCell>₹{(product.price * product.quantity).toFixed(2)}</TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-500 hover:text-red-600"
                                  onClick={() => removeProduct(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-muted-foreground">
                      <Barcode className="h-10 w-10 mx-auto mb-3 opacity-50" />
                      <p>No products scanned yet</p>
                      <p className="text-sm mt-1">Scan a barcode or enter a code manually to add products</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-6">
                  <Button variant="outline" onClick={clearAll} disabled={scannedProducts.length === 0}>
                    Clear All
                  </Button>
                  <Button onClick={generateInvoice} disabled={scannedProducts.length === 0}>
                    Generate Invoice
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div>
              <Card className={cn(
                "neo sticky top-6 transition-all duration-300",
                scannedProducts.length > 0 ? "opacity-100" : "opacity-70"
              )}>
                <CardHeader>
                  <CardTitle>Invoice Summary</CardTitle>
                  <CardDescription>
                    Summary of all scanned products
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Items:</span>
                      <span>{scannedProducts.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Quantity:</span>
                      <span>{scannedProducts.reduce((sum, p) => sum + p.quantity, 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span className="flex items-center">
                        <IndianRupee className="h-3 w-3 mr-1" />
                        {totalAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax (10%):</span>
                      <span className="flex items-center">
                        <IndianRupee className="h-3 w-3 mr-1" />
                        {(totalAmount * 0.1).toFixed(2)}
                      </span>
                    </div>
                    <div className="border-t my-4"></div>
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span className="flex items-center">
                        <IndianRupee className="h-4 w-4 mr-1" />
                        {(totalAmount + totalAmount * 0.1).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-6">
                    <Button className="w-full" disabled={scannedProducts.length === 0} onClick={processPayment}>
                      Process Payment
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground border-t pt-4">
                  Invoice will be automatically saved to your account
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
