# Tastepedia - Complete User Journey Map

## 🗺️ Visual Journey Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      TASTEPEDIA USER JOURNEY                             │
│                   From Login to Order Tracking                           │
└─────────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════
                        PHASE 1: ENTRY & ONBOARDING
═══════════════════════════════════════════════════════════════════════════

    ┌──────────────────┐
    │  1. AUTH PAGE    │  
    │  ┌──────────┐    │  → User lands here
    │  │  Login   │    │  → Can sign up or login
    │  │ Sign Up  │    │  → Social auth available
    │  └──────────┘    │  → "Become a Creator" option
    └────────┬─────────┘
             │ Click "Sign Up"
             ▼
    ┌──────────────────┐
    │ 2. ONBOARDING    │  
    │  ┌──────────┐    │  → 3-step wizard
    │  │ Step 1/3 │    │  → Select goals
    │  │ Step 2/3 │    │  → Dietary restrictions
    │  │ Step 3/3 │    │  → Favorite cuisines
    │  └──────────┘    │  → Skip option available
    └────────┬─────────┘
             │ Complete Setup
             ▼

═══════════════════════════════════════════════════════════════════════════
                      PHASE 2: DISCOVERY & BROWSING
═══════════════════════════════════════════════════════════════════════════

    ┌─────────────────────────────────────────────────────────────────────┐
    │  3. HOMEPAGE (Hub)                                                  │
    │  ┌──────────────────────────────────────────────────────────────┐  │
    │  │ [Search] [Cart] [Profile]                                     │  │
    │  │                                                                │  │
    │  │  🎯 "Don't know what to cook?"                                │  │
    │  │     [Ask AI Chef] [Shop Ingredients]                          │  │
    │  │                                                                │  │
    │  │  Categories: 🇻🇳 Vietnamese | 🥗 Keto | 🍰 Dessert           │  │
    │  │                                                                │  │
    │  │  Trending Recipes:                                            │  │
    │  │  ┌─────┐  ┌─────┐  ┌─────┐                                   │  │
    │  │  │ 🍜  │  │ 🥗  │  │ 🍝  │  ← Recipe cards                   │  │
    │  │  └─────┘  └─────┘  └─────┘                                   │  │
    │  └──────────────────────────────────────────────────────────────┘  │
    └────┬─────────────────┬─────────────────┬─────────────────┬────────┘
         │                 │                 │                 │
         │ Click Search    │ Click Recipe    │ Click Category  │ Click Profile
         ▼                 ▼                 ▼                 ▼
    ┌─────────┐      ┌─────────┐      ┌─────────┐      ┌─────────┐
    │    4.   │      │    6.   │      │    5.   │      │   10.   │
    │ SEARCH  │      │ RECIPE  │      │ REELS   │      │ PROFILE │
    │ & FILTER│      │ DETAIL  │      │ (Social)│      │ (Later) │
    └────┬────┘      └────┬────┘      └────┬────┘      └─────────┘
         │                │                │
         │                │                │
         └────────────────┴────────────────┘
                          │
                    All lead to Cart

═══════════════════════════════════════════════════════════════════════════
                  PHASE 3: DETAILED EXPLORATION
═══════════════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────────────┐
│  4. SEARCH & FILTER PAGE                                                 │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │ [Search: "Chicken" ✕]                     [Filters 🔽]            │  │
│  │                                                                    │  │
│  │ Sidebar Filters:              Results (18 recipes):               │  │
│  │ • Calories: ▬▬●▬▬ <500       ┌──────┐ ┌──────┐ ┌──────┐         │  │
│  │ • Time: ▬▬●▬▬▬ <30min        │ 🍗  │ │ 🥗  │ │ 🍝  │         │  │
│  │ • Price: ☑ Budget            │ 4.7★ │ │ 4.8★ │ │ 4.6★ │         │  │
│  │          ☑ Medium             └──────┘ └──────┘ └──────┘         │  │
│  │ • Cuisine:                    ┌──────┐ ┌──────┐ ┌──────┐         │  │
│  │   [Italian] [Thai]            │ 🍲  │ │ 🥙  │ │ 🍕  │         │  │
│  │                                └──────┘ └──────┘ └──────┘         │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────┬─────────────────────────────────────────────┘
                             │ Click any recipe
                             ▼

