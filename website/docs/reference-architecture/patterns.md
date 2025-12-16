---
title: Core Patterns by Layer
sidebar_position: 1
---

# Core Patterns by Layer

This document describes proven patterns for each architecture layer. Use these as building blocks when designing services.

---

## Edge Patterns

**Zero-trust security**: Validate every request, never trust internal network
- Verify JWT tokens at the gateway
- Check client certificates for partner APIs
- Log all authentication attempts

**JWT validation**: Verify tokens at gateway, propagate claims downstream
- Validate signature and expiration
- Extract user/client claims
- Pass claims in headers to backend services

**Rate limiting**: Per-client quotas to prevent abuse
- Track requests per client ID
- Return 429 when quota exceeded
- Provide quota headers in responses

**Request validation**: Reject malformed requests early
- Validate against OpenAPI schema
- Check required headers and parameters
- Return clear error messages

---

## BFF Patterns

**Composition**: Call multiple services, aggregate responses
- Make parallel calls when possible
- Handle partial failures gracefully
- Set aggressive timeouts

**Presentation shaping**: Transform domain data for specific client needs
- Mobile: Minimize payload size, optimize for bandwidth
- Web: Include richer data, support pagination
- Partner: Expose only contracted fields

**Channel policies**: Apply rate limits, caching, coarse authorization per channel
- Mobile apps: More lenient rate limits
- Public APIs: Stricter quotas
- Internal tools: Bypass some checks

**Timeout management**: Set aggressive timeouts, fail fast
- BFF timeout < sum of backend timeouts
- Return partial results when possible
- Log timeout incidents for investigation

**Error handling**: Translate backend errors to client-friendly messages
- Don't leak internal error details
- Provide actionable error messages
- Include correlation IDs for support

**Response filtering**: Include only fields needed by the client
- Reduce payload size
- Protect sensitive data
- Support field selection (GraphQL-style)

---

## Domain Service Patterns

**Hexagonal architecture**: Separate business logic from infrastructure
- Core domain logic has no framework dependencies
- Adapters handle HTTP, database, messaging
- Easy to test business logic in isolation

**Outbox pattern**: Publish events reliably without dual writes
- Write to database and outbox table in same transaction
- Background process publishes from outbox to event backbone
- Guarantees at-least-once delivery

**Idempotent commands**: Use idempotency keys to prevent duplicates
- Client provides idempotency key in header
- Service stores key with result
- Duplicate requests return cached result

**Optimistic concurrency**: Use version numbers to prevent conflicts
- Include version field in aggregate
- Increment on every update
- Reject updates with stale version

**Domain events**: Publish facts about state changes
- Event name in past tense (OrderPlaced, PaymentCompleted)
- Include all data needed by consumers
- Never delete events (append-only log)

---

## Event Patterns

**Event versioning**: Include version in event envelope
- Use semantic versioning (1.0.0, 1.1.0, 2.0.0)
- Consumers specify compatible versions
- Producers support multiple versions during migration

**Schema evolution**: Add fields, never remove (backward compatibility)
- New fields are optional
- Deprecated fields remain but are ignored
- Breaking changes require new major version

**Dead-letter queues**: Capture failed messages for investigation
- Retry with exponential backoff
- Move to DLQ after max retries
- Alert on DLQ depth threshold

**Idempotent consumers**: Handle duplicate events gracefully
- Track processed event IDs
- Skip already-processed events
- Use database constraints to prevent duplicates

**Replay capability**: Rebuild projections from event history
- Events are immutable and retained
- Consumers can reset offset and replay
- Useful for new projections or bug fixes

---

## Data Patterns

**Single writer**: One service owns writes to a database
- Prevents conflicting updates
- Clear ownership and accountability
- Other services read via APIs or events

**CQRS**: Separate read and write models when patterns diverge
- Write model optimized for commands (normalized)
- Read model optimized for queries (denormalized)
- Sync via events or CDC

**Event-driven projections**: Build read models by consuming events
- Subscribe to relevant domain events
- Update projection in event handler
- Eventual consistency is acceptable

**Soft deletes**: Mark as deleted, don't physically delete
- Preserves audit trail
- Enables recovery from mistakes
- Filter deleted records in queries

**Data quality checks**: Validate data at boundaries
- Check constraints on write
- Validate event payloads against schema
- Monitor data quality metrics

---

## Resilience Patterns

**Circuit breakers**: Stop calling failing services
- Track failure rate
- Open circuit after threshold
- Periodically test if service recovered

**Retries with jitter**: Retry failed requests with exponential backoff
- Add random jitter to prevent thundering herd
- Set max retry attempts
- Only retry idempotent operations

**Timeouts**: Set deadlines for all operations
- Every external call has timeout
- Timeout < SLO for the operation
- Log timeout incidents

**Bulkheads**: Isolate resources to prevent cascade failures
- Separate thread pools per dependency
- Limit concurrent requests
- Fail fast when pool exhausted

**Graceful degradation**: Provide reduced functionality when dependencies fail
- Return cached data when service unavailable
- Skip optional features
- Show user-friendly error messages

---

## Technology Decision Guidance

Choose technologies based on your context, not hype.

### API Protocol Selection

| Layer | Choose REST when... | Choose GraphQL when... | Choose gRPC when... |
|-------|-------------------|---------------------|-------------------|
| **BFF** | Simple CRUD, public APIs | Flexible querying, mobile apps | Not recommended (use REST/GraphQL) |
| **Domain Services** | Standard choice, broad tooling | Not recommended (use REST) | High performance, internal only |

### Database Selection

| Layer | Choose SQL when... | Choose NoSQL when... |
|-------|------------------|-------------------|
| **Domain Data** | Relational data, ACID needed | Document model, high scale |

### Event Backbone Selection

| Layer | Choose Kafka when... | Choose RabbitMQ when... | Choose Cloud Events when... |
|-------|-------------------|---------------------|----------------------|
| **Events** | High throughput, replay needed | Simpler use cases, routing | Cloud-native, managed service |

**Recommendation:** Start with simpler options (REST, SQL, managed services) and add complexity only when needed.

---

## Pattern Anti-Patterns

**Don't:**
- Use events for request/response (use APIs)
- Share databases across services
- Make long chains of synchronous calls
- Retry non-idempotent operations
- Ignore timeouts and circuit breakers
- Skip schema validation

**Do:**
- Use the simplest pattern that works
- Add complexity only when needed
- Measure before optimizing
- Document pattern choices in ADRs
- Share learnings across teams

---

## Next Steps

- Apply patterns when designing services
- Document pattern usage in ADRs
- Share pattern implementations across teams
- Contribute new patterns as you discover them

**Related:**
- [Guardrails](guardrails.md) - Rules for applying patterns
- [Anti-Patterns](anti-patterns.md) - What to avoid
