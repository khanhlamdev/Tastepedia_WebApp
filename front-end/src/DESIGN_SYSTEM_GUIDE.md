# Tastepedia - Complete Design System & Implementation Guide

## 🎨 Design Philosophy
**"Appetizing, Trustworthy, Seamless, Mobile-First"**

---

## 📐 Global Design System

### Color Palette
```css
Primary: #FF6B35 (Sunset Orange) - CTAs, Actions, Prices
Secondary: #4CAF50 (Fresh Basil) - Health Tags, Success States
Background: #F9FAFB (Cool Gray 50) - Main Background
Surface: #FFFFFF (White) - Cards, Modals
Text Primary: #111827 (Gray 900) - Headings
Text Secondary: #6B7280 (Gray 500) - Body Text
```

### Typography
- **Font**: Inter / Plus Jakarta Sans
- **Headings**: Bold, tight tracking
- **Body**: Medium weight, 1.5 line-height

### UI Component Patterns
- **Cards**: `rounded-xl` (16px), `shadow-sm`, hover: `shadow-md`
- **Buttons**: `rounded-full` for actions, `rounded-lg` for forms
- **Inputs**: Ring-focus states, error messages below
- **Hover States**: `hover:opacity-80` or `hover:bg-primary-dark`

---

## 📱 Complete Application Structure (18 Pages)

### **PHASE A: ENTRY & ONBOARDING**

#### 1. Authentication Page (`/components/AuthPage.tsx`)
**Purpose**: User login and registration

**Features**:
- Split-screen layout (Image left, form right on desktop)
- Email/Password authentication
- Social login buttons (Google, Facebook, Apple)
- "Remember Me" checkbox
- "Forgot Password" link
- "Become a Creator" option on signup
- Loading spinner on button click

**Design Elements**:
- Hero image with gradient overlay
- Mobile: Stacked layout with logo on top
- Form validation with error states
- Password visibility toggle

---

#### 2. Onboarding Wizard (`/components/OnboardingPage.tsx`)
**Purpose**: Personalize user experience

**Features**:
- 3-step progressive wizard
- Progress bar at top
- **Step 1**: Goal Selection (Cards: Lose Weight, Save Money, Learn Cooking, Explore Cuisine)
- **Step 2**: Diet Filters (Multi-select chips: Vegan, Keto, Nut-Free, Gluten-Free, etc.)
- **Step 3**: Cuisine Preference (Image grid: Vietnamese, Italian, Japanese, etc.)
- Skip option available
- Back/Next navigation

**Design Elements**:
- Visual progress indicator
- Interactive card selection
- Animated transitions between steps

---

### **PHASE B: DISCOVERY (THE CORE)**

#### 3. Homepage / Dashboard (`/components/HomePage.tsx`)
**Purpose**: Central hub for recipe discovery

**Features**:
- **Sticky Header**: Logo, Search Bar, Cart (with badge), Bell Icon, Avatar
- **Hero Section**: "What do you want to cook?" + AI Chef CTA
- **Smart Categories**: Circular icons (Vietnamese, Keto, Dessert, Under $15)
- **Trending Recipes**: Horizontal scrollable grid with images, ratings, time, price
- **Fridge Raid Feature**: Input field for available ingredients
- **Bottom Navigation** (Mobile): Home, Search, Reels, Planner, Profile

**Design Elements**:
- Gradient hero banner
- Card-based recipe grid
- Badge indicators for notifications and cart count
- Responsive grid (1-3 columns)

---

#### 4. Search & Filter Page (`/components/SearchPage.tsx`)
**Purpose**: Advanced recipe discovery

**Features**:
- Prominent search bar with clear button
- **Desktop Sidebar** with filters:
  - Price slider
  - Calorie range slider
  - Prep time slider
  - Cuisine multi-select badges
- **Mobile**: Filter drawer (Sheet component)
- Results grid (3 columns on desktop)
- Empty state: "No recipes found. Try 'Chicken'?"
- Recipe cards with image, title, rating, time, price/serving

**Design Elements**:
- Skeleton loaders for images
- Filter badges with remove option
- Smooth transitions

---

#### 5. Food Reels (Social Feed) (`/components/ReelsPage.tsx`)
**Purpose**: TikTok-style video content discovery

