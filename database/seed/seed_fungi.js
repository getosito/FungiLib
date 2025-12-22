const fs = require("fs");
const path = require("path");

console.log("Starting seed script...");

const API_URL = "http://localhost:4000/api/fungi";

async function seed() {
  const filePath = path.join(__dirname, "fungi_samples.json");
  const fungi = JSON.parse(fs.readFileSync(filePath, "utf8"));

  let success = 0;

  for (const fungus of fungi) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fungus),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("FAILED:", res.status, err);
    } else {
      const created = await res.json();
      console.log("CREATED:", created.id, created.taxonomy.scientificName);
      success++;
    }
  }

  console.log(`\nSeed completed: ${success}/${fungi.length} records created.`);
}

seed().catch(console.error);
