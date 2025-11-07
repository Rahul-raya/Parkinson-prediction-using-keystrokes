import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { User, Calendar } from 'lucide-react';
import { useSessionStore, PatientInfo } from '@/store/useSessionStore';

interface PatientInfoFormProps {
  onComplete: () => void;
}

export function PatientInfoForm({ onComplete }: PatientInfoFormProps) {
  const { setPatientInfo, patientInfo } = useSessionStore();
  const [dob, setDob] = useState(patientInfo?.dateOfBirth || '');
  const [error, setError] = useState('');

  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dob) {
      setError('Please enter your date of birth');
      return;
    }

    const birthDate = new Date(dob);
    const today = new Date();
    
    if (birthDate > today) {
      setError('Date of birth cannot be in the future');
      return;
    }

    const age = calculateAge(dob);
    
    if (age < 0 || age > 150) {
      setError('Please enter a valid date of birth');
      return;
    }

    const info: PatientInfo = {
      dateOfBirth: dob,
      age,
    };

    setPatientInfo(info);
    onComplete();
  };

  return (
    <Card className="p-8 glass-card shadow-elegant border-primary/20 animate-scale-in max-w-md mx-auto">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Patient Information</h3>
            <p className="text-sm text-muted-foreground">Please provide your details before starting</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dob" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Date of Birth
            </Label>
            <Input
              id="dob"
              type="date"
              value={dob}
              onChange={(e) => {
                setDob(e.target.value);
                setError('');
              }}
              max={new Date().toISOString().split('T')[0]}
              className="border-primary/20 focus:border-primary bg-card/50 backdrop-blur-sm"
              required
            />
            {dob && (
              <p className="text-sm text-muted-foreground">
                Age: {calculateAge(dob)} years
              </p>
            )}
          </div>

          {error && (
            <p className="text-sm text-destructive animate-fade-in">{error}</p>
          )}

          <Button 
            type="submit" 
            className="w-full gradient-primary text-white shadow-glow hover:shadow-glow-intense transition-all"
          >
            Continue to Test
          </Button>
        </form>
      </div>
    </Card>
  );
}
