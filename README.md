
---

# Auto Tabs Organizer

**Auto Tabs Organizer** is a Firefox WebExtension that **analyzes open tabs, clusters them using semantic similarity, previews the resulting tab groups, and applies them on user confirmation**.
No rules, no keywords, no manual dragging — grouping is inferred automatically.

---

## Core Features

* **Semantic tab clustering**

  * Uses embeddings + k-means to group tabs by meaning, not URL patterns.
* **Preview before apply**

  * Users see exactly how tabs will be grouped before committing.
* **Automatic group naming**

  * Human-readable names inferred from tab content.
* **Deterministic grouping**

  * Stable group IDs ensure preview ↔ apply consistency.
* **Distinct group colors**

  * Each group is assigned a deterministic, recognizable color.
* **Zero persistence**

  * No tab data is stored or transmitted.

---

## Architecture Overview

```
Popup (UI)
  ↓
Background Script
  ↓
Planner (analysis)
  ↓
ML + Logic
  ↓
Applier (execution)
```

---

## Project Structure

```
src/
├── background/
│   ├── background.ts   # Message router (PLAN / APPLY)
│   ├── planner.ts      # Tab analysis & grouping logic
│   └── applier.ts      # Applies tab groups to Firefox
│
├── logic/
│   ├── naming.ts       # Group name generation
│   ├── colors.ts       # Deterministic color selection
│   └── scoring.ts     # (Extensible) heuristics / weighting
│
├── ml/
│   ├── embedder.ts     # Text → vector embeddings
│   └── cluster.ts     # k-means clustering
│
├── popup/
│   ├── popup.html      # UI
│   ├── popup.css       # Styling
│   └── popup.ts        # Preview + user actions
│
├── options/            # (Future) configuration UI
│
└── types/
    ├── plan.ts         # OrganizePlan / TabGroupPlan
    ├── tabs.ts         # TabInfo
    └── browser.d.ts    # Firefox typings
```

---

## How It Works

### 1. Tab Collection

* Queries current window tabs
* Filters out:

  * pinned
  * audible
  * non-HTTP(S)
  * extension/internal URLs

### 2. Semantic Embedding

* Each tab is embedded using:

  ```
  "<title> <url>"
  ```

### 3. Clustering

* Number of clusters:

  ```
  k ≈ √N
  ```
* k-means assigns each tab to a cluster

### 4. Group Generation

For each cluster:

* Generate name (`logic/naming.ts`)
* Pick color (`logic/colors.ts`)
* Generate stable group ID (hash of URLs)

### 5. Preview

* Popup renders groups and tabs
* User explicitly confirms

### 6. Apply

* Existing tabs are validated
* Firefox tab groups are created
* Titles + colors applied

---

## Build & Run

### Requirements

* Node.js ≥ 18
* Firefox (with tab groups enabled)

### Build

```bash
npm install
npm run build
```

### Load Extension (Temporary)

1. Open Firefox
2. Navigate to:

   ```
   about:debugging#/runtime/this-firefox
   ```
3. Click **Load Temporary Add-on**
4. Select:

   ```
   dist/manifest.json
   ```

---

## Usage

1. Open multiple tabs
2. Click the extension icon
3. Press **Organize Tabs**
4. Review the preview
5. Click **Apply**

---

## Design Decisions 

* **No auto-apply**

  * User always remains in control.
* **Deterministic output**

  * Same tabs → same groups.
* **No background persistence**

  * Stateless by design.
* **Strict TypeScript**

  * `strict`, `exactOptionalPropertyTypes`, `isolatedModules`.

---

## Security & Privacy

* No network requests
* No telemetry
* No storage
* All computation is local

---

## License

MIT

---
