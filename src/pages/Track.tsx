import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Package, MapPin, Calendar, DollarSign, AlertCircle, Mail, Phone, CheckCircle2, Truck, Clock } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Badge } from "@/components/ui/badge";
import { useSearchParams } from "react-router-dom";

interface ShipmentProgress {
  title: string;
  description: string;
  location: string;
  timestamp: string | null;
  completed: boolean;
}

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
  progress: ShipmentProgress[];
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

const API_BASE_URL = "https://sh-backend-1.onrender.com/api";

const Track = () => {
  const [searchParams] = useSearchParams();
  const [trackingId, setTrackingId] = useState(searchParams.get("tracking") || "");
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (trackingId) {
      handleTrack(new Event("submit") as any);
    }
  }, []);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trackingId.trim()) {
      toast.error("Please enter a tracking ID");
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/shipments/track/${trackingId.trim()}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          toast.error("Tracking ID not found");
        } else {
          toast.error("Error fetching shipment details");
        }
        setShipment(null);
      } else {
        const data = await response.json();
        setShipment(data.shipment);
        toast.success("Shipment found!");
      }
    } catch (err) {
      toast.error("An error occurred while tracking your shipment");
      setShipment(null);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTimestamp = (timestamp: string | null) => {
    if (!timestamp) return "Pending";
    return new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === "delivered") {
      return "bg-green-100 text-green-800 border-green-200";
    } else if (statusLower === "in transit") {
      return "bg-blue-100 text-blue-800 border-blue-200";
    } else if (statusLower === "out for delivery") {
      return "bg-orange-100 text-orange-800 border-orange-200";
    } else if (statusLower === "pending") {
      return "bg-gray-100 text-gray-800 border-gray-200";
    } else if (statusLower === "exception") {
      return "bg-red-100 text-red-800 border-red-200";
    } else if (statusLower === "on hold") {
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    } else if (statusLower === "returned") {
      return "bg-purple-100 text-purple-800 border-purple-200";
    }
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#4D148C] via-[#5A1A9E] to-[#4D148C] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Track Your Shipment</h1>
            <p className="text-center text-white/90 mb-8">
              Enter your tracking number to view real-time shipment status and delivery updates
            </p>

            <Card className="shadow-2xl">
              <CardContent className="p-6">
                <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Label htmlFor="trackingId" className="sr-only">Tracking ID</Label>
                    <Input
                      id="trackingId"
                      placeholder="Enter tracking number (e.g., SCS-20251102-330)"
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value)}
                      className="h-14 text-lg border-2 border-gray-300 focus:border-[#4D148C]"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="h-14 bg-[#FF6600] hover:bg-[#E55A00] text-white text-lg px-8"
                  >
                    <Search className="mr-2 h-5 w-5" />
                    {loading ? "Tracking..." : "Track"}
                  </Button>
                </form>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                  <span>Track by Reference</span>
                  <span>|</span>
                  <span>Multiple Tracking Numbers</span>
                  <span>|</span>
                  <span>Track by Email</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          {shipment ? (
            <div className="max-w-5xl mx-auto space-y-6">
              {/* Status Overview Card */}
              <Card className="border-2 border-[#4D148C]/20">
                <CardHeader className="bg-gradient-to-r from-[#4D148C]/5 to-[#FF6600]/5">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <CardTitle className="text-2xl mb-2">Shipment Status</CardTitle>
                      <p className="text-muted-foreground">Tracking ID: {shipment.tracking_id}</p>
                    </div>
                    <Badge className={`px-4 py-2 text-base font-semibold border ${getStatusColor(shipment.status)}`}>
                        {shipment.status}
                      </Badge>
                    </div>
                  </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-[#4D148C]/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Package className="h-5 w-5 text-[#4D148C]" />
                      </div>
                        <div>
                        <div className="text-sm text-muted-foreground mb-1">Service Type</div>
                          <div className="font-semibold">{shipment.service_type}</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-[#FF6600]/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-5 w-5 text-[#FF6600]" />
                      </div>
                        <div>
                        <div className="text-sm text-muted-foreground mb-1">Current Location</div>
                        <div className="font-semibold">{shipment.current_location}</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-[#4D148C]/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Calendar className="h-5 w-5 text-[#4D148C]" />
                      </div>
                        <div>
                        <div className="text-sm text-muted-foreground mb-1">Estimated Delivery</div>
                          <div className="font-semibold">{formatDate(shipment.estimated_delivery)}</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-[#FF6600]/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <DollarSign className="h-5 w-5 text-[#FF6600]" />
                      </div>
                        <div>
                        <div className="text-sm text-muted-foreground mb-1">Shipment Value</div>
                        <div className="font-semibold">${shipment?.shipment_value?.toLocaleString()} {shipment?.currency || "USD"}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              {/* Shipment Details */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-[#4D148C]" />
                      Shipment Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {shipment.progress && shipment.progress.length > 0 ? (
                        shipment.progress.map((event, index) => {
                          // Define the order of steps and which statuses complete them
                          const stepOrder = [
                            "Package Received",
                            "In Transit", 
                            "Customs Clearance",
                            "Out for Delivery",
                            "Delivered"
                          ];
                          
                          const statusMap: { [key: string]: string } = {
                            "Pending": "Package Received",
                            "In Transit": "In Transit",
                            "Out for Delivery": "Out for Delivery",
                            "Delivered": "Delivered",
                            "Exception": "Exception",
                            "On Hold": "On Hold",
                            "Returned": "Returned"
                          };
                          
                          const currentStepTitle = statusMap[shipment.status] || "";
                          const isCurrentStatus = event.title === currentStepTitle;
                          
                          // Find the index of current step in the order
                          const currentStepIndex = stepOrder.indexOf(currentStepTitle);
                          const eventStepIndex = stepOrder.indexOf(event.title);
                          
                          // Mark as completed if:
                          // 1. It's already marked as completed in the data, OR
                          // 2. It matches the current status, OR
                          // 3. It comes before the current status in the order (all previous steps are completed)
                          // 4. If status is "Delivered", all steps are completed
                          let isCompleted = event.completed || isCurrentStatus;
                          
                          if (!isCompleted && currentStepIndex !== -1 && eventStepIndex !== -1) {
                            // If current status is in the step order, mark all steps up to and including current as completed
                            if (eventStepIndex <= currentStepIndex) {
                              isCompleted = true;
                            }
                            // If status is "Delivered", mark all steps as completed
                            if (currentStepTitle === "Delivered") {
                              isCompleted = true;
                            }
                          }
                          
                          // Special case: When status is "Out for Delivery", ensure Customs Clearance is completed
                          if (shipment.status === "Out for Delivery" && event.title === "Customs Clearance") {
                            isCompleted = true;
                          }
                          
                          return (
                            <div key={index} className="flex gap-4">
                              <div className="flex flex-col items-center">
                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    isCompleted
                                      ? isCurrentStatus
                                        ? "bg-[#FF6600] text-white"
                                        : "bg-[#4D148C] text-white"
                                      : "bg-gray-200 text-gray-400"
                                  }`}
                                >
                                  {isCompleted ? (
                                    <CheckCircle2 className="h-5 w-5" />
                                  ) : (
                                    <Clock className="h-5 w-5" />
                                  )}
                                </div>
                                {index < shipment.progress.length - 1 && (
                                  <div className={`w-0.5 h-full mt-2 ${
                                    isCompleted ? "bg-[#4D148C]" : "bg-gray-200"
                                  }`} />
                                )}
                              </div>
                              <div className="flex-1 pb-6">
                                <div className={`rounded-lg p-4 ${
                                  isCompleted
                                    ? isCurrentStatus
                                      ? "bg-[#FF6600]/10 border border-[#FF6600]/30"
                                      : "bg-[#4D148C]/5 border border-[#4D148C]/20"
                                    : "bg-gray-50 border border-gray-200"
                                }`}>
                                  <h4 className={`font-semibold text-lg mb-1 ${
                                    isCompleted
                                      ? isCurrentStatus
                                        ? "text-[#FF6600]"
                                        : "text-[#4D148C]"
                                      : "text-gray-500"
                                  }`}>
                                    {event.title}
                                  </h4>
                                  <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
                                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      {event.location}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {formatTimestamp(event.timestamp)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>Timeline information will appear here</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Sidebar Info */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Shipment Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Origin</div>
                        <div className="font-semibold">{shipment.origin}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Destination</div>
                        <div className="font-semibold">{shipment.destination}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Customs Status</div>
                        <Badge 
                          variant={shipment.customs_status === "Cleared" ? "default" : "secondary"}
                          className="mt-1"
                        >
                          {shipment.customs_status}
                        </Badge>
                      </div>
                      {shipment.sender_name && (
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Sender</div>
                          <div className="font-semibold">{shipment.sender_name}</div>
                          {shipment.sender_email && (
                            <div className="text-xs text-muted-foreground mt-1">{shipment.sender_email}</div>
                          )}
                        </div>
                      )}
                      {shipment.recipient_name && (
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Recipient</div>
                          <div className="font-semibold">{shipment.recipient_name}</div>
                          {shipment.recipient_email && (
                            <div className="text-xs text-muted-foreground mt-1">{shipment.recipient_email}</div>
                          )}
                        </div>
                      )}
                      {shipment.package_weight && (
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Package Weight</div>
                          <div className="font-semibold">{shipment.package_weight} lbs</div>
                        </div>
                      )}
                      {shipment.package_dimensions && (
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Dimensions</div>
                          <div className="font-semibold">
                            {shipment.package_dimensions.length}" × {shipment.package_dimensions.width}" × {shipment.package_dimensions.height}"
                          </div>
                        </div>
                      )}
                      {shipment.package_type && (
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Package Type</div>
                          <div className="font-semibold">{shipment.package_type}</div>
                    </div>
                      )}
                  </CardContent>
                </Card>


                <Card>
                  <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-[#FF6600]" />
                        Need Help?
                      </CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-muted-foreground mb-4 text-sm">
                        If you have any questions about your shipment, our support team is here to help.
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-[#4D148C]" />
                          <span>+1 (206) 261-6762</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-[#4D148C]" />
                          <span className="break-all">Fedexshippingcenterpro@gmail.com</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-[#4D148C] mt-0.5" />
                          <span>4 Embarcadero Ctr Suite R4120, San Francisco, CA 94111, United States</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto text-center py-12">
              <div className="bg-white rounded-lg p-12 shadow-lg">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No shipment found</h3>
                <p className="text-muted-foreground">
                  Enter a tracking number above to view shipment details and delivery status.
                </p>
              </div>
              </div>
            )}
        </div>
      </main>

      <Footer />
      <WhatsAppButton whatsappLink="https://wa.link/dpyl97" />
    </div>
  );
};

export default Track;