import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, ArrowRight } from 'lucide-react';
import { TOOLS, CATEGORIES } from '@/src/data/tools';
import { motion } from 'motion/react';
import { ToolCard } from '../components/ToolCard';

export default function AllTools() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  const filteredTools = TOOLS.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? tool.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pb-20">
      <Helmet>
        <title>All Tools - Explore Our Ultimate Free Online Tools Hub | DocToolHubPK</title>
        <meta name="description" content="Discover DocToolHubPK, your all-in-one platform for image tools, PDF converters, SEO utilities, and developer tools. Completely free, fast, and easy to use—designed to simplify your daily tasks and boost productivity with 100% privacy." />
        <link rel="canonical" href="https://doctoolhubpk.com/all-tools" />
      </Helmet>

      <section className="bg-white border-b border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">All Productivity Tools</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
            Browse our complete directory of free, secure, and browser-based utilities.
          </p>

          <div className="max-w-2xl mx-auto relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
            <input
              type="text"
              placeholder="Search through all 20+ tools..."
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:border-sky-400 focus:outline-none transition-all shadow-sm text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                selectedCategory === null 
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-200' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Tools
            </button>
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center space-x-2 ${
                  selectedCategory === category.id 
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-200' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <category.icon className="w-4 h-4" />
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {selectedCategory ? (
          // If a specific category is selected, show a simple grid
          <div>
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-10 h-10 bg-sky-50 text-sky-500 rounded-xl flex items-center justify-center">
                {React.createElement(CATEGORIES.find(c => c.id === selectedCategory)?.icon || Search, { className: "w-6 h-6" })}
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                {CATEGORIES.find(c => c.id === selectedCategory)?.name}
              </h2>
              <span className="text-slate-400 font-medium">({filteredTools.length} tools)</span>
            </div>
            
            {filteredTools.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTools.map((tool, idx) => (
                  <ToolCard key={tool.id} tool={tool} idx={idx} showFullDescription />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <p className="text-slate-500 font-medium text-lg">No tools found matching your search in this category.</p>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="mt-4 text-sky-500 font-bold hover:underline"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        ) : (
          // Default grouped view
          CATEGORIES.map((category) => {
            const categoryTools = filteredTools.filter(t => t.category === category.id);
            if (categoryTools.length === 0) return null;

            return (
              <div key={category.id} className="mb-16 last:mb-0">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-10 h-10 bg-sky-50 text-sky-500 rounded-xl flex items-center justify-center">
                    <category.icon className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">{category.name}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {categoryTools.map((tool, idx) => (
                    <ToolCard key={tool.id} tool={tool} idx={idx} showFullDescription />
                  ))}
                </div>
              </div>
            );
          })
        )}

        {!selectedCategory && filteredTools.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-500 font-medium text-lg">No tools found matching your search.</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-4 text-sky-500 font-bold hover:underline"
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      {/* AdSense Placeholder */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="w-full h-24 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-sm uppercase tracking-widest">
          Advertisement
        </div>
      </div>
    </div>
  );
}
