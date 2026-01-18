# Tastepedia - Complete FoodTech Application Guide

## 🍽️ Application Overview

Tastepedia is a comprehensive FoodTech web application that combines recipe discovery, AI-powered meal planning, social features, and integrated e-commerce. The platform connects users with recipes, ingredients, and a community of food enthusiasts.

---

## 🎨 Design System

### Brand Identity
- **Concept**: "Taste" (Sensory) + "Pedia" (Encyclopedia) + Commerce
- **Tagline**: "Cook Smarter, Eat Better"

### Color Palette
- **Primary Orange**: `#FF6B35` - CTAs, actions, appetite stimulation
- **Fresh Green**: `#4CAF50` - Health indicators, success states
- **Off-White**: `#F9F9F9` - Clean background
- **Dark Grey**: `#1F2937` - Primary text

### Typography
- **Font Family**: Inter / Poppins
- **Style**: Round, friendly, and highly legible
- **Hierarchy**: Clear visual hierarchy with bold headings and medium body text

### UI Components
- **Border Radius**: 16px (rounded-2xl to rounded-3xl)
- **Shadows**: Soft, layered shadows for depth
- **Transitions**: Smooth hover and interaction states
- **Responsive**: Mobile-first with desktop enhancements

---

## 📱 Complete User Journey

### **PART 1: ENTRY & ONBOARDING**

#### 1. Authentication Page
**Purpose**: User login and registration

**Features**:
- Split-screen design (Desktop)
  - Left: Hero food image with brand messaging
  - Right: Clean authentication form
- Login form with email/password
- Social authentication (Google, Facebook)
- Sign-up with "Become a Creator" option
- Mobile: Stacked layout with logo on top

**User Actions**:
- Switch between login/signup
- Social login with one click
- Password visibility toggle
- Navigate to forgot password

---

#### 2. Onboarding Wizard
**Purpose**: Personalize user experience with AI

**Features**:
- 3-step progressive wizard with visual progress indicator
- **Step 1**: Select main goal (Eat Healthy, Muscle Gain, Quick Cooking, Explore Cuisine)
- **Step 2**: Dietary restrictions with multi-select chips (Peanut, Seafood, Gluten-free, etc.)
- **Step 3**: Favorite cuisines selection (Vietnamese, Italian, Japanese, etc.)
- Skip option available
- Back/Next navigation

**User Actions**:
- Select preferences via card clicks
- Multi-select dietary restrictions
- Skip onboarding if desired
- Complete setup to access main app

---

### **PART 2: DISCOVERY & CONTENT**

#### 3. Homepage (The Hub)
**Purpose**: Central discovery and navigation hub

**Features**:
- Sticky header with search, cart (with badge), notifications, profile
- Hero section with "Ask AI Chef" CTA
- Smart category circles (Vietnamese, Keto, Dessert, Under $15)
- Trending recipes grid with:
  - High-quality food images
  - Star ratings
  - Cooking time
  - Price indicators
  - Save/heart functionality
- "What's in your Fridge?" ingredient input feature
- Mobile: Bottom navigation bar

**User Actions**:
- Search for recipes/ingredients
- Click categories to filter
- View recipe details
- Add recipes to favorites
- Navigate to cart
- Access profile

---

#### 4. Search & Filter Page
**Purpose**: Advanced recipe discovery

**Features**:
- Prominent search bar with clear button
- Desktop sidebar with comprehensive filters:
  - Calorie range slider (100-1000 kcal)
  - Cooking time slider (5-120 mins)
  - Price range checkboxes (Budget, Medium, Premium)
  - Cuisine multi-select badges
- Mobile: Filter sheet drawer
- Results grid (3 columns on desktop)
- Active filter badges with remove option
- Empty state with popular search suggestions
- Real-time result count

**User Actions**:
- Enter search queries
- Adjust filter sliders
- Select multiple cuisines
- Clear all filters
- Click recipe cards for details
- Try suggested searches

---

#### 5. Food Reels (Social Discovery)
**Purpose**: TikTok-style video content with commerce

**Features**:
- Full-screen vertical video feed
- Overlay UI elements:
  - Creator avatar with follow button
  - Like, comment, share buttons (right side)
  - Caption and music info (bottom)
