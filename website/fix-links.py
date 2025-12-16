#!/usr/bin/env python3
"""Fix markdown links for Docusaurus"""

import re

# Read intro.md
with open('docs/intro.md', 'r') as f:
    content = f.read()

# Replace links
replacements = {
    '(01-strategy/prerequisites.md)': '(strategy/prerequisites)',
    '(01-strategy/vision.md)': '(strategy/vision)',
    '(01-strategy/team-topologies.md)': '(strategy/team-topologies)',
    '(01-strategy/maturity-model.md)': '(strategy/maturity-model)',
    '(03-reference-architecture/target-architecture.md)': '(reference-architecture/target-architecture)',
    '(../01-strategy/vision.md)': '(../strategy/vision)',
    '(../01-strategy/maturity-model.md)': '(../strategy/maturity-model)',
    '(../03-reference-architecture/target-architecture)': '(../reference-architecture/target-architecture)',
    '(01-strategy/maturity-model.md)': '(strategy/maturity-model)',
    '(02-principles/principles.md)': '(principles/principles)',
    '(02-principles/domain-ownership-guide.md)': '(principles/domain-ownership-guide)',
    '(02-principles/data-ownership-guide.md)': '(principles/data-ownership-guide)',
    '(02-principles/contract-first-guide.md)': '(principles/contract-first-guide)',
}

for old, new in replacements.items():
    content = content.replace(old, new)

# Write back
with open('docs/intro.md', 'w') as f:
    f.write(content)

print("Links fixed!")
