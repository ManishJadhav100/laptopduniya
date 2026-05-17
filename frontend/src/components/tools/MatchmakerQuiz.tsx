"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, CheckCircle2, Monitor, Cpu, Zap, Box, Target, ChevronLeft } from "lucide-react";
import { formatImageUrl } from "@/lib/url-utils";

interface Laptop {
  title: string;
  slug: string;
  base_price: string;
  image?: string;
  processor_type?: string;
  ram_gb?: number;
  gpu_type?: string;
  display_size?: string;
}

export default function MatchmakerQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [matching, setMatching] = useState<Laptop[]>([]);
  const [loading, setLoading] = useState(false);

  const steps = [
    {
      id: "intent",
      title: "What is your primary use case?",
      options: [
        { label: "Gaming", value: "gaming", icon: <Zap className="text-orange-500" /> },
        { label: "Professional Work", value: "business", icon: <Target className="text-blue-500" /> },
        { label: "Creative (Video/Photo)", value: "creative", icon: <Sparkles className="text-purple-500" /> },
        { label: "Daily Tasks / Student", value: "student", icon: <Monitor className="text-emerald-500" /> },
      ]
    },
    {
      id: "budget",
      title: "What is your comfortable budget range?",
      options: [
        { label: "Under ₹75,000", value: "budget", icon: "💰" },
        { label: "₹75,000 - ₹1,50,000", value: "mid", icon: "💳" },
        { label: "₹1,50,000+", value: "premium", icon: "💎" },
      ]
    },
    {
      id: "priority",
      title: "What matters most to you?",
      options: [
        { label: "Extreme Performance", value: "performance", icon: <Cpu className="text-red-500" /> },
        { label: "Battery & Portability", value: "portability", icon: <Box className="text-sky-500" /> },
        { label: "Stunning Display", value: "display", icon: <Monitor className="text-indigo-500" /> },
      ]
    }
  ];

  const handleAnswer = (value: string) => {
    const currentStepId = steps[step].id;
    setAnswers({ ...answers, [currentStepId]: value });
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      findMatches({ ...answers, [currentStepId]: value });
    }
  };

  const findMatches = async (finalAnswers: any) => {
    setLoading(true);
    setStep(steps.length); // Result Step

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";
    try {
      // Create intelligent query based on quiz
      const params = new URLSearchParams();
      if (finalAnswers.intent) params.set("category", finalAnswers.intent);
      
      if (finalAnswers.budget === "budget") params.set("price_max", "75000");
      if (finalAnswers.budget === "mid") { params.set("price_min", "75000"); params.set("price_max", "150000"); }
      if (finalAnswers.budget === "premium") params.set("price_min", "150000");

      const res = await fetch(`${baseUrl}/laptops/?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setMatching(Array.isArray(data) ? data.slice(0, 3) : (data.results?.slice(0, 3) || []));
      }
    } catch (err) {
        console.error("Matchmaker failed", err);
    } finally {
      setLoading(false);
    }
  };

  const restart = () => {
    setStep(0);
    setAnswers({});
    setMatching([]);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 lg:p-12 shadow-2xl shadow-gray-200 relative overflow-hidden min-h-[500px] flex flex-col">
        
        {/* Step Progress */}
        {step < steps.length && (
            <div className="flex gap-2 mb-10">
                {steps.map((_, i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-[#10B981]' : 'bg-gray-100'}`} />
                ))}
            </div>
        )}

        {/* Quiz Body */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
            {step < steps.length ? (
                <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <span className="text-[10px] font-black text-[#10B981] uppercase tracking-[0.3em] mb-4 block">Step {step + 1} of {steps.length}</span>
                    <h2 className="text-3xl font-black text-gray-900 mb-10 tracking-tight leading-tight">{steps[step].title}</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {steps[step].options.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => handleAnswer(opt.value)}
                                className="group bg-gray-50 border-2 border-transparent hover:border-[#10B981] hover:bg-white p-6 rounded-3xl transition-all flex items-center gap-4 text-left shadow-sm hover:shadow-xl active:scale-95"
                            >
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
                                    {opt.icon}
                                </div>
                                <span className="text-sm font-black text-gray-800 uppercase tracking-wide">{opt.label}</span>
                            </button>
                        ))}
                    </div>

                    {step > 0 && (
                        <button onClick={() => setStep(step - 1)} className="mt-10 text-gray-400 hover:text-gray-900 font-bold text-xs uppercase tracking-widest flex items-center gap-2 mx-auto">
                            <ChevronLeft size={14} /> Back
                        </button>
                    )}
                </div>
            ) : (
                <div className="w-full max-w-4xl animate-in fade-in zoom-in duration-500">
                    {loading ? (
                        <div className="flex flex-col items-center py-20">
                             <div className="w-16 h-16 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin mb-6" />
                             <h3 className="text-xl font-black text-gray-900">Finding your perfect match...</h3>
                             <p className="text-gray-400 font-bold mt-2">Analyzing hardware benchmarks and real-world results</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle2 className="w-10 h-10 text-[#10B981]" />
                            </div>
                            <h2 className="text-4xl font-black text-gray-900 mb-2 leading-tight">We found {matching.length} matches!</h2>
                            <p className="text-gray-500 font-bold mb-10 italic">Based on your {answers.intent} needs and localized budget selection.</p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-12">
                                {matching.map((laptop, i) => (
                                    <div key={laptop.slug} className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100 flex flex-col hover:shadow-xl transition-all group">
                                         <div className="w-full aspect-video mb-6 relative rounded-2xl overflow-hidden bg-white flex items-center justify-center">
                                            {laptop.image ? <img src={formatImageUrl(laptop.image)} alt={laptop.title} className="max-h-[80%] object-contain" /> : <Monitor className="w-10 h-10 text-gray-100" />}
                                            <div className="absolute top-3 left-3 bg-[#10B981] text-white text-[8px] font-black uppercase px-2 py-1 rounded-full">
                                                {i === 0 ? "Top Pick" : "Best Value"}
                                            </div>
                                         </div>
                                         <h4 className="text-sm font-black text-gray-900 mb-2 line-clamp-1 group-hover:text-[#10B981] transition-colors">{laptop.title}</h4>
                                         <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-6">
                                            {laptop.processor_type} • {laptop.ram_gb}GB RAM
                                         </p>
                                         <Link 
                                           href={`/laptops/${laptop.slug}`} 
                                           className="mt-auto bg-white text-gray-900 border border-gray-100 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#10B981] hover:text-white transition-all text-center flex items-center justify-center gap-2"
                                         >
                                            View Deal <ArrowRight size={14} />
                                         </Link>
                                    </div>
                                ))}
                                
                                {matching.length === 0 && (
                                    <div className="col-span-full py-10 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                                         <p className="text-gray-400 font-bold">No exact matches found for these specific criteria.</p>
                                         <button onClick={restart} className="text-[#10B981] font-black uppercase text-[10px] mt-2 block mx-auto underline">Try wider criteria</button>
                                    </div>
                                )}
                            </div>

                            <button onClick={restart} className="text-gray-400 hover:text-[#10B981] font-black uppercase text-[10px] tracking-[0.2em] transition-all">
                                Take Quiz Again
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>

        {/* Tech Decor */}
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-50 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none" />
    </div>
  );
}
