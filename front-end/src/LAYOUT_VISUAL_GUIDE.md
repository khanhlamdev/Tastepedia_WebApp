# Tastepedia - Layout Components Visual Guide

## 📐 COMPLETE LAYOUT STRUCTURE

```
┌────────────────────────────────────────────────────────────────┐
│                         HEADER (Sticky)                        │
│  [🧑‍🍳 Tastepedia]  Home  Recipes  Community  About             │
│                                        🔍  🛒³  [Login/Sign Up] │
└────────────────────────────────────────────────────────────────┘
│
│  ┌──────────────────────────────────────────────────────────┐
│  │                                                          │
│  │                    MAIN CONTENT                          │
│  │                    (flex-1)                              │
│  │                                                          │
│  │  Your page content goes here...                         │
│  │  This area takes all available space                    │
│  │                                                          │
│  └──────────────────────────────────────────────────────────┘
│
┌────────────────────────────────────────────────────────────────┐
│                          FOOTER                                │
│                                                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ Company  │  │  Quick   │  │  Legal   │  │  Social  │      │
│  │   Info   │  │  Links   │  │          │  │ Newsletter│      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│                                                                │
│  © 2024 Tastepedia. All rights reserved.                      │
└────────────────────────────────────────────────────────────────┘
```

---

## 🎨 HEADER - DETAILED BREAKDOWN

### **Desktop View (≥ 768px)**

```
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  [Icon] Tastepedia    Home  Recipes  Community  About             │
│   🧑‍🍳                ────  (hover underline animation)              │
│  Orange Gradient                                                   │
│  Box, rounded-xl               🔍      🛒      [Login / Sign Up]   │
│                              Search   Cart³    Orange Button       │
│                              Ghost    Badge    Rounded Full        │
└────────────────────────────────────────────────────────────────────┘
                    ↑                              ↑
             Sticky (top: 0)              Glassmorphism
             Z-index: 50                  bg-white/95
                                          backdrop-blur-xl
```

### **Mobile View (< 768px)**

```
┌────────────────────────────────────┐
│                                    │
│  [🧑‍🍳]            🔍  🛒³  ☰       │
│  Icon only                Menu     │
│                                    │
└────────────────────────────────────┘
          ↓ (Click hamburger)
┌────────────────────────────────────┐
│  Home                              │
│  Recipes                           │
│  Community                         │
│  About Us                          │
│  ┌──────────────────────────────┐  │
│  │  👤 Login / Sign Up          │  │
│  └──────────────────────────────┘  │
└────────────────────────────────────┘
     Mobile Dropdown Menu
     - Full width
     - Stacked links
     - Orange hover bg
```

---

## 👔 HEADER COMPONENTS

### **1. Logo Section (Left)**

```
┌──────────────────────┐
│  ┌────┐              │
│  │ 🧑‍🍳 │ Tastepedia  │
│  └────┘              │
│  10x10   Text-2xl    │
│  Gradient Bold       │
└──────────────────────┘
    ↑
Gradient: from-[#FF6B35] to-[#ff8a5c]
Rounded: xl
Shadow: md → lg on hover
Scale: 1 → 1.05 on hover
```

### **2. Navigation Links (Center - Desktop)**

```
Home        Recipes      Community      About Us
────        ─────────                   
(active)    (hover)

Style:
- Font: Medium weight
- Color: gray-600 → #FF6B35 (hover)
- Underline: 0% → 100% width (animated)
- Position: Relative
- Underline: Absolute bottom-0
```

### **3. Action Buttons (Right)**

**Search Button:**
```
┌────┐
│ 🔍 │  Ghost button
└────┘  Hover: gray-100 bg
5x5     Rounded: full
```

**Cart Button with Badge:**
```
┌────┐
│ 🛒 │  Ghost button
│  ³ │  Badge (top-right)
└────┘  
     ↑
  Badge:
  - Orange circle (#FF6B35)
  - White text, xs size
  - Border: 2px white
  - Shows "9+" if count > 9
```

**Login Button (Desktop):**
```
┌──────────────────┐
│ 👤 Login/Sign Up │  Orange bg
└──────────────────┘  White text
                      Rounded: full
                      Shadow: md → lg
                      Height: 10 (40px)
```

**Hamburger Menu (Mobile):**
```
☰  (Menu icon)    or    ✕  (X icon)
Not open                 Open

md:hidden (only visible on mobile)
```

---

