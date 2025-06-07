import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const StripeTestButton: React.FC = () => {
  const [testing, setTesting] = useState(false);
  const { toast } = useToast();

  const testStripeConnection = async () => {
    setTesting(true);
    try {
      console.log('🧪 Testing Stripe connection...');
      
      const testData = {
        priceId: 'price_monthly_pro',
        userId: 'test-user-123',
        successUrl: window.location.origin + '?test=success',
        cancelUrl: window.location.origin + '?test=cancelled'
      };
      
      console.log('📦 Test request:', testData);
      
      const response = await fetch(
        'https://sstmnoilasukcxjacrjj.supabase.co/functions/v1/f14f8a33-df79-4f7c-8d94-a0f16cd86c2a',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzdG1ub2lsYXN1a2N4amFjcmpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxODY5MDYsImV4cCI6MjA2Mjc2MjkwNn0.EZYiW-p_o0wuVxNvm9FOJh2wrdU7_hS1vyDNy4OEzoI`,
          },
          body: JSON.stringify(testData)
        }
      );
      
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ Success response:', result);
      
      if (result.url) {
        toast({
          title: "✅ Stripe Connection Working!",
          description: "Checkout URL received successfully",
        });
        console.log('🔗 Would redirect to:', result.url);
      } else {
        throw new Error('No checkout URL in response');
      }
      
    } catch (error) {
      console.error('💥 Test failed:', error);
      toast({
        title: "❌ Stripe Test Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Button 
      onClick={testStripeConnection}
      disabled={testing}
      variant="outline"
      className="mb-4"
    >
      {testing ? '🧪 Testing...' : '🧪 Test Stripe Connection'}
    </Button>
  );
};

export default StripeTestButton;