const baseUrl = process.env.APP_URL || "http://localhost:3000";
const houseId = process.env.HOUSE_ID || "";
const systemId = process.env.SYSTEM_ID || "";
const itemId = process.env.ITEM_ID || "";

const routes = [
  "/",
  "/dashboard",
  houseId ? `/houses/${houseId}` : null,
  houseId ? `/houses/${houseId}/systems` : null,
  houseId && systemId ? `/houses/${houseId}/systems/${systemId}` : null,
  houseId ? `/houses/${houseId}/documents` : null,
  houseId ? `/houses/${houseId}/items` : null,
  houseId && itemId ? `/houses/${houseId}/items/${itemId}` : null,
  houseId && itemId ? `/houses/${houseId}/items/${itemId}/documents` : null,
  systemId ? `/qr/system/${systemId}` : null,
  itemId ? `/qr/item/${itemId}` : null,
].filter(Boolean);

let hasFailure = false;

for (const route of routes) {
  const url = `${baseUrl}${route}`;
  try {
    const res = await fetch(url, { redirect: "manual" });
    const ok = [200, 303, 307, 308].includes(res.status);

    if (!ok) {
      hasFailure = true;
      console.log(`FAIL ${res.status} ${route}`);
    } else {
      console.log(`OK   ${res.status} ${route}`);
    }
  } catch (err) {
    hasFailure = true;
    console.log(`FAIL ERR ${route}`);
    console.log(String(err));
  }
}

if (hasFailure) {
  process.exit(1);
}
