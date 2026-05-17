import { User } from "lucide-react";
import { formatImageUrl } from "@/lib/url-utils";

interface AuthorProps {
  author?: {
    name: string;
    bio: string;
    designation: string;
    profile_image: string | null;
  };
}

export default function AuthorBox({ author }: AuthorProps) {
  if (!author) return null;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-sm my-12">
      <div className="w-20 h-20 rounded-full bg-[#10B981] bg-opacity-10 flex items-center justify-center shrink-0 overflow-hidden border-2 border-white shadow-md">
        {author.profile_image ? (
          <img src={formatImageUrl(author.profile_image)} alt={author.name} className="w-full h-full object-cover" />
        ) : (
          <User className="w-10 h-10 text-[#10B981]" />
        )}
      </div>
      <div className="flex flex-col text-center sm:text-left">
        <div className="flex flex-col mb-2">
           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Written By</span>
           <h4 className="text-xl font-black text-gray-900">{author.name}</h4>
           <span className="text-xs font-bold text-[#10B981] uppercase">{author.designation}</span>
        </div>
        <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-2xl">
          {author.bio}
        </p>
      </div>
    </div>
  );
}
