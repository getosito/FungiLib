const { db, bucket } = require('../config/firebaseAdmin');
const { v4: uuidv4 } = require('uuid');

const fungiCollection = db.collection('fungi');

// CREATE ───────────────────────────────────────────────────────────────
async function createFungus(req, res) {
  try {
    const data = req.body;
    const id = uuidv4();
    let images = [];

    // 1) Upload images to Firebase Storage (if any)
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const filename = `fungi/${id}/${Date.now()}_${file.originalname}`;
        const fileRef = bucket.file(filename);

        await fileRef.save(file.buffer, {
          metadata: { contentType: file.mimetype }
        });

        const [url] = await fileRef.getSignedUrl({
          action: 'read',
          expires: Date.now() + 1000 * 60 * 60 * 24 * 365 // 1 year
        });

        images.push(url);
      }
    }

    // 2) Destructure body into the groups from your project doc
    const {
      identification = {},   // primaryKey, collectionNumber
      taxonomy = {},         // commonName, scientificName, division, class, order, family, genus, species
      ecology = {},          // gps, ecoregion
      collectionData = {},   // coordinates, date, collectedBy, cultureCollectionNumber, author
      labInfo = {},          // herbariumEntryNumber, shelfNumber, boxNumber, etc.
      labNotes = ""          // free text
    } = data;

    // 3) Basic validation (at least scientific name required)
    if (!taxonomy.scientificName) {
      return res.status(400).json({
        error: "taxonomy.scientificName is required"
      });
    }

    if (!identification.collectionNumber) {
      return res.status(400).json({
        error: "identification.collectionNumber is required"
      });
    }

    // 4) Build document exactly in the format you’ll describe in the report
    const now = new Date().toISOString();

    const doc = {
      id,
      createdAt: now,
      updatedAt: now,

      identification: {
        primaryKey: identification.primaryKey || "",
        collectionNumber: identification.collectionNumber || ""
      },

      taxonomy: {
        commonName: taxonomy.commonName || "",
        scientificName: taxonomy.scientificName || "",
        division: taxonomy.division || "",
        class: taxonomy.class || "",
        order: taxonomy.order || "",
        family: taxonomy.family || "",
        genus: taxonomy.genus || "",
        species: taxonomy.species || ""
      },

      ecology: {
        // uploaded images take priority
        images: images.length > 0 ? images : (ecology.images || []),
        gps: ecology.gps || null,        // { lat, lng }
        ecoregion: ecology.ecoregion || ""
      },

      collectionData: {
        coordinates: collectionData.coordinates || "",
        date: collectionData.date || "",
        collectedBy: collectionData.collectedBy || "",
        cultureCollectionNumber: collectionData.cultureCollectionNumber || "",
        author: collectionData.author || ""
      },

      labInfo: {
        location: labInfo.location || "",
        herbariumEntryNumber: labInfo.herbariumEntryNumber || "",
        collector: labInfo.collector || "",
        collectionNumber: labInfo.collectionNumber || "",
        physicalEvidence: labInfo.physicalEvidence || "",
        shelfNumber: labInfo.shelfNumber || "",
        boxNumber: labInfo.boxNumber || ""
      },

      labNotes: labNotes || ""
    };

    await fungiCollection.doc(id).set(doc);
    res.status(201).json(doc);
  } catch (err) {
    console.error("createFungus error:", err);
    res.status(500).json({ error: "Failed to create fungus" });
  }
}

// LIST ────────────────────────────────────────────────────────────────
async function listFungi(req, res) {
  try {
    const snapshot = await fungiCollection.get();
    const results = [];
    snapshot.forEach(doc => results.push(doc.data()));
    res.json(results);
  } catch (err) {
    console.error("listFungi error:", err);
    res.status(500).json({ error: "Failed to fetch fungi" });
  }
}

// GET ONE ─────────────────────────────────────────────────────────────
async function getFungus(req, res) {
  try {
    const id = req.params.id;
    const doc = await fungiCollection.doc(id).get();

    if (!doc.exists) return res.status(404).json({ error: "Not found" });

    res.json(doc.data());
  } catch (err) {
    console.error("getFungus error:", err);
    res.status(500).json({ error: "Failed to fetch fungus" });
  }
}

