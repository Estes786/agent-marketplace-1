
import React, { useState } from 'react';
import { gemini } from '../services/geminiService';

const MediaLab: React.FC = () => {
  // Video Analysis State
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPrompt, setVideoPrompt] = useState('Summarize the key events and visual details of this video for technical analysis.');
  const [videoResult, setVideoResult] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Image Generation State
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "16:9" | "9:16">("1:1");

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleVideoAnalyze = async () => {
    if (!videoFile) return;
    setIsAnalyzing(true);
    setVideoResult('');
    try {
      const base64 = await fileToBase64(videoFile);
      const res = await gemini.analyzeVideo(videoPrompt || "Summarize the key events and visual details of this video for technical analysis.", base64, videoFile.type);
      setVideoResult(res);
    } catch (e) {
      setVideoResult("Analysis failed. Ensure file size is within limits.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageGenerate = async () => {
    if (!imagePrompt) return;
    
    // Check for API Key selection (Required for Gemini 3 Pro Image)
    if (window.aistudio && !(await window.aistudio.hasSelectedApiKey())) {
      await window.aistudio.openSelectKey();
      // Proceed after triggering
    }

    setIsGenerating(true);
    setGeneratedImage('');
    try {
      const url = await gemini.generateImage(imagePrompt, { aspectRatio, imageSize });
      setGeneratedImage(url);
    } catch (e) {
      console.error(e);
      alert("Generation failed. Please ensure a valid paid API key is selected.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Hypha Media Studio</h2>
        <p className="text-slate-400">Advanced Intelligence for Visual Orchestration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Video Understanding (Gemini 3.1 Pro) */}
        <div className="glass rounded-3xl p-8 flex flex-col border border-indigo-500/10 hover:border-indigo-500/20 transition-all">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-violet-600/20 rounded-xl flex items-center justify-center text-xl">🎬</div>
            <div>
              <h3 className="font-bold text-white">Video Intelligence</h3>
              <p className="text-[10px] text-slate-500 uppercase font-mono tracking-widest">Model: gemini-3.1-pro-preview</p>
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div className="border-2 border-dashed border-slate-800 rounded-2xl p-8 text-center bg-slate-900/30">
              <input 
                type="file" 
                accept="video/*" 
                className="hidden" 
                id="video-upload" 
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              />
              <label htmlFor="video-upload" className="cursor-pointer group">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📁</div>
                <p className="text-sm text-slate-300 font-medium">
                  {videoFile ? videoFile.name : 'Click to upload video for analysis'}
                </p>
                <p className="text-[10px] text-slate-500 mt-1">MP4, WEBM, MOV supported</p>
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block ml-1">Analysis Instructions</label>
              <textarea
                value={videoPrompt}
                onChange={(e) => setVideoPrompt(e.target.value)}
                placeholder="What should I look for in this video? (e.g., detect movements, summarize events, identify objects...)"
                className="w-full h-24 bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:ring-2 focus:ring-violet-500 outline-none resize-none shadow-inner"
              />
            </div>

            <button
              onClick={handleVideoAnalyze}
              disabled={!videoFile || isAnalyzing}
              className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold transition-all disabled:opacity-50 shadow-lg shadow-violet-600/20"
            >
              {isAnalyzing ? 'Processing Intelligence...' : 'Analyze Content'}
            </button>

            {videoResult && (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 max-h-40 overflow-y-auto shadow-inner">
                <p className="text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-wrap">{videoResult}</p>
              </div>
            )}
          </div>
        </div>

        {/* Image Generation (Gemini 3 Pro Image) */}
        <div className="glass rounded-3xl p-8 flex flex-col border border-emerald-500/10 hover:border-emerald-500/20 transition-all">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-600/20 rounded-xl flex items-center justify-center text-xl">🖼️</div>
            <div>
              <h3 className="font-bold text-white">Nano Banana Studio</h3>
              <p className="text-[10px] text-slate-500 uppercase font-mono tracking-widest">Model: gemini-3-pro-image-preview</p>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block ml-1">Cinematic Prompt</label>
              <textarea
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="Describe the cinematic asset to generate..."
                className="w-full h-24 bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none resize-none shadow-inner"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-slate-500 uppercase font-bold mb-1 block">Aspect Ratio</label>
                <select 
                  value={aspectRatio} 
                  onChange={(e) => setAspectRatio(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
                >
                  <option value="1:1">1:1 Square</option>
                  <option value="16:9">16:9 Cinema</option>
                  <option value="9:16">9:16 Portrait</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-slate-500 uppercase font-bold mb-1 block">Resolution (High IQ)</label>
                <select 
                  value={imageSize} 
                  onChange={(e) => setImageSize(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
                >
                  <option value="1K">1K (Standard)</option>
                  <option value="2K">2K (High Def)</option>
                  <option value="4K">4K (Ultra High)</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleImageGenerate}
              disabled={!imagePrompt || isGenerating}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all disabled:opacity-50 shadow-lg shadow-emerald-600/20"
            >
              {isGenerating ? 'Synthesizing 4.0...' : 'Generate 4K Asset'}
            </button>

            {generatedImage && (
              <div className="rounded-xl overflow-hidden border border-slate-800 shadow-2xl animate-in zoom-in-95 duration-500">
                <img src={generatedImage} alt="Generated" className="w-full h-auto" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaLab;
