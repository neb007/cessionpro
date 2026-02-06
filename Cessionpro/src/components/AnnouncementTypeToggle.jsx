import React from 'react';
import { Button } from '@/components/ui/button';
import { Building2, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AnnouncementTypeToggle({
  announcementType,
  onChange,
  language = 'fr'
}) {
  const isSale = announcementType === 'sale';

  return (
    <div className="mb-6">
      <p className="text-sm font-semibold text-gray-900 mb-3">
        {language === 'fr' ? 'Type d\'annonce' : 'Announcement Type'}
      </p>

      <div className="flex gap-3">
        {/* Sale Button */}
        <motion.div
          className="flex-1"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={() => onChange('sale')}
            variant={isSale ? 'default' : 'outline'}
            className={`w-full h-12 gap-2 ${
              isSale ? 'bg-primary text-white hover:bg-primary/90' : ''
            }`}
          >
            <Building2 className="w-5 h-5" />
            <span className="font-medium">
              {language === 'fr' ? 'Je vends' : 'I\'m selling'}
            </span>
          </Button>
        </motion.div>

        {/* Acquisition Button */}
        <motion.div
          className="flex-1"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={() => onChange('acquisition')}
            variant={!isSale ? 'default' : 'outline'}
            className={`w-full h-12 gap-2 ${
              !isSale ? 'bg-primary text-white hover:bg-primary/90' : ''
            }`}
          >
            <Search className="w-5 h-5" />
            <span className="font-medium">
              {language === 'fr' ? 'Je cherche' : 'I\'m looking'}
            </span>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
