import { useState } from 'react';
import { Heart, MessageCircle, Share2, ShoppingBag, MoreVertical, Volume2, VolumeX, X, ArrowLeft } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface ReelsPageProps {
  onNavigate: (page: string) => void;
}

export function ReelsPage({ onNavigate }: ReelsPageProps) {
  const [currentReel, setCurrentReel] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [likedReels, setLikedReels] = useState<number[]>([]);

  const reels = [
    {
      id: 1,
      thumbnail: 'https://images.unsplash.com/photo-1542666836-03522463be07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMG5vb2RsZXMlMjBjb29raW5nfGVufDF8fHx8MTc2ODU3NzU4MHww&ixlib=rb-4.1.0&q=80&w=1080',
      creator: 'Chef Minh',
      avatar: 'CM',
      caption: '30-second Pad Thai hack! 🍜 #QuickRecipes',
      likes: '12.4K',
      comments: '823',
      products: [
        { name: 'Non-stick Wok Pan', price: '$29.99', type: 'affiliate' },
        { name: 'Thai Rice Noodles', price: '$4.50', type: 'cart' },
      ]
    },
    {
      id: 2,
      thumbnail: 'https://images.unsplash.com/photo-1588013273468-315fd88ea34c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGNhcmJvbmFyYXxlbnwxfHx8fDE3Njg0ODY3NTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      creator: 'Pasta Queen',
      avatar: 'PQ',
      caption: 'Authentic Carbonara from Rome 🇮🇹',
      likes: '45.2K',
      comments: '1.2K',
      products: [
        { name: 'Italian Guanciale', price: '$12.00', type: 'cart' },
        { name: 'Pecorino Romano', price: '$8.50', type: 'cart' },
      ]
    },
    {
      id: 3,
      thumbnail: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBkZXNzZXJ0fGVufDF8fHx8MTc2ODU2NDc5NHww&ixlib=rb-4.1.0&q=80&w=1080',
      creator: 'Sweet Bites',
      avatar: 'SB',
      caption: 'Molten chocolate lava in 10 mins! 🍫',
      likes: '89.1K',
      comments: '2.4K',
      products: [
        { name: 'Belgian Dark Chocolate', price: '$6.99', type: 'cart' },
        { name: 'Ramekin Set', price: '$15.99', type: 'affiliate' },
      ]
    }
  ];

  const toggleLike = (id: number) => {
    setLikedReels(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const currentReelData = reels[currentReel];
  const isLiked = likedReels.includes(currentReelData.id);

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Video Container (Full Screen) */}
      <div className="relative h-full w-full">
        {/* Background Video/Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${currentReelData.thumbnail}')` }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 z-50 p-4 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent">
          {/* Close/Back Button */}
          <button 
            onClick={() => onNavigate('home')}
            className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all hover:scale-110"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          
          <div className="text-white text-xl font-bold">Reels</div>
          
          <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all">
            <MoreVertical className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Right Side Action Buttons */}
        <div className="absolute right-4 bottom-32 z-40 flex flex-col gap-6">
          {/* Creator Avatar */}
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-[#FF6B35] flex items-center justify-center text-white font-semibold border-2 border-white">
              {currentReelData.avatar}
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#FF6B35] rounded-full flex items-center justify-center border-2 border-black">
              <span className="text-white text-xs font-bold">+</span>
            </div>
          </div>

          {/* Like Button */}
          <button 
            onClick={() => toggleLike(currentReelData.id)}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
              <Heart className={`w-7 h-7 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
            </div>
            <span className="text-white text-xs font-medium">{currentReelData.likes}</span>
          </button>

          {/* Comment Button */}
          <button className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
            <span className="text-white text-xs font-medium">{currentReelData.comments}</span>
          </button>

          {/* Share Button */}
          <button className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
              <Share2 className="w-7 h-7 text-white" />
            </div>
            <span className="text-white text-xs font-medium">Share</span>
          </button>

          {/* Mute/Unmute */}
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
              {isMuted ? (
                <VolumeX className="w-7 h-7 text-white" />
              ) : (
                <Volume2 className="w-7 h-7 text-white" />
              )}
            </div>
          </button>
        </div>

        {/* Bottom Creator Info & Caption */}
        <div className="absolute bottom-20 left-0 right-0 z-40 px-4 pb-4 bg-gradient-to-t from-black/70 to-transparent">
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-white font-semibold">@{currentReelData.creator.toLowerCase().replace(' ', '')}</span>
              <Button size="sm" className="h-7 px-3 bg-transparent border border-white text-white hover:bg-white/20 rounded-full">
                Follow
              </Button>
            </div>
            <p className="text-white text-sm">{currentReelData.caption}</p>
          </div>

          {/* Products Used in Video */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingBag className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-medium">Used in this video</span>
            </div>
            <div className="space-y-2">
              {currentReelData.products.map((product, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="text-white text-sm font-medium">{product.name}</div>
                    <div className="text-white/80 text-xs">{product.price}</div>
                  </div>
                  {product.type === 'cart' ? (
                    <Button size="sm" className="h-8 px-4 bg-[#FF6B35] hover:bg-[#ff5722] text-white rounded-full">
                      Add
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="h-8 px-4 bg-white/20 border-white/40 text-white hover:bg-white/30 rounded-full">
                      View
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicators (Dots) */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2">
          {reels.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentReel(idx)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                idx === currentReel ? 'bg-white h-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Navigation Hint */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="text-white/30 text-sm">Swipe up/down to browse</div>
      </div>
    </div>
  );
}