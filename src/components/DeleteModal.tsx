'use client';

interface DeleteModalProps {
  wordToDelete: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteModal({ wordToDelete, onConfirm, onCancel }: DeleteModalProps) {
  if (!wordToDelete) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="bg-white w-11/12 md:max-w-md mx-auto rounded-xl shadow-lg z-50 overflow-y-auto p-6 transform scale-95">
        <div className="text-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-12 h-12 flex items-center text-red-500 mx-auto" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
              clipRule="evenodd" 
            />
          </svg>
          <h3 className="text-xl font-bold text-gray-800 mt-4">Delete Word</h3>
          <p className="text-sm text-gray-500 mt-2">
            Are you sure you want to delete "<span className="font-semibold">{wordToDelete}</span>"? 
            This action cannot be undone.
          </p>
        </div>
        <div className="mt-6 flex justify-center gap-4">
          <button 
            onClick={onCancel}
            className="py-2 px-6 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="py-2 px-6 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
