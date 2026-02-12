import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Video,
  Phone,
  Plus,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * MeetingScheduler Component
 * Allows users to schedule and manage meetings within conversations
 * Supports video calls, phone calls, and in-person meetings
 */
const MeetingScheduler = ({
  meetings = [],
  onScheduleMeeting = () => {},
  onCancelMeeting = () => {},
  onJoinMeeting = () => {},
  language = 'en',
  userTimezone = 'Europe/Paris'
}) => {
  const [showScheduler, setShowScheduler] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'video', // 'video' | 'phone' | 'in_person'
    date: '',
    time: '',
    duration: 30, // minutes
    location: '',
    notes: ''
  });

  const meetingTypes = [
    {
      id: 'video',
      label: language === 'fr' ? 'Visio' : 'Video Call',
      icon: '📹',
      description: language === 'fr' ? 'Appel vidéo' : 'Video conference'
    },
    {
      id: 'phone',
      label: language === 'fr' ? 'Téléphone' : 'Phone Call',
      icon: '☎️',
      description: language === 'fr' ? 'Appel téléphonique' : 'Phone conference'
    },
    {
      id: 'in_person',
      label: language === 'fr' ? 'En personne' : 'In Person',
      icon: '🤝',
      description: language === 'fr' ? 'Réunion en présentiel' : 'Face-to-face meeting'
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSchedule = () => {
    if (!formData.title || !formData.date || !formData.time) {
      alert(language === 'fr' ? 'Veuillez remplir tous les champs' : 'Please fill all fields');
      return;
    }

    onScheduleMeeting({
      ...formData,
      id: Date.now().toString(),
      status: 'scheduled',
      createdAt: new Date().toISOString()
    });

    setFormData({
      title: '',
      type: 'video',
      date: '',
      time: '',
      duration: 30,
      location: '',
      notes: ''
    });

    setShowScheduler(false);
  };

  const formatMeetingTime = (date, time) => {
    try {
      const [hours, minutes] = time.split(':');
      const d = new Date(`${date}T${time}`);
      return d.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return '';
    }
  };

  const getTypeIcon = (type) => {
    const typeData = meetingTypes.find(t => t.id === type);
    return typeData?.icon || '📅';
  };

  const upcomingMeetings = meetings
    .filter(m => m.status === 'scheduled')
    .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

  const pastMeetings = meetings
    .filter(m => m.status === 'completed')
    .sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-gray-900">
          {language === 'fr' ? '📅 Planification de Réunions' : '📅 Meeting Scheduler'}
        </h3>
        <Button
          onClick={() => setShowScheduler(!showScheduler)}
          className="bg-blue-600 hover:bg-blue-700"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-1" />
          {language === 'fr' ? 'Nouvelle réunion' : 'New Meeting'}
        </Button>
      </div>

      {/* Scheduler Form */}
      <AnimatePresence>
        {showScheduler && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-blue-50 rounded-lg border border-blue-200 p-4 space-y-4"
          >
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'fr' ? 'Titre' : 'Title'} *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder={language === 'fr' ? 'Ex: Appel de découverte' : 'Ex: Discovery call'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Meeting Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'fr' ? 'Type de réunion' : 'Meeting Type'} *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {meetingTypes.map(type => (
                  <motion.button
                    key={type.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleInputChange('type', type.id)}
                    className={`p-2 rounded-lg border-2 transition-all text-xs
                      ${formData.type === type.id
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'
                      }
                    `}
                  >
                    <div className="text-lg mb-1">{type.icon}</div>
                    <p className="font-medium line-clamp-1">{type.label}</p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'fr' ? 'Date' : 'Date'} *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'fr' ? 'Heure' : 'Time'} *
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'fr' ? 'Durée (minutes)' : 'Duration (minutes)'}
              </label>
              <select
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={15}>15 min</option>
                <option value={30}>30 min</option>
                <option value={45}>45 min</option>
                <option value={60}>1 hour</option>
                <option value={90}>1.5 hours</option>
                <option value={120}>2 hours</option>
              </select>
            </div>

            {/* Location (for in-person meetings) */}
            {formData.type === 'in_person' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'fr' ? 'Lieu' : 'Location'} *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder={language === 'fr' ? 'Ex: 123 Rue de Paris, 75000' : 'Ex: 123 Main St, New York'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'fr' ? 'Notes' : 'Notes'}
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder={language === 'fr' ? 'Ajouter des notes ou des détails...' : 'Add notes or details...'}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={handleSchedule}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {language === 'fr' ? 'Planifier' : 'Schedule'}
              </Button>
              <Button
                onClick={() => setShowScheduler(false)}
                variant="outline"
                className="flex-1"
              >
                {language === 'fr' ? 'Annuler' : 'Cancel'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upcoming Meetings */}
      {upcomingMeetings.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-900">
            {language === 'fr' ? '📅 À venir' : '📅 Upcoming'}
          </h4>
          <AnimatePresence>
            {upcomingMeetings.map(meeting => (
              <motion.div
                key={meeting.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                whileHover={{ scale: 1.01 }}
                onClick={() => setSelectedMeeting(meeting)}
                className="p-3 bg-white rounded-lg border border-green-200 bg-green-50 cursor-pointer transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <div className="text-2xl">{getTypeIcon(meeting.type)}</div>
                    <div>
                      <h5 className="font-medium text-gray-900 text-sm">{meeting.title}</h5>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatMeetingTime(meeting.date, meeting.time)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {meeting.duration} min
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onJoinMeeting(meeting.id);
                    }}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {meeting.type === 'video' ? (
                      <Video className="w-3 h-3 mr-1" />
                    ) : meeting.type === 'phone' ? (
                      <Phone className="w-3 h-3 mr-1" />
                    ) : (
                      <MapPin className="w-3 h-3 mr-1" />
                    )}
                    {language === 'fr' ? 'Rejoindre' : 'Join'}
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* No Meetings */}
      {upcomingMeetings.length === 0 && !showScheduler && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 text-gray-500"
        >
          <Calendar className="w-12 h-12 mx-auto mb-2 opacity-30" />
          <p className="text-sm">
            {language === 'fr' ? 'Aucune réunion planifiée' : 'No meetings scheduled'}
          </p>
        </motion.div>
      )}

      {/* Past Meetings */}
      {pastMeetings.length > 0 && (
        <motion.div
          layout
          className="space-y-2 border-t border-gray-200 pt-4"
        >
          <h4 className="text-sm font-semibold text-gray-900">
            {language === 'fr' ? '✓ Réunions passées' : '✓ Past Meetings'}
          </h4>
          <AnimatePresence>
            {pastMeetings.slice(0, 3).map(meeting => (
              <motion.div
                key={meeting.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{meeting.title}</span>
                  </div>
                  <span className="text-gray-400">{formatMeetingTime(meeting.date, meeting.time)}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default MeetingScheduler;
