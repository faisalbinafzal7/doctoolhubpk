import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CATEGORIES, TOOLS } from '@/src/data/tools';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { ToolCard } from '../components/ToolCard';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = CATEGORIES.find(c => c.slug === slug);

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Category Not Found</h1>
        <Link to="/" className="px-6 py-3 bg-sky-500 text-white font-bold rounded-xl">Go Back Home</Link>
      </div>
    );
  }

  const categoryTools = TOOLS.filter(t => t.category === category.id);

  return (
    <div className="pb-20">
      <Helmet>
        <title>{category.name} - Ultimate Free {category.name} Hub | DocToolHubPK</title>
        <meta name="description" content={`Explore our powerful collection of free ${category.name.toLowerCase()} at DocToolHubPK. Experience lightning-fast processing, total privacy, and professional results without any registration or cost.`} />
        <link rel="canonical" href={`https://doctoolhubpk.com/category/${category.slug}`} />
      </Helmet>

      {/* Hero */}
      <section className="bg-white border-b border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center text-sm text-slate-500 mb-6">
            <Link to="/" className="hover:text-sky-500">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-slate-900 font-medium">{category.name}</span>
          </nav>
          
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-sky-50 text-sky-500 rounded-2xl flex items-center justify-center shadow-sm">
              <category.icon className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{category.name}</h1>
              <p className="text-slate-600 max-w-2xl">
                A curated collection of professional {category.name.toLowerCase()} to help you work smarter and faster. 
                All tools are free to use and privacy-safe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AdSense Placeholder */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="w-full h-24 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-sm uppercase tracking-widest">
          Advertisement
        </div>
      </div>

      {/* Tools Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryTools.map((tool, idx) => (
            <ToolCard key={tool.id} tool={tool} idx={idx} />
          ))}
        </div>
      </section>

      {/* SEO Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white border border-slate-200 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">About {category.name}</h2>
          <div className="prose prose-slate max-w-none text-slate-600">
            <p className="mb-4">
              Our {category.name} collection is designed to provide essential utilities for everyday digital tasks. 
              Whether you are a developer, content creator, or student, these tools offer a reliable and fast way 
              to process data without needing complex software.
            </p>
            <p>
              We prioritize your privacy by ensuring that all processing happens directly in your web browser. 
              No data is ever uploaded to our servers, making these tools safe for sensitive information. 
              Explore our range of {category.name.toLowerCase()} and boost your productivity today.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
