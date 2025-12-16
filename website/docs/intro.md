---
sidebar_position: 1
slug: /
title: Server-Side Architecture Playbook
sidebar_label: Home
---


Patterns, processes, and principles for designing and evolving server-side architecture—whether you're building new systems, modernizing legacy, or fixing a distributed monolith.

>
**Core topics:** Domain-driven design • Contract-first APIs • Event-driven architecture • Data ownership • Observability • Team organization
>
> **Technology-agnostic guidance** based on real-world experience. Not a silver bullet—use what fits your context and adapt the rest. 
> [About this playbook →](ABOUT)

---

## Start here

### Pick your situation

**🌱 Building a greenfield service**  
Start with [Vision](strategy/vision) → Principles section → [Target architecture](reference-architecture/target-architecture).  
Then baseline with the [Maturity model](strategy/maturity-model).

**🔧 Modernizing one slice of a monolith**  
Start with [Domain ownership](principles/domain-ownership-guide) → [Data ownership](principles/data-ownership-guide) → [Target architecture](reference-architecture/target-architecture).  
If you have 4+ teams, read [Prerequisites](strategy/prerequisites) first. Baseline with the [Maturity model](strategy/maturity-model).

**🚨 Fixing a distributed monolith**  
Start with [Team Topologies](strategy/team-topologies) → [Prerequisites](strategy/prerequisites) → [Domain ownership](principles/domain-ownership-guide).  
Then use the [Maturity model](strategy/maturity-model) to identify the highest-leverage fixes.

---

## What’s inside

- [`01-strategy/`](strategy/vision) vision, prerequisites, team topologies, maturity model
- [`02-principles/`](principles/domain-ownership-guide) domain ownership, data ownership, contract-first guidance
- [`03-reference-architecture/`](reference-architecture/target-architecture) target architecture, patterns, guardrails, anti-patterns
- `04-07/` process, templates, checklists, examples (in progress)

Full structure: [STRUCTURE →](STRUCTURE)

---

## Who this is for

- **Small teams (1–2 teams):** default to a **modular monolith** and apply the same principles (boundaries, contracts, ownership, observability).  
  Details: see [Vision](strategy/vision#monolith-or-microservices).
- **Growing teams (3–5 teams):** consider services when you need independent deployment and domain boundaries are clear.
- **Medium/large orgs (6+ teams):** start with [Prerequisites](strategy/prerequisites) to avoid distributed monoliths.

If you’re rolling this out across teams: [How to use this in an organization →](USAGE)

---

## Contributing

Improvements welcome via pull requests. Use ADRs for significant changes.

---

## License

[MIT License](https://github.com/franciscolopezv/architecture_modernization/blob/main/LICENSE)