**Features**:
- Full-screen vertical video feed
- **Right-side overlay actions**: Like, Comment, Share
- **Bottom info**: Creator profile, Caption, Music track
- **Commerce Integration**: "Shop Ingredients" button (glassmorphism)
- Floating drawer showing products used in video
- Swipe/scroll navigation

**Design Elements**:
- Full-viewport layout
- Glassmorphic overlays
- Auto-play functionality
- Gradient text overlays

---

#### 6. Recipe Detail Page (`/components/RecipeDetailPage.tsx`)
**Purpose**: Comprehensive recipe information with shopping

**Features**:
- **Header**: Video/Image hero with play button
- **Meta**: Prep time, Difficulty, Calories (badges)
- **Tabs**: 
  - Ingredients (Checklist with "In Pantry" badges)
  - Instructions (Numbered stepper)
  - Reviews (Ratings and comments)
- **Sticky Sidebar** (Desktop) / Floating Bottom (Mobile):
  - "Buy Ingredients" panel
  - List items with prices
  - Quantity selectors
  - "Add to Cart" CTA

**Design Elements**:
- Nutrition badges
- Interactive checkboxes
- Sticky commerce panel
- Step-by-step instructions

---

### **PHASE C: UTILITY & AI**

#### 7. AI Meal Planner (`/components/MealPlannerPage.tsx`)
**Purpose**: Weekly meal planning with AI

**Features**:
- **Weekly Calendar View**: Monday-Sunday grid
- **Time Slots**: Breakfast, Lunch, Dinner for each day
- **Sidebar Controls**:
  - Daily calorie limit slider (1200-3000)
  - Weekly budget slider ($50-$300)
  - Dietary goal quick filters
- **Actions**:
  - "Generate Plan" AI button
  - "Export to Shopping List"
  - "Add Entire Week to Cart"
- Drag-and-drop meal slots

**Design Elements**:
- Calendar grid layout
- Recipe card previews
- Summary statistics
- AI generation animation

---

#### 8. Chat & Support (`/components/ChatSupportPage.tsx`)
**Purpose**: Customer support and driver communication

**Features**:
- **Left Sidebar**: List of chats (Drivers, Support, Creators)
- **Main Thread**: Message conversation
- **Input Area**: 
  - Text field with auto-resize
  - Image attachment button
  - Quick reply chips ("Track order", "Cancel order", etc.)
- Call and video call buttons
- Typing indicators

**Design Elements**:
- Chat bubbles (sent vs received)
- Online status indicators
- Unread message badges
- Responsive layout (mobile hides sidebar)

---

### **PHASE D: COMMERCE (THE MONEY MAKER)**

#### 9. Shopping Cart (`/components/CartPage.tsx`)
**Purpose**: Review order before checkout

**Features**:
- Items grouped by recipe source
- **Per Item**: Image, Name, Quantity stepper, Price, Remove button
- Free shipping progress bar ("Add $5 more for free shipping")
- Cross-sell: "You might miss these spices" carousel
- **Summary Card**:
  - Subtotal
  - Discount input field
  - Shipping cost
  - Total
- "Proceed to Checkout" CTA

**Design Elements**:
- Grouped item cards
- Progress indicator
- Sticky summary (desktop)
- Cross-sell carousel

---

#### 10. Checkout - Shipping (`/components/CheckoutShippingPage.tsx`)
**Purpose**: Delivery details collection

**Features**:
- **Progress Bar**: Step 1 of 2
- **Map View**: Interactive location picker
- **Address Selection**: Radio buttons for saved addresses
- "Add New Address" option
- **Delivery Time**:
  - "Deliver Now" (30-45 min estimate)
  - "Schedule for Later" (Date + Time slot picker)
- Delivery instructions text field
- Order summary preview

**Design Elements**:
- Map placeholder with pin icon
- Address cards with radio selection
- Time slot grid
- Form validation

---

#### 11. Checkout - Payment (`/components/CheckoutPaymentPage.tsx`)
**Purpose**: Payment method selection

**Features**:
- **Progress Bar**: Step 2 of 2
- **Payment Methods**:
  - Credit/Debit Card (form with validation)
  - E-Wallet (QR code placeholder)
  - Cash on Delivery
