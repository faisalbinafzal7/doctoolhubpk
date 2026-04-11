import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, Shield, CheckCircle, Zap, FileText, ChevronRight, Star, ArrowRight, Image as ImageIcon, X } from 'lucide-react';
import { CATEGORIES, TOOLS } from '@/src/data/tools';
import { BLOG_POSTS } from '@/src/pages/Blog';
import { motion } from 'motion/react';

export default function Home() {
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const filteredTools = TOOLS.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    CATEGORIES.find(c => c.id === tool.category)?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const popularTools = TOOLS.slice(0, 6);

  return (
    <div className="pb-20">
      <Helmet>
        <title>DocToolHubPK - Free Online Tools for PDF, Image, SEO & Devs</title>
        <meta name="description" content="Access 40+ free, fast, and secure online tools for PDF conversion, image editing, SEO optimization, and web development. No signup required, 100% browser-based privacy." />
        <link rel="canonical" href="https://doctoolhubpk.com/" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-sky-50 py-20 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-200 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-200 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-wider text-sky-600 uppercase bg-sky-600/10 rounded-full border border-sky-600/20">
              100% Free & Secure Online Tools
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
              Simplify Your Workflow with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600">
                Professional Digital Tools
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              No signups, no hidden fees. Process your PDFs, images, and code 
              directly in your browser with total privacy.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search 40+ tools (e.g., PDF to Word, Image Compressor...)"
                className="block w-full pl-12 pr-12 py-5 bg-white border-2 border-slate-200 rounded-2xl text-slate-900 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all text-lg shadow-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              {!searchQuery && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:block">
                  <kbd className="px-2 py-1 bg-slate-100 text-slate-500 rounded border border-slate-200 text-xs font-bold uppercase tracking-widest">
                    Ctrl + K
                  </kbd>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <div className="bg-white border-b border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex items-center justify-center space-x-3">
              <Shield className="w-6 h-6 text-sky-500" />
              <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">100% Secure</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Zap className="w-6 h-6 text-sky-500" />
              <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">Instant Results</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <CheckCircle className="w-6 h-6 text-sky-500" />
              <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">No Signup</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <FileText className="w-6 h-6 text-sky-500" />
              <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">Privacy First</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        {/* Categories Section */}
        <div className="mb-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Browse by Category</h2>
              <p className="text-slate-500">Find the perfect tool for your specific task.</p>
            </div>
            <Link to="/all-tools" className="text-sky-500 font-bold hover:underline flex items-center">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {CATEGORIES.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="flex flex-col items-center p-6 bg-white border border-slate-200 rounded-2xl hover:border-sky-500 hover:shadow-xl hover:-translate-y-1 transition-all group"
              >
                <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                  <category.icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-bold text-slate-900 text-center">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Popular Tools Grid */}
        <div className="mb-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">
                {searchQuery ? 'Search Results' : 'Most Popular Tools'}
              </h2>
              <p className="text-slate-500">The utilities our users love the most.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(searchQuery ? filteredTools : popularTools).map((tool) => (
              <Link
                key={tool.id}
                to={`/tool/${tool.slug}`}
                className="group bg-white border border-slate-200 rounded-2xl p-6 hover:border-sky-500 hover:shadow-xl transition-all flex flex-col h-full"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-sky-50 text-sky-500 rounded-xl flex items-center justify-center mr-4 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                    <tool.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-500 transition-colors">
                    {tool.name}
                  </h3>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed flex-grow">
                  {tool.shortDescription}
                </p>
                <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {CATEGORIES.find(c => c.id === tool.category)?.name}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-sky-500 group-hover:text-white transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {searchQuery && filteredTools.length === 0 && (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">No tools found</h3>
              <p className="text-slate-500">Try searching for something else, like "PDF" or "Image".</p>
            </div>
          )}
        </div>

        {/* SEO Content Section */}
        <div className="bg-white border border-slate-200 rounded-3xl p-10 mb-20">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">Why Choose DocToolHubPK?</h2>
            <div className="space-y-6 text-slate-600 leading-relaxed text-lg">
              <p>
                In today's digital world, you shouldn't have to compromise your privacy to get simple tasks done. 
                <strong> DocToolHubPK</strong> was built with a single mission: to provide professional-grade 
                digital utilities that are 100% free and 100% private.
              </p>
              <p>
                Unlike other online converters and editors, we process your data <strong>locally in your browser</strong>. 
                This means your sensitive PDFs, private photos, and proprietary code never touch our servers. 
                It's faster, safer, and completely anonymous.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">No Installation</h4>
                    <p className="text-sm">Works directly in Chrome, Safari, Firefox, and Edge.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-sky-50 text-sky-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">High Performance</h4>
                    <p className="text-sm">Optimized JavaScript engines for lightning-fast processing.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <section className="bg-sky-600 rounded-3xl p-12 text-center text-white relative overflow-hidden shadow-2xl shadow-sky-200">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tight">Ready to boost your productivity?</h2>
            <p className="text-xl text-sky-100 mb-10 max-w-2xl mx-auto">
              Bookmark DocToolHubPK today and join thousands of users who trust us for their daily digital tasks.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/all-tools" className="px-8 py-4 bg-white text-sky-600 font-black rounded-2xl hover:bg-sky-50 transition-all shadow-lg">
                Explore All 40+ Tools
              </Link>
              <button className="px-8 py-4 bg-sky-700 text-white font-black rounded-2xl hover:bg-sky-800 transition-all">
                Add to Bookmarks (Ctrl+D)
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
