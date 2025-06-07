import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const EmailTestDebugger: React.FC = () => {
  const [redirecting, setRedirecting] = useState(false);
  const { toast } = useToast();

  const runLiveTest = () => {
    setRedirecting(true);
    toast({
      title: "Redirecting to Live Test",
      description: "Opening comprehensive email test with rickstar32@aol.com",
    });
    
    // Redirect to the test runner page
    window.location.href = '/email-test';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🧪 Email Test Launcher
            <Badge variant="outline">Live Testing</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded">
            <h3 className="font-semibold mb-2">🎯 Comprehensive Email Test</h3>
            <p className="text-sm text-gray-700 mb-3">
              This will run a live end-to-end test using <strong>rickstar32@aol.com</strong> to:
            </p>
            <ul className="text-sm space-y-1 list-disc list-inside text-gray-700">
              <li>Create real test account in Supabase</li>
              <li>Call send-verification-email function</li>
              <li>Test direct Supabase auth resend</li>
              <li>Log all responses and errors</li>
              <li>Verify email delivery to inbox</li>
            </ul>
          </div>
          
          <Button 
            onClick={runLiveTest}
            disabled={redirecting}
            className="w-full"
            size="lg"
          >
            {redirecting ? '🔄 Launching Test...' : '🚀 Run Live Email Test with rickstar32@aol.com'}
          </Button>
          
          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
            <strong>Expected SMTP Config:</strong><br/>
            Host: smtp.sendgrid.net | Port: 587 | Username: apikey<br/>
            Sender: noreply@gettappd.app | Domain: gettappd.app
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailTestDebugger;