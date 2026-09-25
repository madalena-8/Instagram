# Instagram Feed API

**Developers:** Mbuyiselo & Busi
**Project:** Instagram Feed API
**Stack:** Node.js • Express.js • JavaScript • HTML/CSS
**Status:** Planning / MVP Development

---

## 1. Project Overview

The **Instagram Feed API** is a reusable backend service that allows websites to display the latest posts from an authorised client's Instagram account.

Our first use case is a photographer's portfolio website.

The website will use:

* HTML
* CSS
* JavaScript

The backend will use:

* Node.js
* Express.js
* JavaScript

Instead of putting Instagram credentials directly into the website, our backend will communicate with Instagram through Meta's supported Instagram API.

### The idea

```text
Client posts on Instagram
          ↓
      Instagram
          ↓
   Meta / Instagram API
          ↓
  Our Instagram Feed API
          ↓
      Client Website
```

The long-term goal is to make the API reusable so that future client websites can use the same system.

---

# 2. Problem We Are Solving

A photographer may currently:

1. Upload new work to Instagram.
2. Update their Instagram page.
3. Manually upload the same work to their website.

We want to reduce that duplication.

Instead:

```text
Photographer posts
        ↓
    Instagram
        ↓
    Our API
        ↓
     Website
```

The website can retrieve recent Instagram content automatically.

---

# 3. Why Have Our Own Backend API?

We should never place secret Instagram credentials directly inside frontend JavaScript.

For example:

```javascript
const token = "SECRET_INSTAGRAM_TOKEN";
```

would expose the credential to anyone inspecting the website.

Instead:

```text
Browser
   ↓
Our API
   ↓
Instagram credentials
   ↓
Instagram API
```

The browser only communicates with our backend.

---

# 4. System Architecture

```text
                 INSTAGRAM
                     │
                     ▼
           Meta / Instagram API
                     │
                     ▼
        ┌────────────────────────┐
        │   Instagram Feed API   │
        │                        │
        │ Node.js + Express.js   │
        │                        │
        │ Routes                 │
        │ Services               │
        │ Configuration          │
        └────────────┬───────────┘
                     │
                    JSON
                     │
                     ▼
              GET /api/posts
                     │
                     ▼
          Photographer Website
                     │
              HTML / CSS / JS
```

---

# 5. Our API Contract

The website should not need to understand Meta's API.

It only needs to understand **our API**.

### Request

```http
GET /api/posts
```

### Example response

```json
[
  {
    "id": "123",
    "caption": "Wedding photography session",
    "mediaUrl": "https://...",
    "permalink": "https://instagram.com/p/...",
    "mediaType": "IMAGE",
    "timestamp": "2026-09-07T12:00:00"
  },
  {
    "id": "124",
    "caption": "Portrait session",
    "mediaUrl": "https://...",
    "permalink": "https://instagram.com/p/...",
    "mediaType": "IMAGE",
    "timestamp": "2026-09-06T15:30:00"
  }
]
```

This separation is important.

```text
Instagram's format
        ↓
Our backend
        ↓
Our standard format
        ↓
Website
```

If Instagram changes something internally, we can update our backend without necessarily changing every website.

---

# 6. Frontend Integration

The website can contain:

```html
<section id="instagram-feed"></section>
```

JavaScript can then request the feed:

```javascript
fetch("https://our-api.com/api/posts")
    .then(response => response.json())
    .then(posts => {

        const feed = document.getElementById("instagram-feed");

        posts.forEach(post => {

            const image = document.createElement("img");

            image.src = post.mediaUrl;
            image.alt = post.caption;

            feed.appendChild(image);
        });
    });
```

Eventually this will create the photographer's Instagram gallery automatically.

---

# 7. Project Structure

Our initial repository structure:

```text
instagram-feed-api/
│
├── src/
│   ├── routes/
│   │   └── instagramRoutes.js
│   │
│   ├── services/
│   │   └── instagramService.js
│   │
│   └── app.js
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

### `app.js`

Responsible for:

* starting Express
* middleware
* CORS
* registering routes
* starting the HTTP server

### `instagramRoutes.js`

Responsible for endpoints such as:

```http
GET /api/posts
```

### `instagramService.js`

Responsible for communicating with Instagram.

We want:

```text
Route
  ↓
