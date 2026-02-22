**App Purpose:** A straightforward subscription and bill tracker (phones, sports, entertainment, etc.) focused on clear cost visibility.

**Functional Requirements by Screen:**

**1. Home Screen (Dashboard)**

- **Cost Aggregation:** Automatically calculate and prominently display the user's total expenses in two ways: **Total Per Month** and **Total Per Year**.
    
- **Subscription List:** Display a list of all active tracked expenses. Each item in the list must show:
    
    - Name (e.g., Netflix, Gym)
        
    - Cost
        
    - Recurrence (Monthly or Yearly)
        
    - Category
        

**2. "Add Subscription" Action**

- A simple input form to log a new expense.
    
- **Required Data Fields:**
    
    - Name (Text input with autocomplete suggestions)
        
    - Cost (Numeric input)
        
    - Recurrence (Selector: Monthly, Yearly, or Custom interval)
        
    - Category (Selector: Entertainment, Utilities, Sport, etc.)
        
    - Locked-in commitment (Toggle: indicates 1-year minimum contract)
        
    - Notes (Optional text area)
        

- **Smart Defaults:**
    
    - When "Yearly" billing cycle is selected, the "Locked-in commitment" toggle is **automatically checked by default** (users can still manually uncheck if the subscription allows mid-year cancellation)
        
    - This applies when adding new subscriptions and when switching from Monthly to Yearly on existing subscriptions
        

**3. Settings**

- **Global Currency:** A setting allowing the user to select their preferred currency (e.g., $, €, £). This selection must universally update the currency symbol displayed on the Home Screen and the Add form.

- **Number Formatting:** Choose digit grouping separator (space or comma) for displaying large numbers.

- **Theme:** Toggle between light and dark mode.

- **Profile:** Edit user name displayed in the app.

**4. Analysis Screen**

- **Category Breakdown:** Visual breakdown of spending by category with:
    
    - Horizontal bar chart showing relative spending per category
        
    - Subscription count badge for each category (e.g., "Entertainment • 5 subs")
        
    - Total monthly and yearly costs per category
        

**5. PWA (Progressive Web App) Features**

SubTracker is designed as a Progressive Web App to provide a native app-like experience on mobile and desktop devices.

**5.1. Installation & Home Screen**

- **Install Prompt:**
    
    - On first visit, if the device supports PWA installation (Chrome, Safari, Edge), users will see an "Install SubTracker" prompt inviting them to add the app to their home screen
        
    - Prompt appears immediately when the browser's install criteria are met
        
    - Prompt includes:
        
        - App icon and "Install SubTracker" heading
            
        - Description: "Add to your home screen for quick access and offline use"
            
        - Two action buttons: "Maybe Later" and "Install App"
            
    - **Dismissal Behavior:**
        
        - If user clicks "Maybe Later", the prompt is permanently dismissed and will never appear again (respects user choice)
            
        - If user clicks "Install App", the browser's native installation dialog appears
            
        - After successful installation, the prompt never appears again
            
        - Dismissal preference is stored locally and persists across sessions
            

- **Installed Experience:**
    
    - App opens in standalone mode (no browser UI)
        
    - Custom app icon on home screen
        
    - Splash screen with app branding
        
    - Portrait orientation optimized for mobile use
        

**5.2. Updates & Notifications**

- **Update Detection:**
    
    - When the app is opened/reloaded, it automatically checks for new versions
        
    - Uses network-first caching strategy: always fetches fresh content when online, falls back to cache when offline
            
- **Update Notification:**
    
    - When a new version is available, a notification banner appears at the bottom of the screen (above mobile navigation)
        
    - Banner includes:
        
        - System update icon
            
        - "Update Available" heading
            
        - Description: "A new version of SubTracker is ready"
            
        - Two action buttons: "Later" and "Update"
            
    - Clicking "Later" dismisses the notification (will reappear next time app is opened if update is still available)
        
    - Clicking "Update" reloads the page with the latest version
        
    - Update notification persists until user takes action
        

**5.3. Offline Capability**

- **Cached Content:**
    
    - App shell (HTML, CSS, JavaScript) is cached for offline access
        
    - Previously viewed content remains accessible without internet connection
        
    - All data is stored locally in browser localStorage (no backend required)
        

- **Network Strategy:**
    
    - Network-first: Attempts to fetch fresh content from network
        
    - Cache fallback: If network is unavailable, serves cached version
        
    - Graceful degradation: Shows appropriate error messages for unavailable resources
        

- **Cache Management:**
    
    - Old cache versions are automatically cleaned up when new versions are activated
        
    - Runtime cache stores recently accessed resources
        
    - Cache versioning ensures users always get the latest content when online
        

**5.4. PWA Installation Criteria**

For the install prompt to appear, the following criteria must be met (enforced by browsers):

- App served over HTTPS (or localhost for development)
    
- Valid web app manifest with required fields (name, icons, start_url)
    
- Service worker registered and active
    
- User has not previously dismissed the install prompt
    
- User has engaged with the site (Chrome: at least 30 seconds of browsing)
    

**Technical Architecture:**

- **Frontend:** React 18 with Vite 4 bundler
    
- **Styling:** Tailwind CSS 3 with class-based dark mode
    
- **Icons:** Google Material Symbols Outlined (CDN)
    
- **Font:** Manrope (Google Fonts CDN)
    
- **State Management:** React Context API (no external libraries)
    
- **Data Persistence:** Browser localStorage (keys: `subtracker_subs`, `subtracker_currency`, `subtracker_install_dismissed`)
    
- **Routing:** Client-side screen switching via React state (no router library)
    
- **Service Worker:** Custom PWA service worker with network-first caching strategy
    
- **Build:** Static site deployed to GitHub Pages (`/subtracker/` base path)
