const { db } = require("../config/firebaseAdmin");

/**
 * Normalize all images to:
 *   images/py-000X.jpg
 * using the primaryKey number (PY-FUN-00X)
 */
async function run() {
  const snap = await db.collection("fungi").get();

  const updates = [];

  for (const doc of snap.docs) {
    const data = doc.data();
    const pk = data?.identification?.primaryKey || doc.id;

    if (!pk) continue;

    const match = pk.match(/(\d+)/);
    if (!match) continue;

    const num = match[1].padStart(4, "0");
    const normalizedImage = `images/py-${num}.jpg`;

    const currentImages = data?.ecology?.images || [];

    if (
      Array.isArray(currentImages) &&
      currentImages.length === 1 &&
      currentImages[0] === normalizedImage
    ) {
      continue;
    }

    updates.push({
      ref: doc.ref,
      pk,
      image: normalizedImage
    });
  }

  console.log(`Found ${updates.length} documents to update`);

  // aplicar cambios
  for (const u of updates) {
    await u.ref.update({
      "ecology.images": [u.image]
    });

    console.log(`✔ ${u.pk} -> ${u.image}`);
  }

  console.log("DONE");
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
