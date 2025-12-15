---
sidebar_position: 102
title: How to Use This Playbook
---

# How to Use This Playbook

## Before You Start

### For Multi-Team Organizations (4+ teams)

If you have multiple teams working on interconnected systems, **organizational alignment is critical.**

Read [prerequisites.md](01-strategy/prerequisites.md) first to ensure:
- Domain discovery has identified bounded contexts
- Teams are organized around domains (not technical layers or projects)
- Clear ownership exists for services and data
- Leadership supports incremental modernization

**Without this foundation, you risk creating a distributed monolith** - microservices with all the complexity but none of the benefits.

### For Small Teams (1-3 teams)

You can skip the organizational prerequisites and go directly to the patterns and principles. You likely already have clear ownership.

---

## Getting Started

### 1. Understand the Vision

Start with [vision.md](01-strategy/vision.md) to understand:
- What good architecture looks like
- Why it matters (business impact)
- Target outcomes (faster delivery, better reliability, reduced risk)
- Success metrics

### 2. See the Reference Architecture

Review [target-architecture.md](01-strategy/target-architecture.md) to understand the **reference architecture**:

**Why this matters:**
- Provides a north star - all teams work toward the same architectural vision
- Guides decisions - when choosing patterns or technologies, reference the target state
- Enables incremental progress - shows how to get there in phases (12-36 months)
- Aligns teams - shows how Team Topologies maps to architecture layers
- Prevents distributed monoliths - clear boundaries and ownership prevent common anti-patterns

**What you'll learn:**
- Architecture layers (Edge, BFF, Domain Services, Events, Data, Platform)
- Team alignment (how stream-aligned and platform teams map to the architecture)
- Technology guidance (decision frameworks for choosing technologies)
- Migration path (4-phase approach from current to target state)
- Success indicators (how to measure when you've achieved the target)

### 3. Learn the Principles

Read [principles.md](02-principles/principles.md) to understand the design principles that guide all decisions:
- Domain ownership
- Contract-first design
- Data ownership
- Event-driven integration
- Observability
- And more...

### 4. Validate Team Structure

Review [team-topologies.md](01-strategy/team-topologies.md) to ensure your team structure supports independent flow:
- Stream-aligned teams own domains end-to-end
- Platform teams provide self-service capabilities
- Clear interaction modes (X-as-a-Service, collaboration, facilitating)

### 5. Assess Current State

Use [maturity-model.md](01-strategy/maturity-model.md) to:
- Evaluate where you are today
- Identify gaps
- Prioritize improvements
- Set realistic targets

### 6. Deep Dive into Principles

Study the detailed guides:
- [domain-ownership-guide.md](02-principles/domain-ownership-guide.md) - How to identify domain boundaries
- [data-ownership-guide.md](02-principles/data-ownership-guide.md) - Patterns for data sharing
- [contract-first-guide.md](02-principles/contract-first-guide.md) - API and event design

---

## Rollout Guidance

### Phase 1: Foundation (Months 1-6)

**For modernization:**
- Establish platform capabilities (CI/CD, observability)
- Deploy API gateway and identity provider
- Identify first domain for modernization
- Form first stream-aligned team

**For greenfield:**
- Set up platform capabilities
- Define domain boundaries
- Establish patterns and standards
- Create first service with reference architecture

### Phase 2: First Domain (Months 3-12)

**For modernization:**
- Build first domain service with owned database
- Implement outbox pattern for events
- Create BFF for one channel
- Strangler legacy for this domain
- Validate patterns and adjust

**For greenfield:**
- Build core domains
- Establish event backbone
- Create BFFs for channels
- Validate patterns work at scale

### Phase 3: Scale (Months 6-24)

- Modernize/build additional domains in parallel
- Establish event backbone (if not done)
- Build read models and projections
- Expand BFF coverage
- Decommission legacy components (modernization)

### Phase 4: Optimize (Months 18-36)

- Refine domain boundaries based on learnings
- Optimize performance and cost
- Mature platform capabilities
- Complete legacy decommissioning (modernization)
- Focus on operational excellence

---

## Continuous Improvement

### Contribution Model

Improvements should be submitted via pull requests with supporting ADRs for significant changes.

**What to contribute:**
- Corrections and clarifications
- Additional examples and case studies
- New patterns discovered in practice
- Lessons learned from implementation
- Updates based on technology evolution

### Feedback Loop

- Use GitHub Issues for questions and discussions
- Share your experiences (what worked, what didn't)
- Propose improvements based on real-world learnings
- Help others by answering questions

---

## Common Pitfalls

### Modernization Without Prerequisites

**Problem:** Trying to modernize without organizational alignment (domain discovery, team reorganization, leadership support).

**Result:** Distributed monolith - services exist but can't deploy independently, slower than before.

**Solution:** Read [prerequisites.md](01-strategy/prerequisites.md) and address gaps before building services.

### Technology Before Organization

**Problem:** Adopting microservices while keeping feature teams (not domain teams).

**Result:** Conway's Law - unclear team boundaries create unclear service boundaries.

**Solution:** Fix team structure first ([team-topologies.md](01-strategy/team-topologies.md)), then modernize architecture.

### Big-Bang Rewrites

**Problem:** Trying to rebuild everything at once.

**Result:** Long delays, high risk, business value stalls.

**Solution:** Use strangler pattern - wrap, replace, retire incrementally. One domain at a time.

### Ignoring Data Ownership

**Problem:** Building microservices but keeping shared databases.

**Result:** Tight coupling through data, can't deploy independently.

**Solution:** Each service owns its data ([data-ownership-guide.md](02-principles/data-ownership-guide.md)). Share via APIs or events.

---

[← Back to Home](/)
