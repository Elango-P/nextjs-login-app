"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { motion } from "framer-motion";

export default function PublicProfile({ params }) {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  console.log('PublicProfile > profile ---------------------------->', profile);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  // ... (Data Loading Logic Remains the Same) ...

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);

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
        supabase.from("experience").select("*").eq("user_id", userId),
        supabase.from("education").select("*").eq("user_id", userId),
        supabase.from("skills").select("*").eq("user_id", userId),
      ]);

    // --- TEMPORARY: Injecting content for demonstration. In a real app, this data would come from the database.
    const augmentedExperience = exps.map(exp => ({
        ...exp,
        // Assuming the description field holds the full details or is replaced by this array
        bullet_points: [
          ...(exp.description ? [exp.description] : []), // Keep existing description if present
        ]
    }));

    const augmentedProjects = projs.map(proj => ({
      ...proj,
      // Assuming project descriptions or a separate details field
      details: [
        ...(proj.description ? proj.description: []), 
      ]
    }));
    // --- END TEMPORARY INJECTION ---


    setProjects(augmentedProjects || []);
    setExperience(augmentedExperience || []);
    setEducation(eds || []);
    setSkills(sks || []);
    setLoading(false);
  }

  if (loading) return <p className="p-8 text-center text-gray-600">Loading...</p>;
  if (!profile) return <p className="p-8 text-center text-red-600">User not found</p>;

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
   <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <motion.div
        className="max-w-6xl mx-auto space-y-8 bg-white shadow-2xl rounded-xl p-6 md:p-10"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.15 } },
        }}
      >
        {/* Header Section (Unchanged from previous response) */}
        <motion.div
          className="flex flex-col md:flex-row items-center gap-6 p-4"
          variants={fadeUp}
        >
          {/* Profile Image */}
          <img
            src={profile.profile_photo || "https://media.licdn.com/dms/image/v2/D5603AQFBfFSIBT2EIQ/profile-displayphoto-crop_800_800/B56ZjkiLSuHcAM-/0/1756180822130?e=1765411200&v=beta&t=-sly5ufhDlCoffhhuwFBTo4MZ30jvIetpUtbq7plXV4"}
            alt="Profile photo"
            className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-blue-600 object-cover shadow-lg"
          />
          <div className="text-center md:text-left">
            <h1 className="text-5xl font-black text-blue-800 tracking-tighter">Elango Ponnusamy</h1>
            <p className="mt-1 text-xl font-medium text-gray-700">{profile.bio}</p>

            {/* Contact Info */}
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:gap-6 text-sm text-gray-600">
              <a href="mailto:b.elango93@gmail.com" className="hover:text-blue-600 transition-colors flex items-center gap-1">
                <span className="text-lg">📧</span> b.elango93@gmail.com
              </a>
              <span className="flex items-center gap-1">
                <span className="text-lg">📞</span> 9600576351
              </span>
              <a
                href="https://www.linkedin.com/in/p-elango-881ba2139/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors flex items-center gap-1"
              >
                <span className="text-lg">🔗</span> LinkedIn
              </a>
            </div>
          </div>
        </motion.div>

        {/* Skills Section (Unchanged) */}
        <motion.section variants={fadeUp}>
          <h2 className="text-2xl font-bold uppercase tracking-wider text-gray-800 pt-4 pb-2 border-b-2 border-blue-600 mb-6">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <motion.span
                key={s.id}
                className="px-3 py-1 bg-white text-blue-700 rounded-full font-medium text-sm border border-blue-300 hover:bg-blue-50 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                {s.skill_name}
              </motion.span>
            ))}
          </div>
        </motion.section>

        {/* EXPERIENCE SECTION (UPDATED with Bullet Points) */}
        <motion.section variants={fadeUp}>
          <h2 className="text-2xl font-bold uppercase tracking-wider text-gray-800 pt-4 pb-2 border-b-2 border-blue-600 mb-6">
            Experience
          </h2>
          <div className="space-y-6">
            {experience.map((exp) => (
              <motion.div
                key={exp.id}
                className="p-6 bg-white border-l-4 border-blue-600 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                whileHover={{ x: 5 }}
              >
                <div className="flex justify-between items-start flex-wrap mb-1">
                  <h3 className="text-xl font-bold text-gray-900">{exp.role}</h3>
                  <p className="text-sm font-medium text-gray-500 whitespace-nowrap pt-1">
                    {exp.start_date} - {exp.end_date || "Present"}
                  </p>
                </div>
                <p className="text-md font-medium text-gray-700">{exp.company_name}</p>
                
                {/* Check if bullet_points exists (from the temporary data augmentation) */}
                {exp.bullet_points && exp.bullet_points.length > 0 ? (
                  <ul className="mt-3 text-gray-700 list-disc ml-5 space-y-1">
                    {exp.bullet_points.map((point, index) => (
                      <li key={index} className="text-sm leading-relaxed">{point}</li>
                    ))}
                  </ul>
                ) : (
                  // Fallback to the original description if bullet_points is not used
                  <p className="mt-3 text-gray-700 leading-relaxed">{exp.description}</p>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* PROJECTS SECTION (UPDATED for Integrations) */}
        <motion.section variants={fadeUp}>
          <h2 className="text-2xl font-bold uppercase tracking-wider text-gray-800 pt-4 pb-2 border-b-2 border-blue-600 mb-6">
            Key System Integrations & Projects
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((proj) => (
              <motion.div
                key={proj.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                whileHover={{ y: -5 }}
              >
                {/* Only show image if URL is valid, otherwise use padding */}
                {proj.image_url ? (
                    <img src={proj.image_url} alt={proj.title} className="w-full h-48 object-cover" />
                ) : (
                    <div className="h-4 bg-blue-100"></div> // Small placeholder for visual separation
                )}
                
                <div className="p-5">
                  <h3 className="font-bold text-xl text-blue-700 mb-2">{proj.title}</h3>
                  
                  {/* Check for details array (from the temporary data augmentation) */}
                  {proj.details && proj.details.length > 0 ? (
                    <ul className="mt-2 text-gray-600 list-disc ml-5 space-y-1">
                      {proj.details.map((detail, index) => (
                        <li key={index} className="text-sm">{detail}</li>
                      ))}
                    </ul>
                  ) : (
                    // Fallback to the original description
                    <p className="text-gray-600 text-sm">{proj.description}</p>
                  )}
                  
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Education Section (Unchanged) */}
        <motion.section variants={fadeUp}>
          <h2 className="text-2xl font-bold uppercase tracking-wider text-gray-800 pt-4 pb-2 border-b-2 border-blue-600 mb-6">
            Education
          </h2>
          <div className="space-y-4">
            {education.map((ed) => (
              <motion.div
                key={ed.id}
                className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                whileHover={{ scale: 1.01 }}
              >
                <h3 className="text-lg font-bold text-gray-800">{ed.degree}</h3>
                <p className="text-gray-700">{ed.institute}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {ed.start_year} - {ed.end_year}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
}