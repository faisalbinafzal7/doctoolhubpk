import fs from 'fs';
import path from 'path';
import { TOOLS, CATEGORIES } from '../src/data/tools';

const BASE_URL = 'https://doctoolhubpk.com';

const staticRoutes = [
  '',
  '/all-tools',
  '/blog',
  '/about',
  '/privacy-policy',
  '/contact',
  '/disclaimer',
  '/terms-and-conditions',
  '/cookie-policy',
];

const generateSitemap = () => {
  const lastMod = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  // Add static routes
  staticRoutes.forEach(route => {
    xml += `  <url>
    <loc>${BASE_URL}${route}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>\n`;
  });

  // Add category routes
  CATEGORIES.forEach(category => {
    xml += `  <url>
    <loc>${BASE_URL}/category/${category.slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>\n`;
  });

  // Add tool routes
  TOOLS.forEach(tool => {
    xml += `  <url>
    <loc>${BASE_URL}/tool/${tool.slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>\n`;
  });

  xml += '</urlset>';

  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml);
  console.log('Sitemap generated successfully at public/sitemap.xml');
};

generateSitemap();
