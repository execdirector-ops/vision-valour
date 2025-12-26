import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Ride for Vision & Valour</h3>
            <p className="text-sm leading-relaxed">
              Honouring Col. Stone's legacy by raising funds and awareness for the Military Police Fund for Blind Children through an annual community-driven ride.
            </p>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 gap-6 text-sm">
              <ul className="space-y-2">
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/calendar" className="hover:text-white transition-colors">Calendar</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
              </ul>
              <ul className="space-y-2">
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li>
                  <a
                    href="https://www.facebook.com/groups/819884517486255"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Facebook Group
                  </a>
                </li>
                <li>
                  <a
                    href="https://mpfbc.ca/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    MP Fund
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Our Vision</h3>
            <p className="text-sm leading-relaxed">
              A community united in honouring Col. Stone's legacy by giving blind children the gift of sight, independence, and opportunity.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p className="flex items-center justify-center gap-2">
            Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> for our children
          </p>
          <p className="mt-2 text-gray-500">
            &copy; {new Date().getFullYear()} Ride for Vision & Valour. All rights reserved.
            {' | '}
            <Link
              to="/privacy"
              className="hover:text-white transition-colors underline"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
