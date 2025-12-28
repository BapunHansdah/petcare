import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Plus, Search, Bell, Calendar, Clock, Edit, Trash, Check } from 'lucide-react';
import { useGetPetParentQuery, useGetRemindersQuery, useUpdateReminderMutation, useDeleteReminderMutation } from '../../store/api';
import { RootState } from '../../store';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Tabs } from '../../components/ui/Tabs';
import { Modal } from '../../components/ui/Modal';
import { formatDate } from '../../lib/utils';

export function RemindersPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: petParent } = useGetPetParentQuery(user?.id || '');
  const { data: reminders = [], isLoading } = useGetRemindersQuery(petParent?.id || '');
  const [updateReminder] = useUpdateReminderMutation();
  const [deleteReminder] = useDeleteReminderMutation();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; reminderId: string | null }>({
    isOpen: false,
    reminderId: null,
  });
  
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  
  const filteredReminders = reminders.filter(reminder => {
    const matchesSearch = reminder.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reminder.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'upcoming') {
      return matchesSearch && !reminder.is_completed && reminder.reminder_date >= today;
    } else if (activeTab === 'overdue') {
      return matchesSearch && !reminder.is_completed && reminder.reminder_date < today;
    } else if (activeTab === 'completed') {
      return matchesSearch && reminder.is_completed;
    }
    
    return matchesSearch;
  });
  
  const handleCompleteReminder = async (reminderId: string) => {
    try {
      await updateReminder({
        id: reminderId,
        updates: { is_completed: true },
      }).unwrap();
    } catch (error) {
      console.error('Error completing reminder:', error);
    }
  };
  
  const handleDeleteReminder = async () => {
    if (!deleteModal.reminderId) return;
    
    try {
      await deleteReminder(deleteModal.reminderId).unwrap();
      setDeleteModal({ isOpen: false, reminderId: null });
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'food': return '🍽️';
      case 'tablet': return '💊';
      case 'vet_visit': return '🏥';
      case 'vaccination': return '💉';
      default: return '📋';
    }
  };
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'food': return 'bg-orange-100 text-orange-800';
      case 'tablet': return 'bg-blue-100 text-blue-800';
      case 'vet_visit': return 'bg-green-100 text-green-800';
      case 'vaccination': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const tabs = [
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'overdue', label: 'Overdue' },
    { id: 'completed', label: 'Completed' },
    { id: 'all', label: 'All' },
  ];
  
  const upcomingCount = reminders.filter(r => !r.is_completed && r.reminder_date >= today).length;
  const overdueCount = reminders.filter(r => !r.is_completed && r.reminder_date < today).length;
  const completedCount = reminders.filter(r => r.is_completed).length;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reminders</h1>
          <p className="text-gray-600">Manage your pet care reminders</p>
        </div>
        
        <Link to="/pet-parent/reminders/new">
          <Button icon={<Plus size={16} />}>
            Add Reminder
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card  className="text-center">
          <Card.Content className="p-4">
            <Bell size={24} className="mx-auto text-blue-500 mb-2" />
            <p className="text-2xl font-bold">{upcomingCount}</p>
            <p className="text-sm text-gray-500">Upcoming</p>
          </Card.Content>
        </Card>
        
        <Card className="text-center">
          <Card.Content className="p-4">
            <Clock size={24} className="mx-auto text-red-500 mb-2" />
            <p className="text-2xl font-bold">{overdueCount}</p>
            <p className="text-sm text-gray-500">Overdue</p>
          </Card.Content>
        </Card>
        
        <Card className="text-center">
          <Card.Content className="p-4">
            <Check size={24} className="mx-auto text-green-500 mb-2" />
            <p className="text-2xl font-bold">{completedCount}</p>
            <p className="text-sm text-gray-500">Completed</p>
          </Card.Content>
        </Card>
        
        <Card className="text-center">
          <Card.Content className="p-4">
            <Calendar size={24} className="mx-auto text-purple-500 mb-2" />
            <p className="text-2xl font-bold">{reminders.length}</p>
            <p className="text-sm text-gray-500">Total</p>
          </Card.Content>
        </Card>
      </div>
      
      <Card>
        <Card.Header>
          <Tabs
            tabs={tabs}
            defaultTab="upcoming"
            onChange={setActiveTab}
          />
        </Card.Header>
        
        <div className="p-4 border-b border-gray-100 ">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-sm text-gray-500">
              {filteredReminders.length} {filteredReminders.length === 1 ? 'reminder' : 'reminders'}
            </div>
            
            <div className="relative w-full sm:w-64">
              <Input
                placeholder="Search reminders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search size={16} />}
              />
            </div>
          </div>
        </div>
        
        <Card.Content>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          ) : filteredReminders.length === 0 ? (
            <div className="text-center py-8">
              <Bell size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {activeTab === 'upcoming' ? 'No upcoming reminders' :
                 activeTab === 'overdue' ? 'No overdue reminders' :
                 activeTab === 'completed' ? 'No completed reminders' :
                 'No reminders found'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'Start by adding your first reminder'
                }
              </p>
              {!searchTerm && (
                <Link to="/pet-parent/reminders/new">
                  <Button icon={<Plus size={16} />}>
                    Add Your First Reminder
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4 ">
              {filteredReminders.map((reminder) => (
                <Card key={reminder.id}>
                  <Card.Content className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">
                          {getTypeIcon(reminder.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium">{reminder.title}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(reminder.type)}`}>
                              {reminder.type.replace('_', ' ')}
                            </span>
                            {reminder.is_recurring && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                {reminder.recurring_interval}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar size={14} />
                              <span>{formatDate(reminder.reminder_date)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock size={14} />
                              <span>{reminder.reminder_time}</span>
                            </div>
                          </div>
                          {reminder.notes && (
                            <p className="text-sm text-gray-600 mt-1">{reminder.notes}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ">
                        {!reminder.is_completed && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCompleteReminder(reminder.id)}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <Check size={14} />
                          </Button>
                        )}
                        <Link to={`/pet-parent/reminders/${reminder.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit size={14} />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteModal({ isOpen: true, reminderId: reminder.id })}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash size={14} />
                        </Button>
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              ))}
            </div>
          )}
        </Card.Content>
      </Card>
      
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, reminderId: null })}
        title="Delete Reminder"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this reminder? This action cannot be undone.
          </p>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ isOpen: false, reminderId: null })}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteReminder}
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