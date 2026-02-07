# GitSense Modular Architecture - Usage Guide

## Quick Start

### 1. Installation
```bash
cd gitsense-app
npm install
npm run dev
```

### 2. Using Individual Components

All components are exported from `src/components/index.ts`. Import what you need:

```tsx
import { Header, SearchBar, ResultsList } from '@/components';
```

## Component API Reference

### DotMatrixCanvas

Creates an animated dot matrix background effect.

**Props:**
- `dotSpacing?: number` - Space between dots (default: 40)
- `dotRadius?: number` - Size of each dot (default: 1)
- `opacity?: number` - Base opacity of dots (default: 0.03)

**Example:**
```tsx
<DotMatrixCanvas dotSpacing={50} dotRadius={1.5} opacity={0.05} />
```

---

### Header

Application header with logo and statistics display.

**Props:**
- `stats: HeaderStat[]` - Array of statistics to display
- `appName?: string` - Application name (default: 'GITSENSE')
- `appSubtitle?: string` - Subtitle text (default: 'SEMANTIC CODE INTELLIGENCE')

**Type Definitions:**
```typescript
interface HeaderStat {
  value: string;
  label: string;
}
```

**Example:**
```tsx
<Header 
  stats={[
    { value: '10K', label: 'DOCUMENTS' },
    { value: '500', label: 'USERS' },
    { value: '99.9%', label: 'UPTIME' }
  ]}
  appName="MY APP"
  appSubtitle="CUSTOM SUBTITLE"
/>
```

---

### SearchBar

Search input with filters and animated focus states.

**Props:**
- `query: string` - Current search query
- `onQueryChange: (query: string) => void` - Query change handler
- `filters: FilterOption[]` - Available filter options
- `selectedFilters: string[]` - Currently selected filter IDs
- `onFilterToggle: (filterId: string) => void` - Filter toggle handler
- `placeholder?: string` - Input placeholder (default: 'SEARCH CODE SEMANTICALLY')

**Type Definitions:**
```typescript
interface FilterOption {
  id: string;
  label: string;
}
```

**Example:**
```tsx
const filters = [
  { id: 'docs', label: 'DOCUMENTATION' },
  { id: 'code', label: 'CODE' },
  { id: 'tests', label: 'TESTS' }
];

<SearchBar
  query={searchQuery}
  onQueryChange={setSearchQuery}
  filters={filters}
  selectedFilters={['docs', 'code']}
  onFilterToggle={handleFilterToggle}
  placeholder="SEARCH YOUR CONTENT"
/>
```

---

### RepositorySidebar

Displays a list of repositories with active selection.

**Props:**
- `repositories: Repository[]` - Array of repositories
- `activeRepo: string` - Currently active repository name
- `onRepoSelect: (repoName: string) => void` - Repository selection handler
- `title?: string` - Sidebar title (default: 'ACTIVE REPOS')

**Type Definitions:**
```typescript
interface Repository {
  name: string;
  files: string;
  updated: string;
  language: string;
  vectors: number;
}
```

**Example:**
```tsx
const repos = [
  { 
    name: 'my-project', 
    files: '2.5K', 
    updated: '1h', 
    language: 'TypeScript', 
    vectors: 5000 
  }
];

<RepositorySidebar
  repositories={repos}
  activeRepo="my-project"
  onRepoSelect={handleRepoSelect}
  title="MY PROJECTS"
/>
```

---

### ResultCard

Individual search result card component.

**Props:**
- `result: SearchResult` - Search result data
- `index: number` - Card index (for animation delay)
- `onViewFile?: (path: string) => void` - View file handler

**Type Definitions:**
```typescript
interface SearchResult {
  path: string;
  similarity: number;
  preview: string;
  language: string;
  lines: number;
  repo: string;
}
```

**Example:**
```tsx
<ResultCard
  result={{
    path: 'src/components/Button.tsx',
    similarity: 95.2,
    preview: 'export const Button = ...',
    language: 'TypeScript',
    lines: 45,
    repo: 'ui-library'
  }}
  index={0}
  onViewFile={(path) => console.log('View:', path)}
/>
```

---

### ResultsList

Container component for displaying multiple search results.

**Props:**
- `results: SearchResult[]` - Array of search results
- `title?: string` - Section title (default: 'SEARCH RESULTS')
- `onViewFile?: (path: string) => void` - View file handler

**Example:**
```tsx
<ResultsList
  results={searchResults}
  title="MATCHING FILES"
  onViewFile={handleViewFile}
/>
```

---

### MetricCard

Single metric display with progress bar.

**Props:**
- `metric: Metric` - Metric data
- `index: number` - Card index (for animation delay)

**Type Definitions:**
```typescript
interface Metric {
  label: string;
  value: number; // 0 to 1
}
```

**Example:**
```tsx
<MetricCard
  metric={{ label: 'Accuracy', value: 0.945 }}
  index={0}
/>
```

---

### VectorVisualization

Grid visualization of vector space.

**Props:**
- `dimensions?: number` - Dimension count label (default: 1536)
- `gridSize?: number` - Number of grid cells (default: 64)
- `activeCells?: number[]` - Array of active cell indices
- `title?: string` - Visualization title (default: 'VECTOR SPACE')

**Example:**
```tsx
<VectorVisualization
  dimensions={768}
  gridSize={49}
  activeCells={[0, 5, 12, 18, 24, 30, 36, 42, 48]}
  title="EMBEDDING SPACE"
/>
```

---

### QueryAnalysis

Displays query token breakdown.

**Props:**
- `tokens: string[]` - Array of query tokens
- `title?: string` - Section title (default: 'QUERY TOKENS')

