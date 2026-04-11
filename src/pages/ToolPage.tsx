import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CATEGORIES, TOOLS, Tool } from '@/src/data/tools';
import { ArrowLeft, ChevronRight, Info, HelpCircle, CheckCircle, Shield, Zap, ShieldCheck } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../components/Auth';
import { trackToolUsage } from '../lib/usage';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

// Tool Components
import WordCounter from '@/src/tools/WordCounter';
import JsonFormatter from '@/src/tools/JsonFormatter';
import Base64Tool from '@/src/tools/Base64Tool';
import CaseConverter from '@/src/tools/CaseConverter';
import PasswordGenerator from '@/src/tools/PasswordGenerator';
import UrlTool from '@/src/tools/UrlTool';
import Md5Generator from '@/src/tools/Md5Generator';
import CharacterCounter from '@/src/tools/CharacterCounter';
import BinaryConverter from '@/src/tools/BinaryConverter';
import HtmlMinifier from '@/src/tools/HtmlMinifier';
import CssMinifier from '@/src/tools/CssMinifier';
import JsMinifier from '@/src/tools/JsMinifier';
import RgbHexConverter from '@/src/tools/RgbHexConverter';
import HexRgbConverter from '@/src/tools/HexRgbConverter';
import TextToSlug from '@/src/tools/TextToSlug';
import RemoveLineBreaks from '@/src/tools/RemoveLineBreaks';
import RandomNumberGenerator from '@/src/tools/RandomNumberGenerator';
import QrCodeGenerator from '@/src/tools/QrCodeGenerator';
import ImageToBase64 from '@/src/tools/ImageToBase64';
import LongTailKeywordGenerator from '@/src/tools/LongTailKeywordGenerator';
import MergePdf from '@/src/tools/MergePdf';
import SplitPdf from '@/src/tools/SplitPdf';
import PdfToText from '@/src/tools/PdfToText';
import RotatePdf from '@/src/tools/RotatePdf';
import PdfToWord from '@/src/tools/PdfToWord';
import WordToPdf from '@/src/tools/WordToPdf';
import PdfToPpt from '@/src/tools/PdfToPpt';
import PdfToExcel from '@/src/tools/PdfToExcel';
import ExcelToPdf from '@/src/tools/ExcelToPdf';
import WordToExcel from '@/src/tools/WordToExcel';
import ImageCropper from '@/src/tools/ImageCropper';
import ImageResizer from '@/src/tools/ImageResizer';
import ImageCompressor from '@/src/tools/ImageCompressor';
import ImageConverter from '@/src/tools/ImageConverter';
import ImageRotator from '@/src/tools/ImageRotator';
import PlaceholderGenerator from '@/src/tools/PlaceholderGenerator';
import CsvToJsonConverter from '@/src/tools/CsvToJsonConverter';
import JsonToCsvConverter from '@/src/tools/JsonToCsvConverter';

const toolComponents: Record<string, React.ComponentType> = {
  'word-counter': WordCounter,
  'json-formatter': JsonFormatter,
  'base64-encoder-decoder': Base64Tool,
  'case-converter': CaseConverter,
  'password-generator': PasswordGenerator,
  'url-encoder-decoder': UrlTool,
  'md5-generator': Md5Generator,
  'character-counter': CharacterCounter,
  'binary-converter': BinaryConverter,
  'html-minifier': HtmlMinifier,
  'css-minifier': CssMinifier,
  'js-minifier': JsMinifier,
  'rgb-to-hex': RgbHexConverter,
  'hex-to-rgb': HexRgbConverter,
  'text-to-slug': TextToSlug,
  'remove-line-breaks': RemoveLineBreaks,
  'random-number-generator': RandomNumberGenerator,
  'qr-code-generator': QrCodeGenerator,
  'image-to-base64': ImageToBase64,
  'long-tail-keyword-generator': LongTailKeywordGenerator,
  'merge-pdf': MergePdf,
  'split-pdf': SplitPdf,
  'pdf-to-text': PdfToText,
  'rotate-pdf': RotatePdf,
  'pdf-to-word': PdfToWord,
  'word-to-pdf': WordToPdf,
  'pdf-to-ppt': PdfToPpt,
  'pdf-to-excel': PdfToExcel,
  'excel-to-pdf': ExcelToPdf,
  'word-to-excel': WordToExcel,
  'image-cropper': ImageCropper,
  'image-resizer': ImageResizer,
  'image-compressor': ImageCompressor,
  'image-converter': ImageConverter,
  'image-rotator': ImageRotator,
  'placeholder-generator': PlaceholderGenerator,
  'csv-to-json': CsvToJsonConverter,
  'json-to-csv': JsonToCsvConverter,
};

