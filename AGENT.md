# AGENT.md - Tranzo Project Execution Instructions
**For:** Agentic Coding
**Project:** Tranzo Financial Dashboard

---

## CRITICAL SUCCESS INSTRUCTIONS

### 🎯 PRIMARY OBJECTIVES (In Order of Importance)

1. **PIXEL-PERFECT DESIGN MATCH** - Every screen must match the Figma design exactly:
   - Exact spacing, padding, margins (use tokens from Design System Document)
   - Precise colors (use color hex codes provided)
   - Exact typography (font size, weight, line height)
   - Smooth animations matching specifications

2. **REAL-TIME DATA INTEGRATION** - All data must flow from Supabase:
   - No hardcoded data (except mock for testing)
   - Real-time subscriptions where applicable
   - Proper error handling for failed requests
   - Loading states for all async operations

3. **CODE QUALITY & ARCHITECTURE** - Must follow clean architecture:
   - Strict TypeScript (zero `any` types)
   - Separation of concerns (API, Services, UI, State)
   - Reusable components with proper composition
   - Maximum 50 lines per function

4. **FUNCTIONAL COMPLETENESS** - All mandatory features working:
   - Authentication flow (Splash → Login → Dashboard)
   - Dashboard with real balance + charts
   - Transactions CRUD (Create, Read, Update, Delete)
   - Analytics with filters
   - Proper navigation

5. **GIT BEST PRACTICES** - Clean commit history:
   - 20-25 meaningful commits
   - Conventional commit format: `feat/fix/refactor/test/docs/chore`
   - Commits evenly distributed (not bulk commits)
   - Descriptive commit messages

---

## TECHNOLOGY STACK (STRICTLY ENFORCED)

**Required:**
- ✅ Expo (React Native)
- ✅ TypeScript (strict mode)
- ✅ React Navigation v6+
- ✅ Zustand (state management)
- ✅ Supabase (backend & database)
- ✅ TailwindCSS + NativeWind
- ✅ React Native Vector Icons
- ✅ Victory Native (charts)
- ✅ React Native Reanimated (animations)
- ✅ React Native Gesture Handler

**NOT Allowed:**
- ❌ Redux (use Zustand instead)
- ❌ Context API for state (use Zustand)
- ❌ AsyncStorage without encryption
- ❌ Hardcoded API endpoints
- ❌ Console.logs in production
- ❌ Deprecated React Native APIs
- ❌ Template projects or boilerplates
- ❌ AI-generated entire features (use for learning only)

---

## MCP TOOLS AVAILABLE TO YOU

### 1. **Figma MCP** - Use for Design Verification
**When to Use:**
- Before implementing a screen → Get design reference
- When unsure about spacing/colors → Verify exact values
- To check animation specs → Get precise durations/easing
- Export component states

**Commands:**
```
Use Figma MCP to:
1. Fetch current frame/component specifications
2. Extract exact color values and opacity
3. Get spacing/padding measurements
4. Verify animation timings
5. Check typography specifications
```

**Example Query:**
"Fetch the Home screen frame from Figma. I need exact padding, spacing, and color codes for the Balance Card component."

---

### 2. **Supabase MCP** - Use for Database Operations
**When to Use:**
- Setting up database tables
- Creating RLS policies
- Inserting mock data
- Testing queries before implementation
- Debugging data fetch issues

**Commands:**
```
Use Supabase MCP to:
1. Create/verify tables (users, transactions, categories)
2. Setup RLS (Row Level Security) policies
3. Insert 50+ mock transaction records
4. Test SELECT queries
5. Create storage buckets if needed
6. View real-time subscription setup
```

**Example Query:**
"Create the transactions table in Supabase with columns: id (UUID), user_id (UUID), type (ENUM), amount (decimal), category (text), title (text), note (text), date (date), status (ENUM), created_at (timestamp), updated_at (timestamp). Then insert 50 mock records with varied dates and amounts."

---

### 3. **Filesystem MCP** - Use for File Operations
**When to Use:**
- Creating new files/folders
- Reading existing code
- Updating configuration files
- Managing git operations
- Creating documentation

