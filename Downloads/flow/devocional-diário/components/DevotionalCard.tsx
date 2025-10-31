
import React, { useState } from 'react';
import { Devotional } from '../types';
import { ShareIcon } from './icons/ShareIcon';
import { CopyIcon } from './icons/CopyIcon';

interface DevotionalCardProps {
  devotional: Devotional;
}

const DevotionalCard: React.FC<DevotionalCardProps> = ({ devotional }) => {
  const [copied, setCopied] = useState(false);

  const fullDevotionalText = `
*${devotional.title}*

📖 *Versículo:* ${devotional.verse}

🤔 *Reflexão:*
${devotional.reflection}

🙏 *Oração:*
${devotional.prayer}
  `;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Devocional: ${devotional.title}`,
          text: fullDevotionalText,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Erro ao compartilhar:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      handleCopy();
    }
  };
  
  const handleCopy = () => {
     navigator.clipboard.writeText(fullDevotionalText.trim()).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
     });
  }

  return (
    <article className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg rounded-xl shadow-lg p-6 sm:p-8 transition-all duration-300 animate-fade-in">
      <header className="text-center mb-6">
        <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{devotional.theme}</span>
        <h2 className="text-3xl md:text-4xl font-bold font-serif mt-2 text-slate-900 dark:text-white">{devotional.title}</h2>
      </header>
      
      <div className="space-y-6 font-serif text-lg leading-relaxed text-slate-700 dark:text-slate-300">
        <blockquote className="border-l-4 border-indigo-500/50 pl-4 italic">
          <p>{devotional.verse}</p>
        </blockquote>

        <div className="prose prose-lg dark:prose-invert max-w-none prose-p:my-3">
          {devotional.reflection.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-200">Oração</h3>
          <p className="italic">{devotional.prayer}</p>
        </div>
      </div>
      
      <footer className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-end items-center gap-4">
        <button 
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
        >
          {copied ? 'Copiado!' : <><CopyIcon className="w-4 h-4" /> Copiar</>}
        </button>
        <button 
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
        >
          <ShareIcon className="w-4 h-4" />
          Compartilhar
        </button>
      </footer>
       <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </article>
  );
};

export default DevotionalCard;
