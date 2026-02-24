"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { PROJECTS_DATA, MAIN_BG_VIDEO } from './data'; 

export default function StudioMuhae() {
  const [activeProject, setActiveProject] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);
  const xPosRef = useRef(0);
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragMoved, setDragMoved] = useState(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  const projects = [...PROJECTS_DATA, ...PROJECTS_DATA];

  useEffect(() => {
    const loop = () => {
      if (scrollRef.current && !activeProject && !isDragging) {
        xPosRef.current += 0.8;
        if (xPosRef.current >= scrollRef.current.scrollWidth / 2) {
          xPosRef.current = 0;
        }
        scrollRef.current.scrollLeft = xPosRef.current;
      }
      requestRef.current = requestAnimationFrame(loop);
    };
    requestRef.current = requestAnimationFrame(loop);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [activeProject, isDragging]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        xPosRef.current += e.deltaY * 1.5;
        el.scrollLeft = xPosRef.current;
      }
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, []);

  const onDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    setDragMoved(false);
    const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
    startX.current = pageX;
    scrollLeftStart.current = scrollRef.current?.scrollLeft || 0;
  };

  const onDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !scrollRef.current) return;
    const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
    const dist = pageX - startX.current;
    if (Math.abs(dist) > 5) setDragMoved(true);
    scrollRef.current.scrollLeft = scrollLeftStart.current - dist * 1.8;
    xPosRef.current = scrollRef.current.scrollLeft;
  };

  const onDragEnd = () => {
    setIsDragging(false);
    setTimeout(() => setDragMoved(false), 50);
  };

  return (
    <div className="relative h-screen w-screen bg-black text-white overflow-hidden font-sans select-none touch-none">
      
      {/* 🏛️ 상단 헤더 (상세 페이지와 동일한 디자인으로 변경) */}
      <header className="fixed top-0 left-0 w-full flex justify-between items-center p-8 z-[60] mix-blend-difference invert">
        <Link href="/" className="cursor-pointer">
          <img 
            src="/logo-white.png" 
            alt="Logo" 
            className="w-32 md:w-44 h-auto" 
          />
        </Link>
        <div className="text-[12px] font-black uppercase tracking-widest cursor-pointer hover:opacity-50">+ MENU</div>
      </header>

      {/* 🎥 배경 비디오 레이어 */}
      <div className="fixed inset-0 z-0 bg-black">
        <AnimatePresence mode="wait">
          <motion.video
            key={activeProject ? activeProject.video : 'default'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            autoPlay muted loop playsInline
            className="w-full h-full object-cover"
          >
            <source src={activeProject ? activeProject.video : MAIN_BG_VIDEO} type="video/mp4" />
          </motion.video>
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/25 z-10" />
      </div>
      
      {/* 🏛️ 중앙 로고 및 태그라인 */}
      <main className="fixed inset-0 z-20 flex flex-col items-center justify-center pointer-events-none px-6 text-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: -60, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          {/* 중앙 로고 이미지의 투명도와 크기를 조절하여 배경과 조화롭게 배치 */}
          <div className="w-[70vw] md:w-[50vw] max-w-[800px]">
            <img src="/logo-white.png" alt="Center Logo" className="w-full h-auto object-contain drop-shadow-2xl opacity-95" />
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

      {/* 🎞️ 하단 캐러셀 */}
      <footer className="absolute bottom-0 left-0 w-full z-30 pb-20">
        <div className="w-full border-t border-white/10 mb-8 opacity-20" />
        <div 
          ref={scrollRef} 
          className="flex gap-0 overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing touch-pan-x"
          onMouseDown={onDragStart}
          onMouseMove={onDragMove}
          onMouseUp={onDragEnd}
          onMouseLeave={onDragEnd}
          onTouchStart={onDragStart}
          onTouchMove={onDragMove}
          onTouchEnd={onDragEnd}
        >
          {projects.map((item, index) => (
            <div
              key={index}
              className="relative flex-shrink-0 flex items-center gap-5 px-14 border-r border-white/5 group"
              onMouseEnter={() => !isDragging && setActiveProject(item)}
              onMouseLeave={() => setActiveProject(null)}
            >
              <Link 
                href={`/project/${item.id}`} 
                onClick={(e) => dragMoved && e.preventDefault()}
                className="flex items-center gap-5"
              >
                <div className="w-24 h-14 md:w-32 md:h-20 bg-zinc-900 overflow-hidden relative border border-white/5 transition-transform duration-500 group-hover:scale-110">
                  <video src={item.video} autoPlay muted loop playsInline className={`w-full h-full object-cover transition-all duration-700 ${activeProject?.id === item.id ? 'grayscale-0' : 'grayscale opacity-50'}`} />
                </div>
                <div className="flex flex-col min-w-[140px]">
                  <h3 className={`text-xs md:text-sm font-black tracking-tighter uppercase transition-colors duration-300 ${activeProject?.id === item.id ? 'text-yellow-400' : 'text-white/70'}`}>{item.title}</h3>
                  <span className="text-[9px] opacity-25 font-bold uppercase tracking-[0.2em]">{item.sub}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
        
        {/* 🏷️ 하단 카피라이트 */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[9px] font-bold opacity-30 tracking-[0.5em] uppercase whitespace-nowrap">
          2026© STUDIO MUHAE • KOREA • AI CREATIVE AGENCY
        </div>
      </footer>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}