---
title: BFF Patterns
sidebar_position: 2
---

# BFF Patterns

Patterns for the Backend-for-Frontend (BFF) Layer - providing tailored APIs for specific channels.

---

## Composition

**Pattern:** Call multiple services, aggregate responses.

**When to use:**
- UI needs data from multiple domains
- Reducing client-side complexity
- Minimizing round trips

**Implementation:**
- Make parallel calls when possible (use async/await, promises)
- Handle partial failures gracefully (return what you have)
- Set aggressive timeouts (fail fast)
- Use circuit breakers for downstream calls
- Cache responses when appropriate

**Example:**
```javascript
// Parallel composition
const [user, orders, recommendations] = await Promise.allSettled([
  userService.getUser(userId),
  orderService.getOrders(userId),
  recommendationService.getRecommendations(userId)
]);

return {
  user: user.status === 'fulfilled' ? user.value : null,
  orders: orders.status === 'fulfilled' ? orders.value : [],
  recommendations: recommendations.status === 'fulfilled' ? recommendations.value : []
};
```

**Benefits:**
- Reduced client complexity
- Fewer network round trips
- Better mobile/web performance

**Trade-offs:**
- BFF becomes a coordination point
- Increased BFF complexity
- Need to handle partial failures

---

## Presentation Shaping

**Pattern:** Transform domain data for specific client needs.

**When to use:**
- Different clients need different data shapes
- Optimizing for bandwidth or performance
- Hiding internal complexity

**Implementation:**

**Mobile:** Minimize payload size, optimize for bandwidth
- Remove unnecessary fields
- Use compact formats
- Paginate aggressively
- Compress responses

**Web:** Include richer data, support pagination
- More fields for richer UIs
- Larger page sizes
- Include metadata for sorting/filtering

**Partner:** Expose only contracted fields
- Stable, versioned schemas
- Only expose what's in the contract
- Hide internal implementation details

**Benefits:**
- Optimized for each channel
- Better performance
- Clearer contracts

**Trade-offs:**
- Multiple BFFs to maintain
- Duplication of transformation logic
- Need to keep in sync with domain changes

---

## Channel Policies

**Pattern:** Apply rate limits, caching, coarse authorization per channel.

**When to use:**
- Different channels have different SLAs
- Protecting backend from specific clients
- Monetization tiers

**Implementation:**

**Mobile apps:** More lenient rate limits
- Higher quotas (users expect responsiveness)
- Longer cache TTLs
- Offline support

**Public APIs:** Stricter quotas
- Lower quotas for free tier
- Aggressive rate limiting
- Detailed usage tracking

**Internal tools:** Bypass some checks
- No rate limiting
- Direct access to admin APIs
- More detailed error messages

**Benefits:**
- Fair resource allocation
- Better user experience per channel
- Monetization flexibility

**Trade-offs:**
- More configuration to manage
- Need monitoring per channel
- Can be gamed if not careful

---

## Timeout Management

**Pattern:** Set aggressive timeouts, fail fast.

**When to use:**
- All BFF calls to backend services
- Preventing cascade failures
- Meeting SLOs

**Implementation:**
- BFF timeout < sum of backend timeouts
- Set timeouts on all external calls
- Return partial results when possible
- Log timeout incidents for investigation
- Use circuit breakers to prevent retry storms

**Example:**
```javascript
const TIMEOUT_MS = 2000; // 2 seconds

try {
  const result = await Promise.race([
    backendService.call(),
    new Promise((_, reject) => 
      setTimeout(() => reject(new TimeoutError()), TIMEOUT_MS)
    )
  ]);
  return result;
} catch (error) {
  if (error instanceof TimeoutError) {
    logger.warn('Backend timeout', { service: 'backend', timeout: TIMEOUT_MS });
    return fallbackResponse();
  }
  throw error;
}
```

**Benefits:**
- Prevents slow requests from blocking others
- Better user experience (fast failures)
- Easier to debug performance issues

**Trade-offs:**
- Need to tune timeouts carefully
- Can mask underlying issues
- Need fallback strategies

---

## Error Handling

**Pattern:** Translate backend errors to client-friendly messages.

**When to use:**
- All BFF responses
- Protecting internal details
- Providing actionable feedback

**Implementation:**
- Don't leak internal error details
- Provide actionable error messages
- Include correlation IDs for support
- Use standard error envelope:

```json
{
  "error": {
    "code": "PAYMENT_FAILED",
    "message": "Payment could not be processed. Please check your card details.",
    "correlationId": "abc-123-def",
    "details": [
      {
        "field": "cardNumber",
        "message": "Card number is invalid"
      }
    ]
  }
}
```

**Benefits:**
- Better user experience
- Security (no internal details leaked)
- Easier debugging with correlation IDs

**Trade-offs:**
- Need to maintain error mappings
- Can hide useful debugging info
- Need good logging to debug

---

## Response Filtering

**Pattern:** Include only fields needed by the client.

**When to use:**
- Large domain objects
- Sensitive data
- Bandwidth optimization

**Implementation:**
- Reduce payload size
- Protect sensitive data
- Support field selection (GraphQL-style)
- Use query parameters for field selection:

```
GET /api/users/123?fields=id,name,email
```

**Benefits:**
- Reduced bandwidth
- Better performance
- Security (don't expose unnecessary data)

**Trade-offs:**
- More complex BFF logic
- Need to document field selection
- Can be overused (premature optimization)

---

## Related Patterns

- [Edge Patterns](edge-patterns) - Gateway-level concerns
- [Domain Service Patterns](domain-service-patterns) - Backend service design
- [Resilience Patterns](resilience-patterns) - Circuit breakers and retries

**See also:**
- [Target Architecture - BFF Layer](../target-architecture#2-channel--bff-layer)
