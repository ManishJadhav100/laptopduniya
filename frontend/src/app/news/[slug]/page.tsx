import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, ArrowLeft, Tag, Share2, Link as LinkIcon, Laptop } from 'lucide-react';
import AuthorBox from '@/components/AuthorBox';
import { CommentSystem } from '@/components/ReviewSystem';
import { formatImageUrl } from '@/lib/url-utils';
import ShareButtons from '@/components/ShareButtons';

import { fetchApiJson, fetchApiList } from "@/lib/api";

async function getNewsArticle(slug: string) {
  return fetchApiJson<any>(`/news/${slug}/`, { next: { revalidate: 300 } });
}

async function getRelatedLaptops() {
    return fetchApiList<any>("/laptops/?limit=6", { next: { revalidate: 300 } });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const article = await getNewsArticle(resolvedParams.slug);
  if (!article) return { title: 'Article Not Found' };
  return {
    title: article.meta_title || `${article.title} - Laptop Duniya News`,
    description: article.meta_description,
  };
}

export default async function NewsSinglePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const article = await getNewsArticle(resolvedParams.slug);
  const relatedLaptops = await getRelatedLaptops();

  if (!article) {
    return <div className="py-20 text-center"><h1 className="text-2xl font-bold">Article not found.</h1></div>;
  }

  return (
    <div className="bg-[#fcfdfd] min-h-screen font-sans">
      <article className="max-w-[1140px] mx-auto px-4 py-12 flex flex-col lg:flex-row gap-12">
        
        {/* Main Content Area */}
        <div className="lg:col-span-8 flex-1">
           <Link href="/news" className="inline-flex items-center text-[11px] font-black text-gray-400 hover:text-[#10B981] transition-colors mb-8 uppercase tracking-widest">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to News Hub
           </Link>
           
           <div className="mb-8 border-b border-gray-100 pb-10">
              <span className="bg-[#10B981] text-white text-[10px] font-black px-3 py-1 rounded shadow-sm uppercase mb-6 inline-block tracking-widest">
                 {article.category || 'Industry News'}
              </span>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight leading-tight mb-8">
                 {article.title}
              </h1>
              
              <div className="flex items-center justify-between border-y border-gray-50 py-4">
                 <div className="flex items-center gap-4">
                    <div className="flex items-center text-gray-500 font-bold text-xs">
                       <Clock className="w-4 h-4 mr-2 text-[#10B981]" />
                       {new Date(article.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-gray-400 uppercase hidden sm:block">Share Article</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 hover:text-blue-400 cursor-pointer"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 hover:text-blue-600 cursor-pointer"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                    <LinkIcon className="w-4 h-4 text-gray-400 hover:text-gray-900 cursor-pointer" />
                 </div>
              </div>
           </div>

           {article.image && (
              <div className="w-full aspect-[21/9] bg-gray-50 rounded-2xl mb-12 overflow-hidden border border-gray-100 shadow-sm">
                 <img src={formatImageUrl(article.image)} alt={article.title} className="w-full h-full object-cover" />
              </div>
           )}

           <div className="prose prose-lg prose-emerald max-w-none text-gray-700 leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: article.content }} />
           
            {/* Reusable Author Box Component */}
            <AuthorBox author={article.author} />

            {/* Site Comments - NEW */}
            <CommentSystem contentType="core.news" objectId={article.id} />
        </div>

        {/* Technical Sidebar */}
        <div className="w-full lg:w-[350px] flex flex-col gap-10">
           
           {/* Featured Products Mentioned */}
           <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <h3 className="bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest px-6 py-4">Recommended Products</h3>
              <div className="p-6 flex flex-col gap-6">
                 {relatedLaptops.slice(0, 6).map((l: any, i: number) => (
                    <Link href={`/laptops/${l.slug}`} key={i} className="flex gap-4 group">
                       <div className="w-20 h-16 bg-[#fafafa] border border-gray-100 rounded flex items-center justify-center shrink-0 group-hover:border-[#10B981] transition-colors overflow-hidden">
                          {l.image ? <img src={formatImageUrl(l.image)} className="w-full h-full object-contain" /> : <Laptop size={20} className="text-gray-300" />}
                       </div>
                       <div className="flex flex-col gap-1">
                          <h4 className="text-xs font-black text-gray-800 group-hover:text-[#10B981] leading-tight transition-colors line-clamp-2">{l.title}</h4>
                          <span className="text-sm font-black text-[#10B981]">₹{l.base_price}</span>
                       </div>
                    </Link>
                 ))}
              </div>
              <Link href="/laptops" className="block text-center bg-gray-50 py-4 text-[10px] font-black uppercase text-gray-500 hover:text-[#10B981] border-t border-gray-100 transition-colors">
                 Browse all laptop deals
              </Link>
           </div>

           <ShareButtons title={article.title} shareText="Share This Story" />

           {/* Quick Newsletter Box */}
           <div className="bg-[#10B981] bg-opacity-5 border border-[#10B981] border-opacity-10 rounded-2xl p-8 text-center flex flex-col items-center">
              <Share2 className="w-10 h-10 text-[#10B981] mb-4" />
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-wide mb-2">Subscribe to News</h4>
              <p className="text-[11px] text-gray-500 font-bold mb-6">Get the latest launches delivered to your inbox daily.</p>
              <input type="text" placeholder="Your Email Address" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-xs mb-3 outline-none focus:border-[#10B981]" />
              <button className="w-full bg-[#10B981] text-white font-black py-3 rounded-lg text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20">Join Hub</button>
           </div>

        </div>
      </article>
    </div>
  );
}
