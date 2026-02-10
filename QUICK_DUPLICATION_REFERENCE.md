# Quick Repository Duplication Reference

This is a quick reference for duplicating this repository. For detailed instructions, see [REPOSITORY_DUPLICATION_GUIDE.md](REPOSITORY_DUPLICATION_GUIDE.md).

## Fastest Method: Mirror Push

### Prerequisites
1. Create two new empty repositories on GitHub (don't initialize with README)

### Commands

```bash
# Duplicate for Console App
git clone --bare https://github.com/sys-MWell/lego-dimensions-nfc-writer.git
cd lego-dimensions-nfc-writer.git
git push --mirror https://github.com/YOUR-USERNAME/lego-dimensions-console-app.git
cd .. && rm -rf lego-dimensions-nfc-writer.git

# Duplicate for Web App
git clone --bare https://github.com/sys-MWell/lego-dimensions-nfc-writer.git
cd lego-dimensions-nfc-writer.git
git push --mirror https://github.com/YOUR-USERNAME/lego-dimensions-web-app.git
cd .. && rm -rf lego-dimensions-nfc-writer.git
```

## Clean Up Each Repository

### Console App
```bash
git clone https://github.com/YOUR-USERNAME/lego-dimensions-console-app.git
cd lego-dimensions-console-app

# Switch to console branch if you have one
git checkout your-console-branch
git branch -M main
git push -f origin main

# Remove web app files
git rm -r path/to/web-files
git commit -m "Remove web app files"
git push origin main

# Delete unwanted branches
git push origin --delete branch-to-delete
```

### Web App
```bash
git clone https://github.com/YOUR-USERNAME/lego-dimensions-web-app.git
cd lego-dimensions-web-app

# Switch to web branch if you have one
git checkout your-web-branch
git branch -M main
git push -f origin main

# Remove console app files
git rm -r path/to/console-files
git commit -m "Remove console app files"
git push origin main

# Delete unwanted branches
git push origin --delete branch-to-delete
```

## Checklist After Duplication

- [ ] Update README.md in each repository
- [ ] Update package files (package.json, etc.)
- [ ] Remove unnecessary branches
- [ ] Update repository settings on GitHub
- [ ] Test both repositories independently

## Need More Details?

See the [Full Repository Duplication Guide](REPOSITORY_DUPLICATION_GUIDE.md) for:
- Alternative methods (filter-branch, simple clone)
- Detailed explanations
- Troubleshooting tips
- History preservation options
