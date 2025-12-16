#!/bin/bash

# Script to copy markdown files from the root to Docusaurus docs folder

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR="$( cd "$SCRIPT_DIR/.." && pwd )"

# Create docs structure
mkdir -p "$SCRIPT_DIR/docs/strategy"
mkdir -p "$SCRIPT_DIR/docs/principles"
mkdir -p "$SCRIPT_DIR/docs/reference-architecture"

# Copy strategy files
cp "$ROOT_DIR/01-strategy"/*.md "$SCRIPT_DIR/docs/strategy/"

# Copy principles files
cp "$ROOT_DIR/02-principles"/*.md "$SCRIPT_DIR/docs/principles/"

# Copy reference architecture files
cp "$ROOT_DIR/03-reference-architecture"/*.md "$SCRIPT_DIR/docs/reference-architecture/"

# Copy supporting docs
cp "$ROOT_DIR/ABOUT.md" "$SCRIPT_DIR/docs/"
cp "$ROOT_DIR/STRUCTURE.md" "$SCRIPT_DIR/docs/"
cp "$ROOT_DIR/USAGE.md" "$SCRIPT_DIR/docs/"

# Fix links in supporting docs
python3 "$SCRIPT_DIR/fix-supporting-docs.py" "$SCRIPT_DIR/docs/ABOUT.md"
python3 "$SCRIPT_DIR/fix-supporting-docs.py" "$SCRIPT_DIR/docs/STRUCTURE.md"
python3 "$SCRIPT_DIR/fix-supporting-docs.py" "$SCRIPT_DIR/docs/USAGE.md"

# Copy root README.md as intro page and convert links
cat > "$SCRIPT_DIR/docs/intro.md" << 'HEADER'
---
sidebar_position: 1
slug: /
title: Server-Side Architecture Playbook
sidebar_label: Home
---

HEADER

# Append the README content
tail -n +2 "$ROOT_DIR/README.md" >> "$SCRIPT_DIR/docs/intro.md"

# Fix links in intro.md
python3 "$SCRIPT_DIR/fix-supporting-docs.py" "$SCRIPT_DIR/docs/intro.md"

echo "Documentation copied successfully!"
