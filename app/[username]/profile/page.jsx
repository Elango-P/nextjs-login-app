"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { motion } from "framer-motion";
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

import { useFrame, Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
// This file is a single-file React component that replicates the dark neon portfolio
// shown in the image. It uses Tailwind utility classes. Data is loaded from Supabase
// (same as your original) but the UI is rebuilt to match the screenshot: dark theme,
// neon gradients, code-like project cards, timeline and blog grid.

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
    }));      // small augmentation to ensure arrays for rendering
  setProjects(augmentedProjects);
    setExperience(augmentedExperience);
    setEducation(eds || []);
    setSkills(sks || []);
      setPosts([]);

    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1020]">
      <Lottie animationData={loaderAnimation} loop style={{ width: 260, height: 260 }} />
    </div>
  );

  if (!profile) return <div className="min-h-screen flex items-center justify-center bg-[#0b1020]"><p className="text-red-400">User not found</p></div>;

  // --- Visual helpers ---
  const neonGlow = "bg-gradient-to-br from-[#7c3aed]/20 via-[#06b6d4]/10 to-[#f472b6]/10 border border-[#2b2f45] shadow-[0_10px_30px_rgba(124,58,237,0.08)]";

  // --- Hero / Intro ---
  const Hero = () => (
    <section className="relative py-12">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        {/* Left: Text + Buttons + small code box */}
        <div className="space-y-6">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">Hello,<br />This is <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6ee7b7] to-[#60a5fa]">{profile.display_name || profile.full_name}</span>, I'm a <span className="text-[#7c3aed] font-semibold">Professional Full Stack   Developer</span>.</h2>
          <p className="text-gray-300 max-w-xl">{profile.tagline || profile.bio || 'Full stack engineer passionate about building beautiful, accessible and high-performance web applications.'}</p>

          <div className="flex items-center gap-4">
            <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-3 px-5 py-3 bg-[#111322] border border-[#283046] rounded-full text-sm font-medium text-white hover:scale-[1.01] transition">Contact Me</a>
            <a href={profile.website || '#'} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] text-white rounded-full text-sm font-semibold shadow-lg">Visit Website</a>
          </div>

          <div className="mt-4">
            <div className="relative w-full max-w-md">
              <pre className="rounded-xl overflow-hidden text-sm bg-[#071228] p-4 font-mono border border-[#122033] shadow-[0_8px_40px_rgba(2,6,23,0.6)]">
{`const greet = () => {
  return 'Hello, world!';
};`}
              </pre>
            </div>
          </div>
        </div>

        {/* Right: Hero illustration & profile */}
        <div className="relative">
          <div className="absolute -inset-6 rounded-2xl blur-3xl opacity-40 bg-gradient-to-br from-[#0ea5e9] to-[#8b5cf6]" />
          <div className={`relative p-6 rounded-2xl ${neonGlow} backdrop-blur-md`}>
            <img src={profile.avatar_url || 'https://elangomedia.s3.ap-southeast-2.amazonaws.com/product/180-product-4794-20251125201841.png'} alt="avatar" className="w-36 h-36 rounded-full object-cover ring-4 ring-[#0ea5e9]/20 mx-auto" />
            <div className="mt-4 text-center">
              <h3 className="text-xl font-bold text-white">{profile.display_name || profile.full_name}</h3>
              <p className="text-sm text-gray-300">{profile.role || 'Senior Software Engineer'}</p>
              <div className="mt-3 flex items-center justify-center gap-3 text-gray-300 text-sm">
                <a href={`mailto:${profile.email}`} className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#06b6d4]"/> Email</a>
                <a href={"https://www.linkedin.com/in/elango-ponnusamy-881ba2139/"|| '#'} target="_blank" rel="noreferrer" className="flex items-center gap-2"><Linkedin className="w-4 h-4 text-[#7c3aed]"/> LinkedIn</a>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-[#071228]/60 text-center">
                <div className="text-xs text-gray-300">Experience</div>
                <div className="text-lg font-bold text-white">{experience.length} yrs</div>
              </div>
              <div className="p-3 rounded-lg bg-[#071228]/60 text-center">
                <div className="text-xs text-gray-300">Projects</div>
                <div className="text-lg font-bold text-white">{projects.length}</div>
              </div>
              <div className="p-3 rounded-lg bg-[#071228]/60 text-center">
                <div className="text-xs text-gray-300">Articles</div>
                <div className="text-lg font-bold text-white">{posts.length}</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );

  // --- About / Who I am ---
  const About = () => (
    <section className="max-w-6xl mx-auto py-12">
      <div className="grid lg:grid-cols-3 gap-8 items-center">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl text-[#60a5fa] font-semibold">Who I am?</h3>
          <p className="text-gray-300 leading-relaxed">{profile.about || `I'm ${profile.display_name || profile.full_name}, a dedicated software developer focusing on frontend and backend systems, performance and delightful user experiences.`}</p>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-[#071228] border border-[#122033]">
              <h4 className="text-sm text-gray-400">Location</h4>
              <div className="text-white font-medium">{profile.location || 'Bangalore, India'}</div>
            </div>
            <div className="p-4 rounded-lg bg-[#071228] border border-[#122033]">
              <h4 className="text-sm text-gray-400">Available for</h4>
              <div className="text-white font-medium">{profile.open_to || 'Freelance / Full-time'}</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className={`p-4 rounded-xl ${neonGlow} border border-[#2a2e44]`}> 
            <h4 className="text-sm text-gray-300">Contact</h4>
            <div className="mt-3 flex flex-col gap-2">
              <a className="text-white text-sm flex items-center gap-2" href={`mailto:${profile.email}`}><Mail className="w-4 h-4 text-[#06b6d4]" /> {profile.email}</a>
              <a className="text-white text-sm flex items-center gap-2" href={`tel:${profile.phone || ''}`}><Phone className="w-4 h-4 text-[#7c3aed]" /> {profile.phone || '—'}</a>
              <a className="text-white text-sm flex items-center gap-2" href={profile.website || '#'} target="_blank" rel="noreferrer"><Globe className="w-4 h-4 text-[#60a5fa]" /> Website</a>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#071228] border border-[#122033]"><h4 className="text-sm text-gray-300">Quick Skills</h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {(skills || []).slice(0,6).map(s=> (
                <span key={s.id || s.skill_name} className="px-3 py-1 bg-[#071a2b] rounded-full text-xs text-[#9ee7d0] border border-[#102033]">{s.skill_name || s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // --- Experience timeline ---
  const ExperienceTimeline = () => (
    <section className="max-w-6xl mx-auto py-12">
      <h3 className="text-2xl font-bold text-white mb-6">Experience</h3>
      <div className="space-y-6">
        {(experience || []).map((exp) => (
          <div key={exp.id} className="p-6 rounded-2xl bg-gradient-to-br from-[#071228] to-[#041026] border border-[#172033] shadow-lg">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h4 className="text-lg font-bold text-[#c7dbff]">{exp.role}</h4>
                <div className="text-sm text-[#9fb3d0]">{exp.company_name}</div>
              </div>
              <div className="text-sm text-[#86a6d8]">{exp.start_date} — {exp.end_date || 'Present'}</div>
            </div>
            <div className="mt-4 text-gray-300">
              {exp.bullet_points && exp.bullet_points.length > 0 ? (
                <ul className="space-y-2 list-inside">
                  {exp.bullet_points.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-3"><ListChecks className="w-4 h-4 text-[#7ee7b6] mt-1" /> <span>{pt}</span></li>
                  ))}
                </ul>
              ) : (
                <p>{exp.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  // --- Projects as code-style cards ---
  const ProjectsGrid = () => (
    <section className="max-w-6xl mx-auto py-12">
      <h3 className="text-2xl font-bold text-white mb-6">Projects</h3>
      <div className="grid md:grid-cols-2 gap-6">
        {(projects || []).map((p) => (
          <article key={p.id} className="rounded-2xl bg-[#071228] border border-[#122033] shadow-lg overflow-hidden">
            <div className="p-4 border-b border-[#0f2030]">
             
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-6 rounded-md bg-[#0b2030] flex items-center justify-center text-xs text-[#9bdfff]">{p.tag || 'JS'}</div>
                  <div>
                    <h4 className="text-lg font-bold text-[#bfe7ff]">{p.title}</h4>
                    <div className="text-sm text-[#8ea9c9]">{p.subtitle || p.type || ''}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <a href={`/projects/${p.id}`} target="_blank" rel="noreferrer" className="text-[#6ee7b7]">View</a>
                  <a href={p.repo_url || '#'} target="_blank" rel="noreferrer" className="text-[#60a5fa]">Repo</a>
                  
                </div>
                
              </div>
              <div className="mt-3">
                  {p.image_url ? (
                <img src={p.image_url} alt={p.title} className="w-full h-80  object-cover border-b border-gray-200" />
            ) : (
                <div className="h-2 bg-sky-500"></div> 
            )}
            
            </div>
            </div>
             {p.details && p.details.length > 0 ? (
                <ul className="mt-3 text-gray-600 space-y-1">
                  {p.details.map((detail, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-sky-500 font-bold flex-shrink-0">•</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 text-sm">{proj.description}</p>
              )}



            <div className="p-4 border-t border-[#0f2030]">
              <div className="flex items-center gap-2 flex-wrap">
                {(p.tech_stack || []).slice(0,6).map((t, i) => (
                  <span key={i} className="text-xs px-2 py-1 bg-[#071a2b] rounded-full text-[#9ee7d0] border border-[#102033]">{t}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );

  const skillsList = [
  { name: 'React Native', icon: '/reactnative.jpeg' },
  { name: 'Manual Testing', icon: '/manual.jpeg' },
  { name: 'HTML', icon: '/html.jpeg' },
  { name: 'React.js', icon: '/reactjs.jpeg' },
  { name: 'Node.js', icon: '/nodejs.jpeg' },
  { name: 'CSS', icon: '/css.jpeg' },
  { name: 'tailwind', icon: '/tailwind.jpeg' },
  { name: 'AWS', icon: '/aws.jpeg' },
  { name: 'PostgreSQL', icon: '/post.jpeg' },
  { name: 'Bitbucket', icon: '/bt.jpeg' },
  { name: 'Git & GitHub', icon: '/git.jpeg' },
  { name: 'Next.js', icon: '/next.jpeg' },
  { name: 'JavaScript', icon: '/js.jpeg' },
];
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // Stagger the skill items
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};
const SkillsRow = () => {
  return (
    <section className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <motion.h4
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-2xl sm:text-3xl text-white font-bold mb-8 tracking-wider border-b-2 border-indigo-500 pb-2 inline-block"
      >
        My Technical Skills
      </motion.h4>

      <motion.div
        // Increased gap and slightly fewer columns for larger cards
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6" 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {skillsList.map((skill, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            // --- ENHANCED FOR SIZE AND 3D ANIMATION ---
            whileHover={{
              scale: 1.1, // More noticeable size increase
              rotateX: 5, // Subtle X-axis tilt
              rotateY: 5, // Subtle Y-axis tilt
              // Dramatic box shadow and lift
              boxShadow: "0px 15px 40px rgba(0,0,0,0.7), 0px 0px 12px rgba(99, 102, 241, 0.4)", 
              z: 200, // Brings the item significantly "forward"
              backgroundColor: "#122033", // Subtle background color shift on hover
            }}
            transition={{ 
              type: "spring", 
              stiffness: 300, // Stiffer spring
              damping: 15, // Higher damping for quick stop
              mass: 0.8 // Added mass for a heavier, more impactful feel
            }}
            // --- END ENHANCED FOR 3D ANIMATION ---
            className="flex flex-col items-center p-6 rounded-xl bg-[#071228] border border-[#122033] cursor-pointer shadow-lg hover:border-indigo-500 transition-all duration-300 group"
          >
            {/* Increased Icon Size (w-16 h-16) */}
            <div className="relative w-16 h-16 flex items-center justify-center mb-4">
              <img
                src={skill.icon}
                alt={`${skill.name} icon`}
                width={150} // Increased size for image tag
                height={150} // Increased size for image tag
                className="object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/logos/default-skill.png';
                }}
              />
            </div>

            {/* Increased Text Size */}
            <span className="text-base font-medium text-center text-gray-100 group-hover:text-indigo-400 transition-colors">
              {skill.name}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};
  const EducationSection = () => (
    <section className="max-w-6xl mx-auto py-8">
      <h4 className="text-lg text-white font-semibold mb-4">Education</h4>
      <div className="grid md:grid-cols-3 gap-4">
        {(education || []).map(ed => (
          <div key={ed.id} className="p-4 rounded-lg bg-[#071228] border border-[#122033]">
            <div className="text-sm text-[#9fb3d0]">{ed.institute}</div>
            <div className="text-white font-bold">{ed.degree}</div>
            <div className="text-xs text-[#86a6d8]">{ed.start_year} — {ed.end_year}</div>
          </div>
        ))}
      </div>
    </section>
  );

  // --- Blog grid (posts) ---
  const BlogGrid = () => (
    <section className="max-w-6xl mx-auto py-12">
      <h3 className="text-2xl font-bold text-white mb-6">Blog</h3>
      <div className="grid md:grid-cols-3 gap-6">
        {(posts || []).map(post => (
          <article key={post.id} className="rounded-lg bg-[#071228] border border-[#122033] overflow-hidden">
            <div className="p-4">
              <h4 className="font-semibold text-white mb-2">{post.title}</h4>
              <p className="text-sm text-[#9fb3d0] line-clamp-3">{post.excerpt || post.summary || post.description}</p>
            </div>
            <div className="p-4 border-t border-[#0f2030] flex items-center justify-between">
              <a href={`/blog/${post.slug || post.id}`} className="text-sm text-[#60a5fa]">Read</a>
              <div className="text-xs text-[#86a6d8]">{new Date(post.published_at || Date.now()).toLocaleDateString()}</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );

  // --- Contact ---
  const Contact = () => (
    <section className="max-w-6xl mx-auto py-12">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="rounded-2xl p-8 bg-[#071228] border border-[#122033]">
          <h4 className="text-xl text-white font-bold">Contact</h4>
          <p className="text-sm text-[#9fb3d0] mt-2">Want to work together? Send a message and I will reply shortly.</p>
          <form className="mt-6 space-y-4" onSubmit={(e)=>e.preventDefault()}>
            <input placeholder="Your name" className="w-full p-3 rounded-md bg-[#031523] border border-[#102033] text-white text-sm" />
            <input placeholder="Your email" className="w-full p-3 rounded-md bg-[#031523] border border-[#102033] text-white text-sm" />
            <textarea placeholder="Message" rows={4} className="w-full p-3 rounded-md bg-[#031523] border border-[#102033] text-white text-sm" />
            <button className="px-6 py-3 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] text-white font-semibold">Send Message</button>
          </form>
        </div>

        <div className="rounded-2xl p-8 bg-[#071228] border border-[#122033]">
          <h4 className="text-xl text-white font-bold">Get in touch</h4>
          <div className="mt-4 space-y-3 text-sm text-[#9fb3d0]">
            <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-[#06b6d4]" /> {profile.email}</div>
            <div className="flex items-center gap-3"><Phone className="w-4 h-4 text-[#7c3aed]" /> {profile.phone || '9600576351'}</div>
            <div className="flex items-center gap-3"><Globe className="w-4 h-4 text-[#60a5fa]" /> {profile.website || 'https://elango-p.vercel.app/elango/profile'}</div>
            <div className="flex items-center gap-3 mt-4">
              <a href={profile.github || '#'} target="_blank" rel="noreferrer"><Github className="w-5 h-5 text-[#9ee7d0]" /></a>
              <a href={profile.linkedin || 'https://www.linkedin.com/in/elango-ponnusamy-881ba2139/'} target="_blank" rel="noreferrer"><Linkedin className="w-5 h-5 text-[#7c3aed]" /></a>
              <a href={profile.twitter || '#'} target="_blank" rel="noreferrer"><Twitter className="w-5 h-5 text-[#60a5fa]" /></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // --- Footer ---
  const Footer = () => (
    <footer className="mt-12 py-8">
      <div className="max-w-6xl mx-auto text-center text-sm text-[#9fb3d0]">© {new Date().getFullYear()} {profile.display_name || profile.full_name} — Built with ❤️</div>
    </footer>
  );

  return (
    <div className="min-h-screen bg-[#050612] text-white">
      <div className="relative overflow-hidden">
        <motion.div aria-hidden className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.09),transparent_30%)]"></motion.div>
        <div className="relative">
          <div className="max-w-7xl mx-auto px-6">
            <Hero />
            <About />
            <ExperienceTimeline />
            <ProjectsGrid />
            <SkillsRow />
            <EducationSection />
            <BlogGrid />
            <Contact />
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}
