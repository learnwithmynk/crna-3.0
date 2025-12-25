/**
 * SettingsTab
 *
 * Community settings - profanity word list management and archived forums.
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertTriangle,
  Plus,
  Trash2,
  Upload,
  Download,
  Search,
  X,
  Archive,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  Calendar,
  FileJson,
  Eye,
} from 'lucide-react';
import { useProfanityWords } from '@/hooks/useProfanityWords';
import { useArchivedForums } from '@/hooks/useArchivedForums';

export function SettingsTab() {
  const {
    words,
    isLoading,
    wordCount,
    addWord,
    addWords,
    removeWord,
    removeWords,
    exportWords,
    importWords,
  } = useProfanityWords();

  const {
    archivedForums,
    isLoading: archivesLoading,
    stats: archiveStats,
    exportArchive,
    exportAllArchives,
    deleteArchive,
  } = useArchivedForums();

  const [newWord, setNewWord] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWords, setSelectedWords] = useState([]);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Archived forums state
  const [expandedArchive, setExpandedArchive] = useState(null);
  const [viewArchiveDialogOpen, setViewArchiveDialogOpen] = useState(false);
  const [selectedArchiveForView, setSelectedArchiveForView] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [archiveToDelete, setArchiveToDelete] = useState(null);

  // Filter words by search
  const filteredWords = words.filter(w =>
    w.word.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle add word
  const handleAddWord = async (e) => {
    e.preventDefault();
    if (!newWord.trim()) return;

    setError('');
    try {
      await addWord(newWord.trim());
      setNewWord('');
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle remove word
  const handleRemoveWord = async (word) => {
    await removeWord(word);
    setSelectedWords(prev => prev.filter(w => w !== word));
  };

  // Handle bulk remove
  const handleBulkRemove = async () => {
    await removeWords(selectedWords);
    setSelectedWords([]);
  };

  // Toggle word selection
  const toggleWordSelection = (word) => {
    setSelectedWords(prev =>
      prev.includes(word)
        ? prev.filter(w => w !== word)
        : [...prev, word]
    );
  };

  // Handle export
  const handleExport = () => {
    const text = exportWords();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'profanity-words.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle import
  const handleImport = async () => {
    if (!importText.trim()) return;

    setIsProcessing(true);
    try {
      await importWords(importText);
      setImportDialogOpen(false);
      setImportText('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle export single archive
  const handleExportArchive = (archive) => {
    const json = exportArchive(archive.id);
    if (!json) return;

    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `archived-forum-${archive.school_name.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle export all archives
  const handleExportAllArchives = () => {
    const json = exportAllArchives();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `all-archived-forums-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle delete archive
  const handleDeleteArchive = async () => {
    if (!archiveToDelete) return;
    await deleteArchive(archiveToDelete.id);
    setDeleteConfirmOpen(false);
    setArchiveToDelete(null);
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profanity Filter Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Profanity Filter
              </CardTitle>
              <CardDescription>
                Manage the list of words that trigger content warnings.
                {wordCount > 0 && ` ${wordCount} words configured.`}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={() => setImportDialogOpen(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Word Form */}
          <form onSubmit={handleAddWord} className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Add a word to filter..."
                value={newWord}
                onChange={(e) => {
                  setNewWord(e.target.value);
                  setError('');
                }}
              />
              {error && (
                <p className="text-sm text-red-500 mt-1">{error}</p>
              )}
            </div>
            <Button type="submit" disabled={!newWord.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </form>

          {/* Search and Bulk Actions */}
          <div className="flex items-center justify-between">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search words..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {selectedWords.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selectedWords.length} selected
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkRemove}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove Selected
                </Button>
              </div>
            )}
          </div>

          {/* Word List */}
          {filteredWords.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? (
                <p>No words matching "{searchQuery}"</p>
              ) : (
                <>
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No profanity words configured.</p>
                  <p className="text-sm">Add words above to filter content.</p>
                </>
              )}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto p-2 border rounded-lg bg-muted/30">
              {filteredWords.map((word) => (
                <Badge
                  key={word.id}
                  variant={selectedWords.includes(word.word) ? 'default' : 'secondary'}
                  className="cursor-pointer select-none group pr-1"
                  onClick={() => toggleWordSelection(word.word)}
                >
                  {word.word}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveWord(word.word);
                    }}
                    className="ml-1 hover:bg-red-500 hover:text-white rounded-full p-0.5 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="text-sm text-muted-foreground border-t pt-4">
            <p>
              <strong>{wordCount}</strong> total words •{' '}
              <strong>{filteredWords.length}</strong> shown
            </p>
            <p className="mt-1">
              Posts containing these words will show a warning before submission.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Rate Limits Info (read-only for now) */}
      <Card>
        <CardHeader>
          <CardTitle>Rate Limits</CardTitle>
          <CardDescription>
            Anti-spam rate limits for posting. Currently configured in the database.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="p-4 bg-muted rounded-xl">
              <div className="text-2xl font-bold">10</div>
              <div className="text-sm text-muted-foreground">Topics per day</div>
            </div>
            <div className="p-4 bg-muted rounded-xl">
              <div className="text-2xl font-bold">50</div>
              <div className="text-sm text-muted-foreground">Replies per day</div>
            </div>
            <div className="p-4 bg-muted rounded-xl">
              <div className="text-2xl font-bold">30s</div>
              <div className="text-sm text-muted-foreground">Cooldown between posts</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            To change these limits, update the <code>check_post_rate_limit</code> function in the database.
          </p>
        </CardContent>
      </Card>

      {/* Archived Forums Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Archive className="h-5 w-5" />
                Archived Forums
              </CardTitle>
              <CardDescription>
                Forum content preserved when schools are deleted.
                {archiveStats.totalArchives > 0 && (
                  <> {archiveStats.totalArchives} archive{archiveStats.totalArchives !== 1 ? 's' : ''} •{' '}
                  {archiveStats.totalTopics} topics • {archiveStats.totalReplies} replies</>
                )}
              </CardDescription>
            </div>
            {archivedForums.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleExportAllArchives}>
                <Download className="h-4 w-4 mr-2" />
                Export All
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {archivesLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
            </div>
          ) : archivedForums.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Archive className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No archived forums.</p>
              <p className="text-sm">When a school is deleted, its forum content will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {archivedForums.map((archive) => (
                <div
                  key={archive.id}
                  className="border rounded-xl overflow-hidden"
                >
                  {/* Archive Header */}
                  <div
                    className="flex items-center justify-between p-4 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => setExpandedArchive(expandedArchive === archive.id ? null : archive.id)}
                  >
                    <div className="flex items-center gap-3">
                      {expandedArchive === archive.id ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <div>
                        <div className="font-medium">{archive.school_name}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(archive.archived_at)}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {archive.topic_count} topics, {archive.reply_count} replies
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedArchiveForView(archive);
                          setViewArchiveDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleExportArchive(archive)}
                      >
                        <FileJson className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          setArchiveToDelete(archive);
                          setDeleteConfirmOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {expandedArchive === archive.id && (
                    <div className="p-4 border-t bg-white">
                      <div className="text-sm text-muted-foreground mb-3">
                        <strong>Preview:</strong> {archive.content_preview || 'No content'}
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Topics ({archive.topic_count}):</div>
                        <ul className="text-sm space-y-1 ml-4">
                          {archive.topics_data?.slice(0, 5).map((topic, idx) => (
                            <li key={idx} className="text-muted-foreground">
                              • {topic.title} ({topic.replies?.length || 0} replies)
                            </li>
                          ))}
                          {archive.topics_data?.length > 5 && (
                            <li className="text-muted-foreground italic">
                              ...and {archive.topics_data.length - 5} more topics
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Profanity Words</DialogTitle>
            <DialogDescription>
              Paste words to add (one per line or comma-separated).
              Duplicates will be skipped.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Textarea
              placeholder="word1&#10;word2&#10;word3&#10;&#10;or: word1, word2, word3"
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              rows={10}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={!importText.trim() || isProcessing}
            >
              <Upload className="h-4 w-4 mr-2" />
              {isProcessing ? 'Importing...' : 'Import'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Archive Dialog */}
      <Dialog open={viewArchiveDialogOpen} onOpenChange={setViewArchiveDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Archive className="h-5 w-5" />
              {selectedArchiveForView?.school_name}
            </DialogTitle>
            <DialogDescription>
              Archived on {selectedArchiveForView && formatDate(selectedArchiveForView.archived_at)}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-4">
            {selectedArchiveForView?.topics_data?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No topics in this archive.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedArchiveForView?.topics_data?.map((topic, topicIdx) => (
                  <div key={topicIdx} className="border rounded-xl p-4">
                    <div className="font-medium text-lg mb-2">{topic.title}</div>
                    <div
                      className="text-sm text-muted-foreground mb-3 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: topic.content }}
                    />
                    <div className="text-xs text-muted-foreground mb-3">
                      Posted: {formatDate(topic.created_at)} • Views: {topic.view_count || 0}
                      {topic.is_sticky && <Badge variant="secondary" className="ml-2">Sticky</Badge>}
                    </div>

                    {/* Replies */}
                    {topic.replies?.length > 0 && (
                      <div className="mt-3 pt-3 border-t space-y-3">
                        <div className="text-sm font-medium">
                          {topic.replies.length} {topic.replies.length === 1 ? 'Reply' : 'Replies'}
                        </div>
                        {topic.replies.map((reply, replyIdx) => (
                          <div
                            key={replyIdx}
                            className={`text-sm p-3 bg-muted/30 rounded ${
                              reply.parent_reply_id ? 'ml-6 border-l-2 border-primary/20' : ''
                            }`}
                          >
                            <div
                              className="prose prose-sm max-w-none"
                              dangerouslySetInnerHTML={{ __html: reply.content }}
                            />
                            <div className="text-xs text-muted-foreground mt-2">
                              {formatDate(reply.created_at)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => selectedArchiveForView && handleExportArchive(selectedArchiveForView)}
            >
              <FileJson className="h-4 w-4 mr-2" />
              Export JSON
            </Button>
            <Button onClick={() => setViewArchiveDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Delete Archive Permanently?
            </DialogTitle>
            <DialogDescription>
              This will permanently delete the archived content for{' '}
              <strong>{archiveToDelete?.school_name}</strong>.
              This includes {archiveToDelete?.topic_count || 0} topics and{' '}
              {archiveToDelete?.reply_count || 0} replies.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-800">
              <strong>Warning:</strong> This action cannot be undone.
              Consider exporting the archive first if you want to keep a backup.
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteArchive}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SettingsTab;
