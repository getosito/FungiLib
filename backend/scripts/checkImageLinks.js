const { db } = require("../config/firebaseAdmin");
const fetch = require("node-fetch");

async function run() {
  const snap = await db.collection("fungi").get();

  const seen = new Map(); // url -> primaryKey
  const broken = [];
  const duplicated = [];

  for (const doc of snap.docs) {
    const data = doc.data();
    const pk = data?.identification?.primaryKey || doc.id;
    const images = data?.ecology?.images || [];

    for (const url of images) {
      if (!url) continue;

      // check duplicated
      if (seen.has(url)) {
        duplicated.push({
          url,
          first: seen.get(url),
          second: pk,
        });
      } else {
        seen.set(url, pk);
      }

      // check reachable
      try {
        const res = await fetch(url, { method: "HEAD" });
        if (!res.ok) {
          broken.push({ pk, url, status: res.status });
        }
      } catch (err) {
        broken.push({ pk, url, error: err.message });
      }
    }
  }

  console.log("=== BROKEN LINKS ===");
  console.table(broken);

  console.log("\n=== DUPLICATED LINKS ===");
  console.table(duplicated);

  process.exit(0);
}

run();

