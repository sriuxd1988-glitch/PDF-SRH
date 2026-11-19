'use client';

import React, { useRef, useState, useEffect } from 'react';
import { PenTool, Type, Upload, RotateCcw, Check } from 'lucide-react';
import { Button } from '../button';

export interface SignaturePadProps {
  onSave: (dataUrl: string) => void;
  onCancel?: () => void;
}

export function SignaturePad({ onSave, onCancel }: SignaturePadProps) {
  const [mode, setMode] = useState<'draw' | 'type' | 'upload'>('draw');
  const [typedName, setTypedName] = useState('');
  const [selectedFont, setSelectedFont] = useState('Dancing Script');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (mode === 'draw') {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.strokeStyle = '#1A1A1C';
          ctx.lineWidth = 2.5;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
        }
      }
    }
  }, [mode]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext('2d');
      ctx?.beginPath();
      ctx?.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext('2d');
      ctx?.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx?.stroke();
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleSaveSignature = () => {
    if (mode === 'draw') {
      const canvas = canvasRef.current;
      if (canvas) {
        onSave(canvas.toDataURL('image/png'));
      }
    } else if (mode === 'type') {
      // Render typed text to temporary canvas
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = 500;
      tempCanvas.height = 150;
      const ctx = tempCanvas.getContext('2d');
      if (ctx) {
        ctx.font = `48px "${selectedFont}", cursive`;
        ctx.fillStyle = '#1A1A1C';
        ctx.fillText(typedName || 'Signer', 30, 90);
        onSave(tempCanvas.toDataURL('image/png'));
      }
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-xl max-w-lg mx-auto flex flex-col gap-6">
      {/* Modality Tabs */}
      <div className="flex items-center gap-2 p-1 rounded-2xl bg-[var(--soft)] border border-[var(--line)]">
        <button
          onClick={() => setMode('draw')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            mode === 'draw' ? 'bg-[var(--card)] text-[var(--ink)] shadow-sm' : 'text-[var(--muted)]'
          }`}
        >
          <PenTool className="w-3.5 h-3.5" /> Draw
        </button>
        <button
          onClick={() => setMode('type')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            mode === 'type' ? 'bg-[var(--card)] text-[var(--ink)] shadow-sm' : 'text-[var(--muted)]'
          }`}
        >
          <Type className="w-3.5 h-3.5" /> Type
        </button>
        <button
          onClick={() => setMode('upload')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            mode === 'upload' ? 'bg-[var(--card)] text-[var(--ink)] shadow-sm' : 'text-[var(--muted)]'
          }`}
        >
          <Upload className="w-3.5 h-3.5" /> Upload
        </button>
      </div>

      {/* Draw Area */}
      {mode === 'draw' && (
        <div className="relative border-2 border-dashed border-[var(--line)] rounded-2xl bg-white overflow-hidden">
          <canvas
            ref={canvasRef}
            width={480}
            height={200}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="w-full h-48 cursor-crosshair"
          />
          <button
            onClick={clearCanvas}
            className="absolute top-3 right-3 p-1.5 rounded-lg bg-[var(--soft)] text-[var(--muted)] hover:text-[var(--ink)] transition-colors text-xs font-bold flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Clear
          </button>
        </div>
      )}

      {/* Type Area */}
      {mode === 'type' && (
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Type your legal name"
            value={typedName}
            onChange={(e) => setTypedName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[var(--line)] bg-[var(--input)] text-base font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
          />
          <div className="grid grid-cols-2 gap-2">
            {['Dancing Script', 'Pacifico', 'Caveat', 'Great Vibes'].map((font) => (
              <button
                key={font}
                onClick={() => setSelectedFont(font)}
                style={{ fontFamily: font }}
                className={`p-3 rounded-xl border text-xl text-center transition-all ${
                  selectedFont === font
                    ? 'border-[var(--primary-500)] bg-[var(--primary-50)] text-[var(--primary-500)]'
                    : 'border-[var(--line)] bg-[var(--card)] text-[var(--ink)]'
                }`}
              >
                {typedName || 'Your Signature'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Upload Area */}
      {mode === 'upload' && (
        <div className="border-2 border-dashed border-[var(--line)] rounded-2xl p-8 text-center cursor-pointer hover:border-[var(--primary-500)] transition-colors">
          <Upload className="w-8 h-8 text-[var(--muted)] mx-auto mb-2" />
          <p className="text-xs font-bold text-[var(--ink)]">Upload transparent PNG signature</p>
          <input
            type="file"
            accept="image/png,image/jpeg"
            className="mt-3 text-xs text-[var(--muted)]"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = () => onSave(reader.result as string);
                reader.readAsDataURL(file);
              }
            }}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--line)]">
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-[var(--muted)] hover:text-[var(--ink)]"
          >
            Cancel
          </button>
        )}
        <Button
          variant="primary"
          size="md"
          onClick={handleSaveSignature}
          className="!text-white font-bold flex items-center gap-1.5 shadow-md"
        >
          <Check className="w-4 h-4 text-white" />
          <span>Apply Signature</span>
        </Button>
      </div>
    </div>
  );
}