**Commands:**
```
Use Filesystem MCP to:
1. Create folder structure
2. Generate new TypeScript files
3. Update config files (tailwind, tsconfig, etc.)
4. Read and modify existing files
5. Generate documentation
```

---

### 4. **Web Search MCP** - Use Sparingly
**When to Use:**
- Looking up specific React Native library documentation
- Checking Victory Native chart syntax
- Finding Supabase specific patterns
- Verifying TypeScript best practices

**When NOT to Use:**
- Don't search for "how to build financial app" (too broad)
- Don't search for entire implementations

---

## PROJECT STRUCTURE (REQUIRED)

```
├── src/
│   ├── api/
│   │   ├── transactionApi.ts
│   │   ├── analyticsApi.ts
│   │   └── index.ts
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Text.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Icon.tsx
│   │   ├── modals/
│   │   │   ├── AddTransactionModal.tsx
│   │   │   ├── FilterModal.tsx
│   │   │   ├── TransactionDetailsModal.tsx
│   │   │   └── DeleteConfirmationModal.tsx
│   │   ├── charts/
│   │   │   ├── DonutChart.tsx
│   │   │   └── LineChart.tsx
│   │   ├── sections/
│   │   │   ├── BalanceCard.tsx
│   │   │   ├── SummaryCards.tsx
│   │   │   ├── TransactionList.tsx
│   │   │   └── CategoryList.tsx
│   │   ├── ScreenHeader.tsx
│   │   ├── FAB.tsx
│   │   └── index.ts
│   ├── constants/
│   │   ├── colors.ts
│   │   ├── spacing.ts
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useTransactions.ts
│   │   ├── useAnalytics.ts
│   │   └── useAnimations.ts
│   ├── navigation/
│   │   ├── RootNavigator.tsx
│   │   ├── AppNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   └── types.ts
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── SplashScreen.tsx
│   │   │   └── LoginScreen.tsx
│   │   ├── app/
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── TransactionsScreen.tsx
│   │   │   └── AnalyticsScreen.tsx
│   │   └── index.ts
│   ├── services/
│   │   ├── supabase.ts
│   │   ├── authService.ts
│   │   └── storageService.ts
│   ├── store/
│   │   ├── userStore.ts
│   │   ├── transactionStore.ts
│   │   ├── analyticsStore.ts
│   │   ├── uiStore.ts
│   │   └── index.ts
│   ├── theme/
│   │   ├── colors.ts
│   │   ├── tokens.ts
│   │   ├── animations.ts
│   │   ├── index.ts
│   │   └── tailwind.config.js
│   ├── types/
│   │   ├── database.ts
│   │   ├── api.ts
│   │   ├── store.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── formatting.ts
│   │   ├── validation.ts
│   │   ├── storage.ts
│   │   └── helpers.ts
│   └── App.tsx
├── app.json
├── tailwind.config.js
├── tsconfig.json
├── .env.example
├── .eslintrc.js
├── .prettierrc.js
├── .gitignore
├── package.json
└── README.md
```

---

## IMPLEMENTATION ROADMAP (3-Day Execution)

### DAY 1: Foundation (22 hours)

