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
  
  // 🖱️ 드래그를 위한 상태값
  const [isDragging, setIsDragging] = useState(false);
  const [dragMoved, setDragMoved] = useState(false); // 드래그 중 클릭 방지용
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  const projects = [...PROJECTS_DATA, ...PROJECTS_DATA];

  // 1. 자동 무한 루프 (드래그 중이 아닐 때만)
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

  // 2. 휠 감도 최적화
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        xPosRef.current += e.deltaY * 1.5; // 감도를 더 부드럽게(1.5)
        el.scrollLeft = xPosRef.current;
      }
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, []);

  // 3. 강화된 드래그 핸들러 (PC & Mobile 공용)
  const onDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    setDragMoved(false); // 드래그 시작 시 초기화
    const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
    startX.current = pageX;
    scrollLeftStart.current = scrollRef.current?.scrollLeft || 0;
  };

  const onDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !scrollRef.current) return;
    
    const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
    const dist = pageX - startX.current;
    
    // 5픽셀 이상 움직이면 '드래그 중'으로 판단하여 클릭(이동) 방지
    if (Math.abs(dist) > 5) setDragMoved(true);

    // 사용자가 미는 만큼 실시간 이동 (배율 1.8로 쫀득하게)
    scrollRef.current.scrollLeft = scrollLeftStart.current - dist * 1.8;
    xPosRef.current = scrollRef.current.scrollLeft;
  };

  const onDragEnd = () => {
    setIsDragging(false);
    // 약간의 딜레이를 주어 드래그 끝난 직후 클릭 이벤트가 발생하는 것 방지
    setTimeout(() => setDragMoved(false), 50);
  };

  return (
    <div className="relative h-screen w-screen bg-black text-white overflow-hidden font-sans select-none touch-none">
      
      {/* 🏛️ 상단 헤더 */}
      <header className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center">
        <div className="text-[14px] font-bold tracking-[0.2em]">STUDIO MUHAE</div>
        <button className="group flex flex-col gap-1.5 items-end cursor-pointer">
          <span className="w-8 h-[1px] bg-white transition-all group-hover:w-10"></span>
          <span className="w-5 h-[1px] bg-white transition-all group-hover:w-10"></span>
          <span className="text-[10px] tracking-widest mt-1 opacity-50 group-hover:opacity-100 transition-opacity uppercase">Menu</span>
        </button>
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
      
      {/* 🏛️ 중앙 로고 */}
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
          <div className="mt-8 space-y-4 font-serif">
            <p className="text-[16px] md:text-[22px] italic opacity-80">Surging with infinite waves, defining the creative of tomorrow.</p>
          </div>
        </motion.div>
      </main>

      {/* 🎞️ 드래그 가능한 하단 캐러셀 */}
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
              {/* 드래그 중에는 클릭(이동) 무시 로직 */}
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
      </footer>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}