┌──────────────────────────────────────────────────────────────────────────┐
│  6. RECIPE DETAIL & COMMERCE                                             │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │                                                                    │  │
│  │  [▶ Recipe Video]                    ┌─────────────────────────┐  │  │
│  │                                       │ 💳 SHOP THIS RECIPE     │  │  │
│  │  🔥 650 cal | 35g protein            │                         │  │  │
│  │                                       │ ☑ Fish Sauce    $2.50  │  │  │
│  │  Ingredients:                         │ ☑ Vermicelli    $3.00  │  │  │
│  │  ☑ Fish Sauce (100ml)                │ ☑ Pork Belly    $5.00  │  │  │
│  │  ☑ Vermicelli Noodles (500g)         │ ☐ Fresh Herbs   $1.50  │  │  │
│  │  ☑ Grilled Pork Belly (400g)         │                         │  │  │
│  │  ☐ Fresh Herbs (1 bunch)             │ Total: $12.50           │  │  │
│  │                                       │                         │  │  │
│  │  Instructions:                        │ [Add to Cart 🛒]       │  │  │
│  │  1️⃣ Marinate pork belly...           └─────────────────────────┘  │  │
│  │  2️⃣ Grill pork until...                                         │  │  │
│  │  3️⃣ Cook vermicelli...                                          │  │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────┬─────────────────────────────────────────────┘
                             │ Add to Cart
                             ▼

┌──────────────────────────────────────────────────────────────────────────┐
│  5. FOOD REELS (Alternative Discovery)                                   │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │                                                   👤 Chef Minh      │  │
│  │                                                   ❤️ 12.4K          │  │
│  │  [Full Screen Video]                             💬 823            │  │
│  │  🍜 Cooking Scene                                 ⚡ Share          │  │
│  │                                                   🔇 Mute           │  │
│  │                                                                    │  │
│  │  @chefminh: "30-second Pad Thai hack! 🍜"                         │  │
│  │                                                                    │  │
│  │  🛍️ Used in this video:                                           │  │
│  │  • Non-stick Wok Pan $29.99 [View]                                │  │
│  │  • Thai Rice Noodles $4.50 [Add]                                  │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────┬─────────────────────────────────────────────┘
                             │ Add products to cart
                             ▼

┌──────────────────────────────────────────────────────────────────────────┐
│  7. AI MEAL PLANNER (Utility Tool)                                       │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │ Controls:                    Weekly View: Jan 20-26               │  │
│  │ • Daily Cal: ▬▬●▬ 2000      ┌────┬────┬────┬────┬────┬────┬────┐ │  │
│  │ • Budget: ▬●▬▬ $100/wk      │ MON│ TUE│ WED│ THU│ FRI│ SAT│ SUN│ │  │
│  │                              ├────┼────┼────┼────┼────┼────┼────┤ │  │
│  │ [🤖 Generate Plan]           │🍳 │🍳 │🍳 │🍳 │🍳 │🍳 │🍳 │ │  │
│  │ [🛒 Add Week to Cart]        │🥗 │🥗 │🥗 │🥗 │🥗 │🥗 │🥗 │ │  │
│  │                              │🍝 │🍝 │🍝 │🍝 │🍝 │🍝 │🍝 │ │  │
│  │                              └────┴────┴────┴────┴────┴────┴────┘ │  │
│  │                              1,620 cal/day | $87.50/week          │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────┬─────────────────────────────────────────────┘
                             │ Add week to cart
                             ▼

═══════════════════════════════════════════════════════════════════════════
                     PHASE 4: COMMERCE & CHECKOUT
