# Instagram Feed API — Sprint 1

## Team

**Developers**

* Mbuyiselo
* Busi

## Sprint Goal

The goal of Sprint 1 is to move from the current prototype using fake/test Instagram data to a working and tested integration with a real authorised Instagram account.

By the end of the sprint, we want:

```text
Instagram Account
        ↓
Meta / Instagram API
        ↓
Instagram Service
        ↓
GET /api/posts
        ↓
Real JSON Response
        ↓
Demo Website
```

---

# 1. Current Project Status

The project already has:

* Node.js
* Express.js
* `GET /`
* `GET /api/posts`
* Fake Instagram posts
* Route/service separation
* `instagramRoutes.js`
* `instagramService.js`
* HTML/CSS/JavaScript demo frontend
* `fetch()` integration
* Loading state
* Error state
* Empty state
* `.env.example`
* Basic CORS
* Basic API error handling

Therefore, Sprint 1 will focus on the next layer rather than rebuilding the existing work.

---

# 2. GitHub Workflow

Our project board should use:

```text
BACKLOG
   ↓
READY
   ↓
IN PROGRESS
   ↓
PULL REQUEST
   ↓
REVIEW
   ↓
DONE
```

Neither developer should develop features directly on `main`.

Each ticket gets its own branch.

Example:

```text
main
 │
 ├── feature/meta-api-verification
 │
 ├── feature/instagram-integration
 │
 ├── test/api-tests
 │
 └── ci/github-actions
```

## Development Process

Start from the latest `main`:

```bash
git checkout main
git pull
```

Create a branch:

```bash
git checkout -b feature/ticket-name
```

After completing the work:

```bash
git add .
git commit -m "feat: description of change"
git push -u origin feature/ticket-name
```

Then:

```text
Push branch
     ↓
Create Pull Request
     ↓
Other developer reviews
     ↓
Fix comments if necessary
     ↓
Merge into main
```

---

# 3. Role Split

## Mbuyiselo — Instagram/API Integration

### Main Responsibilities

* Meta/Instagram API research
* Meta developer configuration
* Instagram authentication
* Access-token handling
* Instagram service implementation
* Real Instagram media retrieval
* API response mapping
* Backend integration
* Later deployment work

### Main Flow

```text
Instagram
    ↓
Meta API
    ↓
Authentication
    ↓
instagramService.js
    ↓
instagramRoutes.js
    ↓
GET /api/posts
```

### Sprint 1 Tickets

* #1 Verify current Meta Instagram API
* #2 Configure Instagram credentials
* #3 Retrieve real Instagram posts
* Review Busi's PRs
* Pair on #6 GitHub Actions

---

# 4. Busi — Testing & Client Integration

## Main Responsibilities

* Automated API testing
* API reliability
* Frontend/API integration
* Loading states
* Error states
* Empty states
* Media rendering
* API documentation
* Testing different API responses

### Main Flow

```text
GET /api/posts
      ↓
API Response
      ↓
Tests
      ↓
Frontend fetch()
      ↓
Feed UI
      ↓
Website visitor
```

### Sprint 1 Tickets

* #4 Add automated API tests
* #5 Test frontend against real API contract
* Review Mbuyiselo's PRs
* Pair on #6 GitHub Actions

---

# 5. Shared Responsibilities

Both developers should understand the entire application.

The role split does **not** mean:

```text
Mbuyiselo only knows backend

Busi only knows frontend
```

Instead:

```text
              PROJECT
                 │
        ┌────────┴────────┐
        │                 │
     Mbuyi              Busi
        │                 │
Integration            Testing
        │                 │
        └────────┬────────┘
                 ↓
             Code Review
                 ↓
          Shared Knowledge
```

Both developers:

* review Pull Requests
* understand the API contract
* understand the Instagram flow
* understand the frontend flow
* help debug integration problems
* maintain documentation

---

# 6. Sprint 1 Tickets

---

## Ticket #1 — Verify Current Meta Instagram API Integration

**Owner:** Mbuyiselo

**Type:** Research / Backend

**Priority:** High

### Goal

Confirm that the current Instagram integration approach matches Meta's currently supported Instagram API.

### Tasks

