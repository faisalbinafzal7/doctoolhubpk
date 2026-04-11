import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, Layout } from 'lucide-react';

export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 prose prose-slate">
      <Helmet>
        <title>Contact Us - DocToolHubPK</title>
        <meta name="description" content="Have questions or suggestions? Contact the DocToolHubPK team. We're here to help." />
        <link rel="canonical" href="https://doctoolhubpk.com/contact" />
      </Helmet>
      <h1>Contact Us</h1>
      <p className="text-xl text-slate-600">Have questions, feedback, or need support?</p>
      <p>The DocToolHubPK team is always ready to assist you.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 not-prose">
        <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Get in Touch</h2>
          <p className="text-slate-600 mb-6">
            DocToolHubPK is built to support users with reliable online tools and resources. We welcome all inquiries related to our tools, website, partnerships, or suggestions.
          </p>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-sky-50 text-sky-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 uppercase tracking-wider">Email</p>
                <p className="text-slate-600">info@doctoolhubpk.com</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-sky-50 text-sky-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Layout className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 uppercase tracking-wider">Website</p>
                <p className="text-slate-600">https://www.doctoolhubpk.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-2xl shadow-xl text-white">
          <h2 className="text-xl font-bold mb-6">Send Us a Message</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">Name</label>
              <input type="text" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 focus:border-sky-500 focus:outline-none transition-colors" placeholder="Your Name" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">Email</label>
              <input type="email" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 focus:border-sky-500 focus:outline-none transition-colors" placeholder="Your Email" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">Message</label>
              <textarea rows={4} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 focus:border-sky-500 focus:outline-none transition-colors resize-none" placeholder="How can we help?"></textarea>
            </div>
            <button type="button" className="w-full py-4 bg-sky-500 text-white font-bold rounded-xl hover:bg-sky-600 transition-colors shadow-lg shadow-sky-900/20">Send Message</button>
          </form>
        </div>
      </div>

      <div className="mt-16 text-slate-500 text-sm">
        <p>We respect your privacy. Any information you submit through this page is used only to respond to your inquiry and is never shared or sold.</p>
      </div>
    </div>
  );
}
