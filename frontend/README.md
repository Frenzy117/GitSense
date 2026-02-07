# GitSense - Semantic Code Search

A modular, reusable React application for semantic code search with a Nothing Technology-inspired monochrome design.

## Project Structure

```
gitsense-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── DotMatrixCanvas.tsx
│   │   ├── Header.tsx
│   │   ├── SearchBar.tsx
│   │   ├── RepositorySidebar.tsx
│   │   ├── ResultCard.tsx
│   │   ├── ResultsList.tsx
│   │   ├── MetricCard.tsx
│   │   ├── VectorVisualization.tsx
│   │   ├── QueryAnalysis.tsx
│   │   ├── MetricsPanel.tsx
│   │   └── index.ts
│   ├── hooks/              # Custom React hooks
│   │   ├── useSearch.ts
│   │   ├── useRepository.ts
│   │   └── index.ts
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/              # Utility functions and mock data
│   │   └── mockData.ts
│   ├── styles/             # Global styles
│   │   └── globals.css
│   ├── App.tsx             # Main application component
│   └── main.tsx            # React entry point
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Features

### Modular Components

All components are designed to be reusable and composable:

#### `<DotMatrixCanvas />`
Background dot matrix effect with configurable spacing and opacity.

```tsx
<DotMatrixCanvas dotSpacing={40} dotRadius={1} opacity={0.03} />
```

#### `<Header />`
Application header with logo and statistics.

```tsx
<Header 
  stats={[
    { value: '24.3K', label: 'VECTORS' },
    { value: '847', label: 'REPOSITORIES' }
  ]}
  appName="GITSENSE"
  appSubtitle="SEMANTIC CODE INTELLIGENCE"
/>
```

#### `<SearchBar />`
Search input with filters and corner bracket styling.

```tsx
<SearchBar
  query={query}
  onQueryChange={setQuery}
  filters={filterOptions}
  selectedFilters={selectedFilters}
  onFilterToggle={handleFilterToggle}
  placeholder="SEARCH CODE SEMANTICALLY"
/>
```

#### `<RepositorySidebar />`
Sidebar displaying repository list with active selection.

```tsx
<RepositorySidebar
  repositories={repos}
  activeRepo={activeRepo}
  onRepoSelect={setActiveRepo}
  title="ACTIVE REPOS"
/>
```

#### `<ResultsList />`
Main results area displaying search results.

```tsx
<ResultsList
  results={searchResults}
  title="SEARCH RESULTS"
  onViewFile={handleViewFile}
/>
```

#### `<MetricsPanel />`
Right panel with metrics, vector visualization, and query analysis.

```tsx
<MetricsPanel
  metrics={metricsData}
  queryTokens={['async', 'auth', 'middleware']}
  title="RETRIEVAL METRICS"
/>
```

### Custom Hooks

#### `useSearch`
Manages search state and filter selection.

```tsx
const { 
  query, 
  selectedFilters, 
  handleQueryChange, 
  toggleFilter, 
  resetFilters 
} = useSearch('initial query');
```

#### `useRepository`
Manages active repository selection.

```tsx
const { activeRepo, selectRepo } = useRepository('backend-api');
```

### Type Definitions

All types are exported from `src/types/index.ts`:

- `Repository` - Repository data structure
- `SearchResult` - Search result item
- `Metric` - Metric data
- `FilterOption` - Filter configuration
- `HeaderStat` - Header statistic

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Design Philosophy

### Nothing Technology-Inspired Aesthetic

- **Monochrome**: Pure black (#000000) and white (#FFFFFF)
- **Typography**: Archivo (UI) + JetBrains Mono (code)
- **Brutalist Layouts**: Grid-based, functional, minimal
- **Signature Elements**:
  - Dot matrix background
  - Corner bracket details
  - Blinking indicators
  - Geometric shapes
  - Thin borders (1-2px)

### Component Design Principles

1. **Reusability**: Every component accepts props for customization
2. **Composability**: Components work together to build complex UIs
3. **Type Safety**: Full TypeScript support with exported types
4. **Separation of Concerns**: Clear separation between UI, logic, and data
5. **Customization**: Configurable through props without modifying source

## Customization Examples

### Custom Color Scheme

While designed for monochrome, you can modify `globals.css` to change colors:

```css
/* Change to any color scheme */
.gitsense-container {
  background: #your-bg-color;
  color: #your-text-color;
}
```

### Custom Filters

```tsx
const customFilters = [
  { id: 'javascript', label: 'JAVASCRIPT' },
  { id: 'rust', label: 'RUST' },
  { id: 'go', label: 'GO' }
];

<SearchBar filters={customFilters} ... />
```

### Custom Metrics

```tsx
const customMetrics = [
  { label: 'Accuracy', value: 0.956 },
  { label: 'Speed', value: 0.892 },
  { label: 'Coverage', value: 0.934 }
];

<MetricsPanel metrics={customMetrics} ... />
```

## Integration Guide

### Adding Real API Data

Replace mock data in `utils/mockData.ts` with API calls:

```tsx
// Example: Fetching real repositories
const [repositories, setRepositories] = useState([]);

useEffect(() => {
  fetch('/api/repositories')
    .then(res => res.json())
    .then(data => setRepositories(data));
}, []);
```

### Adding Search Functionality

```tsx
const handleSearch = async (query: string) => {
  const response = await fetch(`/api/search?q=${query}`);
  const results = await response.json();
  setSearchResults(results);
};

<SearchBar 
  query={query} 
  onQueryChange={handleSearch}
  ...
/>
```

## Dependencies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Lucide React** - Icons
- **Archivo Font** - UI typography
- **JetBrains Mono** - Code typography

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Performance

- Canvas background optimized with requestAnimationFrame
- Animations use CSS transforms for GPU acceleration
- Components use React.memo where appropriate
- No unnecessary re-renders with proper state management

## License

MIT

## Credits

Design inspired by Nothing Technology's minimalist brutalist aesthetic.
