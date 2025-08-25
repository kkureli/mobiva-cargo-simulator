# Mobiva Cargo Simulator (React Native + TypeScript)

A simulation app for cargo shipment data with full cycle: **generate → clean → list → filter → detail**.  
State management is handled with **Zustand**, algorithms are implemented **without external libraries**

---

## Prerequisites

- Node.js **22+**
- JDK **17** (Android)
- Android Studio + Android SDK (platform-tools, build-tools)
- Xcode **15+** (iOS) + CocoaPods (`gem install cocoapods`)
- React Native CLI toolchain (Watchman recommended on macOS)

## Table of Contents
- [Setup & Run](#setup--run)
- [Architecture & Folder Structure](#architecture--folder-structure)
- [Data Model](#data-model)
- [Constants](#constants)
- [Features & Spec Mapping](#features--spec-mapping)
- [Data Generation Algorithm](#data-generation-algorithm)
- [Cleaning Strategy](#cleaning-strategy)
- [Filtering & Search Algorithm](#filtering--search-algorithm)
- [Detail Screen & Dirty Field Highlighting](#detail-screen--dirty-field-highlighting)
- [Error Handling](#error-handling)
- [Performance Design](#performance-design)
- [Performance Measurements](#performance-measurements)
- [Commit Convention](#commit-convention)

---

## Setup & Run

```bash
npm install

# iOS first setup
cd ios && pod install && cd ..

# Metro bundler
npx react-native start

# Android
npx react-native run-android

# iOS
npx react-native run-ios
```

**ErrorBoundary** fallback is visible in **release builds** (RedBox dominates in dev mode):
```bash
npx react-native run-android --mode=release
npx react-native run-ios --configuration Release
```

---

## Architecture & Folder Structure

```
src/
  models/
    constants.ts      # STATUSES, CATEGORIES, WEIGHT_BUCKETS
    types.ts          # RawCargo, CleanCargo, CargoFilters, etc.
    limits.ts         # PRICE / COUNT limits, CLEAN_TIMEOUT_MS
  utils/
    cargo/
      builder.ts            # data generation
      sanitizer.ts          # cleaning logic + timeout + unique id check
      validator.ts          # dirty field detection
    query/ 
      filter.ts         # O(n) filtering
    shared/
      random.ts         # uuidv4, randomAlnum, pick
      number.ts         # parseNumStrict helper
  state/
    types.ts          # store types (DatasetState/Actions/Stats)
    store.ts          # zustand store
  hooks/
    useCreateForm.ts  # CreateScreen form state & validation
    useListView.ts    # ListScreen filter logic
  ui/
    theme/
    components/
      Chip.tsx
      ErrorBoundary.tsx
      Icon.tsx
      StatusBadge.tsx
  screens/
    CreateScreen.tsx
    ListScreen.tsx
    DetailScreen.tsx
  navigation/
    AppNavigator.tsx
    CreateStack.tsx
    ListStack.tsx
App.tsx
```

---

## Data Model

```ts
interface RawCargo {
  id: string;            // UUID v4
  name: string;          // 8–16 alphanumeric
  category: Category;
  price: number;         // may be negative
  status: Status | null; // 5% null
  kg: number | null;     // 10% null
  createdAt: number;
}

interface CleanCargo {
  id: string;
  name: string;
  category: Category;
  price: number;         // >= 0
  status: Status;
  kg: number;
  createdAt: number;
}
```

---

## Constants

- Status: `['PREPARING','AT_BRANCH','OUT_FOR_DELIVERY','DELIVERED','DELIVERY_FAILED']`
- WeightBuckets: `['1-5','5-10','10-15','15-20','20-25','25-30','30-35','35-40']`
- Categories: `['electronics','cleaning','apparel','food','books','cosmetics','homeliving','toys','sports']`
- Limits: `PRICE_MIN_LIMIT=-100`, `PRICE_MAX_LIMIT=1000`, `COUNT_MIN_LIMIT=100`, `COUNT_MAX_LIMIT=10000`, `CLEAN_TIMEOUT_MS=2000`

---

## Features & Spec Mapping

- **CreateScreen**
  - Multi-select: Category, WeightBuckets, Status 
  - Price range validation 
  - Count validation (100..10000, integer) 
  - Generation stats: count, null status, null kg, negative price, start/end/duration 
  - Clean stats: removed, remaining, duration 

- **ListScreen**
  - Works without cleaning, dirty items highlighted 
  - After cleaning, only valid items 
  - Filters: category, bucket, price, name (case-sensitive) 
  - Apply-only filtering 
  - Counters: total and result 

- **DetailScreen**
  - Fields: id, name, category, price, status, kg, createdAt 
  - Dirty fields highlighted (only before cleaning) 

---

## Data Generation Algorithm

File: `utils/cargo/builder.ts`

- Inputs: categories, weightBuckets, statuses, priceMin..priceMax, count
- Validation: non-empty, min<max, count in [100..10000]
- Dirty distribution:
  - 5% status = null
  - 10% kg = null
  - Negative prices proportional to negative span
- Record:
  - uuidv4, random alnum name, random category, random price, random kg from bucket, random status, createdAt
- Stats returned (count, null counts, negative count, timings)
- Complexity: O(n)

---

## Cleaning Strategy

File: `utils/cargo/sanitizer.ts`

- Rules: invalid status/category, price<0, kg=null, invalid/duplicate id → remove
- Timeout: CLEAN_TIMEOUT_MS → throw error
- Unique ids ensured with Set
- Result: cleaned rows, removed count, remaining count, duration
- Complexity: O(n)

---

## Filtering & Search Algorithm

File: `utils/query/filter.ts`

- Category filter with Set (O(1))
- Bucket filter: parse min/max, range check
- Price min/max checks
- Name filter: case-sensitive includes
- Apply-only model, filters applied on button press
- Complexity: O(n)

---

## Detail Screen & Dirty Field Highlighting

File: `screens/DetailScreen.tsx`

- Raw mode: invalid/dirty fields highlighted
- Clean mode: all valid

---

## Error Handling

- **Generate**: param validation, OOM guard, try/catch
- **Clean**: timeout guard, corrupt removal
- **List**: safe filtering with validation
- **Search**: safe includes
- **State**: store action try/catch, error state
- **UI**: ErrorBoundary wrapper (class)

---

## Performance Design

- Single-pass generation/cleaning
- Filtering with O(n) and Set
- FlatList tuned: initialNumToRender, windowSize, removeClippedSubviews
- InteractionManager for smooth filter apply

---

## Performance Measurements

| Records | Generation (ms) | Cleaning (ms) | List Render (ms) |            Device           |
|--------:|----------------:|--------------:|-----------------:|-----------------------------|
| 1.000   |       10        |         3     |           1       |   iPhone 16 Plus(Simulator) |
| 5.000   |       48    |         14    |                 1 |   iPhone 16 Plus(Simulator)    |
| 10.000  |       78      |          25     |               2   |      iPhone 16 Plus(Simulator)  |

| Records | Generation (ms) | Cleaning (ms) | List Render (ms) |            Device           |
|--------:|----------------:|--------------:|-----------------:|-----------------------------|
| 1.000   |       14    |         2     |          4        |   Pixel 8(Simulator) |
| 5.000   |       64    |         31    |                7  |   Pixel 8(Simulator)    |
| 10.000  |       73      |          43     |             10     |      Pixel 8(Simulator)  |

---

## Commit Convention

Conventional Commits:

- `feat(models): add cargo types and constants`
- `feat(utils): generator with 5% null status`
- `perf(utils): apply-only filter`
- `fix(ui): show validation errors`
- `chore(utils): add parseNumStrict`
- `feat(ui): add ErrorBoundary`