- **TasteWallet Toggle**: "Use TastePoints ($5.20)"
- **Order Summary**: Final total with discounts
- Security notice with lock icon
- "Save card" checkbox
- Loading state on submit

**Design Elements**:
- Payment method cards
- Card form with formatting
- QR code placeholder
- Processing animation

---

#### 12. Order Tracking (Live) (`/components/OrderTrackingPage.tsx`)
**Purpose**: Real-time delivery tracking

**Features**:
- **ETA Display**: Large countdown timer
- **Map View**: Driver route visualization
- **Status Timeline** (Vertical):
  - Order Placed
  - Driver Assigned
  - Preparing
  - Driver Picked Up
  - Arriving
- **Driver Card**:
  - Photo, Name, Rating
  - Vehicle plate number
  - Call and Chat buttons
- Live location updates

**Design Elements**:
- Map integration
- Progress timeline with checkmarks
- Driver profile card
- Real-time updates

---

### **PHASE E: USER ECOSYSTEM**

#### 13. User Profile (`/components/ProfilePage.tsx`)
**Purpose**: Personal dashboard and history

**Features**:
- **Header**: 
  - Avatar with achievement badge
  - Following/Followers count
  - Recipes cooked counter
  - Edit profile button
- **Tabs**:
  - **Cookbook**: Achievement badges + Saved recipes grid
  - **My Orders**: Order history with "Re-order" button
  - **Settings**: Links to Wallet, Creator Studio, Settings, Help
- Order status badges
- Recipe thumbnail grid

**Design Elements**:
- Gradient header background
- Achievement cards
- Tabbed interface
- Quick action buttons

---

#### 14. TasteWallet (Loyalty) (`/components/TasteWalletPage.tsx`)
**Purpose**: Digital wallet and rewards management

**Features**:
- **Balance Card**: 
  - Total balance display
  - Pending rewards
  - Top up and Transfer buttons
- Quick top-up amounts ($10, $25, $50, $100)
- **Tabs**:
  - **Transaction History**: List with credits/debits
  - **Rewards & Vouchers**: Grid of redeemable vouchers
- **Voucher Cards**:
  - Discount amount
  - Points required
  - Expiry date
  - "Redeem" button
- TastePoints balance display

**Design Elements**:
- Gradient wallet card
- Transaction icons (arrows)
- Voucher grid
- Points balance

---

#### 15. Notification Center (`/components/NotificationsPage.tsx`)
**Purpose**: Centralized notifications

**Features**:
- **Tabs**: All, Orders, Promos, Social
- **List Categorized**:
  - Order updates
  - Promotional offers
  - Social interactions (follows, comments)
- **Unread items**: Light orange background
- "Mark all as read" button
- "Clear all" option
- Empty state illustration

**Design Elements**:
- Unread badges
- Category icons
- Timestamp display
- Action buttons

---

#### 16. Settings Page (`/components/SettingsPage.tsx`)
**Purpose**: App configuration and preferences

**Features**:
- **Account Section**:
  - Personal Information
  - Address Book
  - Payment Methods
- **Preferences**:
  - Notifications toggle
  - Language selection
  - Dark Mode toggle
- **Security & Privacy**:
  - Change Password
  - Privacy Settings
- **About Section**:
  - App version
  - Terms of Service
  - Privacy Policy
  - Help & Support
- **Logout Button**
- **Danger Zone**: Delete Account

**Design Elements**:
- Grouped settings cards
- Toggle switches
- Chevron navigation
- Destructive action styling

---

### **PHASE F: CREATOR & SYSTEM**

#### 17. Creator Studio Dashboard (`/components/CreatorStudioPage.tsx`)
**Purpose**: Content creator management

**Features**:
- **Stats Dashboard**:
  - Total views
  - Total earnings (with chart)
  - Total likes
  - Published recipes count
- **Earnings Chart**: Line graph (6 months)
- **Content Table**:
  - List of uploaded recipes/reels
  - Views, likes, earnings per item
  - Edit/Delete actions
  - Status badges (Published, Draft)
- **FAB** (Floating Action Button): "+" to upload new content
- Tabs: All, Published, Drafts

