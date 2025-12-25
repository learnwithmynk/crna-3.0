/**
 * Notes Section
 *
 * Role-based notes display with proper visibility:
 * - Additional Information: Public (user, admins, mentors, shared viewers)
 * - My Private Notes: User only
 * - Admin Notes: All admins only
 * - Mentor Notes: Individual mentor + admins
 *
 * Each section has clear visibility indicators
 */

import React, { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  FileText,
  Lock,
  Eye,
  Shield,
  Users,
  Pencil,
  Save,
  X,
  Globe,
  MessageSquare,
} from 'lucide-react';

// Visibility indicator component
const VisibilityBadge = ({ type }) => {
  const configs = {
    public: {
      icon: Globe,
      label: 'Visible on your profile',
      className: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    private: {
      icon: Lock,
      label: 'Only you can see this',
      className: 'bg-gray-100 text-gray-600 border-gray-200',
    },
    admin: {
      icon: Shield,
      label: 'Visible to all admins',
      className: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    mentor: {
      icon: Eye,
      label: 'Private to you (admins can view)',
      className: 'bg-amber-50 text-amber-700 border-amber-200',
    },
  };

  const config = configs[type];
  if (!config) return null;

  const Icon = config.icon;

  return (
    <Badge variant="outline" className={`text-xs ${config.className}`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  );
};

// Editable textarea component
const EditableNote = ({
  value,
  placeholder,
  onChange,
  onSave,
  isEditable = true,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || '');

  const handleSave = () => {
    onSave?.(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value || '');
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="space-y-2">
        <textarea
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          placeholder={placeholder}
          className="w-full min-h-[100px] p-3 border rounded-xl text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/20"
          autoFocus
        />
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="outline" onClick={handleCancel}>
            <X className="w-3 h-3 mr-1" />
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Save className="w-3 h-3 mr-1" />
            Save
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      {value ? (
        <p className="text-sm text-gray-700 whitespace-pre-wrap">{value}</p>
      ) : (
        <p className="text-sm text-gray-400 italic">{placeholder}</p>
      )}
      {isEditable && (
        <button
          onClick={() => setIsEditing(true)}
          className="absolute top-0 right-0 p-1.5 opacity-0 group-hover:opacity-100 hover:bg-gray-100 rounded transition-all"
        >
          <Pencil className="w-4 h-4 text-gray-500" />
        </button>
      )}
    </div>
  );
};

export function NotesSection({
  userNotes,
  adminNotes = [],
  mentorNotes = [],
  viewerRole = 'user', // 'user', 'admin', 'mentor'
  currentMentorId = null,
  onSaveNote,
  isOwnProfile = true,
}) {
  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      {/* Additional Information - Public */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="w-4 h-4" />
              Additional Information
            </CardTitle>
            <VisibilityBadge type="public" />
          </div>
        </CardHeader>
        <CardContent>
          <EditableNote
            value={userNotes?.additionalInfo}
            placeholder="Add any information you'd like mentors and admins to know about you that isn't captured in other sections..."
            onSave={(value) => onSaveNote?.('additionalInfo', value)}
            isEditable={isOwnProfile && viewerRole === 'user'}
          />
        </CardContent>
      </Card>

      {/* My Private Notes - User Only */}
      {viewerRole === 'user' && isOwnProfile && (
        <Card className="border-gray-200 bg-gray-50/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Lock className="w-4 h-4" />
                My Private Notes
              </CardTitle>
              <VisibilityBadge type="private" />
            </div>
          </CardHeader>
          <CardContent>
            <EditableNote
              value={userNotes?.privateNotes}
              placeholder="Personal reminders, goals, and notes only you can see..."
              onSave={(value) => onSaveNote?.('privateNotes', value)}
              isEditable={true}
            />
          </CardContent>
        </Card>
      )}

      {/* Admin Notes - Admins Only */}
      {viewerRole === 'admin' && (
        <Card className="border-purple-200 bg-purple-50/30">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="w-4 h-4 text-purple-600" />
                Admin Notes
              </CardTitle>
              <VisibilityBadge type="admin" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Existing Admin Notes */}
            {adminNotes.length > 0 && (
              <div className="space-y-3">
                {adminNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3 bg-white rounded-xl border border-purple-100"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={note.adminAvatar} />
                        <AvatarFallback className="text-xs">
                          {note.adminName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{note.adminName}</span>
                      <span className="text-xs text-gray-500">
                        {formatDate(note.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {note.content}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Admin Note */}
            <div className="pt-2 border-t">
              <EditableNote
                value=""
                placeholder="Add a staff note about this user..."
                onSave={(value) => onSaveNote?.('adminNote', value)}
                isEditable={true}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mentor Notes - Mentor View */}
      {viewerRole === 'mentor' && currentMentorId && (
        <Card className="border-amber-200 bg-amber-50/30">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageSquare className="w-4 h-4 text-amber-600" />
                My Notes
              </CardTitle>
              <VisibilityBadge type="mentor" />
            </div>
          </CardHeader>
          <CardContent>
            {/* Find this mentor's existing notes */}
            {(() => {
              const myNotes = mentorNotes.filter(
                (n) => n.mentorId === currentMentorId
              );

              return (
                <div className="space-y-4">
                  {myNotes.length > 0 && (
                    <div className="space-y-3">
                      {myNotes.map((note) => (
                        <div
                          key={note.id}
                          className="p-3 bg-white rounded-xl border border-amber-100"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-500">
                              {formatDate(note.createdAt)}
                            </span>
                            <button
                              className="p-1 hover:bg-amber-100 rounded"
                              onClick={() => toast.info('Edit note coming soon')}
                            >
                              <Pencil className="w-3 h-3 text-gray-500" />
                            </button>
                          </div>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {note.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className={myNotes.length > 0 ? 'pt-2 border-t' : ''}>
                    <EditableNote
                      value=""
                      placeholder="Add your private notes about this applicant..."
                      onSave={(value) => onSaveNote?.('mentorNote', value)}
                      isEditable={true}
                    />
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}

      {/* Admin Viewing All Mentor Notes */}
      {viewerRole === 'admin' && mentorNotes.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/30">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="w-4 h-4 text-amber-600" />
                Mentor Notes
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                {mentorNotes.length} note(s)
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {mentorNotes.map((note) => (
              <div
                key={note.id}
                className="p-3 bg-white rounded-xl border border-amber-100"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={note.mentorAvatar} />
                    <AvatarFallback className="text-xs">
                      {note.mentorName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{note.mentorName}</span>
                  <span className="text-xs text-gray-500">
                    {formatDate(note.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {note.content}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default NotesSection;
