# Security Specification - Portal Adethea

## 1. Data Invariants
- Articles must have an authorId matching the current user.
- Status must be 'draft' or 'published'.
- Users can only edit their own profile.
- Only admins (or authorized authors) can create/update articles (for this app, we'll assume the first user or a specific pattern for admin, or just allow auth users for now but harden the ID check).
- `createdAt` is immutable.

## 2. The Dirty Dozen Payloads

### Payload 1: Unauthorized Article Creation
- Attempt to create an article without being signed in.
- **Expectation**: PERMISSION_DENIED.

### Payload 2: Author Spoofing
- Authenticated User A tries to create an article with `authorId` = User B.
- **Expectation**: PERMISSION_DENIED.

### Payload 3: Shadow Field Injection
- Creating an article with an undocumented field `isAdmin: true`.
- **Expectation**: PERMISSION_DENIED.

### Payload 4: Invalid Status Transition
- Updating an article status to `deleted` (not in enum).
- **Expectation**: PERMISSION_DENIED.

### Payload 5: Immutable Field Mutation
- Attempting to update `createdAt` of an existing article.
- **Expectation**: PERMISSION_DENIED.

### Payload 6: Huge Document ID
- Attempting to create a document with a 2MB string as ID.
- **Expectation**: PERMISSION_DENIED (via `isValidId`).

### Payload 7: Profile Takeover
- User A attempts to update User B's profile document.
- **Expectation**: PERMISSION_DENIED.

### Payload 8: Role Escalation
- User A attempts to change their own `role` from `user` to `admin`.
- **Expectation**: PERMISSION_DENIED.

### Payload 9: Empty Required Fields
- Creating an article without a `content` field.
- **Expectation**: PERMISSION_DENIED.

### Payload 10: Invalid Type Injection
- Sending a number for the `title` field.
- **Expectation**: PERMISSION_DENIED.

### Payload 11: PII Leak Attempt
- Authenticated user tries to list all users' private info (if we had separate private docs).
- **Expectation**: PERMISSION_DENIED.

### Payload 12: Orphaned Article
- Creating an article where the author profile does not exist yet (optional exists check).
- **Expectation**: PERMISSION_DENIED.
