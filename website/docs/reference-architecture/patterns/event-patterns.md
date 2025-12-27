---
title: Event Patterns
sidebar_position: 4
---

# Event Patterns

Patterns for the Async & Integration Layer - enabling asynchronous communication between domains.

---

## Event Versioning

**Pattern:** Include version in event envelope.

**When to use:**
- All domain events
- When events have multiple consumers
- Long-lived event streams

**Implementation:**
- Use semantic versioning (1.0.0, 1.1.0, 2.0.0)
- Consumers specify compatible versions
- Producers support multiple versions during migration
- Include version in event metadata

**Example:**
```json
{
  "eventType": "OrderPlaced",
  "eventVersion": "2.0.0",
  "payload": {
    "orderId": "123",
    "customerId": "456",
    "items": [...],
    "shippingAddress": {...}  // Added in v2.0.0
  }
}
```

**Benefits:**
- Safe schema evolution
- Backward compatibility
- Independent consumer upgrades

**Trade-offs:**
- Need to maintain multiple versions
- More complex producer logic
- Eventually need to deprecate old versions

---

## Schema Evolution

**Pattern:** Add fields, never remove (backward compatibility).

**When to use:**
- Evolving event schemas
- Adding new features
- Maintaining compatibility

**Implementation:**
- New fields are optional (with defaults)
- Deprecated fields remain but are ignored
- Breaking changes require new major version
- Use schema registry to enforce rules

**Evolution rules:**
- ✅ Add optional fields
- ✅ Add new event types
- ✅ Deprecate fields (but keep them)
- ❌ Remove fields
- ❌ Change field types
- ❌ Make optional fields required

**Benefits:**
- Consumers don't break
- Gradual migration
- Clear compatibility rules

**Trade-offs:**
- Schema grows over time
- Deprecated fields clutter schema
- Need discipline to follow rules

---

## Dead-Letter Queues

**Pattern:** Capture failed messages for investigation.

**When to use:**
- All event consumers
- When message processing can fail
- Debugging production issues

**Implementation:**
- Retry with exponential backoff (3-5 attempts)
- Move to DLQ after max retries
- Alert on DLQ depth threshold
- Provide tools to inspect and replay DLQ messages

**Retry strategy:**
```
Attempt 1: Immediate
Attempt 2: 1 second delay
Attempt 3: 5 seconds delay
Attempt 4: 25 seconds delay
Attempt 5: 125 seconds delay
Then: Move to DLQ
```

**Benefits:**
- Don't lose messages
- Easier debugging
- Can fix and replay

**Trade-offs:**
- Need monitoring and alerting
- DLQ can grow unbounded
- Need process for handling DLQ

---

## Idempotent Consumers

**Pattern:** Handle duplicate events gracefully.

**When to use:**
- All event consumers
- At-least-once delivery semantics
- Preventing duplicate side effects

**Implementation:**
- Track processed event IDs in database
- Skip already-processed events
- Use database constraints to prevent duplicates
- Store event ID with side effects in same transaction

**Example:**
```javascript
async function handleOrderPlaced(event) {
  // Check if already processed
  const exists = await db.eventExists(event.eventId);
  if (exists) {
    logger.info('Event already processed', { eventId: event.eventId });
    return;
  }

  // Process event and store ID in same transaction
  await db.transaction(async (tx) => {
    await tx.createShipment(event.payload);
    await tx.storeProcessedEvent(event.eventId);
  });
}
```

**Benefits:**
- Safe with at-least-once delivery
- Prevents duplicate side effects
- Simpler error handling

**Trade-offs:**
- Need to store event IDs
- Slightly more complex logic
- Storage grows over time (need cleanup)

---

## Replay Capability

**Pattern:** Rebuild projections from event history.

**When to use:**
- Building new read models
- Fixing bugs in projections
- Disaster recovery

**Implementation:**
- Events are immutable and retained (never deleted)
- Consumers can reset offset and replay from beginning
- Useful for new projections or bug fixes
- Support fast-forward replay (skip to specific point)

**Use cases:**
- New feature needs historical data
- Bug in consumer logic (fix and replay)
- Building new analytics dashboard
- Disaster recovery (rebuild from events)

**Benefits:**
- Can rebuild state from scratch
- Easy to add new projections
- Natural disaster recovery

**Trade-offs:**
- Events must be retained forever
- Replay can be slow for large histories
- Need to handle schema evolution during replay

---

## Related Patterns

- [Domain Service Patterns](domain-service-patterns) - Outbox pattern for publishing
- [Data Patterns](data-patterns) - Event-driven projections
- [Resilience Patterns](resilience-patterns) - Handling failures

**See also:**
- [Target Architecture - Async & Integration Layer](../target-architecture#4-async--integration-layer)
