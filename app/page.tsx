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
  
  // 드래그 및 스크롤 감도 조절용 변수
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const projects = [...PROJECTS_DATA, ...PROJECTS_DATA];

  // 1. 자동 루프 로직 (드래그 중이 아닐 때만 작동)
  useEffect(() => {
    const loop = () => {
      if (scrollRef.current && !activeProject && !isDragging) {
        xPosRef.current += 0.8; // 루프 속도 살짝 늦춤 (더 고급스럽게)
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

  // 2. 휠 스크롤 감도 조절 (e.deltaY * 6 → 2로 완화)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        xPosRef.current += e.deltaY * 2; // 감도 조절 포인트
        el.scrollLeft = xPosRef.current;
      }
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, []);

  // 3. 드래그 로직 (마우스 & 터치)
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
    startX.current = pageX;
    scrollLeft.current = scrollRef.current?.scrollLeft || 0;
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !scrollRef.current) return;
    const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
    const walk = (pageX - startX.current) * 1.5; // 드래그 속도
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
    xPosRef.current = scrollRef.current.scrollLeft;
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="relative h-screen w-screen bg-black text-white overflow-hidden font-sans select-none">
      
      {/* 🏛️ 상단 헤더 (Menu 추가) */}
      <header className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center pointer-events-auto">
        <div className="text-[14px] font-bold tracking-[0.2em]">STUDIO MUHAE</div>
        <button className="group flex flex-col gap-1.5 items-end cursor-pointer">
          <span className="w-8 h-[1px] bg-white transition-all group-hover:w-10"></span>
          <span className="w-5 h-[1px] bg-white transition-all group-hover:w-10"></span>
          <span className="text-[10px] tracking-widest mt-1 opacity-50 group-hover:opacity-100 transition-opacity">MENU</span>
        </button>
      </header>

      {/* 🎥 배경 비디오 레이어 */}
      <div className="fixed inset-0 z-0 bg-black">
        <AnimatePresence mode="wait">
          <motion.video
            key={activeProject ? activeProject.video : 'default'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }} // 배경 밝기 조절 (0.5 -> 0.6으로 살짝 올림)
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            autoPlay muted loop playsInline
            className="w-full h-full object-cover"
          >
            <source src={activeProject ? activeProject.video : MAIN_BG_VIDEO} type="video/mp4" />
          </motion.video>
        </AnimatePresence>
        {/* 어두운 오버레이 수치 조절 (40% -> 25%로 낮춤) */}
        <div className="absolute inset-0 bg-black/15 z-10" />
      </div>
      
      {/* 🏛️ 중앙 로고 및 태그라인 */}
      <main className="fixed inset-0 z-20 flex flex-col items-center justify-center pointer-events-none px-6 text-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: -60, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          <div className="w-[60vw] md:w-[45vw] max-w-[700px]">
            <img src="/logo-white.png" alt="Logo" className="w-full h-auto object-contain drop-shadow-2xl opacity-95" />
          </div>

          <div className="mt-8 md:mt-10 space-y-4 font-serif">
            <div className="space-y-1">
              <p className="text-[16px] md:text-[22px] italic opacity-80 tracking-tight">Surging with infinite waves,</p>
              <p className="text-[16px] md:text-[22px] italic opacity-80 tracking-tight">defining the creative of tomorrow.</p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* 🎞️ 하단 무한 루프 캐러셀 (드래그 기능 탑재) */}
      <footer className="absolute bottom-0 left-0 w-full z-30 pb-20">
        <div className="w-full border-t border-white/10 mb-8 opacity-20" />
        <div 
          ref={scrollRef} 
          className="flex gap-0 overflow-x-auto no-scrollbar active:cursor-grabbing"
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
        >
          {projects.map((item, index) => (
            <Link href={`/project/${item.id}`} key={index} onClick={(e) => isDragging && e.preventDefault()}>
              <div
                className="relative flex-shrink-0 flex items-center gap-5 px-14 border-r border-white/5 cursor-pointer group"
                onMouseEnter={() => !isDragging && setActiveProject(item)}
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