'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin } from 'lucide-react';

interface Location {
  id: number;
  name: string;
  province: string;
  category: string;
  description: string;
  image_url: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export default function Home() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('/locations.json');
        const data: Location[] = await response.json();
        setLocations(data);
        setFilteredLocations(data);
        
        // Extract unique categories
        const uniqueCategories: string[] = ['All', ...Array.from(new Set(data.map((location: Location) => location.category)))];
        setCategories(uniqueCategories);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching locations:', error);
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    let filtered = locations;
    
    // Filter by category first
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(location => location.category === selectedCategory);
    }
    
    // Then filter by search query
    filtered = filtered.filter(
      (location) =>
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.province.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredLocations(filtered);
  }, [searchQuery, selectedCategory, locations]);

  const handleLocationClick = (id: number) => {
    router.push(`/location/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Hero Section */}
      <div 
        className="relative h-[60vh] md:h-[70vh] bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')`
        }}
      >
        <div className="text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            Discover Sri Lanka
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-200 max-w-2xl mx-auto">
            Explore the Pearl of the Indian Ocean - from ancient kingdoms to pristine beaches, 
            lush tea plantations to sacred temples.
          </p>
          
          {/* Search Box */}
          <div className="relative max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search for a destination..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg rounded-2xl border-0 shadow-2xl focus:ring-4 focus:ring-orange-300/50 focus:outline-none text-gray-800 bg-white/95 backdrop-blur-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="container mx-auto px-4 py-12">
        {/* Category Filter Buttons */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 md:px-6 md:py-3 rounded-full text-sm md:text-base font-medium transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category
                    ? 'bg-orange-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-orange-300 hover:text-orange-600 shadow-sm'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            {searchQuery ? 'Search Results' : selectedCategory === 'All' ? 'Popular Destinations' : `${selectedCategory} Destinations`}
          </h2>
          <p className="text-gray-600">
            {filteredLocations.length} {filteredLocations.length === 1 ? 'destination' : 'destinations'} found
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLocations.map((location) => (
              <div
                key={location.id}
                onClick={() => handleLocationClick(location.id)}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={location.image_url}
                    alt={location.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors duration-300">
                    {location.name}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 mr-1 text-orange-500" />
                    <span className="text-sm">{location.province}</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {location.description.substring(0, 120)}...
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredLocations.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No destinations found</h3>
            <p className="text-gray-500">Try searching with different keywords</p>
          </div>
        )}
      </div>
    </div>
  );
}