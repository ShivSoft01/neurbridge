import React, { useState, useRef, useEffect } from 'react';
import { Save, Trash2, Download, Share2 } from 'lucide-react';
import theme from '../../theme';

interface DrawingPoint {
  x: number;
  y: number;
  color: string;
  size: number;
}

function CreativeQuest() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [drawingHistory, setDrawingHistory] = useState<DrawingPoint[]>([]);
  const [story, setStory] = useState('');
  const [showStoryPrompt, setShowStoryPrompt] = useState(false);

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFFFFF'
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Set initial canvas style
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.stroke();

    setDrawingHistory(prev => [...prev, { x, y, color: currentColor, size: brushSize }]);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setDrawingHistory([]);
  };

  const saveDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'creative-quest-drawing.png';
    link.href = dataUrl;
    link.click();
  };

  const handleStorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowStoryPrompt(false);
    // Here you would typically save the story along with the drawing
  };

  return (
    <div className="p-8 ml-64 min-h-screen" style={{ background: theme.primary }}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: theme.text }}>
            Creative Quest
          </h1>
          <p className="mt-2" style={{ color: theme.text }}>
            Express yourself through art and storytelling! 🎨
          </p>
        </div>

        {/* Drawing Tools */}
        <div className="bg-white rounded-xl p-6 mb-8">
          <div className="flex flex-wrap gap-4 mb-4">
            {colors.map(color => (
              <button
                key={color}
                onClick={() => setCurrentColor(color)}
                className={`w-8 h-8 rounded-full border-2 ${
                  currentColor === color ? 'border-gray-400' : 'border-transparent'
                }`}
                style={{ background: color }}
              />
            ))}
          </div>
          <div className="flex items-center gap-4">
            <label className="text-sm text-gray-600">Brush Size:</label>
            <input
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={e => setBrushSize(Number(e.target.value))}
              className="w-32"
            />
          </div>
        </div>

        {/* Canvas */}
        <div className="bg-white rounded-xl p-6 mb-8">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            className="w-full h-96 border border-gray-200 rounded-lg cursor-crosshair"
          />
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <button
              onClick={clearCanvas}
              className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
            >
              <Trash2 className="w-6 h-6" />
            </button>
            <button
              onClick={() => setShowStoryPrompt(true)}
              className="px-4 py-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200"
            >
              Add Story
            </button>
          </div>
          <div className="flex gap-4">
            <button
              onClick={saveDrawing}
              className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200"
            >
              <Download className="w-6 h-6" />
            </button>
            <button
              className="p-2 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200"
            >
              <Share2 className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Story Prompt Modal */}
        {showStoryPrompt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Tell Your Story</h2>
              <form onSubmit={handleStorySubmit}>
                <textarea
                  value={story}
                  onChange={e => setStory(e.target.value)}
                  placeholder="Write a story about your drawing..."
                  className="w-full h-32 p-4 border border-gray-200 rounded-lg mb-4"
                />
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowStoryPrompt(false)}
                    className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg text-white font-medium transition-colors duration-200"
                    style={{ background: theme.secondary }}
                  >
                    Save Story
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreativeQuest; 