# Project-Specific Duplication Example

This document provides a concrete example of how to duplicate this LEGO Dimensions NFC Writer repository, specifically tailored to this project's structure.

## Current Project Structure

```
lego-dimensions-nfc-writer/
├── src/
│   └── lib/          # Core crypto and password generation libraries
├── generator/        # Tag generation script
├── data/            # Character and vehicle mapping data
└── README.md
```

## Scenario: Splitting into Console App and Web App

### Assumptions

Let's assume you have:
- A `console-app` branch with command-line interface code
- A `web-app` branch with web interface code
- Both branches share the `src/lib/` directory (crypto libraries)
- Both branches share the `data/` directory (character/vehicle maps)

## Step-by-Step Example

### 1. Create New Repositories on GitHub

Create these two repositories:
- `lego-dimensions-console-app`
- `lego-dimensions-web-app`

Do NOT initialize them with any files.

### 2. Duplicate to Console App Repository

```bash
# Clone as bare repository
git clone --bare https://github.com/sys-MWell/lego-dimensions-nfc-writer.git
cd lego-dimensions-nfc-writer.git

# Mirror push to new console app repository
git push --mirror https://github.com/sys-MWell/lego-dimensions-console-app.git

# Clean up
cd ..
rm -rf lego-dimensions-nfc-writer.git
```

### 3. Set Up Console App Repository

```bash
# Clone the new console app repository
git clone https://github.com/sys-MWell/lego-dimensions-console-app.git
cd lego-dimensions-console-app

# If you have a console-app branch, checkout and make it main
git checkout console-app  # Replace with your actual branch name
git branch -M main
git push -f origin main

# Delete the web-app branch if it exists
git push origin --delete web-app  # Adjust branch name as needed

# If you have web-specific files to remove, do so:
# (Example - adjust paths to your actual structure)
# git rm -r web/
# git rm -r public/
# git rm index.html
# git commit -m "Remove web app files, keep console app only"
# git push origin main

# Update README for console app
cat > README.md << 'EOF'
# LEGO Dimensions NFC Writer - Console Application

Command-line tool for writing LEGO Dimensions NFC tags.

## Installation

```bash
npm install
```

## Usage

```bash
node generator/generateToyTag.js
```

Follow the prompts to enter:
1. NFC UID
2. Character or Vehicle ID

## Project Structure

- `src/lib/` - Core cryptographic libraries
  - `CharCrypto.js` - Character encryption
  - `PWDGen.js` - Password generation
  - `TEA.js` - TEA encryption
- `generator/` - Tag generation utilities
- `data/` - Character and vehicle data files

## Requirements

- Node.js 12.x or higher
- NFC reader/writer hardware

## License

[Your License Here]
EOF

git add README.md
git commit -m "Update README for console app"
git push origin main
```

### 4. Duplicate to Web App Repository

```bash
# Clone as bare repository again
git clone --bare https://github.com/sys-MWell/lego-dimensions-nfc-writer.git
cd lego-dimensions-nfc-writer.git

# Mirror push to new web app repository
git push --mirror https://github.com/sys-MWell/lego-dimensions-web-app.git

# Clean up
cd ..
rm -rf lego-dimensions-nfc-writer.git
```

### 5. Set Up Web App Repository

```bash
# Clone the new web app repository
git clone https://github.com/sys-MWell/lego-dimensions-web-app.git
cd lego-dimensions-web-app

# If you have a web-app branch, checkout and make it main
git checkout web-app  # Replace with your actual branch name
git branch -M main
git push -f origin main

# Delete the console-app branch if it exists
git push origin --delete console-app  # Adjust branch name as needed

# If you have console-specific files to remove, do so:
# (Example - adjust to your actual structure)
# git rm generator/generateToyTag.js  # If this is console-only
# git commit -m "Remove console-specific generator script"
# git push origin main

# Update README for web app
cat > README.md << 'EOF'
# LEGO Dimensions NFC Writer - Web Application

Web-based interface for writing LEGO Dimensions NFC tags.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Production Build

```bash
npm run build
```

## Project Structure

- `src/lib/` - Core cryptographic libraries
  - `CharCrypto.js` - Character encryption
  - `PWDGen.js` - Password generation
  - `TEA.js` - TEA encryption
- `data/` - Character and vehicle data files
- `public/` - Static web assets (if applicable)
- `web/` - Web interface components (if applicable)

## Features

- Browser-based NFC writing
- Character and vehicle selection
- Real-time tag generation

## Requirements

- Node.js 12.x or higher
- Modern web browser with Web NFC API support
- NFC reader/writer hardware

## License

[Your License Here]
EOF

git add README.md
git commit -m "Update README for web app"
git push origin main
```

