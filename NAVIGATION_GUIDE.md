# 🗺️ SmartShelf Frontend - Visual Navigation Guide

## App Structure

```
SmartShelf Frontend
├── Public Pages (No Login Required)
│   ├── 🔐 Login          (/)
│   ├── 📝 Signup         (/signup)
│   └── 🔑 Forgot Password (/forgot-password)
│
└── Dashboard Pages (Login Required + DashboardLayout)
    ├── 📊 Dashboard           (/dashboard)
    ├── 📦 Items               (/items)
    ├── ➕ Add Item            (/add-item)
    ├── ✏️  Edit Item          (/edit-item/:id)
    ├── 📋 Activity Log        (/activity)
    ├── 📈 Analytics           (/analytics)
    ├── 📂 Categories          (/categories)
    └── 🤖 ChatBot            (Floating Widget - All pages)
```

---

## Feature Map

### 1️⃣ Authentication Module
```
Login Page (/)
    ↓ Email & Password
    ↓ "Forgot Password?" link → Forgot Password Page
    ↓ "Sign up" link → Signup Page
    
Signup Page (/signup)
    ↓ Create Account
    → Redirect to Login
    
Forgot Password Page (/forgot-password)
    ↓ Step 1: Enter Email
    ↓ Step 2: Enter OTP (from console)
    ↓ Step 3: Create New Password
    → Redirect to Login
```

### 2️⃣ Main Dashboard
```
Dashboard (/dashboard)
    ├── 📊 Statistics Cards
    │   ├── Total Items
    │   ├── Categories
    │   ├── Expiring Soon (3 days)
    │   └── Low Stock Items
    │
    ├── 🚨 Alerts Section
    │   ├── 🔴 CRITICAL: Expiring TODAY (Red, animated)
    │   ├── ⚠️  WARNING: Expiring Within 3 Days (Orange)
    │   └── 🚨 GENERAL: Expired + Low Stock
    │
    ├── 📝 Recently Added Items
    │   └── Quick view with edit/delete
    │
    └── 🎯 Quick Actions
        ├── ➕ Add New Item
        ├── 📦 View All Items
        ├── 📊 View Analytics
        └── 📋 View Activity
```

### 3️⃣ Items Management
```
Items Page (/items)
    ├── 🔍 Search Bar
    │   └── Real-time search by name
    │
    ├── 📂 Category Filter
    │   └── Filter by selected category
    │
    ├── 💾 Import/Export
    │   ├── 📥 Import CSV
    │   └── 📤 Export CSV
    │
    ├── Desktop View (table)
    │   ├── 📌 Name
    │   ├── 📊 Qty
    │   ├── 📂 Category
    │   ├── 📅 Added
    │   ├── ⏰ Expiry
    │   ├── 📝 Notes
    │   └── ⚙️  Actions (Edit/Delete)
    │
    └── Mobile View (cards)
        ├── Item Name + Category Badge
        ├── Quantity + Added Date + Expiry
        ├── 📝 Notes (if exists)
        └── Edit/Delete buttons
```

### 4️⃣ Add Item
```
Add Item (/add-item)
    ├── 📝 Item Name (Required)
    │   └── Placeholder: "e.g., Milk, Rice, Soap..."
    │
    ├── 📊 Quantity (Required)
    │   └── Placeholder: "e.g., 5, 10 kg, 2 liters..."
    │
    ├── 📂 Category (Required)
    │   └── Dropdown: 8 default categories + custom ones
    │
    ├── 📅 Expiry Date (Required)
    │   └── Date picker
    │
    ├── 📝 Notes (Optional)
    │   └── Textarea: "e.g., Store in fridge..."
    │
    └── ✅ Add Item to Shelf
        → Logs activity → Redirect to Items
```

### 5️⃣ Edit Item
```
Edit Item (/edit-item/:id)
    ├── 📝 Item Name (Editable)
    ├── 📊 Quantity (Editable)
    ├── 📂 Category (Editable)
    ├── 📅 Expiry Date (Editable - NEW!)
    ├── 📝 Notes (Editable - NEW!)
    │
    └── Buttons:
        ├── 💾 Save Changes
        └── ❌ Cancel
```

### 6️⃣ Analytics
```
Analytics (/analytics)
    ├── 📊 Charts Section
    │   ├── Bar Chart: Items by Category
    │   ├── Pie Charts: 
    │   │   ├── Low Stock Status
    │   │   └── Expired vs Active
    │   └── Line Chart: Items Added Over Time
    │
    ├── ⏱️  Timeframe Filter
    │   ├── Last 7 days
    │   ├── Last 30 days
    │   └── All time
    │
    ├── 📅 Granularity Options (for Line Chart)
    │   ├── Daily
    │   ├── Weekly
    │   └── Monthly
    │
    ├── 📥 Export Options
    │   ├── Download as PNG
    │   └── Download as PDF
    │
    └── 💾 Recent Exports
        └── Activity log of exports
```

