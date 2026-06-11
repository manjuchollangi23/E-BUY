import { User } from '../models/userModel.js';
import { Product } from '../models/productModel.js';
import { useLocalDB, readLocalFile, writeLocalFile } from '../config/db.js';
import mongoose from 'mongoose';

// Initial Mock Review Lists
const reviewsMock = [
  { name: 'John Doe', rating: 5, comment: 'Absolutely amazing product! Exceeded my expectations.' },
  { name: 'Sarah Connor', rating: 4, comment: 'Very high quality build, though shipping took an extra day.' },
  { name: 'Mike Ross', rating: 5, comment: 'Super fast delivery and the item works flawlessly. Highly recommend!' },
  { name: 'Jane Miller', rating: 3, comment: 'Decent value, but could have been packaged better.' }
];

const mockProducts = [
  // =================== ELECTRONICS ===================
  {
    name: 'Sony WH-1000XM4 Noise Canceling Headphones',
    description: 'Industry-leading noise-canceling wireless over-ear headphones with Alexa voice control. Features dual noise sensor technology, up to 30-hour battery life, and touch control sensors.',
    price: 348.00,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90'
    ],
    category: 'Electronics',
    brand: 'Sony',
    rating: 4.8,
    numReviews: 24,
    countInStock: 15,
    discount: 15,
    deliveryTime: 'Tomorrow',
    reviews: []
  },
  {
    name: 'MacBook Pro 16-inch M3 Max',
    description: 'The ultimate laptop for creators and developers. Features the Apple M3 Max chip with 16-core CPU, 40-core GPU, 48GB unified memory, and 1TB SSD. Liquid Retina XDR display.',
    price: 3499.00,
    images: [
      'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=600',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=600',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=600'
    ],
    category: 'Electronics',
    brand: 'Apple',
    rating: 4.9,
    numReviews: 12,
    countInStock: 8,
    discount: 10,
    deliveryTime: 'In 2 days',
    reviews: []
  },
  {
    name: 'Mechanical RGB Gaming Keyboard',
    description: 'Wired gaming keyboard with tactile blue switches, customizable RGB chroma backlighting, and solid aluminum faceplate. Ideal for high-speed professional gaming.',
    price: 79.99,
    images: [
      'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae',
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3',
      'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6'
    ],
    category: 'Electronics',
    brand: 'Logitech',
    rating: 4.5,
    numReviews: 19,
    countInStock: 25,
    discount: 20,
    deliveryTime: '3-5 business days',
    reviews: []
  },
  {
    name: 'Smart Watch Fitness Tracker',
    description: 'Advanced smartwatch with 24/7 heart rate tracking, blood oxygen level monitor, sleep analysis, and built-in GPS. Features 1.4-inch AMOLED display and 10-day battery life.',
    price: 199.00,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1',
      'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9'
    ],
    category: 'Electronics',
    brand: 'Samsung',
    rating: 4.6,
    numReviews: 32,
    countInStock: 18,
    discount: 5,
    deliveryTime: 'Tomorrow',
    reviews: []
  },
  {
    name: 'Anker Power Bank 20000mAh',
    description: 'Ultra-high capacity portable charger with PowerIQ technology. Delivers fast charging speeds for iPhones, iPads, and Android devices. Compact and travel-safe design.',
    price: 49.99,
    images: [
      'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?q=80&w=600',
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=600'
    ],
    category: 'Electronics',
    brand: 'Anker',
    rating: 4.7,
    numReviews: 54,
    countInStock: 40,
    discount: 10,
    deliveryTime: 'Tomorrow',
    reviews: []
  },
  {
    name: 'Logitech MX Master 3S Wireless Mouse',
    description: 'Performance wireless mouse with 8K DPI tracking, ultra-quiet clicks, and electromagnetic scrolling. Ergonomic design, compatible with macOS, Windows, and Linux.',
    price: 99.00,
    images: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7',
      'https://images.unsplash.com/photo-1625766763788-95dcce9bf5ac'
    ],
    category: 'Electronics',
    brand: 'Logitech',
    rating: 4.9,
    numReviews: 45,
    countInStock: 30,
    discount: 0,
    deliveryTime: 'Tomorrow',
    reviews: []
  },

  // =================== MOBILES ===================
  {
    name: 'Apple iPhone 15 Pro Max',
    description: 'Forged in titanium, featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever with 5x optical zoom.',
    price: 1199.00,
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5',
      'https://images.unsplash.com/photo-1573148195900-7845dcb9b127'
    ],
    category: 'Mobiles',
    brand: 'Apple',
    rating: 4.8,
    numReviews: 56,
    countInStock: 12,
    discount: 5,
    deliveryTime: 'Tomorrow',
    reviews: []
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Welcome to the era of mobile AI. With Galaxy S24 Ultra, you can unleash whole new levels of creativity, productivity and possibility, featuring a 200MP camera and built-in S Pen.',
    price: 1299.99,
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505'
    ],
    category: 'Mobiles',
    brand: 'Samsung',
    rating: 4.7,
    numReviews: 29,
    countInStock: 14,
    discount: 8,
    deliveryTime: 'Tomorrow',
    reviews: []
  },
  {
    name: 'Google Pixel 8 Pro',
    description: 'The all-pro phone engineered by Google. Features the custom Google Tensor G3 chip, advanced triple-camera system, AI photo editing, and a stunning 6.7-inch Super Actua display.',
    price: 999.00,
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97',
      'https://images.unsplash.com/photo-1605236453806-6ff36851218e'
    ],
    category: 'Mobiles',
    brand: 'Google',
    rating: 4.4,
    numReviews: 18,
    countInStock: 10,
    discount: 12,
    deliveryTime: 'In 2 days',
    reviews: []
  },
  {
    name: 'OnePlus 12 5G',
    description: 'Powered by Snapdragon 8 Gen 3, OnePlus 12 delivers flagship-grade power with up to 16GB LPDDR5X RAM, 5400mAh battery, 100W SUPERVOOC charging, and 4th Gen Hasselblad Camera.',
    price: 799.00,
    images: [
      'https://images.unsplash.com/photo-1580910051074-3eb694886505',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9'
    ],
    category: 'Mobiles',
    brand: 'OnePlus',
    rating: 4.6,
    numReviews: 22,
    countInStock: 15,
    discount: 10,
    deliveryTime: '3-5 business days',
    reviews: []
  },

  // =================== FASHION ===================
  {
    name: 'Classic Running Sneakers',
    description: 'Lightweight, breathable running shoes with cloud-soft foam cushioning and high-grip rubber outsole. Perfect for daily workouts and casual wear.',
    price: 120.00,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a'
    ],
    category: 'Fashion',
    brand: 'Nike',
    rating: 4.4,
    numReviews: 31,
    countInStock: 22,
    discount: 25,
    deliveryTime: 'In 2 days',
    reviews: []
  },
  {
    name: 'Premium Cotton Hoodie',
    description: 'Cozy and stylish overhead hoodie made from 100% organic heavy cotton. Features double-lined hood, ribbed cuffs, and pouch pocket. Standard unisex fit.',
    price: 55.00,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633'
    ],
    category: 'Fashion',
    brand: 'Champion',
    rating: 4.3,
    numReviews: 14,
    countInStock: 18,
    discount: 15,
    deliveryTime: 'Tomorrow',
    reviews: []
  },
  {
    name: 'Minimalist Travel Backpack',
    description: 'Durable, water-resistant canvas laptop backpack with multiple security pockets and integrated USB charging port. Comfort padded straps fit up to 15.6-inch laptops.',
    price: 65.00,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3',
      'https://images.unsplash.com/photo-1577733966973-d680bffd2e80'
    ],
    category: 'Fashion',
    brand: 'Herschel',
    rating: 4.5,
    numReviews: 28,
    countInStock: 16,
    discount: 0,
    deliveryTime: '3-5 business days',
    reviews: []
  },
  {
    name: 'Classic Clubmaster Sunglasses',
    description: 'Retro-inspired frame with acetate rims, metal bridges, and non-polarized UV400 protective lenses. Includes protective leather case and cleaning cloth.',
    price: 154.00,
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f'
    ],
    category: 'Fashion',
    brand: 'Ray-Ban',
    rating: 4.7,
    numReviews: 40,
    countInStock: 12,
    discount: 10,
    deliveryTime: 'Tomorrow',
    reviews: []
  },
  {
    name: 'Waterproof Sports Chronograph Watch',
    description: 'Men’s stainless steel analog watch with scratch-resistant mineral glass, luminous hands, calendar window, and stopwatch sub-dials. Water-resistant up to 50 meters.',
    price: 185.00,
    images: [
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314',
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa'
    ],
    category: 'Fashion',
    brand: 'Seiko',
    rating: 4.6,
    numReviews: 17,
    countInStock: 10,
    discount: 20,
    deliveryTime: 'Tomorrow',
    reviews: []
  },
  {
    name: 'Organic Crewneck T-Shirt 3-Pack',
    description: 'Essential everyday cotton t-shirts in classic fit. Breathable fabric that retains shape and softness wash after wash. Includes black, white, and heather grey.',
    price: 35.00,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a'
    ],
    category: 'Fashion',
    brand: 'Uniqlo',
    rating: 4.2,
    numReviews: 23,
    countInStock: 50,
    discount: 5,
    deliveryTime: 'Tomorrow',
    reviews: []
  },

  // =================== HOME ESSENTIALS ===================
  {
    name: 'Ergonomic Mesh Office Chair',
    description: 'High-back desk chair featuring adaptive lumbar support, 3D armrests, dynamic tilting lock mechanism, and heavy-duty nylon wheelbase. Relieves spine pressure for all-day focus.',
    price: 249.99,
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
      'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27',
      'https://images.unsplash.com/photo-1592078615290-033ee584e267'
    ],
    category: 'Home Essentials',
    brand: 'Herman Miller',
    rating: 4.6,
    numReviews: 15,
    countInStock: 10,
    discount: 30,
    deliveryTime: 'In 3 days',
    reviews: []
  },
  {
    name: 'Programmable Drip Coffee Maker',
    description: '12-cup glass carafe coffee maker with customizable brew strength settings, 24-hour auto-start timer, self-cleaning mode, and hotplate temperature controls.',
    price: 89.95,
    images: [
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085',
      'https://images.unsplash.com/photo-1513530534585-c7b1394c6d51'
    ],
    category: 'Home Essentials',
    brand: 'Cuisinart',
    rating: 4.4,
    numReviews: 33,
    countInStock: 15,
    discount: 15,
    deliveryTime: 'Tomorrow',
    reviews: []
  },
  {
    name: 'Modern Dimmable Desk Lamp',
    description: 'Sleek metal table lamp with rotating head, adjustable brightness control, 3 color-temperature modes, and integrated wireless fast charging base for smartphones.',
    price: 45.00,
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=600',
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600'
    ],
    category: 'Home Essentials',
    brand: 'Philips',
    rating: 4.5,
    numReviews: 21,
    countInStock: 20,
    discount: 0,
    deliveryTime: 'Tomorrow',
    reviews: []
  },
  {
    name: 'Stainless Steel Air Fryer',
    description: 'Multifunctional digital air fryer with 5.8-quart basket size, 11 convenient preset buttons, and rapid 360 air heat circulation for oil-free crispy cooking.',
    price: 119.99,
    images: [
      'https://images.unsplash.com/photo-1621972750749-0fbb1abb7736',
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7'
    ],
    category: 'Home Essentials',
    brand: 'Cosori',
    rating: 4.8,
    numReviews: 44,
    countInStock: 14,
    discount: 10,
    deliveryTime: 'Tomorrow',
    reviews: []
  },
  {
    name: 'Memory Foam Bed Pillows (2-Pack)',
    description: 'Premium shredded memory foam pillows with breathable bamboo covers. Height adjustable filler accommodates side, back, and stomach sleepers.',
    price: 39.99,
    images: [
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2',
      'https://images.unsplash.com/photo-1631679706909-1844bbd07221'
    ],
    category: 'Home Essentials',
    brand: 'SleepyHead',
    rating: 4.3,
    numReviews: 12,
    countInStock: 30,
    discount: 10,
    deliveryTime: 'In 2 days',
    reviews: []
  },
  {
    name: 'Electric Gooseneck Kettle',
    description: '1.0-liter capacity electric kettle with precision pour spout, temperature control range of 140-212 F, and automatic 1-hour warm holding temperature profile.',
    price: 69.99,
    images: [
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3',
      'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48'
    ],
    category: 'Home Essentials',
    brand: 'Fellow',
    rating: 4.7,
    numReviews: 25,
    countInStock: 15,
    discount: 0,
    deliveryTime: 'Tomorrow',
    reviews: []
  },

  // =================== GAMING ===================
  {
    name: 'Sony PlayStation 5 Console (Slim)',
    description: 'Experience lightning-fast loading with an ultra-high-speed SSD, deeper immersion with support for haptic feedback, adaptive triggers, 3D Audio, and an all-new generation of incredible PlayStation games.',
    price: 499.00,
    images: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=600',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600',
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=600'
    ],
    category: 'Gaming',
    brand: 'Sony',
    rating: 4.9,
    numReviews: 87,
    countInStock: 6,
    discount: 0,
    deliveryTime: 'Tomorrow',
    reviews: []
  },
  {
    name: 'Xbox Wireless Controller - Carbon Black',
    description: 'Experience the modernized design of the Xbox Wireless Controller, featuring sculpted surfaces and refined geometry for enhanced comfort during gameplay.',
    price: 59.99,
    images: [
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3',
      'https://images.unsplash.com/photo-1593305841991-05c297ba4575'
    ],
    category: 'Gaming',
    brand: 'Microsoft',
    rating: 4.6,
    numReviews: 38,
    countInStock: 25,
    discount: 15,
    deliveryTime: 'Tomorrow',
    reviews: []
  },
  {
    name: 'Nintendo Switch OLED Model',
    description: 'Features a vibrant 7-inch OLED screen, a wide adjustable stand, a dock with a wired LAN port, 64 GB of internal storage, and enhanced audio in handheld and tabletop modes.',
    price: 349.99,
    images: [
      'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f'
    ],
    category: 'Gaming',
    brand: 'Nintendo',
    rating: 4.8,
    numReviews: 41,
    countInStock: 10,
    discount: 5,
    deliveryTime: 'Tomorrow',
    reviews: []
  },
  {
    name: 'HyperX Cloud II Gaming Headset',
    description: 'Comfortable over-ear gaming headphones featuring memory foam ear cushions, padded leatherette headband, digitally enhanced noise-canceling microphone, and hardware-driven virtual 7.1 surround sound.',
    price: 99.99,
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef'
    ],
    category: 'Gaming',
    brand: 'HyperX',
    rating: 4.5,
    numReviews: 49,
    countInStock: 20,
    discount: 20,
    deliveryTime: 'Tomorrow',
    reviews: []
  },
  {
    name: 'Secretlab TITAN Evo Gaming Chair',
    description: 'Evolved design with proprietary Pebble seat base, magnetic memory foam head pillow, 4-way lumbar support system, and heavy duty cold-cure foam for long gaming sessions.',
    price: 549.00,
    images: [
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600',
      'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?q=80&w=600'
    ],
    category: 'Gaming',
    brand: 'Secretlab',
    rating: 4.7,
    numReviews: 18,
    countInStock: 8,
    discount: 0,
    deliveryTime: 'In 3 days',
    reviews: []
  },
  {
    name: 'Elgato Stream Deck MK.2',
    description: 'Interface controller with 15 customizable LCD keys to control apps, trigger actions, control audio, launch socials, and adjust lighting. Hot-swappable faceplate.',
    price: 149.99,
    images: [
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef',
      'https://images.unsplash.com/photo-1628277613967-6abca504d0ac'
    ],
    category: 'Gaming',
    brand: 'Elgato',
    rating: 4.8,
    numReviews: 14,
    countInStock: 12,
    discount: 10,
    deliveryTime: 'Tomorrow',
    reviews: []
  },

  // =================== EXTRA PRODUCTS ===================
  {
    name: 'Yeti Rambler 30 oz Tumbler',
    description: 'Double-wall vacuum insulated mug with MagSlider lid. Made of kitchen-grade stainless steel, puncture-resistant, and rust-resistant. Fits in standard cup holders.',
    price: 38.00,
    images: [
      'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?q=80&w=600',
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=600'
    ],
    category: 'Home Essentials',
    brand: 'Yeti',
    rating: 4.7,
    numReviews: 61,
    countInStock: 45,
    discount: 0,
    deliveryTime: 'Tomorrow',
    reviews: []
  },
  {
    name: 'Fitbit Charge 6 tracker',
    description: 'Fitness tracker with built-in GPS, heart rate monitor, stress management, sleep analysis, and YouTube Music controls. Includes 6 months Premium membership.',
    price: 159.95,
    images: [
      'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6',
      'https://images.unsplash.com/photo-1557935728-e6d1eaabe558'
    ],
    category: 'Electronics',
    brand: 'Fitbit',
    rating: 4.3,
    numReviews: 24,
    countInStock: 16,
    discount: 15,
    deliveryTime: 'Tomorrow',
    reviews: []
  },
  {
    name: 'Vitamix E310 Explorian Blender',
    description: 'High-performance blender featuring ten variable speeds, pulse feature, 48-ounce container, and aircraft-grade hardened stainless steel cutting blades.',
    price: 349.95,
    images: [
      'https://images.unsplash.com/photo-1578643463396-0997cb5328c1',
      'https://images.unsplash.com/photo-1534939561126-855b8675edd7'
    ],
    category: 'Home Essentials',
    brand: 'Vitamix',
    rating: 4.8,
    numReviews: 30,
    countInStock: 12,
    discount: 10,
    deliveryTime: 'In 2 days',
    reviews: []
  },
  {
    name: 'Ray-Ban Wayfarer Sunglasses Classic',
    description: 'The most recognizable style in the history of sunglasses. Distinctive shape is combined with the traditional Ray-Ban signature logo on the sculpted temples.',
    price: 163.00,
    images: [
      'https://images.unsplash.com/photo-1508296695146-257a814070b4',
      'https://images.unsplash.com/photo-1577803645773-f96470509666'
    ],
    category: 'Fashion',
    brand: 'Ray-Ban',
    rating: 4.6,
    numReviews: 35,
    countInStock: 15,
    discount: 5,
    deliveryTime: 'Tomorrow',
    reviews: []
  }
];

