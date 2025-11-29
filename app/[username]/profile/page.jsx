"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import loaderAnimation from "../../../public/loader.json";
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
  GitBranch,
  Twitter,
  Github,
  Linkedin,
} from "lucide-react";

export default function PublicProfile({ params }) {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [skills, setSkills] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const resolvedParams = React.use(params);

  // --- Load data ---
  useEffect(() => {
    loadData();
  }, []);


  async function loadData() {
    setLoading(true);
    try {
      // Example: lookup user by username param
      const username = resolvedParams?.username || "elango";
      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("full_name", username)
        .maybeSingle();

      if (!userData) {
        setProfile(null);
        setLoading(false);
        return;
      }

      setProfile(userData);
      const userId = userData.id;

      const [projs, exps, eds, sks, bgs] = await Promise.all([
        supabase.from("projects").select("*").eq("user_id", userId),
        supabase.from("experience").select("*").eq("user_id", userId).order("start_date", { ascending: false }),
        supabase.from("education").select("*").eq("user_id", userId),
        supabase.from("skills").select("*").eq("user_id", userId),
        supabase.from("blogs").select("*").eq("user_id", userId).limit(6),
      ]).then(res => res.map(r => r.data));

      setProjects(projs || []);
      setExperience(exps || []);
      setEducation(eds || []);
      setSkills(sks || []);
      setBlogs(bgs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#061226]">
        <div className="w-72">
          <Lottie animationData={loaderAnimation} loop />
        </div>
      </div>
    );

  if (!profile) return <p className="p-8 text-center text-rose-400">User not found</p>;

  // Animations
  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  };

  // Small helpers
  const formatDateRange = (start, end) => {
    if (!start) return "";
    const s = new Date(start).toLocaleString("default", { year: "numeric", month: "short" });
    const e = end ? new Date(end).toLocaleString("default", { year: "numeric", month: "short" }) : "Present";
    return `${s} — ${e}`;
  };

  // --- Navigation ---
  const Navigation = () => {
    const scrollToSection = (e, id) => {
      e.preventDefault();
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    };

    return (
      <nav className="hidden md:flex items-center space-x-6">
        {[
          { name: 'ABOUT', id: 'about' },
          { name: 'EXPERIENCE', id: 'experience' },
          { name: 'SKILLS', id: 'skills' },
          { name: 'EDUCATION', id: 'education' },
          { name: 'BLOGS', id: 'blogs' },
          { name: 'PROJECTS', id: 'projects' }
        ].map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors whitespace-nowrap"
            onClick={(e) => scrollToSection(e, item.id)}
          >
            {item.name}
          </a>
        ))}
      </nav>
    );
  };

  // --- Sections ---
  // --- Sections ---
  const Header = () => (
    <header id="about" className="relative z-10 py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-2xl font-bold text-white">{"Elango" || 'PORTFOLIO'}</h1>
          <Navigation />
        </div>
        <div className="flex flex-col lg:flex-row items-center gap-8">
        {/* Left: Avatar + intro */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex items-center gap-6">
          <div className="relative">
            <img src={"https://elangomedia.s3.ap-southeast-2.amazonaws.com/product/180-product-4794-20251125201841.png"}
              alt={profile.full_name}
              className="w-36 h-36 md:w-44 md:h-44 rounded-2xl object-cover ring-2 ring-rose-400/30 shadow-2xl"
            />
            <div className="absolute right-0 top-0 -translate-x-2 translate-y-2 bg-gradient-to-br from-pink-500 to-violet-600 text-white text-xs px-2 py-1 rounded-md shadow">
              {profile.role || "Software Developer"}
            </div>
          </div>

          <div className="text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">{profile.display_name || profile.full_name}</h1>
            <p className="mt-2 text-lg text-rose-200 max-w-xl">{profile.headline || "Building delightful web apps and APIs — JavaScript, React, Node.js."}</p>

            <div className="mt-4 flex flex-wrap gap-3 items-center">
              <a href={`mailto:${profile.email || 'hello@example.com'}`} className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-rose-500 to-violet-500 text-white font-semibold shadow hover:scale-[1.02] transition">
                <Mail className="w-4 h-4" /> Contact
              </a>

              <a href={profile.website || "#"} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-full border border-rose-700 text-rose-200 text-sm hover:bg-white/5 transition">Visit site</a>

              <div className="ml-1 flex items-center gap-3 text-rose-200">
                <a

                  href="https://www.linkedin.com/in/p-elango-881ba2139/"
                  aria-label="LinkedIn" className="hover:text-white"><Linkedin className="w-5 h-5" /></a>
                <a href={profile.github_url || "#"} aria-label="Github" className="hover:text-white"><Github className="w-5 h-5" /></a>
                <a href={profile.twitter_url || "#"} aria-label="Twitter" className="hover:text-white"><Twitter className="w-5 h-5" /></a>
              </div>
            </div>

            <div className="mt-5 flex gap-2 flex-wrap">
              {(profile.tags || ["React", "Next.js", "Node.js"]).slice(0, 6).map((t, i) => (
                <span key={i} className="text-xs px-3 py-1 rounded-md bg-white/5 text-rose-200 border border-white/6">{t}</span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right: Code editor preview */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mt-8 lg:mt-0 w-full lg:w-[540px] rounded-xl p-4 bg-[#071028] border border-white/6 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56]"></span>
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]"></span>
            <span className="w-3 h-3 rounded-full bg-[#27c93f]"></span>
            <div className="ml-auto text-xs text-rose-300">main.js</div>
          </div>

          <pre className="text-xs leading-relaxed text-[#9fe3ff] font-mono bg-transparent overflow-x-auto p-3 rounded">
            {`const profile = {
  name: "${profile.display_name || profile.full_name}",
  role: "${profile.role || 'Software Developer'}",
  tech: ["${(profile.tags || ['React', 'Next.js']).join('", "')}"]
};

export default profile;
`}
          </pre>
        </motion.div>
        </div>
      </div>
    </header>
  );

  const Experience = () => (
    <section id="experience" className="max-w-7xl mx-auto px-6 py-12">
      <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <Briefcase className="w-5 h-5 text-rose-400" /> Experience
      </motion.h2>

      <div className="grid lg:grid-cols-2 gap-6">
        {experience.length ? experience.map(exp => (
          <motion.div key={exp.id} whileHover={{ y: -6 }} className="relative p-6 rounded-xl bg-[#041025] border border-white/6 shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-extrabold text-white">{exp.role}</h3>
                <p className="text-sm text-rose-200">{exp.company_name}</p>
              </div>
              <div className="text-xs text-rose-300">{formatDateRange(exp.start_date, exp.end_date)}</div>
            </div>

            <div className="mt-4 text-sm text-rose-100">
              {exp.bullet_points && exp.bullet_points.length ? (
                <ul className="space-y-2 list-inside">
                  {exp.bullet_points.map((b, i) => (
                    <li key={i} className="flex items-start gap-2"><ListChecks className="w-4 h-4 text-emerald-400 mt-1" /> <span>{b}</span></li>
                  ))}
                </ul>
              ) : (
                <p>{exp.description}</p>
              )}
            </div>
          </motion.div>
        )) : <p className="text-rose-200">No experience added yet.</p>}
      </div>
    </section>
  );

  const Projects = () => (
    <section id="projects" className="max-w-7xl mx-auto px-6 py-12">
      <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
        <Code className="w-5 h-5 text-rose-400" /> Projects
      </motion.h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length ? projects.map((proj) => (
          <motion.article 
            key={proj.id}
            className="group relative rounded-xl overflow-hidden bg-[#041025] border border-white/6 hover:border-rose-500/30 transition-colors duration-300"
            whileHover={{ y: -6 }}
          >
            {proj.image_url ? (
              <div className="h-40 overflow-hidden">
                <img 
                  src={proj.image_url} 
                  alt={proj.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            ) : (
              <div className="h-2 bg-gradient-to-r from-rose-500 to-violet-600"></div> 
            )}
            
            <div className="p-5">
              <div className="flex justify-between items-start gap-3">
                <h3 className="text-lg font-extrabold text-white">{proj.title}</h3>
                {(proj.live_url || proj.repo_url) && (
                  <div className="flex gap-2">
                    {proj.live_url && (
                      <a 
                        href={proj.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-rose-300 hover:text-white transition-colors"
                        title="View Live"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    {proj.repo_url && (
                      <a 
                        href={proj.repo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-rose-300 hover:text-white transition-colors"
                        title="View Source"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                )}
              </div>
              
              <p className="mt-2 text-sm text-rose-200">
                {proj.description || proj.tagline || 'No description available'}
              </p>
              
              {(proj.tech_stack?.length > 0 || proj.skills?.length > 0) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {(proj.tech_stack || proj.skills || []).slice(0, 5).map((tech, idx) => (
                    <motion.span 
                      key={idx} 
                      className="text-xs px-2.5 py-1 bg-white/5 text-rose-200 rounded-full border border-white/5"
                      whileHover={{ scale: 1.05 }}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              )}
            </div>
          </motion.article>
        )) : (
          <div className="col-span-full text-center py-10">
            <p className="text-rose-300">No projects to display yet.</p>
          </div>
        )}
      </div>
    </section>
  );

  const Skills = () => (
    <section id="skills" className="max-w-7xl mx-auto px-6 py-12">
      <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <Zap className="w-5 h-5 text-rose-400" /> Skills
      </motion.h2>

      <div className="flex flex-wrap gap-3">
        {skills.length ? skills.map(s => (
          <div key={s.id || s.skill_name} className="w-auto px-3 py-2 rounded bg-[#041225] border border-white/6 text-rose-200 text-sm font-medium shadow">{s.skill_name || s}</div>
        )) : (
          ["HTML", "CSS", "JavaScript", "React", "Node.js"].map((s, i) => (
            <div key={i} className="w-auto px-3 py-2 rounded bg-[#041225] border border-white/6 text-rose-200 text-sm font-medium shadow">{s}</div>
          ))
        )}
      </div>
    </section>
  );

  const Education = () => (
    <section id="education" className="max-w-7xl mx-auto px-6 py-12">
      <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <GraduationCap className="w-5 h-5 text-rose-400" /> Education
      </motion.h2>

      <div className="grid md:grid-cols-3 gap-4">
        {education.length ? education.map(ed => (
          <div key={ed.id} className="p-4 rounded-xl bg-[#041025] border border-white/6 text-rose-200">
            <h3 className="font-bold text-white">{ed.degree}</h3>
            <p className="text-sm mt-1">{ed.institute}</p>
            <p className="text-xs mt-2 text-rose-300">{ed.start_year} — {ed.end_year}</p>
          </div>
        )) : (
          <p className="text-rose-200">No education records.</p>
        )}
      </div>
    </section>
  );

  const Blogs = () => (
    <section id="blogs" className="max-w-7xl mx-auto px-6 py-12">
      <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <GitBranch className="w-5 h-5 text-rose-400" /> Blog & Articles
      </motion.h2>

      <div className="grid md:grid-cols-3 gap-6">
        {blogs.length ? blogs.map(b => (
          <article key={b.id} className="rounded-xl overflow-hidden bg-[#031224] border border-white/6 p-4">
            <h3 className="font-bold text-white">{b.title}</h3>
            <p className="text-sm text-rose-200 mt-2">{b.excerpt || b.description?.slice(0, 100)}</p>
            <div className="mt-4 text-xs text-rose-300">{b.reading_time || '3 min read'}</div>
          </article>
        )) : (
          <p className="text-rose-200">No blog posts yet.</p>
        )}
      </div>
    </section>
  );

  const Contact = () => (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <Mail className="w-5 h-5 text-rose-400" /> Contact
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-6">
        <form className="p-6 rounded-xl bg-[#041025] border border-white/6 space-y-4">
          <input placeholder="Your name" className="w-full p-3 rounded bg-transparent border border-white/6 text-rose-200 text-sm" />
          <input placeholder="Your email" className="w-full p-3 rounded bg-transparent border border-white/6 text-rose-200 text-sm" />
          <textarea placeholder="Message" className="w-full p-3 rounded bg-transparent border border-white/6 text-rose-200 text-sm h-32"></textarea>
          <div className="flex items-center justify-between">
            <button type="button" className="px-4 py-2 rounded bg-gradient-to-r from-rose-500 to-violet-500 text-white font-semibold shadow">Send message</button>
            <div className="text-xs text-rose-300">Or email me at <a href={`mailto:${profile.email}`} className="underline">{profile.email}</a></div>
          </div>
        </form>

        <div className="p-6 rounded-xl bg-[#041025] border border-white/6">
          <h3 className="font-bold text-white">Get in touch</h3>
          <p className="text-rose-200 mt-2">I'm open to freelance work and new opportunities. Connect on social or send an email.</p>

          <div className="mt-4 flex flex-col gap-3 text-rose-200">
            <div className="flex items-center gap-3"><Phone className="w-4 h-4" /> <span>{profile.phone || '—'}</span></div>
            <div className="flex items-center gap-3"><Globe className="w-4 h-4" /> <a href={profile.website} className="underline">Website</a></div>
            <div className="flex items-center gap-3"><Linkedin className="w-4 h-4" /> <a href={profile.linkedin_url} className="underline">LinkedIn</a></div>
            <div className="flex items-center gap-3"><Github className="w-4 h-4" /> <a href={profile.github_url} className="underline">GitHub</a></div>
          </div>
        </div>
      </div>
    </section>
  );

  const Footer = () => (
    <footer className="mt-6 border-t border-white/6 py-8">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-rose-200">
        <div>© {new Date().getFullYear()} {profile.display_name || profile.full_name}</div>
        <div className="flex items-center gap-4">
          <a href={profile.twitter_url} className="hover:text-white"><Twitter className="w-4 h-4" /></a>
          <a href={profile.github_url} className="hover:text-white"><Github className="w-4 h-4" /></a>
          <a href={profile.linkedin_url} className="hover:text-white"><Linkedin className="w-4 h-4" /></a>
        </div>
      </div>
    </footer>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#030617] via-[#061226] to-[#071428] text-rose-50">
      {/* subtle background shapes */}
      <motion.div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -left-40 top-1/3 w-96 h-96 rounded-full bg-gradient-to-br from-pink-700 via-violet-700 to-indigo-600 opacity-20 blur-3xl" />
        <div className="absolute -right-40 bottom-0 w-96 h-96 rounded-full bg-gradient-to-br from-cyan-600 via-emerald-500 opacity-12 blur-3xl" />
      </motion.div>

      <main className="relative z-10">
        <Header />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Blogs />
        <Contact />
        <Footer />
      </main>
    </div>
  );
}
