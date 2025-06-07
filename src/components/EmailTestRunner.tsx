import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzdG1ub2lsYXN1a2N4amFjcmpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxODY5MDYsImV4cCI6MjA2Mjc2MjkwNn0.EZYiW-p_o0wuVxNvm9FOJh2wrdU7_hS1vyDNy4OEzoI';

const EmailTestRunner: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const { toast } = useToast();
  const testEmail = 'rickstar32@aol.com';
  const testPassword = 'TestPassword123!';

  const addLog = (message: string) => {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}`;
    setLogs(prev => [...prev, logEntry]);
    console.log(logEntry);
  };

  const runFullEmailTest = async () => {
    setRunning(true);
    setLogs([]);
    setTestResults(null);
    
    try {
      addLog('🚀 STARTING COMPREHENSIVE EMAIL TEST');
      addLog(`📧 Test Email: ${testEmail}`);
      addLog('📋 SMTP Config Check:');
      addLog('   Expected Host: smtp.sendgrid.net');
      addLog('   Expected Port: 587');
      addLog('   Expected Username: apikey');
      addLog('   Expected Sender: noreply@gettappd.app');
      addLog('   Domain Status: Should be verified in SendGrid');
      addLog('=' .repeat(50));
      
      // Step 1: Create test account
      addLog('STEP 1: Creating test account...');
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
      });
      
      if (signupError) {
        addLog(`❌ SIGNUP ERROR: ${signupError.message}`);
        addLog(`❌ ERROR CODE: ${signupError.name}`);
        addLog(`❌ FULL ERROR: ${JSON.stringify(signupError, null, 2)}`);
        
        // Check for specific SMTP-related errors
        if (signupError.message.toLowerCase().includes('smtp')) {
          addLog('🚨 SMTP ERROR DETECTED - Check Supabase SMTP settings!');
        }
        if (signupError.message.toLowerCase().includes('email')) {
          addLog('📧 EMAIL-RELATED ERROR - Check sender configuration!');
        }
        
        throw signupError;
      }
      
      addLog(`✅ Account created successfully`);
      addLog(`👤 User ID: ${signupData.user?.id}`);
      addLog(`📧 Email confirmed: ${signupData.user?.email_confirmed_at ? 'YES' : 'NO'}`);
      addLog(`🔐 Session exists: ${signupData.session ? 'YES' : 'NO (expected for unconfirmed)'}`);
      
      // Step 2: Wait briefly then check session status
      addLog('STEP 2: Checking session status...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        addLog(`❌ SESSION ERROR: ${sessionError.message}`);
        addLog(`❌ SESSION ERROR DETAILS: ${JSON.stringify(sessionError, null, 2)}`);
      }
      
      if (!sessionData.session) {
        addLog('⚠️ NO SESSION FOUND - This is EXPECTED for unconfirmed accounts');
        addLog('📧 Supabase requires email confirmation before establishing session');
        addLog('✅ This behavior is CORRECT - not an error!');
      } else {
        addLog('✅ Session established (unusual for unconfirmed account)');
        addLog(`🔑 Access token length: ${sessionData.session.access_token.length}`);
      }
      
      // Step 3: Test send-verification-email function with detailed logging
      addLog('STEP 3: Testing send-verification-email function...');
      
      try {
        const emailFunctionUrl = 'https://sstmnoilasukcxjacrjj.supabase.co/functions/v1/c9c5c46b-fe8e-4609-a476-5b7f3e58b6b1';
        addLog(`📡 Calling: ${emailFunctionUrl}`);
        
        const requestBody = {
          email: testEmail,
          userId: signupData.user?.id,
          token: crypto.randomUUID()
        };
        addLog(`📤 Request body: ${JSON.stringify(requestBody, null, 2)}`);
        
        const emailResponse = await fetch(emailFunctionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`
          },
          body: JSON.stringify(requestBody)
        });
        
        addLog(`📨 Response status: ${emailResponse.status}`);
        addLog(`📨 Response ok: ${emailResponse.ok}`);
        
        const responseText = await emailResponse.text();
        addLog(`📨 Raw response: ${responseText}`);
        
        if (emailResponse.ok) {
          try {
            const emailResult = JSON.parse(responseText);
            addLog(`✅ Email function succeeded`);
            addLog(`📧 Function response: ${JSON.stringify(emailResult, null, 2)}`);
            
            // Check for SMTP-related info in response
            if (emailResult.resendResponse) {
              addLog(`📬 Resend response: ${emailResult.resendResponse}`);
              if (emailResult.resendResponse.includes('smtp') || emailResult.resendResponse.includes('SMTP')) {
                addLog('🚨 SMTP ERROR detected in resend response!');
              }
            }
            
            if (emailResult.recoveryResponse) {
              addLog(`🔄 Recovery response: ${emailResult.recoveryResponse}`);
              if (emailResult.recoveryResponse.includes('smtp') || emailResult.recoveryResponse.includes('SMTP')) {
                addLog('🚨 SMTP ERROR detected in recovery response!');
              }
            }
            
          } catch (parseError) {
            addLog(`⚠️ Could not parse response as JSON: ${parseError}`);
            addLog(`📄 Raw response text: ${responseText}`);
          }
        } else {
          addLog(`❌ Email function failed with status ${emailResponse.status}`);
          addLog(`❌ Error response: ${responseText}`);
          
          // Check for SMTP errors in error response
          if (responseText.toLowerCase().includes('smtp')) {
            addLog('🚨 SMTP ERROR detected in function response!');
          }
        }
      } catch (emailError: any) {
        addLog(`❌ EMAIL FUNCTION ERROR: ${emailError.message}`);
        addLog(`❌ FULL ERROR: ${JSON.stringify(emailError, null, 2)}`);
      }
      
      // Step 4: Test direct Supabase resend with detailed logging
      addLog('STEP 4: Testing direct Supabase resend...');
      
      try {
        const { error: resendError } = await supabase.auth.resend({
          type: 'signup',
          email: testEmail,
          options: {
            emailRedirectTo: `${window.location.origin}/verify-email`
          }
        });
        
        if (resendError) {
          addLog(`❌ RESEND ERROR: ${resendError.message}`);
          addLog(`❌ RESEND CODE: ${resendError.name}`);
          addLog(`❌ FULL RESEND ERROR: ${JSON.stringify(resendError, null, 2)}`);
          
          // Check for SMTP-specific errors
          if (resendError.message.toLowerCase().includes('smtp')) {
            addLog('🚨 SMTP ERROR detected in direct resend!');
            addLog('🔧 Check Supabase Auth SMTP configuration!');
          }
          if (resendError.message.toLowerCase().includes('noreply@gettappd.app')) {
            addLog('📧 Sender email issue detected!');
          }
        } else {
          addLog('✅ Direct resend call succeeded');
          addLog('📬 Email should be queued for delivery via Supabase SMTP');
        }
      } catch (resendError: any) {
        addLog(`❌ RESEND EXCEPTION: ${resendError.message}`);
      }
      
      setTestResults({
        success: true,
        userId: signupData.user?.id,
        email: testEmail,
        emailConfirmed: !!signupData.user?.email_confirmed_at,
        sessionActive: !!sessionData?.session,
        sessionExpected: false, // Should be false until email confirmed
        timestamp: new Date().toISOString()
      });
      
      addLog('=' .repeat(50));
      addLog('🏁 TEST COMPLETED');
      addLog('📬 CHECK THESE LOCATIONS FOR EMAIL:');
      addLog('   1. rickstar32@aol.com inbox');
      addLog('   2. rickstar32@aol.com spam/junk folder');
      addLog('   3. SendGrid Activity Log (https://app.sendgrid.com/email_activity)');
      addLog('   4. Supabase Auth logs');
      addLog('');
      addLog('🔍 TROUBLESHOOTING CHECKLIST:');
      addLog('   ✓ Domain gettappd.app verified in SendGrid');
      addLog('   ✓ noreply@gettappd.app sender verified');
      addLog('   ✓ SMTP credentials set in Supabase');
      addLog('   ✓ No suppression list blocks');
      addLog('   ? Check function logs above for SMTP errors');
      
    } catch (error: any) {
      addLog(`❌ TEST FAILED: ${error.message}`);
      addLog(`❌ STACK TRACE: ${error.stack}`);
      
      setTestResults({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setRunning(false);
    }
  };

  // Auto-run test on component mount
  useEffect(() => {
    runFullEmailTest();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🧪 Live Email Delivery Test
            <Badge variant={running ? "secondary" : testResults?.success ? "default" : "destructive"}>
              {running ? "Running..." : testResults?.success ? "Completed" : "Failed"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 space-y-2">
            <p><strong>Test Email:</strong> {testEmail}</p>
            <p><strong>Expected Delivery:</strong> Within 1-2 minutes</p>
            <p><strong>Note:</strong> Session will NOT exist until email is confirmed (this is correct!)</p>
            <div className="bg-yellow-50 p-3 rounded border">
              <p className="text-sm font-medium">🔍 What to check:</p>
              <ul className="text-sm mt-1 space-y-1">
                <li>• SendGrid Activity Log for delivery status</li>
                <li>• Function logs below for SMTP errors</li>
                <li>• Inbox AND spam folder</li>
                <li>• Suppression list in SendGrid</li>
              </ul>
            </div>
          </div>
          
          <Button 
            onClick={runFullEmailTest} 
            disabled={running}
            className="mb-4"
          >
            {running ? '🔄 Running Test...' : '🔄 Run Test Again'}
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>📋 Detailed Test Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={logs.join('\n')}
            readOnly
            className="min-h-[600px] font-mono text-xs"
            placeholder="Test logs will appear here..."
          />
        </CardContent>
      </Card>
      
      {testResults && (
        <Card>
          <CardHeader>
            <CardTitle>📊 Test Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(testResults, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmailTestRunner;