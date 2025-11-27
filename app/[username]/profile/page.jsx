"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { motion } from "framer-motion";
// Importing Lucide icons for a modern, consistent look
import { Mail, Phone, Link, Briefcase, GraduationCap, Zap, Code, ListChecks, Globe } from 'lucide-react';

// --- Component Definition ---

export default function PublicProfile({ params }) {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

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
      .eq("full_name", "elango")
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
  if (loading) return <p className="p-8 text-center text-gray-600">Loading...</p>;
  if (!profile) return <p className="p-8 text-center text-red-600">User not found</p>;

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // --- Helper Functions for Section Rendering ---

  const renderHeaderSection = (profile, fadeUp) => (
    <motion.div
      className="flex flex-col md:flex-row items-center gap-8 border-b border-gray-200 pb-8"
      variants={fadeUp}
    >
      {/* Profile Image */}
      <img
        src={"https://elangomedia.s3.ap-southeast-2.amazonaws.com/product/180-product-4794-20251125201841.png"}
        alt="Profile photo"
        className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover ring-2 ring-sky-500 ring-offset-4 shadow-xl"
      />
      <div className="text-center md:text-left">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tighter leading-none">Elango Ponnusamy</h1>
        <p className="mt-2 text-2xl font-light text-gray-600">{profile.bio}</p>

        {/* Contact Info with Lucide Icons */}
        <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-3 text-sm text-gray-600">
          <a href="mailto:b.elango93@gmail.com" className="hover:text-sky-600 transition-colors flex items-center gap-2 font-medium">
            <Mail className="w-4 h-4 text-sky-500" /> b.elango93@gmail.com
          </a>
          <span className="flex items-center gap-2 font-medium">
            <Phone className="w-4 h-4 text-sky-500" /> 9600576351
          </span>
          <a
            href="https://www.linkedin.com/in/p-elango-881ba2139/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sky-600 transition-colors flex items-center gap-2 font-medium"
          >
            <Link className="w-4 h-4 text-sky-500" /> LinkedIn Profile
          </a>
          <a
  href="https://elango-p.vercel.app/elango/profile"
  target="_blank"
  rel="noopener noreferrer"
  className="hover:text-sky-600 transition-colors flex items-center gap-2 font-medium"
>
  {/* The Link icon is often used for external links, but if you want Globe for a website: */}
  <Globe className="w-4 h-4 text-sky-500" />
  {/* The text comes immediately after the icon */}
  Website
</a>
        </div>
      </div>
    </motion.div>
  );

  const renderExperienceSection = (experience, fadeUp) => (
    <motion.section variants={fadeUp}>
      <h2 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-gray-800 border-b-2 border-sky-400 pb-3 mb-6">
        <Briefcase className="w-6 h-6 text-sky-500" /> Experience
      </h2>
      <div className="space-y-8">
        {experience.map((exp) => (
          <motion.div
            key={exp.id}
            className="p-6 bg-white border-l-4 border-sky-500 shadow-md rounded-lg transition-shadow duration-300 hover:shadow-xl"
            whileHover={{ x: 3 }}
          >
            <div className="flex justify-between items-start flex-wrap mb-1">
              <h3 className="text-xl font-extrabold text-gray-900 leading-tight">{exp.role}</h3>
              <p className="text-sm font-semibold text-gray-500 whitespace-nowrap pt-1">
                {exp.start_date} - {exp.end_date || "Present"}
              </p>
            </div>
            <p className="text-lg font-medium text-sky-600">{exp.company_name}</p>
            
            {exp.bullet_points && exp.bullet_points.length > 0 ? (
              <ul className="mt-4 text-gray-700 space-y-2">
                {exp.bullet_points.map((point, index) => (
                  <li key={index} className="text-base flex items-start gap-2">
                    <ListChecks className="w-4 h-4 mt-1 text-green-500 flex-shrink-0" />
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-gray-700 leading-relaxed">{exp.description}</p>
            )}
          </motion.div>
        ))}
      </div>
    </motion.section>
  );

  const renderProjectsSection = (projects, fadeUp) => (
    <motion.section variants={fadeUp}>
      <h2 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-gray-800 border-b-2 border-sky-400 pb-3 mb-6">
        <Code className="w-6 h-6 text-sky-500" /> Projects
      </h2>
      <div className="grid md:grid-cols-2 gap-8">
        {projects.map((proj) => (
          <motion.div
            key={proj.id}
            className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-sky-300"
            whileHover={{ y: -4 }}
          >
            {proj.image_url ? (
                <img src={proj.image_url} alt={proj.title} className="w-full h-40 object-cover border-b border-gray-200" />
            ) : (
                <div className="h-2 bg-sky-500"></div> 
            )}
            
            <div className="p-5">
              <h3 className="font-extrabold text-xl text-sky-700 mb-2">{proj.title}</h3>
              
              {proj.details && proj.details.length > 0 ? (
                <ul className="mt-3 text-gray-600 space-y-1">
                  {proj.details.map((detail, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-sky-500 font-bold flex-shrink-0">•</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 text-sm">{proj.description}</p>
              )}
              {Array.isArray(proj.skills) && proj.skills.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {proj.skills.map((s, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">{s}</span>
                  ))}
                </div>
              ) : Array.isArray(proj.tech_stack) && proj.tech_stack.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {proj.tech_stack.map((s, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">{s}</span>
                  ))}
                </div>
              ) : (typeof proj.tech_stack === 'string' && proj.tech_stack.trim()) ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {proj.tech_stack.split(',').map((s, idx) => {
                    const label = s.trim();
                    if (!label) return null;
                    return (
                      <span key={idx} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">{label}</span>
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
    <motion.section variants={fadeUp} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h2 className="flex items-center gap-3 text-2xl font-bold tracking-tight text-gray-800 border-b border-sky-400 pb-3 mb-5">
        <Zap className="w-5 h-5 text-sky-500" /> Core Skills
      </h2>
      <div className="flex flex-wrap gap-3">
        {skills.map((s) => (
          <motion.span
            key={s.id}
            className="px-3 py-1 bg-sky-50 text-sky-700 rounded-full font-semibold text-sm border border-sky-200 shadow-sm transition-colors"
            whileHover={{ scale: 1.05, backgroundColor: '#e0f2fe' }}
          >
            {s.skill_name}
          </motion.span>
        ))}
      </div>
    </motion.section>
  );

  const renderEducationSection = (education, fadeUp) => (
    <motion.section variants={fadeUp} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h2 className="flex items-center gap-3 text-2xl font-bold tracking-tight text-gray-800 border-b border-sky-400 pb-3 mb-5">
        <GraduationCap className="w-5 h-5 text-sky-500" /> Education
      </h2>
      <div className="space-y-4">
        {education.map((ed) => (
          <motion.div
            key={ed.id}
            className="p-3 bg-gray-50 rounded-lg border border-gray-200 transition-shadow hover:shadow-md"
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-lg font-bold text-gray-800 leading-tight">{ed.degree}</h3>
            <p className="text-gray-700 text-sm font-medium">{ed.institute}</p>
            <p className="text-xs text-gray-500 mt-1">
              {ed.start_year} - {ed.end_year}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );

  // --- Main Render ---

  return (
   <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <motion.div
        className="max-w-7xl mx-auto bg-white shadow-2xl rounded-2xl p-6 md:p-12 border border-gray-200"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.15 } },
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
  );
}