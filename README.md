# E‑BUY

## Overview
E‑BUY is a modern, full‑stack e‑commerce web application built with **React**, **Vite**, **Tailwind CSS**, **Node.js**, **Express**, and **MongoDB**. It offers a polished shopping experience with:
- Dynamic product catalog and categories (including newly added accessories, gaming, men, kids, and skin‑care items)
- Cart, Wishlist, and Save‑for‑Later functionality
- Responsive top‑navigation bar and sleek UI components
- Admin‑style product seeding script and robust backend API

## Demo
You can run the app locally (see **Setup** below) and explore the storefront at `http://localhost:5176`.

## Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS v4, React‑Router, React‑Icons
- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Styling**: Tailwind utilities with custom dark‑mode variants, modern color palette, glass‑morphism effects
- **Version Control**: Git (GitHub repo: https://github.com/manjuchollangi23/E-BUY)

## Features
- Top‑navigation bar with equal‑spacing category links
- Product cards with rating, discount badges, and add‑to‑cart actions
- Cart page with Save‑for‑Later list, coupon codes, and dynamic price calculations
- Admin‑style seeding script (`backend/update_db.js`) to ensure at least 10 images per category
- Responsive design across mobile, tablet, and desktop

## Quick Start (Local Development)
```bash
# Clone repo
git clone https://github.com/manjuchollangi23/E-BUY.git
cd E-BUY

# Install dependencies
npm install                # installs both backend and frontend deps

# Set up MongoDB (use your own URI or a local instance)
# Create a .env file in /backend with:
# MONGODB_URI=mongodb://localhost:27017/ebuy

# Seed the database with sample products
node backend/update_db.js

# Run both servers (frontend and backend)
# From the root you can use concurrently or run separately:
# Terminal 1 – Backend
npm run dev --workspace backend   # starts Express on port 5000
# Terminal 2 – Frontend
npm run dev --workspace frontend   # starts Vite on port 5176
```
Open `http://localhost:5176` in your browser.

## Project Structure
```
E-BUY/
├─ backend/               # Express server, Mongoose models, seeding script
│   ├─ data/products.json   # Seed data (auto‑updated with new items)
│   └─ update_db.js        # Script that imports JSON into MongoDB
├─ frontend/              # React app built with Vite
│   ├─ src/
│   │   ├─ components/      # UI components (Navbar, ProductCard, etc.)
│   │   ├─ pages/           # Pages (Home, Products, Cart, Checkout...)
│   │   ├─ context/        # ShopContext – global state & helpers
│   │   └─ index.css        # Tailwind config & custom utilities
│   └─ vite.config.js
└─ README.md               # This file
```

## Contributing
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/awesome‑feature`).
3. Make your changes and ensure the app still builds (`npm run dev`).
4. Write or update tests if applicable.
5. Submit a pull request with a clear description of the changes.

## License
This project is licensed under the **MIT License** – see `LICENSE` for details.

---
*Happy coding! 🎉*
