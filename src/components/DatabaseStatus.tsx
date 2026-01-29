import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { CheckCircle2, XCircle, Database, RefreshCw, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export default function DatabaseStatus() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testDatabase = async () => {
    setLoading(true);
    try {
      console.log('Testing database connection...');
      console.log('Project ID:', projectId);
      console.log('Anon Key exists:', !!publicAnonKey);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const url = `https://${projectId}.supabase.co/functions/v1/make-server-e56e4e4c/db-test`;
      console.log('Fetching:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      const data = await response.json();
      console.log('Database test result:', data);
      
      if (response.ok) {
        setStatus(data);
        toast.success('Database is connected and working!');
      } else {
        setStatus({ error: true, ...data });
        toast.error(`Database test failed: ${data.message || data.error}`);
      }
    } catch (error: any) {
      console.error('Database test error:', error);
      
      let errorMessage = 'Unknown error occurred';
      
      if (error.name === 'AbortError') {
        errorMessage = 'Connection timeout - The database server is taking too long to respond. It may be starting up or experiencing issues.';
      } else if (error.message?.includes('Failed to fetch')) {
        errorMessage = 'Network error - Cannot reach the database server. Please check:\n1. Your internet connection\n2. The Supabase project is running\n3. CORS settings are correct\n4. The Edge Function is deployed';
      } else {
        errorMessage = error.message;
      }
      
      setStatus({ 
        error: true, 
        message: errorMessage,
        technicalDetails: error.toString(),
      });
      toast.error('Failed to connect to database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testDatabase();
  }, []);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-6 h-6 text-primary" />
            <CardTitle>Database Connection Status</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={testDatabase}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Test Connection
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading && !status && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {status && (
          <div className="space-y-4">
            {status.error ? (
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                  <XCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-destructive">Database Connection Failed</p>
                    <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">{status.message || status.details}</p>
                    {status.kvStoreWorking && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Note: KV Store is working, but Auth connection failed.
                      </p>
                    )}
                  </div>
                </div>
                
                {status.technicalDetails && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs font-medium mb-1">Technical Details:</p>
                    <code className="text-xs text-muted-foreground break-all">{status.technicalDetails}</code>
                  </div>
                )}
                
                <div className="flex items-start gap-2 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-600">
                    <p className="font-medium">Troubleshooting Steps:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1 text-xs">
                      <li>Ensure your Supabase Edge Function is deployed and running</li>
                      <li>Check that CORS is properly configured in the server</li>
                      <li>Verify environment variables are set correctly</li>
                      <li>The server may take a few seconds to start on first request</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-green-600">Database Fully Connected!</p>
                  <p className="text-sm text-muted-foreground mt-1">{status.message}</p>
                </div>
              </div>
            )}

            {status.tests && (
              <div className="space-y-2">
                <h4 className="font-medium">Test Results:</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">KV Store</p>
                      <p className="text-xs text-muted-foreground">{status.tests.kvStore}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Authentication</p>
                      <p className="text-xs text-muted-foreground">{status.tests.auth}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {status.userCount !== undefined && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">
                  <span className="font-medium">Users in database:</span>{' '}
                  <span className="text-primary">{status.userCount}</span>
                </p>
              </div>
            )}

            {status.timestamp && (
              <p className="text-xs text-muted-foreground text-right">
                Last tested: {new Date(status.timestamp).toLocaleString()}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}