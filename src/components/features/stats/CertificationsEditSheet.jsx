/**
 * Certifications Edit Sheet
 *
 * Sheet component for editing certifications (CCRN, BLS, ACLS, etc.).
 */

import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X, CheckCircle2 } from 'lucide-react';
import { CERTIFICATION_TYPES, CERTIFICATION_STATUSES } from '@/lib/constants/stats';

export function CertificationsEditSheet({ open, onOpenChange, initialValues, onSave }) {
  const [certifications, setCertifications] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCert, setNewCert] = useState({
    type: '',
    status: 'planned',
    earnedDate: '',
    expiresDate: '',
  });

  useEffect(() => {
    if (initialValues?.certifications) {
      setCertifications(initialValues.certifications);
    }
  }, [initialValues, open]);

  const handleAddCertification = () => {
    if (!newCert.type) return;

    setCertifications(prev => [
      ...prev,
      {
        ...newCert,
        id: Date.now().toString(),
      },
    ]);
    setNewCert({ type: '', status: 'planned', earnedDate: '', expiresDate: '' });
    setShowAddForm(false);
  };

  const handleRemoveCertification = (id) => {
    setCertifications(prev => prev.filter(c => c.id !== id && c.type !== id));
  };

  const handleSave = () => {
    onSave?.({ certifications });
    onOpenChange(false);
  };

  const getCertLabel = (type) => {
    return CERTIFICATION_TYPES.find(c => c.value === type)?.label || type.toUpperCase();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Certifications</SheetTitle>
          <SheetDescription>
            Track your nursing certifications. CCRN is highly recommended for CRNA programs.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 py-4">
          {/* Current Certifications */}
          <div className="space-y-2">
            <Label>Your Certifications</Label>
            {certifications.length === 0 ? (
              <p className="text-sm text-gray-500 py-2">No certifications added yet</p>
            ) : (
              <div className="space-y-2">
                {certifications.map((cert, index) => (
                  <div
                    key={cert.id || cert.type}
                    className="flex items-center justify-between p-3 border rounded-xl bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      {cert.status === 'passed' && (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      )}
                      <div>
                        <span className="font-medium text-sm">{getCertLabel(cert.type)}</span>
                        <Badge
                          variant="secondary"
                          className={`ml-2 text-xs ${
                            cert.status === 'passed' ? 'bg-green-100 text-green-700' :
                            cert.status === 'expired' ? 'bg-red-100 text-red-700' :
                            cert.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {CERTIFICATION_STATUSES.find(s => s.value === cert.status)?.label || cert.status}
                        </Badge>
                        {cert.expiresDate && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            Expires: {new Date(cert.expiresDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveCertification(cert.id || cert.type)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add New Form */}
          {showAddForm ? (
            <div className="space-y-3 p-3 border rounded-xl bg-white">
              <div className="space-y-2">
                <Label>Certification Type</Label>
                <Select
                  value={newCert.type}
                  onValueChange={(value) => setNewCert(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select certification" />
                  </SelectTrigger>
                  <SelectContent>
                    {CERTIFICATION_TYPES.map(cert => (
                      <SelectItem key={cert.value} value={cert.value}>
                        {cert.label} - {cert.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={newCert.status}
                  onValueChange={(value) => setNewCert(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CERTIFICATION_STATUSES.map(status => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {newCert.status === 'passed' && (
                <>
                  <div className="space-y-2">
                    <Label>Earned Date</Label>
                    <Input
                      type="date"
                      value={newCert.earnedDate}
                      onChange={(e) => setNewCert(prev => ({ ...prev, earnedDate: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Expiration Date</Label>
                    <Input
                      type="date"
                      value={newCert.expiresDate}
                      onChange={(e) => setNewCert(prev => ({ ...prev, expiresDate: e.target.value }))}
                    />
                  </div>
                </>
              )}

              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddCertification}>
                  Add
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddForm(true)}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Certification
            </Button>
          )}

          <div className="p-3 bg-yellow-50 rounded-xl">
            <p className="text-sm text-yellow-800">
              <strong>Pro tip:</strong> CCRN certification demonstrates expertise in critical care
              and is required or preferred by most CRNA programs.
            </p>
          </div>
        </div>

        <SheetFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default CertificationsEditSheet;