═══════════════════════════════════════════════════════════════════════════

    ┌─────────────────────────────────────────────────────────────────┐
    │  8. SHOPPING CART                                                │
    │  ┌───────────────────────────────────────────────────────────┐  │
    │  │ 🛒 Shopping Cart (6 items)                                │  │
    │  │                                                            │  │
    │  │ 🏷️ Ingredients for Bún Chả Hà Nội:                       │  │
    │  │  • Fish Sauce       $2.50  [- 1 +] [🗑️]                  │  │
    │  │  • Vermicelli       $3.00  [- 2 +] [🗑️]                  │  │
    │  │  • Pork Belly       $5.00  [- 1 +] [🗑️]                  │  │
    │  │                                                            │  │
    │  │ 🏷️ Ingredients for Pasta Carbonara:                      │  │
    │  │  • Pasta            $2.80  [- 1 +] [🗑️]                  │  │
    │  │  • Parmesan         $4.50  [- 1 +] [🗑️]                  │  │
    │  │                                                            │  │
    │  │ 🌟 You might miss these spices:                           │  │
    │  │  ┌──────┐  ┌──────┐  ┌──────┐                           │  │
    │  │  │ 🧂  │  │ ⭐   │  │ 🌶️  │ ← Cross-sell carousel      │  │
    │  │  └──────┘  └──────┘  └──────┘                           │  │
    │  │                                                            │  │
    │  │ ┌─────────────────────────┐                              │  │
    │  │ │ 💰 ORDER SUMMARY        │                              │  │
    │  │ │ Subtotal:      $18.00   │                              │  │
    │  │ │ Shipping:      FREE ✓   │                              │  │
    │  │ │ Total:         $18.00   │                              │  │
    │  │ │                          │                              │  │
    │  │ │ [Proceed to Checkout]   │                              │  │
    │  │ └─────────────────────────┘                              │  │
    │  └───────────────────────────────────────────────────────────┘  │
    └─────────────────────────┬───────────────────────────────────────┘
                              │ Checkout
                              ▼
                    [Payment Processing]
                              │
                              ▼

═══════════════════════════════════════════════════════════════════════════
                      PHASE 5: ORDER TRACKING
═══════════════════════════════════════════════════════════════════════════

    ┌─────────────────────────────────────────────────────────────────┐
    │  9. ORDER TRACKING                                               │
    │  ┌───────────────────────────────────────────────────────────┐  │
    │  │ 📦 Order #TP-2024-0142                                    │  │
    │  │                                                            │  │
    │  │ ┌─────────────────────────────────────────────────────┐  │  │
    │  │ │ 🚚 ARRIVING IN 12 MINS                              │  │  │
    │  │ └─────────────────────────────────────────────────────┘  │  │
    │  │                                                            │  │
    │  │ ┌─────────────────────────────────────────────────────┐  │  │
    │  │ │          🗺️ LIVE MAP                                 │  │  │
    │  │ │                                                       │  │  │
    │  │ │     📍Your Location                                  │  │  │
    │  │ │         ↑                                            │  │  │
    │  │ │         │ (route)                                    │  │  │
    │  │ │         🚗 Driver Location                           │  │  │
    │  │ └─────────────────────────────────────────────────────┘  │  │
    │  │                                                            │  │
    │  │ Status Timeline:                                          │  │
    │  │  ✅ Order Placed        2:30 PM                          │  │
    │  │  ✅ Preparing           2:45 PM                          │  │
    │  │  ✅ Driver Picked Up    3:15 PM                          │  │
    │  │  ⏳ Arriving           Est. 3:42 PM                     │  │
    │  │                                                            │  │
    │  │ ┌─────────────────────────────────────────────────────┐  │  │
    │  │ │ 👤 Your Driver: David Chen                          │  │  │
    │  │ │ ⭐ 4.9 (250+ deliveries)                            │  │  │
    │  │ │ 🚗 Honda Civic • ABC-1234                           │  │  │
    │  │ │ [📞 Call]  [💬 Chat]                                │  │  │
    │  │ └─────────────────────────────────────────────────────┘  │  │
    │  └───────────────────────────────────────────────────────────┘  │
    └────────────────────────┬────────────────────────────────────────┘
                             │ Delivery Complete
                             ▼
                   [Rate & Review Experience]
                             │
                             ▼

