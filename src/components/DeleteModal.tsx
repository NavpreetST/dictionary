'use client';

interface DeleteModalProps {
  wordToDelete: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteModal({ wordToDelete, onConfirm, onCancel }: DeleteModalProps) {
  if (!wordToDelete) return null;

  return (
    <div className="modal-overlay fixed inset-0 bg-black/50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="modal-container glass w-11/12 md:max-w-md mx-auto rounded-2xl shadow-2xl z-50 overflow-y-auto p-8 transform">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-500/20 mb-6">
            <svg 
              className="h-8 w-8 text-red-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Delete Word</h3>
          <p className="text-white/80 text-sm leading-relaxed">
            Are you sure you want to delete <span className="font-semibold text-white">"{wordToDelete}"</span>?<br />
            This action cannot be undone.
          </p>
        </div>
        <div className="mt-8 flex justify-center gap-3">
          <button 
            onClick={onCancel}
            className="flex-1 py-3 px-6 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all duration-200 font-medium backdrop-blur-sm"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 py-3 px-6 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
