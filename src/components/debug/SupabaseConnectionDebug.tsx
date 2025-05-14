
import React, { useState, useEffect } from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { checkSupabaseConnectionDetailed } from '@/utils/supabaseConnectionCheck';
import { Badge } from '@/components/ui/badge';

const SupabaseConnectionDebug = () => {
  const [connectionStatus, setConnectionStatus] = useState<{
    isConnected: boolean;
    details: {
      timestamp: string;
      errorMessage?: string;
      errorCode?: string;
      duration?: number;
    };
  } | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      const result = await checkSupabaseConnectionDetailed();
      setConnectionStatus(result);
    } catch (error) {
      console.error('Error in connection check:', error);
      setConnectionStatus({
        isConnected: false,
        details: {
          timestamp: new Date().toISOString(),
          errorMessage: 'Unexpected error during connection check'
        }
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supabase Connection Diagnostics</CardTitle>
        <CardDescription>Check your Supabase connection status</CardDescription>
      </CardHeader>
      <CardContent>
        {connectionStatus ? (
          <>
            <div className="flex items-center space-x-2 mb-4">
              <Badge variant={connectionStatus.isConnected ? "success" : "destructive"}>
                {connectionStatus.isConnected ? 'Connected' : 'Disconnected'}
              </Badge>
              {connectionStatus.details.duration && (
                <Badge variant="outline">
                  {connectionStatus.details.duration}ms
                </Badge>
              )}
            </div>
            
            {connectionStatus.isConnected ? (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Connection Successful</AlertTitle>
                <AlertDescription>
                  Successfully connected to Supabase at {new Date(connectionStatus.details.timestamp).toLocaleString()}
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Connection Failed</AlertTitle>
                <AlertDescription>
                  <p>Error: {connectionStatus.details.errorMessage}</p>
                  {connectionStatus.details.errorCode && (
                    <p className="mt-2">Code: {connectionStatus.details.errorCode}</p>
                  )}
                  <p className="mt-2">Time: {new Date(connectionStatus.details.timestamp).toLocaleString()}</p>
                </AlertDescription>
              </Alert>
            )}
          </>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            {isChecking ? 'Checking connection...' : 'No connection information available'}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={checkConnection} 
          disabled={isChecking}
          className="w-full"
        >
          {isChecking ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Check Connection Again
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SupabaseConnectionDebug;
