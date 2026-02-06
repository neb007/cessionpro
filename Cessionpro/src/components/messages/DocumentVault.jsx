import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Lock, 
  CheckCircle2, 
  Clock,
  Eye,
  Share2,
  Trash2,
  File,
  FileJson,
  FileCode,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * DocumentVault Component
 * Manages and displays documents shared in a conversation
 * Handles access control based on deal stage (NDA requirement)
 */
const DocumentVault = ({
  documents = [],
  currentStage = 'contact',
  onDownload = () => {},
  onDelete = () => {},
  onShare = () => {},
  language = 'en',
  isSeller = false,
  isNDASigned = false
}) => {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [filterType, setFilterType] = useState('all');

  // Check if Data Room is accessible
  const isDataRoomLocked = currentStage === 'contact' || currentStage === 'nda';
  const canAccessDataRoom = isNDASigned || isSeller;

  // Get file icon based on type
  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    
    const iconMap = {
      pdf: '📄',
      doc: '📝',
      docx: '📝',
      xls: '📊',
      xlsx: '📊',
      csv: '📊',
      ppt: '🎯',
      pptx: '🎯',
      txt: '📄',
      json: '⚙️',
      zip: '📦',
      rar: '📦'
    };

    return iconMap[ext] || '📄';
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    if (filterType === 'all') return true;
    return (doc.file_type || 'unknown').toLowerCase().includes(filterType);
  });

  const stats = {
    total: documents.length,
    signed: documents.filter(d => d.is_signed).length,
    pending: documents.filter(d => !d.is_signed && d.requires_nda_signed).length
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-gray-900">
          {language === 'fr' ? '🗂️ Vault de Documents' : '🗂️ Document Vault'}
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>{stats.total}</span>
          <span className="text-gray-400">•</span>
          <span className="text-green-600">{stats.signed} {language === 'fr' ? 'signés' : 'signed'}</span>
        </div>
      </div>

      {/* Access Control Banner */}
      {isDataRoomLocked && !canAccessDataRoom && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200"
        >
          <Lock className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-semibold text-red-900">
              {language === 'fr' ? '🔒 Data Room Verrouillée' : '🔒 Data Room Locked'}
            </p>
            <p className="text-red-800 mt-1">
              {language === 'fr'
                ? 'Signez le NDA pour accéder aux documents.'
                : 'Sign the NDA to access documents.'
              }
            </p>
          </div>
        </motion.div>
      )}

      {/* Filter Tabs */}
      {documents.length > 0 && (
        <div className="flex gap-2 pb-2 border-b border-gray-200 overflow-x-auto">
          {['all', 'pdf', 'xlsx', 'docx', 'pptx'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors
                ${filterType === type
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              {type === 'all' 
                ? language === 'fr' ? 'Tous' : 'All'
                : type.toUpperCase()
              }
            </button>
          ))}
        </div>
      )}

      {/* Documents List */}
      {filteredDocuments.length > 0 ? (
        <motion.div
          layout
          className="space-y-2"
        >
          <AnimatePresence>
            {filteredDocuments.map((doc, idx) => (
              <motion.div
                key={doc.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                whileHover={{ scale: 1.01 }}
                onClick={() => setSelectedDocument(doc)}
                className={`p-3 rounded-lg border transition-all cursor-pointer
                  ${selectedDocument?.id === doc.id
                    ? 'bg-primary/5 border-primary'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                  }
                  ${isDataRoomLocked && !canAccessDataRoom ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <div className="flex items-start gap-3">
                  {/* File Icon */}
                  <div className="text-2xl flex-shrink-0">
                    {getFileIcon(doc.file_name)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-1">
                      <h4 className="font-medium text-sm text-gray-900 truncate">
                        {doc.file_name}
                      </h4>
                      {doc.is_signed && (
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      )}
                      {doc.requires_nda_signed && !doc.is_signed && (
                        <Lock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{formatFileSize(doc.file_size || 0)}</span>
                      <span>•</span>
                      <span>
                        {language === 'fr' ? 'Partagé' : 'Shared'}: {doc.uploaded_by}
                      </span>
                      {doc.is_signed && (
                        <>
                          <span>•</span>
                          <span className="text-green-600 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            {language === 'fr' ? 'Signé' : 'Signed'}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Document Details */}
                    {selectedDocument?.id === doc.id && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-2 space-y-2 text-xs text-gray-600"
                      >
                        <p>
                          {language === 'fr' ? 'Type:' : 'Type:'} <span className="font-medium">{doc.file_type}</span>
                        </p>
                        {doc.signed_at && (
                          <p>
                            {language === 'fr' ? 'Signé le:' : 'Signed on:'} <span className="font-medium">
                              {new Date(doc.signed_at).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
                            </span>
                          </p>
                        )}
                      </motion.div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className={`flex gap-1 flex-shrink-0 ${isDataRoomLocked && !canAccessDataRoom ? 'opacity-50 pointer-events-none' : ''}`}>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDownload(doc.id);
                      }}
                      className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors"
                      title={language === 'fr' ? 'Télécharger' : 'Download'}
                    >
                      <Download className="w-4 h-4" />
                    </motion.button>

                    {isSeller && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onShare(doc.id);
                        }}
                        className="p-2 rounded-lg hover:bg-purple-100 text-purple-600 transition-colors"
                        title={language === 'fr' ? 'Partager' : 'Share'}
                      >
                        <Share2 className="w-4 h-4" />
                      </motion.button>
                    )}

                    {isSeller && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(doc.id);
                        }}
                        className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                        title={language === 'fr' ? 'Supprimer' : 'Delete'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <div className="text-4xl mb-2">📂</div>
          <p className="text-gray-500 text-sm">
            {language === 'fr' 
              ? 'Aucun document pour le moment' 
              : 'No documents yet'
            }
          </p>
        </motion.div>
      )}

      {/* Document Details Panel */}
      <AnimatePresence>
        {selectedDocument && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-gray-900">
                  {language === 'fr' ? '📋 Détails du document' : '📋 Document Details'}
                </h4>
                <p className="text-xs text-gray-600 mt-1">{selectedDocument.file_name}</p>
              </div>
              <button
                onClick={() => setSelectedDocument(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Security Status */}
            {selectedDocument.requires_nda_signed && (
              <div className={`p-3 rounded-lg flex items-start gap-2
                ${selectedDocument.is_signed
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-amber-50 border border-amber-200'
                }
              `}>
                {selectedDocument.is_signed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-green-900">
                      {language === 'fr'
                        ? '✓ Document signé et validé'
                        : '✓ Document signed and validated'
                      }
                    </p>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-900">
                      {language === 'fr'
                        ? 'Ce document requiert une signature NDA'
                        : 'This document requires NDA signature'
                      }
                    </p>
                  </>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={() => onDownload(selectedDocument.id)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                <Download className="w-4 h-4 mr-1" />
                {language === 'fr' ? 'Télécharger' : 'Download'}
              </Button>
              {isSeller && (
                <Button
                  onClick={() => onDelete(selectedDocument.id)}
                  variant="outline"
                  size="sm"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  {language === 'fr' ? 'Supprimer' : 'Delete'}
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Statistics */}
      {documents.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-3 gap-2 text-xs"
        >
          <div className="p-2 bg-blue-50 rounded-lg text-center">
            <p className="font-semibold text-blue-900">{stats.total}</p>
            <p className="text-blue-700">{language === 'fr' ? 'Documents' : 'Documents'}</p>
          </div>
          <div className="p-2 bg-green-50 rounded-lg text-center">
            <p className="font-semibold text-green-900">{stats.signed}</p>
            <p className="text-green-700">{language === 'fr' ? 'Signés' : 'Signed'}</p>
          </div>
          <div className="p-2 bg-amber-50 rounded-lg text-center">
            <p className="font-semibold text-amber-900">{stats.pending}</p>
            <p className="text-amber-700">{language === 'fr' ? 'En attente' : 'Pending'}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DocumentVault;
