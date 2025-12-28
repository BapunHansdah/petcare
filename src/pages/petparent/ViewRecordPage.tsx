import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Download, Edit, Trash, Calendar, FileText, Camera, Stethoscope, Share, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { useGetDogRecordsQuery, useDeleteDogRecordMutation, useGetDogsQuery } from '../../store/api';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useGetPetParentQuery } from '../../store/api';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { formatDate } from '../../lib/utils';

export function ViewRecordPage() {
  const { dogId, recordId } = useParams<{ dogId: string; recordId: string }>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: petParent } = useGetPetParentQuery(user?.id || '');
  const { data: dogs = [] } = useGetDogsQuery(petParent?.id || '');
  const { data: records = [] } = useGetDogRecordsQuery(dogId || '');
  const [deleteRecord] = useDeleteDogRecordMutation();
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imageZoom, setImageZoom] = useState(1);
  const [imageRotation, setImageRotation] = useState(0);
  
  const dog = dogs.find(d => d.id === dogId);
  const record = records.find(r => r.id === recordId);
  const currentIndex = records.findIndex(r => r.id === recordId);
  const previousRecord = currentIndex > 0 ? records[currentIndex - 1] : null;
  const nextRecord = currentIndex < records.length - 1 ? records[currentIndex + 1] : null;
  
  const handleDelete = async () => {
    if (!recordId) return;
    
    try {
      await deleteRecord(recordId).unwrap();
      navigate(`/pet-parent/dogs/${dogId}`);
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };
  
  const handleDownload = () => {
    if (record?.file_url) {
      const link = document.createElement('a');
      link.href = record.file_url;
      link.download = `${record.title}_${record.date}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  const handleShare = async () => {
    if (navigator.share && record) {
      try {
        await navigator.share({
          title: record.title,
          text: `Medical record for ${dog?.name}: ${record.title}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };
  
  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'image': return <Camera size={20} className="text-blue-600" />;
      case 'xray': return <Stethoscope size={20} className="text-green-600" />;
      case 'prescription': return <FileText size={20} className="text-purple-600" />;
      default: return <FileText size={20} className="text-orange-600" />;
    }
  };
  
  const getRecordTypeColor = (type: string) => {
    switch (type) {
      case 'image': return 'bg-blue-100 text-blue-800';
      case 'xray': return 'bg-green-100 text-green-800';
      case 'prescription': return 'bg-purple-100 text-purple-800';
      default: return 'bg-orange-100 text-orange-800';
    }
  };
  
  const isImageFile = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url) || url.includes('data:image');
  };
  
  if (!dog || !record) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Record not found</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => navigate(`/pet-parent/dogs/${dogId}`)}
        >
          Back to Dog Details
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="p-0 h-auto"
            onClick={() => navigate(`/pet-parent/dogs/${dogId}`)}
          >
            <ArrowLeft size={16} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{record.title}</h1>
            <p className="text-gray-600">{dog.name}'s Medical Record</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            icon={<Share size={16} />}
            onClick={handleShare}
          >
            Share
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={<Download size={16} />}
            onClick={handleDownload}
          >
            Download
          </Button>
        </div>
      </div>
      
      {/* Navigation */}
      <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
        <div>
          {previousRecord ? (
            <Link to={`/pet-parent/dogs/${dogId}/records/${previousRecord.id}/view`}>
              <Button variant="outline" size="sm">
                ← Previous
              </Button>
            </Link>
          ) : (
            <Button variant="outline" size="sm" disabled>
              ← Previous
            </Button>
          )}
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {currentIndex + 1} of {records.length} records
          </p>
        </div>
        
        <div>
          {nextRecord ? (
            <Link to={`/pet-parent/dogs/${dogId}/records/${nextRecord.id}/view`}>
              <Button variant="outline" size="sm">
                Next →
              </Button>
            </Link>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Next →
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card>
            <Card.Content className="p-0">
            { record.file_url && isImageFile(record.file_url) ? (
                <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                  {/* Image Controls */}
                  <div className="absolute top-6 right-6 z-10 flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setImageZoom(Math.max(0.5, imageZoom - 0.25))}
                      className="bg-white/90 backdrop-blur-sm"
                    >
                      <ZoomOut size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setImageZoom(Math.min(3, imageZoom + 0.25))}
                      className="bg-white/90 backdrop-blur-sm"
                    >
                      <ZoomIn size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setImageRotation((imageRotation + 90) % 360)}
                      className="bg-white/90 backdrop-blur-sm"
                    >
                      <RotateCw size={16} />
                    </Button>
                  </div>
                  
                  {/* Image */}
                  <div className="flex items-center justify-center min-h-[400px] p-4">
                    <img
                      src={record.file_url || ''}
                      alt={record.title}
                      className="max-w-full max-h-[600px] object-contain transition-transform duration-200"
                      style={{
                        transform: `scale(${imageZoom}) rotate(${imageRotation}deg)`,
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 px-4">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    {getRecordIcon(record.type)}
                  </div>
                  <h3 className="text-lg font-medium mb-2">{record.title}</h3>
                  <p className="text-gray-500 mb-4">Document file</p>
                  <Button onClick={handleDownload} icon={<Download size={16} />}>
                    Download File
                  </Button>
                </div>
              )}
            </Card.Content>
          </Card>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Record Details */}
          <Card>
            <Card.Header>
              <h3 className="font-medium">Record Details</h3>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <div className="flex items-center space-x-2 mt-1">
                  {getRecordIcon(record.type)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRecordTypeColor(record.type)}`}>
                    {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
                  </span>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="font-medium">{formatDate(record.date)}</span>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Dog</p>
                <p className="font-medium">{dog.name}</p>
              </div>
              
              {record.notes && (
                <div>
                  <p className="text-sm text-gray-500">Notes</p>
                  <p className="text-sm mt-1 p-3 bg-gray-50 rounded-lg">{record.notes}</p>
                </div>
              )}
            </Card.Content>
          </Card>
          
          {/* Actions */}
          <Card>
            <Card.Header>
              <h3 className="font-medium">Actions</h3>
            </Card.Header>
            <Card.Content className="space-y-3">
              <Link to={`/pet-parent/dogs/${dogId}/records/${recordId}/edit`}>
                <Button variant="outline" className="w-full" icon={<Edit size={16} />}>
                  Edit Record
                </Button>
              </Link>
              
              <Button
                variant="outline"
                className="w-full"
                icon={<Download size={16} />}
                onClick={handleDownload}
              >
                Download
              </Button>
              
              <Button
                variant="outline"
                className="w-full"
                icon={<Share size={16} />}
                onClick={handleShare}
              >
                Share
              </Button>
              
              <Button
                variant="danger"
                className="w-full"
                icon={<Trash size={16} />}
                onClick={() => setShowDeleteModal(true)}
              >
                Delete Record
              </Button>
            </Card.Content>
          </Card>
          
          {/* Related Records */}
          {records.length > 1 && (
            <Card>
              <Card.Header>
                <h3 className="font-medium">Other Records</h3>
              </Card.Header>
              <Card.Content>
                <div className="space-y-2">
                  {records
                    .filter(r => r.id !== recordId)
                    .slice(0, 3)
                    .map((relatedRecord) => (
                      <Link
                        key={relatedRecord.id}
                        to={`/pet-parent/dogs/${dogId}/records/${relatedRecord.id}/view`}
                        className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            relatedRecord.type === 'image' ? 'bg-blue-100' :
                            relatedRecord.type === 'xray' ? 'bg-green-100' :
                            relatedRecord.type === 'prescription' ? 'bg-purple-100' :
                            'bg-orange-100'
                          }`}>
                            {getRecordIcon(relatedRecord.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{relatedRecord.title}</p>
                            <p className="text-xs text-gray-500">{formatDate(relatedRecord.date)}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  
                  {records.length > 4 && (
                    <Link
                      to={`/pet-parent/dogs/${dogId}`}
                      className="block p-3 text-center text-sm text-pink-600 hover:text-pink-700 font-medium"
                    >
                      View all {records.length - 1} records
                    </Link>
                  )}
                </div>
              </Card.Content>
            </Card>
          )}
        </div>
      </div>
      
      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Record"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete "{record.title}"? This action cannot be undone.
          </p>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              className="flex-1"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}