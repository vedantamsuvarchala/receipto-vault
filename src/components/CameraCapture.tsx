import React, { useRef, useEffect, useState } from 'react';
import { Camera, X, RotateCcw, Zap } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
  isProcessing?: boolean;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  onCapture,
  onClose,
  isProcessing = false
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [hasCamera, setHasCamera] = useState(true);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    initializeCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setIsInitializing(false);
    } catch (error) {
      console.error('Camera access error:', error);
      setHasCamera(false);
      setIsInitializing(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    onCapture(imageData);
  };

  const handleClose = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    onClose();
  };

  if (!hasCamera) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 text-center max-w-sm mx-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Camera Access Required</h3>
          <p className="text-gray-600 text-sm mb-6">Please allow camera access to scan receipts</p>
          <button
            onClick={handleClose}
            className="w-full bg-gradient-primary text-white py-3 rounded-xl font-semibold transition-smooth"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4 text-white">
          <button
            onClick={handleClose}
            className="p-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-smooth"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-semibold">Scan Receipt</h2>
          <div className="w-10 h-10" /> {/* Spacer */}
        </div>
      </div>

      {/* Camera View */}
      <div className="relative w-full h-full">
        {isInitializing ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Camera className="w-8 h-8" />
              </div>
              <p>Initializing camera...</p>
            </div>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            
            {/* Receipt Frame Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-80 h-96 border-2 border-white border-dashed rounded-lg flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-sm opacity-75 mb-2">Position receipt within frame</div>
                  <Zap className="w-6 h-6 mx-auto opacity-75" />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/20 backdrop-blur-sm p-6">
        <div className="flex items-center justify-center space-x-8">
          <button
            onClick={initializeCamera}
            className="p-4 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors text-white"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
          
          <button
            onClick={capturePhoto}
            disabled={isInitializing || isProcessing}
            className="w-16 h-16 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
          >
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </button>
          
          <div className="w-12 h-12" /> {/* Spacer for symmetry */}
        </div>

        <div className="text-center mt-4">
          <p className="text-white text-sm opacity-75">
            Tap the button to capture your receipt
          </p>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};