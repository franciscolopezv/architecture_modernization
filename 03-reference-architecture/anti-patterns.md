---
title: Anti-Patterns to Avoid
sidebar_position: 3
---

# Anti-Patterns to Avoid

This document describes common mistakes teams make when building distributed systems. Learn from others' pain.

---

## Distributed Monolith

**What it looks like:**
- Many microservices that must deploy together
- Breaking changes ripple across services
- Can't deploy one service without coordinating with others
- Shared database across services

**Why it happens:**
- Splitting by technical layers instead of business domains
- Tight coupling through shared data structures
- Synchronous call chains across services
- No versioning strategy for APIs

**How to avoid:**
- Define clear domain boundaries (see [domain-ownership-guide](../principles/domain-ownership-guide.md))
- Use versioned contracts (OpenAPI/AsyncAPI)
- Each service owns its data
- Prefer async communication for cross-domain workflows

**How to fix:**
- Identify domain boundaries
- Split shared databases
- Introduce API versioning
- Add event-driven integration

---

## Shared Database Coupling

**What it looks like:**
- Multiple services reading/writing same tables
- Schema changes break multiple services
- Race conditions and deadlocks
- Unclear data ownership

**Why it happens:**
- "It's easier to just query the database"
- Fear of data duplication
- Lack of clear service boundaries
- Legacy migration shortcuts

**How to avoid:**
- One writer per database (single ownership)
- Share data via APIs or events
- Accept some data duplication
- Use CQRS for read models

**How to fix:**
- Identify which service owns each table
- Migrate other services to use APIs/events
- Split database per service
- Use strangler pattern for gradual migration

---

## God Services

**What it looks like:**
- One service handling multiple unrelated domains
- Service has dozens of endpoints
- Team can't understand full codebase
- Changes in one area break unrelated features

**Why it happens:**
- "Let's just add it to the existing service"
- Fear of operational complexity
- Unclear domain boundaries
- Premature optimization (avoiding network calls)

**How to avoid:**
- One service per bounded context
- Keep services focused on single domain
- Split when service becomes too large
- Use domain-driven design

**How to fix:**
- Identify distinct domains within service
- Extract domains into separate services
- Use strangler pattern for gradual extraction
- Maintain backward compatibility during migration

---

## Synchronous Coupling

**What it looks like:**
- Long chains of synchronous API calls (A → B → C → D)
- Timeouts cascade across services
- One slow service makes everything slow
- Difficult to trace requests across services

**Why it happens:**
- "We need the data right now"
- Lack of async patterns knowledge
- Fear of eventual consistency
- Easier to implement initially

**How to avoid:**
- Use events for cross-domain workflows
- Keep sync call chains short (max 2-3 hops)
- Set aggressive timeouts
- Implement circuit breakers

**How to fix:**
- Identify workflows that can be async
- Introduce event-driven patterns
- Add circuit breakers and timeouts
- Use saga pattern for long-running workflows

---

## Platform as Bottleneck

**What it looks like:**
- Domain teams wait for platform team to provision resources
- Platform team does work "for" domain teams
- Tickets sit in queue for days/weeks
- Platform team is overwhelmed

**Why it happens:**
- Platform capabilities not self-service
- Lack of automation
- Manual approval processes
- Platform team treated as ops team

**How to avoid:**
- Build self-service capabilities
- Automate provisioning
- Provide golden paths with good defaults
- Platform team enables, not executes

**How to fix:**
- Identify most common requests
- Automate those workflows
- Provide self-service portal
- Measure time to provision

---

## No Observability

**What it looks like:**
- "Check the logs" debugging
- No correlation across services
- Can't tell which service is slow
- Alerts fire but no context

**Why it happens:**
- "We'll add observability later"
- Lack of standards across teams
- No platform support
- Cost concerns

**How to avoid:**
- Build observability from day one
- Use structured logging with correlation IDs
- Define SLOs for all services
- Provide observability platform