**Phase 1: Setup (6h)**
- Initialize Expo project
- Install ALL dependencies at once (don't install incrementally)
- Setup TypeScript strict mode
- Configure ESLint + Prettier
- Setup Supabase project
- Create folder structure

**Phase 2: Theme & Design (2h)**
- Create all color tokens from Design System Document
- Create spacing system
- Create typography presets
- Configure TailwindCSS
- Verify against Figma design

**Phase 3: Supabase Setup (3h)**
- Create database tables
- Setup RLS policies
- Insert 50+ mock transactions
- Create TypeScript types for database
- Test connection

**Phase 4: Authentication (8h)**
- Setup Zustand stores (all 4)
- Create auth service
- Create Splash screen
- Create Login screen
- Create navigation structure

**Phase 5: Base Components (2h)**
- Create Button (4 variants)
- Create Card
- Create Text presets
- Create Input
- Create Icon wrapper

**Phase 6: Dashboard Start (1h)**
- Create ScreenHeader component
- Setup HomeScreen structure
- Test navigation

---

### DAY 2: Core Features (20 hours)

**Phase 7: Dashboard Completion (8h)**
- Create BalanceCard with animation
- Create SummaryCards
- Create DonutChart (top spending)
- Create TransactionList component
- Create RecentTransactionsSection
- Add pull-to-refresh
- Test with real data from Supabase

**Phase 8: Transactions Screen (7h)**
- Create SearchBar + FilterButton
- Create FilterModal with all options
- Create TransactionsScreen with FlatList
- Create TransactionItem component
- Create TransactionDetailsModal
- Add pagination
- Test filtering and search

**Phase 9: Transaction Management (5h)**
- Create AddTransactionModal
- Create EditTransactionModal
- Create DeleteConfirmationModal
- Connect to Supabase CRUD
- Implement form validation
- Test end-to-end

---

### DAY 3: Analytics, Polish & Submission (18 hours)

**Phase 10: Analytics Screen (5h)**
- Create time filter selector
- Create summary cards for analytics
- Create LineChart (spending trend)
- Create comprehensive DonutChart
- Create AnalyticsScreen
- Test data filtering

**Phase 11: State & API Integration (4h)**
- Create API service layer (Supabase queries)
- Connect stores to API
- Implement error handling
- Add loading states
- Real-time subscriptions

**Phase 12: Animations & Polish (5h)**
- Screen transitions
- Micro-interactions (button presses)
- Pull-to-refresh animation
- Modal animations
- Chart animations
- List stagger animations
- Test on iOS simulator

**Phase 13: Accessibility & Optimization (2h)**
- Add accessibility labels
- Test with VoiceOver
- Optimize performance
- Remove console.logs
- Build production version

**Phase 14: Documentation & Submission (2h)**
- Write comprehensive README.md
- Add JSDoc comments
- Verify all commits
- Create demo video (optional)
- Prepare submission package

---

## CRITICAL IMPLEMENTATION DETAILS

### 1. COLOR SYSTEM IMPLEMENTATION

**File: `src/theme/colors.ts`**
```typescript
export const COLORS = {
  primary: '#1A1F4B',
  secondary: '#5B4EFF',
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  light: '#F9FAFB',
  white: '#FFFFFF',
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
    tertiary: '#9CA3AF',
  },
  category: {
    grocery: '#F59E0B',
    transport: '#38BDF8',
    entertainment: '#8B5CF6',
    medicine: '#EC4899',
    education: '#3B82F6',
  },
};
```

**Usage in Components:**
```typescript
import { COLORS } from '@/theme/colors';

<View style={{ backgroundColor: COLORS.primary }} />
<Text style={{ color: COLORS.text.primary }} />
```

---

### 2. ANIMATION IMPLEMENTATION

**Use React Native Reanimated 3:**

```typescript
// Example: Balance reveal animation
import Animated, { 
  FadeInDown, 
  FadeOutUp,
  withTiming,
  Easing 
} from 'react-native-reanimated';

const animatedStyle = useAnimatedStyle(() => ({
  opacity: animationValue.value,
  transform: [{ scale: animationValue.value }],
}));

// On eye icon tap:
animationValue.value = withTiming(
  balanceVisible ? 1 : 0,
  {
    duration: 300,
    easing: Easing.out(Easing.cubic),
  }
);
```

---

### 3. SUPABASE REAL-TIME INTEGRATION

**Pattern for Real-Time Updates:**

```typescript
// In store or component
useEffect(() => {
  const subscription = supabase
    .from('transactions')
    .on('*', payload => {
      // Update store
      store.setTransactions(payload.new);
    })
    .subscribe();

  return () => subscription.unsubscribe();
}, []);
```

---

### 4. ZUSTAND STORE PATTERN

**Example: Transaction Store**

```typescript
import create from 'zustand';

interface TransactionStore {
  transactions: Transaction[];
  filters: FilterState;
  isLoading: boolean;
  error: string | null;
  
  fetchTransactions: (filters?: FilterState) => Promise<void>;
  addTransaction: (data: TransactionInput) => Promise<void>;
  updateTransaction: (id: string, data: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  setFilters: (filters: FilterState) => void;
  clearFilters: () => void;
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  transactions: [],
  filters: {},
  isLoading: false,
  error: null,
  
  fetchTransactions: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        // Apply filters
        .order('date', { ascending: false });
      
      if (error) throw error;
      set({ transactions: data });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
  // ... more actions
}));
```

---

### 5. COMPONENT COMPOSITION PATTERN

**Always use composition over inheritance:**

```typescript
// ✅ GOOD: Composable component
interface TransactionItemProps {
  transaction: Transaction;
  onPress: () => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onPress,
}) => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.container}>
      <Icon name={getCategoryIcon(transaction.category)} />
      <View style={styles.info}>
        <Text style={styles.title}>{transaction.title}</Text>
        <Text style={styles.category}>{transaction.category}</Text>
      </View>
      <Text style={getAmountColor(transaction.type)}>
        {formatCurrency(transaction.amount)}
      </Text>
    </View>
  </TouchableOpacity>
);

// ❌ BAD: Large monolithic component
```

---

### 6. ERROR HANDLING PATTERN

**Implement proper error boundaries and fallbacks:**

```typescript
// Error boundary for screens
const withErrorBoundary = (Component) => (props) => {
  const [error, setError] = useState(null);
  
  if (error) {
    return (
      <ErrorView 
        error={error}
        onRetry={() => setError(null)}
      />
    );
  }
  
  return (
    <ErrorBoundary onError={setError}>
      <Component {...props} />
    </ErrorBoundary>
  );
};

// Usage in async operations
try {
  await fetchTransactions();
} catch (error) {
  showErrorMessage(error.message);
  // Retry logic
}
```

---

### 7. PERFORMANCE OPTIMIZATION

**Critical Patterns:**

```typescript
// 1. Use React.memo for expensive components
export const TransactionItem = React.memo(({ transaction }) => (
  // component
), (prevProps, nextProps) => {
  return prevProps.transaction.id === nextProps.transaction.id;
});

// 2. Use useMemo for expensive calculations
const sortedTransactions = useMemo(
  () => transactions.sort((a, b) => b.date - a.date),
  [transactions]
);

// 3. Use FlatList properly
<FlatList
  data={transactions}
  keyExtractor={item => item.id}
  renderItem={({ item }) => <TransactionItem transaction={item} />}
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
  removeClippedSubviews
  initialNumToRender={20}
/>

// 4. Optimize images
<Image
  source={{ uri: imageUrl }}
  style={{ width: 100, height: 100 }}
  resizeMode="contain"
  defaultSource={require('placeholder.png')}
/>
```

---

## GIT COMMIT STRATEGY

**Target: 20-25 meaningful commits**

**Format: `[type]([scope]): [description]`**

Examples:
```
feat(auth): implement splash screen with auto-navigation
feat(dashboard): create balance card with animation
feat(transactions): implement transaction list with pagination
feat(analytics): add spending trend line chart
fix(store): resolve transaction update race condition
refactor(components): extract common button styles
perf(lists): optimize flatlist rendering
docs(readme): add setup instructions
chore(deps): update supabase client version
test(auth): add login validation tests
```

**Commit Frequency:**
- 1-2 commits per major feature
- Commits distributed across 3 days (not clustered)
- Each commit should be logically independent

---

## TESTING CHECKLIST (Before Each Push)

- [ ] No TypeScript errors: `npm run type-check`
- [ ] No ESLint warnings: `npm run lint`
- [ ] App builds successfully: `npm run ios`
- [ ] No console.logs in production code
- [ ] Proper error handling for all async operations
- [ ] Loading states display correctly
- [ ] Animations are smooth (60fps)
- [ ] Responsive on iPhone 15 Pro (393px width)
- [ ] Text is readable (proper contrast)
- [ ] Touch targets are ≥44x44pt
- [ ] Supabase queries return expected data
- [ ] Zustand store updates correctly
- [ ] No memory leaks (check Xcode instruments)

---

## DEBUGGING COMMANDS

```bash
# Check types
npx tsc --noEmit

# Run linter
npm run lint

# Build for iOS
npm run ios

# Clean build
rm -rf .expo node_modules
npm install
npm run ios

# Check bundle size
npx react-native bundle --platform ios \
  --dev false --entry-file index.js \
  --bundle-output ios_bundle.js

# View logs
npm run ios -- --verbose
```

---

## ENVIRONMENT VARIABLES (.env)

```env
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# App
EXPO_PUBLIC_APP_ENV=development
EXPO_PUBLIC_API_TIMEOUT=30000
```

**.env.example** (commit this, not .env):
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_APP_ENV=development
```

---

## IMPORTANT REMINDERS

🔴 **CRITICAL - Do NOT:**
- ❌ Use any deprecated React Native APIs
- ❌ Hardcode API endpoints or credentials
- ❌ Use `any` types in TypeScript
- ❌ Leave console.logs in production
- ❌ Create large monolithic components (>50 lines)
- ❌ Skip error handling
- ❌ Make bulk commits (1-2 commits with everything)
- ❌ Copy-paste code without understanding
- ❌ Skip accessibility labels
- ❌ Use localStorage/sessionStorage (use AsyncStorage instead)

🟢 **MUST DO:**
- ✅ Match Figma design pixel-perfectly
- ✅ Use Zustand for ALL state management
- ✅ Implement real-time Supabase subscriptions
- ✅ Add proper error boundaries
- ✅ Optimize performance (React.memo, useMemo)
- ✅ Write meaningful commit messages
- ✅ Add accessibility labels
- ✅ Test on iOS 17.5 simulator
- ✅ Follow TypeScript strict mode
- ✅ Include JSDoc comments

---

## AGENT EXECUTION CHECKLIST

### Pre-Development
- [ ] Read all 4 documents (PRD, Design System, Task Tracker, AGENT.md)
- [ ] Understand project scope and deadline
- [ ] Review MCP tools available
- [ ] Check GitHub setup (fresh repository)
- [ ] Verify Supabase project credentials

### Daily Standup
- [ ] Check current time vs deadline
- [ ] Review task tracker for today's phase
- [ ] Identify blockers
- [ ] Plan commits for the day
- [ ] Verify git history

### Code Review (Before Each Commit)
- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] Code matches design specifications
- [ ] Proper error handling implemented
- [ ] Performance optimized
- [ ] Commit message is descriptive

### Pre-Submission
- [ ] 20-25 commits with good distribution
- [ ] README.md completed
- [ ] No console.logs in code
- [ ] App builds successfully
- [ ] All features functional
- [ ] Tested on iOS simulator
- [ ] Supabase data flows correctly
- [ ] Git history is clean

---

## SUCCESS METRICS

### Code Quality (Must Have)
- ✅ Zero TypeScript errors
- ✅ ESLint passes with no errors
- ✅ No `any` types used
- ✅ Functions ≤50 lines
- ✅ Proper error handling

### Feature Completeness (Must Have)
- ✅ Authentication flow working
- ✅ Dashboard shows real data
- ✅ Transactions CRUD functional
- ✅ Analytics with charts
- ✅ All navigation flows

### Design Fidelity (Must Have)
- ✅ Pixel-perfect layout match
- ✅ Exact colors used
- ✅ Proper spacing/padding
- ✅ Typography matches
- ✅ Animations smooth

### Performance (Should Have)
- ✅ App startup < 3 seconds
- ✅ Navigation < 500ms
- ✅ Charts render smoothly
- ✅ Lists scroll without jank
- ✅ Memory optimized

### Git History (Must Have)
- ✅ 20-25 commits
- ✅ Meaningful messages
- ✅ Even distribution
- ✅ No bulk commits
- ✅ Conventional format

---

## FINAL SUBMISSION CHECKLIST

- [ ] Fresh GitHub repository (public)
- [ ] 20-25 meaningful commits
- [ ] All code pushed to main branch
- [ ] No node_modules in repository
- [ ] .env.example file included
- [ ] No API keys in code
- [ ] README.md comprehensive
- [ ] App builds successfully
- [ ] Runs on iOS 17.5 simulator
- [ ] No console errors/warnings
- [ ] Screenshots included
- [ ] Time breakdown documented
- [ ] Ready to submit via email

---

**Status:** ✅ Ready for Agent Execution  
**Last Updated:** Nov 13, 2025  
**Version:** 1.0