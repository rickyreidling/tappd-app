import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const StripeDebugger: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testStripeConnection = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('🔍 Testing Stripe connection...');
      
      const testPayload = {
        priceId: 'price_monthly_pro',
        userId: 'test-user-123',
        successUrl: window.location.origin + '?upgrade=success',
        cancelUrl: window.location.origin + '?upgrade=cancelled'
      };

      console.log('📦 Test payload:', testPayload);
      console.log('🎯 Endpoint:', 'https://sstmnoilasukcxjacrjj.supabase.co/functions/v1/f14f8a33-df79-4f7c-8d94-a0f16cd86c2a');

      const response = await fetch(
        'https://sstmnoilasukcxjacrjj.supabase.co/functions/v1/f14f8a33-df79-4f7c-8d94-a0f16cd86c2a',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzdG1ub2lsYXN1a2N4amFjcmpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxODY5MDYsImV4cCI6MjA2Mjc2MjkwNn0.EZYiW-p_o0wuVxNvm9FOJh2wrdU7_hS1vyDNy4OEzoI`,
          },
          body: JSON.stringify(testPayload)
        }
      );

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

      const responseText = await response.text();
      console.log('📄 Raw response:', responseText);

      let parsedResponse;
      try {
        parsedResponse = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(`Invalid JSON response: ${responseText}`);
      }

      setResult({
        status: response.status,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
        data: parsedResponse
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${parsedResponse.error || responseText}`);
      }

    } catch (err: any) {
      console.error('❌ Test failed:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Stripe Connection Debugger
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testStripeConnection} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Testing...</>
          ) : (
            'Test Stripe Connection'
          )}
        </Button>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800 font-semibold mb-2">
              <AlertCircle className="w-4 h-4" />
              Error
            </div>
            <pre className="text-sm text-red-700 whitespace-pre-wrap">{error}</pre>
          </div>
        )}

        {result && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {result.ok ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
              <Badge variant={result.ok ? 'default' : 'destructive'}>
                HTTP {result.status}
              </Badge>
            </div>
            
            <div className="p-4 bg-gray-50 border rounded-lg">
              <h4 className="font-semibold mb-2">Response Data:</h4>
              <pre className="text-sm overflow-auto max-h-40">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StripeDebugger;