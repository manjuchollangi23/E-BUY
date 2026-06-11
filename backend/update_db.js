import fs from 'fs';
import path from 'path';

const productsPath = path.resolve('data/products.json');
const seedDataPath = path.resolve('utils/seedData.js');

const girlsClothingProducts = [
  {
    name: 'Elegant Floral Summer Dress',
    description: 'A beautiful, lightweight summer dress featuring a vibrant floral pattern, A-line silhouette, and comfortable cotton-blend fabric. Perfect for warm sunny days and casual outings.',
    price: 1899.00,
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop'
    ],
    category: 'Girls Clothing',
    brand: 'Zara',
    rating: 4.6,
    numReviews: 12,
    countInStock: 25,
    discount: 15,
    deliveryTime: 'Tomorrow'
  },
  {
    name: 'Stunning Red Evening Gown',
    description: 'Turn heads at any formal event with this exquisite red evening gown. Made of premium satin with a sweetheart neckline, thigh-high slit, and elegant drape detail.',
    price: 4999.00,
    images: [
      'https://images.unsplash.com/photo-1612336307429-8a898d10e223?q=80&w=600&auto=format&fit=crop'
    ],
    category: 'Girls Clothing',
    brand: 'Vero Moda',
    rating: 4.8,
    numReviews: 24,
    countInStock: 10,
    discount: 10,
    deliveryTime: 'In 2 days'
  },
  {
    name: 'Pastel Pink Prom Dress',
    description: 'A magical prom dress featuring delicate lace embroidery, a tulle skirt layer, and a beautiful open back. Gives a charming princess feel for proms and wedding parties.',
    price: 3499.00,
    images: [
      'https://images.unsplash.com/photo-1518049368264-73b8006f3b90?q=80&w=600&auto=format&fit=crop'
    ],
    category: 'Girls Clothing',
    brand: 'Forever 21',
    rating: 4.7,
    numReviews: 18,
    countInStock: 15,
    discount: 20,
    deliveryTime: 'Tomorrow'
  },
  {
    name: 'Designer Emerald Party Dress',
    description: 'An elegant emerald green knee-length dress with puff sleeves, textured fabric, and a stylish waist belt. Perfect for cocktail parties and evening dinners.',
    price: 2799.00,
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=600&auto=format&fit=crop'
    ],
    category: 'Girls Clothing',
    brand: 'Zara',
    rating: 4.5,
    numReviews: 15,
    countInStock: 20,
    discount: 5,
    deliveryTime: 'Tomorrow'
  },
  {
    name: 'Classic Blue Summer Dress',
    description: 'Vibrant sky blue casual dress with adjustable shoulder straps and a smocked bodice. Made of 100% breathable organic linen for ultimate comfort.',
    price: 1599.00,
    images: [
      'https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?q=80&w=600&auto=format&fit=crop'
    ],
    category: 'Girls Clothing',
    brand: 'H&M',
    rating: 4.4,
    numReviews: 32,
    countInStock: 30,
    discount: 10,
    deliveryTime: 'Tomorrow'
  },
  {
    name: 'Stylish Casual Denim Dress',
    description: 'A classic button-down denim dress with long sleeves, breast pockets, and a matching waist tie. A versatile addition to your everyday wardrobe.',
    price: 2199.00,
    images: [
      'https://images.unsplash.com/photo-1550639525-c97d455acf70?q=80&w=600&auto=format&fit=crop'
    ],
    category: 'Girls Clothing',
    brand: "Levi's",
    rating: 4.6,
    numReviews: 29,
    countInStock: 18,
    discount: 12,
    deliveryTime: 'Tomorrow'
  }
];

const powerBankImages = [
  'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1619489646924-b4fce76b7552?q=80&w=600&auto=format&fit=crop'
];

// Helper to generate a random ID
const genId = (prefix = 'p_') => prefix + Math.random().toString(36).substr(2, 9);

const updateJsonDB = () => {
  if (!fs.existsSync(productsPath)) {
    console.log('No products.json fallback file found at:', productsPath);
    return;
  }

  const productsRaw = fs.readFileSync(productsPath, 'utf8');
  let products = JSON.parse(productsRaw || '[]');

  console.log(`Read ${products.length} products from products.json`);

  // Check if already scaled
  const macbook = products.find(p => p.name.includes('MacBook Pro'));
  const needsScale = macbook && macbook.price < 5000;

  if (needsScale) {
    console.log('Scaling prices by 80 to convert to reasonable INR prices...');
    products = products.map(p => {
      // Multiply by 80 and round nicely
      const newPrice = Math.round(p.price * 80);
      return {
        ...p,
        price: newPrice
      };
    });
  } else {
    console.log('Prices are already scaled or no MacBook found.');
  }

  // Fix Power Bank image
  products = products.map(p => {
    if (p.name.includes('Power Bank')) {
      console.log('Fixing Anker Power Bank image URLs...');
      return {
        ...p,
        images: powerBankImages
      };
    }
    return p;
  });

  // Check if Girls Clothing already exists
  const hasGirlsClothing = products.some(p => p.category === 'Girls Clothing');
  if (!hasGirlsClothing) {
    console.log('Adding Girls Clothing products to products.json...');
    const datedGirlsClothing = girlsClothingProducts.map(p => ({
      _id: genId(),
      ...p,
      reviews: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
    products = [...products, ...datedGirlsClothing];
  } else {
    console.log('Girls Clothing products already exist in products.json');
  }

  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf8');
  console.log('Successfully updated products.json!');
};

// Also update seedData.js to ensure persistent seeding
const updateSeedData = () => {
  if (!fs.existsSync(seedDataPath)) {
    console.log('No seedData.js found at:', seedDataPath);
    return;
  }

  let content = fs.readFileSync(seedDataPath, 'utf8');

  // We can also programmatically update the JS content, but a simpler way is to just do a search replace on seedDatabase or modify the JSON DB and seedData array.
  // Let's modify seedData.js to scale the prices and add mock products.
  console.log('Updating seedData.js mockProducts...');
};

updateJsonDB();
