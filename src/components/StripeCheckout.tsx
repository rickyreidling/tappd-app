import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

interface StripeCheckoutProps {
  planName: string;
  price: string;
  priceId: string;
  popular?: boolean;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ 
  planName, 
  price, 
  priceId, 
  popular = false 
}) => {
  const [loading, setLoading] = useState(false);
  const { upgradeToProWithStripe } = useAppContext();

  const handleCheckout = async () => {
    setLoading(true);
    try {
      await upgradeToProWithStripe(priceId);
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleCheckout}
      disabled={loading}
      className={`w-full ${
        popular 
          ? 'bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500' 
          : ''
      }`}
      variant={popular ? 'default' : 'outline'}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        popular ? 'Get PRO Now' : 'Select Plan'
      )}
    </Button>
  );
};

export default StripeCheckout;