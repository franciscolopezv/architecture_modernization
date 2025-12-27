---
title: Resilience Patterns
sidebar_position: 6
---

# Resilience Patterns

Cross-cutting patterns for building resilient systems that handle failures gracefully.

---

## Circuit Breakers

**Pattern:** Stop calling failing services.

**When to use:**
- All external service calls
- Preventing cascade failures
- Protecting downstream services

**Implementation:**
- Track failure rate over sliding window
- Open circuit after threshold (e.g., 50% failures in 10 seconds)
- Periodically test if service recovered (half-open state)
- Fail fast when circuit is open

**States:**
```
CLOSED (normal) → OPEN (failing) → HALF_OPEN (testing) → CLOSED
```

**Example:**
```javascript
const circuitBreaker = new CircuitBreaker({
  failureThreshold: 5,      // Open after 5 failures
  timeout: 3000,            // 3 second timeout
  resetTimeout: 30000       // Try again after 30 seconds
});

async function callService() {
  return circuitBreaker.execute(async () => {
    return await externalService.call();
  });
}
```

**Benefits:**
- Prevents cascade failures
- Faster failure detection
- Automatic recovery testing

**Trade-offs:**
- Can mask underlying issues
- Need to tune thresholds
- Requires monitoring

---

## Retries with Jitter

**Pattern:** Retry failed requests with exponential backoff.

**When to use:**
- Transient failures (network, timeouts)
- Idempotent operations only
- Rate limit errors

**Implementation:**
- Add random jitter to prevent thundering herd
- Set max retry attempts (3-5)
- Only retry idempotent operations
- Use exponential backoff

**Retry strategy:**
```javascript
async function retryWithJitter(fn, maxRetries = 3) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries || !isRetryable(error)) {
        throw error;
      }
      
      // Exponential backoff with jitter
      const baseDelay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
      const jitter = Math.random() * 1000;           // 0-1s random
      await sleep(baseDelay + jitter);
    }
  }
}
```

**Benefits:**
- Handles transient failures
- Prevents thundering herd
- Better success rate

**Trade-offs:**
- Increases latency
- Can overload recovering services
- Only works for idempotent operations

---

## Timeouts

**Pattern:** Set deadlines for all operations.

**When to use:**
- All external calls
- Database queries
- Event processing

**Implementation:**
- Every external call has timeout
- Timeout < SLO for the operation
- Log timeout incidents
- Use aggressive timeouts (fail fast)

**Timeout hierarchy:**
```
Client timeout (5s)
  → BFF timeout (4s)
    → Domain service timeout (3s)
      → Database timeout (2s)
```

**Benefits:**
- Prevents hanging requests
- Faster failure detection
- Better resource utilization

**Trade-offs:**
- Need to tune carefully
- Can cause false failures
- Need fallback strategies

---

## Bulkheads

**Pattern:** Isolate resources to prevent cascade failures.

**When to use:**
- Multiple dependencies
- Preventing resource exhaustion
- Critical vs non-critical paths

**Implementation:**
- Separate thread pools per dependency
- Limit concurrent requests per service
- Fail fast when pool exhausted
- Isolate critical from non-critical

**Example:**
```javascript
const paymentPool = new ThreadPool({ size: 10 });
const emailPool = new ThreadPool({ size: 5 });

// Payment failures don't affect email sending
async function processOrder(order) {
  await paymentPool.execute(() => processPayment(order));
  await emailPool.execute(() => sendConfirmation(order));
}
```

**Benefits:**
- Prevents cascade failures
- Better resource allocation
- Protects critical paths

**Trade-offs:**
- More complex resource management
- Can waste resources
- Need to tune pool sizes

---

## Graceful Degradation

**Pattern:** Provide reduced functionality when dependencies fail.

**When to use:**
- Non-critical features
- Improving user experience
- High availability requirements

**Implementation:**
- Return cached data when service unavailable
- Skip optional features
- Show user-friendly error messages
- Provide fallback responses

**Example:**
```javascript
async function getProductRecommendations(userId) {
  try {
    return await recommendationService.get(userId);
  } catch (error) {
    logger.warn('Recommendation service unavailable', { userId });
    
    // Fallback to popular products
    return await cache.get('popular-products');
  }
}
```

**Benefits:**
- Better user experience
- Higher availability
- Reduced impact of failures

**Trade-offs:**
- More complex logic
- Need to maintain fallbacks
- Can hide underlying issues

---

## Combining Patterns

These patterns work best together:

```javascript
// Circuit breaker + Timeout + Retry + Fallback
const resilientCall = async () => {
  return await circuitBreaker.execute(
    async () => {
      return await retryWithJitter(
        async () => {
          return await withTimeout(
            externalService.call(),
            3000
          );
        },
        3
      );
    },
    {
      fallback: () => getCachedData()
    }
  );
};
```

---

## Related Patterns

- [Edge Patterns](edge-patterns) - Rate limiting
- [BFF Patterns](bff-patterns) - Timeout management
- [Domain Service Patterns](domain-service-patterns) - Idempotency

**See also:**
- [Target Architecture - Platform Layer](../target-architecture#6-cross-cutting-platform-layer)
- [Guardrails](../guardrails)
