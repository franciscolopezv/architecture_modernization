# Server-Side Architecture Principles

These principles guide design decisions for server-based applications. They're based on experience across multiple projects, but they're not absolute rules - your context matters.

> **How to use**: When facing a design decision, consider which option aligns with these principles. Document trade-offs in an ADR when principles conflict. Adapt these principles to your context.

---

## 1. Domain First

**Principle**: Align services to business domains and capabilities, not technical layers or shared integration hubs.

**What this means:**
- Services represent business capabilities (Payments, Customer, Orders) not technical functions (Database Service, API Layer)
- Each domain has clear boundaries and owns its business rules
- Avoid "god services" that try to do everything for everyone

**Example - Good:**
```
PaymentService owns:
- Payment processing logic
- Payment status and history
- Payment validation rules
- Payment data store
```

**Example - Bad:**
```
IntegrationService handles:
- Payment calls
- Customer lookups  
- Order updates
- Notification sending
→ No clear domain, becomes a bottleneck
```

**When to apply**: This is foundational to good architecture.

**See also**: `domain-ownership-guide.md` for identifying and validating domain boundaries

---

## 2. APIs and Events as Contracts

**Principle**: APIs (OpenAPI) and events (AsyncAPI) are versioned contracts between teams. Breaking changes are deliberate and managed.

**What this means:**
- Every API has an OpenAPI specification in source control
- Every event has an AsyncAPI specification with schema
- Consumers depend on these contracts, not implementation details
- Changes follow semantic versioning (major.minor.patch)
- Breaking changes require coordination and migration plans

**Example - Good:**
```yaml
# OpenAPI spec versioned in git
/api/v1/payments/{id}:
  get:
    responses:
      200:
        schema: PaymentResponse
        
# Adding optional field = minor version (backward compatible)
# Removing field = major version (breaking change)
```

**Example - Bad:**
- No API spec, consumers reverse-engineer from code
- Changes deployed without version bump
- Consumers break unexpectedly

**When to apply**: Every API and event should have a contract.

**See also**: `contract-first-guide.md` for versioning strategies

---

## 3. Business Rules Live in Services

**Principle**: Domain services own business logic. Gateways, BFFs, and GraphQL layers compose and orchestrate but don't implement business rules.

**What this means:**
- Business invariants (validation, calculations, state transitions) live in domain services
- BFFs/GraphQL resolvers call domain services and aggregate responses
- Gateways handle cross-cutting concerns (auth, rate limiting, routing) not business logic

**Example - Good:**
```
GraphQL Resolver (BFF):
  → Calls PaymentService.createPayment()
  → Calls CustomerService.getCustomer()
  → Aggregates response for UI

PaymentService:
  → Validates payment amount and currency
  → Checks fraud rules
  → Updates payment state
  → Persists to database
```

**Example - Bad:**
```
GraphQL Resolver:
  → Validates payment amount (business rule!)
  → Directly writes to payment database
  → Implements fraud checks
→ Business logic duplicated across BFFs
```

**When to apply**: Keep orchestration separate from business logic.

**See also**: `04-patterns/graphql-bff-blueprint.md`

---

## 4. Secure by Default

**Principle**: Security is built-in from the start, not added later.

**What this means:**
- Least privilege: services only access what they need
- Identity propagated end-to-end (JWT, mTLS)
- Sensitive data (PII, PCI) masked, encrypted, or minimized
- Secrets never in code or config files
- Security reviews before production

**Example - Good:**
```
Request flow:
1. Gateway validates JWT
2. Gateway propagates user context to BFF
3. BFF calls PaymentService with user context
4. PaymentService checks authorization for this user
5. Logs mask PAN (card number)
```

**Example - Bad:**
- Services trust all internal calls (no authz checks)
- PII logged in plaintext
- Database passwords in environment variables
- No audit trail of who accessed what

**When to apply**: Security should be built-in from the start.

**See also**: `security-checklist.md` (to be created)

---

## 5. Observable by Design

**Principle**: Every service exposes logs, metrics, and traces. SLOs are defined and monitored.

**What this means:**
- Structured logs with correlation IDs
- Metrics for key operations (latency, error rate, throughput)
- Distributed traces across service boundaries
- SLOs defined (e.g., "99.9% of requests < 500ms")
- Dashboards and alerts for SLO violations

**Example - Good:**
```
Service emits:
- Logs: {"level":"info","correlationId":"abc123","operation":"createPayment","duration":245}
- Metrics: payment_requests_total, payment_duration_ms
- Traces: spans for DB calls, external API calls
- SLO: 99.5% availability, p95 latency < 500ms
```

**Example - Bad:**
- Logs only say "error occurred"
- No way to trace request across services
- No metrics, only "check the logs"
- No SLOs, just "make it fast"

**When to apply**: Build observability in from the start.

**See also**: `observability-guide.md` for implementation patterns

