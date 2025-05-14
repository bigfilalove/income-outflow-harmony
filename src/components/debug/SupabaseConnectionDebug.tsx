
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, XCircle, AlertCircle, RefreshCw, Database, ShieldAlert, Key } from 'lucide-react';
import { checkSupabaseConnectionDetailed, ConnectionCheckResult } from '@/utils/supabaseConnectionCheck';
import { supabase } from '@/lib/supabase';

export const SupabaseConnectionDebug = () => {
  const [connectionResult, setConnectionResult] = useState<ConnectionCheckResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  
  const checkConnection = async () => {
    setIsLoading(true);
    setErrorDetails(null);
    try {
      const result = await checkSupabaseConnectionDetailed();
      setConnectionResult(result);
      
      // Дополнительная проверка ошибок, если таблицы недоступны
      if (!result.details.tablesAccessible) {
        try {
          // Пробуем получить более подробную информацию об ошибке
          const { error } = await supabase
            .from('categories')
            .select('count(*)')
            .limit(1);
            
          if (error) {
            if (error.code === '42P01') {
              setErrorDetails('Таблица не существует. Необходимо создать таблицы в базе данных Supabase.');
            } else if (error.code === 'PGRST116') {
              setErrorDetails('Отсутствует Row Level Security (RLS). Необходимо настроить политики RLS для таблиц.');
            } else if (error.code === '42501' || error.message.includes('permission')) {
              setErrorDetails('Недостаточно прав доступа. Проверьте настройки RLS и убедитесь, что вы авторизованы.');
            } else {
              setErrorDetails(`Код ошибки: ${error.code}, Сообщение: ${error.message}`);
            }
          }
        } catch (detailError) {
          console.error('Error getting detailed error info:', detailError);
        }
      }
    } catch (error) {
      console.error('Error during connection check:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    checkConnection();
  }, []);
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Диагностика соединения с Supabase
          <Button 
            variant="outline" 
            size="sm" 
            onClick={checkConnection} 
            disabled={isLoading}
            className="ml-2"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Проверить соединение
          </Button>
        </CardTitle>
        <CardDescription>
          Проверка соединения с базой данных Supabase и её компонентами
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {connectionResult ? (
          <>
            <div className="grid gap-4">
              <Alert variant={connectionResult.isConnected ? "default" : "destructive"}>
                <div className="flex items-center gap-2">
                  {connectionResult.isConnected ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5" />
                  )}
                  <AlertTitle>
                    {connectionResult.isConnected ? "Соединение установлено" : "Ошибка соединения"}
                  </AlertTitle>
                </div>
                {!connectionResult.isConnected && connectionResult.details.errorMessage && (
                  <AlertDescription className="mt-2">
                    {connectionResult.details.errorMessage}
                  </AlertDescription>
                )}
              </Alert>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    {connectionResult.details.authEnabled ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <Key className="h-4 w-4 mr-1" />
                    Аутентификация
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {connectionResult.details.authEnabled 
                      ? "Система аутентификации Supabase доступна"
                      : "Проблемы с системой аутентификации"}
                  </p>
                </div>
                
                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    {connectionResult.details.tablesAccessible ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <Database className="h-4 w-4 mr-1" />
                    Таблицы данных
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {connectionResult.details.tablesAccessible 
                      ? "Таблицы базы данных доступны"
                      : "Не удалось получить доступ к таблицам"}
                  </p>
                </div>
              </div>
              
              {errorDetails && (
                <Alert variant="warning" className="bg-amber-50 border-amber-200">
                  <ShieldAlert className="h-4 w-4 text-amber-600" />
                  <AlertTitle className="text-amber-800">Дополнительная информация</AlertTitle>
                  <AlertDescription className="text-amber-700">
                    {errorDetails}
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-2">Информация о конфигурации</h4>
                <div className="text-sm space-y-2">
                  <div>
                    <span className="font-medium">URL Supabase:</span>{" "}
                    {connectionResult.details.url}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground bg-muted p-3 rounded">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">Рекомендации по устранению проблем:</span>
              </div>
              <ul className="list-disc pl-6 space-y-1">
                <li>Проверьте правильность URL и ключа API Supabase в конфигурации приложения</li>
                <li>Убедитесь, что проект Supabase активен и не находится в режиме обслуживания</li>
                <li>Проверьте, созданы ли необходимые таблицы в базе данных</li>
                <li>Если используется Row Level Security (RLS), убедитесь, что правила доступа настроены правильно</li>
                <li>Возможно, требуется аутентификация для доступа к таблицам. Попробуйте сначала войти в систему</li>
              </ul>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center py-6">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