### 7️⃣ Activity Log
```
Activity (/activity)
    ├── 🔍 Search Bar
    │   └── Search by action/item name
    │
    ├── 🕐 Time Filter
    │   ├── All Time
    │   ├── Today
    │   └── This Week
    │
    ├── 🔀 Sort Options
    │   ├── Newest First
    │   ├── Oldest First
    │   ├── By Action
    │   └── By Item Name
    │
    ├── 📋 Activity List
    │   ├── Timestamp
    │   ├── Action (Added/Updated/Deleted/etc)
    │   ├── Item Name
    │   └── Date
    │
    ├── 🗑️  Clear All Logs
    │   └── Confirmation required
    │
    └── 📊 Statistics
        ├── Total actions
        ├── Today's actions
        └── Most common action
```

### 8️⃣ Category Management
```
Categories (/categories)
    ├── ➕ Add New Category
    │   ├── Category Name (text input)
    │   ├── 🎨 Color Picker
    │   ├── Color Preview
    │   └── Add Button
    │
    ├── 📋 Your Categories List (Grid View)
    │   └── For each category:
    │       ├── Color Circle
    │       ├── Category Name
    │       ├── ✏️  Edit Button
    │       │   ├── Inline edit name
    │       │   ├── Change color
    │       │   ├── Save/Cancel
    │       │   └── All items using this category updated
    │       │
    │       └── 🗑️  Delete Button
    │           └── Items using this category → "Other"
    │
    ├── 📊 Stats
    │   └── Total categories count
    │
    └── 🔄 Reset to Defaults
        └── 8 default categories with original colors
```

### 9️⃣ Notifications & Alerts
```
Real-Time Notifications
    ├── 🔔 Sidebar Badge
    │   ├── Shows on Dashboard link
    │   ├── Displays high-priority count
    │   └── Red background
    │
    ├── 🚨 Dashboard Alerts
    │   ├── 🔴 CRITICAL (Red banner, animated pulsing)
    │   │   └── Items expiring TODAY
    │   │
    │   ├── ⚠️  WARNING (Orange banner)
    │   │   └── Items expiring within 3 days
    │   │
    │   └── 🚨 GENERAL (Yellow banner)
    │       ├── Expired items
    │       └── Low stock items
    │
    └── 📊 Item Status Colors
        ├── 🟢 Green: Good (30+ days)
        ├── 🟡 Yellow: Caution (7-29 days)
        ├── 🟠 Orange: Warning (3-6 days)
        └── 🔴 Red: Expired (< 0 days)
```

### 🔟 AI Chatbot
```
ChatBot Widget (Global - All Pages)
    ├── 💬 Floating Button (Bottom Right)
    │   ├── Pulsing animation
    │   ├── Shows ✕ when open
    │   └── Shows 💬 when closed
    │
    ├── 📱 Chat Window (When Open)
    │   ├── Header: "SmartShelf AI 🤖"
    │   │
    │   ├── Messages Area
    │   │   ├── 🟦 User messages (right, blue)
    │   │   ├── ⬜ Bot messages (left, gray)
    │   │   ├── Loading animation (3 bouncing dots)
    │   │   └── Auto-scroll to latest
    │   │
    │   ├── Input Area
    │   │   ├── Textarea (supports multi-line)
    │   │   ├── Send button (➤)
    │   │   ├── Hint text
    │   │   └── Enter key to send
    │   │
    │   └── Smart Responses For:
    │       ├── Greetings (hi, hello, hey)
    │       ├── Storage tips
    │       ├── Expiry management
    │       ├── Consumption guidelines
    │       ├── Usage instructions
    │       ├── Waste reduction
    │       └── General help
    │
    └── Conversation Flow
        ├── User: "Hello"
        ├── Bot: "Hi! I'm SmartShelf AI..."
        ├── User: "How to store items?"
        ├── Bot: "Storage tips..."
        └── Continue...
```

---

## Navigation Flow Diagram

```
┌─────────────┐
│   START     │
│  (Login)    │
└──────┬──────┘
       │
       ├─── No Account ─── Signup ─┐
       │                            │
       └─── Have Account            │
            │                       │
            ├─── "Forgot Password"─ Forgot Password
            │         │             │
            │    └────┴─────────────┘
            │         │
            └─────→ Login Success
                     │
                ┌────────────────────┬──────────────────┬────────────────┬──────────────┬─────────────┐
                │                    │                  │                │              │             │
           Dashboard            Items Page          Add Item         Analytics    Activity Log  Categories
                │                   │                   │                │              │             │
                ├── View Stats      ├── Search         ├── Fill Form     ├── View       ├── Filter   ├── Add
                ├── View Alerts     ├── Filter         └── Add Item      │  Charts      │  Actions   ├── Edit
                ├── Quick Actions   ├── Sort                             ├── Export     └── Sort     ├── Delete
                └── Notifications   ├── Import/Export                    └── Filter                 └── Reset
                                    ├── Edit Item (→ Edit Page)
                                    └── Delete Item
                                         │
                                         └─ Edit Item Page
                                            ├── Edit Details (+ Notes & Expiry)
                                            ├── Update Item
                                            └── Back to Items
                
                    🤖 ChatBot Widget (Available on all pages)
                    ├── Open/Close with button
                    ├── Send messages
                    └── Get AI responses
```

