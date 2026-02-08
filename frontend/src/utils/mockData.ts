import { Repository, SearchResult, Metric, FilterOption, HeaderStat } from '../types';

export const mockRepositories: Repository[] = [
  { name: 'aws-samples/aws-mainframe-modernization-carddemo', files: '235', updated: '1D', language: 'COBOL', vectors: 7355 },
  { name: 'sveltejs/svelte.dev', files: '462', updated: '5h', language: 'Svelte', vectors: 4521 },
  { name: 'chakra-ui/chakra-ui', files: '364', updated: '3h', language: 'Typescript', vectors: 18163 },
];

export const mockSearchResults: SearchResult[] = [
  {
    path: 'src/middleware/auth.ts',
    similarity: 94.2,
    preview: `export async function authenticateUser(req: Request) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) throw new UnauthorizedError();
  
  const decoded = await verifyJWT(token);
  const user = await db.users.findById(decoded.userId);
  
  return user;
}`,
    language: 'TypeScript',
    lines: 156,
    repo: 'backend-api'
  },
  {
    path: 'src/auth/strategies/jwt-strategy.ts',
    similarity: 91.7,
    preview: `export class JWTStrategy implements AuthStrategy {
  async validate(token: string): Promise<User> {
    const payload = this.jwtService.verify(token);
    return this.userService.findOne(payload.sub);
  }
}`,
    language: 'TypeScript',
    lines: 89,
    repo: 'backend-api'
  },
  {
    path: 'docs/authentication.md',
    similarity: 88.3,
    preview: `# Authentication Middleware

The authentication middleware validates JWT tokens and attaches
user context to requests. It supports multiple strategies including
JWT, OAuth2, and API keys.`,
    language: 'Markdown',
    lines: 234,
    repo: 'docs-site'
  }
];

export const mockMetrics: Metric[] = [
  { label: 'Precision', value: 0.942 },
  { label: 'Recall', value: 0.889 },
  { label: 'F1 Score', value: 0.915 },
  { label: 'MRR', value: 0.873 }
];

export const mockFilters: FilterOption[] = [
  { id: 'code', label: 'CODE' },
  { id: 'docs', label: 'DOCS' },
  { id: 'config', label: 'CONFIG' },
  { id: 'typescript', label: 'TYPESCRIPT' },
  { id: 'python', label: 'PYTHON' }
];

export const mockHeaderStats: HeaderStat[] = [
  { value: '24.3K', label: 'VECTORS' },
  { value: '847', label: 'REPOSITORIES' },
  { value: '98.4%', label: 'ACCURACY' }
];

export const mockQueryTokens = ['async', 'auth', 'middleware'];