// UPDATE (PATCH) ───────────────────────────────────────────────────────
async function updateFungus(req, res) {
  try {
    const id = req.params.id;
    const docRef = fungiCollection.doc(id);

    // 1) Check if exists
    const existingSnap = await docRef.get();
    if (!existingSnap.exists) {
      return res.status(404).json({ error: "Not found" });
    }

    const existing = existingSnap.data() || {};
    const data = req.body || {};
    let uploadedImages = [];

    // 2) Upload new images if provided (optional)
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const filename = `fungi/${id}/${Date.now()}_${file.originalname}`;
        const fileRef = bucket.file(filename);

        await fileRef.save(file.buffer, {
          metadata: { contentType: file.mimetype }
        });

        const [url] = await fileRef.getSignedUrl({
          action: "read",
          expires: Date.now() + 1000 * 60 * 60 * 24 * 365 // 1 year
        });

        uploadedImages.push(url);
      }
    }

    // 3) Destructure like create
    const {
      identification = {},
      taxonomy = {},
      ecology = {},
      collectionData = {},
      labInfo = {},
      labNotes
    } = data;

    // Helper: deep merge objects (keeps existing fields if not provided)
    const deepMerge = (base, incoming) => {
      if (!incoming || typeof incoming !== "object") return base;
      const out = { ...(base || {}) };
      for (const key of Object.keys(incoming)) {
        const v = incoming[key];
        if (v && typeof v === "object" && !Array.isArray(v)) {
          out[key] = deepMerge(out[key], v);
        } else {
          out[key] = v;
        }
      }
      return out;
    };

    // 4) Build updated doc based on existing + incoming
    const now = new Date().toISOString();

    // Keep current images unless:
    // - uploadedImages exist (take priority)
    // - or ecology.images provided (use them)
    const existingImages = existing?.ecology?.images || [];
    const mergedEcology = deepMerge(existing.ecology, ecology);

    const finalImages =
      uploadedImages.length > 0
        ? uploadedImages
        : (Array.isArray(mergedEcology.images) ? mergedEcology.images : existingImages);

    const updatedDoc = {
      ...existing,
      id: existing.id || id,
      updatedAt: now,

      identification: deepMerge(existing.identification, identification),
      taxonomy: deepMerge(existing.taxonomy, taxonomy),
      ecology: {
        ...mergedEcology,
        images: finalImages,
        gps: mergedEcology.gps ?? existing?.ecology?.gps ?? null,
        ecoregion: mergedEcology.ecoregion ?? existing?.ecology?.ecoregion ?? ""
      },
      collectionData: deepMerge(existing.collectionData, collectionData),
      labInfo: deepMerge(existing.labInfo, labInfo),

      // Only overwrite labNotes if the request sent it
      labNotes: (labNotes !== undefined) ? labNotes : (existing.labNotes || "")
    };

    // 5) Basic validation: make sure required fields still exist
    if (!updatedDoc?.taxonomy?.scientificName) {
      return res.status(400).json({ error: "taxonomy.scientificName is required" });
    }
    if (!updatedDoc?.identification?.collectionNumber) {
      return res.status(400).json({ error: "identification.collectionNumber is required" });
    }

    // 6) Save (overwrite document with merged object)
    await docRef.set(updatedDoc);

    res.json(updatedDoc);
  } catch (err) {
    console.error("updateFungus error:", err);
    res.status(500).json({ error: "Failed to update fungus" });
  }
}

// DELETE ──────────────────────────────────────────────────────────────
async function deleteFungus(req, res) {
  try {
    const id = req.params.id;
    await fungiCollection.doc(id).delete();
    res.json({ success: true });
  } catch (err) {
    console.error("deleteFungus error:", err);
    res.status(500).json({ error: "Failed to delete fungus" });
  }
}

module.exports = {
  createFungus,
  listFungi,
  getFungus,
  updateFungus,
  deleteFungus
};

