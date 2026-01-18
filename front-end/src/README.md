# Tastepedia - Complete FoodTech Web Application

> **Design Philosophy**: "Appetizing, Trustworthy, Seamless, Mobile-First"

A comprehensive, production-ready FoodTech web application built with React JS, Tailwind CSS, Shadcn UI, and Lucide Icons.

---

## 🎨 Design System

### Color Palette
- **Primary**: `#FF6B35` (Sunset Orange) - CTAs, Actions, Prices
- **Secondary**: `#4CAF50` (Fresh Basil) - Health Tags, Success States
- **Background**: `#F9FAFB` (Cool Gray 50)
- **Surface**: `#FFFFFF` (White)
- **Text Primary**: `#111827` (Gray 900)
- **Text Secondary**: `#6B7280` (Gray 500)

### Typography
- **Font Family**: Inter / Plus Jakarta Sans
- **Headings**: Bold, tight tracking
- **Body**: Medium weight, 1.5 line-height

---

## 📱 Application Structure (18 Pages)

### Phase A: Entry & Onboarding
1. ✅ **Authentication Page** - Login/Register with social auth
2. ✅ **Onboarding Wizard** - 3-step preference setup

### Phase B: Discovery (The Core)
3. ✅ **Homepage** - Recipe discovery hub with AI Chef
4. ✅ **Search & Filter** - Advanced recipe search
5. ✅ **Food Reels** - TikTok-style video feed
6. ✅ **Recipe Detail** - Comprehensive recipe view + shopping

### Phase C: Utility & AI
7. ✅ **AI Meal Planner** - Weekly meal planning
8. ✅ **Chat & Support** - Customer support and messaging

### Phase D: Commerce
9. ✅ **Shopping Cart** - Cart management with cross-sell
10. ✅ **Checkout - Shipping** - Delivery details and scheduling
11. ✅ **Checkout - Payment** - Multiple payment methods
12. ✅ **Order Tracking** - Live delivery tracking

### Phase E: User Ecosystem
13. ✅ **User Profile** - Personal dashboard
14. ✅ **TasteWallet** - Digital wallet and rewards
15. ✅ **Notifications** - Centralized notification center
16. ✅ **Settings** - App configuration

### Phase F: Creator & System
17. ✅ **Creator Studio** - Content creator dashboard
18. ✅ **404 Error Page** - Friendly error handling

---

## 🛠️ Technology Stack

- **Framework**: React 18+ with TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Components**: Shadcn/ui
- **State Management**: React Hooks

---

## 🚀 Features

### Core Features
- ✅ User authentication with social login
- ✅ Personalized onboarding flow
- ✅ AI-powered recipe recommendations
- ✅ Advanced search and filtering
- ✅ Social video feed (Reels)
- ✅ Weekly meal planning with AI
- ✅ Integrated e-commerce
- ✅ Real-time order tracking
- ✅ Digital wallet and rewards system
- ✅ Creator tools and analytics

### UI/UX Features
- ✅ Mobile-first responsive design
- ✅ Skeleton loading states
- ✅ Smooth transitions and animations
- ✅ Glassmorphism effects
- ✅ Interactive hover states
- ✅ Empty state illustrations
- ✅ Form validation
- ✅ Progress indicators

### Accessibility
- ✅ High contrast ratios
- ✅ Keyboard navigation
- ✅ ARIA labels
- ✅ Screen reader support
- ✅ Focus states

---

## 📂 Project Structure

```
/
├── App.tsx                          # Main router
├── styles/
│   └── globals.css                  # Global styles + design tokens
├── components/
│   ├── AuthPage.tsx                 # Page 1
│   ├── OnboardingPage.tsx           # Page 2
│   ├── HomePage.tsx                 # Page 3
│   ├── SearchPage.tsx               # Page 4
│   ├── ReelsPage.tsx                # Page 5
│   ├── RecipeDetailPage.tsx         # Page 6
│   ├── MealPlannerPage.tsx          # Page 7
│   ├── ChatSupportPage.tsx          # Page 8
│   ├── CartPage.tsx                 # Page 9
│   ├── CheckoutShippingPage.tsx     # Page 10
│   ├── CheckoutPaymentPage.tsx      # Page 11
│   ├── OrderTrackingPage.tsx        # Page 12
│   ├── ProfilePage.tsx              # Page 13
│   ├── TasteWalletPage.tsx          # Page 14
│   ├── NotificationsPage.tsx        # Page 15
│   ├── SettingsPage.tsx             # Page 16
│   ├── CreatorStudioPage.tsx        # Page 17
│   ├── NotFoundPage.tsx             # Page 18
│   ├── MobileNavigation.tsx         # Shared navigation
│   └── ui/                          # Shadcn UI components
└── documentation/
    ├── DESIGN_SYSTEM_GUIDE.md       # Complete design system docs
    └── README.md                    # This file
```

---

## 🎯 User Journey

```
Login → Onboarding → Home → Search/Browse → Recipe Details
                                ↓
                            Add to Cart
                                ↓
                        Checkout (Shipping)
                                ↓
                        Checkout (Payment)
                                ↓
                          Order Tracking
                                ↓
                         Order Complete
```

