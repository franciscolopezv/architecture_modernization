# Docusaurus Website

This directory contains the Docusaurus website for the Server-Side Architecture Playbook.

## Setup

Before deploying, update the following in `docusaurus.config.ts`:

1. Replace `YOUR_GITHUB_USERNAME` with your GitHub username/organization
2. Replace `YOUR_REPO_NAME` with your repository name

Example:
```typescript
url: 'https://yourusername.github.io',
baseUrl: '/architecture-playbook/',
organizationName: 'yourusername',
projectName: 'architecture-playbook',
```

## Local Development

```bash
# Copy the latest markdown files
./copy-docs.sh

# Install dependencies
npm install

# Start development server
npm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment to GitHub Pages

### Automatic Deployment (Recommended)

The repository includes a GitHub Actions workflow that automatically deploys to GitHub Pages on every push to `main`.

**Setup Steps:**

1. Go to your repository Settings → Pages
2. Under "Build and deployment", select "GitHub Actions" as the source
3. Push to `main` branch - the site will deploy automatically

### Manual Deployment

```bash
# Set your GitHub credentials
GIT_USER=<Your GitHub username> npm run deploy
```

## Updating Documentation

When you update markdown files in the root directories (`01-strategy/`, `02-principles/`, etc.):

1. Run `./copy-docs.sh` to copy the latest files
2. Test locally with `npm start`
3. Commit and push - GitHub Actions will deploy automatically

## Customization

- **Theme**: Edit `src/css/custom.css` for styling
- **Navbar**: Edit `docusaurus.config.ts` → `themeConfig.navbar`
- **Footer**: Edit `docusaurus.config.ts` → `themeConfig.footer`
- **Sidebar**: Edit `sidebars.ts` to change documentation structure