**Design Elements**:
- Stats cards grid
- Bar chart visualization
- Content management table
- Floating action button

---

#### 18. 404 Error Page (`/components/NotFoundPage.tsx`)
**Purpose**: Friendly error handling

**Features**:
- **Visual**: Burnt toast illustration with smoke effect
- **Text**: "Oops! We overcooked this page."
- **Action Buttons**:
  - "Back to Kitchen (Home)"
  - "Search for Recipes"
- **Popular Destinations**: Quick links grid
- Error ID display

**Design Elements**:
- Illustrated error state
- Friendly messaging
- Multiple recovery options
- Themed illustration

---

## 🎯 Design Patterns Across All Pages

### Loading States
- Skeleton loaders (gray pulsing boxes) for images
- Spinner animations for button actions
- Progress bars for multi-step processes

### Empty States
- Friendly illustrations
- Helpful messaging
- Clear CTAs to populate content

### Responsive Behavior
- **Mobile**: Sidebars → Drawers/Sheets
- **Desktop**: Multi-column layouts
- **Touch Targets**: Minimum 44px
- **Navigation**: Bottom tabs (mobile) / Top header (desktop)

### Accessibility
- High contrast ratios
- Keyboard navigation support
- Focus states visible
- ARIA labels on interactive elements
- Screen reader friendly text

### Hover Effects
- `hover:opacity-80` for clickable elements
- `hover:shadow-lg` for cards
- `hover:bg-primary` for buttons
- `hover:scale-105` for images

---

## 🔗 Navigation Flow

```
Auth → Onboarding → Home
                      ↓
        ┌─────────────┼─────────────┐
        ↓             ↓             ↓
     Search        Recipe         Reels
        ↓             ↓             ↓
     Filters       Cart          Products
                     ↓
            Checkout (Shipping)
                     ↓
            Checkout (Payment)
                     ↓
              Order Tracking
                     
Profile → Wallet / Creator / Settings / Notifications
```

---

## 📦 Technology Stack

- **Framework**: React 18+ with TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Components**: Shadcn/ui primitives
- **State**: React Hooks (useState, useEffect)

---

## 🎨 Brand Elements

### Logo
- Text: "Tastepedia" in bold
- Color: Primary orange (#FF6B35)
- Tagline: "Cook Smarter, Eat Better."

### Imagery
- High-quality food photography
- Warm, appetizing tones
- Generous white space
- Hero images with gradient overlays

### Tone of Voice
- Friendly and approachable
- Encouraging and supportive
- Clear and concise
- Culinary terminology when appropriate

---

## ✅ Implementation Checklist

### Phase A (Entry)
- [x] Auth Page
- [x] Onboarding Wizard

### Phase B (Discovery)
- [x] Homepage
- [x] Search & Filter
- [x] Food Reels
- [x] Recipe Detail

### Phase C (Utility)
- [x] AI Meal Planner
- [x] Chat & Support

### Phase D (Commerce)
- [x] Shopping Cart
- [x] Checkout Shipping
- [x] Checkout Payment
- [x] Order Tracking

### Phase E (User)
- [x] Profile Dashboard
- [x] TasteWallet
- [x] Notifications
- [x] Settings

### Phase F (Creator)
- [x] Creator Studio
- [x] 404 Error Page

---

## 🚀 Getting Started

1. **Start the app**: Loads on Authentication page
2. **Sign up/Login**: Create account or use existing credentials
3. **Onboarding**: Complete 3-step personalization
4. **Explore**: Browse recipes, watch reels, plan meals
5. **Shop**: Add ingredients to cart and checkout
6. **Track**: Monitor order delivery in real-time
7. **Manage**: Access profile, wallet, and settings

---

## 📱 Mobile Navigation (Bottom Tab Bar)

| Icon | Page | Color When Active |
|------|------|-------------------|
| 🏠 Home | Homepage | Primary |
| 🔍 Search | Search & Filter | Primary |
| 📹 Reels | Food Reels | Primary |
| 📅 Planner | AI Meal Planner | Primary |
| 👤 Profile | User Profile | Primary |

---

**Tastepedia** - A complete, production-ready FoodTech design system built with React, Tailwind CSS, and modern UX principles.
