import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmailVerificationScreenProps {
  email: string;
  onResendEmail: () => Promise<void>;
}

const EmailVerificationScreen: React.FC<EmailVerificationScreenProps> = ({ 
  email, 
  onResendEmail 
}) => {
  const [resending, setResending] = useState(false);
  const { toast } = useToast();

  const handleResend = async () => {
    setResending(true);
    try {
      await onResendEmail();
      toast({
        title: "Email Sent!",
        description: "Check your inbox for the verification link.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send email",
        variant: "destructive",
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center shadow-xl border-4 border-white/50">
              <Mail className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Check Your Email
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-3">
            <p className="text-gray-600">
              We just sent a confirmation email to:
            </p>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <p className="font-semibold text-purple-700">{email}</p>
            </div>
            <p className="text-sm text-gray-500">
              Check your inbox and tap the link to start exploring.
            </p>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={handleResend}
              disabled={resending}
              variant="outline"
              className="w-full border-2 border-purple-200 hover:bg-purple-50"
            >
              {resending ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              {resending ? 'Sending...' : 'Resend Email'}
            </Button>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-700 text-sm">
              💡 <strong>Tip:</strong> Check your spam folder if you don't see the email.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerificationScreen;