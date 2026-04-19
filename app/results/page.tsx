"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Sparkles, Utensils, Banknote, Lightbulb, Beer } from "lucide-react";

function Content() {
  const params = useSearchParams();
  const router = useRouter();
  const [data, setData] = useState<{shops: any[], suggestion: any, loading: boolean}>({ shops: [], suggestion: null, loading: true });

  useEffect(() => {
    async function init() {
      try {
        const sRes = await fetch("/api/suggest", { method: "POST", body: JSON.stringify(Object.fromEntries(params)) });
        const sugg = sRes.ok ? await sRes.json() : { keyword: "居酒屋", reason: "近くのおすすめをリサーチしました" };
        const hRes = await fetch(`/api/shops?lat=${params.get("lat")}&lng=${params.get("lng")}&keyword=${encodeURIComponent(sugg.keyword)}`);
        const shops = await hRes.json();
        setData({ shops: Array.isArray(shops) ? shops : [], suggestion: sugg, loading: false });
      } catch (e) { setData(d => ({ ...d, loading: false, shops: [] })); }
    }
    init();
  }, [params]);

  if (data.loading) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10 text-center">
      <div className="w-20 h-20 border-4 border-[#333] rounded-full flex items-center justify-center animate-bounce shadow-[6px_6px_0px_#FFD700]"><Lightbulb size={40}/></div>
      <p className="mt-8 text-2xl font-black italic text-[#333]">研究員が厳選中...</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#FDFDFD] p-4 pb-20 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => router.back()} className="p-3 bg-white rounded-xl border-4 border-[#333] shadow-[4px_4px_0px_#333] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"><ArrowLeft size={24}/></button>
        <Beer className="text-yellow-400" size={40} />
      </div>

      {data.suggestion && (
        <div className="bg-[#FFEE00] border-4 border-[#333] p-6 rounded-[2.5rem] mb-12 shadow-[8px_8px_0px_#333] relative">
          <div className="absolute -top-4 -left-2 bg-white border-2 border-[#333] px-3 py-1 rounded-full text-xs font-black">LAB REPORT</div>
          <h2 className="text-2xl font-black mb-2 flex items-center gap-2 mt-2"><Sparkles size={20}/> {data.suggestion.keyword}</h2>
          <p className="font-bold text-sm opacity-80 leading-relaxed">{data.suggestion.reason}</p>
        </div>
      )}

      <div className="grid gap-10">
        {data.shops.length > 0 ? data.shops.map((shop: any) => (
          <div key={shop.id} className="bg-white border-4 border-[#333] rounded-[3rem] overflow-hidden shadow-[12px_12px_0px_#333] transition-all">
            <div className="relative h-64 border-b-4 border-[#333]">
              <img src={shop.photo.pc.l} className="w-full h-full object-cover" alt={shop.name} />
              <div className="absolute top-4 right-4 bg-[#FFEE00] border-2 border-[#333] px-4 py-1 rounded-full text-[10px] font-black">{shop.genre.name}</div>
            </div>
            <div className="p-8 space-y-4">
              <h3 className="text-2xl font-black tracking-tighter">{shop.name}</h3>
              <div className="flex items-center gap-2 text-gray-500 text-xs font-bold"><MapPin size={14} className="text-red-400 shrink-0"/>{shop.address}</div>
              <p className="font-bold text-sm text-gray-600 line-clamp-2 leading-relaxed italic">「{shop.catch}」</p>
              
              <div className="flex gap-4 pt-4 border-t-2 border-dashed border-gray-200">
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-xl border-2 border-[#333] text-xs font-black"><Banknote size={16}/>{shop.budget.name}</div>
                <div className="flex items-center gap-2 bg-green-100 px-3 py-2 rounded-xl border-2 border-[#333] text-xs font-black"><Utensils size={16}/>{shop.capacity}席</div>
              </div>

              <a href={shop.urls.pc} target="_blank" rel="noopener noreferrer" className="block w-full bg-[#333] text-white text-center py-5 rounded-2xl font-black text-xl mt-6 shadow-[6px_6px_0px_#FFD700] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all">
                この店に決める（予約）
              </a>
            </div>
          </div>
        )) : (
          <div className="text-center py-20 font-black text-gray-300 italic text-2xl">
            近くに良い研究対象がありませんでした...
          </div>
        )}
      </div>
    </main>
  );
}
export default function Page() { return <Suspense fallback={null}><Content /></Suspense>; }
