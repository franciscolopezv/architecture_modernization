# Patterns by Layer

This folder contains detailed pattern documentation organized by architecture layer.

## Structure

Each pattern file provides:
- **When to use** - Context and scenarios
- **Implementation** - Concrete guidance with examples
- **Benefits** - Why this pattern helps
- **Trade-offs** - What you give up
- **Related patterns** - Cross-references

## Pattern Files

- **index.md** - Overview and navigation for all patterns
- **edge-patterns.md** - Gateway layer (security, rate limiting, validation)
- **bff-patterns.md** - Backend-for-Frontend layer (composition, shaping, policies)
- **domain-service-patterns.md** - Business logic layer (hexagonal, outbox, idempotency)
- **event-patterns.md** - Async layer (versioning, schema evolution, DLQs)
- **data-patterns.md** - Data layer (single writer, CQRS, projections)
- **resilience-patterns.md** - Cross-cutting (circuit breakers, retries, timeouts)

## Usage

These files are the **source of truth**. The `website/copy-docs.sh` script copies them to the Docusaurus site.

To update patterns:
1. Edit files in this folder (`03-reference-architecture/patterns/`)
2. Run `bash website/copy-docs.sh` to sync to Docusaurus
3. Commit both source and generated files

## Related Documentation

- [target-architecture.md](../target-architecture.md) - Complete reference architecture
- [patterns.md](../patterns.md) - High-level patterns overview
- [guardrails.md](../guardrails.md) - Rules for applying patterns
- [anti-patterns.md](../anti-patterns.md) - What to avoid
