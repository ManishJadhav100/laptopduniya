"use client";
import React from 'react';
import { CheckCircle2, AlertCircle, XCircle, Video, Layout, FileText, Camera } from 'lucide-react';

interface SoftwareCompatibilityProps {
  ram_gb: number;
  processor: string;
}

const SoftwareCompatibility: React.FC<SoftwareCompatibilityProps> = ({ ram_gb, processor }) => {
  const cpu = processor.toLowerCase();
  
  const flagshipChip =
    cpu.includes('snapdragon 8') ||
    cpu.includes('a18') ||
    cpu.includes('a17') ||
    cpu.includes('dimensity 9400') ||
    cpu.includes('tensor g4');

  const premiumChip =
    flagshipChip ||
    cpu.includes('dimensity 9300') ||
    cpu.includes('snapdragon 7+') ||
    cpu.includes('snapdragon 7s');

  const apps = [
    {
      name: '4K Video + Reels Editing',
      icon: <Video size={14} />,
      check: () => (ram_gb >= 12 && premiumChip),
      min: '12GB RAM + Modern flagship chip'
    },
    {
      name: 'BGMI / COD Mobile Sessions',
      icon: <Layout size={14} />,
      check: () => (ram_gb >= 8 && premiumChip),
      min: '8GB RAM + gaming-ready chip'
    },
    {
      name: 'Camera + Social Workflow',
      icon: <Camera size={14} />,
      check: () => (ram_gb >= 8),
      min: '8GB RAM'
    },
    {
      name: 'Maps + Travel + Payments',
      icon: <FileText size={14} />,
      check: () => (ram_gb >= 6),
      min: '6GB RAM'
    },
    {
      name: 'Heavy Multitasking',
      icon: <Layout size={14} />,
      check: () => (ram_gb >= 12 && premiumChip),
      min: '12GB RAM'
    },
  ];

  const getStatus = (check: () => boolean) => {
    if (check()) return { label: 'Smooth', color: 'text-green-500', icon: <CheckCircle2 size={16} />, bg: 'bg-green-50' };
    if (ram_gb >= 8) return { label: 'Manageable', color: 'text-orange-500', icon: <AlertCircle size={16} />, bg: 'bg-orange-50' };
    return { label: 'Limited', color: 'text-red-500', icon: <XCircle size={16} />, bg: 'bg-red-50' };
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm overflow-hidden relative">
      <div className="flex flex-col mb-6">
        <h4 className="text-[10px] font-black text-[#10B981] uppercase tracking-[0.3em] mb-1">Use Case Checker</h4>
        <h3 className="text-lg font-black text-gray-900 tracking-tight leading-none">Can it handle your phone routine?</h3>
      </div>
      
      <div className="space-y-4">
        {apps.map((app) => {
          const status = getStatus(app.check);
          return (
            <div key={app.name} className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${status.bg} border-transparent hover:border-gray-100 group`}>
              <div className="flex items-center gap-3">
                <div className="text-gray-400 group-hover:text-[#10B981] transition-colors">
                  {app.icon}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-700">{app.name}</span>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Min: {app.min}</span>
                </div>
              </div>
              <div className={`flex items-center gap-1.5 ${status.color} font-black text-[10px] uppercase tracking-tighter whitespace-nowrap`}>
                {status.icon}
                <span className="hidden sm:inline">{status.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SoftwareCompatibility;
