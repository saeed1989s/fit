import { Link } from "wouter";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-darkest text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <span className="font-heading font-bold text-2xl mb-4 block">FitConnect</span>
            <p className="text-neutral-light text-sm mb-4">
              Connecting fitness professionals with dedicated athletes for personalized training and nutrition guidance.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-light hover:text-white transition-colors">
                <FaFacebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-neutral-light hover:text-white transition-colors">
                <FaInstagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-neutral-light hover:text-white transition-colors">
                <FaTwitter className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-heading font-medium text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-neutral-light">
              <li>
                <Link href="/">
                  <a className="hover:text-white transition-colors">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/trainers">
                  <a className="hover:text-white transition-colors">Find a Trainer</a>
                </Link>
              </li>
              <li>
                <Link href="/workout-plans">
                  <a className="hover:text-white transition-colors">Browse Workouts</a>
                </Link>
              </li>
              <li>
                <Link href="/nutrition-plans">
                  <a className="hover:text-white transition-colors">Nutrition Plans</a>
                </Link>
              </li>
              <li>
                <Link href="/shop">
                  <a className="hover:text-white transition-colors">Shop</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-medium text-lg mb-4">For Trainers</h3>
            <ul className="space-y-2 text-neutral-light">
              <li>
                <Link href="/auth">
                  <a className="hover:text-white transition-colors">Join as Trainer</a>
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Trainer Resources</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Success Stories</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Pricing & Plans</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Partner Program</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-medium text-lg mb-4">Support</h3>
            <ul className="space-y-2 text-neutral-light">
              <li>
                <a href="#" className="hover:text-white transition-colors">Help Center</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Contact Us</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">FAQ</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-dark mt-12 pt-8 text-center text-neutral-light text-sm">
          <p>&copy; {currentYear} FitConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