## Shared Libraries Strategy

Since both repositories share the `src/lib/` and `data/` directories, you have several options:

### Option 1: Keep Copies in Both (Simplest)

Keep the shared code in both repositories. Update them manually when needed.

**Pros:**
- Simple to set up
- Each repository is self-contained
- No external dependencies

**Cons:**
- Must update in two places
- Code duplication

### Option 2: Extract to npm Package

Create a third repository for shared code:

```bash
# Create a new repository: lego-dimensions-core
# Move src/lib/ and data/ there
# Publish as npm package: @sys-mwell/lego-dimensions-core

# Then in both console and web repos:
npm install @sys-mwell/lego-dimensions-core

# Update imports:
# From: require('../src/lib/CharCrypto')
# To:   require('@sys-mwell/lego-dimensions-core/lib/CharCrypto')
```

**Pros:**
- Single source of truth
- Versioned releases
- Proper dependency management

**Cons:**
- More complex setup
- Requires npm package management
- Need to publish updates

### Option 3: Git Submodule

Create a shared repository and use it as a submodule:

```bash
# Create lego-dimensions-shared repository
# Add as submodule in both repos:
git submodule add https://github.com/sys-MWell/lego-dimensions-shared.git lib
```

**Pros:**
- Single source of truth
- Git-managed

**Cons:**
- Submodules can be complex
- Requires submodule update workflow

## Recommended Approach for This Project

For the LEGO Dimensions project, I recommend **Option 1** (keep copies) initially:

1. Both repositories keep their own copies of `src/lib/` and `data/`
2. If you find yourself frequently updating the shared code, consider Option 2
3. The crypto libraries (`CharCrypto.js`, `PWDGen.js`, `TEA.js`) are relatively stable
4. The data files (`charactermap.json`, `vehiclesmap.json`) are also relatively stable

## Post-Duplication Tasks

After splitting the repositories:

1. **Update package.json** (if it exists):
   - Change the name field
   - Update repository URLs
   - Update description

2. **Update Dependencies**:
   - Console app might need: `readline`, `fs`
   - Web app might need: web frameworks, build tools

3. **Set Up CI/CD** (if applicable):
   - Configure separate build pipelines
   - Update deployment configurations

4. **Documentation**:
   - Create separate documentation for each app
   - Update contribution guidelines
   - Update issue templates

5. **GitHub Settings**:
   - Configure branch protection rules
   - Add appropriate collaborators
   - Set up GitHub Actions workflows

## Testing the Split

After duplication, verify both repositories:

### Console App Test:
```bash
cd lego-dimensions-console-app
node generator/generateToyTag.js
# Verify it works correctly
```

### Web App Test:
```bash
cd lego-dimensions-web-app
npm run dev  # or your start command
# Open browser and verify it works
```

## Troubleshooting

### Problem: "Remote already exists"
```bash
git remote remove origin
git remote add origin [new-url]
```

### Problem: "Force push not allowed"
Temporarily enable force push in GitHub repository settings, or use:
```bash
git push origin main --force-with-lease
```

### Problem: Large repository size
If your repository is large, consider using `git filter-repo` to remove unnecessary history:
```bash
# Install git-filter-repo first
pip install git-filter-repo

# Remove history of unnecessary files
git filter-repo --path src/lib/ --path data/ --path generator/
```

## Need Help?

- See [REPOSITORY_DUPLICATION_GUIDE.md](REPOSITORY_DUPLICATION_GUIDE.md) for general duplication methods
- See [QUICK_DUPLICATION_REFERENCE.md](QUICK_DUPLICATION_REFERENCE.md) for quick command reference
- Check [GitHub's documentation on duplicating repositories](https://docs.github.com/en/repositories/creating-and-managing-repositories/duplicating-a-repository)
