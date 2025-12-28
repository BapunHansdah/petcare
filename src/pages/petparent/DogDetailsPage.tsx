import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash, FileText, Camera, Stethoscope, Eye } from 'lucide-react';
import { useGetDogsQuery, useGetDogRecordsQuery, useDeleteDogMutation, useDeleteDogRecordMutation } from '../../store/api';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useGetPetParentQuery } from '../../store/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { Tabs } from '../../components/ui/Tabs';
import { Modal } from '../../components/ui/Modal';
import { formatDate } from '../../lib/utils';

export function DogDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: petParent } = useGetPetParentQuery(user?.id || '');
  const { data: dogs = [] } = useGetDogsQuery(petParent?.id || '');
  const { data: records = [], isLoading: isLoadingRecords } = useGetDogRecordsQuery(id || '');
  const [deleteDog, { isLoading: isDeleting }] = useDeleteDogMutation();
  const [deleteDogRecord] = useDeleteDogRecordMutation();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteRecordModal, setDeleteRecordModal] = useState<{ isOpen: boolean; recordId: string | null }>({
    isOpen: false,
    recordId: null,
  });
  
  const dog = dogs.find(d => d.id === id);
  
  const handleDelete = async () => {
    if (!id) return;
    
    try {
      await deleteDog(id).unwrap();
      navigate('/pet-parent/dogs');
    } catch (error) {
      console.error('Error deleting dog:', error);
    }
  };
  
  const handleDeleteRecord = async () => {
    if (!deleteRecordModal.recordId) return;
    
    try {
      await deleteDogRecord(deleteRecordModal.recordId).unwrap();
      setDeleteRecordModal({ isOpen: false, recordId: null });
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };
  
  if (!dog) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Dog not found</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => navigate('/pet-parent/dogs')}
        >
          Back to Dogs
        </Button>
      </div>
    );
  }
  
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'records', label: `Medical Records (${records.length})` },
  ];
  
  const recordsByType = {
    image: records.filter(r => r.type === 'image'),
    xray: records.filter(r => r.type === 'xray'),
    prescription: records.filter(r => r.type === 'prescription'),
    document: records.filter(r => r.type === 'document'),
  };
  
  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'image': return <Camera size={20} className="text-blue-600" />;
      case 'xray': return <Stethoscope size={20} className="text-green-600" />;
      case 'prescription': return <FileText size={20} className="text-purple-600" />;
      default: return <FileText size={20} className="text-orange-600" />;
    }
  };
  
  const isImageFile = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url) || url.includes('data:image');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          className="p-0 h-auto"
          onClick={() => navigate('/pet-parent/dogs')}
        >
          <ArrowLeft size={16} />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{dog.name}</h1>
          <p className="text-gray-600">{dog.breed}</p>
        </div>
        <div className="flex gap-2">
          <Link to={`/pet-parent/dogs/${dog.id}/edit`}>
            <Button variant="outline" size="sm" icon={<Edit size={16} />}>
              Edit
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            icon={<Trash size={16} />}
            onClick={() => setShowDeleteModal(true)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Delete
          </Button>
        </div>
      </div>
      
      <Card>
        <Card.Header>
          <Tabs
            tabs={tabs}
            defaultTab="overview"
            onChange={setActiveTab}
          />
        </Card.Header>
        
        <Card.Content>
          {activeTab === 'overview' ? (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <Avatar
                  src={dog?.avatar_url || "https://ui-avatars.com/api/?name=" + dog.name}
                  name={dog.name}
                  size="lg"
                />
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{dog.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Age</p>
                    <p className="font-medium">{dog.age} years</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Breed</p>
                    <p className="font-medium">{dog.breed}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Weight</p>
                    <p className="font-medium">{dog.weight} kg</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="text-center">
                  <Card.Content className="p-4">
                    <Camera size={24} className="mx-auto text-blue-500 mb-2" />
                    <p className="text-2xl font-bold">{recordsByType.image.length}</p>
                    <p className="text-sm text-gray-500">Photos</p>
                  </Card.Content>
                </Card>
                
                <Card className="text-center">
                  <Card.Content className="p-4">
                    <Stethoscope size={24} className="mx-auto text-green-500 mb-2" />
                    <p className="text-2xl font-bold">{recordsByType.xray.length}</p>
                    <p className="text-sm text-gray-500">X-Rays</p>
                  </Card.Content>
                </Card>
                
                <Card className="text-center">
                  <Card.Content className="p-4">
                    <FileText size={24} className="mx-auto text-purple-500 mb-2" />
                    <p className="text-2xl font-bold">{recordsByType.prescription.length}</p>
                    <p className="text-sm text-gray-500">Prescriptions</p>
                  </Card.Content>
                </Card>
                
                <Card className="text-center">
                  <Card.Content className="p-4">
                    <FileText size={24} className="mx-auto text-orange-500 mb-2" />
                    <p className="text-2xl font-bold">{recordsByType.document.length}</p>
                    <p className="text-sm text-gray-500">Documents</p>
                  </Card.Content>
                </Card>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Medical Records</h3>
                <div className="flex gap-2">
                  <Link to={`/pet-parent/dogs/${dog.id}/records/new`}>
                    <Button size="sm" icon={<Plus size={16} />}>
                      Add Record
                    </Button>
                  </Link>
                </div>
              </div>
              
              {isLoadingRecords ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : records.length === 0 ? (
                <div className="text-center py-8">
                  <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No records yet</h3>
                  <p className="text-gray-500 mb-4">
                    Start by adding photos, X-rays, or prescriptions
                  </p>
                  <Link to={`/pet-parent/dogs/${dog.id}/records/new`}>
                    <Button icon={<Plus size={16} />}>
                      Add First Record
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {records.slice(0, 5).map((record) => (

                    <Card key={record.id}>
                      <Card.Content className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              {record?.file_url && isImageFile(record?.file_url) ? (
                                <img
                                  src={record.file_url || ''}
                                  alt={record.title}
                                  className="w-16 h-16 object-cover rounded-lg"
                                />
                              ) : (
                                <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                                  record.type === 'image' ? 'bg-blue-100' :
                                  record.type === 'xray' ? 'bg-green-100' :
                                  record.type === 'prescription' ? 'bg-purple-100' :
                                  'bg-orange-100'
                                }`}>
                                  {getRecordIcon(record.type)}
                                </div>
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium">{record.title}</h4>
                              <p className="text-sm text-gray-500">
                                {formatDate(record.date)} • {record.type}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Link to={`/pet-parent/dogs/${dog.id}/records/${record.id}/view`}>
                              <Button variant="outline" size="sm" icon={<Eye size={14} />}>
                                View
                              </Button>
                            </Link>
                            <Link to={`/pet-parent/dogs/${dog.id}/records/${record.id}/edit`}>
                              <Button variant="outline" size="sm" icon={<Edit size={14} />}>
                                Edit
                              </Button>
                            </Link>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              icon={<Trash size={14} />} 
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => setDeleteRecordModal({ isOpen: true, recordId: record.id })}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                        {record.notes && (
                          <p className="mt-3 text-sm text-gray-600">{record.notes}</p>
                        )}
                      </Card.Content>
                    </Card>
                  ))}
                  
                  {records.length > 5 && (
                    <div className="text-center">
                      <Link to={`/pet-parent/dogs/${dog.id}/records/gallery`}>
                        <Button variant="outline">
                          View All {records.length} Records
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </Card.Content>
      </Card>
      
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Dog"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete {dog.name}? This action cannot be undone and will also delete all associated records.
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
              isLoading={isDeleting}
              className="flex-1"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
      
      <Modal
        isOpen={deleteRecordModal.isOpen}
        onClose={() => setDeleteRecordModal({ isOpen: false, recordId: null })}
        title="Delete Record"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this medical record? This action cannot be undone.
          </p>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => setDeleteRecordModal({ isOpen: false, recordId: null })}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteRecord}
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