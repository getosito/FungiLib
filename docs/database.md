# FungiLib – Database Documentation

## Project Context
FungiLib is a web pplication developed to digitally catalog fungi studied and collected by the **Mycology Laboratory of the Faculty of Exact and Natural Sciences (FACEN – UNA)**.

The project aims to replace the traditional paper-based herbarium with a **digital system** that enables efficient storage, access, and management of fungal specimen data. By digitizing and centralizing this information, the platform makes fungal records more accessible for researchers, students, and collaborators, while improving long-term data preservation.

The database focuses on storing and organizing information related to:
- taxonomic classification
- ecological context
- collection metadata
- laboratory and herbarium observations

## Main Objective
The main objective of the database is to **digitalize and centralize the existing fungal catalog**, making it searchable, accessible, and usable for scientific research both in the laboratory and in the field.


## Role of the Database in the System
The platform is composed of three main components:

- **Frontend** – User interface for browsing, searching, and editing records  
- **Backend** – API layer that handles business logic and data validation  
- **Database** – Centralized storage of all fungal specimen information  

This document describes the **database component**, which is responsible for storing all structured data used by the system.


## Database Technology
The project uses **Firebase Firestore** as its centralized database.

Firestore is a NoSQL, document-oriented database that was selected because it:
- supports hierarchical and flexible data structures
- allows partial updates without rigid schemas
- integrates easily with a Node.js backend
- is suitable for rapid academic prototyping

All fungal records are stored in a single Firestore collection named: fungi


Each document in this collection represents one fungal specimen.


## Data Structure
Each fungal document is organized into logical sections to reflect how data is collected and used in mycological research.

### Identification
Stores unique identifiers for each specimen:
- primary key
- collection number

### Taxonomic Data
Stores the biological classification of the specimen:
- common name
- scientific name
- division
- class
- order
- family
- genus
- species

### Ecological Data
Stores environmental and geographic context:
- image references (URLs)
- GPS location
- ecoregion

### Collection Data
Stores field collection metadata:
- coordinates
- collection date
- collected by
- culture collection number
- author

### Laboratory and Herbarium Information
Stores laboratory-related records:
- location
- herbarium entry number
- species
- family
- collector
- collection number
- physical evidence
- shelf number
- collector’s box number

### Laboratory Notes
A free-text field used to store additional observations and comments.

Dates are stored as **ISO 8601 strings** to ensure consistency across systems and environments.

## CRUD Operations
The backend exposes a RESTful API that provides full CRUD functionality for the database:

- `POST /api/fungi` — Create a new fungal record  
- `GET /api/fungi` — Retrieve all fungal records  
- `GET /api/fungi/:id` — Retrieve a single record  
- `PATCH /api/fungi/:id` — Update one or more fields of a record  
- `DELETE /api/fungi/:id` — Delete a record  

The use of `PATCH` allows partial updates, ensuring that only modified fields are changed while preserving existing data.

## Data Seeding
To support development and testing, the database can be populated using a reproducible seed mechanism:

