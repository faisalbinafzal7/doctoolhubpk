import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, Calendar, Clock, ArrowLeft, Twitter, Facebook, Linkedin, Share2 } from 'lucide-react';
import { BLOG_POSTS } from './Blog';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = BLOG_POSTS.find(p => p.slug === slug);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  if (!post) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Post Not Found</h1>
        <Link to="/blog" className="px-6 py-3 bg-sky-500 text-white font-bold rounded-xl">Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <Helmet>
        <title>{post.title} | DocToolHubPK Blog</title>
        <meta name="description" content={`${post.excerpt} Read more about ${post.category.toLowerCase()} and productivity on DocToolHubPK.`} />
        <link rel="canonical" href={`https://doctoolhubpk.com/blog/${post.slug}`} />
      </Helmet>

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center text-sm text-slate-500">
            <Link to="/" className="hover:text-sky-500">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link to="/blog" className="hover:text-sky-500">Blog</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-slate-900 font-medium truncate">{post.title}</span>
          </nav>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <header className="mb-12 text-center">
          <div className="text-sky-500 font-bold uppercase tracking-wider text-sm mb-4">{post.category}</div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center justify-center space-x-6 text-slate-500 text-sm">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {post.date}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              {post.readTime}
            </div>
          </div>
        </header>

        {/* AdSense Placement */}
        <div className="w-full h-24 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-sm uppercase tracking-widest mb-12">
          Advertisement
        </div>

        <div 
          className="prose prose-slate prose-lg max-w-none text-slate-700 leading-relaxed
            prose-headings:text-slate-900 prose-headings:font-bold
            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
            prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
            prose-p:mb-6
            prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6
            prose-li:mb-2
            prose-strong:text-slate-900
          "
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <footer className="mt-16 pt-8 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <Link to="/blog" className="flex items-center text-sky-500 font-bold hover:underline">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-bold text-slate-500 flex items-center">
                <Share2 className="w-4 h-4 mr-2" /> Share:
              </span>
              <a 
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-sky-50 text-sky-500 rounded-lg hover:bg-sky-500 hover:text-white transition-colors"
                title="Share on Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                title="Share on Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors"
                title="Share on LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </footer>

        {/* AdSense Placement */}
        <div className="w-full h-24 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-sm uppercase tracking-widest mt-12">
          Advertisement
        </div>
      </article>
    </div>
  );
}
