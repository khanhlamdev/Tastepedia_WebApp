import { ArrowLeft, TrendingUp, DollarSign, Eye, Heart, Plus, Edit, Trash2, MoreVertical } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

interface CreatorStudioPageProps {
  onNavigate: (page: string) => void;
}

export function CreatorStudioPage({ onNavigate }: CreatorStudioPageProps) {
  const stats = {
    totalViews: 125430,
    totalEarnings: 2340.50,
    totalLikes: 8920,
    totalRecipes: 42
  };

  const recentContent = [
    {
      id: 1,
      title: 'Vietnamese Pho Bo Recipe',
      type: 'Recipe',
      views: 12400,
      likes: 890,
      earnings: 145.20,
      status: 'published',
      date: 'Jan 15, 2026'
    },
    {
      id: 2,
      title: '30-Second Pad Thai Hack',
      type: 'Reel',
      views: 45200,
      likes: 2340,
      earnings: 320.50,
      status: 'published',
      date: 'Jan 12, 2026'
    },
    {
      id: 3,
      title: 'Healthy Buddha Bowl',
      type: 'Recipe',
      views: 8900,
      likes: 560,
      earnings: 78.40,
      status: 'published',
      date: 'Jan 10, 2026'
    },
    {
      id: 4,
      title: 'Perfect Pasta Carbonara',
      type: 'Recipe',
      views: 15600,
      likes: 1120,
      earnings: 189.30,
      status: 'draft',
      date: 'Jan 8, 2026'
    },
  ];

  const earningsData = [
    { month: 'Jan', earnings: 2340.50 },
    { month: 'Dec', earnings: 1890.20 },
    { month: 'Nov', earnings: 2150.80 },
    { month: 'Oct', earnings: 1670.40 },
    { month: 'Sep', earnings: 1920.10 },
    { month: 'Aug', earnings: 2080.60 },
  ];

  const maxEarnings = Math.max(...earningsData.map(d => d.earnings));

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('profile')}
              className="p-2 hover:bg-muted rounded-full"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">Creator Studio</h1>
              <p className="text-sm text-muted-foreground">Manage your content & earnings</p>
            </div>
            <Button className="bg-primary hover:bg-primary/90 rounded-full">
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">New Content</span>
              <span className="md:hidden">New</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Eye className="w-4 h-4" />
              <span className="text-sm">Total Views</span>
            </div>
            <p className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
            <p className="text-xs text-secondary mt-1">+12% this month</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm">Earnings</span>
            </div>
            <p className="text-2xl font-bold">${stats.totalEarnings.toLocaleString()}</p>
            <p className="text-xs text-secondary mt-1">+8% this month</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Heart className="w-4 h-4" />
              <span className="text-sm">Total Likes</span>
            </div>
            <p className="text-2xl font-bold">{stats.totalLikes.toLocaleString()}</p>
            <p className="text-xs text-secondary mt-1">+15% this month</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">Recipes</span>
            </div>
            <p className="text-2xl font-bold">{stats.totalRecipes}</p>
            <p className="text-xs text-muted-foreground mt-1">Published</p>
          </Card>
        </div>

        {/* Earnings Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold">Earnings Overview</h3>
              <p className="text-sm text-muted-foreground">Last 6 months</p>
            </div>
            <Button variant="outline" size="sm" className="rounded-full">
              Export
            </Button>
          </div>

          <div className="space-y-3">
            {earningsData.map((data, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{data.month}</span>
                  <span className="font-bold text-primary">${data.earnings.toFixed(2)}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full transition-all"
                    style={{ width: `${(data.earnings / maxEarnings) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Content Management */}
        <Card className="p-6">
          <Tabs defaultValue="all">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Your Content</h3>
              <TabsList className="bg-muted rounded-lg p-1">
                <TabsTrigger value="all" className="rounded-md">All</TabsTrigger>
                <TabsTrigger value="published" className="rounded-md">Published</TabsTrigger>
                <TabsTrigger value="draft" className="rounded-md">Drafts</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="space-y-3">
              {recentContent.map((content) => (
                <div
                  key={content.id}
                  className="flex items-center gap-4 p-4 border border-border rounded-xl hover:border-primary transition-colors"
                >
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🍜</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold truncate">{content.title}</h4>
                      <Badge variant="outline" className="text-xs">{content.type}</Badge>
                      {content.status === 'draft' && (
                        <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                          Draft
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {content.views.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {content.likes.toLocaleString()}
                      </span>
                      <span className="font-medium text-secondary">
                        ${content.earnings.toFixed(2)}
                      </span>
                      <span>{content.date}</span>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="flex-shrink-0">
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
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="published">
              {/* Filter published content */}
            </TabsContent>

            <TabsContent value="draft">
              {/* Filter draft content */}
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-24 md:bottom-8 right-4 w-14 h-14 bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
