import { X, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';

export function Notification() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="flex items-start">
              {props.variant === 'destructive' ? (
                <AlertCircle className="h-5 w-5 text-destructive mr-2" />
              ) : props.variant === 'warning' ? (
                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              )}
              <div className="flex-1">
                {title && <ToastTitle className="font-semibold">{title}</ToastTitle>}
                {description && (
                  <ToastDescription className="text-sm">{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport className="fixed right-4 top-4 flex flex-col gap-2 w-80 max-w-[90vw]" />
    </ToastProvider>
  );
}
