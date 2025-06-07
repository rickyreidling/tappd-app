import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const EmailVerificationDebugger: React.FC = () => {
  const [testToken, setTestToken] = useState('');
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [endpointStatus, setEndpointStatus] = useState<'unknown' | 'online' | 'offline'>('unknown');

  const testEndpoint = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://sstmnoilasukcxjacrjj.supabase.co/functions/v1/b6cc9dab-0e67-4317-9d8f-aea545a1b55e',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: 'test-token' })
        }
      );
      
      const result = await response.json();
      setEndpointStatus('online');
      setTestResult({
        status: response.status,
        statusText: response.statusText,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      setEndpointStatus('offline');
      setTestResult({
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const testWithToken = async () => {
    if (!testToken) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        'https://sstmnoilasukcxjacrjj.supabase.co/functions/v1/b6cc9dab-0e67-4317-9d8f-aea545a1b55e',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: testToken })
        }
      );
      
      const result = await response.json();
      setTestResult({
        status: response.status,
        statusText: response.statusText,
        data: result,
        timestamp: new Date().toISOString(),
        testedToken: testToken
      });
    } catch (error: any) {
      setTestResult({
        error: error.message,
        timestamp: new Date().toISOString(),
        testedToken: testToken
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Email Verification Debugger
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <span>Endpoint Status:</span>
          <Badge variant={endpointStatus === 'online' ? 'default' : endpointStatus === 'offline' ? 'destructive' : 'secondary'}>
            {endpointStatus === 'online' && <CheckCircle className="w-3 h-3 mr-1" />}
            {endpointStatus === 'offline' && <AlertCircle className="w-3 h-3 mr-1" />}
            {endpointStatus.toUpperCase()}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <Button onClick={testEndpoint} disabled={loading} className="w-full">
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Test Endpoint Connection
          </Button>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="testToken">Test with Token:</Label>
          <div className="flex gap-2">
            <Input
              id="testToken"
              value={testToken}
              onChange={(e) => setTestToken(e.target.value)}
              placeholder="Enter verification token"
            />
            <Button onClick={testWithToken} disabled={loading || !testToken}>
              Test
            </Button>
          </div>
        </div>
        
        {testResult && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">Test Result:</h4>
            <pre className="text-xs overflow-auto bg-white p-2 rounded border">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}
        
        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Endpoint:</strong> https://sstmnoilasukcxjacrjj.supabase.co/functions/v1/b6cc9dab-0e67-4317-9d8f-aea545a1b55e</p>
          <p><strong>Expected Response:</strong> {`{"success": true/false, "error": "message"}`}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailVerificationDebugger;