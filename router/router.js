const express = require('express');
const router = express.Router();
const multer = require('multer');
const cAPi = require('../controler/controlers');

// Sitemap Route
// Sitemap Route
router.get('/sitemap.xml', (req, res) => {
  const urls = [
    { loc: 'https://hexmy.com/', lastmod: '2024-11-13', changefreq: 'daily', priority: 1.0 },
    { loc: 'https://hexmy.com/stars', lastmod: '2024-11-13', changefreq: 'monthly', priority: 0.8 },
    { loc: 'https://hexmy.com/indian', lastmod: '2024-11-13', changefreq: 'monthly', priority: 0.8 },
    { loc: 'https://hexmy.com/hijabi', lastmod: '2024-11-13', changefreq: 'monthly', priority: 0.8 },
    { loc: 'https://hexmy.com/newVideos', lastmod: '2024-11-13', changefreq: 'monthly', priority: 0.8 },
    { loc: 'https://hexmy.com/popularVideos', lastmod: '2024-11-13', changefreq: 'monthly', priority: 0.8 },
    { loc: 'https://hexmy.com/toprated', lastmod: '2024-11-13', changefreq: 'monthly', priority: 0.8 },
    // Add more pages here if needed
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  urls.forEach(url => {
    xml += `
    <url>
      <loc>${url.loc}</loc>
      <lastmod>${url.lastmod}</lastmod>
      <changefreq>${url.changefreq}</changefreq>
      <priority>${url.priority}</priority>
    </url>`;
  });

  xml += '\n</urlset>';

  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
  res.send(xml);
});


// Multer Configuration
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads"); // File destination
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Unique file name
  },
});

let upload = multer({
  storage: storage,
  limits: { fileSize: 6 * 1024 * 1024 }, // 6 MB file limit
});

// Example Route
router.get('/', (req, res) => {
  res.send("Welcome to Hexmy API!");
});

// API Routes
router.post("/postdata", cAPi.data);
router.get('/getpostdata', cAPi.getpostdata);
router.get('/relatedpostData',cAPi.relatedpostData)
router.get('/getmovies',cAPi.getMovies)
router.get('/getpopularVideos', cAPi.getpopularVideos);
router.get('/getnewVideos', cAPi.getnewVideos);
router.get('/getTopRate', cAPi.getTopRate);




router.delete('/deletepost/:id', cAPi.deletepost);
router.put('/updatepost/:postId', cAPi.updatepost);

// Star-related API Endpoints
router.post('/addStar', cAPi.addStar);
router.get('/getstars', cAPi.getstars);
router.put('/updateStar/:starId', cAPi.updateStar);
router.delete('/deleteStar/:starId', cAPi.deleteStar);

// Views and Categories
router.post('/updateviews/:id', cAPi.updateviews);
router.get('/getindians', cAPi.getindians);
router.get('/getHijabi', cAPi.getHijabi);

//video Get
router.post('/getVideo/:id', cAPi.getVideo);
router.get("/pornstar/:name", cAPi.searchByName)

module.exports = router;