export default function ToolPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const tool = TOOLS.find(t => t.slug === slug);
  const [liveUsageCount, setLiveUsageCount] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (user && tool) {
      trackToolUsage(user.uid, tool.id);
    }
  }, [user, tool]);

  React.useEffect(() => {
    if (!tool) return;

    const toolStatsRef = doc(db, 'toolStats', tool.id);
    const unsubscribe = onSnapshot(toolStatsRef, (doc) => {
      if (doc.exists()) {
        setLiveUsageCount(doc.data().usageCount);
      }
    });

    return () => unsubscribe();
  }, [tool]);

  if (!tool) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Tool Not Found</h1>
        <p className="text-slate-600 mb-8">The tool you are looking for does not exist or has been moved.</p>
        <Link to="/" className="px-6 py-3 bg-sky-500 text-white font-bold rounded-xl">Go Back Home</Link>
      </div>
    );
  }

  const ToolComponent = toolComponents[tool.slug] || (() => <div>Tool implementation coming soon...</div>);
  const category = CATEGORIES.find(c => c.id === tool.category);

  // SEO Formulas
  const keyword = tool.keyword || tool.name;
  const seoTitle = `Free ${keyword} Online – Fast & Easy (No Signup)`;
  const seoMetaDescription = `Use our free ${tool.name.toLowerCase()} online to ${tool.shortDescription.toLowerCase().replace(/\.$/, '')}. Fast, secure, and easy to use with no installation required.`;
  const seoH1 = `${keyword} Online Free Tool`;

  return (
    <div className="pb-20">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoMetaDescription} />
        <link rel="canonical" href={`https://doctoolhubpk.com/tool/${tool.slug}`} />
        
        {/* FAQ Schema */}
        {tool.faqs && tool.faqs.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": tool.faqs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.answer
                }
              }))
            })}
          </script>
        )}

        {/* Breadcrumb Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://doctoolhubpk.com/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": category?.name,
                "item": `https://doctoolhubpk.com/category/${category?.slug}`
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": tool.name,
                "item": `https://doctoolhubpk.com/tool/${tool.slug}`
              }
            ]
          })}
        </script>

        {/* SoftwareApplication Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": tool.name,
            "operatingSystem": "Any",
            "applicationCategory": category?.name,
            "description": tool.description,
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "ratingCount": "1240"
            }
          })}
        </script>
      </Helmet>

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center text-sm text-slate-500">
            <Link to="/" className="hover:text-sky-500">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link to={`/category/${category?.slug}`} className="hover:text-sky-500">{category?.name}</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-slate-900 font-medium">{tool.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="space-y-8">
          {/* Main Tool Card */}
          <div className="w-full">
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm mb-8">
              <div className="p-6 border-b border-slate-100 bg-sky-50/50">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-sky-500 text-white rounded-xl flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-1 border border-dashed border-white/30 rounded-lg"></div>
                    <tool.icon className="w-8 h-8 relative z-10" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{seoH1}</h1>
                    <div className="flex items-center space-x-3 mt-1">
                      <p className="text-slate-500 text-sm">{tool.shortDescription}</p>
                      {liveUsageCount !== null && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-sky-100 text-sky-800">
                            <Zap className="w-3 h-3 mr-1" />
                            Used {liveUsageCount.toLocaleString()} times
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <ToolComponent />
              </div>
            </div>

            {/* MASTER SEO CONTENT TEMPLATE */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {/* Left Column: Intro & Features */}
              <div className="lg:col-span-2 space-y-8">
                {/* Intro */}
                <div className="bg-white border border-slate-200 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Looking for a simple way to {tool.shortDescription.toLowerCase().replace(/\.$/, '')}?</h2>
                  <p className="text-slate-600 leading-relaxed text-lg">
                    Our free <strong>{tool.name}</strong> allows you to {tool.description.toLowerCase()} quickly and efficiently. 
                    Whether you're a student, developer, or business user, this tool helps you save time and improve productivity 
                    without installing any software.
                  </p>
                </div>

                {/* Key Features */}
                <div className="bg-white border border-slate-200 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                    <Zap className="w-6 h-6 mr-2 text-sky-500" /> Key Features
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                    {(tool.keyFeatures || [
                      "Fast and easy to use",
                      "No signup required",
                      "Secure browser-based processing",
                      "High-quality output",
                      "Works on all devices",
                      ...(tool.functions?.slice(0, 3).map(f => f.split(':')[0]) || [])
                    ]).map((feature, idx) => (
                      <div key={idx} className="flex items-start space-x-3 group">
                        <div className="mt-1 w-5 h-5 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 group-hover:bg-green-100 transition-colors">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-slate-700 font-medium leading-tight">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Why Choose This Tool */}
                {tool.toolQuality && (
                  <div className="bg-sky-50 border border-sky-100 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
                      <ShieldCheck className="w-6 h-6 mr-2 text-sky-600" /> Why Choose Our {tool.name}?
                    </h2>
                    <p className="text-slate-700 leading-relaxed italic">
                      "{tool.toolQuality}"
                    </p>
                  </div>
                )}

                {/* How to Use */}
                <div className="bg-white border border-slate-200 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                    <HelpCircle className="w-6 h-6 mr-2 text-sky-500" /> How to Use (Step-by-Step)
                  </h2>
                  <div className="space-y-6">
                    {(tool.useOfTool ? [
                      ...tool.useOfTool.split('. ').filter(s => s.trim()).map(s => s.endsWith('.') ? s : s + '.')
                    ] : [
                      "Upload your file or enter input in the editor above.",
                      "Select your desired settings or configuration.",
                      "Click the process/convert button to start.",
                      "Download your file or copy the result to your clipboard."
                    ]).map((step, idx) => (
                      <div key={idx} className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                          {idx + 1}
                        </div>
                        <p className="text-slate-600 pt-1">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Use Cases & Benefits */}
              <div className="space-y-8">
                {/* Use Cases */}
                <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-xl">
                  <h2 className="text-xl font-bold mb-6">Perfect For:</h2>
                  <ul className="space-y-4">
                    {(tool.useCases || [
                      "Students working on assignments",
                      "Developers optimizing workflows",
                      "Bloggers improving SEO",
                      "Businesses handling documents"
                    ]).map((item, idx) => (
                      <li key={idx} className="flex items-center space-x-3">
                        <div className="w-1.5 h-1.5 bg-sky-400 rounded-full"></div>
                        <span className="text-slate-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Benefits */}
                <div className="bg-white border border-slate-200 rounded-2xl p-8">
                  <h2 className="text-xl font-bold text-slate-900 mb-6">Benefits:</h2>
                  <ul className="space-y-4">
                    {(tool.benefits || [
                      "Save time and effort",
                      "Improve productivity",
                      "Get accurate results instantly",
                      "Avoid installing heavy software"
                    ]).map((item, idx) => (
                      <li key={idx} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-sky-500" />
                        <span className="text-slate-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="bg-sky-500 rounded-2xl p-8 text-white text-center">
                  <h3 className="text-xl font-bold mb-4">Ready to Start?</h3>
                  <p className="text-sky-100 mb-6 text-sm">
                    Start using this tool now and simplify your workflow instantly.
                  </p>
                  <button 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="w-full py-3 bg-white text-sky-600 font-bold rounded-xl hover:bg-sky-50 transition-colors"
                  >
                    Use Tool Now
                  </button>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center">
                <HelpCircle className="w-6 h-6 mr-2 text-sky-500" /> FAQ Section
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Standard FAQs */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Q1: Is this tool free?</h3>
                    <p className="text-slate-600">Yes, all tools on DocToolHubPK are completely free to use with no hidden charges.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Q2: Is my data secure?</h3>
                    <p className="text-slate-600">Yes, all processing happens locally in your browser. We never store or upload your files to our servers.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Q3: Can I use this on mobile?</h3>
                    <p className="text-slate-600">Absolutely! Our platform is fully responsive and works perfectly on all mobile devices and tablets.</p>
                  </div>
                </div>
                {/* Tool Specific FAQs */}
                <div className="space-y-6">
                  {tool.faqs.slice(0, 3).map((faq, idx) => (
                    <div key={idx}>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">{faq.question}</h3>
                      <p className="text-slate-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Related Tools Section (Horizontal) */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">You may also find these tools useful:</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {TOOLS.filter(t => t.category === tool.category && t.id !== tool.id).slice(0, 4).map(related => (
                  <Link 
                    key={related.id}
                    to={`/tool/${related.slug}`}
                    className="flex items-center p-4 bg-white border border-slate-200 rounded-xl hover:border-sky-500 hover:shadow-md transition-all group"
                  >
                    <div className="w-10 h-10 bg-slate-100 text-slate-500 rounded-lg flex items-center justify-center mr-3 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                      <related.icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-slate-700 group-hover:text-sky-500 transition-colors">{related.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Related Blog Post Section */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Related Reading:</h2>
              <Link 
                to="/blog/ultimate-free-online-tools-hub-2026"
                className="flex flex-col md:flex-row items-center bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-sky-500 transition-all group"
              >
                <div className="w-full md:w-48 h-32 bg-sky-500 flex items-center justify-center text-white">
                  <Zap className="w-12 h-12" />
                </div>
                <div className="p-6">
                  <span className="text-xs font-bold text-sky-600 uppercase tracking-widest mb-2 block">Guide</span>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors mb-2">
                    The Ultimate Free Online Tools Hub for Image, PDF, SEO & Developer Needs (2026 Guide)
                  </h3>
                  <p className="text-slate-600 text-sm line-clamp-2">
                    Discover how DocToolHubPK can simplify your daily tasks with our all-in-one platform for image tools, PDF converters, SEO utilities, and developer tools.
                  </p>
                </div>
              </Link>
            </div>

            {/* Bottom AdSense Placeholder */}
            <div className="w-full h-32 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 text-sm uppercase tracking-widest">
              Bottom Advertisement
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
