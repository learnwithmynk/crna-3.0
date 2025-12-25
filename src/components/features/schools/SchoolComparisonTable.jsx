/**
 * SchoolComparisonTable Component
 *
 * Side-by-side comparison view for selected schools.
 * Desktop: Table with columns
 * Mobile: Stacked cards
 */

import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  X,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Minus,
  DollarSign,
  GraduationCap,
  Calendar,
  Users,
  MapPin,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const COMPARISON_FIELDS = [
  { key: 'location', label: 'Location', icon: MapPin },
  { key: 'programType', label: 'Program Type', icon: null },
  { key: 'degree', label: 'Degree', icon: GraduationCap },
  { key: 'lengthMonths', label: 'Length', icon: Calendar },
  { key: 'tuitionInState', label: 'Tuition (In-State)', icon: DollarSign },
  { key: 'tuitionOutOfState', label: 'Tuition (Out-of-State)', icon: DollarSign },
  { key: 'minimumGpa', label: 'Min GPA', icon: null },
  { key: 'greRequired', label: 'GRE Required', icon: null },
  { key: 'ccrnRequired', label: 'CCRN Required', icon: null },
  { key: 'classSize', label: 'Class Size', icon: Users },
  { key: 'minimumExperience', label: 'Min Experience', icon: null },
  { key: 'acceptsNicu', label: 'Accepts NICU', icon: null },
  { key: 'acceptsPicu', label: 'Accepts PICU', icon: null },
  { key: 'acceptsEr', label: 'Accepts ER', icon: null },
  { key: 'ncePassRate', label: 'NCE Pass Rate', icon: null },
  { key: 'attritionRate', label: 'Attrition Rate', icon: null },
  { key: 'applicationDeadline', label: 'Deadline', icon: Calendar },
];

export function SchoolComparisonTable({
  schools = [],
  onRemove,
  onClear,
}) {
  if (schools.length === 0) {
    return null;
  }

  // Format field value for display
  const formatValue = (key, value, school) => {
    switch (key) {
      case 'location':
        return `${school.city}, ${school.state}`;
      case 'programType':
        return value?.replace('_', '-') || 'N/A';
      case 'degree':
        return value?.toUpperCase() || 'N/A';
      case 'lengthMonths':
        return value ? `${value} months` : 'N/A';
      case 'tuitionInState':
      case 'tuitionOutOfState':
        return value ? `$${(value / 1000).toFixed(0)}K` : 'N/A';
      case 'minimumGpa':
        return value || '3.0';
      case 'greRequired':
      case 'ccrnRequired':
      case 'acceptsNicu':
      case 'acceptsPicu':
      case 'acceptsEr':
        return value ? (
          <CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" />
        ) : (
          <XCircle className="w-4 h-4 text-gray-400 mx-auto" />
        );
      case 'classSize':
        return value || 'N/A';
      case 'minimumExperience':
        return value ? `${value}+ years` : '1+ years';
      case 'ncePassRate':
        return value ? `${value}%` : 'N/A';
      case 'attritionRate':
        return value !== null && value !== undefined ? `${value}%` : 'N/A';
      case 'applicationDeadline':
        if (!value) return 'N/A';
        const date = new Date(value);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      default:
        return value || 'N/A';
    }
  };

  // Find best value for highlighting (lowest tuition, highest pass rate, etc.)
  const getBestValue = (key, values) => {
    const numericValues = values.map((v, i) => ({
      value: v,
      index: i,
    })).filter(v => v.value !== null && v.value !== undefined && v.value !== 'N/A');

    if (numericValues.length === 0) return null;

    switch (key) {
      case 'tuitionInState':
      case 'tuitionOutOfState':
      case 'minimumGpa':
      case 'minimumExperience':
      case 'attritionRate':
        // Lower is better
        const minVal = Math.min(...numericValues.map(v => v.value));
        return numericValues.find(v => v.value === minVal)?.index;
      case 'ncePassRate':
      case 'classSize':
        // Higher is better
        const maxVal = Math.max(...numericValues.map(v => v.value));
        return numericValues.find(v => v.value === maxVal)?.index;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Compare Schools</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClear}>
          <X className="w-4 h-4 mr-1" />
          Clear
        </Button>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {/* Desktop Table View */}
        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2 font-medium text-gray-500 w-40">
                  Criteria
                </th>
                {schools.map((school) => (
                  <th key={school.id} className="text-center py-3 px-2 min-w-[180px]">
                    <div className="space-y-1">
                      <Link
                        to={`/schools/${school.id}`}
                        className="font-semibold hover:text-primary transition-colors"
                      >
                        {school.name}
                      </Link>
                      <div className={cn(
                        "inline-block px-2 py-0.5 rounded text-xs font-medium",
                        school.fitScore?.score >= 80 && "bg-green-100 text-green-700",
                        school.fitScore?.score >= 60 && school.fitScore?.score < 80 && "bg-yellow-100 text-yellow-700",
                        school.fitScore?.score < 60 && "bg-red-100 text-red-700",
                      )}>
                        {school.fitScore?.score || 0}% match
                      </div>
                      <button
                        onClick={() => onRemove(school.id)}
                        className="block mx-auto text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON_FIELDS.map((field) => {
                const values = schools.map(s => s[field.key]);
                const bestIndex = getBestValue(field.key, values);

                return (
                  <tr key={field.key} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-2 text-gray-600 flex items-center gap-2">
                      {field.icon && <field.icon className="w-4 h-4" />}
                      {field.label}
                    </td>
                    {schools.map((school, index) => (
                      <td
                        key={school.id}
                        className={cn(
                          "py-2 px-2 text-center",
                          bestIndex === index && "bg-green-50 font-medium"
                        )}
                      >
                        {formatValue(field.key, school[field.key], school)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {schools.map((school) => (
            <Card key={school.id} className="border">
              <CardHeader className="pb-2 flex flex-row items-start justify-between">
                <div>
                  <Link
                    to={`/schools/${school.id}`}
                    className="font-semibold hover:text-primary transition-colors"
                  >
                    {school.name}
                  </Link>
                  <p className="text-sm text-gray-500">
                    {school.city}, {school.state}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    className={cn(
                      school.fitScore?.score >= 80 && "bg-green-100 text-green-700",
                      school.fitScore?.score >= 60 && school.fitScore?.score < 80 && "bg-yellow-100 text-yellow-700",
                      school.fitScore?.score < 60 && "bg-red-100 text-red-700",
                    )}
                  >
                    {school.fitScore?.score || 0}%
                  </Badge>
                  <button
                    onClick={() => onRemove(school.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  {COMPARISON_FIELDS.slice(0, 10).map((field) => (
                    <div key={field.key}>
                      <dt className="text-gray-500 text-xs">{field.label}</dt>
                      <dd className="font-medium">
                        {typeof formatValue(field.key, school[field.key], school) === 'object'
                          ? (school[field.key] ? 'Yes' : 'No')
                          : formatValue(field.key, school[field.key], school)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default SchoolComparisonTable;
