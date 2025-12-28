import { Link } from 'react-router-dom';
import { Calendar, Phone, Circle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatPhoneNumber, formatDate } from '../../lib/utils';
import { Patient } from '../../types';

interface PatientCardProps {
  patient: Patient;
  viewPath: string;
  isDoctor?: boolean;
}

export function PatientCard({ patient, viewPath, isDoctor }: PatientCardProps) {
  return (
    <Card className="transition-all hover:shadow-md">
      <Card.Content className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-lg">{patient.owner_name}</h3>
          <div className="flex items-center space-x-1">
            <Circle
              size={8}
              className={
                patient.status === 'pending'
                  ? 'text-amber-500 fill-amber-500'
                  : 'text-green-500 fill-green-500'
              }
            />
            <span className="text-xs text-gray-500 capitalize">
              {patient.status}
            </span>
          </div>
        </div>
        
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex items-center space-x-2">
            <Phone size={14} />
            <span>{formatPhoneNumber(patient.phone)}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Calendar size={14} />
            <span>{formatDate(patient.created_at)}</span>
          </div>
          
          <div className="border-t border-gray-100 pt-2 mt-2">
            <div className="flex space-x-2">
              <span className="font-medium">Breed:</span>
              <span>{patient.breed}</span>
            </div>
            <div className="flex space-x-2">
              <span className="font-medium">Issue:</span>
              <span>{patient.issue_type}</span>
            </div>
          </div>
        </div>
      </Card.Content>
      
      <Card.Footer className="justify-end">
        <Link to={viewPath}>
          <Button size="sm">
            {isDoctor
              ? patient.status === 'pending'
                ? 'Create Prescription'
                : 'View Details'
              : 'View Details'}
          </Button>
        </Link>
      </Card.Footer>
    </Card>
  );
}