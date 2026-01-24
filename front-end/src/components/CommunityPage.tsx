import { useState, useEffect } from 'react';
import {
  ArrowLeft, Heart, MessageCircle, Share2, MoreHorizontal, TrendingUp, Award, Search,
  Plus, Camera, Video, UtensilsCrossed, HelpCircle, Lightbulb, FileText, Send, Flag, Trash2, Edit, X, Loader2, Image as ImageIcon, Check
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;

  // Nếu quá 7 ngày thì hiển thị ngày tháng năm
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

interface CommunityPageProps {
  onNavigate: (page: string) => void;
}

interface CommentData {
  id: string;
  userId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  likes: number;
  replies: CommentData[];
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
    options: { id: number; text: string; votes: number; percentage?: number }[];
    totalVotes: number;
    userVotes?: Record<string, number>; // Map<UserId, OptionId>
  };
  likedUserIds: string | string[];
}

export function CommunityPage({ onNavigate }: CommunityPageProps) {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createMode, setCreateMode] = useState('general');
  const [selectedGeneralType, setSelectedGeneralType] = useState('post');
  const [newPostContent, setNewPostContent] = useState('');
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [imageUrl, setImageUrl] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [selectedPost, setSelectedPost] = useState<PostData | null>(null); // Bài viết đang xem chi tiết
  const [postComments, setPostComments] = useState<CommentData[]>([]);
  const [newCommentContent, setNewCommentContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null); // ID comment đang reply

  const [showFABLabel, setShowFABLabel] = useState(true);

  useEffect(() => {
    fetchPosts();
    const handleScroll = () => {
      setShowFABLabel(window.scrollY < 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    const finalType = createMode === 'poll' ? 'poll' : selectedGeneralType;
    if (createMode === 'poll') {
      if (!pollQuestion.trim() || pollOptions.some(o => !o.trim())) return;
    } else {
      if (!newPostContent.trim()) return;
    }

    setIsSubmitting(true);

    const processedTags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

    const payload: any = {
      type: finalType,
      content: newPostContent,
      likes: 0,
      comments: 0,
      image: imageUrl, // Gửi link ảnh lên server
      tags: processedTags.length > 0 ? processedTags : [],
    };

    if (createMode === 'poll') {
      payload.poll = {
        question: pollQuestion,
        options: pollOptions.map((text, index) => ({ id: index, text: text, votes: 0 })),
        totalVotes: 0
      };
      // Poll thường nội dung chính là câu hỏi
      if (!payload.content) payload.content = pollQuestion;
    }

    try {
      const res = await fetch('http://localhost:8080/api/community/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowCreateModal(false);
        setNewPostContent('');
        setPollQuestion('');
        setPollOptions(['', '']);
        setImageUrl('');
        setTagsInput('');
        setCreateMode('general'); // Reset về mặc định
        setSelectedGeneralType('post');
        fetchPosts();
      } else if (res.status === 401) {
        alert("Vui lòng đăng nhập để đăng bài!");
        onNavigate('login');
      }
    } catch (err) {
      console.error("Error creating post", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openPostDetail = async (post: PostData) => {
    setSelectedPost(post);
    try {
      const res = await fetch(`http://localhost:8080/api/community/${post.id}/comments`, { credentials: 'include' });
      if (res.ok) setPostComments(await res.json());
    } catch (e) { console.error(e); }
  };

  const handleSendComment = async () => {
    if (!selectedPost || !newCommentContent.trim()) return;
    try {
      const res = await fetch(`http://localhost:8080/api/community/${selectedPost.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          content: newCommentContent,
          parentCommentId: replyingTo
        })
      });
      if (res.ok) {
        setNewCommentContent('');
        setReplyingTo(null);
        // Reload comments & Post (để cập nhật số comment count)
        openPostDetail(selectedPost);
        fetchPosts();
      } else if (res.status === 401) alert("Please login to comment!");
    } catch (e) { console.error(e); }
  };

  const handleVote = async (postId: string, optionId: number) => {
    console.log('Voting for postId:', postId, 'optionId:', optionId, 'type:', typeof optionId);
    try {
      const res = await fetch(`http://localhost:8080/api/community/${postId}/vote?optionId=${optionId}`, {
        method: 'POST',
        credentials: 'include'
      });

      if (res.ok) {
        // Refresh posts to get updated vote counts
        await fetchPosts();
      } else if (res.status === 401) {
        alert("Please login to vote!");
        onNavigate('login');
      } else {
        const errorText = await res.text();
        console.error("Vote failed:", errorText);
      }
    } catch (error) {
      console.error("Vote error:", error);
    }
  };

  const handleShare = (post: PostData) => {
    navigator.clipboard.writeText(`http://localhost:3000/post/${post.id}`);
    alert("Link copied to clipboard!");
  };

  // Dynamic Hot Topics - Real counts from posts
  const topicCounts: Record<string, number> = {};
  posts.forEach(post => {
    post.tags?.forEach(tag => {
      const normalizedTag = tag.startsWith('#') ? tag : `#${tag}`;
      topicCounts[normalizedTag] = (topicCounts[normalizedTag] || 0) + 1;
    });
  });

  const hotTopics = Object.entries(topicCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10 topics

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:8080/api/community/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (res.ok) {
        const data = await res.json();
        setImageUrl(data.url);
      } else if (res.status === 401) {
        alert("Please login to upload images!");
        onNavigate('login');
      } else {
        const errorText = await res.text();
        alert("Upload failed: " + errorText);
      }
    } catch (err) {
      console.error("Upload error", err);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

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

  const PollComponent = ({ post }: { post: PostData }) => {
    if (!post.poll) return null;

    // Get current user ID to check if voted
    const savedUserStr = localStorage.getItem('user');
    const currentUserId = savedUserStr ? JSON.parse(savedUserStr)._id || JSON.parse(savedUserStr).id : 'guest';

    const userVotesMap = post.poll.userVotes || {};
    const hasVoted = Object.keys(userVotesMap).includes(currentUserId);
    const votedOptionId = userVotesMap[currentUserId];

    console.log('PollComponent - Post:', post.id, 'Options:', post.poll.options.map((o, i) => ({ index: i, id: o.id, text: o.text })), 'VotedOptionId:', votedOptionId);

    return (
      <div className="mb-4 p-4 bg-muted/50 rounded-2xl border border-gray-100">
        <h5 className="font-semibold mb-3">{post.poll.question}</h5>
        <div className="space-y-2">
          {post.poll.options.map((option, idx) => {
            // Use array index for comparison since MongoDB doesn't save the 'id' field
            const isSelected = votedOptionId === idx;
            return (
              <button
                key={`${idx}-${option.text}`}
                onClick={() => handleVote(post.id, idx)}
                className={`w-full text-left p-3 rounded-xl border relative overflow-hidden transition-all hover:border-primary hover:bg-orange-50 cursor-pointer ${isSelected ? 'border-primary ring-1 ring-primary bg-orange-50' : 'border-gray-200 bg-white'
                  }`}
              >
                {/* Show percentages and progress bar only if user has voted */}
                {hasVoted ? (
                  <>
                    <div className="flex items-center justify-between mb-1 relative z-10">
                      <span className={`flex items-center gap-2 ${isSelected ? 'font-bold text-primary' : 'font-medium'}`}>
                        {isSelected && <Check className="w-4 h-4" />}
                        {option.text}
                      </span>
                      <span className="text-sm font-bold">{option.percentage}%</span>
                    </div>
                    <Progress value={option.percentage} className="h-1.5" />
                  </>
                ) : (
                  <div className="flex items-center justify-between relative z-10">
                    <span className="font-medium">{option.text}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
        <p className="text-sm text-muted-foreground mt-3 text-center">
          {post.poll.totalVotes} votes
        </p>
      </div>
    );
  };

  // 2. Component Dropdown 3 chấm
  const PostOptions = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <DropdownMenuItem><Edit className="w-4 h-4 mr-2" /> Edit Post</DropdownMenuItem>
        <DropdownMenuItem><Flag className="w-4 h-4 mr-2" /> Report</DropdownMenuItem>
        <DropdownMenuItem className="text-red-600"><Trash2 className="w-4 h-4 mr-2" /> Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const PostCard = ({ post }: { post: PostData }) => {
    const savedUserStr = localStorage.getItem('user');
    const currentUserId = savedUserStr ? JSON.parse(savedUserStr)._id || JSON.parse(savedUserStr).id : 'guest';
    const likedList = post.likedUserIds || [];
    const isLikedInitial = Array.isArray(likedList)
      ? likedList.includes(currentUserId)
      : typeof likedList === 'string' && (likedList as string).includes(currentUserId);
    const [localLikes, setLocalLikes] = useState(post.likes);
    const [isLiked, setIsLiked] = useState(isLikedInitial);

    const handleLike = async () => {
      // 1. Cập nhật UI ngay lập tức cho mượt
      const newIsLiked = !isLiked;
      setIsLiked(newIsLiked);
      setLocalLikes(newIsLiked ? localLikes + 1 : localLikes - 1);

      // 2. Gọi API ngầm
      try {
        const res = await fetch(`http://localhost:8080/api/community/${post.id}/like`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (res.status === 401) {
          alert("Bạn cần đăng nhập để thả tim!");
          setIsLiked(!newIsLiked);
          setLocalLikes(localLikes);
        }
      } catch (error) {
        console.error("Like error", error);
        setIsLiked(!newIsLiked);
        setLocalLikes(localLikes);
      }
    };

    return (
      <Card className="p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
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
                {formatTimeAgo(post.createdAt)}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <p className="mb-3 text-sm sm:text-base text-foreground leading-relaxed whitespace-pre-wrap">{post.content}</p>

        {/* --- PHẦN IMAGE (Hiển thị nếu có) --- */}
        {post.image && (
          <div className="mb-4 rounded-2xl overflow-hidden">
            <img
              src={post.image}
              alt="Post"
              className="w-full h-48 sm:h-64 object-cover hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                // Fallback nếu ảnh lỗi
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        <PollComponent post={post} />
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
        <div className="flex items-center gap-4 sm:gap-6 pt-3 sm:pt-4 border-t border-border">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 sm:gap-2 transition-all hover:scale-110 min-h-10 ${isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
              }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500' : ''}`} />
            <span className="font-medium text-sm sm:text-base">{localLikes}</span>
          </button>

          <button onClick={() => openPostDetail(post)} className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground hover:text-blue-500 hover:scale-110 transition-all min-h-10">
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium text-sm sm:text-base">{post.comments}</span>
          </button>
          <button onClick={() => handleShare(post)} className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground hover:text-primary ml-auto min-h-10">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </Card>
    );
  };

  // Filter posts by tab, topic, and search query
  const filteredPosts = posts.filter(post => {
    // Tab filter
    const matchesTab = selectedTab === 'all' || post.type === selectedTab;

    // Topic filter
    const matchesTopic = !selectedTopic || post.tags?.some(tag => {
      const normalizedTag = tag.startsWith('#') ? tag : `#${tag}`;
      return normalizedTag === selectedTopic;
    });

    // Search filter
    const matchesSearch = !searchQuery ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTab && matchesTopic && matchesSearch;
  });

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
          <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <button
              onClick={() => onNavigate('home')}
              className="p-1.5 sm:p-2 hover:bg-muted rounded-full transition-all hover:scale-110"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg sm:text-xl font-bold">Community Hub</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">Share, Learn, Connect</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            <Input
              placeholder="Search discussions, tags (#recipe)..."
              className="pl-10 sm:pl-12 h-10 sm:h-12 text-sm sm:text-base rounded-2xl bg-muted/50 border-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hot Topics */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="font-bold text-lg">Hot Topics</h2>
              </div>

              <div className="relative -mx-1 px-1">
                <div className="flex gap-2 pb-3 overflow-x-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db transparent' }}>
                  {hotTopics.map((topic, index) => (
                    <button
                      key={topic.tag}
                      onClick={() => setSelectedTopic(selectedTopic === topic.tag ? null : topic.tag)}
                      className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all hover:scale-105 group ${selectedTopic === topic.tag
                        ? 'bg-gradient-to-r from-primary to-orange-500 text-white border-2 border-primary font-bold ring-2 ring-primary/30'
                        : 'bg-gradient-to-r from-primary/10 to-orange-100 hover:from-primary hover:to-orange-500 hover:text-white border border-primary/20'
                        } ${index < 3 ? 'shadow-lg shadow-orange-200' : ''}`}
                    >
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        {index < 3 && (
                          <span className="text-xs sm:text-sm animate-pulse">🔥</span>
                        )}
                        <span className={`text-xs sm:text-sm ${selectedTopic === topic.tag ? 'font-bold' : 'font-medium'}`}>{topic.tag}</span>
                        <Badge
                          variant="outline"
                          className={`text-[10px] sm:text-xs ${selectedTopic === topic.tag
                            ? 'bg-white text-primary border-white'
                            : 'bg-white/50 group-hover:bg-white/90'
                            }`}
                        >
                          {topic.count}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RICH POST COMPOSER - Always visible on desktop (lg+) */}
            <Card className="hidden lg:block p-3 sm:p-4 bg-gradient-to-br from-primary/5 via-orange-50/50 to-yellow-50/30 border-2 border-primary/20 shadow-lg hover:shadow-xl transition-all">
              <div className="flex gap-2 sm:gap-3">
                {/* User Avatar */}
                <Avatar className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-primary flex-shrink-0">
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
                  <div className="flex gap-2 mt-3 flex-wrap">
                    <button className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white hover:bg-blue-50 border border-border hover:border-blue-300 rounded-xl transition-all hover:scale-105 group min-w-0"
                      onClick={() => setShowCreateModal(true)}>
                      <Camera className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-blue-700 truncate">Photo</span>
                    </button>

                    <button className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white hover:bg-red-50 border border-border hover:border-red-300 rounded-xl transition-all hover:scale-105 group min-w-0"
                      onClick={() => setShowCreateModal(true)}>
                      <Video className="w-4 h-4 text-red-600 group-hover:scale-110 transition-transform flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-red-700 truncate">Video</span>
                    </button>

                    <button className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white hover:bg-orange-50 border border-border hover:border-primary rounded-xl transition-all hover:scale-105 group min-w-0"
                      onClick={() => setShowCreateModal(true)}>
                      <UtensilsCrossed className="w-4 h-4 text-primary group-hover:scale-110 transition-transform flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-primary truncate">Recipe</span>
                    </button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Filter Tabs */}
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-4 bg-muted/30">
                <TabsTrigger
                  value="all"
                  className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:!text-white data-[state=active]:font-bold"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="question"
                  className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:!text-white data-[state=active]:font-bold"
                >
                  Questions
                </TabsTrigger>
                <TabsTrigger
                  value="poll"
                  className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:!text-white data-[state=active]:font-bold"
                >
                  Polls
                </TabsTrigger>
                <TabsTrigger
                  value="tip"
                  className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:!text-white data-[state=active]:font-bold"
                >
                  Tips
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Posts Feed */}
            <div className="space-y-4">
              {filteredPosts.length > 0 ? (
                filteredPosts.map(post => <PostCard key={post.id} post={post} />)
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <p>No posts found matching your criteria.</p>
                  <Button
                    variant="link"
                    onClick={() => {
                      setSelectedTab('all');
                      setSelectedTopic(null);
                      setSearchQuery('');
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 hidden lg:block">
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
      {/* FAB - Always visible on mobile, show on scroll down. Positioned higher for mobile navigation */}
      <button onClick={() => setShowCreateModal(true)} className={`fixed bottom-6 right-4 sm:bottom-20 sm:right-6 z-50 sm:hidden bg-primary text-white shadow-2xl rounded-full transition-all ${showFABLabel ? 'px-4 sm:px-6 py-3 sm:py-4' : 'p-3 sm:p-4'}`}>
        <div className="flex items-center gap-2 sm:gap-3">
          <Plus className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
          <span className={`font-semibold text-sm sm:text-base whitespace-nowrap overflow-hidden transition-all ${showFABLabel ? 'max-w-[100px] sm:max-w-[120px] opacity-100' : 'max-w-0 opacity-0'}`}>New Post</span>
        </div>
      </button>

      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="w-full h-fit sm:w-auto sm:h-auto sm:max-w-lg overflow-y-auto p-4 sm:p-5">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg">Create New Post</DialogTitle>
          </DialogHeader>

          <Tabs value={createMode} onValueChange={setCreateMode} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-3">
              <TabsTrigger value="general">Post / Question / Tip</TabsTrigger>
              <TabsTrigger value="poll">Poll</TabsTrigger>
            </TabsList>

            {createMode === 'general' ? (
              <div className="space-y-3">
                <div className="flex gap-2 p-1 bg-muted/50 rounded-lg w-fit">
                  <button
                    onClick={() => setSelectedGeneralType('post')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${selectedGeneralType === 'post' ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                    <div className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> Post</div>
                  </button>
                  <button
                    onClick={() => setSelectedGeneralType('question')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${selectedGeneralType === 'question' ? 'bg-white shadow-sm text-red-500' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                    <div className="flex items-center gap-1"><HelpCircle className="w-3.5 h-3.5" /> Question</div>
                  </button>
                  <button
                    onClick={() => setSelectedGeneralType('tip')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${selectedGeneralType === 'tip' ? 'bg-white shadow-sm text-yellow-600' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                    <div className="flex items-center gap-1"><Lightbulb className="w-3.5 h-3.5" /> Tip</div>
                  </button>
                </div>

                <Textarea
                  placeholder={selectedGeneralType === 'question' ? "Ask the community something..." : selectedGeneralType === 'tip' ? "Share your secret cooking hack..." : "What's delicious today?"}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="min-h-[120px] text-base resize-none"
                />

                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  <div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">Image (Optional)</Label>
                      {imageUrl ? (
                        <div className="relative mt-2">
                          <img src={imageUrl} alt="Preview" className="w-full h-48 object-cover rounded-md" />
                          <button
                            onClick={() => setImageUrl('')}
                            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 mt-1">
                          <label htmlFor="image-upload" className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-md transition-all text-sm font-medium w-full justify-center border border-dashed border-gray-300">
                            <ImageIcon className="w-4 h-4" />
                            {isUploading ? "Uploading..." : "Upload Image"}
                          </label>
                          <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                            disabled={isUploading}
                          />
                          {isUploading && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                        </div>
                      )}
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
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label>Your Question</Label>
                  <Input
                    placeholder="e.g. Pho vs Bun Bo Hue?"
                    value={pollQuestion}
                    onChange={(e) => setPollQuestion(e.target.value)}
                    className="text-lg font-medium mt-1"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Options</Label>
                  {pollOptions.map((opt, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Input
                        placeholder={`Option ${idx + 1}`}
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...pollOptions];
                          newOpts[idx] = e.target.value;
                          setPollOptions(newOpts);
                        }}
                      />
                      {pollOptions.length > 2 && (
                        <Button variant="ghost" size="icon" onClick={() => {
                          const newOpts = pollOptions.filter((_, i) => i !== idx);
                          setPollOptions(newOpts);
                        }}><span className="text-red-500">×</span></Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => setPollOptions([...pollOptions, ''])} className="w-full border-dashed">
                    + Add Option
                  </Button>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-end mt-4 gap-2">
              <Button variant="ghost" onClick={() => setShowCreateModal(false)} className="w-full sm:w-auto">Cancel</Button>
              <Button onClick={handleCreatePost} disabled={isSubmitting} className="w-full sm:w-auto bg-primary hover:bg-orange-600 text-white min-w-[100px]">
                {isSubmitting ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedPost} onOpenChange={(open: boolean) => !open && setSelectedPost(null)}>
        <DialogContent className="w-full h-full sm:w-auto sm:h-auto sm:max-w-lg max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden bg-white">
          <DialogTitle className="sr-only">Post Detail</DialogTitle>
          {selectedPost && (
            <>
              {/* Header: Author Info */}
              <div className="flex items-center justify-between p-3 sm:p-4 border-b bg-white z-10">
                <div className="flex items-center gap-3">
                  <Avatar><div className="bg-primary text-white flex items-center justify-center w-full h-full font-bold">{selectedPost.authorAvatar}</div></Avatar>
                  <div><h4 className="font-semibold text-sm sm:text-base">{selectedPost.authorName}</h4><div className="text-[10px] sm:text-xs text-muted-foreground">{formatTimeAgo(selectedPost.createdAt)}</div></div>
                </div>
                <PostOptions />
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 custom-scrollbar">
                <p className="mb-3 sm:mb-4 text-base sm:text-lg">{selectedPost.content}</p>
                {selectedPost.image && (
                  <div className="w-full mb-4 max-h-[400px] flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
                    <img
                      src={selectedPost.image}
                      alt="Post Detail"
                      className="w-full h-auto max-h-[400px] object-contain rounded-lg"
                    />
                  </div>
                )}
                <PollComponent post={selectedPost} />

                <div className="h-px bg-border my-6" />

                {/* Comments List */}
                <h3 className="font-bold text-sm sm:text-base mb-3 sm:mb-4">Comments ({postComments.length})</h3>
                <div className="space-y-6">
                  {postComments.map(comment => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="w-7 h-7 sm:w-8 sm:h-8"><div className="bg-gray-200 text-gray-600 flex items-center justify-center w-full h-full text-xs font-bold">{comment.authorAvatar}</div></Avatar>
                      <div className="flex-1">
                        <div className="bg-muted/50 p-3 rounded-2xl rounded-tl-none">
                          <div className="flex justify-between items-start">
                            <span className="font-semibold text-sm">{comment.authorName}</span>
                            <PostOptions />
                          </div>
                          <p className="text-sm mt-1">{comment.content}</p>
                        </div>
                        <div className="flex gap-4 mt-1 ml-2 text-xs text-muted-foreground font-medium">
                          <button className="hover:text-primary">Like</button>
                          <button className="hover:text-primary" onClick={() => setReplyingTo(comment.id)}>Reply</button>
                          <span>{formatTimeAgo(comment.createdAt)}</span>
                        </div>

                        {/* Replies (Nested) */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="mt-3 space-y-3 pl-3 border-l-2 border-border ml-2">
                            {comment.replies.map(reply => (
                              <div key={reply.id} className="flex gap-3">
                                <Avatar className="w-6 h-6"><div className="bg-gray-200 w-full h-full flex items-center justify-center text-[10px]">{reply.authorAvatar}</div></Avatar>
                                <div>
                                  <div className="bg-muted/30 p-2 rounded-xl">
                                    <span className="font-semibold text-xs">{reply.authorName}</span>
                                    <p className="text-xs">{reply.content}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer: Input Comment (Sticky Bottom) */}
              <div className="p-3 sm:p-4 border-t bg-white">
                {replyingTo && (
                  <div className="flex justify-between items-center text-xs text-blue-600 mb-2 bg-blue-50 p-2 rounded">
                    <span>Replying to comment...</span>
                    <button onClick={() => setReplyingTo(null)} className="font-bold">Cancel</button>
                  </div>
                )}
                <div className="flex gap-2">
                  <Input
                    placeholder="Write a comment..."
                    value={newCommentContent}
                    onChange={(e) => setNewCommentContent(e.target.value)}
                    className="flex-1 rounded-full bg-muted/50 border-0"
                    onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
                  />
                  <Button size="icon" className="rounded-full" onClick={handleSendComment}>
                    <Send className="w-4 h-4" />
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