═══════════════════════════════════════════════════════════════════════════
                    PHASE 6: POST-PURCHASE & PROFILE
═══════════════════════════════════════════════════════════════════════════

    ┌─────────────────────────────────────────────────────────────────┐
    │  10. USER PROFILE DASHBOARD                                      │
    │  ┌───────────────────────────────────────────────────────────┐  │
    │  │ 👤 Sarah Johnson                     🏆 Master Chef       │  │
    │  │ 156 Recipes Cooked | 1842 Followers                       │  │
    │  │                                                            │  │
    │  │ ┌─────────┬─────────┬─────────┐                          │  │
    │  │ │Cookbook │My Orders│Settings │ ← Tabs                   │  │
    │  │ └─────────┴─────────┴─────────┘                          │  │
    │  │                                                            │  │
    │  │ 🏆 Achievements:                                          │  │
    │  │ ┌────┐ ┌────┐ ┌────┐ ┌────┐                             │  │
    │  │ │🏆  │ │🔥  │ │⭐  │ │💚  │                             │  │
    │  │ └────┘ └────┘ └────┘ └────┘                             │  │
    │  │                                                            │  │
    │  │ ❤️ Saved Recipes (24):                                   │  │
    │  │ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                     │  │
    │  │ │ 🍜  │ │ 🍝  │ │ 🍰  │ │ 🥗  │                     │  │
    │  │ └──────┘ └──────┘ └──────┘ └──────┘                     │  │
    │  │                                                            │  │
    │  │ 📦 Recent Orders:                                         │  │
    │  │  TP-2024-0142  Jan 16  4 items  $19.44  [Re-order]      │  │
    │  │  TP-2024-0138  Jan 12  6 items  $32.50  [Re-order]      │  │
    │  └───────────────────────────────────────────────────────────┘  │
    └─────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════
                         NAVIGATION QUICK LINKS
═══════════════════════════════════════════════════════════════════════════

Mobile Bottom Navigation:
┌──────┬──────┬──────┬──────┬──────┐
│ 🏠   │ 🔍   │ 📹   │ 📅   │ 👤   │
│ Home │Search│Reels │Planner│Profile│
└──────┴──────┴──────┴──────┴──────┘

Desktop Top Header:
┌────────────────────────────────────────────────────────────┐
│ Tastepedia | [Search...] | 🛒 Cart | 🔔 | 👤 Profile      │
└────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════
                          KEY USER PATHS
═══════════════════════════════════════════════════════════════════════════

Path A: Quick Recipe Discovery
Auth → Onboarding → Home → Recipe → Cart → Checkout → Tracking

Path B: Social Discovery
Auth → Onboarding → Home → Reels → Add to Cart → Checkout → Tracking

Path C: Meal Planning
Auth → Onboarding → Home → Planner → Add Week → Cart → Checkout → Tracking

Path D: Search & Filter
Auth → Onboarding → Home → Search → Filter → Recipe → Cart → Checkout → Tracking

═══════════════════════════════════════════════════════════════════════════
                        INTERACTION POINTS
═══════════════════════════════════════════════════════════════════════════

Every page provides multiple navigation options:
✅ Back buttons for navigation history
✅ Bottom/top nav for global navigation
✅ CTAs for primary actions
✅ Quick links for common tasks
✅ Search always accessible
✅ Cart always visible with badge

═══════════════════════════════════════════════════════════════════════════
```

## 🎯 Journey Summary

**Total Pages**: 10 comprehensive pages
**Total Journey Time**: ~5-10 minutes for first complete flow
**Return User Time**: ~2-3 minutes for reorder

### Success Metrics Measured:
- Time from landing to first recipe view
- Cart conversion rate
- Search to purchase ratio
- Meal planner engagement
- Reels to cart conversion
- Profile completion rate
- Reorder frequency

---

**Note**: This journey map represents the ideal user flow. Users can enter at any point and navigate freely between pages using the persistent navigation systems.
