import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-3xl font-bold">
              <span className="text-[#4D148C]">Fed</span>
              <span className="text-[#FF6600]">Ex</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => scrollToSection("home")} className="text-foreground hover:text-[#4D148C] transition-colors">
              Home
            </button>
            <button onClick={() => scrollToSection("services")} className="text-foreground hover:text-[#4D148C] transition-colors">
              Services
            </button>
            <button onClick={() => scrollToSection("pricing")} className="text-foreground hover:text-[#4D148C] transition-colors">
              Pricing
            </button>
            <button onClick={() => scrollToSection("process")} className="text-foreground hover:text-[#4D148C] transition-colors">
              Process
            </button>
            <button onClick={() => scrollToSection("about")} className="text-foreground hover:text-[#4D148C] transition-colors">
              About
            </button>
            <button onClick={() => scrollToSection("contact")} className="text-foreground hover:text-[#4D148C] transition-colors">
              Contact
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/track">
              <Button variant="default" className="bg-[#FF6600] hover:bg-[#E55A00]">Track Shipment</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
