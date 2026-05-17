"use client";
import React, { useState, useEffect } from 'react';
import { Star, Send, ShieldCheck, Loader2 } from 'lucide-react';
import { getApiUrl } from "@/lib/api";

interface UserReview {
  id: number;
  user_name: string;
  rating: number;
  content: string;
  created_at: string;
}

export function ReviewSystem({ laptopId }: { laptopId: number }) {
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [formData, setFormData] = useState({ user_name: '', rating: 5, content: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(getApiUrl(`/user-reviews/?laptop=${laptopId}`))
      .then(res => res.json())
      .then(data => setReviews(data.results || data));
  }, [laptopId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(getApiUrl(`/user-reviews/`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, laptop: laptopId }),
      });
      
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(data.content?.[0] || "Failed to submit review.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-gray-900 p-8 text-white flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black italic tracking-tight uppercase">User Experience</h3>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">Real ratings from verified owners</p>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-3xl font-black text-[#10B981]">
             {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : "0.0"}
           </span>
           <Star className="text-[#10B981] fill-[#10B981] w-6 h-6" />
        </div>
      </div>

      <div className="p-8">
        <div className="space-y-6 mb-12">
           {reviews.length > 0 ? reviews.map(r => (
             <div key={r.id} className="border-b border-gray-50 pb-6 last:border-0">
               <div className="flex justify-between items-start mb-2">
                 <span className="font-black text-gray-900 text-sm tracking-tight">{r.user_name}</span>
                 <div className="flex gap-0.5">
                   {[...Array(5)].map((_, i) => (
                     <Star key={i} size={12} className={i < r.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"} />
                   ))}
                 </div>
               </div>
               <p className="text-sm font-bold text-gray-500 leading-relaxed italic">"{r.content}"</p>
             </div>
           )) : (
             <p className="text-center py-10 text-gray-400 font-black uppercase text-xs tracking-widest">No reviews yet. Be the first!</p>
           )}
        </div>

        <div className="bg-gray-50 rounded-[2rem] p-8 border border-gray-100">
          {submitted ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-[#10B981] text-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                 <ShieldCheck size={32} />
              </div>
              <h4 className="text-xl font-black text-gray-900 mb-2">Review Submitted!</h4>
              <p className="text-sm font-bold text-gray-500">Our team will approve it shortly. Thanks for your contribution!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">Write a Review</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Your Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. Rahul S."
                      className="w-full bg-white border border-gray-200 rounded-xl px-5 py-4 outline-none focus:border-[#10B981] font-bold text-sm"
                      value={formData.user_name}
                      onChange={e => setFormData({...formData, user_name: e.target.value})}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Rating</label>
                    <select 
                      className="w-full bg-white border border-gray-200 rounded-xl px-5 py-4 outline-none focus:border-[#10B981] font-black text-sm uppercase"
                      value={formData.rating}
                      onChange={e => setFormData({...formData, rating: parseInt(e.target.value)})}
                    >
                      {[5,4,3,2,1].map(v => <option key={v} value={v}>{v} Stars</option>)}
                    </select>
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Detailed Feedback</label>
                 <textarea 
                   required
                   placeholder="How is the battery? Any heating issues?"
                   className="w-full bg-white border border-gray-200 rounded-xl px-5 py-4 outline-none focus:border-[#10B981] font-bold text-sm min-h-[100px]"
                   value={formData.content}
                   onChange={e => setFormData({...formData, content: e.target.value})}
                 />
              </div>

              {error && <p className="text-red-500 font-black text-[10px] uppercase tracking-widest">{error}</p>}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gray-900 text-white font-black py-5 rounded-xl text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-gray-200"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : <><Send size={16} /> Post My Review</>}
              </button>
              <p className="text-[9px] text-center text-gray-400 font-extrabold uppercase items-center flex justify-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#10B981]" /> Moderated: Links are forbidden
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export function CommentSystem({ contentType, objectId }: { contentType: string, objectId: number }) {
  const [comments, setComments] = useState<any[]>([]);
  const [formData, setFormData] = useState({ user_name: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(getApiUrl(`/comments/?content_type=${contentType}&object_id=${objectId}`))
      .then(res => res.json())
      .then(data => setComments(data.results || data));
  }, [contentType, objectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(getApiUrl(`/comments/`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, content_type: contentType, object_id: objectId }),
      });
      
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(data.content?.[0] || "Failed to submit comment.");
      }
    } catch (err) {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16 pt-16 border-t border-gray-100">
       <h3 className="text-3xl font-black italic tracking-tight uppercase mb-10 decoration-[#10B981] underline decoration-4 underline-offset-8">Community Discussion</h3>
       
       <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-7 space-y-8">
             {comments.length > 0 ? comments.map(c => (
               <div key={c.id} className="bg-white p-6 rounded-2xl border border-gray-50 shadow-sm">
                  <span className="text-[10px] font-black text-[#10B981] uppercase tracking-widest block mb-2">{c.user_name}</span>
                  <p className="text-sm font-bold text-gray-700 leading-relaxed italic">"{c.content}"</p>
                  <span className="text-[9px] font-black text-gray-400 uppercase block mt-4 tracking-tighter">
                    {new Date(c.created_at).toLocaleDateString()}
                  </span>
               </div>
             )) : (
               <div className="py-12 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center">
                  <p className="text-gray-400 font-black uppercase text-[10px] tracking-[0.2em]">No comments yet</p>
               </div>
             )}
          </div>

          <div className="md:col-span-5">
             <div className="bg-gray-900 text-white rounded-[2.5rem] p-10 sticky top-32 shadow-2xl">
                {submitted ? (
                  <div className="text-center">
                    <ShieldCheck size={48} className="text-[#10B981] mx-auto mb-4" />
                    <h4 className="text-xl font-black mb-2 uppercase italic">Success!</h4>
                    <p className="text-xs font-bold text-gray-400">Your comment is pending admin approval. It will appear once verified.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <h4 className="text-sm font-black text-[#10B981] uppercase tracking-widest leading-none">Share Your Thoughts</h4>
                    
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block">Display Name</label>
                       <input 
                         required
                         className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:border-[#10B981] outline-none font-bold text-xs" 
                         placeholder="Enter name"
                         value={formData.user_name}
                         onChange={e => setFormData({...formData, user_name: e.target.value})}
                       />
                    </div>
                    
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block">Your Comment</label>
                       <textarea 
                         required
                         className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:border-[#10B981] outline-none font-bold text-xs min-h-[120px]" 
                         placeholder="What do you think?"
                         value={formData.content}
                         onChange={e => setFormData({...formData, content: e.target.value})}
                       />
                    </div>

                    {error && <p className="text-red-400 text-[10px] font-black uppercase">{error}</p>}

                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-[#10B981] text-white font-black py-4 rounded-xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                      {loading ? <Loader2 className="animate-spin" size={14} /> : <><Send size={14} /> Submit Comment</>}
                    </button>
                    <p className="text-[9px] text-gray-500 font-bold text-center">Admin moderated system.</p>
                  </form>
                )}
             </div>
          </div>
       </div>
    </div>
  );
}
