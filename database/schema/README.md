All date-related fields (e.g. `createdAt`, `updatedAt`, `collectionData.date`) are stored as **ISO 8601 strings**.

This decision was made because:
- The backend generates timestamps using `new Date().toISOString()`
- It ensures consistency across environments
- It avoids tight coupling with Firestore-specific data types

Firestore Timestamp objects could be used in a future iteration if advanced date queries are required.
