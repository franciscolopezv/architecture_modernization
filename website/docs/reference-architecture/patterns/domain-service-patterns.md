---
title: Domain Service Patterns
sidebar_position: 3
---

# Domain Service Patterns

Patterns for the Domain Services Layer - implementing business logic and owning domain data.

---

## Hexagonal Architecture

**Pattern:** Separate business logic from infrastructure.

**When to use:**
- All domain services
- When testability matters
- Long-lived systems that will evolve

**Implementation:**
- Core domain logic has no framework dependencies
- Adapters handle HTTP, database, messaging
- Ports define interfaces between core and adapters
- Easy to test business logic in isolation

**Structure:**
```
domain-service/
├── core/           # Business logic (no dependencies)
│   ├── domain/     # Entities, value objects, aggregates
│   ├── ports/      # Interfaces (repositories, services)
│   └── usecases/   # Application logic
└── adapters/       # Infrastructure
    ├── http/       # REST/gRPC controllers
    ├── db/         # Database implementations
    └── messaging/  # Event publishers/consumers
```

**Benefits:**
- Testable without infrastructure
- Easy to swap implementations
- Clear separation of concerns

**Trade-offs:**
- More files and abstractions
- Can feel over-engineered for simple services
- Learning curve for team

---

## Outbox Pattern

**Pattern:** Publish events reliably without dual writes.

**When to use:**
- Publishing domain events
- Ensuring exactly-once semantics
- When event delivery is critical

**Implementation:**
- Write to database and outbox table in same transaction
- Background process publishes from outbox to event backbone
- Mark events as published after successful delivery
- Guarantees at-least-once delivery

**Example:**
```sql
BEGIN TRANSACTION;

-- Update domain state
UPDATE orders SET status = 'COMPLETED' WHERE id = 123;

-- Write to outbox
INSERT INTO outbox (event_type, payload, created_at)
VALUES ('OrderCompleted', '{"orderId": 123, ...}', NOW());

COMMIT;
```

**Benefits:**
- No lost events
- Transactional consistency
- Reliable event publishing

**Trade-offs:**
- Requires outbox table and publisher
- At-least-once delivery (consumers must be idempotent)
- Slight delay in event publishing

---

## Idempotent Commands

**Pattern:** Use idempotency keys to prevent duplicates.

**When to use:**
- Payment processing
- Order creation
- Any non-idempotent operation

**Implementation:**
- Client provides idempotency key in header (`Idempotency-Key`)
- Service stores key with result in database
- Duplicate requests return cached result
- Keys expire after 24 hours

**Example:**
```javascript
async function processPayment(paymentRequest, idempotencyKey) {
  // Check if already processed
  const existing = await db.getIdempotentResult(idempotencyKey);
  if (existing) {
    return existing.result;
  }

  // Process payment
  const result = await paymentGateway.charge(paymentRequest);

  // Store result with key
  await db.storeIdempotentResult(idempotencyKey, result);

  return result;
}
```

**Benefits:**
- Safe retries
- Prevents duplicate charges/orders
- Better user experience

**Trade-offs:**
- Requires storage for keys
- Need to handle key expiration
- Clients must generate keys

---

## Optimistic Concurrency

**Pattern:** Use version numbers to prevent conflicts.

**When to use:**
- Updating aggregates
- Preventing lost updates
- High-concurrency scenarios

**Implementation:**
- Include version field in aggregate
- Increment on every update
- Reject updates with stale version
- Client retries with fresh version

**Example:**
```sql
UPDATE orders 
SET status = 'SHIPPED', version = version + 1
WHERE id = 123 AND version = 5;

-- If no rows updated, version conflict occurred
```

**Benefits:**
- Prevents lost updates
- No pessimistic locks
- Better scalability

**Trade-offs:**
- Clients must handle conflicts
- More complex update logic
- Can have high retry rates under contention

---

## Domain Events

**Pattern:** Publish facts about state changes.

**When to use:**
- Notifying other domains
- Building audit trails
- Triggering side effects

**Implementation:**
- Event name in past tense (`OrderPlaced`, `PaymentCompleted`)
- Include all data needed by consumers
- Never delete events (append-only log)
- Use outbox pattern for reliability

**Event structure:**
```json
{
  "eventId": "uuid",
  "eventType": "OrderPlaced",
  "eventVersion": "1.0",
  "timestamp": "2024-01-15T10:30:00Z",
  "aggregateId": "order-123",
  "correlationId": "request-abc",
  "payload": {
    "orderId": "order-123",
    "customerId": "cust-456",
    "items": [...],
    "totalAmount": 99.99
  }
}
```

**Benefits:**
- Loose coupling between domains
- Natural audit trail
- Enables event sourcing

**Trade-offs:**
- Eventual consistency
- Need to version events
- Consumers must be idempotent

---

## Related Patterns

- [Event Patterns](event-patterns) - Event versioning and schema evolution
- [Data Patterns](data-patterns) - Data ownership and CQRS
- [Resilience Patterns](resilience-patterns) - Handling failures

**See also:**
- [Target Architecture - Domain Services Layer](../target-architecture#3-domain-services-layer)
