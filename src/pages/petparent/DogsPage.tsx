import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Plus, Search, Heart } from 'lucide-react';
import { useGetPetParentQuery, useGetDogsQuery } from '../../store/api';
import { RootState } from '../../store';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Avatar } from '../../components/ui/Avatar';

export function DogsPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: petParent } = useGetPetParentQuery(user?.id || '');
  const { data: dogs = [], isLoading } = useGetDogsQuery(petParent?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredDogs = dogs.filter(dog =>
    dog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dog.breed.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Dogs</h1>
          <p className="text-gray-600">Manage your furry family members</p>
        </div>
        
        <Link to="/pet-parent/dogs/new">
          <Button icon={<Plus size={16} />}>
            Add New Dog
          </Button>
        </Link>
      </div>
      
      <div className="bg-white/70 backdrop-blur-xl border border-white/20 shadow-xl shadow-black/5 rounded-2xl border-gray-100 overflow-hidden">
        <div className="p-4 bg-white border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-sm text-gray-500">
              {filteredDogs.length} {filteredDogs.length === 1 ? 'dog' : 'dogs'}
            </div>
            
            <div className="relative w-full sm:w-64">
              <Input
                placeholder="Search dogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search size={16} />}
              />
            </div>
          </div>
        </div>
        
        <div className="p-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-200 rounded-2xl h-64 animate-pulse"></div>
              ))}
            </div>
          ) : filteredDogs.length === 0 ? (
            <div className="text-center py-12">
              <Heart size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No dogs found' : 'No dogs added yet'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'Start by adding your first furry family member'
                }
              </p>
              {!searchTerm && (
                <Link to="/pet-parent/dogs/new">
                  <Button icon={<Plus size={16} />}>
                    Add Your First Dog
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1   md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDogs.map((dog) => (
                <Link key={dog.id} to={`/pet-parent/dogs/${dog.id}`}>
                  <Card className="transition-all hover:shadow-md cursor-pointer">
                    <Card.Content className="p-6">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <Avatar
                          src={dog.avatar_url || "https://ui-avatars.com/api/?name=" + dog.name}
                          name={dog.name}
                          size="lg"
                        />
                        
                        <div>
                          <h3 className="font-semibold text-lg">{dog.name}</h3>
                          <p className="text-gray-600">{dog.breed}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 w-full text-sm">
                          <div className="text-center">
                            <p className="text-gray-500">Age</p>
                            <p className="font-medium">{dog.age} years</p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-500">Weight</p>
                            <p className="font-medium">{dog.weight} kg</p>
                          </div>
                        </div>
                      </div>
                    </Card.Content>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}