import React, { useState } from 'react';
import { MenuItem } from '../types';
import { CURRENCY_FORMAT } from '../constants';
import { Plus, Sparkles, Info } from 'lucide-react';
import { generateDishDescription } from '../services/geminiService';

interface MenuCardProps {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
}

const MenuCard: React.FC<MenuCardProps> = ({ item, onAdd }) => {
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiDetails, setAiDetails] = useState<{ desc: string; pair: string } | null>(null);

  const handleAskChef = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (aiDetails) {
      setAiDetails(null); // Toggle off
      return;
    }

    setIsLoadingAI(true);
    try {
      const result = await generateDishDescription(item);
      setAiDetails({ desc: result.description, pair: result.pairingSuggestion });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingAI(false);
    }
  };

  return (
    <div className="group relative bg-white dark:bg-neutral-900 rounded-xl overflow-hidden border border-gray-100 dark:border-neutral-800 hover:border-orange-500/50 dark:hover:border-orange-500/50 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-orange-500/10 dark:hover:shadow-orange-900/20">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {item.isPopular && (
          <div className="absolute top-3 right-3 bg-orange-500 text-white dark:text-black text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
            <Sparkles size={12} /> BESTSELLER
          </div>
        )}
        <button
          onClick={handleAskChef}
          className="absolute bottom-3 right-3 bg-white/90 dark:bg-black/70 backdrop-blur-sm text-gray-800 dark:text-white p-2 rounded-full hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 transition-colors shadow-sm"
          title="Ask AI Chef"
        >
          {isLoadingAI ? (
            <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
          ) : (
            <Sparkles size={16} className={aiDetails ? "text-orange-500 dark:text-orange-300" : "currentColor"} />
          )}
        </button>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">{item.name}</h3>
          <span className="text-lg font-serif font-bold text-orange-600 dark:text-orange-500">{CURRENCY_FORMAT.format(item.price)}</span>
        </div>
        
        {aiDetails ? (
          <div className="mb-4 bg-orange-50 dark:bg-neutral-800/50 p-3 rounded-lg text-sm animate-fade-in border border-orange-100 dark:border-neutral-700">
            <p className="text-gray-700 dark:text-neutral-300 italic mb-2">"{aiDetails.desc}"</p>
            <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300 text-xs font-semibold">
              <span>🍷 Pair with: {aiDetails.pair}</span>
            </div>
          </div>
        ) : (
          <p className="text-gray-600 dark:text-neutral-400 text-sm mb-4 h-10 line-clamp-2">{item.description}</p>
        )}

        <button 
          onClick={() => onAdd(item)}
          className="w-full bg-gray-100 dark:bg-neutral-800 hover:bg-orange-600 dark:hover:bg-white hover:text-white dark:hover:text-black text-gray-900 dark:text-white py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 group-active:scale-95"
        >
          <Plus size={18} />
          Add to Order
        </button>
      </div>
    </div>
  );
};

export default MenuCard;