* Review current `instagramService.js`.
* Check the current Meta/Instagram API documentation.
* Verify the correct API endpoint.
* Verify required Instagram account type.
* Verify required permissions/scopes.
* Verify authentication process.
* Verify how the Instagram account ID is obtained.
* Verify media endpoint.
* Verify available media fields.
* Verify token expiration.
* Verify token refresh requirements.
* Document findings in the project README/docs.

### Acceptance Criteria

* [ ] Correct Instagram API approach identified.
* [ ] Correct endpoint documented.
* [ ] Required permissions documented.
* [ ] Account requirements documented.
* [ ] Token lifecycle understood.
* [ ] Required environment variables documented.
* [ ] No knowingly deprecated API endpoint remains in the integration plan.

### Branch

```text
docs/meta-api-verification
```

### Suggested Commit

```text
docs: document Meta Instagram API integration requirements
```

---

# Ticket #2 — Configure Instagram Developer Credentials

**Owner:** Mbuyiselo

**Depends on:** #1

**Type:** Backend / Configuration

**Priority:** High

### Goal

Configure authorised access to a test Instagram account.

### Tasks

* Configure Meta developer application.
* Configure Instagram access.
* Authorise test Instagram account.
* Obtain required account identifier.
* Obtain development access token.
* Add credentials to local `.env`.
* Verify `.env` is ignored by Git.
* Update `.env.example` if necessary.

Example:

```text
INSTAGRAM_ACCESS_TOKEN=
INSTAGRAM_ACCOUNT_ID=
PORT=3000
```

### Security Requirement

Real credentials must NEVER appear in:

* GitHub
* README
* `.env.example`
* frontend JavaScript
* API responses
* application logs

### Acceptance Criteria

* [ ] Meta developer configuration completed.
* [ ] Test Instagram account authorised.
* [ ] Backend has required local credentials.
* [ ] `.env` is ignored.
* [ ] No credentials committed.
* [ ] Authentication request succeeds.

### Branch

```text
feature/meta-authentication
```

### Suggested Commit

```text
feat: configure Instagram API authentication
```

---

# Ticket #3 — Retrieve Real Instagram Posts

**Owner:** Mbuyiselo

**Depends on:** #1 and #2

**Type:** Backend

**Priority:** High

### Goal

Replace the development fake-data flow with real Instagram media when valid Instagram configuration is available.

### Flow

```text
GET /api/posts
       ↓
instagramRoutes.js
       ↓
instagramService.js
       ↓
Meta / Instagram API
       ↓
Real Instagram posts
       ↓
Our API format
       ↓
JSON response
```

### Required Response Format

Our API should continue exposing our own contract:

```json
{
  "id": "...",
  "caption": "...",
  "mediaUrl": "...",
  "permalink": "...",
  "mediaType": "...",
  "timestamp": "..."
}
```

Do not simply return the entire Meta response.

### Tasks

* Connect `instagramService.js` to the verified endpoint.
* Send authorised request.
* Retrieve media.
* Map Instagram response.
* Handle missing captions.
* Handle different media types.
* Keep credentials server-side.
* Test through `GET /api/posts`.

### Acceptance Criteria

* [ ] `GET /api/posts` retrieves real posts.
* [ ] Response returns valid JSON.
* [ ] Response follows our API contract.
* [ ] Images can be displayed by the frontend.
* [ ] Permalinks point to original posts.
* [ ] Tokens are never returned.
* [ ] Instagram failures do not crash Express.

### Branch

```text
feature/real-instagram-posts
```

### Suggested Commit

```text
feat: retrieve real Instagram media
```

---

# Ticket #4 — Add Automated API Tests

**Owner:** Busi

**Type:** Testing

**Priority:** High

### Goal

Introduce automated testing so changes to the API can be verified before merging.

Currently the project should move away from a placeholder test command and have an actual test suite.

### Tests

At minimum test:

```text
GET /
    ↓
200 OK

GET /api/posts
    ↓
200 OK
    ↓
JSON response

Unknown endpoint
    ↓
404

Instagram service error
    ↓
Controlled API error
```

Tests should not depend on making a real Instagram request every time.

The Instagram service should be mocked/stubbed where appropriate.

### Acceptance Criteria