## 🦶 FOOTER - DETAILED BREAKDOWN

### **Desktop 4-Column Layout**

```
┌──────────────────────────────────────────────────────────────────┐
│                    FOOTER CONTENT AREA                           │
│  Padding: py-12 md:py-16                                         │
│                                                                  │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐    │
│  │ Column 1  │  │ Column 2  │  │ Column 3  │  │ Column 4  │    │
│  │ (3 units) │  │ (3 units) │  │ (3 units) │  │ (3 units) │    │
│  └───────────┘  └───────────┘  └───────────┘  └───────────┘    │
│                                                                  │
│  Gap: lg:gap-12 (48px between columns)                          │
└──────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────┐
│                     BOTTOM BAR (Copyright)                       │
│  bg-white/50, backdrop-blur-sm                                   │
│                                                                  │
│  © 2024 Tastepedia...              Sitemap • Accessibility      │
│  (Left aligned)                    (Right aligned)               │
└──────────────────────────────────────────────────────────────────┘
```

### **Mobile/Tablet Responsive**

**Mobile (< 768px):**
```
┌────────────────┐
│   Column 1     │
│  (Full width)  │
└────────────────┘
┌────────────────┐
│   Column 2     │
│  (Full width)  │
└────────────────┘
┌────────────────┐
│   Column 3     │
│  (Full width)  │
└────────────────┘
┌────────────────┐
│   Column 4     │
│  (Full width)  │
└────────────────┘

Stacked vertically
Gap: 8 units (32px)
```

**Tablet (768px - 1024px):**
```
┌──────────┐  ┌──────────┐
│ Column 1 │  │ Column 2 │
└──────────┘  └──────────┘
┌──────────┐  ┌──────────┐
│ Column 3 │  │ Column 4 │
└──────────┘  └──────────┘

2x2 Grid
md:grid-cols-2
```

---

## 📋 COLUMN 1: COMPANY INFO (Crucial)

```
┌─────────────────────────────────┐
│  [🧑‍🍳] Tastepedia                │
│  Orange Logo (same as header)   │
│                                 │
│  Your ultimate culinary         │
│  companion. Discover recipes... │
│  (Gray-600, small, relaxed)     │
│                                 │
│  ─────────────────────────────  │
│  Contact Us                     │
│  ─────────────────────────────  │
│                                 │
│  📍 Address:                    │
│     123 Culinary Avenue,        │
│     Ho Chi Minh City, Vietnam   │
│                                 │
│  📧 Email:                      │
│     contact@tastepedia.com      │
│     (Clickable mailto: link)    │
│                                 │
│  ☎️ Hotline:                    │
│     +84 909 123 456             │
│     (Clickable tel: link)       │
│     (Bold, emphasize)           │
└─────────────────────────────────┘

Icons: 5x5, Orange color
Labels: Bold, gray-700
Values: Gray-600, hover orange
Gap: 3 units between items
```

---

## 🔗 COLUMN 2: QUICK LINKS

```
┌─────────────────────┐
│  Quick Links        │
│  (Bold, gray-900)   │
│                     │
│  → About Us         │
│  → Careers          │
│  → Partner with Us  │
│  → FAQ              │
│  → Blog             │
│                     │
│  (Arrow animates    │
│   right on hover)   │
└─────────────────────┘

Style:
- Arrow icon: 4x4
- Text: sm, gray-600
- Hover: Orange color
- Arrow translateX on hover
- Gap: 3 units (12px)
```

---

## ⚖️ COLUMN 3: LEGAL

```
┌─────────────────────────┐
│  Legal                  │
│  (Bold, gray-900)       │
│                         │
│  → Terms of Service     │
│  → Privacy Policy       │
│  → Cookie Policy        │
│  → Refund Policy        │
│                         │
│  (Same style as         │
│   Quick Links)          │
└─────────────────────────┘
```

---

## 📱 COLUMN 4: SOCIAL & NEWSLETTER

