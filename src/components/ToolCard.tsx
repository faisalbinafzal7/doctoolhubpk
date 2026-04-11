import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface ToolCardProps {
  tool: {
    id: string;
    name: string;
    slug: string;
    shortDescription: string;
    description?: string;
    icon: LucideIcon;
    previewImage: string;
    externalUrl?: string;
  };
  idx?: number;
  showFullDescription?: boolean;
}

import { ToolIllustration } from './ToolIllustration';

export const ToolCard: React.FC<ToolCardProps> = ({ tool, idx = 0, showFullDescription = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.05 }}
      className="h-full"
    >
      <Link 
        to={tool.externalUrl || `/tool/${tool.slug}`}
        target={tool.externalUrl ? "_blank" : undefined}
        rel={tool.externalUrl ? "noopener noreferrer" : undefined}
        className="block bg-white border border-slate-200 rounded-3xl hover:border-sky-400 hover:shadow-2xl hover:shadow-sky-100/50 transition-all group h-full flex flex-col overflow-hidden"
      >
        {/* Preview Image / Icon Illustration */}
        <div className="relative h-48 overflow-hidden bg-sky-500 flex items-center justify-center">
          {tool.previewImage ? (
            <img 
              src={tool.previewImage} 
              alt={tool.name} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          ) : (
            /* Enhanced Illustration */
            <div className="w-full h-full flex items-center justify-center relative">
              {/* Dashed Box Background */}
              <div className="absolute inset-8 border-2 border-dashed border-white/20 rounded-2xl" />
              
              {/* Corner Accents */}
              <div className="absolute top-8 left-8 w-1.5 h-1.5 bg-white/40 rounded-full" />
              <div className="absolute top-8 right-8 w-1.5 h-1.5 bg-white/40 rounded-full" />
              <div className="absolute bottom-8 left-8 w-1.5 h-1.5 bg-white/40 rounded-full" />
              <div className="absolute bottom-8 right-8 w-1.5 h-1.5 bg-white/40 rounded-full" />

              <ToolIllustration type={tool.slug} size="lg" className="relative z-10" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
            <div className="text-white text-xs font-bold uppercase tracking-wider flex items-center">
              Launch Tool <ArrowRight className="ml-2 w-3 h-3" />
            </div>
          </div>
        </div>

        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-sky-500 transition-colors">{tool.name}</h3>
          <p className="text-slate-900 text-sm font-semibold mb-3 leading-relaxed line-clamp-2">{tool.shortDescription}</p>
          {showFullDescription && tool.description && (
            <p className="text-slate-500 text-sm mb-6 leading-relaxed line-clamp-3">{tool.description}</p>
          )}
          
          <div className="mt-auto pt-4 flex items-center justify-between text-sky-500 font-bold text-sm">
            <span className="flex items-center">
              Get Started <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