---

## 🎨 Design Patterns

### Cards
- Border radius: `rounded-xl` (16px)
- Shadow: `shadow-sm`, hover: `shadow-md`
- Background: `#FFFFFF`

### Buttons
- Primary: `rounded-full` with `bg-primary`
- Secondary: `rounded-full` with `border`
- Loading state: Spinner animation

### Inputs
- Border radius: `rounded-lg`
- Focus: Ring state with primary color
- Error: Red border + message below

### Navigation
- **Mobile**: Bottom tab bar (5 items)
- **Desktop**: Top sticky header
- Active state: Primary color

---

## 📱 Responsive Design

### Breakpoints
- Mobile: `< 768px`
- Tablet: `768px - 1024px`
- Desktop: `> 1024px`

### Adaptive Features
| Feature | Mobile | Desktop |
|---------|--------|---------|
| Navigation | Bottom tabs | Top header |
| Filters | Sheet drawer | Sidebar |
| Recipe Detail | Stacked | 2-column |
| Cart Summary | Inline | Sticky sidebar |

---

## 🔐 Authentication Flow

1. User lands on Auth page
2. Choose Login or Sign Up
3. Social login or email/password
4. Optional: "Become a Creator"
5. Redirect to Onboarding

---

## 🛒 Commerce Flow

1. Browse recipes or reels
2. Click "Shop Ingredients"
3. Add items to cart
4. View cart and modify quantities
5. Enter shipping details
6. Select payment method
7. Place order
8. Track delivery in real-time

---

## 🎓 Creator Flow

1. Enable "Become a Creator" during signup
2. Access Creator Studio from profile
3. View analytics (views, earnings, likes)
4. Upload new recipes/reels
5. Manage existing content
6. Track earnings and insights

---

## 💡 Key Innovations

### AI Integration
- **AI Chef**: Recipe recommendations based on available ingredients
- **Meal Planner**: AI-generated weekly meal plans
- **Smart Search**: Intelligent recipe matching

### Social Features
- **Food Reels**: Short-form video content
- **Follow System**: Connect with creators
- **Reviews & Ratings**: Community feedback

### Commerce Integration
- **In-Recipe Shopping**: Buy while browsing
- **Grouped Cart**: Items organized by recipe
- **Smart Cross-Sell**: Relevant product suggestions
- **Real-Time Tracking**: Live order updates

### Gamification
- **TastePoints**: Reward system
- **Achievement Badges**: Milestone rewards
- **Creator Levels**: Progression system

---

## 🎬 Animation & Transitions

- Page transitions: `300ms` ease-in-out
- Hover effects: `200ms` scale or opacity
- Loading states: Skeleton pulses
- Success states: Checkmark animations

---

## 🧪 Testing Considerations

- Form validation on all inputs
- Error handling for failed API calls
- Loading states for async operations
- Empty states for zero data
- Mobile touch targets (min 44px)

---

## 📈 Performance Optimizations

- Lazy loading for images
- Code splitting by route
- Optimized bundle size
- Minimal re-renders
- CSS-in-JS avoided

---

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Safari (iOS 12+)
- Chrome Mobile (Android 8+)

---

## 📊 Analytics Events (Suggested)

- `page_view` - Track page visits
- `recipe_view` - Recipe detail views
- `add_to_cart` - Cart additions
- `purchase` - Order completions
- `search` - Search queries
- `reel_view` - Reel impressions
- `creator_upload` - Content uploads

---

## 🔮 Future Enhancements

### Phase 2
- [ ] Live video cooking classes
- [ ] Voice-guided cooking mode
- [ ] AR ingredient recognition
- [ ] Nutrition tracking dashboard
- [ ] Community recipe submissions

### Phase 3
- [ ] Multi-language support
- [ ] Currency localization
- [ ] Regional recipe variations
- [ ] Grocery store integrations
- [ ] Smart kitchen device sync

### Phase 4
- [ ] Subscription meal kits
- [ ] Restaurant partnerships
- [ ] Cooking competitions
- [ ] NFT recipe ownership
- [ ] Blockchain rewards

---

## 🤝 Contributing

This is a design system and UI implementation. To extend:

1. Follow existing component patterns
2. Use design tokens from `globals.css`
3. Maintain mobile-first approach
4. Add loading and empty states
5. Ensure accessibility standards

---

## 📄 License

All rights reserved. This is a proprietary design system for Tastepedia.

---

## 👥 Credits

- **Design System**: Modern FoodTech UI/UX patterns
- **Icons**: Lucide React
- **Components**: Shadcn/ui
- **Images**: Unsplash (for prototyping)

---

## 📞 Support

For questions about this design system:
- 📖 Read: `DESIGN_SYSTEM_GUIDE.md`
- 🎨 Reference: Color palette and tokens in `globals.css`
- 🧩 Components: All pages in `/components`

---

**Built with ❤️ for the modern food enthusiast.**

**Tastepedia - Cook Smarter, Eat Better! 🍽️**
