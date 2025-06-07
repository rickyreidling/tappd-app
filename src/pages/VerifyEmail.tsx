import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2, AlertTriangle } from 'lucide-react';
import { verifyEmailToken } from '@/lib/emailVerification';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setEmailVerified } = useAppContext();
  const { toast } = useToast();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link - no token provided');
      return;
    }

    verifyToken(token);
  }, [searchParams]);

  const verifyToken = async (token: string) => {
    try {
      setStatus('verifying');
      setMessage('Verifying your email...');
      
      const result = await verifyEmailToken(token);
      
      setDebugInfo({
        token,
        result,
        timestamp: new Date().toISOString(),
        endpoint: 'verify-email function'
      });
      
      if (result.success) {
        setStatus('success');
        setMessage('Email verified successfully!');
        setEmailVerified(true);
        
        toast({
          title: "Email Verified! ✅",
          description: "Welcome to Tappd! You can now explore and connect.",
        });
        
        // Redirect to explore after 2 seconds
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 2000);
      } else {
        setStatus('error');
        setMessage(result.error || 'Verification failed');
      }
    } catch (error: any) {
      setStatus('error');
      setMessage('Network error during verification');
      setDebugInfo({
        token,
        error: error.message,
        timestamp: new Date().toISOString(),
        endpoint: 'verify-email function'
      });
    }
  };

  const handleContinue = () => {
    navigate('/', { replace: true });
  };

  const handleRetry = () => {
    const token = searchParams.get('token');
    if (token) {
      verifyToken(token);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center shadow-xl border-4 border-white/50">
              {status === 'verifying' && <Loader2 className="w-8 h-8 text-white animate-spin" />}
              {status === 'success' && <CheckCircle className="w-8 h-8 text-white" />}
              {status === 'error' && <XCircle className="w-8 h-8 text-white" />}
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            {status === 'verifying' && 'Verifying Email...'}
            {status === 'success' && 'Email Verified!'}
            {status === 'error' && 'Verification Failed'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-gray-600">
            {message}
          </p>
          
          {status === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-700 text-sm font-medium">
                🎉 You're all set! Redirecting to explore...
              </p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="space-y-3">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm">
                  The verification link may be expired or invalid. Please try again or contact support.
                </p>
              </div>
              
              <div className="space-y-2">
                <Button 
                  onClick={handleRetry}
                  variant="outline"
                  className="w-full"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                
                <Button 
                  onClick={handleContinue}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  Continue to App
                </Button>
              </div>
            </div>
          )}
          
          {debugInfo && process.env.NODE_ENV === 'development' && (
            <details className="text-left">
              <summary className="cursor-pointer text-sm text-gray-500">Debug Info</summary>
              <pre className="text-xs mt-2 p-2 bg-gray-100 rounded overflow-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;