- Mute/unmute toggle
- Shopping integration:
  - "Used in this video" product drawer
  - Mix of affiliate links and cart items
  - Quick "Add to Cart" buttons
- Swipe navigation dots
- Auto-play functionality

**User Actions**:
- Swipe between videos
- Like and save reels
- Follow creators
- Add products to cart
- Share reels
- Toggle audio

---

### **PART 3: CORE UTILITY**

#### 6. Recipe Detail & Commerce Page
**Purpose**: Comprehensive recipe information with integrated shopping

**Features**:
**Content Section**:
- Large hero video/image with play button
- Nutritional information badges (Calories, Protein, Fat, Carbs)
- Interactive ingredients checklist
- "In Pantry" badges for owned items
- Step-by-step numbered instructions
- Recipe metadata (rating, time, servings)
- Creator profile card with follow option

**Commerce Section** (Desktop Sticky / Mobile Floating):
- "Shop this Recipe" panel
- Ingredient list with prices
- Quantity selection
- Automatic price calculation
- Delivery information
- "Add to Cart & Delivery" CTA
- Filters pantry items from total

**User Actions**:
- Watch recipe video
- Check off ingredients
- Toggle ingredient selection
- View nutrition info
- Add selected items to cart
- Follow recipe creator
- Save recipe to cookbook

---

#### 7. AI Meal Planner
**Purpose**: Weekly meal planning with AI assistance

**Features**:
**Sidebar Controls**:
- Daily calorie limit slider (1200-3000)
- Weekly budget slider ($50-$300)
- Dietary goal quick filters
- "Generate Plan" AI button
- "Add Week to Cart" bulk action

**Calendar View**:
- 7-day weekly grid
- Breakfast, Lunch, Dinner slots per day
- Recipe cards with images
- Calorie counts per meal
- "Today" highlight
- Week navigation arrows

**Summary Cards**:
- Average calories/day
- Total weekly cost
- Recipe count
- Custom meal addition

**User Actions**:
- Adjust calorie/budget preferences
- Generate AI meal plans
- Navigate between weeks
- Click meals for recipe details
- Add snacks/custom meals
- Bulk add week to cart
- Replace individual meals

---

### **PART 4: COMMERCE & MANAGEMENT**

#### 8. Shopping Cart Page
**Purpose**: Review and manage order before checkout

**Features**:
**Cart Items**:
- Grouped by recipe origin
- Item cards with:
  - Product image
  - Name and quantity
  - Price
  - Quantity stepper (+/-)
  - Remove button
- Real-time total calculation

**Cross-sell Section**:
- "You might miss these spices" carousel
- Quick add buttons for suggested items
- Highlighted in green accent

**Order Summary** (Desktop Sticky):
- Subtotal calculation
- Shipping cost (FREE over $30)
- Discount display
- Grand total
- Progress indicator for free shipping
- Checkout CTA
- Trust badges (free delivery, returns)

**User Actions**:
- Update quantities
- Remove items
- Add cross-sell items
- Apply promo codes
- Proceed to checkout
- Continue shopping

---

#### 9. Order Tracking Page
**Purpose**: Real-time delivery tracking and driver communication

**Features**:
**ETA Display**:
- Large countdown timer
- Gradient card design
- Visual delivery status

**Map Integration**:
- Interactive delivery route
- Current driver location
- Destination marker
- Live tracking updates

**Status Timeline**:
- Vertical progress tracker
- 4 stages: Order Placed → Preparing → Driver Picked Up → Arriving
- Timestamp for each stage
- Completion indicators
- Stage descriptions

**Driver Information**:
- Driver photo and name
- Star rating and delivery count
- Vehicle details and plate number
- Call and chat buttons
- Communication options

**Order Details**:
- Item list with quantities
- Payment summary
- Delivery address
- Order number

**User Actions**:
- Track delivery in real-time
- Call/chat with driver
- Edit delivery address
- Contact support
- View order items
- Rate delivery (post-arrival)

---

#### 10. User Profile Dashboard
**Purpose**: Personal account management and history

**Features**:
**Profile Header**:
- User avatar with achievement badge
- Following/followers count
- Recipes cooked counter
- Edit profile button

**Tabs System**:

**Cookbook Tab**:
- Achievement badges grid (Master Chef, Streak, etc.)
- Saved recipes gallery
- Quick recipe access
- Remove from favorites

**My Orders Tab**:
- Order history list
- Order details (date, items, total, status)
- "View Details" button
- "Re-order" quick action
- Status badges

**Settings Tab**:
- Personal information
- Delivery addresses
- Payment methods
- Notification preferences
- Dietary preferences
- Log out option
- Danger zone (account deletion)

**User Actions**:
- Edit profile information
- View saved recipes
- Access order history
- Reorder previous orders
- Update settings
- Manage addresses
- Log out

---

## 🧭 Navigation Structure

### Desktop Navigation
- **Top Sticky Header**: Logo, Search, Cart, Notifications, Profile
- **Always Visible**: Persistent across all main pages

### Mobile Navigation
- **Bottom Tab Bar**: 
  - Home
  - Search
  - Reels
  - Planner
  - Profile
- **Auto-Hide**: Hidden on auth, onboarding, and reels pages

---

## 🎯 Key User Flows

### **Flow 1: First-Time User Journey**
1. Land on Authentication page
2. Sign up with email or social
3. Complete 3-step onboarding
4. Arrive at Homepage
5. Explore trending recipes
6. Click recipe → View details
7. Add ingredients to cart
8. Proceed to checkout
9. Track delivery
10. Save recipe to cookbook

### **Flow 2: Meal Planning Journey**
1. Navigate to AI Meal Planner
2. Set calorie/budget preferences
3. Generate weekly plan
4. Review suggested meals
5. Customize if needed
6. Add entire week to cart
7. Checkout and track delivery

### **Flow 3: Social Discovery**
1. Navigate to Reels
2. Watch recipe videos
3. Like and follow creators
4. Discover products in video
5. Add products to cart
6. Complete purchase

### **Flow 4: Search & Filter**
1. Use search bar on homepage
2. Enter ingredient or dish name
3. Apply filters (calories, time, price, cuisine)
4. Browse filtered results
5. Select recipe
6. Add ingredients to cart

---

## 📊 Technical Implementation

### State Management
- Centralized app state in `App.tsx`
- Page-based routing
- Recipe and cart state persistence

### Component Architecture
- 10 major page components
- Reusable UI component library
- Mobile-first responsive design
- Tailwind CSS styling

### Key Technologies
- **React** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Shadcn/ui** component primitives

---

## 🚀 Getting Started

### To Navigate the Application:
1. Start at Authentication page
2. Sign up to access onboarding
3. Complete onboarding to reach homepage
4. Use the navigation to explore all features
5. Mobile users: Use bottom tab bar
6. Desktop users: Use top header navigation

### Key Interactions:
- Click recipe cards to view details
- Use cart icon to view shopping cart
- Navigate between pages using provided buttons
- Complete the full journey from discovery to delivery

---

## 🎨 Design Highlights

### Visual Design
- Clean, modern aesthetic
- Food-centric imagery
- Warm color palette
- Generous white space
- Clear visual hierarchy

### User Experience
- Intuitive navigation
- Progressive disclosure
- Clear CTAs
- Consistent patterns
- Helpful empty states
- Real-time feedback

### Responsive Design
- Mobile-first approach
- Adaptive layouts
- Touch-friendly targets
- Optimized images
- Fast load times

---

## 📝 Content Strategy

### Dummy Data Includes:
- Vietnamese Bún Chả recipe
- Multiple cuisine types
- Price ranges ($5-$18)
- Nutritional information
- Cooking times (15-45 mins)
- User profiles and avatars
- Order history
- Achievement badges

---

## 🎯 Business Model

### Revenue Streams:
1. **Commerce**: Ingredient sales with markup
2. **Affiliates**: Kitchen equipment and specialty items
3. **Premium**: Advanced meal planning features
4. **Creators**: Commission on recipe sales
5. **Advertising**: Sponsored recipes and brands

---

## 🔮 Future Enhancements

- Live video cooking classes
- Voice-guided cooking mode
- AR ingredient recognition
- Community recipe sharing
- Subscription meal kits
- Restaurant partnerships
- Nutrition tracking
- Grocery delivery integration

---

**Tastepedia** - Where culinary knowledge meets commerce. Cook smarter, eat better! 🍽️
