"use client";
import { useRouter } from "next/navigation";
import { Users, Beer, Wine, GlassWater, Search, Lightbulb, Pizza, Cocktail } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ members: "3", previousDrink: "ビール", budget: "3000" });

  const handleSearch = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const params = new URLSearchParams({ ...formData, lat: String(p.coords.latitude), lng: String(p.coords.longitude) });
        router.push(`/results?${params.toString()}`);
      },
      () => {
        const params = new URLSearchParams({ ...formData, lat: "35.6812", lng: "139.7671" });
        router.push(`/results?${params.toString()}`);
      },
      { timeout: 5000 }
    );
  };

  return (
    <main className="min-h-screen bg-white relative overflow-hidden flex flex-col items-center justify-center p-6">
      <div className="absolute top-0 left-0 w-full h-full bg-dot opacity-10 pointer-events-none"></div>
      
      {/* 散りばめられたお酒アイコン */}
      <Beer className="absolute top-[10%] left-[10%] text-yellow-400 opacity-20 animate-float" size={60} />
      <Wine className="absolute top-[20%] right-[15%] text-red-400 opacity-20 animate-float-delayed" size={50} />
      <Cocktail className="absolute bottom-[15%] left-[15%] text-pink-400 opacity-20 animate-float-delayed" size={70} />
      <Pizza className="absolute bottom-[20%] right-[10%] text-orange-400 opacity-20 animate-float" size={50} />

      <div className="max-w-md w-full relative z-10 space-y-10">
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 border-4 border-[#333] rounded-full flex items-center justify-center bg-white shadow-[6px_6px_0px_#FFD700] mb-6">
            <Lightbulb size={48} className="text-[#333]" />
          </div>
          <h1 className="text-4xl font-black text-[#333] tracking-tighter">
            <span className="yellow-highlight">2軒目研究所</span>
          </h1>
          <p className="text-gray-500 font-bold mt-2">AIが導く、今夜の最終地点。</p>
        </div>

        <div className="bg-white lab-card p-8 space-y-8">
          <div className="space-y-6 font-black">
            <div className="flex items-center gap-4 border-b-4 border-[#333] pb-2">
              <Users className="text-pink-500" size={28} />
              <div className="flex-1">
                <p className="text-[10px] text-gray-400 uppercase">Party Size</p>
                <input type="number" value={formData.members} onChange={e => setFormData({...formData, members: e.target.value})} className="w-full text-3xl outline-none bg-transparent" />
              </div>
              <span className="text-xl">名様</span>
            </div>
            <div className="flex items-center gap-4 border-b-4 border-[#333] pb-2">
              <Beer className="text-orange-400" size={28} />
              <div className="flex-1">
                <p className="text-[10px] text-gray-400 uppercase">Last Drink</p>
                <input type="text" value={formData.previousDrink} onChange={e => setFormData({...formData, previousDrink: e.target.value})} className="w-full text-xl outline-none bg-transparent" placeholder="何を飲んだ？" />
              </div>
            </div>
          </div>
          <button onClick={handleSearch} disabled={loading} className="w-full h-20 bg-[#FFEE00] border-4 border-[#333] rounded-2xl font-black text-2xl flex items-center justify-center gap-3 shadow-[8px_8px_0px_#333] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all">
            {loading ? <div className="animate-spin rounded-full h-8 w-8 border-4 border-white/30 border-t-[#333]" /> : <><Search size={32} strokeWidth={4} /><span>お店を探す</span></>}
          </button>
        </div>
      </div>
    </main>
  );
}
