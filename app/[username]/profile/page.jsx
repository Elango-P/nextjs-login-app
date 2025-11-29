"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { motion } from "framer-motion";
// Importing Lucide icons for a modern, consistent look
import { Mail, Phone, Link, Briefcase, GraduationCap, Zap, Code, ListChecks, Globe, Eye } from 'lucide-react';
import Lottie from "lottie-react";
import loaderAnimation from "../../../public/loader.json";

// --- Component Definition ---

export default function PublicProfile({ params }) {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
const resolvedParams = React.use(params);
  // --- Data Loading Logic (Unchanged) ---
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    // NOTE: This should ideally use params.id or params.slug for dynamic routing.
    // Keeping "elango" as per original implementation for demonstration.
    const { data: userData } = await supabase
      .from("users")
      .select("*")
      .eq("full_name", resolvedParams?.username)
      .maybeSingle();

    if (!userData) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setProfile(userData);
    const userId = userData.id;

    const [{ data: projs }, { data: exps }, { data: eds }, { data: sks }] =
      await Promise.all([
        supabase.from("projects").select("*").eq("user_id", userId),
        supabase.from("experience").select("*").eq("user_id", userId).order("start_date", { ascending: false }),
        supabase.from("education").select("*").eq("user_id", userId),
        supabase.from("skills").select("*").eq("user_id", userId),
      ]);

    // --- TEMPORARY: Injecting content for demonstration. ---
    const augmentedExperience = (exps || []).map(exp => ({
        ...exp,
        // Assuming the description field holds the full details or is replaced by this array
        bullet_points: [
          ...(exp.description ? [exp.description] : []), // Keep existing description if present
        ]
    }));

    const augmentedProjects = (projs || []).map(proj => ({
      ...proj,
      // Assuming project descriptions or a separate details field
      details: [
        ...(proj.description ? [proj.description]: []), 
      ]
    }));
    // --- END TEMPORARY INJECTION ---

    setProjects(augmentedProjects);
    setExperience(augmentedExperience);
    setEducation(eds || []);
    setSkills(sks || []);
    setLoading(false);
  }

  // --- UI Logic ---
  if (loading)
    return (
       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 animate-pulse">
      <div className="flex flex-col items-center gap-5">
        <Lottie
          animationData={loaderAnimation}
          loop={true}
          style={{ width: 300, height: 300 }}
        />
      </div>
    </div>
    );
  if (!profile) return <p className="p-8 text-center text-red-600">User not found</p>;

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // --- Helper Functions for Section Rendering ---

  const renderHeaderSection = (profile, fadeUp) => (
    <motion.div
      className="relative overflow-hidden flex flex-col md:flex-row items-center gap-8 border-b border-gray-200 pb-8"
      variants={fadeUp}
    >
      {/* Profile Image */}
      <img
        src={"https://elangomedia.s3.ap-southeast-2.amazonaws.com/product/180-product-4794-20251125201841.png"}
        alt="Profile photo"
        className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover ring-2 ring-sky-500 ring-offset-4 shadow-xl"
      />
      <div className="text-center md:text-left">
        <h1 className="text-4xl font-extrabold text-white tracking-tighter leading-none drop-shadow-lg animate-pulse">Elango Ponnusamy</h1>
        <p className="mt-2 text-2xl font-light text-yellow-200 drop-shadow-md">{profile.bio}</p>

        {/* Contact Info with Lucide Icons */}
        <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-3 text-sm text-white">
          <a href="mailto:b.elango93@gmail.com" className="hover:text-yellow-300 transition-colors flex items-center gap-2 font-medium"
             style={{ transformStyle: 'preserve-3d' }}
             whileHover={{ 
               rotateY: 10,
               rotateX: -5,
               scale: 1.05,
               z: 15
             }}>
            <Mail className="w-4 h-4 text-yellow-400" /> b.elango93@gmail.com
          </a>
          <span className="flex items-center gap-2 font-medium">
            <Phone className="w-4 h-4 text-yellow-400" /> 9600576351
          </span>
          <a
            href="https://www.linkedin.com/in/p-elango-881ba2139/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-yellow-300 transition-colors flex items-center gap-2 font-medium"
            style={{ transformStyle: 'preserve-3d' }}
            whileHover={{ 
              rotateY: 10,
              rotateX: -5,
              scale: 1.05,
              z: 15
            }}
          >
            <Link className="w-4 h-4 text-yellow-400" /> LinkedIn Profile
          </a>
          <a
            href="https://elango-p.vercel.app/elango/profile"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-yellow-300 transition-colors flex items-center gap-2 font-medium"
            style={{ transformStyle: 'preserve-3d' }}
            whileHover={{ 
              rotateY: 10,
              rotateX: -5,
              scale: 1.05,
              z: 15
            }}
          >
            <Globe className="w-4 h-4 text-yellow-400" />
            Website
          </a>
        </div>
        <div className="mt-5 flex flex-wrap justify-center md:justify-start gap-2">
          <motion.span className="text-xs px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200"
            style={{ transformStyle: 'preserve-3d' }}
            whileHover={{ 
              rotateY: 20,
              rotateX: -15,
              scale: 1.2,
              z: 25
            }}
            whileTap={{ scale: 0.9 }}>Node.js</motion.span>
          <motion.span className="text-xs px-3 py-1 rounded-full bg-gray-900 text-white border border-gray-800"
            style={{ transformStyle: 'preserve-3d' }}
            whileHover={{ 
              rotateY: 20,
              rotateX: -15,
              scale: 1.2,
              z: 25
            }}
            whileTap={{ scale: 0.9 }}>Next.js</motion.span>
          <motion.span className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200"
            style={{ transformStyle: 'preserve-3d' }}
            whileHover={{ 
              rotateY: 20,
              rotateX: -15,
              scale: 1.2,
              z: 25
            }}
            whileTap={{ scale: 0.9 }}>CSS</motion.span>
          <motion.span className="text-xs px-3 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200"
            style={{ transformStyle: 'preserve-3d' }}
            whileHover={{ 
              rotateY: 20,
              rotateX: -15,
              scale: 1.2,
              z: 25
            }}
            whileTap={{ scale: 0.9 }}>HTML</motion.span>
          <motion.span className="text-xs px-3 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-200"
            style={{ transformStyle: 'preserve-3d' }}
            whileHover={{ 
              rotateY: 20,
              rotateX: -15,
              scale: 1.2,
              z: 25
            }}
            whileTap={{ scale: 0.9 }}>Bootstrap</motion.span>
          <motion.span className="text-xs px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200"
            style={{ transformStyle: 'preserve-3d' }}
            whileHover={{ 
              rotateY: 20,
              rotateX: -15,
              scale: 1.2,
              z: 25
            }}
            whileTap={{ scale: 0.9 }}>Tailwind CSS</motion.span>
        </div>

        {/* Watermark: faint rotating tech stack badges (like React symbol) */}
        <motion.div
          aria-hidden
          className="pointer-events-none select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 220, repeat: Infinity, ease: "linear" }}
        >
          <div className="flex flex-wrap justify-center gap-3 opacity-[0.06] dark:opacity-[0.05]">
            <span className="text-xs px-3 py-1 rounded-full bg-green-500/10 text-green-700/80 border border-green-400/30">Node.js</span>
            <span className="text-xs px-3 py-1 rounded-full bg-gray-900/10 text-gray-900/80 dark:text-white/80 border border-gray-800/30">Next.js</span>
            <span className="text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-700/80 border border-blue-400/30">CSS</span>
            <span className="text-xs px-3 py-1 rounded-full bg-orange-500/10 text-orange-700/80 border border-orange-400/30">HTML</span>
            <span className="text-xs px-3 py-1 rounded-full bg-violet-500/10 text-violet-700/80 border border-violet-400/30">Bootstrap</span>
            <span className="text-xs px-3 py-1 rounded-full bg-sky-500/10 text-sky-700/80 border border-sky-400/30">Tailwind CSS</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );

  const renderExperienceSection = (experience, fadeUp) => (
    <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
      <h2 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-white border-b-2 border-yellow-400 pb-3 mb-6">
        <Briefcase className="w-6 h-6 text-yellow-400" /> Experience
      </h2>
      <div className="space-y-8">
        {experience.map((exp) => (
          <motion.div
            key={exp.id}
            className="p-6 bg-white/10 backdrop-blur-sm border-l-4 border-yellow-400 shadow-lg rounded-lg transition-all duration-300 hover:shadow-xl hover:bg-white/20"
            style={{ transformStyle: 'preserve-3d' }}
            whileHover={{ 
              rotateY: 5, 
              rotateX: -5,
              scale: 1.02,
              z: 50 
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex justify-between items-start flex-wrap mb-1">
              <h3 className="text-xl font-extrabold text-white leading-tight drop-shadow-sm">{exp.role}</h3>
              <p className="text-sm font-semibold text-yellow-200 whitespace-nowrap pt-1">
                {exp.start_date} - {exp.end_date || "Present"}
              </p>
            </div>
            <p className="text-lg font-medium text-yellow-300">{exp.company_name}</p>
            
            {exp.bullet_points && exp.bullet_points.length > 0 ? (
              <ul className="mt-4 text-white space-y-2">
                {exp.bullet_points.map((point, index) => (
                  <li key={index} className="text-base flex items-start gap-2">
                    <ListChecks className="w-4 h-4 mt-1 text-green-400 flex-shrink-0" />
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-white leading-relaxed">{exp.description}</p>
            )}
          </motion.div>
        ))}
      </div>
    </motion.section>
  );

  const renderProjectsSection = (projects, fadeUp) => (
    <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
      <h2 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-white border-b-2 border-yellow-400 pb-3 mb-6">
        <Code className="w-6 h-6 text-yellow-400" /> Projects
      </h2>
      <div className="grid md:grid-cols-2 gap-8">
        {projects.map((proj) => (
          <motion.div
            key={proj.id}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-yellow-300 hover:bg-white/20"
            style={{ transformStyle: 'preserve-3d' }}
            whileHover={{ 
              rotateY: -8,
              rotateX: 5,
              scale: 1.05,
              z: 100,
              y: -8
            }}
            whileTap={{ scale: 0.95 }}
          >
            {proj.image_url ? (
                <img src={proj.image_url} alt={proj.title} className="w-full h-40 object-cover border-b border-gray-200" />
            ) : (
                <div className="h-2 bg-sky-500"></div> 
            )}
            
            <div className="p-5">
              <div className="flex justify-between items-start">
                <h3 className="font-extrabold text-xl text-yellow-300 mb-2 drop-shadow-sm">{proj.title}</h3>
                <a 
                  href={`/projects/${proj.id}`}
                  className="text-white/60 hover:text-yellow-300 transition-colors"
                  title="View Project Details"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Eye className="w-5 h-5" />
                </a>
              </div>
              
              {proj.details && proj.details.length > 0 ? (
                <ul className="mt-3 text-white/90 space-y-1">
                  {proj.details.map((detail, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-yellow-400 font-bold flex-shrink-0">•</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-white/80 text-sm">{proj.description}</p>
              )}
              {Array.isArray(proj.skills) && proj.skills.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {proj.skills.map((s, idx) => (
                    <motion.span key={idx} className="text-xs px-2 py-1 bg-yellow-400/20 text-yellow-200 rounded-full border border-yellow-400/30" whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.96 }}>{s}</motion.span>
                  ))}
                </div>
              ) : Array.isArray(proj.tech_stack) && proj.tech_stack.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {proj.tech_stack.map((s, idx) => (
                    <motion.span key={idx} className="text-xs px-2 py-1 bg-yellow-400/20 text-yellow-200 rounded-full border border-yellow-400/30" whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.96 }}>{s}</motion.span>
                  ))}
                </div>
              ) : (typeof proj.tech_stack === 'string' && proj.tech_stack.trim()) ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {proj.tech_stack.split(',').map((s, idx) => {
                    const label = s.trim();
                    if (!label) return null;
                    return (
                      <motion.span key={idx} className="text-xs px-2 py-1 bg-yellow-400/20 text-yellow-200 rounded-full border border-yellow-400/30" whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.96 }}>{label}</motion.span>
                    );
                  })}
                </div>
              ) : null}
              
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );

  const renderSkillsSection = (skills, fadeUp) => (
    <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20">
      <h2 className="flex items-center gap-3 text-2xl font-bold tracking-tight text-white border-b border-yellow-400 pb-3 mb-5">
        <Zap className="w-5 h-5 text-yellow-400" /> Core Skills
      </h2>
      <div className="flex flex-wrap gap-3">
        {skills.map((s) => (
          <motion.span
            key={s.id}
            className="px-3 py-1 bg-yellow-400/20 text-yellow-200 rounded-full font-semibold text-sm border border-yellow-400/30 shadow-sm transition-colors hover:bg-yellow-400/30"
            style={{ transformStyle: 'preserve-3d' }}
            whileHover={{ 
              rotateY: 15,
              rotateX: -10,
              scale: 1.1,
              z: 30
            }}
            whileTap={{ scale: 0.95 }}
          >
            {s.skill_name}
          </motion.span>
        ))}
      </div>
    </motion.section>
  );

  const renderEducationSection = (education, fadeUp) => (
    <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20">
      <h2 className="flex items-center gap-3 text-2xl font-bold tracking-tight text-white border-b border-yellow-400 pb-3 mb-5">
        <GraduationCap className="w-5 h-5 text-yellow-400" /> Education
      </h2>
      <div className="space-y-4">
        {education.map((ed) => (
          <motion.div
            key={ed.id}
            className="p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 transition-shadow hover:shadow-md hover:bg-white/20"
            style={{ transformStyle: 'preserve-3d' }}
            whileHover={{ 
              rotateX: 5,
              rotateY: -5,
              scale: 1.03,
              z: 20
            }}
            whileTap={{ scale: 0.98 }}
          >
            <h3 className="text-lg font-bold text-white leading-tight drop-shadow-sm">{ed.degree}</h3>
            <p className="text-white/80 text-sm font-medium">{ed.institute}</p>
            <p className="text-xs text-yellow-200 mt-1">
              {ed.start_year} - {ed.end_year}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );

  // --- Main Render ---

  return (
    <>
      <style jsx>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-shift {
          background-size: 400% 400%;
          animation: gradient-shift 8s ease infinite;
        }
      `}</style>
   <div className="relative min-h-screen p-4 sm:p-8 overflow-hidden bg-gradient-to-br from-violet-600 via-indigo-500 to-purple-600 animate-gradient-shift" style={{ perspective: '2000px' }}>
      <motion.svg
        aria-hidden
        viewBox="0 0 841.9 595.3"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] opacity-[0.06] dark:opacity-[0.05]"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 240, repeat: Infinity, ease: "linear" }}
      >
        <defs>
          <linearGradient id="reactGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <g fill="none" stroke="url(#reactGrad)" strokeWidth="10">
          <ellipse cx="420.9" cy="296.5" rx="190" ry="74" />
          <ellipse cx="420.9" cy="296.5" rx="190" ry="74" transform="rotate(60 420.9 296.5)" />
          <ellipse cx="420.9" cy="296.5" rx="190" ry="74" transform="rotate(120 420.9 296.5)" />
        </g>
        <circle cx="420.9" cy="296.5" r="18" fill="url(#reactGrad)" />
      </motion.svg>
      {/* Enhanced floating gradient orbs with more vibrant colors */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-20 h-72 w-72 rounded-full bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400 opacity-40 blur-3xl"
        animate={{ y: [0, -30, 0], rotate: [0, 15, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 opacity-40 blur-3xl"
        animate={{ y: [0, 30, 0], rotate: [0, -15, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-1/3 -left-24 h-56 w-56 rounded-full bg-gradient-to-br from-green-400 via-teal-400 to-cyan-400 opacity-35 blur-3xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.35, 0.5, 0.35], x: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-1/4 -right-20 h-64 w-64 rounded-full bg-gradient-to-br from-blue-400 via-violet-400 to-purple-400 opacity-30 blur-3xl"
        animate={{ scale: [1, 1.25, 1], y: [0, -25, 0], rotate: [0, 20, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />

      {/* Additional floating 3D particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          aria-hidden
          className="pointer-events-none absolute h-6 w-6 rounded-full bg-gradient-to-r from-pink-400 to-yellow-400 opacity-70"
          style={{
            left: `${15 + i * 12}%`,
            top: `${8 + i * 10}%`,
            transformStyle: 'preserve-3d',
          }}
          animate={{
            y: [0, -150, 0],
            x: [0, 80, -80, 0],
            z: [0, 200, 0],
            opacity: [0.7, 1, 0.7],
            scale: [1, 1.8, 1],
            rotateX: [0, 360, 0],
            rotateY: [0, 180, 0],
            rotateZ: [0, 90, 0],
          }}
          transition={{
            duration: 10 + i * 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
        />
      ))}

      {/* 3D floating geometric shapes */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`shape-${i}`}
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            left: `${25 + i * 20}%`,
            top: `${20 + i * 15}%`,
            transformStyle: 'preserve-3d',
          }}
          animate={{
            rotateX: [0, 360],
            rotateY: [0, 360],
            rotateZ: [0, 180],
            scale: [1, 1.2, 1],
            z: [0, 100, 0],
          }}
          transition={{
            duration: 15 + i * 2,
            repeat: Infinity,
            ease: "linear",
            delay: i * 0.8,
          }}
        >
          <div className={`w-8 h-8 ${i % 2 === 0 ? 'bg-gradient-to-br from-cyan-400 to-blue-500' : 'bg-gradient-to-br from-purple-400 to-pink-500'} opacity-60`}></div>
        </motion.div>
      ))}

      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1),transparent_70%)]"
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="max-w-7xl mx-auto bg-white/10 backdrop-blur-md shadow-2xl rounded-2xl p-6 md:p-12 border border-white/20"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.15 } },
        }}
        style={{ 
          transformStyle: 'preserve-3d',
          animate: {
            rotateY: [0, 2, 0],
            rotateX: [0, 1, 0],
          },
          transition: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      >
        <div className="space-y-10">
          
          {/* Header Section */}
          {renderHeaderSection(profile, fadeUp)}

          {/* Main Content Grid */}
          <div className="lg:grid lg:grid-cols-3 lg:gap-12 pt-6">
            
            {/* Left Column (Main Content) - Experience & Projects */}
            <div className="lg:col-span-2 space-y-10">
              {renderExperienceSection(experience, fadeUp)}
              <div className="w-full h-px bg-gray-200 lg:hidden"></div> {/* Separator for mobile view */}
              {renderProjectsSection(projects, fadeUp)}
            </div>

            {/* Right Column (Side Content) - Skills & Education */}
            <div className="lg:col-span-1 space-y-10 mt-10 lg:mt-0">
              {renderSkillsSection(skills, fadeUp)}
              {renderEducationSection(education, fadeUp)}
            </div>
          </div>
        </div>

      </motion.div>
    </div>
    </>
  );
}