---
title: Guardrails for Teams
sidebar_position: 2
---

# Guardrails for Teams

These are non-negotiable rules that keep the architecture healthy. Follow them when designing and building services.

---

## Domain Boundaries

**One team owns each domain service**
- Clear accountability for service health
- Team makes all decisions about implementation
- No shared ownership or matrix management

**No shared databases across domains**
- Each service owns its data store
- Prevents coupling and conflicting updates
- Enables independent deployment

**Share data via APIs or events, never direct DB access**
- Other services call your API or consume your events
- You control the contract and can evolve it
- Database schema is an implementation detail

---

## Contracts

**Every API has OpenAPI spec**
- Spec is source of truth, not documentation
- Generate client SDKs from spec
- Validate requests/responses against spec

**Every event has AsyncAPI spec**
- Define event schema and metadata
- Version events with semantic versioning
- Validate events against schema before publishing

**Version all contracts (semantic versioning)**
- Major version for breaking changes (v2.0.0)
- Minor version for backward-compatible additions (v1.1.0)
- Patch version for bug fixes (v1.0.1)

**Breaking changes require major version bump**
- Removing fields is breaking
- Changing field types is breaking
- Renaming fields is breaking
- Support old version during migration period

---

## Communication

**Prefer async (events) for cross-domain workflows**
- Events decouple producer and consumer
- Consumers can process at their own pace
- Natural audit trail of business events

**Use sync (APIs) only for critical paths with strict SLAs**
- User-facing operations that need immediate response
- Operations where eventual consistency is not acceptable
- Keep sync call chains short (max 2-3 hops)

**Set timeouts on all external calls**
- Every HTTP call has timeout
- Every message consumer has processing timeout
- Timeout < SLO for the operation

**Implement circuit breakers for resilience**
- Track failure rate for each dependency
- Open circuit after threshold
- Fail fast when circuit open

---

## Data

**One writer per database (single ownership)**
- Only the owning service writes to its database
- Prevents conflicting updates and race conditions
- Clear accountability for data quality

**Use CQRS when read/write patterns diverge significantly**
- Write model optimized for commands
- Read model optimized for queries
- Sync via events or CDC

**Publish events for all state changes**
- Other services need to know about changes
- Events enable building projections
- Provides audit trail

**Make consumers idempotent**
- Handle duplicate events gracefully
- Track processed event IDs
- Use database constraints to prevent duplicates

---

## Operability

**Expose health and readiness endpoints**
- Health: Is the service running?
- Readiness: Can it handle traffic?
- Used by load balancers and orchestrators

**Define SLOs with error budgets**
- Set target for availability (e.g., 99.9%)
- Track error budget consumption
- Slow down releases when budget exhausted

**Emit structured logs with correlation IDs**
- JSON format for easy parsing
- Include correlation ID in every log line
- Propagate correlation ID across service boundaries

**Provide runbooks for common issues**
- Document how to diagnose problems
- Include commands for investigation
- Link to dashboards and alerts

---

## Deployment

**Use progressive delivery (canary, blue/green)**
- Deploy to small percentage of traffic first
- Monitor SLOs during rollout
- Automatic rollback if SLOs violated

**No big-bang cutovers**
- Migrate traffic gradually
- Run old and new in parallel
- Validate before full cutover

**Keep rollback capability**
- Database migrations are backward-compatible
- Can deploy previous version at any time
- Test rollback procedure regularly

**Monitor SLOs during rollout**
- Watch error rate, latency, throughput
- Compare to baseline
- Stop rollout if degradation detected

---

## Security

**Validate all inputs**
- Check against schema
- Sanitize user input
- Reject malformed requests early

**Never trust internal network**
- Verify JWT tokens on every request
- Use mTLS for service-to-service calls
- Encrypt data in transit and at rest

**Principle of least privilege**
- Services have minimal permissions
- Use service accounts, not user accounts
- Rotate credentials regularly

**Audit sensitive operations**
- Log who did what when
- Include correlation IDs
- Retain logs for compliance period

---

## Testing

**Test contracts, not implementations**
- Consumer-driven contract tests
- Verify API spec matches implementation
- Test event schema compatibility

**Test failure scenarios**
- What happens when dependency fails?
- What happens when timeout exceeded?
- What happens when circuit breaker opens?

**Test idempotency**
- Send same request twice
- Verify same result
- No duplicate side effects

**Test observability**
- Verify logs are structured
- Verify metrics are emitted
- Verify traces are propagated

---

## When to Break the Rules

These guardrails are strong defaults, but not absolute laws. You can break them if:

1. **You have a good reason** - Document in ADR
2. **You understand the tradeoffs** - What are you giving up?
3. **You have team consensus** - Not a solo decision
4. **You have a plan to revisit** - Set a date to review

**Example valid exceptions:**
- Shared read-only reference data (currencies, countries)
- Temporary direct DB access during migration
- Synchronous calls within same bounded context

**Document exceptions in ADRs and revisit regularly.**

---

## Enforcement

**How we ensure compliance:**

**Automated checks:**
- CI pipeline validates OpenAPI/AsyncAPI specs exist
- Linters check for correlation IDs in logs
- Tests verify health/readiness endpoints

**Architecture reviews:**
- Use architecture review checklist (coming soon in checklists section)
- Review before major releases
- Focus on guardrail compliance

**Metrics and dashboards:**
- Track services without specs
- Track services without SLOs
- Track services with shared databases

**Blameless postmortems:**
- When incidents happen, check if guardrails were followed
- Update guardrails based on learnings
- Share lessons across teams

---

## Next Steps

- Review guardrails with your team
- Check current services for compliance
- Create plan to address gaps
- Automate checks in CI pipeline

**Related:**
- [Patterns](patterns.md) - How to implement guardrails
- [Anti-Patterns](anti-patterns.md) - What happens when you ignore guardrails
