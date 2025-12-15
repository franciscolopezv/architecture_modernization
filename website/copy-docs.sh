#!/bin/bash

# Script to copy markdown files from the root to Docusaurus docs folder

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR="$( cd "$SCRIPT_DIR/.." && pwd )"

# Create docs structure
mkdir -p "$SCRIPT_DIR/docs/strategy"
mkdir -p "$SCRIPT_DIR/docs/principles"

# Copy strategy files
cp "$ROOT_DIR/01-strategy"/*.md "$SCRIPT_DIR/docs/strategy/"

# Copy principles files
cp "$ROOT_DIR/02-principles"/*.md "$SCRIPT_DIR/docs/principles/"

# Copy root README.md as intro page and convert links
cat > "$SCRIPT_DIR/docs/intro.md" << 'HEADER'
---
sidebar_position: 1
slug: /
---

HEADER

# Append the README content and convert markdown links to Docusaurus format
tail -n +2 "$ROOT_DIR/README.md" | \
  sed 's|\[prerequisites\.md\](01-strategy/prerequisites\.md)|[prerequisites.md](strategy/prerequisites)|g' | \
  sed 's|\[target-architecture\.md\](01-strategy/target-architecture\.md)|[target-architecture.md](strategy/target-architecture)|g' | \
  sed 's|\[vision\.md\](01-strategy/vision\.md)|[vision.md](strategy/vision)|g' | \
  sed 's|\[team-topologies\.md\](01-strategy/team-topologies\.md)|[team-topologies.md](strategy/team-topologies)|g' | \
  sed 's|\[maturity-model\.md\](01-strategy/maturity-model\.md)|[maturity-model.md](strategy/maturity-model)|g' | \
  sed 's|\[principles\.md\](02-principles/principles\.md)|[principles.md](principles/principles)|g' | \
  sed 's|\[domain-ownership-guide\.md\](02-principles/domain-ownership-guide\.md)|[domain-ownership-guide.md](principles/domain-ownership-guide)|g' | \
  sed 's|\[data-ownership-guide\.md\](02-principles/data-ownership-guide\.md)|[data-ownership-guide.md](principles/data-ownership-guide)|g' | \
  sed 's|\[contract-first-guide\.md\](02-principles/contract-first-guide\.md)|[contract-first-guide.md](principles/contract-first-guide)|g' \
  >> "$SCRIPT_DIR/docs/intro.md"

echo "Documentation copied successfully!"