Service
  ↓
Instagram API
```

rather than putting all the Instagram logic inside our route.

---

# 8. Environment Variables & Security

Secrets will be stored in:

```text
.env
```

Example:

```text
INSTAGRAM_ACCESS_TOKEN=secret
INSTAGRAM_ACCOUNT_ID=123456
PORT=3000
```

`.env` must **never be committed to GitHub**.

Our `.gitignore` should contain:

```text
node_modules/
.env
```

We can safely commit:

```text
.env.example
```

containing:

```text
INSTAGRAM_ACCESS_TOKEN=
INSTAGRAM_ACCOUNT_ID=
PORT=3000
```

This shows developers what configuration is required without exposing real credentials.

---

# 9. Development Strategy

We will build the project incrementally.

```text
PHASE 1
Node/Express API
      ↓
PHASE 2
Fake Instagram posts
      ↓
PHASE 3
Connect website
      ↓
PHASE 4
Connect Instagram
      ↓
PHASE 5
Real Instagram posts
      ↓
PHASE 6
Security + error handling
      ↓
PHASE 7
Deployment
```

We don't need to solve everything at once.

---

# 10. MVP

Our first goal is:

> **One authorised Instagram account → one working API → one working website.**

The MVP does NOT require:

* multiple clients
* user accounts
* admin dashboard
* payments
* advanced analytics
* complicated database architecture

Those can come later.

---

# 11. Development Backlog

## EPIC 1 — Project Setup

### Ticket 1 — Create Shared GitHub Repository

**Repository**

```text
instagram-feed-api
```

**Tasks**

* Create GitHub repository.
* Add both developers as collaborators.
* Clone repository.
* Create README.
* Create `.gitignore`.
* Create initial development branches.

**Done when:**

Both Mbuyiselo and Busi can clone, branch, commit and push.

---

### Ticket 2 — Initialise Node Project

Run:

```bash
npm init -y
```

Install:

```bash
npm install express cors dotenv
```

**Done when:**

```bash
npm start
```

starts the application successfully.

---

## EPIC 2 — REST API

### Ticket 3 — Create Express Server

Create:

```text
src/app.js
```

Implement:

```http
GET /
```

Expected response:

```json
{
  "message": "Instagram Feed API is running"
}
```

---

### Ticket 4 — Create Posts Endpoint

Implement:

```http
GET /api/posts
```

Initially use fake data.

```json
[
  {
    "id": "1",
    "caption": "Photography session",
    "mediaUrl": "https://example.com/image.jpg",
    "permalink": "https://instagram.com/",
    "mediaType": "IMAGE"
  }
]
```

**Done when:**

`GET /api/posts` returns:

```text
HTTP 200
```

with valid JSON.

---

## EPIC 3 — Separation of Concerns

### Ticket 5 — Create Instagram Routes

Create:

```text
src/routes/instagramRoutes.js
```

Move `/api/posts` routing into this module.

---

### Ticket 6 — Create Instagram Service

Create:

```text
src/services/instagramService.js
```

Architecture:

```text
instagramRoutes
       ↓
instagramService
       ↓
Instagram API
```

The endpoint must continue working after the refactor.

---

# EPIC 4 — Website Integration

### Ticket 7 — Connect Test Website

Use:

```javascript
fetch(...)
```

to call:

```http
GET /api/posts
```

**Done when:**

Fake posts from our backend successfully appear on an HTML page.

---

### Ticket 8 — Build Feed UI

Display:

* image
* caption
* post date
* Instagram link

Clicking the post should allow the visitor to open the original Instagram post.

---

# EPIC 5 — Real Instagram Integration

### Ticket 9 — Configure Meta Developer Access

Configure authorised access to the client's Instagram account.

Tasks include:

* Meta developer configuration
* Instagram configuration
* client account authorisation
* obtaining required credentials
* storing secrets in `.env`

No credentials may be committed to GitHub.

---

### Ticket 10 — Retrieve Real Posts

Update:

```text
instagramService.js
```

to retrieve actual Instagram media.

Required information includes:

```text
id
caption
media URL
media type
permalink
timestamp
```

---

### Ticket 11 — Map Instagram Response

Convert Instagram's response into our own standard format:

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

Architecture:

```text
Instagram
    ↓