**How to fix:**
- Adopt OpenTelemetry
- Add correlation IDs to all logs
- Instrument critical paths
- Build dashboards for key metrics

---

## Big-Bang Migrations

**What it looks like:**
- "We'll switch everything over on Friday night"
- No rollback plan
- All-hands war room
- Production issues for days

**Why it happens:**
- Pressure to "finish the migration"
- Fear of running old and new in parallel
- Lack of incremental migration strategy
- Underestimating complexity

**How to avoid:**
- Use strangler pattern
- Migrate traffic gradually
- Run old and new in parallel
- Validate before full cutover

**How to fix:**
- Stop the big-bang plan
- Break into smaller increments
- Migrate one domain at a time
- Use feature flags for gradual rollout

---

## Premature Optimization

**What it looks like:**
- Complex caching before measuring performance
- Microservices for 2-person team
- Custom framework instead of standard tools
- Over-engineered for current scale

**Why it happens:**
- "We might need to scale to millions"
- Resume-driven development
- Fear of future problems
- Lack of measurement

**How to avoid:**
- Start simple, add complexity when needed
- Measure before optimizing
- Use standard tools and patterns
- Right-size for current scale

**How to fix:**
- Remove unused complexity
- Consolidate over-split services
- Replace custom code with standard tools
- Focus on current problems

---

## Missing Contracts

**What it looks like:**
- No API specs (OpenAPI/AsyncAPI)
- Breaking changes without warning
- Consumers break when producer changes
- Manual testing of integrations

**Why it happens:**
- "We'll document it later"
- Lack of contract-first discipline
- No tooling for contract testing
- Fast-moving development

**How to avoid:**
- Contract-first development (see [contract-first-guide](../principles/contract-first-guide.md))
- Generate code from specs
- Consumer-driven contract tests
- Version all contracts

**How to fix:**
- Create specs for existing APIs
- Add contract tests
- Introduce versioning
- Make specs required in CI

---

## Ignoring Failure Scenarios

**What it looks like:**
- No timeouts on external calls
- No circuit breakers
- No retry logic
- Assumes network is reliable

**Why it happens:**
- "It works in dev"
- Lack of chaos engineering
- No failure testing
- Optimistic assumptions

**How to avoid:**
- Test failure scenarios
- Set timeouts on all calls
- Implement circuit breakers
- Practice chaos engineering

**How to fix:**
- Add timeouts and circuit breakers
- Test with failures injected
- Build resilience patterns
- Monitor failure rates

---

## Data Ownership Confusion

**What it looks like:**
- Multiple teams modifying same data
- Unclear who to ask about data quality
- Conflicting business rules
- Race conditions and inconsistencies

**Why it happens:**
- Shared database anti-pattern
- Unclear domain boundaries
- Legacy data model
- "Everyone needs this data"

**How to avoid:**
- Clear data ownership per domain (see [data-ownership-guide](../principles/data-ownership-guide.md))
- One writer per data entity
- Share via APIs or events
- Document ownership in data catalog

**How to fix:**
- Assign ownership to teams
- Migrate to owned databases
- Establish data contracts
- Use events for data distribution

---

## How to Use This Document

**When designing:**
- Review anti-patterns before starting
- Check if your design exhibits any patterns
- Discuss with team if you see warning signs

**During code review:**
- Watch for anti-patterns creeping in
- Call them out early
- Suggest alternatives

**In postmortems:**
- Check if anti-patterns contributed to incident
- Update this document with new learnings
- Share across teams

**Remember:** These are patterns to avoid, but sometimes you have valid reasons to break the rules. Document your reasoning in an ADR and revisit regularly.

---

## Next Steps

- Review your current architecture for anti-patterns
- Prioritize which to address first
- Create plan to remediate
- Share learnings with other teams

**Related:**
- [Patterns](patterns.md) - What to do instead
- [Guardrails](guardrails.md) - Rules to prevent anti-patterns
