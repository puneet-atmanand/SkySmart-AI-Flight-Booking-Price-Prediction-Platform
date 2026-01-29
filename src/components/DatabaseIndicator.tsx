import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { Database, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

export default function DatabaseIndicator() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [details, setDetails] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const checkConnection = async () => {
    try {
      setStatus('checking');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-e56e4e4c/health`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (response.ok) {
        setStatus('connected');
        setErrorMessage('');
        
        // Get detailed status
        try {
          const dbTestResponse = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-e56e4e4c/db-test`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${publicAnonKey}`,
                'Content-Type': 'application/json',
              },
            }
          );
          
          if (dbTestResponse.ok) {
            const data = await dbTestResponse.json();
            setDetails(data);
          }
        } catch (detailError) {
          // Ignore detail fetch errors, main connection is working
          console.log('Could not fetch database details:', detailError);
        }
      } else {
        setStatus('disconnected');
        setErrorMessage(`HTTP ${response.status}: ${response.statusText}`);
        console.error('Health check failed with status:', response.status);
      }
    } catch (error: any) {
      setStatus('disconnected');
      
      if (error.name === 'AbortError') {
        setErrorMessage('Connection timeout - server may be starting up');
        console.error('Database connection timeout');
      } else if (error.message?.includes('Failed to fetch')) {
        setErrorMessage('Network error - check your connection or server may be down');
        console.error('Network error during database check:', error);
      } else {
        setErrorMessage(error.message || 'Unknown error');
        console.error('Database connection check failed:', error);
      }
    }
  };

  useEffect(() => {
    checkConnection();
    // Check every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'text-green-600';
      case 'disconnected':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'connected':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'disconnected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4 animate-pulse" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'Database Connected';
      case 'disconnected':
        return 'Database Disconnected';
      default:
        return 'Checking Connection...';
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-lg bg-background border shadow-lg cursor-pointer hover:scale-105 transition-transform ${getStatusColor()}`}>
            <Database className="w-4 h-4" />
            {getStatusIcon()}
          </div>
        </TooltipTrigger>
        <TooltipContent side="left" className="max-w-xs">
          <div className="space-y-1">
            <p className="font-medium">{getStatusText()}</p>
            {details && status === 'connected' && (
              <>
                <p className="text-xs text-muted-foreground">
                  Users: {details.userCount || 0}
                </p>
                <p className="text-xs text-muted-foreground">
                  KV Store: {details.tests?.kvStore === 'passed' ? '✓' : '✗'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Auth: {details.tests?.auth === 'passed' ? '✓' : '✗'}
                </p>
              </>
            )}
            {errorMessage && (
              <p className="text-xs text-red-600 mt-2">
                {errorMessage}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              Click profile → Database for details
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}