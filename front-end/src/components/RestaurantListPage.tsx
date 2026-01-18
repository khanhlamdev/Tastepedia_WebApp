import { useState } from 'react';
import { ArrowLeft, Search, MapPin, Star, Clock, TrendingUp, Bike, Filter, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';

interface RestaurantListPageProps {
  onNavigate: (page: string, restaurantId?: string) => void;
}

export function RestaurantListPage({ onNavigate }: RestaurantListPageProps) {
  const [activeFilters, setActiveFilters] = useState<string[]>(['nearme']);
  const [searchQuery, setSearchQuery] = useState('');

  const filters = [
    { id: 'nearme', label: 'Near Me', icon: MapPin },
    { id: 'rating', label: 'Rating 4.5+', icon: Star },
    { id: 'open', label: 'Open Now', icon: Clock },
    { id: 'freeship', label: 'Free Ship', icon: Bike },
  ];

  const quickReorders = [
    {
      id: 'r1',
      name: 'Pho 24',
      dish: 'Beef Pho',
      image: 'https://images.unsplash.com/photo-1708493449638-be3ffd051472?w=400',
      logo: '🍜',
      price: 12.99
    },
    {
      id: 'r2',
      name: 'Banh Mi Station',
      dish: 'Grilled Pork',
      image: 'https://images.unsplash.com/photo-1693743387915-7d190a0e636f?w=400',
      logo: '🥖',
      price: 8.50
    },
    {
      id: 'r3',
      name: 'Thai Express',
      dish: 'Pad Thai',
      image: 'https://images.unsplash.com/photo-1739792598744-3512897156e3?w=400',
      logo: '🍛',
      price: 14.99
    },
    {
      id: 'r4',
      name: 'Sushi Plus',
      dish: 'Dragon Roll',
      image: 'https://images.unsplash.com/photo-1615404385046-be2d7a02551f?w=400',
      logo: '🍣',
      price: 16.50
    },
  ];

  const restaurants = [
    {
      id: 'r1',
      name: 'Pho 24 Vietnamese Kitchen',
      logo: '🍜',
      cover: 'https://images.unsplash.com/photo-1708493449638-be3ffd051472?w=800',
      cuisine: 'Vietnamese',
      rating: 4.8,
      reviews: 1240,
      distance: '0.8 km',
      eta: '20-30 min',
      deliveryFee: 0,
      featured: true,
      tags: ['Free Delivery', 'Top Rated'],
      priceRange: '$$'
    },
    {
      id: 'r2',
      name: 'Banh Mi Station',
      logo: '🥖',
      cover: 'https://images.unsplash.com/photo-1693743387915-7d190a0e636f?w=800',
      cuisine: 'Vietnamese',
      rating: 4.7,
      reviews: 890,
      distance: '1.2 km',
      eta: '25-35 min',
      deliveryFee: 2.99,
      featured: false,
      tags: ['Fast Service'],
      priceRange: '$'
    },
    {
      id: 'r3',
      name: 'Thai Express Restaurant',
      logo: '🍛',
      cover: 'https://images.unsplash.com/photo-1739792598744-3512897156e3?w=800',
      cuisine: 'Thai',
      rating: 4.9,
      reviews: 2150,
      distance: '2.1 km',
      eta: '30-40 min',
      deliveryFee: 0,
      featured: true,
      tags: ['Free Delivery', 'Authentic'],
      priceRange: '$$'
    },
    {
      id: 'r4',
      name: 'Sushi Plus Premium',
      logo: '🍣',
      cover: 'https://images.unsplash.com/photo-1615404385046-be2d7a02551f?w=800',
      cuisine: 'Japanese',
      rating: 4.6,
      reviews: 670,
      distance: '1.5 km',
      eta: '35-45 min',
      deliveryFee: 3.99,
      featured: false,
      tags: ['Premium Quality'],
      priceRange: '$$$'
    },
    {
      id: 'r5',
      name: 'Korean BBQ House',
      logo: '🥓',
      cover: 'https://images.unsplash.com/photo-1588013273468-315fd88ea34c?w=800',
      cuisine: 'Korean',
      rating: 4.8,
      reviews: 1520,
      distance: '2.8 km',
      eta: '40-50 min',
      deliveryFee: 4.50,
      featured: true,
      tags: ['Popular'],
      priceRange: '$$$'
    },
    {
      id: 'r6',
      name: 'Dumpling Dynasty',
      logo: '🥟',
      cover: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800',
      cuisine: 'Chinese',
      rating: 4.7,
      reviews: 980,
      distance: '1.8 km',
      eta: '25-35 min',
      deliveryFee: 0,
      featured: false,
      tags: ['Free Delivery', 'Handmade'],
      priceRange: '$$'
    },
    {
      id: 'r7',
      name: 'Italian Trattoria',
      logo: '🍝',
      cover: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
      cuisine: 'Italian',
      rating: 4.9,
      reviews: 1890,
      distance: '3.2 km',
      eta: '35-45 min',
      deliveryFee: 5.00,
      featured: true,
      tags: ['Chef Special'],
      priceRange: '$$$'
    },
    {
      id: 'r8',
      name: 'Taco Fiesta',
      logo: '🌮',
      cover: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800',
      cuisine: 'Mexican',
      rating: 4.6,
      reviews: 750,
      distance: '2.5 km',
      eta: '30-40 min',
      deliveryFee: 3.50,
      featured: false,
      tags: ['Spicy'],
      priceRange: '$$'
    },
  ];

  const toggleFilter = (filterId: string) => {
    setActiveFilters(prev =>
      prev.includes(filterId)
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId]
    );
  };

  const filteredRestaurants = restaurants.filter(restaurant => {
    if (activeFilters.includes('rating') && restaurant.rating < 4.5) return false;
    if (activeFilters.includes('freeship') && restaurant.deliveryFee > 0) return false;
    if (searchQuery && !restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => onNavigate('home')}
              className="p-2 hover:bg-muted rounded-full transition-all hover:scale-110"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">Restaurants</h1>
              <p className="text-sm text-muted-foreground">Order from your favorites</p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full"
            >
              <Filter className="w-5 h-5" />
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search restaurants or cuisines..."
              className="pl-12 pr-10 h-12 rounded-2xl bg-muted/50 border-0"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {filters.map((filter) => {
              const Icon = filter.icon;
              const isActive = activeFilters.includes(filter.id);
              
              return (
                <button
                  key={filter.id}
                  onClick={() => toggleFilter(filter.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 ${
                    isActive
                      ? 'bg-primary text-white shadow-lg scale-105'
                      : 'bg-white border border-border hover:border-primary hover:scale-105'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{filter.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Quick Reorder Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">Quick Reorder</h2>
            </div>
          </div>

          <ScrollArea className="w-full">
            <div className="flex gap-4 pb-2">
              {quickReorders.map((order) => (
                <button
                  key={order.id}
                  onClick={() => onNavigate('restaurant-detail', order.id)}
                  className="flex-shrink-0 w-56 group"
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div className="relative aspect-video">
                      <img
                        src={order.image}
                        alt={order.dish}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute top-2 left-2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-xl">
                        {order.logo}
                      </div>
                    </div>
                    <div className="p-3">
                      <h4 className="font-semibold text-sm mb-1">{order.name}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{order.dish}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-primary font-bold">${order.price}</span>
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-primary/90 h-7 px-3 rounded-full"
                        >
                          Reorder
                        </Button>
                      </div>
                    </div>
                  </Card>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* All Restaurants */}
        <div>
          <h2 className="text-xl font-bold mb-4">
            {filteredRestaurants.length} Restaurants Available
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRestaurants.map((restaurant) => (
              <button
                key={restaurant.id}
                onClick={() => onNavigate('restaurant-detail', restaurant.id)}
                className="group text-left"
              >
                <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-primary">
                  {/* Cover Image */}
                  <div className="relative aspect-[16/10]">
                    <img
                      src={restaurant.cover}
                      alt={restaurant.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                    
                    {/* Logo */}
                    <div className="absolute top-3 left-3 w-14 h-14 bg-white/95 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                      {restaurant.logo}
                    </div>

                    {/* Featured Badge */}
                    {restaurant.featured && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg">
                          ⭐ Featured
                        </Badge>
                      </div>
                    )}

                    {/* Bottom Info */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center gap-2 text-white/90 text-xs mb-2">
                        <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-1 rounded-full">
                          <MapPin className="w-3 h-3" />
                          {restaurant.distance}
                        </span>
                        <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-1 rounded-full">
                          <Clock className="w-3 h-3" />
                          {restaurant.eta}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Restaurant Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                      {restaurant.name}
                    </h3>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-sm">{restaurant.rating}</span>
                        <span className="text-xs text-muted-foreground">({restaurant.reviews})</span>
                      </div>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{restaurant.cuisine}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs font-medium">{restaurant.priceRange}</span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {restaurant.tags.map((tag, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className={`text-xs ${
                            tag.includes('Free') ? 'border-secondary text-secondary' : ''
                          }`}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Delivery Fee */}
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="flex items-center gap-1">
                        <Bike className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {restaurant.deliveryFee === 0 ? (
                            <span className="text-secondary">Free Delivery</span>
                          ) : (
                            <span className="text-muted-foreground">${restaurant.deliveryFee} fee</span>
                          )}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90 rounded-full h-8 px-4"
                      >
                        Order Now
                      </Button>
                    </div>
                  </div>
                </Card>
              </button>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredRestaurants.length === 0 && (
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-xl font-bold mb-2">No Restaurants Found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your filters or search for something else
            </p>
            <Button
              onClick={() => {
                setActiveFilters(['nearme']);
                setSearchQuery('');
              }}
              variant="outline"
              className="rounded-full"
            >
              Clear All Filters
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
