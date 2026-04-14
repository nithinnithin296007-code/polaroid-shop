require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Product  = require('../models/Product');

const products = [
  // POLAROIDS
  { name: 'Classic White Polaroid Pack', category: 'Polaroids', price: 179, badge: '🔥 Bestseller',
    image: 'https://images.pexels.com/photos/4340786/pexels-photo-4340786.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Timeless white-border polaroid prints. Minimum order: 10 pieces. Perfect for gifting & wall decor.', rating: 4.9 },

  { name: 'Neon Aesthetic Polaroid Pack', category: 'Polaroids', price: 179, badge: '✨ Trendy',
    image: 'https://images.unsplash.com/photo-1622616332975-3ea56ed51e46?w=600&auto=format&fit=crop&q=60',
    description: 'Vibrant neon-toned polaroids with thick borders. Min 10 pieces. Bring those retro vibes!', rating: 4.8 },

  { name: 'Vintage Film Polaroid Pack', category: 'Polaroids', price: 179, badge: null,
    image: 'https://images.unsplash.com/photo-1677981263397-520f736d5708?w=600&auto=format&fit=crop&q=60',
    description: 'Warm, film-grain aesthetic polaroid prints. Min 10 pieces. Great for collages and gifting.', rating: 4.7 },

  { name: 'Black Border Polaroid Pack', category: 'Polaroids', price: 179, badge: '🖤 Moody',
    image: 'https://plus.unsplash.com/premium_photo-1698381563955-1e2adebf3cd1?w=600&auto=format&fit=crop&q=60',
    description: 'Sleek black-border polaroids for a bold, modern look. Min 10 pieces.', rating: 4.8 },

  // POSTERS
  { name: 'Custom A4 Wall Poster', category: 'Posters', price: 59, badge: '🎨 Min 5 pcs',
    image: 'https://images.unsplash.com/photo-1758923530325-00b4ff765e9e?w=600&auto=format&fit=crop&q=60',
    description: 'High-resolution A4 wall poster on premium matte paper. Min 5 pieces @ ₹59 each.', rating: 4.8 },

  { name: 'Minimalist Quote Poster (A4)', category: 'Posters', price: 59, badge: '💛 Popular',
    image: 'https://images.unsplash.com/photo-1641452809392-49d1e0bfd8a7?w=600&auto=format&fit=crop&q=60',
    description: 'Clean minimalist A4 poster with your custom quote. Min 5 pieces.', rating: 4.6 },

  { name: 'Aesthetic Collage Poster (A4)', category: 'Posters', price: 59, badge: null,
    image: 'https://images.pexels.com/photos/28450852/pexels-photo-28450852.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Multi-photo collage layout on A4 matte paper. Min 5 pieces. Great for room decor!', rating: 4.7 },

  // FRAMES
  { name: 'Wooden Shadow Frame', category: 'Frames', price: 499, badge: null,
    image: 'https://images.pexels.com/photos/10252177/pexels-photo-10252177.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Real wood frame with deep shadow box. 8x10 size. Adds a premium touch to any print.', rating: 4.9 },

  { name: 'Black Metal Frame', category: 'Frames', price: 399, badge: '🆕 New Arrival',
    image: 'https://media.istockphoto.com/id/2160065063/photo/frame.webp?a=1&b=1&s=612x612&w=0&k=20&c=DwxuXTfG13Sp41OOJLPVdvHZmRmNChoSEGOu-WiPKPg=',
    description: 'Sleek black metal frame, modern minimalist design. Perfect for posters and polaroids.', rating: 4.7 },

  // STICKERS
  { name: 'Custom Die-Cut Sticker Pack', category: 'Stickers', price: 99, badge: '🌟 New!',
    image: 'https://images.unsplash.com/photo-1624382927248-736fe9836b53?w=600&auto=format&fit=crop&q=60',
    description: 'Your photos as premium die-cut stickers. Waterproof & UV resistant. Pack of 10.', rating: 4.9 },

  { name: 'Mini Sticker Sheet', category: 'Stickers', price: 49, badge: '💖 Cute',
    image: 'https://images.unsplash.com/photo-1617729420525-a8aa35b2a649?w=600&auto=format&fit=crop&q=60',
    description: 'Sheet of 20 mini custom stickers. Perfect for planners, bottles, gifts & more!', rating: 4.8 },

  { name: 'Holographic Sticker Pack', category: 'Stickers', price: 129, badge: '✨ Premium',
    image: 'https://media.istockphoto.com/id/2184059336/photo/iridescent-label-isolated-on-white-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=N33Hkl-d7hyN0aI3EGgoRcr6cekkEBRlCcOEvqge5Y8=',
    description: 'Shiny holographic finish custom stickers. Pack of 10. Makes everything look magical!', rating: 5.0 },

  { name: 'Sticker + Polaroid Combo', category: 'Bundles', price: 249, badge: '🔥 Hot Deal',
    image: 'https://images.pexels.com/photos/4340786/pexels-photo-4340786.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: '10 polaroids + 1 custom sticker sheet. Best combo for gifting your bestie!', rating: 4.8 },
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/snapcraft')
  .then(async () => {
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('✅ Products seeded! Total:', products.length);
    process.exit(0);
  })
  .catch(err => { console.error(err); process.exit(1); });