Instagram response
    ↓
instagramService
    ↓
Our format
    ↓
GET /api/posts
    ↓
Website
```

---

# EPIC 6 — Reliability

### Ticket 12 — Error Handling

Handle:

* Instagram unavailable
* network errors
* expired/invalid credentials
* no posts
* unexpected API responses

The server should not crash.

---

### Ticket 13 — Standard Error Responses

Example:

```json
{
  "error": "Unable to retrieve Instagram posts"
}
```

Return appropriate HTTP status codes.

---

# EPIC 7 — Security

### Ticket 14 — Protect Credentials

Verify:

* `.env` ignored by Git
* tokens aren't logged
* tokens aren't returned to frontend
* tokens aren't committed
* secrets remain server-side

---

### Ticket 15 — Configure CORS

During development:

```text
localhost
```

For production, restrict access to the appropriate website domain.

---

# 12. Git Workflow

We should avoid developing directly on `main`.

Example:

```text
main
 │
 ├── feature/setup-express
 │
 ├── feature/instagram-route
 │
 ├── feature/instagram-service
 │
 └── feature/frontend-integration
```

Workflow:

```bash
git checkout main

git pull

git checkout -b feature/instagram-route

# make changes

git add .

git commit -m "feat: add Instagram posts endpoint"

git push -u origin feature/instagram-route
```

Then:

```text
Push
  ↓
Pull Request
  ↓
Code Review
  ↓
Merge
```

Mbuyiselo and Busi should review each other's pull requests.

---

# 13. Collaboration

Rather than completely separating the project, both developers should understand the complete architecture.

Initial areas can be divided roughly as:

### Mbuyiselo

* Express setup
* REST API
* Instagram service
* Meta integration

### Busi

* API consumption
* feed UI
* loading/error states
* frontend integration
* API testing

However, we should review and discuss each other's code.

The Instagram/Meta integration should preferably be done together because it is the main external dependency.

---

# 14. Future Version

Once the MVP works, we can introduce caching.

```text
Instagram
     ↑
Periodic refresh
     │
Instagram Feed API
     │
    Cache
     │
 ┌───┼────┐
 ↓   ↓    ↓
Website visitors
```

This prevents every website visitor from causing another request to Instagram.

---

# 15. Multiple Client Support

The API should eventually be reusable.

```text
                 Instagram Feed API
                        │
           ┌────────────┼────────────┐
           │            │            │
           ▼            ▼            ▼
     Photographer A  Client B     Client C
           │            │            │
           ▼            ▼            ▼
       Website A    Website B    Website C
```

Future endpoints could look like:

```http
GET /api/feeds/photographer-a/posts
GET /api/feeds/client-b/posts
GET /api/feeds/client-c/posts
```

But this comes **after the MVP**.

---

# 16. Definition of Done

Version 1 is complete when:

```text
Photographer uploads a post
            ↓
         Instagram
            ↓
    Instagram/Meta API
            ↓
      Our backend API
            ↓
      GET /api/posts
            ↓
      HTML/JS website
            ↓
Latest post appears on website
```

At that point we have successfully created the first version of our Instagram Feed API.

---

# 17. Main Principle

### First:

```text
ONE INSTAGRAM ACCOUNT
          ↓
ONE WORKING API
          ↓
ONE WEBSITE
```

### Later:

```text
Multiple clients
      ↓
Caching/database
      ↓
Reusable widget
      ↓
Client authentication
      ↓
Dashboard
      ↓
Cloud deployment/scaling
```

The first objective is not to recreate all of Elfsight.

The objective is to understand and successfully build the **core Instagram-feed functionality ourselves**.

Once that works, we can gradually evolve it into a reusable service for other websites.
