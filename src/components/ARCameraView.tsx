import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, Download, RotateCw, Maximize2, Move } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ARCameraViewProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string | null;
  /** Aspect ratio width/height (e.g. 210/297 for A4). Default 1. */
  aspectRatio?: number;
  /** Label shown on the floating poster (e.g. "A3 • 297 × 420 mm") */
  sizeLabel?: string;
}

/**
 * Live AR preview: opens the device camera and overlays the user's poster
 * on top of the camera feed. Drag to move, pinch / slider to resize,
 * tap "Capture" to save a snapshot.
 */
export function ARCameraView({
  open,
  onClose,
  imageUrl,
  aspectRatio = 210 / 297,
  sizeLabel,
}: ARCameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");

  // Poster overlay transform
  const [posterScale, setPosterScale] = useState(0.6); // relative to viewport min-dim
  const [posterPos, setPosterPos] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ startX: number; startY: number; baseX: number; baseY: number } | null>(null);

  // ---- Camera lifecycle -------------------------------------------------
  const startCamera = useCallback(async (mode: "environment" | "user") => {
    setError(null);
    setReady(false);
    try {
      // Stop previous stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Camera API not supported in this browser");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: mode }, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setReady(true);
      }
    } catch (e) {
      const msg =
        e instanceof Error
          ? e.name === "NotAllowedError"
            ? "Camera permission denied. Please allow camera access in your browser."
            : e.name === "NotFoundError"
              ? "No camera found on this device."
              : e.message
          : "Failed to start camera";
      setError(msg);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    startCamera(facingMode);
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, [open, facingMode, startCamera]);

  // Reset transform when (re)opening
  useEffect(() => {
    if (open) {
      setPosterScale(0.6);
      setPosterPos({ x: 0, y: 0 });
    }
  }, [open]);

  // ---- Drag to move -----------------------------------------------------
  const handlePointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      baseX: posterPos.x,
      baseY: posterPos.y,
    };
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    setPosterPos({
      x: dragRef.current.baseX + (e.clientX - dragRef.current.startX),
      y: dragRef.current.baseY + (e.clientY - dragRef.current.startY),
    });
  };
  const handlePointerUp = () => {
    dragRef.current = null;
  };

  // ---- Capture snapshot -------------------------------------------------
  const handleCapture = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !containerRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const container = containerRef.current;

    const vw = video.videoWidth;
    const vh = video.videoHeight;
    canvas.width = vw;
    canvas.height = vh;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Mirror selfie cam
    if (facingMode === "user") {
      ctx.translate(vw, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, vw, vh);
    if (facingMode === "user") ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Overlay poster — map screen coords to video coords
    if (imageUrl) {
      const containerRect = container.getBoundingClientRect();
      const scaleX = vw / containerRect.width;
      const scaleY = vh / containerRect.height;
      const minDim = Math.min(containerRect.width, containerRect.height);
      const posterH = minDim * posterScale;
      const posterW = posterH * aspectRatio;

      const cx = containerRect.width / 2 + posterPos.x;
      const cy = containerRect.height / 2 + posterPos.y;

      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject();
        img.src = imageUrl;
      }).catch(() => {});

      // White paper background
      ctx.fillStyle = "white";
      ctx.fillRect(
        (cx - posterW / 2) * scaleX,
        (cy - posterH / 2) * scaleY,
        posterW * scaleX,
        posterH * scaleY,
      );
      // Soft shadow
      ctx.shadowColor = "rgba(0,0,0,0.4)";
      ctx.shadowBlur = 30 * scaleX;
      ctx.shadowOffsetY = 10 * scaleY;
      if (img.complete && img.naturalWidth > 0) {
        ctx.drawImage(
          img,
          (cx - posterW / 2) * scaleX,
          (cy - posterH / 2) * scaleY,
          posterW * scaleX,
          posterH * scaleY,
        );
      }
      ctx.shadowColor = "transparent";
    }

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ar-preview-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Photo captured!");
    }, "image/png");
  }, [imageUrl, facingMode, posterScale, posterPos, aspectRatio]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black flex flex-col"
      >
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 z-20 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center gap-2 text-white">
            <Camera className="h-5 w-5 text-cta" />
            <span className="font-heading font-semibold">AR Wall Preview</span>
            {sizeLabel && (
              <span className="text-xs text-white/60 font-mono ml-2 hidden sm:inline">
                {sizeLabel}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Close AR view"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Camera viewport */}
        <div
          ref={containerRef}
          className="relative flex-1 overflow-hidden touch-none select-none"
        >
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            className={`absolute inset-0 w-full h-full object-cover ${
              facingMode === "user" ? "scale-x-[-1]" : ""
            }`}
          />

          {/* Loading / error overlay */}
          {!ready && !error && (
            <div className="absolute inset-0 flex items-center justify-center text-white/80">
              <div className="text-center">
                <Camera className="h-12 w-12 mx-auto mb-3 animate-pulse text-cta" />
                <p className="text-sm">Starting camera…</p>
              </div>
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div className="bg-card border border-border rounded-2xl p-6 max-w-sm text-center">
                <Camera className="h-10 w-10 mx-auto mb-3 text-destructive" />
                <p className="font-semibold text-foreground mb-2">Camera unavailable</p>
                <p className="text-sm text-muted-foreground mb-4">{error}</p>
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
          )}

          {/* Poster overlay */}
          {ready && imageUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="absolute top-1/2 left-1/2 cursor-grab active:cursor-grabbing"
              style={{
                transform: `translate(calc(-50% + ${posterPos.x}px), calc(-50% + ${posterPos.y}px))`,
                touchAction: "none",
              }}
            >
              <div
                className="bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] border-[3px] border-white relative"
                style={{
                  height: `min(${posterScale * 100}vh, ${posterScale * 100}vw)`,
                  aspectRatio: `${aspectRatio}`,
                }}
              >
                <img
                  src={imageUrl}
                  alt="Your poster in AR"
                  className="w-full h-full object-cover pointer-events-none"
                  draggable={false}
                />
                {/* Drag hint corner */}
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-cta text-cta-foreground flex items-center justify-center shadow-lg pointer-events-none">
                  <Move className="h-3.5 w-3.5" />
                </div>
              </div>
            </motion.div>
          )}

          {/* Hidden snapshot canvas */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Bottom controls */}
        {ready && (
          <div className="absolute bottom-0 left-0 right-0 z-20 p-4 pb-6 bg-gradient-to-t from-black/90 to-transparent">
            {imageUrl && (
              <div className="max-w-md mx-auto mb-4 flex items-center gap-3 bg-white/10 backdrop-blur rounded-full px-4 py-2.5">
                <Maximize2 className="h-4 w-4 text-white/70 shrink-0" />
                <input
                  type="range"
                  min={0.2}
                  max={1.5}
                  step={0.01}
                  value={posterScale}
                  onChange={(e) => setPosterScale(Number(e.target.value))}
                  className="flex-1 accent-cta"
                  aria-label="Resize poster"
                />
                <span className="text-xs font-mono text-white/70 w-10 text-right">
                  {Math.round(posterScale * 100)}%
                </span>
              </div>
            )}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setFacingMode((m) => (m === "user" ? "environment" : "user"))}
                className="w-12 h-12 rounded-full bg-white/15 backdrop-blur hover:bg-white/25 text-white flex items-center justify-center transition-colors"
                aria-label="Switch camera"
              >
                <RotateCw className="h-5 w-5" />
              </button>
              <button
                onClick={handleCapture}
                disabled={!imageUrl}
                className="w-16 h-16 rounded-full bg-white hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed text-black flex items-center justify-center shadow-2xl transition-transform active:scale-95"
                aria-label="Capture photo"
              >
                <div className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center">
                  <Camera className="h-5 w-5" />
                </div>
              </button>
              <button
                onClick={handleCapture}
                disabled={!imageUrl}
                className="w-12 h-12 rounded-full bg-white/15 backdrop-blur hover:bg-white/25 disabled:opacity-40 text-white flex items-center justify-center transition-colors"
                aria-label="Download snapshot"
              >
                <Download className="h-5 w-5" />
              </button>
            </div>
            {!imageUrl && (
              <p className="text-center text-xs text-white/60 mt-3">
                Upload a poster image first to overlay it on the camera view.
              </p>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
