import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Plus, Bell, TrendingUp } from 'lucide-react';
import { useGetPetParentQuery, useGetDogsQuery, useGetRemindersQuery } from '../../store/api';
import { RootState } from '../../store';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';

export function PetParentDashboard() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: petParent, isLoading: isLoadingPetParent } = useGetPetParentQuery(user?.id || '');
  const { data: dogs = [], isLoading: isLoadingDogs } = useGetDogsQuery(petParent?.id || '');
  const { data: reminders = [], isLoading: isLoadingReminders } = useGetRemindersQuery(petParent?.id || '');
  
  const upcomingReminders = reminders
    .filter(reminder => !reminder.is_completed && new Date(reminder.reminder_date) >= new Date())
    .slice(0, 3);
  
  if (isLoadingPetParent) {
    return (
      <div className="space-y-4">
        <div className="w-48 h-12 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {petParent?.name}!</h1>
          <p className="text-gray-600">Manage your pets' health and wellness</p>
        </div>
        
        <Link to="/pet-parent/dogs/new">
          <Button icon={<Plus size={16} />}>
            Add New Dog
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <Card>
          <Card.Header className="flex justify-between items-center">
            <h2>My Dogs</h2>
            <span className="bg-pink-100 text-pink-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {dogs.length}
            </span>
          </Card.Header>
          <Card.Content>
            {isLoadingDogs ? (
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-3 w-24 mt-1 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : dogs.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-500">No dogs added yet</p>
                <Link to="/pet-parent/dogs/new">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                  >
                    Add your first dog
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {dogs.slice(0, 3).map((dog) => (
                  <Link key={dog.id} to={`/pet-parent/dogs/${dog.id}`}>
                    <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <Avatar
                        src={dog.avatar_url || "https://ui-avatars.com/api/?name=" + dog.name}
                        name={dog.name}
                        size="sm"
                      />
                      <div>
                        <p className="font-medium">{dog.name}</p>
                        <p className="text-xs text-gray-500">{dog.breed} • {dog.age} years</p>
                      </div>
                    </div>
                  </Link>
                ))}
                {dogs.length > 3 && (
                  <Link to="/pet-parent/dogs">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-pink-600"
                    >
                      View all dogs
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </Card.Content>
        </Card>
        
        <Card>
          <Card.Header className="flex justify-between items-center">
            <h2>Upcoming Reminders</h2>
            <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {upcomingReminders.length}
            </span>
          </Card.Header>
          <Card.Content>
            {isLoadingReminders ? (
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded bg-gray-200 animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-3 w-24 mt-1 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : upcomingReminders.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-500">No upcoming reminders</p>
                <Link to="/pet-parent/reminders">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                  >
                    Set a reminder
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingReminders.map((reminder) => (
                  <div key={reminder.id} className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded bg-amber-100 flex items-center justify-center">
                      <Bell size={14} className="text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{reminder.title}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(reminder.reminder_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                <Link to="/pet-parent/reminders">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-amber-600"
                  >
                    View all reminders
                  </Button>
                </Link>
              </div>
            )}
          </Card.Content>
        </Card>
        
        <Card>
          <Card.Header className="flex justify-between items-center">
            <h2>Quick Stats</h2>
            <TrendingUp size={16} className="text-green-600" />
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Dogs</span>
                <span className="font-semibold">{dogs.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Reminders</span>
                <span className="font-semibold">{upcomingReminders.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">This Month</span>
                <span className="font-semibold text-green-600">All Good!</span>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
      
      <Card>
        <Card.Header>
          <h2>Recent Activity</h2>
        </Card.Header>
        <Card.Content>
          <div className="text-center py-8">
            <p className="text-gray-500">No recent activity</p>
            <p className="text-sm text-gray-400 mt-1">
              Start by adding your first dog or setting up reminders
            </p>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}