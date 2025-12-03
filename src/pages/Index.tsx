import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Package, Truck, Globe, Shield, Clock, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Index = () => {
  const navigate = useNavigate();
  const [trackingId, setTrackingId] = useState("");

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      navigate(`/track?tracking=${trackingId.trim()}`);
    } else {
      navigate("/track");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section with Tracking */}
      <section id="home" className="relative bg-gradient-to-br from-[#4D148C] via-[#5A1A9E] to-[#4D148C] text-white py-20 md:py-32 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Ship, manage, track, deliver
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Your single source for time-sensitive, time-definite and day-definite package, document, and freight transportation services
            </p>
          </div>

          {/* Tracking Input Card */}
          <Card className="max-w-3xl mx-auto shadow-2xl">
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Enter your tracking number"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    className="h-14 text-lg border-2 border-gray-300 focus:border-[#4D148C]"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="h-14 bg-[#FF6600] hover:bg-[#E55A00] text-white text-lg px-8"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Track
                </Button>
              </form>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                <Link to="/track" className="hover:text-[#4D148C]">Track by Reference</Link>
                <span>|</span>
                <Link to="/track" className="hover:text-[#4D148C]">Multiple Tracking Numbers</Link>
                <span>|</span>
                <Link to="/track" className="hover:text-[#4D148C]">Track by Email</Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Image Section 1 - Girl with Package */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-square rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="/images/girl-with-package.jpg" 
                  alt="Happy girl opening FedEx package" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800&h=800&fit=crop";
                  }}
                />
              </div>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Delivering smiles, one package at a time
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Experience the joy of reliable delivery. Our commitment to excellence ensures your packages arrive safely and on time, bringing happiness to your doorstep.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#4D148C]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-[#4D148C]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Secure Shipping</h3>
                    <p className="text-gray-600">Your packages are protected every step of the way</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#FF6600]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-[#FF6600]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">On-Time Delivery</h3>
                    <p className="text-gray-600">Time-definite delivery you can count on</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Section 2 - Delivery Driver with Scanner */}
      <section id="services" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Professional delivery service
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Our trained professionals use advanced technology to ensure accurate and timely deliveries. Every package is handled with care and precision.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#4D148C] rounded-full"></div>
                  <span className="text-gray-700">Real-time package tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#FF6600] rounded-full"></div>
                  <span className="text-gray-700">Proof of delivery documentation</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#4D148C] rounded-full"></div>
                  <span className="text-gray-700">Secure handling at every step</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="/images/delivery-driver-scanner.jpg" 
                  alt="FedEx delivery driver with scanner" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Section 3 - Delivery Driver Walking */}
      <section id="pricing" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="/images/delivery-driver-walking.jpg" 
                  alt="FedEx delivery driver walking with package" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop";
                  }}
                />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Dedicated to your success
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Our team of professionals is committed to delivering excellence. From pickup to delivery, we ensure your packages are handled with the utmost care and attention.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#4D148C]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Truck className="h-6 w-6 text-[#4D148C]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Reliable Fleet</h3>
                    <p className="text-gray-600">Modern vehicles equipped with the latest technology</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#FF6600]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Globe className="h-6 w-6 text-[#FF6600]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Global Network</h3>
                    <p className="text-gray-600">Worldwide coverage for all your shipping needs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Section 4 - Man with Phone */}
      <section id="process" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Stay connected, stay informed
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Track your shipments in real-time from anywhere. Our mobile-friendly platform keeps you updated on every step of your package's journey.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#4D148C] rounded-full"></div>
                  <span className="text-gray-700">Mobile tracking app</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#FF6600] rounded-full"></div>
                  <span className="text-gray-700">Email and SMS notifications</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#4D148C] rounded-full"></div>
                  <span className="text-gray-700">24/7 customer support</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="/images/man-with-phone.jpg" 
                  alt="Man checking FedEx tracking on phone" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Section 5 - FedEx Van on Road */}
      <section id="about" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our fleet delivers excellence
            </h2>
            <p className="text-lg text-gray-600">
              From coast to coast, our reliable fleet ensures your packages reach their destination safely and on time.
            </p>
          </div>
          <div className="relative">
            <div className="aspect-[16/9] rounded-lg overflow-hidden shadow-2xl">
              <img 
                src="/images/fedex-van-road.jpg" 
                alt="FedEx delivery van on the road" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=675&fit=crop";
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-[#4D148C]">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-[#4D148C]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-[#4D148C]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Create a Shipment</h3>
                <p className="text-gray-600 mb-4">Ship packages quickly and easily</p>
                <Button variant="outline" className="w-full">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-[#FF6600]">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-[#FF6600]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8 text-[#FF6600]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Schedule a Pickup</h3>
                <p className="text-gray-600 mb-4">We'll pick up your packages</p>
                <Button variant="outline" className="w-full">
                  Schedule Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-[#4D148C]">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-[#4D148C]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-[#4D148C]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Find a Location</h3>
                <p className="text-gray-600 mb-4">Locate FedEx offices near you</p>
                <Button variant="outline" className="w-full">
                  Find Location <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="contact" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Package className="h-12 w-12 text-[#4D148C] mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Express Shipping</h3>
                <p className="text-gray-600 text-sm">Fast, reliable express delivery</p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Truck className="h-12 w-12 text-[#FF6600] mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Ground Shipping</h3>
                <p className="text-gray-600 text-sm">Economical ground transportation</p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Globe className="h-12 w-12 text-[#4D148C] mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">International</h3>
                <p className="text-gray-600 text-sm">Worldwide shipping solutions</p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Shield className="h-12 w-12 text-[#FF6600] mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Customs Clearance</h3>
                <p className="text-gray-600 text-sm">Expert customs services</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton whatsappLink="https://wa.link/dpyl97" />
    </div>
  );
};

export default Index;