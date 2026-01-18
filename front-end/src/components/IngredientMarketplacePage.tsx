import { useState, useEffect } from 'react';
import { ArrowLeft, Search, ShoppingCart, Clock, Flame, Package, Filter, Star, Plus, Minus } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';

interface IngredientMarketplacePageProps {
  onNavigate: (page: string) => void;
}

export function IngredientMarketplacePage({ onNavigate }: IngredientMarketplacePageProps) {
  const [activeAisle, setActiveAisle] = useState('all');
  const [cartCount, setCartCount] = useState(3);
  const [flashSaleTime, setFlashSaleTime] = useState({ hours: 2, minutes: 34, seconds: 52 });

  // Flash Sale Countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setFlashSaleTime((prev) => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const aisles = [
    { id: 'all', name: 'All Items', icon: '🛒', count: 243 },
    { id: 'vegetables', name: 'Vegetables', icon: '🥬', count: 48 },
    { id: 'meat', name: 'Meat & Seafood', icon: '🥩', count: 34 },
    { id: 'spices', name: 'Spices & Herbs', icon: '🌶️', count: 56 },
    { id: 'dairy', name: 'Dairy & Eggs', icon: '🥛', count: 28 },
    { id: 'pantry', name: 'Pantry Staples', icon: '🍚', count: 77 },
  ];

  const flashSaleItems = [
    {
      id: 'fs1',
      name: 'Organic Baby Spinach',
      image: 'https://images.unsplash.com/photo-1748342319942-223b99937d4e?w=400',
      originalPrice: 6.99,
      salePrice: 3.49,
      discount: 50,
      stock: 24,
      unit: '300g bag'
    },
    {
      id: 'fs2',
      name: 'Premium Ribeye Steak',
      image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400',
      originalPrice: 24.99,
      salePrice: 17.49,
      discount: 30,
      stock: 12,
      unit: '500g'
    },
    {
      id: 'fs3',
      name: 'Vietnamese Cinnamon',
      image: 'https://images.unsplash.com/photo-1564965925873-26de794b0d41?w=400',
      originalPrice: 8.99,
      salePrice: 5.99,
      discount: 33,
      stock: 18,
      unit: '100g'
    },
    {
      id: 'fs4',
      name: 'Free-Range Eggs (12pc)',
      image: 'https://images.unsplash.com/photo-1615404385046-be2d7a02551f?w=400',
      originalPrice: 7.99,
      salePrice: 4.99,
      discount: 38,
      stock: 30,
      unit: 'dozen'
    },
  ];

  const recipeKits = [
    {
      id: 'kit1',
      name: 'Vietnamese Pho Kit',
      description: 'Everything you need for authentic Pho Bo',
      image: 'https://images.unsplash.com/photo-1708493449638-be3ffd051472?w=400',
      price: 32.99,
      originalPrice: 45.99,
      rating: 4.9,
      reviews: 234,
      items: 12,
      serves: 4,
      popular: true
    },
    {
      id: 'kit2',
      name: 'Thai Green Curry Kit',
      description: 'Fresh ingredients for restaurant-quality curry',
      image: 'https://images.unsplash.com/photo-1739792598744-3512897156e3?w=400',
      price: 28.99,
      originalPrice: 39.99,
      rating: 4.8,
      reviews: 189,
      items: 10,
      serves: 4,
      popular: false
    },
    {
      id: 'kit3',
      name: 'Korean BBQ Feast Kit',
      description: 'Premium marinated meats and banchan essentials',
      image: 'https://images.unsplash.com/photo-1693743387915-7d190a0e636f?w=400',
      price: 54.99,
      originalPrice: 72.99,
      rating: 5.0,
      reviews: 412,
      items: 15,
      serves: 6,
      popular: true
    },
    {
      id: 'kit4',
      name: 'Italian Pasta Night Kit',
      description: 'Fresh pasta, sauce, and all the fixings',
      image: 'https://images.unsplash.com/photo-1588013273468-315fd88ea34c?w=400',
      price: 24.99,
      originalPrice: 34.99,
      rating: 4.7,
      reviews: 156,
      items: 8,
      serves: 4,
      popular: false
    },
  ];

  const marketplaceItems = {
    vegetables: [
      {
        id: 'v1',
        name: 'Organic Cherry Tomatoes',
        image: 'https://images.unsplash.com/photo-1748342319942-223b99937d4e?w=400',
        price: 4.99,
        unit: '500g',
        organic: true,
        rating: 4.8,
        inStock: true
      },
      {
        id: 'v2',
        name: 'Fresh Cilantro Bunch',
        image: 'https://images.unsplash.com/photo-1564965925873-26de794b0d41?w=400',
        price: 2.49,
        unit: 'bunch',
        organic: false,
        rating: 4.9,
        inStock: true
      },
      {
        id: 'v3',
        name: 'Thai Basil',
        image: 'https://images.unsplash.com/photo-1615404385046-be2d7a02551f?w=400',
        price: 3.99,
        unit: 'bunch',
        organic: true,
        rating: 4.7,
        inStock: true
      },
      {
        id: 'v4',
        name: 'Baby Bok Choy',
        image: 'https://images.unsplash.com/photo-1739792598744-3512897156e3?w=400',
        price: 3.49,
        unit: '300g',
        organic: false,
        rating: 4.6,
        inStock: true
      },
    ],
    meat: [
      {
        id: 'm1',
        name: 'Premium Beef Brisket',
        image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400',
        price: 18.99,
        unit: '1kg',
        organic: false,
        rating: 4.9,
        inStock: true
      },
      {
        id: 'm2',
        name: 'Wild-Caught Salmon',
        image: 'https://images.unsplash.com/photo-1693743387915-7d190a0e636f?w=400',
        price: 22.99,
        unit: '500g',
        organic: false,
        rating: 5.0,
        inStock: true
      },
      {
        id: 'm3',
        name: 'Organic Chicken Breast',
        image: 'https://images.unsplash.com/photo-1708493449638-be3ffd051472?w=400',
        price: 14.99,
        unit: '800g',
        organic: true,
        rating: 4.8,
        inStock: true
      },
    ],
    spices: [
      {
        id: 's1',
        name: 'Star Anise Whole',
        image: 'https://images.unsplash.com/photo-1564965925873-26de794b0d41?w=400',
        price: 6.99,
        unit: '50g',
        organic: false,
        rating: 4.9,
        inStock: true
      },
      {
        id: 's2',
        name: 'Lemongrass Stalks',
        image: 'https://images.unsplash.com/photo-1615404385046-be2d7a02551f?w=400',
        price: 4.49,
        unit: '100g',
        organic: true,
        rating: 4.7,
        inStock: true
      },
      {
        id: 's3',
        name: 'Thai Chili Peppers',
        image: 'https://images.unsplash.com/photo-1748342319942-223b99937d4e?w=400',
        price: 3.99,
        unit: '100g',
        organic: false,
        rating: 5.0,
        inStock: true
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => onNavigate('home')}
              className="p-2 hover:bg-muted rounded-full transition-all hover:scale-110"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">Ingredient Marketplace</h1>
              <p className="text-sm text-muted-foreground">Supermarket 4.0</p>
            </div>
            <button
              onClick={() => onNavigate('cart')}
              className="relative p-2 hover:bg-muted rounded-full transition-all hover:scale-110"
            >
              <ShoppingCart className="w-6 h-6" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-white text-xs">
                {cartCount}
              </Badge>
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search ingredients..."
              className="pl-12 h-12 rounded-2xl bg-muted/50 border-0"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Flash Sales Section */}
        <Card className="overflow-hidden bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 border-2 border-primary/30">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-orange-500 rounded-2xl flex items-center justify-center">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Flash Sales</h2>
                  <p className="text-sm text-muted-foreground">Limited time offers!</p>
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <div className="flex gap-1">
                  <div className="bg-white/80 backdrop-blur-sm px-3 py-2 rounded-xl text-center min-w-[3rem]">
                    <div className="text-xl font-bold text-primary">
                      {String(flashSaleTime.hours).padStart(2, '0')}
                    </div>
                    <div className="text-xs text-muted-foreground">hrs</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm px-3 py-2 rounded-xl text-center min-w-[3rem]">
                    <div className="text-xl font-bold text-primary">
                      {String(flashSaleTime.minutes).padStart(2, '0')}
                    </div>
                    <div className="text-xs text-muted-foreground">min</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm px-3 py-2 rounded-xl text-center min-w-[3rem]">
                    <div className="text-xl font-bold text-primary">
                      {String(flashSaleTime.seconds).padStart(2, '0')}
                    </div>
                    <div className="text-xs text-muted-foreground">sec</div>
                  </div>
                </div>
              </div>
            </div>

            <ScrollArea className="w-full">
              <div className="flex gap-4 pb-2">
                {flashSaleItems.map((item) => (
                  <Card
                    key={item.id}
                    className="flex-shrink-0 w-64 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-primary/30"
                  >
                    <div className="relative aspect-square">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-red-500 text-white border-0 shadow-lg">
                          -{item.discount}%
                        </Badge>
                      </div>
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="bg-white/95 backdrop-blur-sm rounded-lg p-2">
                          <div className="text-xs text-muted-foreground mb-1">
                            Only {item.stock} left!
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary to-orange-500 transition-all"
                              style={{ width: `${(item.stock / 30) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4">
                      <h4 className="font-semibold mb-1 line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-muted-foreground mb-3">{item.unit}</p>

                      <div className="flex items-end gap-2 mb-3">
                        <span className="text-2xl font-bold text-primary">
                          ${item.salePrice}
                        </span>
                        <span className="text-sm text-muted-foreground line-through mb-1">
                          ${item.originalPrice}
                        </span>
                      </div>

                      <Button className="w-full bg-primary hover:bg-primary/90 rounded-full h-9">
                        Add to Cart
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </Card>

        {/* One-Click Recipe Kits */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary/10 rounded-2xl flex items-center justify-center">
                <Package className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">One-Click Recipe Kits</h2>
                <p className="text-sm text-muted-foreground">Complete meal bundles</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recipeKits.map((kit) => (
              <Card
                key={kit.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-secondary"
              >
                <div className="relative aspect-square">
                  <img
                    src={kit.image}
                    alt={kit.name}
                    className="w-full h-full object-cover"
                  />
                  {kit.popular && (
                    <Badge className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                      ⭐ Popular
                    </Badge>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-secondary text-white border-0">
                      Save ${(kit.originalPrice - kit.price).toFixed(2)}
                    </Badge>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold mb-1 line-clamp-1">{kit.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {kit.description}
                  </p>

                  <div className="flex items-center gap-3 mb-3 text-xs">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{kit.rating}</span>
                      <span className="text-muted-foreground">({kit.reviews})</span>
                    </div>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">{kit.items} items</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">Serves {kit.serves}</span>
                  </div>

                  <div className="flex items-end gap-2 mb-3">
                    <span className="text-xl font-bold text-secondary">${kit.price}</span>
                    <span className="text-sm text-muted-foreground line-through mb-0.5">
                      ${kit.originalPrice}
                    </span>
                  </div>

                  <Button className="w-full bg-secondary hover:bg-secondary/90 rounded-full">
                    Add Complete Kit
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Virtual Aisles */}
        <div>
          <h2 className="text-xl font-bold mb-4">Browse by Category</h2>

          <Tabs value={activeAisle} onValueChange={setActiveAisle}>
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 bg-muted rounded-2xl p-1 mb-6">
              {aisles.map((aisle) => (
                <TabsTrigger
                  key={aisle.id}
                  value={aisle.id}
                  className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  <span className="mr-2">{aisle.icon}</span>
                  <span className="hidden md:inline">{aisle.name}</span>
                  <span className="md:hidden">{aisle.name.split(' ')[0]}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              {Object.entries(marketplaceItems).map(([category, items]) => (
                <div key={category}>
                  <h3 className="text-lg font-bold mb-3 capitalize">{category}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {items.map((item: any) => (
                      <ProductCard key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>

            {Object.entries(marketplaceItems).map(([category, items]) => (
              <TabsContent key={category} value={category}>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {items.map((item: any) => (
                    <ProductCard key={item.id} item={item} />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ item }: { item: any }) {
  const [quantity, setQuantity] = useState(0);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
      <div className="relative aspect-square">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        {item.organic && (
          <Badge className="absolute top-2 left-2 bg-secondary text-white border-0 text-xs">
            🌱 Organic
          </Badge>
        )}
      </div>

      <div className="p-3">
        <h4 className="font-semibold text-sm mb-1 line-clamp-2">{item.name}</h4>
        <p className="text-xs text-muted-foreground mb-2">{item.unit}</p>

        <div className="flex items-center gap-1 mb-3">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-medium">{item.rating}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">${item.price}</span>

          {quantity === 0 ? (
            <Button
              size="sm"
              onClick={() => setQuantity(1)}
              className="bg-primary hover:bg-primary/90 rounded-full h-8 px-3"
            >
              <Plus className="w-4 h-4" />
            </Button>
          ) : (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setQuantity(Math.max(0, quantity - 1))}
                className="w-7 h-7 bg-muted hover:bg-primary hover:text-white rounded-full flex items-center justify-center transition-all"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-7 text-center font-bold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-7 h-7 bg-muted hover:bg-primary hover:text-white rounded-full flex items-center justify-center transition-all"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
