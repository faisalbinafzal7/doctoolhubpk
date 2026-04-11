import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 prose prose-slate">
      <Helmet>
        <title>About Us - DocToolHubPK</title>
        <meta name="description" content="Learn about DocToolHubPK's mission to provide secure, browser-based productivity tools with a focus on user privacy." />
        <link rel="canonical" href="https://doctoolhubpk.com/about" />
      </Helmet>
      <h1>About DocToolHubPK</h1>
      <p className="lead text-xl text-slate-600">
        DocToolHubPK is a premier destination for free, high-quality, and secure online productivity tools. 
        Our mission is to empower professionals, students, and developers with a suite of utilities that are fast, 
        reliable, and—most importantly—private.
      </p>
      
      <h2>Our Mission: Privacy First</h2>
      <p>
        In an era where data privacy is often compromised, DocToolHubPK stands apart. We believe that your 
        sensitive documents, code, and personal information should never leave your device. That's why 
        we've engineered our platform to be <strong>100% browser-based</strong>.
      </p>
      <p>
        Unlike traditional online converters that require you to upload files to a remote server, our tools 
        utilize advanced client-side technologies (like JavaScript and WebAssembly) to process your data 
        locally. Your files are never stored, analyzed, or seen by anyone—not even us.
      </p>
      
      <h2>Who We Are</h2>
      <p>
        We are a dedicated team of software engineers and productivity enthusiasts based in Pakistan. 
        With years of experience in digital security and web development, we recognized a gap in the 
        market for a tool hub that doesn't sacrifice security for convenience. 
      </p>
      <p>
        DocToolHubPK was born out of a desire to create a "Swiss Army Knife" for the web—a single, 
        trusted location where anyone can find the utility they need without worrying about their 
        digital footprint.
      </p>

      <h2>What We Offer</h2>
      <p>
        Our platform features a growing collection of over 20+ tools across several key categories:
      </p>
      <ul>
        <li><strong>PDF Management:</strong> Merge, split, rotate, and convert PDF documents with ease.</li>
        <li><strong>Text Utilities:</strong> Word counters, case converters, and formatting tools for writers and editors.</li>
        <li><strong>Developer Tools:</strong> JSON formatters, Base64 encoders, and minifiers for efficient coding.</li>
        <li><strong>Image Tools:</strong> Converters and optimizers designed for speed.</li>
        <li><strong>SEO Utilities:</strong> Tools to help webmasters and content creators rank higher.</li>
      </ul>

      <h2>Why Choose DocToolHubPK?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose mt-8">
        <div className="p-6 bg-sky-50 rounded-2xl border border-sky-100">
          <h3 className="text-lg font-bold text-sky-900 mb-2">Unmatched Security</h3>
          <p className="text-sky-800 text-sm">Everything happens in your browser. No uploads, no server-side storage, no risks.</p>
        </div>
        <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
          <h3 className="text-lg font-bold text-blue-900 mb-2">Lightning Fast</h3>
          <p className="text-blue-800 text-sm">Built with modern React and Vite for near-instant processing and a smooth user experience.</p>
        </div>
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-2">100% Free</h3>
          <p className="text-slate-700 text-sm">No subscriptions, no hidden fees, and no watermarks on your documents.</p>
        </div>
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Human-Centric</h3>
          <p className="text-slate-700 text-sm">Designed for real people with clear instructions, helpful guides, and intuitive interfaces.</p>
        </div>
      </div>

      <h2 className="mt-12">Our Commitment to Quality</h2>
      <p>
        We don't just "dump" tools onto our site. Every utility on DocToolHubPK is carefully reviewed, 
        tested, and documented by our team. We provide extensive guides and FAQs for every tool to 
        ensure you get the most value out of our platform.
      </p>

      <h2>Get in Touch</h2>
      <p>
        We value your feedback. If you have suggestions for new tools or want to report an issue, 
        please don't hesitate to reach out to us at <a href="mailto:info@doctoolhubpk.com">info@doctoolhubpk.com</a>.
      </p>
    </div>
  );
}
