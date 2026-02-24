"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
// 1. 데이터 창고 불러오기
import { PROJECTS_DATA } from './data'; 

export default function StudioMuhae() {
  const [activeProject, setActiveProject] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const xPosRef = useRef(0);

  // 2. 창고 데이터를 무한 루프용으로 복제
  const projects = [...PROJECTS_DATA, ...PROJECTS_DATA];

  // 🤖 자동 무한 루프 로직 (유지)
  useEffect(() => {
    const loop = () => {
      if (scrollRef.current && !activeProject) {
        xPosRef.current += 1.2;
        if (scrollRef.current && xPosRef.current >= scrollRef.current.scrollWidth / 2) {
          xPosRef.current = 0;
        }
        if (scrollRef.current) scrollRef.current.scrollLeft = xPosRef.current;
      }
      requestRef.current = requestAnimationFrame(loop);
    };
    requestRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [activeProject]);

  // 🖱️ 휠 제어 (유지)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        xPosRef.current += e.deltaY * 6;
        el.scrollLeft = xPosRef.current;
      }
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <div className="relative h-screen w-screen bg-black text-white overflow-hidden font-sans select-none">
      
      {/* 🎥 배경 비디오 레이어 */}
      <div className="fixed inset-0 z-0 bg-black">
        <AnimatePresence mode="wait">
          <motion.video
            key={activeProject ? activeProject.video : 'default'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            autoPlay muted loop playsInline
            className="w-full h-full object-cover"
          >
            {/* 여기 아래 주소를 Cloudinary 주소로 교체! */}
            <source src={activeProject ? activeProject.video : 'https://res.cloudinary.com/...여러분의_main_bg_주소'} type="video/mp4" />
          </motion.video>
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/40 z-10" />
      </div>
      
      {/* 🏛️ 중앙 로고 및 태그라인 */}
      <main className="fixed inset-0 z-20 flex flex-col items-center justify-center pointer-events-none px-6 text-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: -60, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          <div className="w-[70vw] md:w-[50vw] max-w-[800px]">
            <img src="/logo-white.png" alt="Logo" className="w-full h-auto object-contain drop-shadow-2xl opacity-95" />
          </div>

          <div className="mt-10 md:mt-12 space-y-5 font-serif">
            <div className="space-y-2">
              <p className="text-[18px] md:text-[24px] italic leading-[1.4] opacity-85 tracking-tight">Surging with infinite waves,</p>
              <p className="text-[18px] md:text-[24px] italic leading-[1.4] opacity-85 tracking-tight">defining the creative of tomorrow.</p>
            </div>
            <p className="font-sans text-[11px] md:text-[12px] tracking-[0.45em] font-bold opacity-60 uppercase flex items-center justify-center gap-2 mt-8">
              [ STUDIO <span className="text-[14px] md:text-[16px] font-medium mt-[-2px]">舞海</span> (MUHAE) ]
            </p>
          </div>
        </motion.div>
      </main>

      {/* 🎞️ 하단 무한 루프 캐러셀 */}
      <footer className="absolute bottom-0 left-0 w-full z-30 pb-20">
        <div className="w-full border-t border-white/10 mb-8 opacity-20" />
        <div ref={scrollRef} className="flex gap-0 overflow-x-auto no-scrollbar">
          {projects.map((item, index) => (
            <Link href={`/project/${item.id}`} key={index}>
              <div
                className="relative flex-shrink-0 flex items-center gap-5 px-14 border-r border-white/5 cursor-pointer group"
                onMouseEnter={() => setActiveProject(item)}
                onMouseLeave={() => {
                  setActiveProject(null);
                  if (scrollRef.current) xPosRef.current = scrollRef.current.scrollLeft;
                }}
              >
                <div className="w-24 h-14 md:w-32 md:h-20 bg-zinc-900 overflow-hidden relative border border-white/5 transition-transform duration-500 group-hover:scale-110">
                  <video src={item.video} autoPlay muted loop playsInline className={`w-full h-full object-cover transition-all duration-700 ${activeProject?.id === item.id ? 'grayscale-0' : 'grayscale opacity-50'}`} />
                </div>
                <div className="flex flex-col min-w-[140px]">
                  <h3 className={`text-xs md:text-sm font-black tracking-tight uppercase transition-colors duration-300 ${activeProject?.id === item.id ? 'text-yellow-400' : 'text-white/70'}`}>{item.title}</h3>
                  <span className="text-[9px] opacity-25 font-bold uppercase tracking-widest">{item.sub}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[9px] font-bold opacity-30 tracking-[0.5em] uppercase whitespace-nowrap">
          2026© STUDIO MUHAE • SEOUL • AI CREATIVE AGENCY
        </div>
      </footer>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}