---

## User Journey Examples

### Example 1: Add Item with Notes
```
Dashboard → "Add Item" button
    ↓
Add Item Page
    ├── Item Name: "Milk"
    ├── Quantity: "1 liter"
    ├── Category: "Beverages"
    ├── Expiry: "2025-11-24"
    ├── Notes: "Store in fridge, use within 5 days"
    └── Submit
        ↓
Items Page (shows new item with note visible)
```

### Example 2: Manage Categories
```
Dashboard → Sidebar → Categories
    ↓
Categories Page
    ├── Add "Dairy" with Blue color
    ├── Items → Add Item → Select "Dairy" (now available!)
    ├── Categories → Edit "Dairy" → Change to Red
    ├── All items with "Dairy" category auto-updated
    ├── Categories → Delete "Dairy"
    ├── Items in "Dairy" default to "Other"
    └── Categories → Reset → Back to 8 defaults
```

### Example 3: Reset Forgotten Password
```
Login Page
    ↓
"Forgot Password?" link
    ↓
Forgot Password Page
    ├── Step 1: Enter "user@email.com"
    ├── Browser Console shows: "Mock OTP: 123456"
    ├── Step 2: Enter "123456"
    ├── Step 3: Enter new password
    ├── Submit
    │   ↓
    └─→ Redirected to Login (2s delay)
        ↓
    Use new password to login
```

### Example 4: Use ChatBot
```
Any Dashboard Page
    ↓
Click 💬 (floating button)
    ↓
ChatBot Opens
    ├── User: "How to store vegetables?"
    ├── Bot: "[Storage tips response]"
    ├── User: "When will my items expire?"
    ├── Bot: "[Expiry management advice]"
    ├── Continue conversation...
    └── Click ✕ to close
```

---

## Mobile Responsiveness

### Breakpoints:
- **Mobile:** < 640px (Tailwind: sm)
- **Tablet:** 640px - 1024px (Tailwind: md)
- **Desktop:** > 1024px (Tailwind: lg)

### Adjustments:
```
Mobile (sm):
├── Single column layouts
├── Hamburger menu (sidebar collapses)
├── Card view for items (instead of table)
├── Stacked forms
├── Smaller chat window
└── Smaller buttons & spacing

Desktop (lg):
├── Multi-column layouts
├── Sidebar visible
├── Table view for items
├── Side-by-side forms
├── Full-size chat window
└── Larger spacing & buttons
```

---

## Dark Mode

Dark mode is available **on all pages** and toggled from:
1. **Top-right corner** (Dark/Light toggle)
2. **Sidebar** color theme button
3. **Persistent** (saved in localStorage)

Color schemes update automatically across:
- Backgrounds (light white ↔ dark gray)
- Text (dark gray ↔ light white)
- Cards (white ↔ dark gray-800)
- Inputs (light ↔ dark backgrounds)
- Charts (light ↔ dark borders)
- ChatBot (light ↔ dark theme)

---

## Keyboard Shortcuts & Tips

### Global:
- **Tab** → Navigate between elements
- **Enter** → Submit forms / Send chat messages
- **Escape** → Close chat (when implemented)

### Forms:
- **Shift + Enter** → New line in textarea
- **Enter** (alone) → Submit form

### Chat:
- **Enter** → Send message
- **Shift + Enter** → New line in chat input

---

## Status Indicators

### Item Status (Color-coded):
- 🟢 **Green** → Good (30+ days to expiry)
- 🟡 **Yellow** → Caution (7-29 days)
- 🟠 **Orange** → Warning (3-6 days)
- 🔴 **Red** → Expired (< 0 days)

### UI Indicators:
- ✅ **Success** (Green alert/toast)
- ❌ **Error** (Red alert/toast)
- ⚠️ **Warning** (Orange alert)
- ℹ️ **Info** (Blue alert)

### Loading States:
- 🔄 **Spinner** → Loading data
- ● ● ● → Loading in chat
- ⏳ → Waiting for input

---

## Quick Reference

### Default Categories:
1. 🍎 Food (Red)
2. 🛒 Grocery (Orange)
3. 🏠 Household (Purple)
4. 🥤 Beverages (Blue)
5. 🍿 Snacks (Pink)
6. 🧴 Personal Care (Green)
7. 🧹 Cleaning (Cyan)
8. 📦 Other (Gray)

### Common Actions:
- Add Item: `/add-item`
- View All Items: `/items`
- Analytics: `/analytics`
- Activity Log: `/activity`
- Manage Categories: `/categories`
- Settings: (Coming soon)

---

*This guide is current as of November 17, 2025*
*Version: 1.0 - Phase 1 Complete*