```
┌─────────────────────────────────────┐
│  Stay Connected                     │
│  (Bold, gray-900)                   │
│                                     │
│  Follow us on social media          │
│  (sm, gray-600)                     │
│                                     │
│  ┌────┐  ┌────┐  ┌────┐            │
│  │ f  │  │ IG │  │ YT │            │
│  └────┘  └────┘  └────┘            │
│  10x10 circular buttons             │
│  White bg → Orange on hover         │
│                                     │
│  ─────────────────────────────      │
│  Newsletter                         │
│  (Semibold, sm)                     │
│                                     │
│  Get weekly recipes and tips!       │
│  (sm, gray-600)                     │
│                                     │
│  ┌──────────────────┐  ┌───┐       │
│  │ Your email...    │  │ ↗ │       │
│  └──────────────────┘  └───┘       │
│  Input (flex-1)        Send btn    │
│  Rounded-full          Orange      │
└─────────────────────────────────────┘

Social Icons:
- Size: 5x5
- Container: 10x10
- Border: 2px gray-200
- Hover: Orange border + bg
- Icons turn white on hover
```

---

## 🎨 COLOR CODING

### **Header:**
```css
/* Logo Gradient */
background: linear-gradient(135deg, #FF6B35 0%, #ff8a5c 100%);

/* Header Background */
background: rgba(255, 255, 255, 0.95);
backdrop-filter: blur(24px);

/* Nav Links */
color: #6B7280;           /* gray-600 */
color (hover): #FF6B35;   /* orange */

/* Cart Badge */
background: #FF6B35;
color: white;
```

### **Footer:**
```css
/* Background Gradient */
background: linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%);

/* Icons */
color: #FF6B35;  /* Orange for contact, social */

/* Text */
color (headings): #111827;      /* gray-900 */
color (labels): #374151;        /* gray-700 */
color (body): #6B7280;          /* gray-600 */
color (hover): #FF6B35;         /* orange */

/* Bottom Bar */
background: rgba(255, 255, 255, 0.5);
backdrop-filter: blur(4px);
```

---

## 📏 SPACING SYSTEM

### **Header:**
```
Container:
├── Max-width: 1280px (max-w-7xl)
├── Padding X: 4-6-8 (responsive)
├── Height: 16 md:20 (64-80px)
└── Gap between items: 2-3 units

Logo:
├── Icon: 10x10 (40px)
├── Text: 2xl (24px)
└── Gap: 2 units (8px)

Nav Links:
├── Gap: 8 units (32px)
└── Font: Medium weight

Action Buttons:
├── Icon size: 5x5 (20px)
├── Padding: 2 units (8px)
└── Gap: 2-3 units (8-12px)
```

### **Footer:**
```
Container:
├── Max-width: 1280px
├── Padding X: 4-6-8
├── Padding Y: 12-16 (48-64px)
└── Gap between columns: 8-12 (32-48px)

Column Spacing:
├── Title margin-bottom: 4 (16px)
├── Item gap: 3 units (12px)
└── Section gap: 6 units (24px)

Icons:
├── Contact icons: 5x5 (20px)
├── Social icons: 5x5 in 10x10 container
├── Arrow icons: 4x4 (16px)
└── Gap between icon and text: 3 units

Bottom Bar:
├── Padding Y: 6 units (24px)
└── Gap (mobile): 4 units (16px)
```

---

## 🎭 ANIMATION TIMELINE

### **Header Animations:**

**Logo Hover:**
```
0ms  → Scale: 1.0, Shadow: md
100ms → Scale: 1.05, Shadow: lg
Duration: 100ms
Easing: ease-out
```

**Nav Link Hover:**
```
Underline animation:
0ms  → Width: 0%, Color: gray-600
200ms → Width: 100%, Color: orange
Duration: 200ms
Easing: ease-in-out
```

**Mobile Menu:**
```
Open:
0ms  → Opacity: 0, Transform: translateY(-10px)
300ms → Opacity: 1, Transform: translateY(0)

Close:
0ms  → Opacity: 1
150ms → Opacity: 0
Duration: 150-300ms
```

### **Footer Animations:**

**Link Hover:**
```
Arrow icon:
0ms  → TranslateX: 0
200ms → TranslateX: 4px
Duration: 200ms

Text color:
0ms  → gray-600
200ms → orange
```

**Social Icon Hover:**
```
0ms  → Border: gray-200, BG: white, Icon: gray-600
300ms → Border: orange, BG: orange, Icon: white
Duration: 300ms
Easing: ease-in-out
```

---

## 📱 RESPONSIVE BREAKPOINTS

### **Header Behavior:**

| Width | Logo | Nav Links | Login Btn | Menu |
|-------|------|-----------|-----------|------|
| < 640px | Icon only | Hidden | Hidden | ☰ |
| 640-768px | Icon only | Hidden | Hidden | ☰ |
| ≥ 768px | Full | Visible | Visible | Hidden |