export const seedDatabase = async () => {
  try {
    if (!useLocalDB) {
      // 1. Seed Users in MongoDB
      const userCount = await User.find();
      if (userCount.length === 0) {
        console.log('Seeding default users in MongoDB...');
        
        // Admin
        await User.create({
          name: 'E-BUY Administrator',
          email: 'admin@ebuy.com',
          password: 'admin123',
          isAdmin: true,
          address: {
            street: '100 Admin HQ Way',
            city: 'Seattle',
            state: 'WA',
            zipCode: '98101',
            country: 'United States'
          }
        });

        // Test User
        await User.create({
          name: 'Jane Customer',
          email: 'user@ebuy.com',
          password: 'user123',
          isAdmin: false,
          address: {
            street: '123 Shoppers Lane',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'United States'
          }
        });
        console.log('Users seeded successfully in MongoDB.');
      }

      // 2. Seed Products in MongoDB
      const productCount = await Product.find();
      if (productCount.products.length === 0) {
        console.log('Seeding 30+ products in MongoDB...');
        
        // Fetch users to assign reviews
        const users = await User.find();
        const demoUser = users.find(u => !u.isAdmin) || users[0];

        const productsToInsert = mockProducts.map(prod => {
          const seededReviews = reviewsMock.map(rev => ({
            name: rev.name,
            rating: rev.rating,
            comment: rev.comment,
            user: demoUser._id
          }));
          return {
            ...prod,
            reviews: seededReviews,
            numReviews: seededReviews.length,
            rating: Number((seededReviews.reduce((acc, r) => r.rating + acc, 0) / seededReviews.length).toFixed(1))
          };
        });

        for (const p of productsToInsert) {
          const product = new mongoose.model('Product')(p);
          await product.save();
        }
        
        console.log('Products seeded successfully in MongoDB.');
      }
    } else {
      // 1. Seed Users in local JSON
      const users = readLocalFile('users.json');
      let demoUserId = '';
      if (users.length === 0) {
        console.log('Seeding default users in fallback database file...');
        const adminUser = await User.create({
          name: 'E-BUY Administrator',
          email: 'admin@ebuy.com',
          password: 'admin123',
          isAdmin: true,
          address: {
            street: '100 Admin HQ Way',
            city: 'Seattle',
            state: 'WA',
            zipCode: '98101',
            country: 'United States'
          }
        });

        const regUser = await User.create({
          name: 'Jane Customer',
          email: 'user@ebuy.com',
          password: 'user123',
          isAdmin: false,
          address: {
            street: '123 Shoppers Lane',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'United States'
          }
        });
        demoUserId = regUser._id;
        console.log('Users seeded in local JSON.');
      } else {
        const regUser = users.find(u => !u.isAdmin);
        demoUserId = regUser ? regUser._id : users[0]._id;
      }

      // 2. Seed Products in local JSON
      const products = readLocalFile('products.json');
      if (products.length === 0) {
        console.log('Seeding 30+ products in fallback database file...');
        
        const productsToInsert = mockProducts.map(prod => {
          const seededReviews = reviewsMock.map(rev => ({
            _id: 'r_' + Math.random().toString(36).substr(2, 9),
            name: rev.name,
            rating: rev.rating,
            comment: rev.comment,
            user: demoUserId,
            createdAt: new Date().toISOString()
          }));
          return {
            _id: 'p_' + Math.random().toString(36).substr(2, 9),
            name: prod.name,
            description: prod.description,
            price: prod.price,
            images: prod.images,
            category: prod.category,
            brand: prod.brand,
            countInStock: prod.countInStock,
            discount: prod.discount,
            deliveryTime: prod.deliveryTime,
            reviews: seededReviews,
            numReviews: seededReviews.length,
            rating: Number((seededReviews.reduce((acc, r) => r.rating + acc, 0) / seededReviews.length).toFixed(1)),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
        });

        writeLocalFile('products.json', productsToInsert);
        console.log('Products seeded in local JSON.');
      }
    }
  } catch (error) {
    console.error('Seeding database failed:', error);
  }
};
