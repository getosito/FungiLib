const { db /*, bucket */ } = require('../config/firebaseAdmin');
// const { v4: uuidv4 } = require('uuid');

const fungiCollection = db.collection('fungi');

// CREATE ───────────────────────────────────────────────────────────────
async function createFungus(req, res) {
  try {
    const data = req.body;

    const {
      identification = {},
      taxonomy = {},
      ecology = {},
      collectionData = {},
      labInfo = {},
      labNotes = ""
    } = data;

    const pk = (identification.primaryKey || "").trim();

    if (!pk) {
      return res.status(400).json({ error: "identification.primaryKey is required" });
    }
    if (!taxonomy.scientificName) {
      return res.status(400).json({ error: "taxonomy.scientificName is required" });
    }
    if (!identification.collectionNumber) {
      return res.status(400).json({ error: "identification.collectionNumber is required" });
    }

    const now = new Date().toISOString();

    const doc = {
      id: pk,
      createdAt: now,
      updatedAt: now,

      identification: {
        primaryKey: pk,
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
        images: Array.isArray(ecology.images) ? ecology.images : [],
        gps: ecology.gps || null,
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

    await fungiCollection.doc(pk).set(doc);

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

    const raw = [];
    snapshot.forEach(doc => {
      raw.push({
        id: doc.id,
        ...doc.data()
      });
    });

    const byPk = new Map();
    for (const item of raw) {
      const pk = item?.identification?.primaryKey || item?.id;
      if (!pk) continue;
      byPk.set(pk, item);
    }

    const results = Array.from(byPk.values());

    results.sort((a, b) => {
      const pa = a?.identification?.primaryKey ?? "";
      const pb = b?.identification?.primaryKey ?? "";
      return pa.localeCompare(pb, undefined, {
        numeric: true,
        sensitivity: "base"
      });
    });

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

    if (!doc.exists) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json(doc.data());
  } catch (err) {
    console.error("getFungus error:", err);
    res.status(500).json({ error: "Failed to fetch fungus" });
  }
}

// UPDATE ───────────────────────────────────────────────────────────────
async function updateFungus(req, res) {
  try {
    const id = req.params.id;
    const docRef = fungiCollection.doc(id);

    const snap = await docRef.get();
    if (!snap.exists) {
      return res.status(404).json({ error: "Not found" });
    }

    const existing = snap.data();
    const data = req.body || {};

    const deepMerge = (base, incoming) => {
      if (!incoming || typeof incoming !== "object") return base;
      const out = { ...(base || {}) };
      for (const k of Object.keys(incoming)) {
        const v = incoming[k];
        if (v && typeof v === "object" && !Array.isArray(v)) {
          out[k] = deepMerge(out[k], v);
        } else {
          out[k] = v;
        }
      }
      return out;
    };

    const now = new Date().toISOString();

    const updatedDoc = {
      ...existing,
      updatedAt: now,

      identification: {
        ...deepMerge(existing.identification, data.identification),
        primaryKey: id
      },

      taxonomy: deepMerge(existing.taxonomy, data.taxonomy),
      ecology: deepMerge(existing.ecology, data.ecology),
      collectionData: deepMerge(existing.collectionData, data.collectionData),
      labInfo: deepMerge(existing.labInfo, data.labInfo),

      labNotes:
        data.labNotes !== undefined
          ? data.labNotes
          : existing.labNotes
    };

    if (!updatedDoc?.taxonomy?.scientificName) {
      return res.status(400).json({ error: "taxonomy.scientificName is required" });
    }
    if (!updatedDoc?.identification?.collectionNumber) {
      return res.status(400).json({ error: "identification.collectionNumber is required" });
    }

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
    const ref = fungiCollection.doc(id);

    const snap = await ref.get();
    if (!snap.exists) {
      return res.status(404).json({ error: "Not found" });
    }

    await ref.delete();
    res.json({ success: true, id });
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
