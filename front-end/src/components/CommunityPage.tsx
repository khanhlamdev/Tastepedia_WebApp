import { useState, useEffect } from 'react';
import { ArrowLeft, Heart, MessageCircle, Share2, MoreVertical, TrendingUp, Award, Search, Plus, Camera, Video, UtensilsCrossed, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Progress } from './ui/progress';

interface CommunityPageProps {
  onNavigate: (page: string) => void;
}

export function CommunityPage({ onNavigate }: CommunityPageProps) {
  const [selectedTab, setSelectedTab] = useState('all');
  const [showFABLabel, setShowFABLabel] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Mobile FAB label animation on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show label when scrolling up, hide when scrolling down
      if (currentScrollY < lastScrollY) {
        setShowFABLabel(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowFABLabel(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const hotTopics = [
    { id: 1, tag: '#EatClean', count: 12400, trending: true },
    { id: 2, tag: '#StreetFood', count: 9850, trending: true },
    { id: 3, tag: '#HomeCooking', count: 8200, trending: false },
    { id: 4, tag: '#VeganLife', count: 7600, trending: false },
    { id: 5, tag: '#BakingLove', count: 6900, trending: false },
    { id: 6, tag: '#AsianCuisine', count: 5400, trending: true },
  ];

  const topContributors = [
    {
      id: 1,
      name: 'Chef Minh',
      avatar: 'CM',
      points: 2450,
      badge: '👨‍🍳',
      title: 'Master Chef'
    },
    {
      id: 2,
      name: 'Sarah Parker',
      avatar: 'SP',
      points: 1890,
      badge: '🌟',
      title: 'Food Critic'
    },
    {
      id: 3,
      name: 'David Chen',
      avatar: 'DC',
      points: 1620,
      badge: '🔥',
      title: 'Recipe Creator'
    },
    {
      id: 4,
      name: 'Emma Wilson',
      avatar: 'EW',
      points: 1450,
      badge: '🥇',
      title: 'Top Helper'
    },
    {
      id: 5,
      name: 'Alex Kim',
      avatar: 'AK',
      points: 1280,
      badge: '⭐',
      title: 'Community Star'
    },
  ];

  const communityPosts = [
    {
      id: 1,
      type: 'question',
      author: {
        name: 'Jessica Lin',
        avatar: 'JL',
        badge: '🌱',
        title: 'Home Cook'
      },
      timestamp: '2 hours ago',
      content: 'What\'s the secret to making restaurant-quality fried rice at home? Mine always comes out soggy 😢',
      tags: ['#AsianCuisine', '#CookingTips'],
      likes: 45,
      comments: 23,
      liked: false,
      image: null
    },
    {
      id: 2,
      type: 'poll',
      author: {
        name: 'Chef Minh',
        avatar: 'CM',
        badge: '👨‍🍳',
        title: 'Master Chef'
      },
      timestamp: '4 hours ago',
      content: 'The Ultimate Vietnamese Soup Battle! Which one wins your heart? 🍜',
      tags: ['#Vietnamese', '#Poll'],
      poll: {
        question: 'Pho vs Bun Bo Hue - Which is better?',
        options: [
          { id: 1, text: 'Pho (Northern style)', votes: 342, percentage: 58 },
          { id: 2, text: 'Bun Bo Hue (Central spice)', votes: 248, percentage: 42 }
        ],
        totalVotes: 590,
        userVoted: 1
      },
      likes: 128,
      comments: 67,
      liked: true,
      image: null
    },
    {
      id: 3,
      type: 'post',
      author: {
        name: 'Sarah Parker',
        avatar: 'SP',
        badge: '🌟',
        title: 'Food Critic'
      },
      timestamp: '6 hours ago',
      content: 'Just tried this new Vietnamese fusion restaurant in downtown. The Pho Burger is INSANE! 🍔🍜 Highly recommend!',
      tags: ['#FoodReview', '#Fusion'],
      likes: 234,
      comments: 89,
      liked: false,
      image: 'https://images.unsplash.com/photo-1693743387915-7d190a0e636f?w=800'
    },
    {
      id: 4,
      type: 'tip',
      author: {
        name: 'David Chen',
        avatar: 'DC',
        badge: '🔥',
        title: 'Recipe Creator'
      },
      timestamp: '8 hours ago',
      content: '💡 Pro Tip: Add a pinch of MSG to your Vietnamese dishes. It\'s the secret ingredient restaurants use for that "umami" punch! Don\'t be afraid of it - it\'s just concentrated glutamate found naturally in tomatoes and cheese.',
      tags: ['#CookingTips', '#ProTip'],
      likes: 456,
      comments: 134,
      liked: true,
      image: null
    },
    {
      id: 5,
      type: 'recipe',
      author: {
        name: 'Emma Wilson',
        avatar: 'EW',
        badge: '🥇',
        title: 'Top Helper'
      },
      timestamp: '12 hours ago',
      content: 'My grandmother\'s secret Banh Mi recipe - 50 years in the making! The key is the pickle ratio and the pâté quality. Full recipe in comments 👇',
      tags: ['#BanhMi', '#Recipe'],
      likes: 892,
      comments: 234,
      liked: false,
      image: 'https://images.unsplash.com/photo-1708493449638-be3ffd051472?w=800'
    },
    {
      id: 6,
      type: 'poll',
      author: {
        name: 'Alex Kim',
        avatar: 'AK',
        badge: '⭐',
        title: 'Community Star'
      },
      timestamp: '1 day ago',
      content: 'Street Food Showdown! Where would you rather eat?',
      tags: ['#StreetFood', '#Poll'],
      poll: {
        question: 'Best Street Food Experience?',
        options: [
          { id: 1, text: 'Thailand Night Markets', votes: 412, percentage: 45 },
          { id: 2, text: 'Vietnam Street Carts', votes: 345, percentage: 38 },
          { id: 3, text: 'Taiwan Food Stalls', votes: 156, percentage: 17 }
        ],
        totalVotes: 913,
        userVoted: null
      },
      likes: 567,
      comments: 198,
      liked: false,
      image: null
    },
  ];

  const PostCard = ({ post }: { post: any }) => {
    const [localLikes, setLocalLikes] = useState(post.likes);
    const [isLiked, setIsLiked] = useState(post.liked);

    const handleLike = () => {
      setIsLiked(!isLiked);
      setLocalLikes(isLiked ? localLikes - 1 : localLikes + 1);
    };

    return (
      <Card className="p-6 hover:shadow-lg transition-all duration-300">
        {/* Author Info */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 border-2 border-primary">
              <div className="bg-gradient-to-br from-primary to-orange-500 text-white flex items-center justify-center h-full w-full font-bold">
                {post.author.avatar}
              </div>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">{post.author.name}</h4>
                <span className="text-lg">{post.author.badge}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{post.author.title}</span>
                <span>•</span>
                <span>{post.timestamp}</span>
              </div>
            </div>
          </div>
          <Button size="icon" variant="ghost" className="rounded-full">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <p className="mb-3 text-foreground leading-relaxed">{post.content}</p>

        {/* Poll */}
        {post.poll && (
          <div className="mb-4 p-4 bg-muted/50 rounded-2xl">
            <h5 className="font-semibold mb-3">{post.poll.question}</h5>
            <div className="space-y-2">
              {post.poll.options.map((option: any) => (
                <button
                  key={option.id}
                  className={`w-full text-left p-3 rounded-xl transition-all hover:scale-105 ${
                    post.poll.userVoted === option.id
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-white hover:bg-primary/5 border border-border'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{option.text}</span>
                    <span className="text-sm font-bold">{option.percentage}%</span>
                  </div>
                  <Progress value={option.percentage} className="h-1" />
                </button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-3 text-center">
              {post.poll.totalVotes} votes
            </p>
          </div>
        )}

        {/* Image */}
        {post.image && (
          <div className="mb-4 rounded-2xl overflow-hidden">
            <img
              src={post.image}
              alt="Post"
              className="w-full aspect-video object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag: string, idx: number) => (
            <Badge
              key={idx}
              variant="outline"
              className="cursor-pointer hover:bg-primary hover:text-white hover:border-primary transition-all"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6 pt-4 border-t border-border">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 transition-all hover:scale-110 ${
              isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500' : ''}`} />
            <span className="font-medium">{localLikes}</span>
          </button>

          <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-all hover:scale-110">
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium">{post.comments}</span>
          </button>

          <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-all hover:scale-110 ml-auto">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </Card>
    );
  };

  // Current user mock data
  const currentUser = {
    name: 'You',
    avatar: 'YO',
    firstName: 'Chef'
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
              <h1 className="text-xl font-bold">Community Hub</h1>
              <p className="text-sm text-muted-foreground">Share, Learn, Connect</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search discussions, recipes, tips..."
              className="pl-12 h-12 rounded-2xl bg-muted/50 border-0"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hot Topics */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="font-bold text-lg">Hot Topics</h2>
              </div>

              <ScrollArea className="w-full">
                <div className="flex gap-2 pb-2">
                  {hotTopics.map((topic) => (
                    <button
                      key={topic.id}
                      className="flex-shrink-0 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-orange-100 hover:from-primary hover:to-orange-500 hover:text-white border border-primary/20 transition-all hover:scale-105 group"
                    >
                      <div className="flex items-center gap-2">
                        {topic.trending && (
                          <span className="text-sm">🔥</span>
                        )}
                        <span className="font-medium text-sm">{topic.tag}</span>
                        <Badge
                          variant="outline"
                          className="text-xs bg-white/50 group-hover:bg-white/90"
                        >
                          {(topic.count / 1000).toFixed(1)}k
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* RICH POST COMPOSER - Replace simple FAB */}
            <Card className="p-4 bg-gradient-to-br from-primary/5 via-orange-50/50 to-yellow-50/30 border-2 border-primary/20 shadow-lg hover:shadow-xl transition-all">
              <div className="flex gap-3">
                {/* User Avatar */}
                <Avatar className="w-12 h-12 border-2 border-primary flex-shrink-0">
                  <div className="bg-gradient-to-br from-primary to-orange-500 text-white flex items-center justify-center h-full w-full font-bold">
                    {currentUser.avatar}
                  </div>
                </Avatar>

                {/* Input Area */}
                <div className="flex-1">
                  <button 
                    className="w-full text-left px-4 py-3 bg-white border-2 border-border hover:border-primary rounded-2xl transition-all hover:shadow-md"
                    onClick={() => {
                      // TODO: Open full post composer modal
                      alert('Post composer coming soon!');
                    }}
                  >
                    <span className="text-muted-foreground">
                      What's cooking today, <span className="font-semibold text-foreground">{currentUser.firstName}</span>? 👨‍🍳
                    </span>
                  </button>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-3">
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-blue-50 border border-border hover:border-blue-300 rounded-xl transition-all hover:scale-105 group">
                      <Camera className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">Photo</span>
                    </button>

                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-red-50 border border-border hover:border-red-300 rounded-xl transition-all hover:scale-105 group">
                      <Video className="w-4 h-4 text-red-600 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium text-gray-700 group-hover:text-red-700">Video</span>
                    </button>

                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-orange-50 border border-border hover:border-primary rounded-xl transition-all hover:scale-105 group">
                      <UtensilsCrossed className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium text-gray-700 group-hover:text-primary">Recipe</span>
                    </button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Filter Tabs */}
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-4 bg-muted rounded-2xl p-1">
                <TabsTrigger value="all" className="rounded-xl">All Posts</TabsTrigger>
                <TabsTrigger value="questions" className="rounded-xl">Questions</TabsTrigger>
                <TabsTrigger value="polls" className="rounded-xl">Polls</TabsTrigger>
                <TabsTrigger value="tips" className="rounded-xl">Tips</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Posts Feed */}
            <div className="space-y-4">
              {communityPosts
                .filter((post) => {
                  if (selectedTab === 'all') return true;
                  if (selectedTab === 'questions') return post.type === 'question';
                  if (selectedTab === 'polls') return post.type === 'poll';
                  if (selectedTab === 'tips') return post.type === 'tip';
                  return true;
                })
                .map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Contributors Leaderboard */}
            <Card className="p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg">Top Contributors</h3>
              </div>

              <div className="space-y-3">
                {topContributors.map((contributor, index) => (
                  <button
                    key={contributor.id}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-muted transition-all hover:scale-105 group"
                  >
                    <div className="relative">
                      <Avatar className="w-12 h-12 border-2 border-primary">
                        <div className="bg-gradient-to-br from-primary to-orange-500 text-white flex items-center justify-center h-full w-full font-bold">
                          {contributor.avatar}
                        </div>
                      </Avatar>
                      {index < 3 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-xs">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">
                          {contributor.name}
                        </h4>
                        <span className="text-sm">{contributor.badge}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{contributor.title}</p>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-primary">{contributor.points}</div>
                      <div className="text-xs text-muted-foreground">points</div>
                    </div>
                  </button>
                ))}
              </div>

              <Button
                variant="outline"
                className="w-full mt-4 rounded-full"
              >
                View Full Leaderboard
              </Button>
            </Card>

            {/* Community Guidelines */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
              <h3 className="font-bold mb-3">Community Guidelines</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-0.5">✓</span>
                  <span>Be respectful and kind</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-0.5">✓</span>
                  <span>Share authentic experiences</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-0.5">✓</span>
                  <span>Give credit where it's due</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-0.5">✓</span>
                  <span>Help others learn and grow</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>

      {/* MOBILE FLOATING ACTION BUTTON (FAB) with expandable label */}
      {/* Only visible on mobile (lg:hidden) */}
      <button
        onClick={() => {
          // TODO: Open full post composer modal
          alert('Post composer coming soon!');
        }}
        className={`fixed bottom-20 right-4 z-50 lg:hidden bg-gradient-to-br from-primary to-orange-500 text-white shadow-2xl rounded-full transition-all duration-300 hover:scale-110 active:scale-95 ${
          showFABLabel ? 'px-6 py-4' : 'p-4'
        }`}
      >
        <div className="flex items-center gap-3">
          <Plus className="w-6 h-6 flex-shrink-0" />
          {/* Expandable Label - shows on scroll up */}
          <span 
            className={`font-semibold whitespace-nowrap overflow-hidden transition-all duration-300 ${
              showFABLabel ? 'max-w-[120px] opacity-100' : 'max-w-0 opacity-0'
            }`}
          >
            New Post
          </span>
        </div>
      </button>
    </div>
  );
}