**Example:**
```tsx
<QueryAnalysis
  tokens={['search', 'vector', 'database']}
  title="PARSED QUERY"
/>
```

---

### MetricsPanel

Combined panel with metrics, vector visualization, and query analysis.

**Props:**
- `metrics: Metric[]` - Array of metrics
- `queryTokens: string[]` - Query tokens to display
- `title?: string` - Panel title (default: 'RETRIEVAL METRICS')

**Example:**
```tsx
<MetricsPanel
  metrics={[
    { label: 'Precision', value: 0.92 },
    { label: 'Recall', value: 0.88 }
  ]}
  queryTokens={['semantic', 'search']}
  title="PERFORMANCE"
/>
```

---

## Custom Hooks

### useSearch

Manages search state and filter selection.

**Returns:**
```typescript
{
  query: string;
  selectedFilters: string[];
  handleQueryChange: (query: string) => void;
  toggleFilter: (filterId: string) => void;
  resetFilters: () => void;
}
```

**Example:**
```tsx
const { 
  query, 
  selectedFilters, 
  handleQueryChange, 
  toggleFilter,
  resetFilters
} = useSearch('initial search');

// Use in SearchBar
<SearchBar
  query={query}
  onQueryChange={handleQueryChange}
  selectedFilters={selectedFilters}
  onFilterToggle={toggleFilter}
  ...
/>
```

---

### useRepository

Manages active repository selection.

**Returns:**
```typescript
{
  activeRepo: string;
  selectRepo: (repoName: string) => void;
}
```

**Example:**
```tsx
const { activeRepo, selectRepo } = useRepository('backend-api');

<RepositorySidebar
  activeRepo={activeRepo}
  onRepoSelect={selectRepo}
  ...
/>
```

---

## Creating Custom Layouts

Mix and match components to create custom layouts:

### Minimal Layout (Search + Results)
```tsx
function MinimalLayout() {
  const { query, handleQueryChange } = useSearch();
  
  return (
    <div>
      <SearchBar 
        query={query} 
        onQueryChange={handleQueryChange}
        filters={[]}
        selectedFilters={[]}
        onFilterToggle={() => {}}
      />
      <ResultsList results={results} />
    </div>
  );
}
```

### Dashboard Layout (All Components)
```tsx
function DashboardLayout() {
  return (
    <div className="gitsense-container">
      <DotMatrixCanvas />
      <Header stats={stats} />
      <SearchBar {...searchProps} />
      <div className="main-grid">
        <RepositorySidebar {...sidebarProps} />
        <ResultsList {...resultsProps} />
        <MetricsPanel {...metricsProps} />
      </div>
    </div>
  );
}
```

### Custom Three-Column Layout
```tsx
function CustomLayout() {
  return (
    <div className="custom-grid">
      <aside>
        <VectorVisualization />
        <QueryAnalysis tokens={tokens} />
      </aside>
      <main>
        <ResultsList results={results} />
      </main>
      <aside>
        {metrics.map((m, i) => (
          <MetricCard key={i} metric={m} index={i} />
        ))}
      </aside>
    </div>
  );
}
```

---

## Styling Customization

### Modifying Colors

Edit `src/styles/globals.css`:

```css
/* Change primary background */
.gitsense-container {
  background: #your-color;
}

/* Change accent color */
.search-wrapper.active {
  background: #your-accent;
}
```

### Custom Typography

```css
/* Change fonts */
.gitsense-container {
  font-family: 'Your Font', sans-serif;
}

.repo-name, .result-path {
  font-family: 'Your Mono Font', monospace;
}
```

### Responsive Breakpoints

Modify in `globals.css`:

```css
@media (max-width: 1400px) {
  .main-grid {
    grid-template-columns: 1fr 320px;
  }
}

@media (max-width: 1024px) {
  .main-grid {
    grid-template-columns: 1fr;
  }
}
```

---

## Integration Examples

### With React Router

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GitSenseApp from './App';

function AppWithRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GitSenseApp />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/repo/:id" element={<RepoDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### With State Management (Zustand)

```tsx
import create from 'zustand';

const useStore = create((set) => ({
  searchQuery: '',
  results: [],
  setQuery: (query) => set({ searchQuery: query }),
  setResults: (results) => set({ results })
}));

function App() {
  const { searchQuery, setQuery, results } = useStore();
  
  return (
    <SearchBar 
      query={searchQuery} 
      onQueryChange={setQuery}
      ...
    />
  );
}
```

### With API Integration

```tsx
import { useState, useEffect } from 'react';

function App() {
  const [results, setResults] = useState([]);
  const { query } = useSearch();

  useEffect(() => {
    if (query) {
      fetch(`/api/search?q=${query}`)
        .then(res => res.json())
        .then(data => setResults(data));
    }
  }, [query]);

  return <ResultsList results={results} />;
}
```

---

## Best Practices

1. **Use TypeScript types** - Import types from `@/types` for type safety
2. **Memoize expensive computations** - Use `useMemo` for filtering/sorting
3. **Optimize re-renders** - Wrap callbacks in `useCallback`
4. **Keep components pure** - Avoid side effects in render
5. **Use custom hooks** - Extract complex logic into hooks
6. **Compose components** - Build complex UIs from simple components

---

## Troubleshooting

### Components not rendering
- Check that all props are provided
- Verify data types match TypeScript interfaces
- Ensure CSS is imported in App.tsx

### Animations not working
- Verify browser supports CSS transforms
- Check animation delays are set correctly
- Ensure GPU acceleration is enabled

### Canvas not displaying
- Check canvas dimensions are set
- Verify canvas context is available
- Ensure no overlapping z-index issues

---

## Support

For issues, questions, or contributions, please refer to the project repository.
