import  { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Grid, List, Search, Plus, Calendar, Camera, FileText, Stethoscope } from 'lucide-react';
import { useGetDogRecordsQuery, useGetDogsQuery } from '../../store/api';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useGetPetParentQuery } from '../../store/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card } from '../../components/ui/Card';
import { Tabs } from '../../components/ui/Tabs';
import { formatDate } from '../../lib/utils';

export function RecordsGalleryPage() {
  const { dogId } = useParams<{ dogId: string }>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: petParent } = useGetPetParentQuery(user?.id || '');
  const { data: dogs = [] } = useGetDogsQuery(petParent?.id || '');
  const { data: records = [], isLoading } = useGetDogRecordsQuery(dogId || '');
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');
  
  const dog = dogs.find(d => d.id === dogId);
  
  const filteredRecords = records
    .filter(record => {
      const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           record.notes?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || record.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date_desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date_asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'title_asc':
          return a.title.localeCompare(b.title);
        case 'title_desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });
  
  const recordsByType = {
    all: records,
    image: records.filter(r => r.type === 'image'),
    xray: records.filter(r => r.type === 'xray'),
    prescription: records.filter(r => r.type === 'prescription'),
    document: records.filter(r => r.type === 'document'),
  };
  
  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'image': return <Camera size={16} className="text-blue-600" />;
      case 'xray': return <Stethoscope size={16} className="text-green-600" />;
      case 'prescription': return <FileText size={16} className="text-purple-600" />;
      default: return <FileText size={16} className="text-orange-600" />;
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
  
  const tabs = [
    { id: 'all', label: `All (${recordsByType.all.length})` },
    { id: 'image', label: `Photos (${recordsByType.image.length})` },
    { id: 'xray', label: `X-Rays (${recordsByType.xray.length})` },
    { id: 'prescription', label: `Prescriptions (${recordsByType.prescription.length})` },
    { id: 'document', label: `Documents (${recordsByType.document.length})` },
  ];
  
  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'image', label: 'Photos' },
    { value: 'xray', label: 'X-Rays' },
    { value: 'prescription', label: 'Prescriptions' },
    { value: 'document', label: 'Documents' },
  ];
  
  const sortOptions = [
    { value: 'date_desc', label: 'Newest First' },
    { value: 'date_asc', label: 'Oldest First' },
    { value: 'title_asc', label: 'Title A-Z' },
    { value: 'title_desc', label: 'Title Z-A' },
  ];
  
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
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
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
            <h1 className="text-2xl font-bold">{dog.name}'s Medical Records</h1>
            <p className="text-gray-600">View and manage all medical records</p>
          </div>
        </div>
        
        <Link to={`/pet-parent/dogs/${dogId}/records/new`}>
          <Button icon={<Plus size={16} />}>
            Add Record
          </Button>
        </Link>
      </div>
      
      {/* Filters and Controls */}
      <Card>
        <Card.Content className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Input
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search size={16} />}
                />
              </div>
              
              <Select
                id="filterType"
                options={typeOptions}
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              />
              
              <Select
                id="sortBy"
                options={sortOptions}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                icon={<Grid size={16} />}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                icon={<List size={16} />}
              >
                List
              </Button>
            </div>
          </div>
        </Card.Content>
      </Card>
      
      {/* Tabs */}
      <Card>
        <Card.Header>
          <Tabs
            tabs={tabs}
            defaultTab="all"
            onChange={setFilterType}
          />
        </Card.Header>
        
        <Card.Content>
          {isLoading ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className={viewMode === 'grid' ? 'h-64 bg-gray-200 rounded animate-pulse' : 'h-20 bg-gray-200 rounded animate-pulse'} />
              ))}
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No records found' : 'No records yet'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm 
                  ? 'Try adjusting your search terms or filters'
                  : 'Start by adding your first medical record'
                }
              </p>
              {!searchTerm && (
                <Link to={`/pet-parent/dogs/${dogId}/records/new`}>
                  <Button icon={<Plus size={16} />}>
                    Add First Record
                  </Button>
                </Link>
              )}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRecords.map((record) => (
                <Link
                  key={record.id}
                  to={`/pet-parent/dogs/${dogId}/records/${record.id}/view`}
                  className="group"
                >
                  <Card className="transition-all hover:shadow-md cursor-pointer">
                    <Card.Content className="p-0">
                      <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden relative">
                        {record.file_url && isImageFile(record.file_url) ? (
                          <img
                            src={record.file_url || ''}
                            alt={record.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-md">
                              {getRecordIcon(record.type)}
                            </div>
                          </div>
                        )}
                        
                        <div className="absolute top-2 right-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRecordTypeColor(record.type)}`}>
                            {record.type}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-medium truncate group-hover:text-pink-600 transition-colors">
                          {record.title}
                        </h3>
                        <div className="flex items-center space-x-1 mt-1 text-sm text-gray-500">
                          <Calendar size={14} />
                          <span>{formatDate(record.date)}</span>
                        </div>
                        {record.notes && (
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                            {record.notes}
                          </p>
                        )}
                      </div>
                    </Card.Content>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRecords.map((record) => (
                <Link
                  key={record.id}
                  to={`/pet-parent/dogs/${dogId}/records/${record.id}/view`}
                  className="group"
                >
                  <Card className="transition-all hover:shadow-md cursor-pointer">
                    <Card.Content className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {record.file_url && isImageFile(record.file_url) ? (
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
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium truncate group-hover:text-pink-600 transition-colors">
                              {record.title}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRecordTypeColor(record.type)}`}>
                              {record.type}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-1 text-sm text-gray-500 mb-1">
                            <Calendar size={14} />
                            <span>{formatDate(record.date)}</span>
                          </div>
                          
                          {record.notes && (
                            <p className="text-sm text-gray-600 line-clamp-1">
                              {record.notes}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex-shrink-0">
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            View →
                          </Button>
                        </div>
                      </div>
                    </Card.Content>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </Card.Content>
      </Card>
    </div>
  );
}