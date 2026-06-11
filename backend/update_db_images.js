import fs from 'fs';
import path from 'path';

const productsPath = path.resolve('data/products.json');
const seedDataPath = path.resolve('utils/seedData.js');

const imagePools = {
  "Electronics": [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600",
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=600",
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=600",
    "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=600",
    "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=600",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600",
    "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=600",
    "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?q=80&w=600",
    "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?q=80&w=600",
    "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=600",
    "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?q=80&w=600"
  ],
  "Mobiles": [
    "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600",
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600",
    "https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=600",
    "https://images.unsplash.com/photo-1573148195900-7845dcb9b127?q=80&w=600",
    "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=600",
    "https://images.unsplash.com/photo-1605236453806-6ff36851218e?q=80&w=600",
    "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600",
    "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?q=80&w=600",
    "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=600",
    "https://images.unsplash.com/photo-1557180295-76eee20ae8aa?q=80&w=600",
    "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?q=80&w=600"
  ],
  "Girls Clothing": [
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600",
    "https://images.unsplash.com/photo-1612336307429-8a898d10e223?q=80&w=600",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600",
    "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=600",
    "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?q=80&w=600",
    "https://images.unsplash.com/photo-1550639525-c97d455acf70?q=80&w=600",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600",
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600",
    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600",
    "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=600",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600",
    "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?q=80&w=600"
  ],
  "Men": [
    "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=600",
    "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=600",
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600",
    "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=600",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600",
    "https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=600",
    "https://images.unsplash.com/photo-1618886614638-80e3c103d31a?q=80&w=600",
    "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=600",
    "https://images.unsplash.com/photo-1550246140-5119ae4790b8?q=80&w=600",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600"
  ],
  "Kids": [
    "https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=600",
    "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=600",
    "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=600",
    "https://images.unsplash.com/photo-1513553404607-988bf2703777?q=80&w=600",
    "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80&w=600",
    "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=600",
    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=600",
    "https://images.unsplash.com/photo-1566004100631-35d015d6a491?q=80&w=600"
  ],
  "Accessories": [
    "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=600",
    "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600",
    "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=600",
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=600",
    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600",
    "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=600",
    "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=600",
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600",
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600",
    "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?q=80&w=600"
  ],
  "Skin Care": [
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600",
    "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=600",
    "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=600",
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=600",
    "https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=600",
    "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=600",
    "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=600",
    "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=600",
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600",
    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600",
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600"
  ],
  "Fashion": [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600",
    "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=600",
    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600",
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600",
    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600",
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600",
    "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600",
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=600",
    "https://images.unsplash.com/photo-1508296695146-257a814070b4?q=80&w=600",
    "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600",
    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=600"
  ],
  "Home Essentials": [
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=600",
    "https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?q=80&w=600",
    "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=600",
    "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?q=80&w=600",
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600",
    "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600",
    "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=600",
    "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=600",
    "https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=600",
    "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600",
    "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?q=80&w=600"
  ],
  "Gaming": [
    "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=600",
    "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600",
    "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=600",
    "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=600",
    "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=600",
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600",
    "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=600",
    "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=600",
    "https://images.unsplash.com/photo-1600861195091-690c92f1d2cc?q=80&w=600",
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600"
  ]
};

// V2 Specific correct images
const v2CorrectImages = {
  "Men's Slim Fit Denim Jacket": ["https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=600"],
  "Men's Premium Leather Boot": ["https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=600"],
  "Kids' Colorful Dungaree Set": ["https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=600"],
  "Kids' Printed Summer Floral Dress": ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=600"],
  "Premium Handcrafted Leather Wallet": ["https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=600"],
  "Minimalist Stainless Steel Cuff Bracelet": ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600"],
  "Premium Robotic Vacuum Cleaner with Mop": ["https://images.unsplash.com/photo-1610484826967-09c5720778c7?q=80&w=600"],
  "Smart Digital Air Fryer 5.5L": ["https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?q=80&w=600"]
};