### **Footer Behavior:**

| Width | Columns | Layout |
|-------|---------|--------|
| < 640px | 1 | Vertical stack |
| 640-1024px | 2 | 2x2 grid |
| ≥ 1024px | 4 | Horizontal row |

---

## 🎯 INTERACTIVE STATES

### **Header:**

**Search Button:**
- Default: Gray icon, transparent bg
- Hover: Gray icon, gray-100 bg
- Active: Gray icon, gray-200 bg

**Cart Button:**
- Default: Gray icon, transparent bg
- Hover: Gray icon, gray-100 bg
- Badge pulse: Subtle animation

**Login Button:**
- Default: Orange bg, white text, shadow-md
- Hover: Darker orange, shadow-lg, scale 102%
- Active: Even darker, shadow-md

### **Footer:**

**Links:**
- Default: Gray text, arrow at 0px
- Hover: Orange text, arrow at 4px
- Active: Orange text, underline

**Social Icons:**
- Default: White bg, gray border, gray icon
- Hover: Orange bg, orange border, white icon
- Active: Darker orange bg

**Newsletter Input:**
- Default: White bg, gray border
- Focus: Orange border, outline ring
- Error: Red border (if validation fails)

---

## ✅ ACCESSIBILITY FEATURES

### **Header:**
- [x] Semantic `<header>` tag
- [x] `<nav>` for navigation
- [x] ARIA labels on icon-only buttons
- [x] Keyboard accessible (tab navigation)
- [x] Focus states visible (outline)
- [x] Mobile menu keyboard accessible

### **Footer:**
- [x] Semantic `<footer>` tag
- [x] Links have meaningful text
- [x] External links: `rel="noopener noreferrer"`
- [x] Phone/email links properly formatted
- [x] Form has accessible labels
- [x] Social icons have aria-label

---

## 📊 COMPONENT HIERARCHY

```
MainLayout
├── Header
│   ├── Logo (ChefHat icon + Text)
│   ├── Navigation (Desktop)
│   │   ├── Home Link
│   │   ├── Recipes Link
│   │   ├── Community Link
│   │   └── About Link
│   ├── Actions
│   │   ├── Search Button
│   │   ├── Cart Button (with Badge)
│   │   ├── Login Button (Desktop)
│   │   └── Hamburger Menu (Mobile)
│   └── Mobile Dropdown (conditional)
│       ├── Nav Links
│       └── Login Button
│
├── Main Content (children)
│   └── Your page content
│
└── Footer
    ├── Column 1: Company Info
    │   ├── Logo
    │   ├── Description
    │   └── Contact Info
    │       ├── Address (MapPin)
    │       ├── Email (Mail)
    │       └── Hotline (Phone)
    ├── Column 2: Quick Links
    │   ├── About Us
    │   ├── Careers
    │   ├── Partner
    │   ├── FAQ
    │   └── Blog
    ├── Column 3: Legal
    │   ├── Terms
    │   ├── Privacy
    │   ├── Cookie
    │   └── Refund
    ├── Column 4: Social & Newsletter
    │   ├── Social Icons
    │   │   ├── Facebook
    │   │   ├── Instagram
    │   │   └── YouTube
    │   └── Newsletter Form
    │       ├── Email Input
    │       └── Send Button
    └── Bottom Bar
        ├── Copyright
        └── Additional Links
```

---

## 🎨 DESIGN TOKENS

### **Typography:**
```css
/* Header */
Logo: text-2xl font-bold (24px, 700)
Nav Links: text-base font-medium (16px, 500)
Button Text: text-sm font-medium (14px, 500)

/* Footer */
Section Headings: font-semibold (600)
Links: text-sm (14px)
Contact Labels: font-medium (500)
Copyright: text-sm (14px)
```

### **Shadows:**
```css
/* Header */
Logo: shadow-md → shadow-lg
Login Button: shadow-md → shadow-lg
Header: shadow-sm

/* Footer */
No shadows (flat design)
```

### **Border Radius:**
```css
/* Header */
Logo Box: rounded-xl (12px)
Buttons: rounded-full (9999px)
Mobile Menu Items: rounded-xl

/* Footer */
Social Buttons: rounded-full
Newsletter Input: rounded-full
Newsletter Button: rounded-full
```

---

**VISUAL GUIDE COMPLETE** ✅

This comprehensive visual guide provides pixel-perfect reference for implementing the Header, Footer, and MainLayout components! 🎨
