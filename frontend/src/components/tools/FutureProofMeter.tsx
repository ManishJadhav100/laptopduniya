"use client";
import React from 'react';
import { ShieldCheck, Info, Gauge } from 'lucide-react';

interface FutureProofMeterProps {
  ram_gb: number;
  processor: string;
  gpu: string;
}

const FutureProofMeter: React.FC<FutureProofMeterProps> = ({ ram_gb, processor, gpu }) => {
  const cpu = processor.toLowerCase();
  const cameraProfile = gpu?.toLowerCase() || '';

  let score = 0;
  
  if (ram_gb >= 16) score += 35;
  else if (ram_gb >= 12) score += 28;
  else if (ram_gb >= 8) score += 18;
  else if (ram_gb >= 6) score += 10;

  if (cpu.includes('snapdragon 8 elite') || cpu.includes('a18') || cpu.includes('dimensity 9400')) score += 42;
  else if (cpu.includes('snapdragon 8 gen 3') || cpu.includes('a17') || cpu.includes('tensor g4') || cpu.includes('dimensity 9300')) score += 34;
  else if (cpu.includes('snapdragon 7') || cpu.includes('dimensity 8') || cpu.includes('tensor')) score += 22;
  else score += 12;

  if (cameraProfile.includes('periscope') || cameraProfile.includes('telephoto') || cameraProfile.includes('ois')) score += 12;
  else if (cameraProfile.includes('50mp') || cameraProfile.includes('triple')) score += 8;
  else if (cameraProfile) score += 4;

  if (cpu.includes('a18') || cpu.includes('snapdragon 8') || cpu.includes('dimensity 9400') || cpu.includes('tensor g4')) score += 8;

  const finalScore = Math.min(score, 100);
  const years = (finalScore / 22).toFixed(1);

  const getHealthColor = () => {
    if (finalScore > 75) return 'text-emerald-500';
    if (finalScore > 50) return 'text-blue-500';
    if (finalScore > 25) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 relative overflow-hidden group shadow-2xl">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981] opacity-5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:opacity-20 transition-opacity" />
      
      <div className="flex items-center justify-between mb-8">
         <div className="flex flex-col">
            <h4 className="text-[9px] font-black text-[#10B981] uppercase tracking-[0.4em] mb-1">Longevity Analysis</h4>
            <h3 className="text-xl font-black text-white tracking-tight leading-none">Future-Proof Score</h3>
         </div>
         <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
            <Gauge className="text-[#10B981] w-6 h-6" />
         </div>
      </div>

      <div className="flex items-end gap-3 mb-8">
         <span className={`text-6xl font-black leading-none ${getHealthColor()}`}>{finalScore}</span>
         <div className="flex flex-col mb-1">
            <span className="text-white/40 text-[10px] font-black uppercase tracking-tighter">Longevity Rating</span>
            <span className="text-emerald-400 text-xs font-black uppercase tracking-widest leading-none">Top Tier</span>
         </div>
      </div>

      <div className="space-y-6">
         <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-[9px] font-black text-white/60 uppercase tracking-widest">
               <span>Comfort Window</span>
               <span className="text-white">~{years} Years</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/10">
               <div 
                 className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all duration-1000" 
                 style={{ width: `${finalScore}%` }}
               />
            </div>
         </div>

         <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-start gap-3">
            <Info size={14} className="text-[#10B981] shrink-0 mt-0.5" />
            <p className="text-[10px] font-bold text-gray-400 leading-relaxed italic">
               Calculated from chipset tier, RAM headroom, and premium camera hardware that usually tracks longer software support cycles.
            </p>
         </div>

         <div className="flex items-center gap-2 text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">
            <ShieldCheck size={12} className="text-[#10B981]"/> Verified Mobile Outlook
         </div>
      </div>
    </div>
  );
};

export default FutureProofMeter;
