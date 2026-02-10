# Repository Duplication Guide

This guide explains how to duplicate your LEGO Dimensions NFC Writer repository and split it into two separate repositories: one for the console app and one for the web application.

## Overview

You have a single repository with branches for both a console app and a web application. This guide will help you create two independent repositories from your existing one.

## Prerequisites

- Git installed on your local machine
- GitHub account with appropriate permissions
- Command line/terminal access

## Method 1: Using GitHub's Repository Duplication Feature (Recommended)

### Step 1: Create New Empty Repositories on GitHub

1. Go to GitHub and create two new repositories:
   - `lego-dimensions-console-app` (or your preferred name)
   - `lego-dimensions-web-app` (or your preferred name)
2. **Important**: Do NOT initialize them with a README, .gitignore, or license

### Step 2: Duplicate Repository for Console App

```bash
# Clone the original repository as a bare repository
git clone --bare https://github.com/sys-MWell/lego-dimensions-nfc-writer.git

# Navigate into the cloned repository
cd lego-dimensions-nfc-writer.git

# Mirror-push to the new console app repository
git push --mirror https://github.com/YOUR-USERNAME/lego-dimensions-console-app.git

# Navigate back and clean up
cd ..
rm -rf lego-dimensions-nfc-writer.git
```

### Step 3: Duplicate Repository for Web App

```bash
# Clone the original repository as a bare repository again
git clone --bare https://github.com/sys-MWell/lego-dimensions-nfc-writer.git

# Navigate into the cloned repository
cd lego-dimensions-nfc-writer.git

# Mirror-push to the new web app repository
git push --mirror https://github.com/YOUR-USERNAME/lego-dimensions-web-app.git

# Navigate back and clean up
cd ..
rm -rf lego-dimensions-nfc-writer.git
```

### Step 4: Clean Up Each Repository

Now you have two identical copies. Clean them up to keep only relevant code:

#### For Console App Repository:

```bash
# Clone the console app repository
git clone https://github.com/YOUR-USERNAME/lego-dimensions-console-app.git
cd lego-dimensions-console-app

# Checkout the console app branch (if you have one)
git checkout console-app-branch  # Replace with your actual branch name

# Make this branch the main branch
git branch -M main
git push -f origin main

# Delete unwanted branches
git push origin --delete web-app-branch  # Replace with your web app branch name

# Remove web app specific files (example)
git rm -r web-app-folder/  # Replace with actual web app folders
git commit -m "Remove web app files, keep only console app"
git push origin main

# Optional: Update README for console app
# Edit README.md to describe the console app specifically
git add README.md
git commit -m "Update README for console app"
git push origin main
```

#### For Web App Repository:

```bash
# Clone the web app repository
git clone https://github.com/YOUR-USERNAME/lego-dimensions-web-app.git
cd lego-dimensions-web-app

# Checkout the web app branch (if you have one)
git checkout web-app-branch  # Replace with your actual branch name

# Make this branch the main branch
git branch -M main
git push -f origin main

# Delete unwanted branches
git push origin --delete console-app-branch  # Replace with your console app branch name

# Remove console app specific files (example)
git rm -r console-app-folder/  # Replace with actual console app folders
git commit -m "Remove console app files, keep only web app"
git push origin main

# Optional: Update README for web app
# Edit README.md to describe the web app specifically
git add README.md
git commit -m "Update README for web app"
git push origin main
```

## Method 2: Using Git Filter-Branch (Advanced)

If you want to preserve only specific files/folders in each repository and rewrite history:

### For Console App:

```bash
git clone https://github.com/sys-MWell/lego-dimensions-nfc-writer.git lego-dimensions-console-app
cd lego-dimensions-console-app

# Keep only console app related paths
git filter-branch --prune-empty --subdirectory-filter console-app-folder HEAD

# Or use filter-repo (more modern approach - requires git-filter-repo installation)
git filter-repo --path console-app-folder/ --path shared-lib/

# Update remote
git remote set-url origin https://github.com/YOUR-USERNAME/lego-dimensions-console-app.git
git push -u origin main
```

### For Web App:

```bash
git clone https://github.com/sys-MWell/lego-dimensions-nfc-writer.git lego-dimensions-web-app
cd lego-dimensions-web-app

# Keep only web app related paths
git filter-branch --prune-empty --subdirectory-filter web-app-folder HEAD

# Or use filter-repo
git filter-repo --path web-app-folder/ --path shared-lib/

# Update remote
git remote set-url origin https://github.com/YOUR-USERNAME/lego-dimensions-web-app.git
git push -u origin main
```

## Method 3: Simple Clone and Delete (Easiest)

This is the simplest method but keeps all git history:

### For Console App:

```bash
# Clone the original repository
git clone https://github.com/sys-MWell/lego-dimensions-nfc-writer.git lego-dimensions-console-app
cd lego-dimensions-console-app

# Remove the origin remote
git remote remove origin

# Add new remote for console app
git remote add origin https://github.com/YOUR-USERNAME/lego-dimensions-console-app.git

# Checkout your console app branch if it exists
git checkout console-app-branch  # or stay on main

# Delete web app files
rm -rf web-app-folder/  # Replace with actual paths
git add -A
git commit -m "Remove web app files"

# Push to new repository
git push -u origin main
```

### For Web App:

```bash
# Clone the original repository again
git clone https://github.com/sys-MWell/lego-dimensions-nfc-writer.git lego-dimensions-web-app
cd lego-dimensions-web-app

# Remove the origin remote
git remote remove origin

# Add new remote for web app
git remote add origin https://github.com/YOUR-USERNAME/lego-dimensions-web-app.git

# Checkout your web app branch if it exists
git checkout web-app-branch  # or stay on main

# Delete console app files
rm -rf console-app-folder/  # Replace with actual paths
git add -A
git commit -m "Remove console app files"

# Push to new repository
git push -u origin main
```

## Post-Duplication Checklist

After duplicating and cleaning up both repositories:

- [ ] Update README.md in each repository to reflect its specific purpose
- [ ] Update package.json, requirements.txt, or other dependency files if needed
- [ ] Update any hardcoded repository URLs in documentation or code
- [ ] Configure repository settings on GitHub (branch protection, collaborators, etc.)
- [ ] Update CI/CD pipelines if you have any
- [ ] Archive or delete branches you no longer need
- [ ] Update any external references to the old repository
- [ ] Test that both repositories work independently

## Important Notes

1. **Backup First**: Before starting, ensure you have a local backup of your repository
2. **Branch Names**: Replace `console-app-branch` and `web-app-branch` with your actual branch names
3. **Folder Names**: Replace `console-app-folder` and `web-app-folder` with your actual folder structures
4. **History**: Method 1 preserves all history. Method 2 rewrites history to include only relevant files
5. **Size**: If your repository is large, consider using Method 2 to reduce the size of each new repository

## Getting Your Branch Names

If you're unsure about your branch names:

```bash
cd lego-dimensions-nfc-writer
git branch -a
```

This will show all local and remote branches.

## Need Help?

If you encounter issues:
1. Check that your Git credentials are properly configured
2. Ensure you have push access to the new repositories
3. If force pushing is disabled, you may need to enable it temporarily in repository settings
4. Consider using GitHub Desktop or other Git GUI tools if you're uncomfortable with command line

## Alternative: Using GitHub Fork Feature

While not exactly duplication, you can also:
1. Fork your repository twice (using different accounts or organizations)
2. Rename each fork appropriately
3. Clean up the files in each fork

However, this keeps the fork relationship visible on GitHub, which might not be desired for truly independent projects.
