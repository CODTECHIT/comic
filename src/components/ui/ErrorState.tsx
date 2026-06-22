import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white border-4 border-black shadow-[6px_6px_0_#0D0D0D] max-w-lg mx-auto my-8">
      <AlertTriangle className="text-[#C8181E] w-12 h-12 mb-4" />
      <p className="text-[#6B5B45] font-medium mb-6">{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="bg-[#C8181E] hover:bg-black text-white px-6 py-2 font-bold transition-colors border-2 border-black"
          style={{ fontFamily: 'Bangers, cursive', letterSpacing: '0.05em' }}
        >
          TRY AGAIN
        </button>
      )}
    </div>
  );
}
