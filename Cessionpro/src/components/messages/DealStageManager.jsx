import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Lock, AlertCircle, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * DealStageManager Component
 * Allows users to progress through deal stages with actions and requirements
 */
const DealStageManager = ({
  currentStage = 'contact',
  onStageChange = () => {},
  onActionClick = () => {},
  language = 'en',
  isBuyer = false
}) => {
  const [showActionConfirm, setShowActionConfirm] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const stages = [
    {
      id: 'contact',
      labelFr: 'Contact',
      labelEn: 'Contact',
      descriptionFr: 'Prise de contact initiale',
      descriptionEn: 'Initial contact',
      actions: [
        {
          id: 'request_nda',
          labelFr: 'Demander NDA',
          labelEn: 'Request NDA',
          icon: '📝',
          requiresRole: 'both',
          consequence: 'nda'
        }
      ]
    },
    {
      id: 'nda',
      labelFr: 'NDA',
      labelEn: 'NDA',
      descriptionFr: 'Accord de confidentialité',
      descriptionEn: 'Confidentiality agreement',
      actions: [
        {
          id: 'sign_nda',
          labelFr: 'Signer NDA',
          labelEn: 'Sign NDA',
          icon: '✍️',
          requiresRole: 'both',
          consequence: 'data_room'
        },
        {
          id: 'reject_nda',
          labelFr: 'Refuser NDA',
          labelEn: 'Reject NDA',
          icon: '❌',
          requiresRole: 'both',
          consequence: 'contact'
        }
      ]
    },
    {
      id: 'data_room',
      labelFr: 'Data Room',
      labelEn: 'Data Room',
      descriptionFr: 'Accès aux documents',
      descriptionEn: 'Document access',
      actions: [
        {
          id: 'share_documents',
          labelFr: 'Partager Documents',
          labelEn: 'Share Documents',
          icon: '📄',
          requiresRole: 'seller',
          consequence: 'data_room'
        },
        {
          id: 'request_loi',
          labelFr: 'Demander LOI',
          labelEn: 'Request LOI',
          icon: '📋',
          requiresRole: 'buyer',
          consequence: 'loi'
        }
      ]
    },
    {
      id: 'loi',
      labelFr: 'LOI',
      labelEn: 'LOI',
      descriptionFr: 'Lettre d\'intention',
      descriptionEn: 'Letter of intent',
      actions: [
        {
          id: 'sign_loi',
          labelFr: 'Signer LOI',
          labelEn: 'Sign LOI',
          icon: '✅',
          requiresRole: 'both',
          consequence: 'closing'
        },
        {
          id: 'negotiate',
          labelFr: 'Négocier',
          labelEn: 'Negotiate',
          icon: '💬',
          requiresRole: 'both',
          consequence: 'loi'
        }
      ]
    },
    {
      id: 'closing',
      labelFr: 'Closing',
      labelEn: 'Closing',
      descriptionFr: 'Finalisation de la cession',
      descriptionEn: 'Deal completion',
      actions: [
        {
          id: 'complete_deal',
          labelFr: 'Finaliser',
          labelEn: 'Complete',
          icon: '🎉',
          requiresRole: 'both',
          consequence: 'closing'
        }
      ]
    }
  ];

  const currentStageData = stages.find(s => s.id === currentStage);
  const userRole = isBuyer ? 'buyer' : 'seller';

  const handleActionClick = (action) => {
    setPendingAction(action);
    setShowActionConfirm(true);
  };

  const handleConfirmAction = () => {
    if (pendingAction) {
      onActionClick(pendingAction.id);
      if (pendingAction.consequence !== currentStage) {
        onStageChange(pendingAction.consequence);
      }
      setShowActionConfirm(false);
      setPendingAction(null);
    }
  };

  const getAvailableActions = () => {
    if (!currentStageData) return [];
    return currentStageData.actions.filter(
      action => action.requiresRole === 'both' || action.requiresRole === userRole
    );
  };

  const availableActions = getAvailableActions();

  return (
    <div className="space-y-4">
      {/* Current Stage Card */}
      <motion.div
        layout
        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-4 space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-lg">
              👥
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">
                {language === 'fr' ? currentStageData?.labelFr : currentStageData?.labelEn}
              </h4>
              <p className="text-xs text-gray-600">
                {language === 'fr' ? currentStageData?.descriptionFr : currentStageData?.descriptionEn}
              </p>
            </div>
          </div>
          <CheckCircle2 className="w-5 h-5 text-blue-600" />
        </div>

        {/* Actions */}
        {availableActions.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-blue-200">
            <p className="text-xs font-medium text-gray-700">
              {language === 'fr' ? 'Actions disponibles' : 'Available actions'}
            </p>
            <div className="flex flex-wrap gap-2">
              {availableActions.map(action => (
                <motion.button
                  key={action.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleActionClick(action)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-blue-300 text-xs font-medium text-blue-700 hover:bg-blue-50 transition-colors flex items-center gap-1"
                >
                  <span>{action.icon}</span>
                  {language === 'fr' ? action.labelFr : action.labelEn}
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Requirements Info */}
      <AnimatePresence>
        {currentStage === 'nda' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200"
          >
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-semibold text-amber-900">
                {language === 'fr' ? 'NDA En Attente' : 'NDA Pending'}
              </p>
              <p className="text-amber-800 mt-1">
                {language === 'fr'
                  ? 'Une fois signé, la Data Room sera accessible avec tous les documents financiers.'
                  : 'Once signed, the Data Room will be accessible with all financial documents.'
                }
              </p>
            </div>
          </motion.div>
        )}

        {currentStage === 'data_room' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200"
          >
            <FileCheck className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-semibold text-green-900">
                {language === 'fr' ? 'Data Room Valide' : 'Valid Data Room'}
              </p>
              <p className="text-green-800 mt-1">
                {language === 'fr'
                  ? 'Vous pouvez maintenant consulter les documents. Procédez à la LOI quand prêt.'
                  : 'You can now view the documents. Proceed to LOI when ready.'
                }
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Confirmation Modal */}
      <AnimatePresence>
        {showActionConfirm && pendingAction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-sm space-y-4"
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl">{pendingAction.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {language === 'fr' ? pendingAction.labelFr : pendingAction.labelEn}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {language === 'fr'
                      ? 'Êtes-vous sûr de vouloir effectuer cette action?'
                      : 'Are you sure you want to perform this action?'
                    }
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setShowActionConfirm(false)}
                  variant="outline"
                  className="flex-1"
                >
                  {language === 'fr' ? 'Annuler' : 'Cancel'}
                </Button>
                <Button
                  onClick={handleConfirmAction}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {language === 'fr' ? 'Confirmer' : 'Confirm'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DealStageManager;
