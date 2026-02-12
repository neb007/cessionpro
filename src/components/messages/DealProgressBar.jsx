import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Circle, Lock, Unlock } from 'lucide-react';

/**
 * DealProgressBar Component
 * Interactive timeline showing deal progression stages
 * Stages: Contact > NDA > Data Room > LOI > Closing
 */
const DealProgressBar = ({ 
  currentStage = 'contact',
  onStageChange = () => {},
  language = 'en',
  isEditable = false
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const stages = [
    {
      id: 'contact',
      labelFr: 'Contact',
      labelEn: 'Contact',
      icon: '👥',
      description: language === 'fr' ? 'Prise de contact initiale' : 'Initial contact',
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'nda',
      labelFr: 'NDA',
      labelEn: 'NDA',
      icon: '📝',
      description: language === 'fr' ? 'Accord de confidentialité' : 'Confidentiality agreement',
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 'data_room',
      labelFr: 'Data Room',
      labelEn: 'Data Room',
      icon: '🗂️',
      description: language === 'fr' ? 'Accès aux documents' : 'Document access',
      color: 'from-indigo-500 to-indigo-600',
      requiresNDA: true,
    },
    {
      id: 'loi',
      labelFr: 'LOI',
      labelEn: 'LOI',
      icon: '📋',
      description: language === 'fr' ? 'Lettre d\'intention' : 'Letter of intent',
      color: 'from-green-500 to-green-600',
    },
    {
      id: 'closing',
      labelFr: 'Closing',
      labelEn: 'Closing',
      icon: '✅',
      description: language === 'fr' ? 'Finalisation de la cession' : 'Deal completion',
      color: 'from-emerald-500 to-emerald-600',
    },
  ];

  const stageIndex = stages.findIndex(s => s.id === currentStage);
  const progress = ((stageIndex + 1) / stages.length) * 100;

  const isDataRoomLocked = currentStage === 'contact' || currentStage === 'nda';
  const currentStageData = stages.find(s => s.id === currentStage);

  const handleStageClick = (stageId) => {
    if (!isEditable) return;
    const targetIndex = stages.findIndex(s => s.id === stageId);
    const currentIndex = stages.findIndex(s => s.id === currentStage);
    
    // Only allow progressing forward or backward one step
    if (Math.abs(targetIndex - currentIndex) <= 1 || targetIndex < currentIndex) {
      onStageChange(stageId);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-display text-sm font-semibold text-gray-900 mb-1">
            {language === 'fr' ? 'Progression du Deal' : 'Deal Progress'}
          </h3>
          <p className="text-xs text-gray-500">
            {currentStageData?.description}
          </p>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs font-medium text-primary hover:underline"
        >
          {showDetails ? (language === 'fr' ? 'Masquer' : 'Hide') : (language === 'fr' ? 'Détails' : 'Details')}
        </button>
      </div>

      {/* Progress Bar Container */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
        {/* Main Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          
          {/* Progress Track */}
          <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className={`h-full bg-gradient-to-r ${currentStageData?.color || 'from-blue-500 to-blue-600'}`}
            />
          </div>
        </div>

        {/* Stage Indicators */}
        <div className="flex items-center justify-between">
          {stages.map((stage, index) => {
            const isCompleted = stageIndex >= index;
            const isActive = stage.id === currentStage;
            const isLocked = stage.requiresNDA && isDataRoomLocked;

            return (
              <motion.button
                key={stage.id}
                onClick={() => handleStageClick(stage.id)}
                disabled={isLocked || !isEditable}
                whileHover={!isLocked && isEditable ? { scale: 1.05 } : {}}
                whileTap={!isLocked && isEditable ? { scale: 0.95 } : {}}
                className={`flex flex-col items-center gap-1 flex-shrink-0 transition-all
                  ${isActive ? 'scale-110' : ''}
                  ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                {/* Stage Icon/Badge */}
                <div className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all
                  ${isActive 
                    ? `bg-gradient-to-r ${stage.color} border-transparent shadow-lg` 
                    : isCompleted 
                    ? 'bg-emerald-100 border-emerald-300' 
                    : 'bg-gray-100 border-gray-300'
                  }
                `}>
                  {isLocked ? (
                    <Lock className="w-4 h-4 text-gray-400" />
                  ) : isCompleted ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <span className="text-sm">{stage.icon}</span>
                  )}
                </div>

                {/* Stage Label */}
                <span className={`text-xs font-medium transition-colors
                  ${isActive 
                    ? 'text-gray-900' 
                    : isCompleted 
                    ? 'text-emerald-600' 
                    : 'text-gray-500'
                  }
                `}>
                  {language === 'fr' ? stage.labelFr : stage.labelEn}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Current Stage Info Card */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100"
            >
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-lg">{currentStageData?.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">
                      {language === 'fr' 
                        ? `Étape actuelle: ${currentStageData?.labelFr}` 
                        : `Current stage: ${currentStageData?.labelEn}`
                      }
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {currentStageData?.description}
                    </p>
                  </div>
                </div>

                {/* Data Room Lock Info */}
                {isDataRoomLocked && (
                  <div className="flex items-start gap-2 pt-2 border-t border-blue-200">
                    <Lock className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700">
                      {language === 'fr'
                        ? 'La Data Room sera accessible une fois le NDA signé'
                        : 'Data Room will be accessible once NDA is signed'
                      }
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stage Description List (Optional) */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-2 text-xs"
        >
          {stages.map((stage) => (
            <div key={stage.id} className="flex items-start gap-2 p-2 bg-gray-50 rounded">
              <span className="flex-shrink-0">{stage.icon}</span>
              <div>
                <p className="font-medium text-gray-900">
                  {language === 'fr' ? stage.labelFr : stage.labelEn}
                </p>
                <p className="text-gray-600 line-clamp-1">
                  {stage.description}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default DealProgressBar;
