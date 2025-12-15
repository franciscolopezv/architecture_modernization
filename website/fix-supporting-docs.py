#!/usr/bin/env python3
"""
Fix links in supporting docs (ABOUT.md, STRUCTURE.md, USAGE.md) for Docusaurus.
Converts markdown links to Docusaurus-compatible paths.
"""

import re
import sys

def fix_links(content):
    """Fix markdown links to be Docusaurus-compatible."""
    
    # Fix links to strategy files: 01-strategy/file.md -> strategy/file
    content = re.sub(r'\[([^\]]+)\]\(01-strategy/([^)]+)\.md\)', r'[\1](strategy/\2)', content)
    
    # Fix links to principles files: 02-principles/file.md -> principles/file  
    content = re.sub(r'\[([^\]]+)\]\(02-principles/([^)]+)\.md\)', r'[\1](principles/\2)', content)
    
    # Fix principles/principles -> principles (the index page)
    content = re.sub(r'\[([^\]]+)\]\(principles/principles\)', r'[\1](principles)', content)
    
    # Fix links to LICENSE
    content = re.sub(r'\[([^\]]+)\]\(LICENSE\)', r'[\1](https://github.com/franciscolopezv/architecture_modernization/blob/main/LICENSE)', content)
    
    return content

def main():
    if len(sys.argv) != 2:
        print("Usage: fix-supporting-docs.py <file>")
        sys.exit(1)
    
    filepath = sys.argv[1]
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    fixed_content = fix_links(content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(fixed_content)
    
    print(f"Fixed links in {filepath}")

if __name__ == '__main__':
    main()
