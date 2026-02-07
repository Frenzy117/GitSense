/**
 * Build GitHub repository URL from repo identifier (owner/repo)
 */
export function getGithubRepoUrl(repoId: string): string {
  return `https://github.com/${repoId}`;
}

/**
 * Build GitHub file URL (default branch: main)
 */
export function getGithubFileUrl(repoId: string, path: string, branch = 'main'): string {
  return `https://github.com/${repoId}/blob/${branch}/${path}`;
}
