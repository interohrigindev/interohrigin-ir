import { useEffect, useState, createContext, useContext, useCallback, type ReactNode } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

interface ToastData {
  id: number;
  message: string;
  type: 'success' | 'error';
}

interface ToastContextType {
  toast: (message: string, type?: 'success' | 'error') => void;
}

const ToastContext = createContext<ToastContextType>({ toast: () => {} });

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const toast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = nextId++;
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const remove = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(t => (
          <ToastItem key={t.id} data={t} onClose={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ data, onClose }: { data: ToastData; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const Icon = data.type === 'success' ? CheckCircle : AlertCircle;
  const colors = data.type === 'success'
    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
    : 'bg-red-50 border-red-200 text-red-800';

  return (
    <div className={`flex items-center gap-2 px-4 py-3 rounded-lg border shadow-lg text-sm animate-slide-up ${colors}`}>
      <Icon className="w-4 h-4 shrink-0" />
      <span className="flex-1">{data.message}</span>
      <button onClick={onClose} className="p-0.5 hover:opacity-70">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export const useToast = () => useContext(ToastContext);
