#!/usr/bin/env python3
"""Fix markdown links for Docusaurus"""

import re
import sys

# Replace links
replacements = {
    '(01-strategy/prerequisites.md)': '(strategy/prerequisites)',
    '(01-strategy/prerequisites)': '(strategy/prerequisites)',
    '(01-strategy/vision.md)': '(strategy/vision)',
    '(01-strategy/vision)': '(strategy/vision)',
    '(01-strategy/vision#monolith-or-microservices)': '(strategy/vision#monolith-or-microservices)',
    '(01-strategy/team-topologies.md)': '(strategy/team-topologies)',
    '(01-strategy/team-topologies)': '(strategy/team-topologies)',
    '(01-strategy/maturity-model.md)': '(strategy/maturity-model)',
    '(01-strategy/maturity-model)': '(strategy/maturity-model)',
    '(03-reference-architecture/target-architecture.md)': '(reference-architecture/target-architecture)',
    '(03-reference-architecture/target-architecture)': '(reference-architecture/target-architecture)',
    '(../01-strategy/vision.md)': '(../strategy/vision)',
    '(../01-strategy/maturity-model.md)': '(../strategy/maturity-model)',
    '(../03-reference-architecture/target-architecture)': '(../reference-architecture/target-architecture)',
    '(02-principles/principles.md)': '(principles/principles)',
    '(02-principles/principles)': '(principles/principles)',
    '(02-principles/domain-ownership-guide.md)': '(principles/domain-ownership-guide)',
    '(02-principles/domain-ownership-guide)': '(principles/domain-ownership-guide)',
    '(02-principles/data-ownership-guide.md)': '(principles/data-ownership-guide)',
    '(02-principles/data-ownership-guide)': '(principles/data-ownership-guide)',
    '(02-principles/contract-first-guide.md)': '(principles/contract-first-guide)',
}

# Get filename from command line argument
if len(sys.argv) > 1:
    filename = sys.argv[1]
else:
    filename = 'docs/intro.md'

# Read file
with open(filename, 'r') as f:
    content = f.read()

# Apply replacements
for old, new in replacements.items():
    content = content.replace(old, new)

# Write back
with open(filename, 'w') as f:
    f.write(content)

print(f"Fixed links in {filename}")
