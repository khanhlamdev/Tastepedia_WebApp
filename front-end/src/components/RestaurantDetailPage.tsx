import { useState, useEffect } from 'react';
import { ArrowLeft, Star, MapPin, Clock, Heart, Share2, Info, Minus, Plus, X } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';

interface RestaurantDetailPageProps {
  onNavigate: (page: string) => void;
}

export function RestaurantDetailPage({ onNavigate }: RestaurantDetailPageProps) {
  const [scrollY, setScrollY] = useState(0);
  const [activeCategory, setActiveCategory] = useState('appetizers');
  const [selectedDish, setSelectedDish] = useState<any>(null);
  const [dishSize, setDishSize] = useState('medium');
  const [sugarLevel, setSugarLevel] = useState('normal');
  const [iceLevel, setIceLevel] = useState('normal');
  const [quantity, setQuantity] = useState(1);
  const [specialNotes, setSpecialNotes] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const restaurant = {
    name: 'Pho 24 Vietnamese Kitchen',
    logo: '🍜',
    cover: 'https://images.unsplash.com/photo-1708493449638-be3ffd051472?w=1200',
    cuisine: 'Vietnamese',
    rating: 4.8,
    reviews: 1240,
    distance: '0.8 km',
    eta: '20-30 min',
    deliveryFee: 0,
    priceRange: '$$',
    address: '123 Main Street, Downtown',
    hours: 'Open until 10:00 PM',
    description: 'Authentic Vietnamese cuisine made with love and traditional recipes passed down through generations.'
  };

  const categories = [
    { id: 'appetizers', name: 'Appetizers', icon: '🥟' },
    { id: 'soups', name: 'Soups & Noodles', icon: '🍜' },
    { id: 'mains', name: 'Main Dishes', icon: '🍛' },
    { id: 'beverages', name: 'Beverages', icon: '🧋' },
    { id: 'desserts', name: 'Desserts', icon: '🍮' },
  ];

  const menuItems = {
    appetizers: [
      {
        id: 'd1',
        name: 'Fresh Spring Rolls',
        description: 'Rice paper rolls filled with shrimp, herbs, and vermicelli',
        price: 8.99,
        image: 'https://images.unsplash.com/photo-1693743387915-7d190a0e636f?w=400',
        popular: true,
        spicy: false,
        vegetarian: true
      },
      {
        id: 'd2',
        name: 'Crispy Vietnamese Pancake',
        description: 'Savory crepe with pork, shrimp, and bean sprouts',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1615404385046-be2d7a02551f?w=400',
        popular: false,
        spicy: false,
        vegetarian: false
      },
    ],
    soups: [
      {
        id: 'd3',
        name: 'Traditional Beef Pho',
        description: 'Aromatic beef broth with rice noodles, herbs, and your choice of beef cuts',
        price: 14.99,
        image: 'https://images.unsplash.com/photo-1708493449638-be3ffd051472?w=400',
        popular: true,
        spicy: false,
        vegetarian: false,
        sizes: ['Small', 'Medium', 'Large']
      },
      {
        id: 'd4',
        name: 'Chicken Pho',
        description: 'Light and flavorful chicken broth with tender chicken pieces',
        price: 13.99,
        image: 'https://images.unsplash.com/photo-1739792598744-3512897156e3?w=400',
        popular: true,
        spicy: false,
        vegetarian: false,
        sizes: ['Small', 'Medium', 'Large']
      },
      {
        id: 'd5',
        name: 'Bun Bo Hue',
        description: 'Spicy beef and pork noodle soup from Central Vietnam',
        price: 15.99,
        image: 'https://images.unsplash.com/photo-1588013273468-315fd88ea34c?w=400',
        popular: false,
        spicy: true,
        vegetarian: false,
        sizes: ['Small', 'Medium', 'Large']
      },
    ],
    mains: [
      {
        id: 'd6',
        name: 'Grilled Lemongrass Chicken',
        description: 'Marinated chicken with fragrant lemongrass served with rice',
        price: 16.99,
        image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400',
        popular: true,
        spicy: false,
        vegetarian: false
      },
      {
        id: 'd7',
        name: 'Shaking Beef (Bo Luc Lac)',
        description: 'Tender beef cubes wok-tossed with garlic and black pepper',
        price: 19.99,
        image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400',
        popular: true,
        spicy: false,
        vegetarian: false
      },
    ],
    beverages: [
      {
        id: 'd8',
        name: 'Vietnamese Iced Coffee',
        description: 'Strong coffee with sweetened condensed milk over ice',
        price: 5.99,
        image: 'https://images.unsplash.com/photo-1564965925873-26de794b0d41?w=400',
        popular: true,
        spicy: false,
        vegetarian: true,
        customizable: true
      },
      {
        id: 'd9',
        name: 'Mango Smoothie',
        description: 'Fresh mango blended with ice and condensed milk',
        price: 6.99,
        image: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?w=400',
        popular: false,
        spicy: false,
        vegetarian: true,
        customizable: true
      },
    ],
    desserts: [
      {
        id: 'd10',
        name: 'Che Ba Mau',
        description: 'Colorful three-color dessert with beans, jellies, and coconut milk',
        price: 7.99,
        image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400',
        popular: true,
        spicy: false,
        vegetarian: true
      },
    ],
  };

  const handleAddToCart = () => {
    // Add to cart logic here
    setSelectedDish(null);
    setQuantity(1);
    setSpecialNotes('');
  };

  const totalPrice = selectedDish ? selectedDish.price * quantity : 0;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Parallax Header */}
      <div className="relative h-80 overflow-hidden">
        <div
          className="absolute inset-0 transition-transform duration-100"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        >
          <img
            src={restaurant.cover}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

        {/* Top Actions */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
          <button
            onClick={() => onNavigate('restaurants')}
            className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex gap-2">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            <button className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Restaurant Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 bg-white/95 backdrop-blur-md rounded-3xl flex items-center justify-center text-4xl shadow-2xl">
              {restaurant.logo}
            </div>
            <div className="flex-1 text-white">
              <h1 className="text-2xl font-bold mb-2">{restaurant.name}</h1>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-1 rounded-full">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-sm">{restaurant.rating}</span>
                  <span className="text-xs">({restaurant.reviews})</span>
                </div>
                <span className="text-sm">{restaurant.cuisine}</span>
                <span className="text-sm">{restaurant.priceRange}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/90">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {restaurant.distance}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {restaurant.eta}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-secondary/10 to-primary/10 border-y border-border py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <Info className="w-4 h-4 text-primary" />
          <p className="text-sm">
            <span className="font-semibold text-secondary">Free Delivery</span> • {restaurant.hours}
          </p>
        </div>
      </div>

      {/* Sticky Category Navigation */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 overflow-x-auto">
          <div className="flex gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setActiveCategory(category.id);
                  document.getElementById(category.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-primary text-white shadow-lg scale-105'
                    : 'bg-muted hover:bg-muted/80 hover:scale-105'
                }`}
              >
                <span>{category.icon}</span>
                <span className="text-sm font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {categories.map((category) => (
          <div key={category.id} id={category.id} className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>{category.icon}</span>
              {category.name}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {menuItems[category.id as keyof typeof menuItems]?.map((dish: any) => (
                <button
                  key={dish.id}
                  onClick={() => setSelectedDish(dish)}
                  className="group text-left"
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-primary">
                    <div className="flex gap-4 p-4">
                      {/* Dish Image */}
                      <div className="relative w-28 h-28 flex-shrink-0 rounded-2xl overflow-hidden">
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {dish.popular && (
                          <Badge className="absolute top-2 left-2 bg-primary text-white text-xs border-0">
                            🔥 Popular
                          </Badge>
                        )}
                      </div>

                      {/* Dish Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-bold text-base group-hover:text-primary transition-colors line-clamp-1">
                            {dish.name}
                          </h3>
                          <span className="text-primary font-bold text-lg flex-shrink-0">
                            ${dish.price}
                          </span>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {dish.description}
                        </p>

                        <div className="flex items-center gap-2 flex-wrap">
                          {dish.spicy && (
                            <Badge variant="outline" className="text-xs border-red-500 text-red-500">
                              🌶️ Spicy
                            </Badge>
                          )}
                          {dish.vegetarian && (
                            <Badge variant="outline" className="text-xs border-secondary text-secondary">
                              🌱 Vegetarian
                            </Badge>
                          )}
                          {dish.sizes && (
                            <Badge variant="outline" className="text-xs">
                              Sizes Available
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Dish Customization Modal */}
      <Dialog open={!!selectedDish} onOpenChange={() => setSelectedDish(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedDish && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedDish.name}</DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Dish Image */}
                <div className="relative aspect-video rounded-2xl overflow-hidden">
                  <img
                    src={selectedDish.image}
                    alt={selectedDish.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Description */}
                <p className="text-muted-foreground">{selectedDish.description}</p>

                {/* Size Selection */}
                {selectedDish.sizes && (
                  <div>
                    <Label className="text-base font-semibold mb-3 block">Size</Label>
                    <RadioGroup value={dishSize} onValueChange={setDishSize}>
                      <div className="grid grid-cols-3 gap-3">
                        {selectedDish.sizes.map((size: string) => (
                          <label
                            key={size}
                            className={`relative flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                              dishSize === size.toLowerCase()
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <RadioGroupItem
                              value={size.toLowerCase()}
                              className="absolute opacity-0"
                            />
                            <span className="font-medium">{size}</span>
                          </label>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {/* Sugar Level (for beverages) */}
                {selectedDish.customizable && (
                  <>
                    <div>
                      <Label className="text-base font-semibold mb-3 block">Sugar Level</Label>
                      <RadioGroup value={sugarLevel} onValueChange={setSugarLevel}>
                        <div className="grid grid-cols-4 gap-2">
                          {['No Sugar', 'Low', 'Normal', 'Extra'].map((level) => (
                            <label
                              key={level}
                              className={`relative flex items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all ${
                                sugarLevel === level.toLowerCase().replace(' ', '')
                                  ? 'border-primary bg-primary/5'
                                  : 'border-border hover:border-primary/50'
                              }`}
                            >
                              <RadioGroupItem
                                value={level.toLowerCase().replace(' ', '')}
                                className="absolute opacity-0"
                              />
                              <span className="text-sm font-medium">{level}</span>
                            </label>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Ice Level */}
                    <div>
                      <Label className="text-base font-semibold mb-3 block">Ice Level</Label>
                      <RadioGroup value={iceLevel} onValueChange={setIceLevel}>
                        <div className="grid grid-cols-4 gap-2">
                          {['No Ice', 'Low', 'Normal', 'Extra'].map((level) => (
                            <label
                              key={level}
                              className={`relative flex items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all ${
                                iceLevel === level.toLowerCase().replace(' ', '')
                                  ? 'border-primary bg-primary/5'
                                  : 'border-border hover:border-primary/50'
                              }`}
                            >
                              <RadioGroupItem
                                value={level.toLowerCase().replace(' ', '')}
                                className="absolute opacity-0"
                              />
                              <span className="text-sm font-medium">{level}</span>
                            </label>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  </>
                )}

                {/* Special Notes */}
                <div>
                  <Label htmlFor="notes" className="text-base font-semibold mb-3 block">
                    Special Instructions (Optional)
                  </Label>
                  <Textarea
                    id="notes"
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder="E.g., Extra sauce, No onions..."
                    className="rounded-xl"
                    rows={3}
                  />
                </div>

                {/* Quantity & Add to Cart */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 bg-muted hover:bg-primary hover:text-white rounded-full flex items-center justify-center transition-all hover:scale-110"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-xl font-bold w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 bg-muted hover:bg-primary hover:text-white rounded-full flex items-center justify-center transition-all hover:scale-110"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    className="bg-primary hover:bg-primary/90 h-12 px-8 rounded-full"
                  >
                    Add to Cart • ${totalPrice.toFixed(2)}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
