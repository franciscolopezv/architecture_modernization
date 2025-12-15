# Docusaurus Setup Guide

## What's Been Set Up

✅ Docusaurus website in `website/` directory
✅ Automatic copying of markdown files from root to Docusaurus
✅ Custom sidebar with Strategy and Principles sections
✅ GitHub Actions workflow for automatic deployment
✅ Configured for GitHub Pages deployment

## Quick Start

### 1. Configure GitHub Settings

Edit `website/docusaurus.config.ts` and replace:
- `YOUR_GITHUB_USERNAME` with your GitHub username
- `YOUR_REPO_NAME` with your repository name

Example:
```typescript
url: 'https://franciscolopez.github.io',
baseUrl: '/architecture-playbook/',
organizationName: 'franciscolopez',
projectName: 'architecture-playbook',
```

### 2. Test Locally

```bash
cd website
npm install
./copy-docs.sh  # Copy markdown files
npm start       # Start development server
```

Visit http://localhost:3000 to see your site.

### 3. Deploy to GitHub Pages

#### Option A: Automatic (Recommended)

1. Push your code to GitHub
2. Go to repository Settings → Pages
3. Under "Build and deployment", select "GitHub Actions"
4. Push to `main` branch - site deploys automatically!

#### Option B: Manual

```bash
cd website
GIT_USER=your-github-username npm run deploy
```

## File Structure

```
.
├── website/
│   ├── docs/                    # Generated from markdown files
│   │   ├── intro.md            # Homepage
│   │   ├── strategy/           # From 01-strategy/
│   │   └── principles/         # From 02-principles/
│   ├── src/                    # React components
│   ├── static/                 # Static assets
│   ├── docusaurus.config.ts   # Main configuration
│   ├── sidebars.ts            # Sidebar structure
│   └── copy-docs.sh           # Script to copy markdown files
├── .github/
│   └── workflows/
│       └── deploy.yml         # GitHub Actions deployment
└── 01-strategy/               # Your original markdown files
    └── 02-principles/
```

## Workflow

1. **Edit markdown** in root directories (`01-strategy/`, `02-principles/`)
2. **Copy to Docusaurus**: `cd website && ./copy-docs.sh`
3. **Test locally**: `npm start`
4. **Commit and push** - GitHub Actions deploys automatically

## Customization

### Change Theme Colors

Edit `website/src/css/custom.css`:

```css
:root {
  --ifm-color-primary: #2e8555;  /* Change primary color */
}
```

### Update Navigation

Edit `website/docusaurus.config.ts` → `themeConfig.navbar.items`

### Update Footer

Edit `website/docusaurus.config.ts` → `themeConfig.footer`

### Add New Sections

1. Create new category in `website/sidebars.ts`
2. Add corresponding markdown files
3. Update navbar in `docusaurus.config.ts`

## Features Included

- ✅ Dark/Light mode toggle
- ✅ Search functionality
- ✅ Mobile responsive
- ✅ Syntax highlighting for code blocks
- ✅ Mermaid diagram support (if needed)
- ✅ Automatic table of contents
- ✅ Edit on GitHub links (configure in docusaurus.config.ts)

## Next Steps

1. **Configure GitHub settings** (replace YOUR_GITHUB_USERNAME, YOUR_REPO_NAME)
2. **Test locally** to ensure everything works
3. **Enable GitHub Pages** in repository settings
4. **Push to main** - your site will be live!

## Troubleshooting

**Site not deploying?**
- Check GitHub Actions tab for errors
- Ensure GitHub Pages is enabled in Settings
- Verify `url` and `baseUrl` in docusaurus.config.ts

**Markdown not showing?**
- Run `./copy-docs.sh` to copy latest files
- Check `sidebars.ts` for correct paths

**Build errors?**
- Check for broken links in markdown
- Ensure all referenced files exist
- Run `npm run build` locally to see errors

## Resources

- [Docusaurus Documentation](https://docusaurus.io/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Markdown Guide](https://docusaurus.io/docs/markdown-features)
