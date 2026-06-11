import fs from 'fs';
import path from 'path';

const productsPath = path.resolve('data/products.json');

const newProducts = [
  // Men
  {
    name: "Men's Slim Fit Denim Jacket",
    description: "A classic slim-fit denim jacket featuring chest flap pockets, button closures, and washed denim finish. The perfect casual layer for all seasons.",
    price: 2499,
    images: [
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=600&auto=format&fit=crop"
    ],
    category: "Men",
    brand: "Levi's",
    rating: 4.5,
    numReviews: 14,
    countInStock: 25,
    discount: 10,
    deliveryTime: "Tomorrow"
  },
  {
    name: "Men's Premium Leather Boot",
    description: "Crafted with 100% genuine full-grain leather, these boots feature a cushioned insole, breathable mesh lining, and heavy-duty slip-resistant rubber outsole.",
    price: 4899,
    images: [
      "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=600&auto=format&fit=crop"
    ],
    category: "Men",
    brand: "Woodland",
    rating: 4.7,
    numReviews: 22,
    countInStock: 12,
    discount: 15,
    deliveryTime: "In 2 days"
  },

  // Kids
  {
    name: "Kids' Colorful Dungaree Set",
    description: "Ultra-comfortable cotton dungaree set for kids with adjustable shoulder straps and a matching cotton striped t-shirt. Breathable and play-safe fabric.",
    price: 1299,
    images: [
      "https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=600&auto=format&fit=crop"
    ],
    category: "Kids",
    brand: "Mothercare",
    rating: 4.4,
    numReviews: 18,
    countInStock: 30,
    discount: 15,
    deliveryTime: "Tomorrow"
  },
  {
    name: "Kids' Printed Summer Floral Dress",
    description: "A breezy cotton summer dress with a charming floral print and ruffled sleeves. Lightweight, breathable, and pre-washed for extra softness.",
    price: 999,
    images: [
      "https://images.unsplash.com/photo-1622295057285-ed0f310a5591?q=80&w=600&auto=format&fit=crop"
    ],
    category: "Kids",
    brand: "Gini & Jony",
    rating: 4.6,
    numReviews: 11,
    countInStock: 20,
    discount: 10,
    deliveryTime: "Tomorrow"
  },

  // Accessories
  {
    name: "Premium Handcrafted Leather Wallet",
    description: "Classic bi-fold wallet made from premium top-grain leather. Includes 8 card slots, RFID blocking technology, and dual currency compartments.",
    price: 1599,
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=600&auto=format&fit=crop"
    ],
    category: "Accessories",
    brand: "Tommy Hilfiger",
    rating: 4.6,
    numReviews: 35,
    countInStock: 45,
    discount: 5,
    deliveryTime: "Tomorrow"
  },
  {
    name: "Minimalist Stainless Steel Cuff Bracelet",
    description: "Elegant and versatile steel cuff with a matte brushed finish. Corrosion-resistant, hypoallergenic, and adjustable fit for everyday fashion statement.",
    price: 899,
    images: [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop"
    ],
    category: "Accessories",
    brand: "Fossil",
    rating: 4.3,
    numReviews: 24,
    countInStock: 50,
    discount: 20,
    deliveryTime: "Tomorrow"
  },

  // Home Appliances
  {
    name: "Premium Robotic Vacuum Cleaner with Mop",
    description: "Smart robotic vacuum cleaner with advanced LiDAR navigation, powerful 4000Pa suction, dynamic mapping, and self-emptying dustbin support. Voice controllable.",
    price: 24999,
    images: [
      "https://images.unsplash.com/photo-1518349619113-13194a174c2b?q=80&w=600&auto=format&fit=crop"
    ],
    category: "Home Appliances",
    brand: "Xiaomi",
    rating: 4.8,
    numReviews: 19,
    countInStock: 8,
    discount: 10,
    deliveryTime: "In 2 days"
  },
  {
    name: "Smart Digital Air Fryer 5.5L",
    description: "Oil-free rapid air circulation fryer with a digital touch panel, 8 smart pre-sets, and dishwasher-safe non-stick basket. Eat healthy, crispy meals.",
    price: 6499,
    images: [
      "https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?q=80&w=600&auto=format&fit=crop"
    ],
    category: "Home Appliances",
    brand: "Philips",
    rating: 4.7,
    numReviews: 54,
    countInStock: 15,
    discount: 15,
    deliveryTime: "Tomorrow"
  }
];

const genId = (prefix = 'p_') => prefix + Math.random().toString(36).substr(2, 9);

const updateDB = () => {
  if (!fs.existsSync(productsPath)) {
    console.error('No products.json fallback file found at:', productsPath);
    return;
  }

  const rawData = fs.readFileSync(productsPath, 'utf8');
  let products = JSON.parse(rawData || '[]');

  console.log(`Loaded ${products.length} products from products.json`);

  // 1. Fix Pastel Pink Prom Dress image
  products = products.map(p => {
    if (p.name.includes('Pastel Pink Prom Dress')) {
      console.log('Fixing Pastel Pink Prom Dress image URL...');
      return {
        ...p,
        images: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop"]
      };
    }
    return p;
  });

  // 2. Add new categories items
  const newProductsWithDates = newProducts.map(p => {
    // If we already have a product with this exact name, skip adding it
    const exists = products.some(existing => existing.name === p.name);
    if (exists) return null;

    return {
      _id: genId(),
      ...p,
      reviews: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }).filter(Boolean);

  if (newProductsWithDates.length > 0) {
    console.log(`Adding ${newProductsWithDates.length} new items to products.json...`);
    products = [...products, ...newProductsWithDates];
  } else {
    console.log('New category items already exist in the database.');
  }

  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf8');
  console.log('Database successfully updated!');
};

updateDB();
