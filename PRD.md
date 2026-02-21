# PRD: Subtracker App (MVP)

## 1. Product Overview

**App Name:** Sitch
**Purpose:** A streamlined personal finance web application built to track recurring subscriptions and bills (utilities, entertainment, sports, software, etc.).
**Goal:** Provide users with immediate, clear visibility into their recurring costs, how those costs break down by category and timeframes, and manage their "locked-in" commitments.

---

## 2. Technical Stack & Architecture

* **Frontend Framework:** ReactJS.
* **State Management:** React Context API or standard `useState`.
* **Data Storage:** Browser Local Storage (`localStorage`) for the MVP.

---

## 3. Data Model (JSON Schema)

The `Subscription` object state structure has been updated to support the new features:

| Field | Type | Description | Example |
| --- | --- | --- | --- |
| `id` | String | Unique identifier (e.g., UUID or timestamp) | `"167890234"` |
| `name` | String | User-defined name of the service | `"Orange Fiber"` |
| `cost` | Number | The numerical cost of the subscription | `34.99` |
| `recurrenceType` | String | "Monthly", "Yearly", or "Custom" | `"Custom"` |
| `customRecurrence` | Object | `{ unit: "Weeks" | "Months", value: Number }` |
| `isLockedIn` | Boolean | True if the user cannot cancel before 1 year | `true` |
| `category` | String | Grouping category | `"Telecom"` |
| `country` | String | The country context for the subscription | `"France"` |
| `logoUrl` | String | URL to the brand's logo | `"https://..."` |
| `dateAdded` | Number | Timestamp of creation for sorting | `1708518400000` |

---

## 4. Screen Requirements & Functionality

### A. Home Screen (Dashboard)

* **Global Totals:** Display **Total Cost per Month** and **Total Cost per Year**.
* **Grouping & Sorting:** Group subscriptions by **Category**. Sort items within groups by **Date Added** (newest first).
* **Design & Colors:** Apply distinct, subtle color themes (e.g., background tints or colored borders) to each Category group to visually separate them on the dashboard.
* **Subscription Cards:** Display Name, Cost, Recurrence, Category, and the fetched brand logo.
* **"Locked-In" Indicator:** If `isLockedIn` is true, display a distinct visual indicator (e.g., a small padlock icon or a "Locked" badge) directly on the subscription card.
* **Item Management:** "3-dots" dropdown menu for Edit and Delete (with confirmation prompt).
* **Floating Action:** Prominent "+" button to add a new subscription.

### B. Add / Edit Subscription

* **Country-Based Suggestions:** When opening this screen, display a quick-select grid of the "Top Subscriptions" based on the user's selected country (data fetched via script). Clicking a suggestion pre-fills the Name, Category, and Logo.
* **Form Inputs:**
* **Name & Logo:** Text input (logo auto-populates if matched with the script).
* **Cost:** Numeric input.
* **Recurrence:** * Default toggles: "Monthly" / "Yearly".
* "Show More" button: Expands to show custom recurrence inputs allowing the user to select "Every X Weeks" or "Every X Months" (where X is a number input).


* **Category:** Dropdown menu.
* **Locked-In Status:** A checkbox/toggle asking "Is this subscription locked in? (Cannot cancel for 1 year)". Must include a small "?" info tooltip explaining this.


* **Action:** "Save" button.

### C. Analysis Screen

* **Category Breakdown:** Chart/list showing total cost per category and the **percentage** of overall spend.
* **Recurrence Breakdown:** Visual breakdown of money tied to different recurrence intervals.
* **Math Normalization Rule:** All costs (including custom weekly/monthly intervals) must be mathematically normalized to a strict annual/monthly baseline before calculating percentages.

### D. Settings Screen

* **Currency Selection:** Dropdown for $, €, £, etc.
* **Country Selection:** A dropdown to select the user's country (Starting options: France, Spain).
* **Tooltip:** Include an info tooltip explaining: *"This helps us suggest the most relevant local providers for internet, energy, and phone plans."*



---

Here is the refined Section 5. It clearly explains to the AI that it needs to build a standalone utility script to generate a static data file, rather than trying to fetch this data live when the user is running the app.

You can replace the previous Section 5 in your PRD with this updated version:

---

## 5. Pre-Loaded Data & Utility Fetch Script

To populate the "Quick Select" suggestions on the Add Subscription screen without relying on a live backend database, the app will use a static JSON file (`commonSubscriptions.json`).

**Task for the AI / Developer Agent:**
You must write a standalone, one-time execution utility script (e.g., in Node.js or Python). The developer will run this script once locally to generate the static JSON file that will be bundled with the React app.

**Script Requirements:**

* **Input:** The script should take predefined lists of the most common subscription services for France and Spain (provided below).
* **Action:** For each service, the script needs to structure the data (Name, Category, Country) and ideally use a free API (like Clearbit Logo API `https://logo.clearbit.com/[domain]`) to automatically fetch and append the correct `logoUrl` for each brand.
* **Output:** The script must generate and format a single `commonSubscriptions.json` file containing an array of these objects, which the React app can simply `import` and read from.

**Predefined Subscription Lists to Process:**

* **France (Top Services):**
* *Telecom/Internet:* Orange, Free, Bouygues Telecom, SFR
* *Energy:* EDF, Engie
* *SVOD/Music:* Netflix, Amazon Prime Video, Disney+, Canal+, Spotify, Deezer
* *Transport/Sport:* Navigo, Gymlib


* **Spain (Top Services):**
* *Telecom/Internet:* Movistar, MásOrange, Vodafone, Yoigo, DIGI
* *Energy:* Iberdrola, Endesa, Naturgy
* *SVOD/Music:* Netflix, Amazon Prime Video, Movistar Plus+, Disney+, HBO Max, Spotify
* *Transport/Sport:* Renfe, Gympass (Wellhub)



**Expected JSON Output Format (Example):**

```json
[
  {
    "name": "Netflix",
    "category": "Entertainment",
    "country": "France",
    "logoUrl": "https://logo.clearbit.com/netflix.com"
  },
  {
    "name": "Movistar",
    "category": "Telecom",
    "country": "Spain",
    "logoUrl": "https://logo.clearbit.com/movistar.es"
  }
]

```