---

## 6. Strangler, Not Big-Bang

**Principle**: Prefer incremental replacement of functionality. Wrap legacy systems and retire them in slices.

**What this means:**
- Don't rewrite everything at once
- Introduce new services alongside legacy
- Route traffic gradually (reads first, then writes)
- Keep fallback to legacy until confidence is high
- Decommission legacy in phases

**Example - Good:**
```
Phase 1: New API wraps legacy (read-only)
Phase 2: New API handles new use cases
Phase 3: Migrate 20% of traffic to new API
Phase 4: Migrate 80% of traffic
Phase 5: Decommission legacy
Timeline: 12-18 months
```

**Example - Bad:**
```
"Stop all feature work for 12 months"
"Rewrite everything from scratch"
"Big-bang cutover on go-live weekend"
→ High risk, long feedback loop, likely failure
```

**When to apply**: When replacing existing systems, prefer incremental approaches.

**See also**: `05-templates/strangler-plan-template.md`

---

## 7. Paved Roads Over Custom Paths

**Principle**: Provide standard templates and patterns. Exceptions are allowed but documented and time-boxed.

**What this means:**
- Platform teams provide golden paths (CI/CD, observability, service templates)
- Stream-aligned teams use these by default
- Custom solutions require justification (ADR) and have expiration dates
- Reduces cognitive load and maintenance burden

**Example - Good:**
```
Platform provides:
- Service template with observability built-in
- Standard CI/CD pipeline
- Approved libraries and frameworks

Team uses template:
- Gets observability, security, CI/CD for free
- Focuses on business logic
- Can deploy in days, not weeks
```

**Example - Bad:**
```
Every team:
- Builds their own CI/CD
- Chooses different logging libraries
- Implements custom auth
→ High cognitive load, hard to support
```

**When to apply**: Standard patterns reduce cognitive load. Exceptions should be documented with justification.

**See also**: `01-strategy/team-topologies.md` (platform capabilities)

---

## 8. Data Ownership and Locality

**Principle**: Each service owns its data. Cross-service data is shared via APIs/events, not direct database access.

**What this means:**
- One service writes to a data store (single writer principle)
- Other services read via APIs or consume events
- No shared databases across services
- Data duplication is acceptable for autonomy

**Example - Good:**
```
PaymentService:
- Owns payment_db
- Exposes GET /payments/{id} API
- Publishes PaymentCreated event

OrderService:
- Calls PaymentService API to check status
- OR subscribes to PaymentCreated event
- Maintains own copy if needed (eventual consistency)
```

**Example - Bad:**
```
PaymentService writes to payment_db
OrderService reads directly from payment_db
→ Tight coupling, schema changes break OrderService
```

**When to apply**: Avoid shared databases across services. Each service should own its data.

**See also**: `data-ownership-guide.md` for patterns (CQRS, event sourcing, CDC)

---

## 9. Compliance and Sovereignty Built-In

**Principle**: Data residency, retention, and privacy requirements are part of design, not afterthoughts.

**What this means:**
- Know where data lives (region, jurisdiction)
- Know how long data is kept (retention policies)
- Know who can access data (privacy, consent)
- Design for GDPR, PCI-DSS, SOX, etc. from the start

**Example - Good:**
```
Design phase:
- EU customer data stays in EU region
- PCI data encrypted at rest and in transit
- PII has 7-year retention, then auto-deleted
- Audit logs for all access
```

**Example - Bad:**
```
After launch:
- "This system needs to support GDPR right-to-deletion"
- "EU customer data is being stored in US region"
- Expensive retrofit, potential fines
```

**When to apply**: Design for compliance requirements from the start.

**See also**: `06-checklists/architecture-review-checklist.md`

---

## Using These Principles

### In Design Reviews
Ask for each principle:
- ✅ Does this design align?
- ⚠️ Are there trade-offs?
- ❌ Does this violate the principle?

Document trade-offs in ADRs.

### When Principles Conflict
Example: "Data ownership" says no shared DB, but "strangler" says wrap legacy DB.

Resolution:
- Short-term: Wrap legacy DB (strangler wins)
- Long-term: Migrate to owned DB (data ownership wins)
- Document in ADR with timeline

### Exceptions
Sometimes you need to break a principle. That's okay if:
1. You document why (ADR)
2. You set a sunset date
3. You have a plan to fix it

**Example**: "Sharing a database during Phase 1 of strangler migration. Will decouple by Q3 2026."

---

## Detailed Guides

For deeper dives, see:
- `domain-ownership-guide.md` - How to identify and enforce domain boundaries
- `contract-first-guide.md` - API and event versioning strategies
- `data-ownership-guide.md` - Patterns for data sharing without coupling
- `observability-guide.md` - Implementing logs, metrics, traces, and SLOs

These guides provide concrete examples, code snippets, and anti-patterns.

