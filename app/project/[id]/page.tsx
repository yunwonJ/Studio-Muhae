"use client";

import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
// 1. 창고에서 데이터 꾸러미를 가져옵니다.
import { PROJECTS_DATA } from '../../data'; 

export default function ProjectDetail() {
  const { id } = useParams();
  const router = useRouter();

  {/* 2. 창고(PROJECTS_DATA)에서 현재 주소창의 id와 똑같은 id를 가진 프로젝트만 찾아냅니다. */}
  const project = PROJECTS_DATA.find((item) => item.id === id) || PROJECTS_DATA[0];

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="min-h-screen bg-[#F2F0E9] text-black pt-24 pb-40 px-6"
    >
      {/* 상단 네비게이션 */}
      <header className="fixed top-0 left-0 w-full flex justify-between items-center p-8 z-[60]">
        {/* 요청하신대로 로고 클릭 시 홈으로 이동 */}
        <Link href="/" className="cursor-pointer inline-block">
          <img 
            src="/logo-white.png" 
            alt="Logo" 
            className="w-32 md:w-44 h-auto mix-blend-difference invert" 
          />
        </Link>
        <div className="text-[12px] font-black uppercase tracking-widest cursor-pointer hover:opacity-50">+ MENU</div>
      </header>

      <div className="max-w-[1000px] mx-auto flex flex-col items-center">
        {/* 타이틀 섹션 - 이제 외부 데이터(project)에서 가져옵니다 */}
        <div className="text-center mb-16">
          <h2 className="text-[10vw] md:text-[6vw] font-black leading-[0.9] tracking-tighter uppercase mb-6">
            {project.client} <br/>
            <span className="font-light italic lowercase text-[8vw] md:text-[5vw]">{project.duration}</span>
          </h2>
          <p className="text-[12px] font-bold text-red-500 uppercase tracking-widest border border-red-500 px-4 py-1 inline-block">By {project.director}</p>
        </div>

        {/* 비디오 플레이어 */}
        <div className="w-full aspect-video bg-black mb-16 shadow-2xl overflow-hidden">
          <video src={project.video} key={project.video} controls autoPlay className="w-full h-full object-cover" />
        </div>

        {/* 오버뷰 섹션 */}
        <div className="max-w-[600px] text-center space-y-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40">(OVERVIEW)</p>
          <p className="text-[18px] md:text-[22px] font-serif leading-relaxed opacity-80 italic">
            {project.desc}
          </p>
        </div>
      </div>
    </motion.div>
  );
}