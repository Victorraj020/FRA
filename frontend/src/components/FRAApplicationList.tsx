import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Search, 
  Filter, 
  Edit, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye,
  Download,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { FRAApplication } from './FRAApplicationForm';

interface FRAApplicationListProps {
  applications: FRAApplication[];
  onEdit?: (application: FRAApplication) => void;
  onDelete?: (applicationId: string) => void;
  onStatusChange?: (applicationId: string, status: FRAApplication['status'], notes?: string) => void;
  onView?: (application: FRAApplication) => void;
}

const FRAApplicationList: React.FC<FRAApplicationListProps> = ({
  applications,
  onEdit,
  onDelete,
  onStatusChange,
  onView
}) => {
  const { userPermissions, userRole } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const getStatusColor = (status: FRAApplication['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: FRAApplication['status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'under_review':
        return <Clock className="w-4 h-4" />;
      case 'submitted':
        return <FileText className="w-4 h-4" />;
      case 'draft':
        return <Edit className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: FRAApplication['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || app.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const canEdit = (application: FRAApplication) => {
    if (userPermissions.canEditClaims) return true;
    if (application.status === 'draft' && userRole === 'normal') return true;
    return false;
  };

  const canApprove = (application: FRAApplication) => {
    return userPermissions.canApproveClaims && application.status === 'submitted';
  };

  const canDelete = (application: FRAApplication) => {
    return userPermissions.canEditClaims || (application.status === 'draft' && userRole === 'normal');
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="under_review">Under Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No applications found matching your criteria.</p>
            </CardContent>
          </Card>
        ) : (
          filteredApplications.map((application) => (
            <Card key={application.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{application.applicantName}</CardTitle>
                    <CardDescription>
                      {application.village}, {application.district}, {application.state}
                    </CardDescription>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>ID: {application.id}</span>
                      <span>•</span>
                      <span>{application.landArea}</span>
                      <span>•</span>
                      <span className="capitalize">{application.landType}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(application.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(application.status)}
                        {application.status.replace('_', ' ').toUpperCase()}
                      </div>
                    </Badge>
                    <Badge className={getPriorityColor(application.priority)}>
                      {application.priority.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-1">Claim Type</h4>
                    <p className="text-sm capitalize">
                      {application.claimType.replace('_', ' ')}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-1">Description</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {application.description}
                    </p>
                  </div>

                  {application.submittedAt && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-1">Submitted</h4>
                      <p className="text-sm text-gray-600">
                        {application.submittedAt.toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  {application.reviewedBy && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-1">Reviewed By</h4>
                      <p className="text-sm text-gray-600">{application.reviewedBy}</p>
                    </div>
                  )}

                  {application.reviewNotes && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-1">Review Notes</h4>
                      <p className="text-sm text-gray-600">{application.reviewNotes}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {application.supportingDocuments.length} document(s)
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {onView && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onView(application)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      )}
                      
                      {canEdit(application) && onEdit && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(application)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      )}
                      
                      {canApprove(application) && onStatusChange && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => onStatusChange(application.id, 'approved')}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500 text-red-500 hover:bg-red-50"
                            onClick={() => onStatusChange(application.id, 'rejected')}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                      
                      {canDelete(application) && onDelete && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:bg-red-50"
                          onClick={() => onDelete(application.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default FRAApplicationList;