* [ ] Testing framework installed.
* [ ] `npm test` executes tests.
* [ ] Root endpoint tested.
* [ ] Posts endpoint tested.
* [ ] 404 behaviour tested.
* [ ] Instagram service failure tested.
* [ ] Tests work without real Instagram credentials.
* [ ] All tests pass locally.

### Branch

```text
test/api-tests
```

### Suggested Commit

```text
test: add automated API endpoint tests
```

---

# Ticket #5 — Test Frontend Against API Contract

**Owner:** Busi

**Depends on:** #3 for final real-data verification

**Type:** Frontend / Testing

**Priority:** Medium

### Goal

Ensure the demo frontend correctly handles all responses expected from the API.

### Test States

The frontend should handle:

```text
LOADING
   ↓
LOADED
```

as well as:

```text
ERROR
```

and:

```text
EMPTY FEED
```

### Media Cases

Test:

* IMAGE
* VIDEO
* CAROUSEL_ALBUM
* missing caption
* missing/optional fields
* empty posts array
* API unavailable
* network failure

### Acceptance Criteria

* [ ] Images display correctly.
* [ ] Captions display correctly.
* [ ] Original Instagram link works.
* [ ] Loading state works.
* [ ] Empty state works.
* [ ] Error state works.
* [ ] Retry behaviour works.
* [ ] Unexpected API response does not break the entire page.
* [ ] Real Instagram response works after #3 is completed.

### Branch

```text
test/frontend-api-integration
```

### Suggested Commit

```text
test: verify frontend Instagram feed states
```

---

# Ticket #6 — Add GitHub Actions CI

**Owners:** Mbuyiselo & Busi

**Depends on:** #4

**Type:** DevOps / CI

**Priority:** Medium

### Goal

Automatically test every push and Pull Request.

Create:

```text
.github/
└── workflows/
    └── ci.yml
```

### Workflow

```text
Push / Pull Request
        ↓
GitHub Actions
        ↓
Checkout repository
        ↓
Install Node.js
        ↓
npm ci
        ↓
npm test
        ↓
PASS / FAIL
```

### Acceptance Criteria

* [ ] Workflow exists.
* [ ] Workflow runs on Pull Requests.
* [ ] Dependencies install successfully.
* [ ] Automated tests execute.
* [ ] Passing tests produce green workflow.
* [ ] Failing tests produce failed workflow.
* [ ] No Instagram secrets are required for normal CI tests.

### Branch

```text
ci/github-actions
```

### Suggested Commit

```text
ci: add automated test workflow
```

---

# 7. Sprint Dependency Flow

```text
MBUYISELO                         BUSI

Ticket #1                        Ticket #4
Verify Meta API                  Automated tests
    │                                │
    ▼                                │
Ticket #2                            │
Credentials                          │
    │                                │
    ▼                                ▼
Ticket #3 ────────────────────── Ticket #5
Real posts                     Frontend verification
    │                                │
    └──────────────┬─────────────────┘
                   ▼
               Ticket #6
             GitHub Actions
                   │
                   ▼
              SPRINT REVIEW
```

---

# 8. Sprint Definition of Done

Sprint 1 is complete when:

```text
Real Instagram account
          ↓
Authorised Meta connection
          ↓
instagramService.js
          ↓
GET /api/posts
          ↓
Standard JSON response
          ↓
Demo website
          ↓
Real posts displayed
```

AND:

```text
npm test
   ↓
PASS
```

AND:

```text
Pull Request
     ↓
GitHub Actions
     ↓
GREEN
```

---

# 9. Sprint 2 Preview

Do not start these until the core Sprint 1 integration works.

Possible Sprint 2 work:

* Production CORS configuration
* Better logging
* Caching
* Rate-limit handling
* Token lifecycle handling
* API deployment
* Connect actual photographer website
* Production monitoring
* API documentation improvements

---

# 10. Future Product Backlog

These are **not Sprint 1 tickets**.

After one real client works successfully:

```text
One working client
        ↓
Second client
        ↓
Multi-client architecture
        ↓
Database
        ↓
Client-specific feeds
        ↓
Reusable website widget
        ↓
Client onboarding
        ↓
Authentication
        ↓
Dashboard
        ↓
Subscriptions
```

Possible future endpoints:

```http
GET /api/feeds/client-a/posts

GET /api/feeds/client-b/posts
```

The priority right now is:

> **One real Instagram account → one reliable API → one working website.**
