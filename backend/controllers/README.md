# FungiLib Backend API

Base URL (local development):

- `http://localhost:4000`

## Endpoints

### 1. Health check
**GET** `/`

Returns a simple message to confirm the backend is running.

---

### 2. List all fungi

**GET** `/api/fungi`

**Query params (optional):**

- none for now

**Response `200 OK` example:**

```json
[
  {
    "id": "1635e054-09bf-4fbe-a7d4-d720c6214917",
    "createdAt": "...",
    "updatedAt": "...",
    "commonName": "Golden Mushroom",
    "scientificName": "Aureus fungibus",
    "taxonomy": {
      "commonName": "Golden Mushroom",
      "scientificName": "Aureus fungibus",
      "division": "Basidiomycota",
      "class": "Agaricomycetes",
      "order": "Agaricales",
      "family": "Fungiaceae",
      "genus": "Fungius",
      "species": "fungibus"
    },
    "images": [],
    "location": {},
    "collectionData": {},
    "labNotes": "Example notes..."
  }
]
