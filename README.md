# Backend Modernization Playbook

This repository defines the **standard patterns, processes, and artefacts** for backend modernization.

It is intended as a **blueprint for teams** who need to:

- Move from legacy integration layers (ESBs, DataPower, WSB, code generators) to **domain APIs**.
- Introduce **event-driven architecture**, **modern observability**, and **safer deployments**.
- Standardize **how** we design, review, and migrate backend services.

> This repo is **technology-agnostic** at the documentation level. Concrete implementations (Helm charts, CI pipelines, etc.) can live in other repos but should reference patterns here.

## ⚠️ Prerequisites Required

**This playbook assumes your organization has completed organizational transformation using Team Topologies principles.** Specifically:

- **Domain discovery** has identified bounded contexts and domain boundaries
- **Teams are organized around domains**, not technical layers or projects
- **Platform and enabling teams** exist to support stream-aligned teams
- **Leadership supports** long-lived product teams and incremental modernization

**If these prerequisites are not met, start with [01-strategy/prerequisites.md](01-strategy/prerequisites.md) before proceeding.** Attempting backend modernization without organizational alignment will result in a distributed monolith.

## Structure

### 01-strategy/
Vision, prerequisites, team topologies, target architecture, and maturity model.
- [vision.md](01-strategy/vision.md) - Why modernize and target outcomes
- [prerequisites.md](01-strategy/prerequisites.md) - **Start here** - Organizational prerequisites required
- [team-topologies.md](01-strategy/team-topologies.md) - Team structure and domain alignment
- [target-architecture.md](01-strategy/target-architecture.md) - Reference architecture and technology options
- [maturity-model.md](01-strategy/maturity-model.md) - Assess current state and set targets

### 02-principles/
Architecture principles that guide decisions.
- [principles.md](02-principles/principles.md) - Core principles with examples
- [domain-ownership-guide.md](02-principles/domain-ownership-guide.md) - Identifying domain boundaries
- [data-ownership-guide.md](02-principles/data-ownership-guide.md) - Data sharing patterns
- [contract-first-guide.md](02-principles/contract-first-guide.md) - API and event contracts

### 03-process/
Step-by-step modernization process for teams.
- [modernization-process.md](03-process/modernization-process.md) - The main playbook

### 04-patterns/
Reusable architecture blueprints.
- [api-service-blueprint.md](04-patterns/api-service-blueprint.md) - REST/gRPC domain services
- [event-driven-blueprint.md](04-patterns/event-driven-blueprint.md) - Async event patterns
- [graphql-bff-blueprint.md](04-patterns/graphql-bff-blueprint.md) - GraphQL for channels
- [data-blueprint.md](04-patterns/data-blueprint.md) - Data modernization

### 05-templates/
Document templates for teams to copy.
- [system-inventory-template.md](05-templates/system-inventory-template.md) - Assess current systems
- [strangler-plan-template.md](05-templates/strangler-plan-template.md) - Plan incremental migration
- [adr-template.md](05-templates/adr-template.md) - Document architecture decisions

### 06-checklists/
Validation checklists for key gates.
- [architecture-review-checklist.md](06-checklists/architecture-review-checklist.md) - Before implementation
- [data-migration-checklist.md](06-checklists/data-migration-checklist.md) - For data migrations
- [pre-go-live-checklist.md](06-checklists/pre-go-live-checklist.md) - Before production

### 07-examples/
Worked examples from real domains (sanitized).
- [README.md](07-examples/README.md) - Placeholder for case studies

## How Teams Should Use This

### Before You Start

1. **Validate prerequisites** - Read [prerequisites.md](01-strategy/prerequisites.md) and ensure your organization has completed domain discovery and team reorganization. If not, pause and complete that work first.

### Getting Started

2. Start with [vision.md](01-strategy/vision.md) and [principles.md](02-principles/principles.md) to understand the target state.
3. Review [team-topologies.md](01-strategy/team-topologies.md) to validate your team structure supports independent flow.
4. Assess current systems using [maturity-model.md](01-strategy/maturity-model.md) to prioritize modernization efforts.
5. Use [modernization-process.md](03-process/modernization-process.md) as the **main playbook**.

### For Each Service/System

6. Fill [system-inventory-template.md](05-templates/system-inventory-template.md) to document current state.
7. Create [strangler-plan-template.md](05-templates/strangler-plan-template.md) for incremental migration.
8. Design using the relevant pattern:
   - [api-service-blueprint.md](04-patterns/api-service-blueprint.md) for domain APIs
   - [event-driven-blueprint.md](04-patterns/event-driven-blueprint.md) for async integration
   - [graphql-bff-blueprint.md](04-patterns/graphql-bff-blueprint.md) for channel aggregation
   - [data-blueprint.md](04-patterns/data-blueprint.md) for data modernization
9. Capture key decisions using [adr-template.md](05-templates/adr-template.md).
10. Run checklists:
    - [architecture-review-checklist.md](06-checklists/architecture-review-checklist.md) before implementation
    - [data-migration-checklist.md](06-checklists/data-migration-checklist.md) if migrating data
    - [pre-go-live-checklist.md](06-checklists/pre-go-live-checklist.md) before production

### Continuous Improvement

11. Contribute improvements via pull requests and ADRs.

---
