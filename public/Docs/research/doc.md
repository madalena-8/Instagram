## Instagram API Integration

The Instagram Feed API retrieves media from an authorised Instagram professional account and converts the Instagram response into a simplified format that can be consumed by client websites.

### Integration Flow

```text
Instagram Professional Account
        ↓
Instagram API
        ↓
instagramService.js
        ↓
mapInstagramPost()
        ↓
GET /api/posts
        ↓
Client Website
```

### Instagram Account Requirements

The integration is being designed around the Instagram API with Instagram Login.

The Instagram account must be a supported professional account, such as:

* Business
* Creator

The project does not intend to access Instagram accounts through HTML scraping.

### Authentication

Instagram API requests require an access token.

The application reads the token from an environment variable:

```text
INSTAGRAM_ACCESS_TOKEN
```

The Instagram account identifier is also stored as an environment variable:

```text
INSTAGRAM_ACCOUNT_ID
```

The application currently accesses these values using:

```javascript
const ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const ACCOUNT_ID = process.env.INSTAGRAM_ACCOUNT_ID;
```

Real credentials must never be committed to GitHub or exposed to the frontend.

Local credentials belong in `.env`.

Example:

```env
INSTAGRAM_ACCESS_TOKEN=
INSTAGRAM_ACCOUNT_ID=
PORT=3000
```

`.env.example` should contain placeholders only.

### Permissions

For the Instagram Login approach being investigated, the project requires basic authorised access to the professional Instagram account and its media.

The relevant basic permission identified during research is:

```text
instagram_business_basic
```

The application should request only permissions required for the Instagram feed functionality.

Features such as publishing posts, managing comments or accessing messages are outside the current MVP.

### Media Retrieval

The existing service requests media using an endpoint structured like:

```text
https://graph.instagram.com/{API_VERSION}/{ACCOUNT_ID}/media
```

The service requests the following media fields:

```text
id
caption
media_url
thumbnail_url
permalink
media_type
timestamp
```

The existing implementation currently hardcodes:

```text
v18.0
```

The API version should not be assumed to be the permanent version used by the project. The supported version must be verified/configured before production use.

### Response Mapping

Instagram's response is not exposed directly to client websites.

The `mapInstagramPost()` function converts Instagram's response into the API's own response structure.

For example:

```text
Instagram                    Our API

media_url        →           mediaUrl
media_type       →           mediaType
caption          →           caption
permalink        →           permalink
timestamp        →           timestamp
id               →           id
```

The API response therefore follows this structure:

```json
{
  "id": "123",
  "caption": "Example Instagram post",
  "mediaUrl": "https://...",
  "permalink": "https://instagram.com/...",
  "mediaType": "IMAGE",
  "timestamp": "2026-09-25T12:00:00Z"
}
```

This separation means client websites depend on our API contract instead of depending directly on Instagram's response structure.

### Current Service Behaviour

If Instagram credentials are configured:

```text
GET /api/posts
      ↓
fetchFromInstagram()
      ↓
Instagram API
      ↓
mapInstagramPost()
      ↓
Our API response
```

If Instagram credentials are not configured:

```text
GET /api/posts
      ↓
No credentials
      ↓
FAKE_POSTS
      ↓
Our API response
```

The fake posts allow frontend development to continue without requiring a live Instagram connection.

### Access Token Security

Access tokens must:

* remain on the backend
* be stored using environment variables or an appropriate secret store
* never be committed to Git
* never be included in frontend JavaScript
* never be returned by `/api/posts`
* never intentionally be written to application logs

The current implementation includes the access token in the API request query string. Before production, the authentication request should be reviewed against Meta's current recommended authentication mechanism.

### Token Lifecycle

Access tokens are not treated as permanent credentials.

The exact expiration and refresh behaviour for the selected Instagram Login flow must be verified against current Meta documentation before production deployment.

Future production work must account for:

```text
Account authorised
        ↓
Access token received
        ↓
Token stored securely
        ↓
Token validity monitored
        ↓
Refresh or re-authorisation when required
```

Token lifecycle handling will be addressed before the service is used as a production multi-client platform.

### Ticket #1 Findings

* [x] Reviewed `instagramService.js`
* [x] Identified the Instagram API request
* [x] Identified the hardcoded API version
* [x] Confirmed access token comes from an environment variable
* [x] Confirmed account ID comes from an environment variable
* [x] Confirmed credentials are not hardcoded in the service
* [x] Reviewed `mapInstagramPost()`
* [x] Understood the Instagram-to-API response mapping
* [x] Identified professional account requirement
* [x] Identified `instagram_business_basic` as the relevant basic permission for the selected integration approach
* [x] Identified required environment variables
* [ ] Verify exact production token expiration and refresh behaviour against current Meta documentation
* [ ] Replace or configure the hardcoded API version during implementation

### Environment Variables

| Variable                 | Purpose                                     |
| ------------------------ | ------------------------------------------- |
| `INSTAGRAM_ACCESS_TOKEN` | Authorises requests to Instagram            |
| `INSTAGRAM_ACCOUNT_ID`   | Identifies the authorised Instagram account |
| `PORT`                   | Defines the local API server port           |

### Current Development Decision

The project will continue using its own API response contract rather than exposing raw Instagram responses.

The intended architecture is:

```text
Instagram API
      ↓
Instagram Service
      ↓
Response Mapper
      ↓
Our REST API
      ↓
Client Websites
```

This keeps Instagram-specific implementation details inside the backend and allows client websites to consume a consistent API structure.
