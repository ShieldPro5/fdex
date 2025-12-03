import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#4D148C] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="mb-4">
              <span className="text-2xl font-bold">
                <span className="text-white">Fed</span>
                <span className="text-[#FF6600]">Ex</span>
              </span>
            </div>
            <p className="text-white/80 text-sm mb-4">
              Your single source for time-sensitive, time-definite and day-definite package, document, and freight transportation services.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-white/80 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/track" className="text-white/80 hover:text-white transition-colors">
                  Track Your Shipment
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-white">Contact</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>Phone: +1 (206) 261-6762</li>
              <li className="break-all">Email: Fedexshippingcenterpro@gmail.com</li>
              <li className="text-xs">4 Embarcadero Ctr Suite R4120</li>
              <li className="text-xs">San Francisco, CA 94111, United States</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8">
          <div className="text-center text-sm text-white/60">
            <p>&copy; {new Date().getFullYear()} FedEx. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
