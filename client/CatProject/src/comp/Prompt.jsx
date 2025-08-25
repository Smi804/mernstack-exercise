import { useState, useEffect } from "react";

export default function PromptModal({isOpen, onClose, onSave,editType, edit }) {
  const [value, setValue] = useState("");

  // Pre-fill textarea with edit prop whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setValue(edit || "");
    }
  }, [isOpen, edit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(value); // send updated value back
    onClose(); // close modal
  };

  if (!isOpen) return null; // Don't render if not open

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 max-w-md w-full border border-white/20">
        <h2 className="text-2xl font-semibold text-white text-center mb-6">
          Edit {editType}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full p-4 rounded-xl bg-black/30 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
            rows={4}
          />

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-medium shadow-lg hover:opacity-90 transition-all duration-300"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-gray-500 text-white font-medium shadow-lg hover:bg-gray-600 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
