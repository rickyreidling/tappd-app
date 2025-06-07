import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

const EmailVerificationBadge: React.FC = () => {
  const { emailVerified } = useAppContext();

  if (emailVerified) {
    return (
      <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
        <CheckCircle className="w-3 h-3 mr-1" />
        Email Verified
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
      <XCircle className="w-3 h-3 mr-1" />
      Email Not Verified
    </Badge>
  );
};

export default EmailVerificationBadge;