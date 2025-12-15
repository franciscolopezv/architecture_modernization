---
sidebar_position: 101
title: Repository Structure
---

# Repository Structure

This repository follows a numbered folder structure for sequential consumption.

## Folder Organization

### 01-strategy/ ✅ Complete

Vision, target architecture, maturity model, and team topologies.

- **vision.md** - What good architecture looks like and why it matters
- **target-architecture.md** - Reference architecture for server-side systems
  - Architecture layers (Edge, BFF, Domain Services, Events, Data, Platform)
  - Team alignment (how Team Topologies maps to architecture)
  - Technology guidance (decision frameworks for REST vs GraphQL, SQL vs NoSQL, etc.)
  - Migration path (4-phase approach from current to target state)
  - Success indicators (how to measure progress)
- **prerequisites.md** - Organizational prerequisites for multi-team environments (4+ teams)
  - Domain discovery and bounded contexts
  - Team reorganization around domains
  - Leadership support and funding
  - Conway's Law and distributed monolith anti-patterns
- **team-topologies.md** - Team structure and domain alignment
- **maturity-model.md** - Assess current state and set targets

### 02-principles/ ✅ Complete

Architecture principles that guide all design decisions.

- **principles.md** - Core principles with examples (main document)
  - Domain ownership
  - Contract-first design
  - Data ownership
  - Event-driven integration
  - Observability
  - And more...
- **domain-ownership-guide.md** - Identifying and validating domain boundaries (Principle 1)
- **data-ownership-guide.md** - Patterns for data sharing without coupling (Principle 8)
- **contract-first-guide.md** - API and event contract design with OpenAPI/AsyncAPI (Principle 2)

### 03-process/ 🚧 Coming Soon

Step-by-step modernization process.

- **modernization-process.md** - The main playbook: discover → design → implement → cutover → retire

### 04-patterns/ 🚧 Coming Soon

Reusable architecture blueprints.

- **api-service-blueprint.md** - REST/gRPC domain services
- **event-driven-blueprint.md** - Async event patterns
- **graphql-bff-blueprint.md** - GraphQL for channels
- **data-blueprint.md** - Data modernization patterns

Each pattern includes:
- Responsibilities and boundaries
- Architecture diagrams
- Design decisions and trade-offs
- Anti-patterns to avoid

### 05-templates/ 🚧 Coming Soon

Document templates for teams to copy into delivery repos.

- **adr-template.md** - Architecture Decision Records
- **strangler-plan-template.md** - Plan incremental migration
- **system-inventory-template.md** - Assess current systems

Teams duplicate these into delivery repos and fill them in.

### 06-checklists/ 🚧 Coming Soon

Validation checklists for key gates.

- **architecture-review-checklist.md** - Before implementation
- **data-migration-checklist.md** - For data migrations
- **pre-go-live-checklist.md** - Before production

Used at key gates in the modernization process.

### 07-examples/ 🚧 Coming Soon

Worked examples from real domains (sanitized).

- **README.md** - Overview of case studies
- **retail-modernization-case-study.md** - Architecture evolution journey

Currently empty, intended for future reference implementations.

---

## Documentation Conventions

- All files are Markdown with descriptive names
- Numbered folders indicate recommended reading order
- Templates are meant to be copied, not edited in place
- Patterns are referenced, not duplicated into delivery repos
- ADRs should be used to capture significant design decisions
- Checklists should be run at appropriate process gates

## Cross-References

When working with this playbook:
- Templates reference patterns and principles
- Process steps reference templates, patterns, and checklists
- All content ties back to the vision and principles

---

[← Back to Home](/)
