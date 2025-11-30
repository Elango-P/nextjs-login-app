// --- Enhanced Portfolio Component ---

"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { motion } from "framer-motion";
import dynamic from 'next/dynamic';

import {
  Mail,
  Phone,
  Link,
  Briefcase,
  GraduationCap,
  Zap,
  Code,
  ListChecks,
  Globe,
  Eye,
  Github,
  Linkedin,
  Twitter,
} from 'lucide-react';
import Lottie from "lottie-react";
import loaderAnimation from "../../../public/loader.json";
import AnimatedMonitor from "../../../src/components/code.json";
import AnimationLottie from "../../../components/animation-lottie";
import EduLottie from "../../../src/lottie/education.json";
import Skills from "../../skills"; // Assuming this is an external component
import ProjectCard from "../../../src/components/project-card"; // Assuming this is the code-style card

// Dynamic import for Lottie to ensure it only runs on the client
const DynamicLottie = dynamic(() => import("lottie-react"), { ssr: false });
const DynamicAnimationLottie = dynamic(() => import("../../../components/animation-lottie"), { ssr: false });


export default function PublicProfile({ params }) {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [skills, setSkills] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const resolvedParams = React.use(params);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
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

      const augmentedExperience = (exps || []).map(exp => ({
        ...exp,
        bullet_points: [
          ...(exp.description ? [exp.description] : []),
        ]
      }));

      const augmentedProjects = (projs || []).map(proj => ({
        ...proj,
        details: [
          ...(proj.description ? [proj.description] : []),
        ]
      }));
      setProjects(augmentedProjects);
      setExperience(augmentedExperience);
      setEducation(eds || []);
      setSkills(sks || []);
      setPosts([]); // Keep posts array empty if not fetching
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1020]">
      <DynamicLottie animationData={loaderAnimation} loop style={{ width: 260, height: 260 }} />
    </div>
  );

  if (!profile) return <div className="min-h-screen flex items-center justify-center bg-[#0b1020]"><p className="text-red-400">User not found</p></div>;

  // --- Visual helpers ---
  const neonGlow = "bg-gradient-to-br from-[#7c3aed]/20 via-[#06b6d4]/10 to-[#f472b6]/10 border border-[#2b2f45] shadow-[0_10px_30px_rgba(124,58,237,0.08)]";

  // =========================================================================
  // --- Enhanced Hero / Intro ---
  // =========================================================================
  const Hero = () => (
    <section className="relative">
      <div className="mx-auto grid lg:grid-cols-5 gap-12 items-center">
        {/* Left: Text + Buttons + small code box (Spans 3/5) */}
        <div className="lg:col-span-3 space-y-8">
          <h2 className="text-5xl md:text-6xl font-extrabold text-white leading-tight">
            Hello, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6ee7b7] to-[#60a5fa]">{profile.display_name || profile.full_name}</span>
          </h2>
          
          <p className="text-gray-300 max-w-xl text-lg leading-relaxed">{profile.tagline || profile.bio || 'Full stack engineer passionate about building beautiful, accessible and high-performance web applications.'}</p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-6">
            <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-3 px-6 py-3 bg-[#111322] border border-[#283046] rounded-full text-base font-medium text-white hover:scale-[1.03] hover:border-[#60a5fa] transition-all duration-300 shadow-md">
              <Mail className="w-5 h-5" /> Contact Me
            </a>
            <a href={profile.github || '#'} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] text-white rounded-full text-base font-semibold shadow-xl hover:shadow-[#06b6d4]/50 transition-all duration-300">
              <Github className="w-5 h-5" /> View GitHub
            </a>
          </div>
        </div>

        {/* Right: 3D Animated Monitor + Card (Spans 2/5) */}
        <div className="lg:col-span-2 relative h-[500px] flex items-center justify-center">
          <div className="absolute inset-0 z-0">
            {AnimatedMonitor && <DynamicAnimationLottie animationPath={AnimatedMonitor} />}
          </div>

          {/* Overlay profile card - Styled to be a central feature */}
          <div className={`absolute w-11/12 max-w-sm bg-[#0b1020] p-6 rounded-2xl border border-[#2b2f45] shadow-[0_0_50px_rgba(124,58,237,0.3)] z-10 ${neonGlow}`}>
            <div className="flex items-center gap-4">
              <img
                src={profile.avatar_url || 'https://elangomedia.s3.ap-southeast-2.amazonaws.com/product/180-product-4794-20251125201841.png'}
                alt="avatar"
                className="w-16 h-16 rounded-full object-cover ring-4 ring-[#0ea5e9]/50 shadow-xl"
              />
              <div>
                <h3 className="text-xl font-bold text-white">{profile.display_name || profile.full_name}</h3>
                <p className="text-sm text-[#9fbadb]">{profile.role || 'Senior Software Engineer'}</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 divide-x divide-[#2b2f45] border border-[#2b2f45] rounded-xl overflow-hidden bg-[#071228]">
              <div className="p-3 text-center">
                <div className="text-xs text-gray-400">Experience</div>
                <div className="text-lg font-bold text-[#60a5fa] mt-1">{experience.length}+</div>
              </div>
              <div className="p-3 text-center">
                <div className="text-xs text-gray-400">Projects</div>
                <div className="text-lg font-bold text-[#6ee7b7] mt-1">{projects.length}+</div>
              </div>
              <div className="p-3 text-center">
                <div className="text-xs text-gray-400">Articles</div>
                <div className="text-lg font-bold text-[#f472b6] mt-1">{posts.length}</div>
              </div>
            </div>

            <div className="mt-5 flex justify-center gap-4">
              <a
                href={profile.linkedin || '#'}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-full bg-[#7c3aed]/20 text-[#7c3aed] hover:bg-[#7c3aed]/40 transition-colors shadow-lg"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href={profile.github || '#'}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors shadow-lg"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // =========================================================================
  // --- Enhanced About / Who I am ---
  // =========================================================================
  const About = () => (
    <section className="mx-auto py-12 lg:py-20 ">

      {/* Main Section Header - Centered and stylized */}
      <h2 className="text-4xl lg:text-5xl text-white font-extrabold mb-12 text-center tracking-wider relative">
        <span className="bg-[#050612] px-4 z-10 relative">Who I Am <Zap className="inline w-6 h-6 text-[#f472b6]" /></span>
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#f472b6]/30 to-transparent -z-0"></div>
      </h2>

      <div className="grid lg:grid-cols-3 gap-10 items-start">

        {/* === Column 1: Avatar/Image Placeholder (1/3 width) === */}
        <div className="lg:col-span-1 flex flex-col items-center justify-start sticky top-20">
          <div className={`w-48 h-48 rounded-full border-4 border-[#122033] ${neonGlow} overflow-hidden bg-[#071228] flex items-center justify-center shadow-2xl`}>
            <img
              src={profile.avatar_url || 'https://elangomedia.s3.ap-southeast-2.amazonaws.com/product/180-product-4794-20251125201841.png'}
              alt="avatar"
              className="object-cover w-full h-full"
            />
          </div>

          {/* Quick Contact Below Image */}
          <div className="mt-6 p-4 rounded-xl bg-[#071228] border border-[#122033] w-full max-w-xs shadow-lg">
            <h4 className="text-sm text-gray-300 font-semibold mb-3">Quick Links</h4>
            <div className="flex flex-col gap-3">
              <a className="text-white text-sm flex items-center gap-2 hover:text-[#06b6d4] transition-colors" href={`mailto:${profile.email}`}>
                <Mail className="w-4 h-4 text-[#06b6d4]" /> {profile.email}
              </a>
              <a className="text-white text-sm flex items-center gap-2 hover:text-[#60a5fa] transition-colors" href={profile.website || '#'} target="_blank" rel="noreferrer">
                <Globe className="w-4 h-4 text-[#60a5fa]" /> {profile.website ? new URL(profile.website).hostname : 'Website'}
              </a>
            </div>
          </div>
        </div>

        {/* === Column 2: Main Content & Metadata (2/3 width) === */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-3xl font-bold text-white mb-4">My Background</h3>

          <p className="text-gray-300 leading-relaxed text-lg border-l-4 border-[#7c3aed] pl-4">
            {profile.about || `I'm ${profile.display_name || profile.full_name}, a dedicated software developer focusing on **frontend and backend systems**, specializing in building high-performance applications and delivering delightful user experiences.`}
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#071228] border border-[#122033] shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <h4 className="text-base text-gray-400 font-semibold">Location 📍</h4>
              <div className="text-white font-bold text-xl mt-1">{profile.location || 'Bangalore, India'}</div>
            </div>
            <div className="p-4 rounded-xl bg-[#071228] border border-[#122033] shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <h4 className="text-base text-gray-400 font-semibold">Availability 💼</h4>
              <div className="text-[#16f2b3] font-extrabold text-xl mt-1">{profile.open_to || 'Freelance / Full-time'}</div>
            </div>
          </div>

          {/* Quick Skills Block - Moved to the main content area for better flow */}
          <div className="p-4 rounded-xl bg-[#071228] border border-[#122033] shadow-lg mt-8">
            <h4 className="text-xl text-white font-semibold mb-4 flex items-center gap-2"><Code className="w-5 h-5 text-[#6ee7b7]" /> Top Skills</h4>
            <div className="flex flex-wrap gap-3">
              {(skills || []).slice(0, 10).map(s => (
                <span key={s.id || s.skill_name} className="px-4 py-1.5 bg-[#091a2b] rounded-full text-sm text-[#9ee7d0] border border-[#102033] hover:bg-[#102033] transition-colors cursor-default shadow-inner">
                  {s.skill_name || s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );


  // =========================================================================
  // --- Enhanced Experience Timeline ---
  // =========================================================================

const ExperienceTimeline = ({ }) => (
  <section className="mx-auto py-16 px-4 relative z-10">
    <h3 className="text-4xl font-bold text-white mb-12 text-center tracking-wide">
      Experiences
    </h3>

    {/* Container: stack on mobile, row on desktop */}
    <div className="flex flex-col lg:flex-row justify-center items-start gap-12">

      {/* Left: Animation (full width on mobile) */}
      <div className="w-full lg:w-1/2 flex justify-center">
        {AnimatedMonitor && <AnimationLottie animationPath={AnimatedMonitor} />}
      </div>

      {/* Right: Timeline (full width on mobile) */}
      <div className="w-full lg:w-1/2 space-y-10">
        {(experience || []).map((exp) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-6 rounded-2xl bg-[#0a0a1a] border border-[#2a2a3a] shadow-lg
                       hover:shadow-indigo-500/30 hover:border-indigo-600
                       transition-all duration-300 hover:-translate-y-1 cursor-pointer"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
              <div className="text-sm text-indigo-400 font-medium">
                {exp.start_date} — {exp.end_date || 'Present'}
              </div>
            </div>

            <h4 className="text-xl md:text-2xl font-bold text-white">{exp.role}</h4>
            <div className="text-base md:text-lg text-gray-400 mt-1">{exp.company_name}</div>

            {exp.description && (
              <p className="mt-4 text-gray-400 leading-relaxed line-clamp-2">
                {exp.description}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);



  // =========================================================================
  // --- Enhanced Projects Grid ---
  // =========================================================================
  const ProjectsGrid = () => (
    <div id='projects' className="relative z-50 my-16 lg:my-32 px-4 border-t border-[#122033] pt-16">
      <div className="flex items-center justify-start relative mb-12">
        <h3 className="text-4xl lg:text-5xl font-extrabold text-white tracking-wider relative inline-block">
          <span className="bg-[#050612] px-4 z-10 relative">Showcase <ListChecks className="inline w-6 h-6 text-[#06b6d4]" /></span>
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#06b6d4]/30 to-transparent -z-0"></div>
        </h3>
      </div>

      <div className="pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {(projects || []).map((p, index) => (
            <motion.div
              id={`project-card-${index + 1}`}
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-full"
            >
              <div className="box-border flex items-stretch justify-center h-full"> {/* Use items-stretch to ensure children fill height */}
                {/* ProjectCard needs to be updated with h-full and flex-grow internally */}
                <ProjectCard project={p} />
              </div>
            </motion.div>
          ))}
        </div>
        {projects.length === 0 && (
          <p className="text-center text-gray-400 mt-10">No projects currently listed.</p>
        )}
      </div>
    </div>
  );

  // NOTE: SkillsRow is replaced by the Skills component import, 
  // but if you want to use the enhanced code for SkillsRow, you'd integrate it here.
  // The original component had SkillsRow and an import for an external 'Skills' component,
  // I will assume the imported 'Skills' is what should be used, but provide the enhanced version below
  // in case you want to use it.

  /* const SkillsRow = () => { ... enhanced version ... }
  */

  // =========================================================================
  // --- Enhanced Education Section ---
  // =========================================================================
const EducationSection = () => (
  <section
    id="education"
    className="mx-auto py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-[#030712] font-sans border-t border-[#122033]"
  >
    {/* Main Title */}
    <h4 className="text-4xl lg:text-5xl font-extrabold text-white mb-16 text-center tracking-wider relative">
      <span className="bg-[#030712] px-4 z-10 relative">
        Education Background{" "}
        <GraduationCap className="inline w-6 h-6 text-[#a78bfa]" />
      </span>
      <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#a78bfa]/30 to-transparent -z-0"></div>
    </h4>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">

      {/* === EDUCATION LIST (2 columns on desktop, full width on mobile) === */}
      <div className="md:col-span-2 flex flex-col justify-center space-y-8 order-2 md:order-1 w-full">

        {(education || []).map((ed, index) => (
          <motion.div
            key={ed.id}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="relative p-6 rounded-xl bg-[#080d28] border border-[#1b3d75]/30 shadow-2xl
                       hover:border-[#a78bfa] transition-all duration-500 ease-in-out
                       flex flex-col gap-3 overflow-hidden group"
          >
            {/* YEAR BADGE */}
            <div className="absolute top-0 right-0 bg-[#6b21a8] text-white text-xs font-semibold px-4 py-1.5 rounded-bl-xl">
              {ed.start_year} — {ed.end_year}
            </div>

            {/* FIXED ICON (center-left) */}
            <div className="absolute left-4 top-6 text-[#a78bfa] opacity-60 group-hover:opacity-100">
              <GraduationCap className="w-7 h-7" />
            </div>

            {/* CONTENT (shifted to avoid overlap on mobile) */}
            <div className="ml-14">
              <div className="text-xl md:text-2xl text-white font-extrabold tracking-wide">
                {ed.degree}
              </div>
              <div className="text-base text-[#9fbadb] mt-1">
                {ed.institute}
              </div>
            </div>
          </motion.div>
        ))}

      </div>

      {/* === ANIMATION BLOCK (Perfect on mobile) === */}
      <div className="relative w-full order-1 md:order-2 md:col-span-1 flex justify-center md:block
                      md:sticky md:top-20">

        <div className="w-full max-w-sm rounded-xl overflow-hidden bg-[#0a0d37] border border-[#1b2c68a0]
                        shadow-2xl p-4 h-[220px] sm:h-[260px] md:h-auto">
          {/* Lottie Animation */}
          {EduLottie && (
            <DynamicAnimationLottie animationPath={EduLottie} loop={true} />
          )}
        </div>

      </div>

    </div>
  </section>
);



  // =========================================================================
  // --- Enhanced Blog grid (posts) ---
  // =========================================================================
  const BlogGrid = () => (
    <section id="blog" className="mx-auto py-16 lg:py-24 border-t border-[#122033]">
      <h3 className="text-4xl lg:text-5xl font-extrabold text-white mb-16 text-center tracking-wider relative">
        <span className="bg-[#050612] px-4 z-10 relative">Latest Insights <Eye className="inline w-6 h-6 text-[#f472b6]" /></span>
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#f472b6]/30 to-transparent -z-0"></div>
      </h3>

      <div className="grid md:grid-cols-3 gap-8">
        {(posts || []).slice(0, 3).map((post, index) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="rounded-xl bg-[#071228] border border-[#122033] overflow-hidden shadow-xl hover:shadow-pink-500/10 transition-shadow duration-300 transform hover:-translate-y-1"
          >
            <div className="p-6">
              <h4 className="text-xl font-bold text-white mb-3 hover:text-[#f472b6] transition-colors">{post.title}</h4>
              <p className="text-sm text-[#9fb3d0] line-clamp-3 leading-relaxed">{post.excerpt || post.summary || post.description}</p>
            </div>
            <div className="p-4 border-t border-[#0f2030] flex items-center justify-between bg-[#030912]">
              <a href={`/blog/${post.slug || post.id}`} className="text-sm text-[#60a5fa] font-semibold hover:text-white transition-colors flex items-center gap-1">
                Read Article <Link className="w-4 h-4" />
              </a>
              <div className="text-xs text-[#86a6d8]">{new Date(post.published_at || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
            </div>
          </motion.article>
        ))}
        {posts.length === 0 && (
          <div className="md:col-span-3 text-center text-gray-400">No blog posts found.</div>
        )}
      </div>
      {posts.length > 3 && (
        <div className="text-center mt-10">
          <a href="/blog" className="inline-flex items-center gap-2 px-6 py-3 border border-[#7c3aed] text-white rounded-full text-base font-medium hover:bg-[#7c3aed]/20 transition-all">
            View All Posts
          </a>
        </div>
      )}
    </section>
  );

  // =========================================================================
  // --- Enhanced Contact ---
  // =========================================================================
  const Contact = () => (
    <section id="contact" className="mx-auto py-16 lg:py-24 border-t border-[#122033]">
      <h3 className="text-4xl lg:text-5xl font-extrabold text-white mb-16 text-center tracking-wider relative">
        <span className="bg-[#050612] px-4 z-10 relative">Let's Connect <Phone className="inline w-6 h-6 text-[#06b6d4]" /></span>
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#06b6d4]/30 to-transparent -z-0"></div>
      </h3>

      <div className="grid md:grid-cols-5 gap-8">

        {/* Contact Form (Spans 3/5) */}
        <div className="md:col-span-3 rounded-2xl p-8 bg-[#0a0a1a] border border-[#2a2a3a] shadow-2xl">
          <h4 className="text-2xl text-white font-bold mb-2">Send Me A Message</h4>
          <p className="text-sm text-[#9fb3d0] mt-2">I respond to most inquiries within 24-48 hours. Let's build something great!</p>
          <form className="mt-8 space-y-5" onSubmit={(e) => e.preventDefault()}>
            <input placeholder="Your full name" className="w-full p-4 rounded-lg bg-[#031523] border border-[#102033] text-white text-base focus:ring-2 focus:ring-[#7c3aed] focus:border-transparent transition-all" />
            <input type="email" placeholder="Your best email" className="w-full p-4 rounded-lg bg-[#031523] border border-[#102033] text-white text-base focus:ring-2 focus:ring-[#06b6d4] focus:border-transparent transition-all" />
            <textarea placeholder="Your message or project details" rows={6} className="w-full p-4 rounded-lg bg-[#031523] border border-[#102033] text-white text-base focus:ring-2 focus:ring-[#f472b6] focus:border-transparent transition-all resize-none" />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full px-6 py-4 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] text-white font-bold text-lg shadow-xl hover:shadow-[#06b6d4]/40 transition-all"
            >
              Send Message
            </motion.button>
          </form>
        </div>

        {/* Get in touch / Socials (Spans 2/5) */}
        <div className="md:col-span-2 rounded-2xl p-8 bg-[#0a0a1a] border border-[#2a2a3a] shadow-2xl flex flex-col justify-between">
          <div>
            <h4 className="text-2xl text-white font-bold mb-4">Direct Details</h4>
            <div className="mt-4 space-y-4 text-base text-[#9fb3d0]">
              <div className="flex items-center gap-4 p-2 rounded-lg bg-[#071228]"><Mail className="w-5 h-5 text-[#06b6d4]" /> {profile.email}</div>
              <div className="flex items-center gap-4 p-2 rounded-lg bg-[#071228]"><Phone className="w-5 h-5 text-[#7c3aed]" /> {profile.phone || '9600576351'}</div>
              <div className="flex items-center gap-4 p-2 rounded-lg bg-[#071228]"><Globe className="w-5 h-5 text-[#60a5fa]" /> {profile.website || 'https://elango-p.vercel.app/elango/profile'}</div>
            </div>
          </div>

          <div className="mt-8 border-t border-[#2a2a3a] pt-6">
            <h4 className="text-xl text-white font-bold mb-4">Connect on Social</h4>
            <div className="flex items-center gap-5">
              <a href={profile.github || '#'} target="_blank" rel="noreferrer" className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors" aria-label="GitHub"><Github className="w-6 h-6 text-[#9ee7d0]" /></a>
              <a href={profile.linkedin || 'https://www.linkedin.com/in/elango-ponnusamy-881ba2139/'} target="_blank" rel="noreferrer" className="p-3 rounded-full bg-[#7c3aed]/20 hover:bg-[#7c3aed]/40 transition-colors" aria-label="LinkedIn"><Linkedin className="w-6 h-6 text-[#7c3aed]" /></a>
              <a href={profile.twitter || '#'} target="_blank" rel="noreferrer" className="p-3 rounded-full bg-[#06b6d4]/20 hover:bg-[#06b6d4]/40 transition-colors" aria-label="Twitter"><Twitter className="w-6 h-6 text-[#60a5fa]" /></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // --- Footer ---
  const Footer = () => (
    <footer className="mt-12 py-8 border-t border-[#122033] bg-[#030712]">
      <div className="mx-auto text-center text-sm text-[#9fb3d0]">© {new Date().getFullYear()} {profile.display_name || profile.full_name} — Crafted with <span className="text-red-500">❤️</span> and Code</div>
    </footer>
  );

  return (
    <div className="min-h-screen bg-[#050612] text-white">
      {/* Background Gradient Effect - Subtle and covering the whole view */}
      <div className="relative overflow-hidden">
        <motion.div aria-hidden className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.15),transparent_40%)] z-0"></motion.div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div>
            <Hero />
            <About />
            <ExperienceTimeline />
            {/* Using the enhanced ProjectsGrid */}
            <ProjectsGrid />
            {/* Assuming the imported Skills component is what you want to use here */}
            <Skills />
            <EducationSection />
            <BlogGrid />
            <Contact />
          </div>
        </div>
      </div>
      {/* Footer outside the main container for full-width dark background */}
      <Footer />
    </div>
  );
}