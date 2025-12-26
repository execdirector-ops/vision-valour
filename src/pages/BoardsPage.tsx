import { Clipboard } from 'lucide-react';

export default function BoardsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="bg-gradient-to-r from-red-900 to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <Clipboard className="w-12 h-12" />
            <h1 className="text-5xl font-bold">Boards</h1>
          </div>
          <p className="text-xl text-red-100">
            Community boards and announcements
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Coming Soon</h2>
          <p className="text-gray-700 text-lg">
            This section will feature community boards and announcements. Check back soon for updates!
          </p>
        </div>
      </div>
    </div>
  );
}