// Main execution block
const main = async () => {
  if (!fs.existsSync(productsPath)) {
    console.error('products.json not found!');
    process.exit(1);
  }

  // 1. Read seedData.js to construct name-to-images map for seed products
  const seedDataContent = fs.readFileSync(seedDataPath, 'utf8');
  const seedImagesMap = {};
  const productRegex = /\{\s*name:\s*'([^']+)',[\s\S]*?images:\s*\[([\s\S]*?)\]/g;
  let match;
  while ((match = productRegex.exec(seedDataContent)) !== null) {
    const name = match[1];
    const imagesStr = match[2];
    const images = imagesStr
      .split(',')
      .map(x => x.trim().replace(/'/g, '').replace(/"/g, ''))
      .filter(x => x.length > 0);
    seedImagesMap[name] = images;
  }
  console.log(`Parsed ${Object.keys(seedImagesMap).length} seed products from seedData.js`);

  // 2. Load the current products.json database
  const rawProducts = fs.readFileSync(productsPath, 'utf8');
  let products = JSON.parse(rawProducts || '[]');
  console.log(`Loaded ${products.length} products from products.json`);

  // 3. Process products
  const categoryCounts = {};
  Object.keys(imagePools).forEach(cat => {
    categoryCounts[cat] = 0;
  });

  products = products.map((p) => {
    // A. Re-categorize vacuum cleaner & air fryer to Home Essentials
    if (p.name.includes("Robotic Vacuum Cleaner") || p.name.includes("Air Fryer")) {
      p.category = "Home Essentials";
    }

    // B. Check if it's a seed product (by exact name matching)
    if (seedImagesMap[p.name]) {
      return {
        ...p,
        images: seedImagesMap[p.name]
      };
    }

    // C. Check if it's a V2 product
    if (v2CorrectImages[p.name]) {
      return {
        ...p,
        images: v2CorrectImages[p.name]
      };
    }

    // D. If it's a generic product (Premium ... Item Model-X)
    if (p.name.startsWith("Premium") && p.name.includes("Model-")) {
      const cat = p.category;
      if (imagePools[cat]) {
        const index = categoryCounts[cat] % imagePools[cat].length;
        categoryCounts[cat]++;
        return {
          ...p,
          images: [imagePools[cat][index], imagePools[cat][(index + 1) % imagePools[cat].length]]
        };
      }
    }

    // Default: keep as is
    return p;
  });

  // 4. Save the updated database
  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf8');
  console.log('Successfully updated products.json database!');

  // 5. Live validation of ALL image URLs in the updated products.json
  console.log('\nValidating all image URLs in products.json...');
  const allUrls = new Set();
  products.forEach(p => {
    p.images.forEach(img => {
      if (img && img.startsWith('http')) {
        allUrls.add(img);
      }
    });
  });

  const checkUrl = async (url) => {
    try {
      const res = await fetch(url, { method: 'HEAD', headers: { 'User-Agent': 'Mozilla/5.0' } });
      return { url, status: res.status, ok: res.ok };
    } catch (err) {
      return { url, status: err.message, ok: false };
    }
  };

  const results = [];
  const urlArray = Array.from(allUrls);
  const chunkSize = 15;
  for (let i = 0; i < urlArray.length; i += chunkSize) {
    const chunk = urlArray.slice(i, i + chunkSize);
    const promises = chunk.map(url => checkUrl(url));
    const chunkResults = await Promise.all(promises);
    results.push(...chunkResults);
  }

  const broken = results.filter(r => !r.ok);
  if (broken.length > 0) {
    console.error(`\nValidation failed! Found ${broken.length} broken image URLs:`);
    broken.forEach(b => console.error(`- ${b.url} : ${b.status}`));
    process.exit(1);
  } else {
    console.log(`\nValidation passed! All ${results.length} unique image URLs are working perfectly (200 OK)!`);
  }
};

main().catch(err => {
  console.error('Fatal error during database update:', err);
  process.exit(1);
});
