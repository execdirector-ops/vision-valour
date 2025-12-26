import { ShoppingBag } from 'lucide-react';

export default function SwagShopPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="bg-gradient-to-r from-red-900 to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <ShoppingBag className="w-12 h-12" />
            <h1 className="text-5xl font-bold">Swag Shop</h1>
          </div>
          <p className="text-xl text-red-100">
            Official Ride for Vision & Valour merchandise
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-center gap-8 mb-12">
          <img
            src="/Ride forVision & Valour 2026 Coin.png"
            alt="Ride for Vision & Valour 2026 Coin Front"
            className="w-48 h-48 rounded-full shadow-xl hover:scale-105 transition-transform duration-300"
          />
          <img
            src="/Ride forVision & Valour 2026 Coin Back.png"
            alt="Ride for Vision & Valour 2026 Coin Back"
            className="w-48 h-48 rounded-full shadow-xl hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="text-center mb-8">
            <ShoppingBag className="w-20 h-20 text-red-900 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Shop Official Merchandise
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Show your support with our official merchandise. All proceeds support our mission.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-lg shadow-inner bg-gray-50" style={{ height: '800px' }}>
            <iframe
              title="Swag Shop powered by Zeffy"
              style={{
                position: 'absolute',
                border: 0,
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                width: '100%',
                height: '100%'
              }}
              src="https://www.zeffy.com/embed/ticketing/ride-for-vision-and-valour-swag-shop"
              allowTransparency={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
