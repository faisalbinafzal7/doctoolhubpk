# DocToolHubPK - Ultimate Free Online Tools Hub

DocToolHubPK is a comprehensive, all-in-one platform featuring a suite of document, image, SEO, and developer tools. Built with React, TypeScript, and Tailwind CSS, it offers a fast, secure, and responsive experience for users.

## 🚀 Key Features

- **Document Tools**: Word Counter, PDF Converters, etc.
- **Image Utilities**: Conversion and optimization.
- **SEO Tools**: Keywords and metadata helpers.
- **Developer Tools**: JSON Formatter, Base64 encoder, and more.
- **Admin Dashboard**: Built-in management for blogs and content.
- **SEO Optimized**: Advanced JSON-LD architecture, sitemaps, and automated canonicalization.
- **Privacy First**: All tool processing happens 100% locally in the browser.
- **Modern Performance**: Optimized build with Node 24 and minimal render-blocking.

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Routing**: React Router 6
- **State/Data**: Firebase Firestore & Authentication
- **Analytics**: Google Analytics 4 (GA4) integrated via `react-ga4`
- **Animation**: Framer Motion
- **Icons**: Lucide React

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/faisalbinafzal7/doctoolhubpk.git
   cd doctoolhubpk
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Copy `.env.example` to `.env` and fill in your Firebase and Google Analytics credentials.

4. Start the development server:
   ```bash
   npm run dev
   ```

## 🚀 Deployment

The project is pre-configured for **Hostinger** and other Apache-based servers.

### Automated Deployment (GitHub Actions)
The repository includes a GitHub Action in `.github/workflows/deploy.yml`. When you push to the `main` branch, it automatically:
1. Installs dependencies.
2. Generates the latest `sitemap.xml`.
3. Builds the production `dist` folder.
4. Deploys via FTP to your Hostinger server.

### Manual Deployment
Use the included deployment script for manual updates:
```bash
bash hostinger-deploy.sh
```

**CRITICAL SEO NOTE:**  
Ensure the `.htaccess` file is uploaded to your server's root. It handles the mandatory redirection from **www to doctoolhubpk.com** (non-www) for SEO consistency and enforces HTTPS/HSTS for security.

## 📄 License

This project is for personal use and showcase for DocToolHubPK.
