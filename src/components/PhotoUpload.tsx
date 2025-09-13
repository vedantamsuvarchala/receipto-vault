import React, { useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface PhotoUploadProps {
  onUpload: (imageData: string) => void;
  onClose: () => void;
  isProcessing?: boolean;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  onUpload,
  onClose,
  isProcessing = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      onUpload(imageData);
    };
    reader.readAsDataURL(file);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Upload Receipt</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Area */}
        <div
          onClick={openFileDialog}
          className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all duration-200"
        >
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            Choose Receipt Photo
          </h4>
          <p className="text-gray-600 text-sm mb-4">
            Select an image from your gallery to extract receipt data
          </p>
          <div className="flex items-center justify-center space-x-2 text-primary text-sm font-medium">
            <ImageIcon className="w-4 h-4" />
            <span>Browse Gallery</span>
          </div>
        </div>

        {/* Supported Formats */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            Supports JPG, PNG, HEIC formats • Max 10MB
          </p>
        </div>

        {/* Tips */}
        <div className="mt-4 space-y-2">
          <h5 className="text-sm font-semibold text-gray-900">Tips for best results:</h5>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Ensure receipt is well-lit and clearly visible</li>
            <li>• Capture the entire receipt including totals</li>
            <li>• Avoid shadows and reflections</li>
          </ul>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isProcessing}
        />
      </div>
    </div>
  );
};