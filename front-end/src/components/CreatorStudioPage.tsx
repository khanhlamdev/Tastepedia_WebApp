import { ArrowLeft, TrendingUp, DollarSign, Eye, Heart, Plus, Edit, Trash2, MoreVertical, Calendar, Users, BarChart3, Download, Filter, Clock, CheckCircle, XCircle, TrendingDown, Sparkles, Target, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from './ui/dropdown-menu';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';

interface CreatorStudioPageProps {
  onNavigate: (page: string) => void;
}

export function CreatorStudioPage({ onNavigate }: CreatorStudioPageProps) {
  const stats = {
    totalViews: 125430,
    totalEarnings: 2340.50,
    totalLikes: 8920,
    totalRecipes: 42,
    followers: 12560,
    engagementRate: 4.2,
    avgViewTime: "2:45",
    conversionRate: 3.8
  };

  const growthData = [
    { label: 'Views', value: '+12.5%', trend: 'up', change: 12400 },
    { label: 'Earnings', value: '+8.2%', trend: 'up', change: 178.30 },
    { label: 'Engagement', value: '+5.7%', trend: 'up', change: 2.1 },
    { label: 'Followers', value: '+3.4%', trend: 'up', change: 412 }
  ];

  const recentContent = [
    {
      id: 1,
      title: 'Authentic Vietnamese Pho Bo',
      type: 'Recipe',
      category: 'Main Course',
      difficulty: 'Medium',
      views: 12400,
      likes: 890,
      earnings: 145.20,
      status: 'published',
      date: 'Jan 15, 2026',
      thumbnail: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=300',
      timeToCook: '2 hours',
      rating: 4.8,
      comments: 124
    },
    {
      id: 2,
      title: '30-Second Pad Thai Street Food Hack',
      type: 'Video',
      category: 'Quick Meal',
      difficulty: 'Easy',
      views: 45200,
      likes: 2340,
      earnings: 320.50,
      status: 'published',
      date: 'Jan 12, 2026',
      thumbnail: 'https://images.unsplash.com/photo-1559314809-2b99056a8c4a?auto=format&fit=crop&w=300',
      timeToCook: '15 mins',
      rating: 4.9,
      comments: 356
    },
    {
      id: 3,
      title: 'Rainbow Buddha Bowl with Tahini Dressing',
      type: 'Recipe',
      category: 'Healthy',
      difficulty: 'Easy',
      views: 8900,
      likes: 560,
      earnings: 78.40,
      status: 'published',
      date: 'Jan 10, 2026',
      thumbnail: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300',
      timeToCook: '25 mins',
      rating: 4.7,
      comments: 89
    },
    {
      id: 4,
      title: 'Perfect Pasta Carbonara - Chef\'s Secret',
      type: 'Recipe',
      category: 'Italian',
      difficulty: 'Medium',
      views: 15600,
      likes: 1120,
      earnings: 189.30,
      status: 'draft',
      date: 'Jan 8, 2026',
      thumbnail: 'https://images.unsplash.com/photo-1598866594230-a7c12756260f?auto=format&fit=crop&w=300',
      timeToCook: '30 mins',
      rating: 4.9,
      comments: 0
    },
    {
      id: 5,
      title: 'Decadent Chocolate Lava Cake',
      type: 'Video',
      category: 'Dessert',
      difficulty: 'Hard',
      views: 28900,
      likes: 1890,
      earnings: 245.80,
      status: 'published',
      date: 'Jan 5, 2026',
      thumbnail: 'https://images.unsplash.com/photo-1624353365286-3f8d62dadadf?auto=format&fit=crop&w=300',
      timeToCook: '45 mins',
      rating: 4.8,
      comments: 212
    },
    {
      id: 6,
      title: 'Korean Kimchi Fried Rice',
      type: 'Recipe',
      category: 'Asian',
      difficulty: 'Easy',
      views: 7800,
      likes: 430,
      earnings: 56.90,
      status: 'scheduled',
      date: 'Jan 20, 2026',
      thumbnail: 'https://images.unsplash.com/photo-1585937421612-70ca003675ed?auto=format&fit=crop&w=300',
      timeToCook: '20 mins',
      rating: 0,
      comments: 0
    },
  ];

  const earningsData = [
    { month: 'Jan', earnings: 2340.50, target: 2000, trend: 'up' },
    { month: 'Dec', earnings: 1890.20, target: 1800, trend: 'up' },
    { month: 'Nov', earnings: 2150.80, target: 2000, trend: 'up' },
    { month: 'Oct', earnings: 1670.40, target: 1700, trend: 'down' },
    { month: 'Sep', earnings: 1920.10, target: 1900, trend: 'up' },
    { month: 'Aug', earnings: 2080.60, target: 2000, trend: 'up' },
  ];

  const topPerformers = [
    { id: 1, title: 'Pad Thai Hack', metric: 'views', value: 45200, growth: '+24%' },
    { id: 2, title: 'Pho Bo Recipe', metric: 'engagement', value: 8.2, growth: '+12%' },
    { id: 3, title: 'Chocolate Cake', metric: 'earnings', value: 245.80, growth: '+18%' },
  ];

  const weeklyGoals = [
    { label: 'New Recipes', current: 3, target: 5, progress: 60 },
    { label: 'Social Posts', current: 7, target: 10, progress: 70 },
    { label: 'Video Content', current: 2, target: 3, progress: 66 },
    { label: 'Engagement', current: 4200, target: 5000, progress: 84 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 border-green-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Hard': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-border shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onNavigate('profile')}
                    className="hover:bg-primary/10 rounded-full"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-6 bg-gradient-to-b from-primary to-orange-500 rounded-full"></div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                      Creator Studio
                    </h1>
                    <Badge variant="outline" className="ml-2 border-primary/30 text-primary font-medium">
                      PRO <Zap className="w-3 h-3 ml-1" />
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Manage your content, analytics & earnings</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="gap-2 rounded-full">
                  <Calendar className="w-4 h-4" />
                  <span>Schedule</span>
                </Button>
                <Button
                    onClick={() => onNavigate('recipe-manager')}
                    className="bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 rounded-full gap-2 shadow-lg hover:shadow-xl transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Content</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Stats Grid - Updated with Growth Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="group hover:shadow-lg transition-all duration-300 border border-primary/10 hover:border-primary/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform">
                    <Eye className="w-6 h-6 text-primary" />
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12.5%
                  </Badge>
                </div>
                <h3 className="text-3xl font-bold">{stats.totalViews.toLocaleString()}</h3>
                <p className="text-sm text-muted-foreground mt-1">Total Views</p>
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-blue-500 rounded-full w-[65%]"></div>
                  </div>
                  <span className="text-xs font-medium">65% target</span>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border border-amber-100 hover:border-amber-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-amber-100 rounded-xl group-hover:scale-110 transition-transform">
                    <DollarSign className="w-6 h-6 text-amber-600" />
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +8.2%
                  </Badge>
                </div>
                <h3 className="text-3xl font-bold">${stats.totalEarnings.toFixed(2)}</h3>
                <p className="text-sm text-muted-foreground mt-1">Total Earnings</p>
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full w-[78%]"></div>
                  </div>
                  <span className="text-xs font-medium">78% target</span>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border border-rose-100 hover:border-rose-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-rose-100 rounded-xl group-hover:scale-110 transition-transform">
                    <Heart className="w-6 h-6 text-rose-600" />
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +15.7%
                  </Badge>
                </div>
                <h3 className="text-3xl font-bold">{stats.totalLikes.toLocaleString()}</h3>
                <p className="text-sm text-muted-foreground mt-1">Total Likes</p>
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full w-[82%]"></div>
                  </div>
                  <span className="text-xs font-medium">82% target</span>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border border-emerald-100 hover:border-emerald-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-emerald-100 rounded-xl group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6 text-emerald-600" />
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +3.4%
                  </Badge>
                </div>
                <h3 className="text-3xl font-bold">{stats.followers.toLocaleString()}</h3>
                <p className="text-sm text-muted-foreground mt-1">Followers</p>
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full w-[91%]"></div>
                  </div>
                  <span className="text-xs font-medium">91% target</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Earnings & Goals */}
            <div className="lg:col-span-2 space-y-6">
              {/* Enhanced Earnings Chart */}
              <Card className="overflow-hidden border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-orange-500/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        Earnings Overview
                      </CardTitle>
                      <CardDescription>Last 6 months performance vs target</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="gap-2 rounded-full">
                        <Filter className="w-3 h-3" />
                        Filter
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2 rounded-full">
                        <Download className="w-3 h-3" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-end justify-between h-64">
                      {earningsData.map((data, idx) => (
                          <div key={idx} className="flex flex-col items-center group">
                            <div className="text-xs text-muted-foreground mb-2">{data.month}</div>
                            <div className="relative w-12">
                              {/* Target Line */}
                              <div className="absolute w-full h-0.5 bg-amber-200 top-1/2 transform -translate-y-1/2"></div>

                              {/* Earnings Bar */}
                              <div className="relative">
                                <div
                                    className="w-8 mx-auto bg-gradient-to-t from-primary to-blue-500 rounded-t-lg group-hover:from-primary/90 group-hover:to-blue-500/90 transition-all duration-300 group-hover:shadow-lg"
                                    style={{ height: `${(data.earnings / 2500) * 200}px` }}
                                ></div>

                                {/* Target Indicator */}
                                <div
                                    className="absolute w-12 h-0.5 bg-amber-500"
                                    style={{ bottom: `${(data.target / 2500) * 200}px` }}
                                ></div>
                              </div>

                              {/* Tooltip */}
                              <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <div className="bg-gray-900 text-white text-xs rounded-lg p-2 whitespace-nowrap">
                                  <div className="font-bold">${data.earnings.toFixed(2)}</div>
                                  <div className="text-gray-300">Target: ${data.target}</div>
                                  <div className={`flex items-center gap-1 ${data.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                                    {data.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                    {data.trend === 'up' ? 'Above target' : 'Below target'}
                                  </div>
                                </div>
                                <div className="w-2 h-2 bg-gray-900 transform rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
                              </div>
                            </div>
                          </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-center gap-6">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gradient-to-t from-primary to-blue-500 rounded"></div>
                        <span className="text-sm">Actual Earnings</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-0.5 bg-amber-500"></div>
                        <span className="text-sm">Target</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Content Management */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Content Management</CardTitle>
                      <CardDescription>Manage all your recipes and videos</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="gap-2 rounded-full">
                        <Filter className="w-3 h-3" />
                        Filter
                        <Badge variant="secondary" className="ml-1">6</Badge>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="rounded-full">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Bulk Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="w-4 h-4 mr-2" />
                            Export All
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete All Drafts
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="all">
                    <TabsList className="w-full bg-muted rounded-lg p-1 mb-6">
                      <TabsTrigger value="all" className="flex-1 rounded-md">All Content</TabsTrigger>
                      <TabsTrigger value="published" className="flex-1 rounded-md">Published</TabsTrigger>
                      <TabsTrigger value="draft" className="flex-1 rounded-md">Drafts</TabsTrigger>
                      <TabsTrigger value="scheduled" className="flex-1 rounded-md">Scheduled</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recentContent.map((content) => (
                            <Card key={content.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden hover:border-primary/50">
                              <div className="flex flex-col md:flex-row">
                                <div className="relative md:w-1/3">
                                  <div className="aspect-video md:aspect-square md:h-full overflow-hidden">
                                    <img
                                        src={content.thumbnail}
                                        alt={content.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                  </div>
                                  <Badge className={`absolute top-2 left-2 ${getStatusColor(content.status)}`}>
                                    {content.status === 'published' && <CheckCircle className="w-3 h-3 mr-1" />}
                                    {content.status === 'draft' && <Edit className="w-3 h-3 mr-1" />}
                                    {content.status === 'scheduled' && <Clock className="w-3 h-3 mr-1" />}
                                    {content.status.charAt(0).toUpperCase() + content.status.slice(1)}
                                  </Badge>
                                </div>

                                <div className="md:w-2/3 p-4">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h4 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-1">
                                        {content.title}
                                      </h4>
                                      <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="outline" className="text-xs">
                                          {content.type}
                                        </Badge>
                                        <Badge variant="outline" className={`text-xs ${getDifficultyColor(content.difficulty)}`}>
                                          {content.difficulty}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                                      <Clock className="w-3 h-3 inline mr-1" />
                                          {content.timeToCook}
                                    </span>
                                      </div>
                                    </div>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="rounded-full">
                                          <MoreVertical className="w-4 h-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                          <Edit className="w-4 h-4 mr-2" />
                                          Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                          <Eye className="w-4 h-4 mr-2" />
                                          View Analytics
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-destructive">
                                          <Trash2 className="w-4 h-4 mr-2" />
                                          Delete
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>

                                  <div className="mt-4 space-y-3">
                                    <div className="grid grid-cols-3 gap-2">
                                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                                        <div className="font-bold">{content.views.toLocaleString()}</div>
                                        <div className="text-xs text-muted-foreground">Views</div>
                                      </div>
                                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                                        <div className="font-bold">{content.likes.toLocaleString()}</div>
                                        <div className="text-xs text-muted-foreground">Likes</div>
                                      </div>
                                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                                        <div className="font-bold">${content.earnings.toFixed(2)}</div>
                                        <div className="text-xs text-muted-foreground">Earnings</div>
                                      </div>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                      <div className="flex items-center gap-4">
                                        {content.rating > 0 && (
                                            <span className="flex items-center gap-1">
                                        <span className="font-bold">{content.rating}</span>
                                        <span className="text-amber-500">★</span>
                                      </span>
                                        )}
                                        <span className="text-muted-foreground">
                                      {content.comments} comments
                                    </span>
                                      </div>
                                      <span className="text-muted-foreground">{content.date}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Card>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Analytics & Goals */}
            <div className="space-y-6">
              {/* Weekly Goals */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Weekly Goals
                  </CardTitle>
                  <CardDescription>Track your progress this week</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {weeklyGoals.map((goal, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{goal.label}</span>
                          <span className="text-sm font-bold">{goal.current}/{goal.target}</span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{Math.round(goal.progress)}% complete</span>
                          <span>{goal.target - goal.current} to go</span>
                        </div>
                      </div>
                  ))}
                  <Separator />
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Overall Progress</span>
                      <span className="text-sm font-bold text-primary">70%</span>
                    </div>
                    <Progress value={70} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Top Performers */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Top Performers
                  </CardTitle>
                  <CardDescription>Best performing content this month</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {topPerformers.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-orange-500/20 rounded-lg flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{item.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {item.metric}: {typeof item.value === 'number' && item.metric !== 'engagement'
                              ? item.value.toLocaleString()
                              : item.value}
                            {item.metric === 'engagement' && '%'}
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          {item.growth}
                        </Badge>
                      </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {growthData.map((stat, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${stat.trend === 'up' ? 'bg-green-100' : 'bg-red-100'}`}>
                            {stat.trend === 'up' ? (
                                <TrendingUp className="w-4 h-4 text-green-600" />
                            ) : (
                                <TrendingDown className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{stat.label}</div>
                            <div className="text-sm text-muted-foreground">vs last month</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                            {stat.value}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {typeof stat.change === 'number' ? stat.change.toLocaleString() : stat.change}
                          </div>
                        </div>
                      </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                      variant="outline"
                      className="w-full justify-start gap-3 hover:bg-primary/10"
                      onClick={() => onNavigate('recipe-manager')}
                  >
                    <Plus className="w-4 h-4" />
                    Create New Recipe
                  </Button>
                  <Button
                      variant="outline"
                      className="w-full justify-start gap-3 hover:bg-primary/10"
                  >
                    <Calendar className="w-4 h-4" />
                    Schedule Content
                  </Button>
                  <Button
                      variant="outline"
                      className="w-full justify-start gap-3 hover:bg-primary/10"
                  >
                    <Download className="w-4 h-4" />
                    Export Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Floating Action Button */}
        <Button
            onClick={() => onNavigate('recipe-manager')}
            className="fixed bottom-24 md:bottom-8 right-4 w-14 h-14 bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 animate-bounce-slow z-50"
            size="icon"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>
  );
}