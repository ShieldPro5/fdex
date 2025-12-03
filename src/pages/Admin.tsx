import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, LogOut, Eye, Edit, Package, TrendingUp, Clock, CheckCircle2, AlertCircle, Truck, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

const API_BASE_URL = "http://localhost:5000/api";

interface Shipment {
  _id: string;
  tracking_id: string;
  service_type: string;
  origin: string;
  destination: string;
  estimated_delivery: string;
  shipment_value: number;
  current_location: string;
  customs_status: string;
  status: string;
  progress: any[];
  recipient_name?: string;
  recipient_phone?: string;
  recipient_email?: string;
  sender_name?: string;
  sender_phone?: string;
  sender_email?: string;
  package_weight?: number;
  package_dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  package_type?: string;
  shipping_date?: string;
  delivery_date?: string;
  insurance_value?: number;
  declared_value?: number;
  currency?: string;
  special_instructions?: string;
  delivery_attempts?: number;
}

interface Stats {
  total: number;
  status: {
    inTransit: number;
    delivered: number;
    pending: number;
    outForDelivery: number;
    exception: number;
    onHold: number;
  };
  customs: {
    cleared: number;
    onHold: number;
  };
  totalValue: number;
}

const Admin = () => {
  // Check localStorage on mount
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const savedLogin = localStorage.getItem("adminLoggedIn");
    return savedLogin === "true";
  });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const shipmentsPerPage = 10;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    serviceType: "",
    origin: "",
    destination: "",
    estimatedDelivery: "",
    shipmentValue: "",
    currentLocation: "",
    customsStatus: "On Hold",
    recipientName: "",
    recipientPhone: "",
    recipientEmail: "",
    senderName: "",
    senderPhone: "",
    senderEmail: "",
    packageWeight: "",
    packageLength: "",
    packageWidth: "",
    packageHeight: "",
    packageType: "Package",
    shippingDate: "",
    insuranceValue: "",
    declaredValue: "",
    currency: "USD",
    specialInstructions: "",
  });
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [viewShipment, setViewShipment] = useState<Shipment | null>(null);
  const [editShipment, setEditShipment] = useState<Shipment | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [statusShipment, setStatusShipment] = useState<Shipment | null>(null);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      fetchShipments();
      fetchStats();
    }
  }, [isLoggedIn, currentPage]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "vico" && password === "vic1404174") {
      setIsLoggedIn(true);
      localStorage.setItem("adminLoggedIn", "true");
      toast.success("Login successful!");
    } else {
      toast.error("Invalid credentials");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("adminLoggedIn");
    toast.success("Logged out successfully");
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/shipments/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchShipments = async (page: number = 1) => {
    try {
      const response = await fetch(`${API_BASE_URL}/shipments?page=${page}&limit=${shipmentsPerPage}`);
      if (!response.ok) {
        toast.error("Error fetching shipments");
        return;
      }
      const data = await response.json();
      setShipments(data.shipments || []);
      setTotalPages(Math.ceil(data.total / shipmentsPerPage));
      setCurrentPage(page);
    } catch (error) {
      toast.error("Error fetching shipments");
    }
  };

  const generateTrackingId = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const random = Math.floor(Math.random() * 1000);
    return `SCS-${year}${month}${day}-${random}`;
  };

  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.serviceType || !formData.origin || !formData.destination || !formData.estimatedDelivery || !formData.shipmentValue || !formData.currentLocation) {
      toast.error("Please fill in all required fields");
      return;
    }

    const trackingId = generateTrackingId();
    const progress = [
      {
        title: "Package Received",
        description: "Shipment received at origin facility",
        location: formData.origin,
        timestamp: new Date().toISOString(),
        completed: true,
      },
      {
        title: "In Transit",
        description: "Package is on the way",
        location: formData.currentLocation,
        timestamp: new Date().toISOString(),
        completed: true,
      },
      {
        title: "Customs Clearance",
        description: formData.customsStatus === "Cleared" ? "Package cleared customs" : "Package awaiting customs clearance",
        location: formData.currentLocation,
        timestamp: new Date().toISOString(),
        completed: formData.customsStatus === "Cleared",
      },
      {
        title: "Out for Delivery",
        description: "Package will be delivered soon",
        location: formData.destination.split(",")[0],
        timestamp: null,
        completed: false,
      },
      {
        title: "Delivered",
        description: "Package has been successfully delivered",
        location: formData.destination,
        timestamp: null,
        completed: false,
      },
    ];

    const shipmentData: any = {
          tracking_id: trackingId,
          service_type: formData.serviceType,
          origin: formData.origin,
          destination: formData.destination,
          estimated_delivery: formData.estimatedDelivery,
          shipment_value: parseFloat(formData.shipmentValue),
          current_location: formData.currentLocation,
          customs_status: formData.customsStatus,
          status: "In Transit",
          progress,
    };

    // Add optional fields
    if (formData.recipientName) shipmentData.recipient_name = formData.recipientName;
    if (formData.recipientPhone) shipmentData.recipient_phone = formData.recipientPhone;
    if (formData.recipientEmail) shipmentData.recipient_email = formData.recipientEmail;
    if (formData.senderName) shipmentData.sender_name = formData.senderName;
    if (formData.senderPhone) shipmentData.sender_phone = formData.senderPhone;
    if (formData.senderEmail) shipmentData.sender_email = formData.senderEmail;
    if (formData.packageWeight) shipmentData.package_weight = parseFloat(formData.packageWeight);
    if (formData.packageLength && formData.packageWidth && formData.packageHeight) {
      shipmentData.package_dimensions = {
        length: parseFloat(formData.packageLength),
        width: parseFloat(formData.packageWidth),
        height: parseFloat(formData.packageHeight),
        unit: "inches"
      };
    }
    if (formData.packageType) shipmentData.package_type = formData.packageType;
    if (formData.shippingDate) shipmentData.shipping_date = formData.shippingDate;
    if (formData.insuranceValue) shipmentData.insurance_value = parseFloat(formData.insuranceValue);
    if (formData.declaredValue) shipmentData.declared_value = parseFloat(formData.declaredValue);
    if (formData.currency) shipmentData.currency = formData.currency;
    if (formData.specialInstructions) shipmentData.special_instructions = formData.specialInstructions;

    try {
      const response = await fetch(`${API_BASE_URL}/shipments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shipmentData),
      });

      if (!response.ok) {
        toast.error("Error creating shipment");
      } else {
        toast.success(`Shipment created! Tracking ID: ${trackingId}`);
        setIsCreateModalOpen(false);
        setFormData({
          serviceType: "",
          origin: "",
          destination: "",
          estimatedDelivery: "",
          shipmentValue: "",
          currentLocation: "",
          customsStatus: "On Hold",
          recipientName: "",
          recipientPhone: "",
          recipientEmail: "",
          senderName: "",
          senderPhone: "",
          senderEmail: "",
          packageWeight: "",
          packageLength: "",
          packageWidth: "",
          packageHeight: "",
          packageType: "Package",
          shippingDate: "",
          insuranceValue: "",
          declaredValue: "",
          currency: "USD",
          specialInstructions: "",
        });
        fetchShipments(currentPage);
        fetchStats();
      }
    } catch (error) {
      toast.error("Error creating shipment");
    }
  };

  const handleDeleteShipment = async (id: string) => {
    if (!confirm("Are you sure you want to delete this shipment?")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/shipments/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        toast.error("Error deleting shipment");
      } else {
        toast.success("Shipment deleted");
        fetchShipments(currentPage);
        fetchStats();
      }
    } catch (error) {
      toast.error("Error deleting shipment");
    }
  };

  const handleViewShipment = (shipment: Shipment) => {
    setViewShipment(shipment);
    setIsViewDialogOpen(true);
  };

  const handleEditShipment = (shipment: Shipment) => {
    setEditShipment(shipment);
    setIsEditDialogOpen(true);
  };

  const handleUpdateShipment = async () => {
    if (!editShipment) return;
    try {
      const response = await fetch(`${API_BASE_URL}/shipments/${editShipment._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editShipment),
      });
      if (!response.ok) {
        toast.error("Error updating shipment");
      } else {
        toast.success("Shipment updated!");
        setIsEditDialogOpen(false);
        fetchShipments(currentPage);
        fetchStats();
      }
    } catch (error) {
      toast.error("Error updating shipment");
    }
  };

  const openStatusDialog = (shipment: Shipment) => {
    setStatusShipment(shipment);
    setNewStatus(shipment.status);
    setIsStatusDialogOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!statusShipment) return;
    try {
      const response = await fetch(`${API_BASE_URL}/shipments/${statusShipment._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) {
        toast.error("Error updating status");
      } else {
        toast.success("Status updated!");
        setIsStatusDialogOpen(false);
        fetchShipments(currentPage);
        fetchStats();
      }
    } catch (error) {
      toast.error("Error updating status");
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      "Delivered": "bg-green-100 text-green-800 border-green-200",
      "In Transit": "bg-blue-100 text-blue-800 border-blue-200",
      "Out for Delivery": "bg-orange-100 text-orange-800 border-orange-200",
      "Pending": "bg-gray-100 text-gray-800 border-gray-200",
      "Exception": "bg-red-100 text-red-800 border-red-200",
      "On Hold": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Returned": "bg-purple-100 text-purple-800 border-purple-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#4D148C] to-[#5A1A9E]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <span className="text-4xl font-bold">
                <span className="text-[#4D148C]">Fed</span>
                <span className="text-[#FF6600]">Ex</span>
              </span>
            </div>
            <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="vico"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <Button type="submit" className="w-full bg-[#FF6600] hover:bg-[#E55A00]">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold">
              <span className="text-[#4D148C]">Fed</span>
              <span className="text-[#FF6600]">Ex</span>
            </span>
            <span className="text-xl font-semibold text-gray-700">Admin Panel</span>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <main className="py-8">
        <div className="container mx-auto px-4">
          {/* Metrics Dashboard */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Shipments</p>
                      <p className="text-3xl font-bold text-[#4D148C]">{stats.total}</p>
                    </div>
                    <Package className="h-12 w-12 text-[#4D148C] opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">In Transit</p>
                      <p className="text-3xl font-bold text-blue-600">{stats.status.inTransit}</p>
                    </div>
                    <Truck className="h-12 w-12 text-blue-600 opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Delivered</p>
                      <p className="text-3xl font-bold text-green-600">{stats.status.delivered}</p>
                    </div>
                    <CheckCircle2 className="h-12 w-12 text-green-600 opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Value</p>
                      <p className="text-3xl font-bold text-[#FF6600]">${stats.totalValue.toLocaleString()}</p>
                    </div>
                    <DollarSign className="h-12 w-12 text-[#FF6600] opacity-20" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Status Overview */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">Pending</p>
                  <p className="text-2xl font-bold">{stats.status.pending}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">Out for Delivery</p>
                  <p className="text-2xl font-bold">{stats.status.outForDelivery}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">On Hold</p>
                  <p className="text-2xl font-bold">{stats.status.onHold}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">Exception</p>
                  <p className="text-2xl font-bold">{stats.status.exception}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">Customs Cleared</p>
                  <p className="text-2xl font-bold text-green-600">{stats.customs.cleared}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">Customs On Hold</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.customs.onHold}</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Create Shipment Button */}
          <div className="mb-6">
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-[#FF6600] hover:bg-[#E55A00]"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New Shipment
            </Button>
          </div>

          {/* Shipments Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Shipments</CardTitle>
            </CardHeader>
            <CardContent>
              {shipments.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No shipments yet</p>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tracking ID</TableHead>
                          <TableHead>Service Type</TableHead>
                          <TableHead>Origin</TableHead>
                          <TableHead>Destination</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Customs</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {shipments.map((shipment) => (
                          <TableRow key={shipment._id}>
                            <TableCell className="font-mono text-sm">{shipment.tracking_id}</TableCell>
                            <TableCell>{shipment.service_type}</TableCell>
                            <TableCell className="text-sm">{shipment.origin}</TableCell>
                            <TableCell className="text-sm max-w-[200px] truncate">{shipment.destination}</TableCell>
                            <TableCell>
                              <button
                                onClick={() => openStatusDialog(shipment)}
                                className="cursor-pointer"
                              >
                                <Badge className={getStatusColor(shipment.status)}>
                                  {shipment.status}
                                </Badge>
                              </button>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">{shipment.customs_status}</Badge>
                            </TableCell>
                            <TableCell>${shipment.shipment_value.toLocaleString()}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewShipment(shipment)}
                                  title="View Details"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditShipment(shipment)}
                                  title="Edit Shipment"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteShipment(shipment._id)}
                                  title="Delete Shipment"
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-500">
                      Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchShipments(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchShipments(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Create Shipment Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Shipment</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateShipment} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                <Label htmlFor="serviceType">Service Type *</Label>
                    <Select
                      value={formData.serviceType}
                      onValueChange={(value) => setFormData({ ...formData, serviceType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Standard">Standard</SelectItem>
                        <SelectItem value="Express">Express</SelectItem>
                        <SelectItem value="Premium">Premium</SelectItem>
                    <SelectItem value="Overnight">Overnight</SelectItem>
                    <SelectItem value="International">International</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                <Label htmlFor="packageType">Package Type</Label>
                <Select
                  value={formData.packageType}
                  onValueChange={(value) => setFormData({ ...formData, packageType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Package">Package</SelectItem>
                    <SelectItem value="Envelope">Envelope</SelectItem>
                    <SelectItem value="Pallet">Pallet</SelectItem>
                    <SelectItem value="Freight">Freight</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="origin">Origin *</Label>
                    <Input
                      id="origin"
                      value={formData.origin}
                      onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                      placeholder="e.g., New York, USA"
                    />
                  </div>

                  <div>
                <Label htmlFor="destination">Destination *</Label>
                    <Input
                      id="destination"
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      placeholder="e.g., 123 Main St, Los Angeles, CA"
                    />
                  </div>

                  <div>
                <Label htmlFor="estimatedDelivery">Estimated Delivery *</Label>
                    <Input
                      id="estimatedDelivery"
                      type="date"
                      value={formData.estimatedDelivery}
                      onChange={(e) => setFormData({ ...formData, estimatedDelivery: e.target.value })}
                    />
                  </div>

                  <div>
                <Label htmlFor="shippingDate">Shipping Date</Label>
                <Input
                  id="shippingDate"
                  type="date"
                  value={formData.shippingDate}
                  onChange={(e) => setFormData({ ...formData, shippingDate: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="shipmentValue">Shipment Value (USDT) *</Label>
                    <Input
                      id="shipmentValue"
                      type="number"
                      value={formData.shipmentValue}
                      onChange={(e) => setFormData({ ...formData, shipmentValue: e.target.value })}
                      placeholder="e.g., 10000"
                    />
                  </div>

                  <div>
                <Label htmlFor="currentLocation">Current Location *</Label>
                    <Input
                      id="currentLocation"
                      value={formData.currentLocation}
                      onChange={(e) => setFormData({ ...formData, currentLocation: e.target.value })}
                      placeholder="e.g., Kansas City, Missouri"
                    />
                  </div>

                  <div>
                <Label htmlFor="customsStatus">Customs Status *</Label>
                    <Select
                      value={formData.customsStatus}
                      onValueChange={(value) => setFormData({ ...formData, customsStatus: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cleared">Cleared</SelectItem>
                        <SelectItem value="On Hold">On Hold</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => setFormData({ ...formData, currency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="USDT">USDT</SelectItem>
                  </SelectContent>
                </Select>
                </div>

              <div>
                <Label htmlFor="senderName">Sender Name</Label>
                <Input
                  id="senderName"
                  value={formData.senderName}
                  onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="senderPhone">Sender Phone</Label>
                <Input
                  id="senderPhone"
                  value={formData.senderPhone}
                  onChange={(e) => setFormData({ ...formData, senderPhone: e.target.value })}
                />
                                </div>

              <div>
                <Label htmlFor="senderEmail">Sender Email</Label>
                <Input
                  id="senderEmail"
                  type="email"
                  value={formData.senderEmail}
                  onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
                />
                    </div>

              <div>
                <Label htmlFor="recipientName">Recipient Name</Label>
                <Input
                  id="recipientName"
                  value={formData.recipientName}
                  onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                />
                      </div>

              <div>
                <Label htmlFor="recipientPhone">Recipient Phone</Label>
                <Input
                  id="recipientPhone"
                  value={formData.recipientPhone}
                  onChange={(e) => setFormData({ ...formData, recipientPhone: e.target.value })}
                />
                      </div>

              <div>
                <Label htmlFor="recipientEmail">Recipient Email</Label>
                <Input
                  id="recipientEmail"
                  type="email"
                  value={formData.recipientEmail}
                  onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                />
                    </div>

            <div>
                <Label htmlFor="packageWeight">Package Weight (lbs)</Label>
                <Input
                  id="packageWeight"
                  type="number"
                  value={formData.packageWeight}
                  onChange={(e) => setFormData({ ...formData, packageWeight: e.target.value })}
                />
            </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="packageLength">Length (in)</Label>
                  <Input
                    id="packageLength"
                    type="number"
                    value={formData.packageLength}
                    onChange={(e) => setFormData({ ...formData, packageLength: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="packageWidth">Width (in)</Label>
                  <Input
                    id="packageWidth"
                    type="number"
                    value={formData.packageWidth}
                    onChange={(e) => setFormData({ ...formData, packageWidth: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="packageHeight">Height (in)</Label>
                  <Input
                    id="packageHeight"
                    type="number"
                    value={formData.packageHeight}
                    onChange={(e) => setFormData({ ...formData, packageHeight: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="insuranceValue">Insurance Value</Label>
                <Input
                  id="insuranceValue"
                  type="number"
                  value={formData.insuranceValue}
                  onChange={(e) => setFormData({ ...formData, insuranceValue: e.target.value })}
                />
                </div>

              <div>
                <Label htmlFor="declaredValue">Declared Value</Label>
                <Input
                  id="declaredValue"
                  type="number"
                  value={formData.declaredValue}
                  onChange={(e) => setFormData({ ...formData, declaredValue: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="specialInstructions">Special Instructions</Label>
                <Textarea
                  id="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" type="button" onClick={() => setIsCreateModalOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-[#FF6600] hover:bg-[#E55A00]">
                Create Shipment
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Status Toggle Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Shipment Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Tracking ID</Label>
              <div className="font-mono text-sm p-2 bg-gray-50 rounded">
                {statusShipment?.tracking_id}
              </div>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Transit">In Transit</SelectItem>
                  <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Exception">Exception</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                  <SelectItem value="Returned">Returned</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleUpdateStatus} className="flex-1 bg-[#FF6600] hover:bg-[#E55A00]">
                Update Status
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Shipment Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Shipment Details</DialogTitle>
          </DialogHeader>
          {viewShipment && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div><strong>Tracking ID:</strong> <span className="font-mono">{viewShipment.tracking_id}</span></div>
              <div><strong>Service Type:</strong> {viewShipment.service_type}</div>
                <div><strong>Package Type:</strong> {viewShipment.package_type || "N/A"}</div>
                <div><strong>Status:</strong> <Badge className={getStatusColor(viewShipment.status)}>{viewShipment.status}</Badge></div>
              <div><strong>Origin:</strong> {viewShipment.origin}</div>
              <div><strong>Destination:</strong> {viewShipment.destination}</div>
              <div><strong>Current Location:</strong> {viewShipment.current_location}</div>
                <div><strong>Customs Status:</strong> <Badge variant="secondary">{viewShipment.customs_status}</Badge></div>
                <div><strong>Estimated Delivery:</strong> {new Date(viewShipment.estimated_delivery).toLocaleDateString()}</div>
                <div><strong>Shipment Value:</strong> ${viewShipment.shipment_value.toLocaleString()} {viewShipment.currency || "USD"}</div>
                {viewShipment.sender_name && <div><strong>Sender:</strong> {viewShipment.sender_name}</div>}
                {viewShipment.recipient_name && <div><strong>Recipient:</strong> {viewShipment.recipient_name}</div>}
                {viewShipment.package_weight && <div><strong>Weight:</strong> {viewShipment.package_weight} lbs</div>}
                {viewShipment.package_dimensions && (
                  <div><strong>Dimensions:</strong> {viewShipment.package_dimensions.length}" × {viewShipment.package_dimensions.width}" × {viewShipment.package_dimensions.height}"</div>
                )}
              </div>
              {viewShipment.progress && viewShipment.progress.length > 0 && (
                <div className="pt-4 border-t">
                <strong>Progress:</strong>
                  <div className="mt-2 space-y-2">
                    {viewShipment.progress.map((step: any, index: number) => (
                      <div key={index} className="p-2 bg-gray-50 rounded">
                        <div className="font-medium">{step.title}</div>
                        <div className="text-gray-600">{step.description}</div>
                        <div className="text-xs text-gray-500">📍 {step.location}</div>
                        {step.completed && <span className="text-green-600 text-xs">✓ Completed</span>}
                      </div>
                    ))}
              </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Shipment Dialog - Simplified for now */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Shipment</DialogTitle>
          </DialogHeader>
          {editShipment && (
            <div className="space-y-4">
              <div>
                <Label>Tracking ID</Label>
                <Input value={editShipment.tracking_id} disabled />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Origin</Label>
                  <Input
                    value={editShipment.origin}
                    onChange={(e) => setEditShipment({ ...editShipment, origin: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Destination</Label>
                  <Input
                    value={editShipment.destination}
                    onChange={(e) => setEditShipment({ ...editShipment, destination: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Current Location</Label>
                  <Input
                    value={editShipment.current_location}
                    onChange={(e) => setEditShipment({ ...editShipment, current_location: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select
                    value={editShipment.status}
                    onValueChange={(value) => setEditShipment({ ...editShipment, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="In Transit">In Transit</SelectItem>
                      <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                      <SelectItem value="Exception">Exception</SelectItem>
                      <SelectItem value="On Hold">On Hold</SelectItem>
                      <SelectItem value="Returned">Returned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Customs Status</Label>
                  <Select
                    value={editShipment.customs_status}
                    onValueChange={(value) => setEditShipment({ ...editShipment, customs_status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cleared">Cleared</SelectItem>
                      <SelectItem value="On Hold">On Hold</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Under Review">Under Review</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Shipment Value</Label>
                  <Input
                    type="number"
                    value={editShipment.shipment_value}
                    onChange={(e) => setEditShipment({ ...editShipment, shipment_value: parseFloat(e.target.value) })}
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleUpdateShipment} className="flex-1 bg-[#FF6600] hover:bg-[#E55A00]">
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
