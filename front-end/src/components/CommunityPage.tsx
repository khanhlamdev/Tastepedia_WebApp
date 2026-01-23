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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

interface CommunityPageProps {
  onNavigate: (page: string) => void;
}

interface PollOption {
  id: number;
  text: string;
  votes: number;
  percentage?: number; // Frontend tự tính
}

interface PostData {
  id: string;
  type: string; // 'post', 'question', 'poll', 'tip'
  content: string;
  image?: string;
  tags: string[];
  authorName: string;
  authorAvatar: string;
  authorBadge: string;
  createdAt: string;
  likes: number;
  comments: number;
  poll?: {
    question: string;
    options: PollOption[];
    totalVotes: number;
    userVoted?: number; // ID option user đã vote
  };
  likedUserIds: string;
}

export function CommunityPage({ onNavigate }: CommunityPageProps) {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [selectedTab, setSelectedTab] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFABLabel, setShowFABLabel] = useState(true);

    // Form State
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostType, setNewPostType] = useState('post'); // post, question, tip, poll
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);

  const [imageUrl, setImageUrl] = useState(''); // State cho link ảnh
  const [tagsInput, setTagsInput] = useState(''); // State cho tags (nhập chuỗi)

  useEffect(() => {
      const handleScroll = () => {
          setShowFABLabel(window.scrollY < 100);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/community/posts');
      const data = await res.json();
      // Tính toán phần trăm cho Poll nếu có
      const processedData = data.map((post: any) => {
        if (post.poll) {
          post.poll.options = post.poll.options.map((opt: any) => ({
            ...opt,
            percentage: post.poll.totalVotes > 0 ? Math.round((opt.votes / post.poll.totalVotes) * 100) : 0
          }));
        }
        return post;
      });
      setPosts(processedData);
    } catch (err) {
      console.error("Failed to fetch posts", err);
    }
  };

  const handleCreatePost = async () => {
      if (!newPostContent.trim() && newPostType !== 'poll') return;
      if (newPostType === 'poll' && (!pollQuestion.trim() || pollOptions.some(o => !o.trim()))) return;

      setIsSubmitting(true);

      // Lấy User từ LocalStorage (như bài trước)
      const savedUserStr = localStorage.getItem('user');
      let currentUser = { _id: 'guest', fullName: 'Guest User', avatar: 'G' };
      if (savedUserStr) {
          try {
              const parsed = JSON.parse(savedUserStr);
              currentUser = {
                  _id: parsed._id || parsed.id,
                  fullName: parsed.fullName,
                  avatar: parsed.fullName.charAt(0).toUpperCase()
              };
          } catch(e) {}
      }

      const processedTags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

      const payload: any = {
        type: newPostType,
        content: newPostContent,
        userId: currentUser._id,
        authorName: currentUser.fullName,
        authorAvatar: currentUser.avatar,
        authorBadge: "Newbie", // Tạm để cứng
        likes: 0,
        comments: 0,
        image: imageUrl, // Gửi link ảnh lên server
        tags: processedTags.length > 0 ? processedTags : [],
      };

      if (newPostType === 'poll') {
        payload.poll = {
          question: pollQuestion,
          options: pollOptions.map((text, index) => ({ id: index + 1, text: text, votes: 0 })),
          totalVotes: 0
        };
        // Poll thường nội dung chính là câu hỏi
        if (!payload.content) payload.content = pollQuestion;
      }

      try {
        const res = await fetch('http://localhost:8080/api/community/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          setShowCreateModal(false);
          setNewPostContent('');
          setPollQuestion('');
          setPollOptions(['', '']);
          setImageUrl('');
          setTagsInput('');
          fetchPosts();
        }
      } catch (err) {
        console.error("Error creating post", err);
      } finally {
        setIsSubmitting(false);
      }
  };

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

  const PostCard = ({ post }: { post: PostData }) => {
      const savedUserStr = localStorage.getItem('user');
      const currentUserId = savedUserStr ? JSON.parse(savedUserStr)._id || JSON.parse(savedUserStr).id : 'guest';
      const isLikedInitial = (post as any).likedUserIds?.includes(currentUserId);
      const [localLikes, setLocalLikes] = useState(post.likes);
      const [isLiked, setIsLiked] = useState(isLikedInitial);

      const handleLike = async () => {
            // 1. Cập nhật UI ngay lập tức cho mượt
            const newIsLiked = !isLiked;
            setIsLiked(newIsLiked);
            setLocalLikes(newIsLiked ? localLikes + 1 : localLikes - 1);

            // 2. Gọi API ngầm
            try {
              await fetch(`http://localhost:8080/api/community/${post.id}/like`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' }, // Dùng text/plain cũng được nếu backend chỉnh
                  body: currentUserId // Gửi ID người like
              });
            } catch (error) {
              console.error("Like error", error);
              // Revert nếu lỗi
              setIsLiked(!newIsLiked);
              setLocalLikes(localLikes);
            }
      };

    return (
      <Card className="p-6 hover:shadow-lg transition-all duration-300">
        {/* Author Info */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 border-2 border-primary">
              <div className="bg-gradient-to-br from-primary to-orange-500 text-white flex items-center justify-center h-full w-full font-bold">
                {post.authorAvatar}
              </div>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">{post.authorName}</h4>
                <Badge variant="secondary" className="text-xs">{post.type.toUpperCase()}</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <p className="mb-3 text-foreground leading-relaxed whitespace-pre-wrap">{post.content}</p>

        {/* --- PHẦN IMAGE (Hiển thị nếu có) --- */}
                {post.image && (
                    <div className="mb-4 rounded-2xl overflow-hidden">
                    <img
                        src={post.image}
                        alt="Post"
                        className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                            // Fallback nếu ảnh lỗi
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                    </div>
                )}

        {/* Poll */}
        {post.poll && (
          <div className="mb-4 p-4 bg-muted/50 rounded-2xl border border-gray-100">
            <h5 className="font-semibold mb-3">{post.poll.question}</h5>
            <div className="space-y-2">
              {post.poll.options.map((option) => (
                <button
                  key={option.id}
                  className="w-full text-left p-3 rounded-xl bg-white border border-gray-200 hover:border-primary transition-all relative overflow-hidden"
                  >
                  <div className="flex items-center justify-between mb-1 relative z-10">
                    <span className="font-medium">{option.text}</span>
                    <span className="text-sm font-bold">{option.percentage}%</span>
                  </div>
                  <Progress value={option.percentage} className="h-1.5" />
                </button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-3 text-center">
              {post.poll.totalVotes} votes
            </p>
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag: string, idx: number) => (
                        <Badge
                            key={idx}
                            variant="outline"
                            className="cursor-pointer hover:bg-primary hover:text-white hover:border-primary transition-all text-xs"
                        >
                            {tag.startsWith('#') ? tag : `#${tag}`}
                        </Badge>
                        ))}
                    </div>
                )}

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
                    onClick={() => setShowCreateModal(true)}
                  >
                    <span className="text-muted-foreground">
                      What's cooking today, <span className="font-semibold text-foreground">{currentUser.firstName}</span>? 👨‍🍳
                    </span>
                  </button>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-3">
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-blue-50 border border-border hover:border-blue-300 rounded-xl transition-all hover:scale-105 group"
                    onClick={() => setShowCreateModal(true)}>
                      <Camera className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">Photo</span>
                    </button>

                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-red-50 border border-border hover:border-red-300 rounded-xl transition-all hover:scale-105 group"
                    onClick={() => setShowCreateModal(true)}>
                      <Video className="w-4 h-4 text-red-600 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium text-gray-700 group-hover:text-red-700">Video</span>
                    </button>

                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-orange-50 border border-border hover:border-primary rounded-xl transition-all hover:scale-105 group"
                    onClick={() => setShowCreateModal(true)}>
                      <UtensilsCrossed className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium text-gray-700 group-hover:text-primary">Recipe</span>
                    </button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Filter Tabs */}
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-4 bg-muted/30">
                <TabsTrigger value="all" className="rounded-xl">All Posts</TabsTrigger>
                <TabsTrigger value="questions" className="rounded-xl">Questions</TabsTrigger>
                <TabsTrigger value="polls" className="rounded-xl">Polls</TabsTrigger>
                <TabsTrigger value="tips" className="rounded-xl">Tips</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Posts Feed */}
            <div className="space-y-4">
              {posts.filter(p => selectedTab === 'all' || p.type === selectedTab)
                .map(post => <PostCard key={post.id} post={post} />)
                }
              {posts.length === 0 && (
                <div className="text-center py-10 text-gray-500">No posts yet. Be the first to share!</div>
              )}
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
      <button onClick={() => setShowCreateModal(true)} className={`fixed bottom-20 right-4 z-50 lg:hidden bg-primary text-white shadow-2xl rounded-full transition-all ${showFABLabel ? 'px-6 py-4' : 'p-4'}`}>
              <div className="flex items-center gap-3">
                <Plus className="w-6 h-6 flex-shrink-0" />
                <span className={`font-semibold whitespace-nowrap overflow-hidden transition-all ${showFABLabel ? 'max-w-[120px] opacity-100' : 'max-w-0 opacity-0'}`}>New Post</span>
              </div>
            </button>

      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Post</DialogTitle>
                </DialogHeader>

                <Tabs value={newPostType} onValueChange={setNewPostType} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="post">Post</TabsTrigger>
                    <TabsTrigger value="question">Question</TabsTrigger>
                    <TabsTrigger value="poll">Poll</TabsTrigger>
                  </TabsList>

                  {newPostType !== 'poll' ? (
                    <div className="space-y-4">
                      <Textarea
                        placeholder={`Share your ${newPostType}...`}
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        className="min-h-[100px]"
                      />

                      <div>
                        <Label className="text-xs text-gray-500 mb-1 block">Image URL (Optional)</Label>
                          <div className="flex gap-2">
                            <Input
                              placeholder="https://..."
                              value={imageUrl}
                              onChange={(e) => setImageUrl(e.target.value)}
                            />
                          </div>
                      </div>

                      <div>
                        <Label className="text-xs text-gray-500 mb-1 block">Tags (comma separated)</Label>
                        <Input
                          placeholder="e.g. #Healthy, #Breakfast"
                          value={tagsInput}
                          onChange={(e) => setTagsInput(e.target.value)}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <Label>Question</Label>
                        <Input
                          placeholder="Ask something..."
                          value={pollQuestion}
                          onChange={(e) => setPollQuestion(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Options</Label>
                        {pollOptions.map((opt, idx) => (
                          <Input
                            key={idx}
                            placeholder={`Option ${idx + 1}`}
                            value={opt}
                            onChange={(e) => {
                              const newOpts = [...pollOptions];
                              newOpts[idx] = e.target.value;
                              setPollOptions(newOpts);
                            }}
                          />
                        ))}
                        <Button
                          type="button" variant="outline" size="sm"
                          onClick={() => setPollOptions([...pollOptions, ''])}
                        >
                          + Add Option
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end mt-6 gap-2">
                    <Button variant="ghost" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                    <Button onClick={handleCreatePost} disabled={isSubmitting}>
                      {isSubmitting ? 'Posting...' : 'Post'}
                    </Button>
                  </div>
                </Tabs>
              </DialogContent>
      </Dialog>
    </div>
  );
}
