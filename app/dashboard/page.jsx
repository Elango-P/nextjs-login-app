"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { jsPDF } from "jspdf";
import { Bar, Line } from "react-chartjs-2";
import dynamic from 'next/dynamic';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import loaderAnimation from "../../public/loader.json";
// Dynamically import theme-dependent components with SSR disabled
const ThemeSelector = dynamic(
  () => import("../../components/ThemeSelector"),
  { ssr: false }
);

const ParticlesThemeSelector = dynamic(
  () => import("../../components/ParticlesThemeSelector"),
  { ssr: false }
);

import { useTheme } from "../../context/ThemeContext";
import Lottie from "lottie-react";
import ThreeBackground from "../../components/ThreeBackground";
import Projects3D from "../../components/Projects3D";
import Stats3D from "../../components/Stats3D";
import Charts3D from "../../components/Charts3D";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function DashboardContent() {
  const { changeParticlesTheme } = useTheme();
  const router = useRouter();

  // auth + main entities
  const [authUser, setAuthUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [skills, setSkills] = useState([]);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  // UI state / modals
  const [editOpen, setEditOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);
  const [projEdit, setProjEdit] = useState(null);

  const [expOpen, setExpOpen] = useState(false);
  const [expEdit, setExpEdit] = useState(null);

  const [eduOpen, setEduOpen] = useState(false);
  const [eduEdit, setEduEdit] = useState(null);

  const [skillOpen, setSkillOpen] = useState(false);
  const [skillEdit, setSkillEdit] = useState(null);

  const [addrOpen, setAddrOpen] = useState(false);

  const [dark, setDark] = useState(false);

  // profile form
  const [nameInput, setNameInput] = useState("");
  const [bioInput, setBioInput] = useState("");
  const [skillsInput, setSkillsInput] = useState(""); // comma separated (legacy)
  const [photoFile, setPhotoFile] = useState(null);

  // project form
  const [projTitle, setProjTitle] = useState("");
  const [projDesc, setProjDesc] = useState("");
  const [projImage, setProjImage] = useState(null);
  const projFileRef = useRef();
  const [projSkills, setProjSkills] = useState("");

  // experience form
  const [expRole, setExpRole] = useState("");
  const [expCompany, setExpCompany] = useState("");
  const [expStart, setExpStart] = useState("");
  const [expEnd, setExpEnd] = useState("");
  const [expDesc, setExpDesc] = useState("");

  // education form
  const [eduSchool, setEduSchool] = useState("");
  const [eduDegree, setEduDegree] = useState("");
  const [eduStart, setEduStart] = useState("");
  const [eduEnd, setEduEnd] = useState("");

  // skill_name form
  const [skillName, setSkillName] = useState("");
  const [skillLevel, setSkillLevel] = useState("intermediate");

  // address form
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [stateStr, setStateStr] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [country, setCountry] = useState("");

  // lifecycle: load auth + data
  useEffect(() => {
    (async () => {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setAuthUser(user);

      // load profile
      const { data: prof } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single()
      if (prof) {
        setProfile(prof);
        setNameInput(prof.full_name || "");
        setBioInput(prof.bio || "");
        setSkillsInput((prof.skills || []).join(", "));
      } else {
        // create placeholder profile
        const { error: upErr } = await supabase.from("users").upsert({
          id: user.id,
          full_name: user.user_metadata?.full_name || "",
          email: user.email,
        });
        if (upErr) console.error(upErr);
        setProfile({
          id: user.id,
          full_name: user.user_metadata?.full_name || "",
          bio: "",
          profile_photo: null,
          skills: [],
          email: user.email,
        });
      }

      // load projects
      const { data: projs } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id) // note: table uses user_id
        .order("created_at", { ascending: false });
      setProjects(projs || []);

      // load experience
      const { data: exps } = await supabase
        .from("experience")
        .select("*")
        .eq("user_id", user.id)
        .order("start_date", { ascending: false });
      setExperience(exps || []);

      // load education
      const { data: eds } = await supabase
        .from("education")
        .select("*")
        .eq("user_id", user.id)
        .order("start_year", { ascending: false });
      setEducation(eds || []);

      // load skills table (if exists)
      const { data: sks } = await supabase
        .from("skills")
        .select("*")
        .eq("user_id", user.id);
      setSkills(sks || []);

      // load address (single row)
    //   const { data: addr } = await supabase
    //     .from("address")
    //     .select("*")
    //     .eq("user_id", user.id)
    //     .maybeSingle()
    //   setAddress(addr || null);

      // read theme
      const saved = localStorage.getItem("prefers-dark");
      if (saved === "true") {
        document.documentElement.classList.add("dark");
        setDark(true);
      }
      setLoading(false);
    })();
  }, [router]);

  // ---------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------
  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const toggleDark = () => {
    const newDark = !dark;
    setDark(newDark);
    if (newDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("prefers-dark", newDark ? "true" : "false");
  };

  const viewProfile = () => {
    if (!profile?.full_name) return;
    router.push(`/${encodeURIComponent(profile.full_name)}/profile`);
  };

const uploadFile = async (file) => {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: form,
  });

  const data = await res.json();

  if (data.url) return data.url;

  console.error("AWS Upload failed:", data.error);
  return null;
};


  // ---------------------------------------------------------
  // Profile save (upsert)
  // ---------------------------------------------------------
  const saveProfile = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      let photo_url = profile?.profile_photo || profile?.photo_url || null;
      if (photoFile) {
        const uploaded = await uploadFile(photoFile);
        if (uploaded) photo_url = uploaded;
      }
      // convert skillsInput to array if provided
      let skillsArr = profile?.skills || [];
      if (skillsInput) {
        skillsArr = skillsInput.split(",").map((s) => s.trim()).filter(Boolean);
      }
      const upd = {
        id: authUser.id,
        full_name: nameInput,
        bio: bioInput,
        profile_photo: photo_url,
        skills: skillsArr,
        email: authUser.email,
      };
      const { error } = await supabase.from("users").upsert(upd);
      if (error) console.error(error);
      else {
        setProfile((p) => ({ ...(p || {}), ...upd }));
      }
      setEditOpen(false);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // Projects: add/edit
  // ---------------------------------------------------------
  const openAddProject = () => {
    setProjEdit(null);
    setProjTitle("");
    setProjDesc("");
    setProjSkills("");
    setProjImage(null);
    if (projFileRef.current) projFileRef.current.value = "";
    setProjectOpen(true);
  };

  const openEditProject = (p) => {
    setProjEdit(p);
    setProjTitle(p.title || "");
    setProjDesc(p.description || "");
    const tech = p.tech_stack;
    setProjSkills(Array.isArray(tech) ? tech.join(", ") : (tech || ""));
    setProjImage(null);
    if (projFileRef.current) projFileRef.current.value = "";
    setProjectOpen(true);
  };

  const saveProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let image_url = null;
      if (projImage) {
        const uploaded = await uploadFile(projImage);
        if (uploaded) image_url = uploaded;
      }
      if (projEdit) {
        const baseUpdate = {
          title: projTitle,
          description: projDesc,
          tech_stack: projSkills,
        };
        if (image_url) baseUpdate.image_url = image_url;
        let resp = await supabase
          .from("projects")
          .update(baseUpdate)
          .eq("id", projEdit.id)
          .select()
          .single();
        if (resp.error && resp.error.code === "22P02") {
          const retryUpdate = { ...baseUpdate, tech_stack: projSkills.split(',').map(s => s.trim()).filter(Boolean) };
          if (image_url) retryUpdate.image_url = image_url;
          resp = await supabase
            .from("projects")
            .update(retryUpdate)
            .eq("id", projEdit.id)
            .select()
            .single();
        }
        if (resp.error) throw resp.error;
        setProjects((list) => list.map((x) => (x.id === projEdit.id ? { ...x, ...resp.data } : x)));
      } else {
        const baseInsert = {
          user_id: authUser.id,
          title: projTitle,
          description: projDesc,
          image_url,
          tech_stack: projSkills,
        };
        let resp = await supabase
          .from("projects")
          .insert(baseInsert)
          .select()
          .single();
        if (resp.error && resp.error.code === "22P02") {
          const retryInsert = { ...baseInsert, tech_stack: projSkills.split(',').map(s => s.trim()).filter(Boolean) };
          resp = await supabase
            .from("projects")
            .insert(retryInsert)
            .select()
            .single();
        }
        if (resp.error) throw resp.error;
        setProjects((p) => [resp.data, ...p]);
      }
      setProjTitle("");
      setProjDesc("");
      setProjImage(null);
      setProjSkills("");
      setProjEdit(null);
      if (projFileRef.current) projFileRef.current.value = "";
      setProjectOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // EXPERIENCE CRUD
  // ---------------------------------------------------------
  const openAddExperience = () => {
    setExpEdit(null);
    setExpRole("");
    setExpCompany("");
    setExpStart("");
    setExpEnd("");
    setExpDesc("");
    setExpOpen(true);
  };

  const openEditExperience = (exp) => {
    setExpEdit(exp);
    setExpRole(exp.role);
    setExpCompany(exp.company_name);
    setExpStart(exp.start_date?.slice(0, 10) || "");
    setExpEnd(exp.end_date?.slice(0, 10) || "");
    setExpDesc(exp.description || "");
    setExpOpen(true);
  };

  const saveExperience = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (expEdit) {
        // update
        const { error } = await supabase
          .from("experience")
          .update({
            role: expRole,
            company_name: expCompany,
            start_date: expStart || null,
            end_date: expEnd || null,
            description: expDesc,
          })
          .eq("id", expEdit.id);
        if (error) throw error;
        setExperience((list) =>
          list.map((x) => (x.id === expEdit.id ? { ...x, role: expRole, company_name: expCompany, start_date: expStart, end_date: expEnd, description: expDesc } : x))
        );
      } else {
        // insert
        const { data, error } = await supabase
          .from("experience")
          .insert({
            user_id: authUser.id,
            role: expRole,
            company_name: expCompany,
            start_date: expStart || null,
            end_date: expEnd || null,
            description: expDesc,
          })
          .select()
          .single();
        if (error) throw error;
        setExperience((list) => [data, ...list]);
      }
      setExpOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteExperience = async (id) => {
    if (!confirm("Delete this experience?")) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("experience").delete().eq("id", id);
      if (error) throw error;
      setExperience((list) => list.filter((x) => x.id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // EDUCATION CRUD
  // ---------------------------------------------------------
  const openAddEducation = () => {
    setEduEdit(null);
    setEduSchool("");
    setEduDegree("");
    setEduStart("");
    setEduEnd("");
    setEduOpen(true);
  };

  const openEditEducation = (ed) => {
    setEduEdit(ed);
    setEduSchool(ed.institute);
    setEduDegree(ed.degree);
    setEduStart(ed.start_year || "");
    setEduEnd(ed.end_year || "");
    setEduOpen(true);
  };

  const saveEducation = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (eduEdit) {
        const { error } = await supabase
          .from("education")
          .update({
            institute: eduSchool,
            degree: eduDegree,
            start_year: parseInt(eduStart) || null,
            end_year: parseInt(eduEnd) || null,
          })
          .eq("id", eduEdit.id);
        if (error) throw error;
        setEducation((list) =>
          list.map((x) => (x.id === eduEdit.id ? { ...x, institute: eduSchool, degree: eduDegree, start_year: eduStart, end_year: eduEnd } : x))
        );
      } else {
        const { data, error } = await supabase
          .from("education")
          .insert({
            user_id: authUser.id,
            institute: eduSchool,
            degree: eduDegree,
            start_year: parseInt(eduStart) || null,
            end_year: parseInt(eduEnd) || null,
          })
          .select()
          .single();
        if (error) throw error;
        setEducation((list) => [data, ...list]);
      }
      setEduOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteEducation = async (id) => {
    if (!confirm("Delete this education entry?")) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("education").delete().eq("id", id);
      if (error) throw error;
      setEducation((list) => list.filter((x) => x.id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // SKILLS CRUD (table)
  // ---------------------------------------------------------
  const openAddSkill = () => {
    setSkillEdit(null);
    setSkillName("");
    setSkillLevel("intermediate");
    setSkillOpen(true);
  };

  const openEditSkill = (s) => {
    setSkillEdit(s);
    setSkillName(s.skill_name || "");
    setSkillOpen(true);
  };

  const saveSkill = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (skillEdit) {
        const { error } = await supabase
          .from("skills")
          .update({ skill_name: skillName})
          .eq("id", skillEdit.id);
        if (error) throw error;
        setSkills((list) => list.map((x) => (x.id === skillEdit.id ? { ...x, skill_name: skillName  } : x)));
      } else {
        const { data, error } = await supabase
          .from("skills")
          .insert({ user_id: authUser.id, skill_name: skillName})
          .select()
          .single();
        if (error) throw error;
        setSkills((list) => [data, ...list]);
      }
      setSkillOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteSkill = async (id) => {
    if (!confirm("Delete this skill_name?")) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("skills").delete().eq("id", id);
      if (error) throw error;
      setSkills((list) => list.filter((x) => x.id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // ADDRESS CRUD (single row)
  // ---------------------------------------------------------
  const openEditAddress = () => {
    setLine1(address?.line1 || "");
    setLine2(address?.line2 || "");
    setCity(address?.city || "");
    setStateStr(address?.state || "");
    setZipcode(address?.zipcode || "");
    setCountry(address?.country || "");
    setAddrOpen(true);
  };

  const saveAddress = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (address?.id) {
        const { error } = await supabase
          .from("address")
          .update({
            line1,
            line2,
            city,
            state: stateStr,
            zipcode,
            country,
          })
          .eq("id", address.id);
        if (error) throw error;
        setAddress((a) => ({ ...a, line1, line2, city, state: stateStr, zipcode, country }));
      } else {
        const { data, error } = await supabase
          .from("address")
          .insert({
            user_id: authUser.id,
            line1,
            line2,
            city,
            state: stateStr,
            zipcode,
            country,
          })
          .select()
          .single();
        if (error) throw error;
        setAddress(data);
      }
      setAddrOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // Resume generation (basic)
  // ---------------------------------------------------------
const downloadResume = () => {
  try {
    const doc = new jsPDF();
    let y = 20; // starting Y

    const pageWidth = doc.internal.pageSize.getWidth();
const margin = 15;
const maxWidth = pageWidth - margin * 2;
    // ---------- HEADER ----------
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(profile.full_name || "Your Name", pageWidth / 2, y, { align: "center" });
    y += 8;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`${profile.email || ""} | ${9600576351 || ""} | https://www.linkedin.com/in/p-elango-881ba2139/`, pageWidth / 2, y, { align: "center" });
    y += 12;

    if (profile.linkedin) {
      doc.setTextColor("#0077b5"); // LinkedIn blue
      doc.text(`${profile.linkedin}`, pageWidth / 2, y, { align: "center" });
      doc.setTextColor(0, 0, 0); // reset to black
      y += 12;
    }

    // ---------- HEADLINE / SUMMARY ----------
    if (profile.headline) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Summary", 15, y);
      y += 7;

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      const summaryLines = doc.splitTextToSize(profile.headline, 180);
      doc.text(summaryLines, 15, y);
      y += summaryLines.length * 6 + 6;
    }

    // ---------- SKILLS ----------
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Skills", 15, y);
    y += 8;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const skillText = skills.map((s) => s.skill_name).join(", ");
    const skillLines = doc.splitTextToSize(skillText, 180);
    doc.text(skillLines, 15, y);
    y += skillLines.length * 6 + 8;

    // ---------- EXPERIENCE ----------
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Experience", 15, y);
    y += 8;

    experience.forEach((exp) => {
      if (y > 270) { doc.addPage(); y = 20; }

      // Role & Company
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text(`${exp.role} — ${exp.company_name}`, 15, y);
      y += 6;

      // Dates
      doc.setFontSize(11);
      doc.setFont("helvetica", "italic");
      doc.text(`${exp.start_date} — ${exp.end_date || "Present"}`, 15, y);
      y += 6;

      // Description
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(exp.description.replace(/\n/g, " "), 180);
      doc.text(lines, 15, y);
      y += lines.length * 6 + 8;
    });

    // ---------- PROJECTS ----------
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Projects", 15, y);
    y += 8;

   // ---------- PROJECTS ----------
projects.forEach((p) => {
  if (y > 270) { 
    doc.addPage(); 
    y = 20; 
  }

  // Project Title
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(p.title || "", 15, y);
  y += 6;

  // Tech Stack
  doc.setFontSize(11);
  doc.setFont("helvetica", "italic");
  doc.text(p.tech_stack || "", 15, y);
  y += 5;

  // Description
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  const descLines = doc.splitTextToSize((p.description || "").replace(/\n/g, " "), 180);
  doc.text(descLines, 15, y);
  y += descLines.length * 6 + 10;
});

// ---------- EDUCATION ----------
if (y + 60 > 297) { // If not enough space for Education, add a new page
  doc.addPage();
  y = 20;
} else {
  y += 20; // Add extra spacing before Education
}

doc.setFontSize(16);
doc.setFont("helvetica", "bold");
doc.text("Education", 15, y);
y += 8;

education.forEach((e) => {
  if (y > 270) { 
    doc.addPage(); 
    y = 20; 
  }

  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  const degreeLines = doc.splitTextToSize(e.degree || "", maxWidth);
  doc.text(degreeLines, margin, y);
  y += degreeLines.length * 6; // adjust for line height

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  const instituteLines = doc.splitTextToSize(e.institute || "", maxWidth);
  doc.text(instituteLines, margin, y);
  y += instituteLines.length * 6;

  doc.setFontSize(11);
  doc.setFont("helvetica", "italic");
  doc.text(`${e.start_year || ""} — ${e.end_year || "Present"}`, margin, y);
  y += 10;
});

    // ---------- SAVE ----------
    doc.save(`${profile.full_name || "resume"}.pdf`);
  } catch (err) {
    console.error("Error generating resume:", err);
  }
};



  // ---------------------------------------------------------
  // Charts data (simple)
  // ---------------------------------------------------------
  const chartLabels = projects.map((p) => p.title || new Date(p.created_at).toLocaleDateString());
  const barData = {
    labels: chartLabels.length ? chartLabels : ["No Projects"],
    datasets: [
      {
        label: "Project Metric",
        data: projects.length ? projects.map((p) => p.metric || 0) : [0],
        backgroundColor: "rgba(59,130,246,0.6)",
      },
    ],
  };

  const lineData = {
    labels: chartLabels.length ? chartLabels : ["No Projects"],
    datasets: [
      {
        label: "Activity",
        data: projects.length ? projects.map((p, i) => (p.metric || 0) + i * 5) : [0],
        fill: false,
        borderColor: "rgba(34,197,94,0.9)",
      },
    ],
  };

  if (loading || !profile)
    return (
       <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="flex flex-col items-center gap-5">
        <Lottie
          animationData={loaderAnimation}
          loop={true}
          style={{ width: 300, height: 300 }}
        />
      </div>
    </div>
    );

  // ---------------------------------------------------------
  // UI
  // ---------------------------------------------------------
  return (
       <div className="min-h-screen relative dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      {/* 3D Background */}
      <ThreeBackground />
      
      <div className="relative z-10 max-w-6xl mx-auto space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl text-white font-bold">Hello, {profile.full_name || authUser.email}</h1>
            <p className="text-sm text-white">Full-Stack Developer | Node.js, React.js & React Native | Retail Domain | Data Visualization with Chart.js & Highcharts | Slack & Email Integration for Seamless Communication</p>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={openAddProject} className="px-3 py-2 bg-blue-600 text-white rounded">Add Project</button>

            <button onClick={downloadResume} className="px-3 py-2 bg-indigo-600 text-white rounded">Download Resume</button>
            <button onClick={viewProfile} className="px-3 py-2 bg-green-600 text-white rounded">View Profile</button>
            <button onClick={logout} className="px-3 py-2 bg-red-500 text-white rounded">Logout</button>
            <ParticlesThemeSelector onThemeChange={changeParticlesTheme} />
            {/* <ThemeSelector /> */}
          </div>
        </div>

        {/* 3D Stats Overview */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">3D Stats Overview</h3>
          <Stats3D projects={projects} experience={experience} education={education} skills={skills} />
        </motion.div>

        {/* Top grid: profile + charts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile card */}
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="col-span-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <div className="flex flex-col items-center">
              <img
                src={profile.profile_photo || profile.photo_url || "https://elangomedia.s3.ap-southeast-2.amazonaws.com/product/180-product-4794-20251125201841.png"}
                alt="avatar"
                className="w-32 h-32 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
              />
              <h2 className="mt-4 text-xl font-semibold">{profile.full_name || "P Elango"}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{profile.bio || "Full-Stack Developer focusing on retail & data visualization."}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {skills.length ? skills.map((s) => (
                  <span key={s.id} className="text-sm px-3 py-1 bg-blue-50 text-blue-700 rounded-full">{s.skill_name}</span>
                )) : (profile.skills || []).length ? (profile.skills || []).map((s) => (
                  <span key={s} className="text-sm px-3 py-1 bg-blue-50 text-blue-700 rounded-full">{s}</span>
                )) : <span className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded-full">No skills yet</span>}
              </div>
            </div>
          </motion.div>

          {/* Charts */}
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="col-span-1 md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow space-y-6">
            <h3 className="text-lg font-semibold">Project Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded">
                <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded">
                <Line data={lineData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* 3D Charts Visualization */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">3D Charts Visualization</h3>
          <Charts3D projects={projects} />
        </motion.div>
{/* About Section */}
<div className="mt-10 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md">
  <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
    About
  </h2>

  <p className="text-gray-700 leading-relaxed dark:text-gray-300">
    I am a passionate Full-Stack Developer with hands-on experience in building
    web and mobile applications using <strong>React.js, React Native, and Node.js</strong>.
    I specialize in creating scalable, user-friendly solutions in the
    <strong> retail domain</strong>, with a strong focus on performance optimization,
    data visualization, and real-time communication systems.
  </p>

  <p className="mt-4 text-gray-700 leading-relaxed dark:text-gray-300">
    I thrive in collaborative, fast-paced environments and enjoy solving complex
    problems with clean, efficient code. With expertise in
    <strong> Slack automation, Firebase push notifications, Agora voice calling</strong>,
    and dynamic reporting using <strong>Chart.js & Highcharts</strong>, I aim to build modern,
    impactful products that improve business operations.
  </p>

  <p className="mt-4 text-gray-700 leading-relaxed dark:text-gray-300">
    My background in <strong>MBA (Logistics & Supply Chain)</strong> combined with strong
    technical skills helps me understand business needs better and translate them
    into practical, high-performing digital solutions.
  </p>
</div>

        {/* 3D Projects Showcase */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-700/50">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">3D Projects Showcase</h2>
            <button onClick={openAddProject} className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Add Project</button>
          </div>
          <Projects3D projects={projects} onProjectClick={openEditProject} />
        </motion.div>

        {/* Projects (Traditional View) */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Projects</h2>
            <p className="text-sm text-gray-500 dark:text-gray-300">{projects.length} project(s)</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {projects.length ? projects.map((p) => (
              <motion.article key={p.id} whileHover={{ scale: 1.02 }} className="border rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900">
                {p.image_url && <img src={p.image_url} alt={p.title} className="w-full h-40 object-cover" />}
                <div className="p-4">
                  <h3 className="font-semibold">{p.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{p.description}</p>
                  {Array.isArray(p.skills) && p.skills.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {p.skills.map((s, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">{s}</span>
                      ))}
                    </div>
                  ) : Array.isArray(p.tech_stack) && p.tech_stack.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {p.tech_stack.map((s, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">{s}</span>
                      ))}
                    </div>
                  ) : (typeof p.tech_stack === 'string' && p.tech_stack.trim()) ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {p.tech_stack.split(',').map((s, idx) => {
                        const label = s.trim();
                        if (!label) return null;
                        return (
                          <span key={idx} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">{label}</span>
                        );
                      })}
                    </div>
                  ) : null}
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-gray-500">{new Date(p.created_at).toLocaleDateString()}</span>
                    <button onClick={() => openEditProject(p)} className="text-xs px-2 py-1 border rounded">Edit</button>
                  </div>
                </div>
              </motion.article>
            )) : <p className="text-gray-600 dark:text-gray-300">No projects yet.</p>}
          </div>
        </section>

        {/* EXPERIENCE */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Experience</h2>
            <button onClick={openAddExperience} className="px-3 py-1 bg-blue-600 text-white rounded">Add</button>
          </div>
          <div className="space-y-4">
  {experience.length ? experience.map((e) => (
    <div key={e.id} className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
      <div className="flex justify-between">
        <div>
          <h3 className="font-semibold">{e.role} — {e.company_name}</h3>
          <p className="text-xs text-gray-500">{e.start_date || ""} — {e.end_date || "Present"}</p>

          {/* FIX APPLIED HERE */}
          <p className="mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
            {e.description}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <button onClick={() => openEditExperience(e)} className="px-2 py-1 border rounded text-sm">Edit</button>
          <button onClick={() => deleteExperience(e.id)} className="px-2 py-1 bg-red-500 text-white rounded text-sm">Delete</button>
        </div>
      </div>
    </div>
  )) : <p>No experience added.</p>}
</div>

        </section>

        {/* EDUCATION */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Education</h2>
            <button onClick={openAddEducation} className="px-3 py-1 bg-blue-600 text-white rounded">Add</button>
          </div>
          <div className="space-y-4">
            {education.length ? education.map((ed) => (
              <div key={ed.id} className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold">{ed.degree}</h3>
                    <p className="text-sm text-gray-500">{ed.institute} • {ed.start_year} — {ed.end_year}</p>
                    <p className="mt-2 text-gray-700 dark:text-gray-300">{ed.description}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => openEditEducation(ed)} className="px-2 py-1 border rounded text-sm">Edit</button>
                    <button onClick={() => deleteEducation(ed.id)} className="px-2 py-1 bg-red-500 text-white rounded text-sm">Delete</button>
                  </div>
                </div>
              </div>
            )) : <p>No education added.</p>}
          </div>
        </section>

        {/* SKILLS */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Skills</h2>
            <button onClick={openAddSkill} className="px-3 py-1 bg-blue-600 text-white rounded">Add</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.length ? skills.map((s) => (
              <div key={s.id} className="flex items-center gap-2 border px-3 py-1 rounded bg-gray-50 dark:bg-gray-900">
                <span className="text-sm">{s.skill_name}</span>
                <button onClick={() => openEditSkill(s)} className="ml-2 text-xs border rounded px-2">Edit</button>
                <button onClick={() => deleteSkill(s.id)} className="ml-1 text-xs bg-red-500 text-white rounded px-2">Del</button>
              </div>
            )) : (profile?.skills || []).length ? (profile.skills || []).map((s, i) => (
              <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full">{s}</span>
            )) : <p>No skills added.</p>}
          </div>
        </section>

        {/* ADDRESS */}
        {/* <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Address</h2>
            <button onClick={openEditAddress} className="px-3 py-1 bg-blue-600 text-white rounded">Edit</button>
          </div>
          {address ? (
            <div className="text-gray-800 dark:text-gray-300 space-y-1">
              <p>{address.line1}</p>
              {address.line2 && <p>{address.line2}</p>}
              <p>{address.city}, {address.state} {address.zipcode}</p>
              <p>{address.country}</p>
            </div>
          ) : <p>No address added.</p>}
        </section> */}
      </div>

      {/* ----------------- MODALS ----------------- */}

      {/* EDIT PROFILE */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-2xl bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Edit Profile</h3>
            <form onSubmit={saveProfile} className="space-y-3">
              <div>
                <label className="block text-sm">Full name</label>
                <input value={nameInput} onChange={(e) => setNameInput(e.target.value)} className="w-full px-3 py-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm">Bio</label>
                <textarea value={bioInput} onChange={(e) => setBioInput(e.target.value)} className="w-full px-3 py-2 border rounded" rows={3} />
              </div>
              <div>
                <label className="block text-sm">Skills (comma separated)</label>
                <input value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} className="w-full px-3 py-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm">Profile Photo</label>
                <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files?.[0] || null)} />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setEditOpen(false)} className="px-4 py-2 rounded border">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ADD/EDIT PROJECT */}
      {projectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-xl bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4">{projEdit ? "Edit Project" : "Add Project"}</h3>
            <form onSubmit={saveProject} className="space-y-3">
              <div><label className="block text-sm">Title</label><input value={projTitle} onChange={(e) => setProjTitle(e.target.value)} className="w-full px-3 py-2 border rounded" required /></div>
              <div><label className="block text-sm">Description</label><textarea value={projDesc} onChange={(e) => setProjDesc(e.target.value)} className="w-full px-3 py-2 border rounded" rows={3} required /></div>
              <div><label className="block text-sm">Skills used (comma separated)</label><input value={projSkills} onChange={(e) => setProjSkills(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="e.g. Next.js, Supabase, Tailwind" /></div>
              <div><label className="block text-sm">Image</label><input ref={projFileRef} type="file" accept="image/*" onChange={(e) => setProjImage(e.target.files?.[0] || null)} /></div>
              <div className="flex justify-end gap-2 mt-4"><button type="button" onClick={() => setProjectOpen(false)} className="px-4 py-2 rounded border">Cancel</button><button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">{projEdit ? "Save" : "Add Project"}</button></div>
            </form>
          </motion.div>
        </div>
      )}

      {/* EXPERIENCE MODAL */}
      {expOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-2xl bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4">{expEdit ? "Edit Experience" : "Add Experience"}</h3>
            <form onSubmit={saveExperience} className="space-y-3">
              <div><label className="block text-sm">Role</label><input value={expRole} onChange={(e) => setExpRole(e.target.value)} className="w-full px-3 py-2 border rounded" required /></div>
              <div><label className="block text-sm">Company</label><input value={expCompany} onChange={(e) => setExpCompany(e.target.value)} className="w-full px-3 py-2 border rounded" /></div>
              <div className="grid grid-cols-2 gap-2"><div><label className="block text-sm">Start Date</label><input type="date" value={expStart} onChange={(e) => setExpStart(e.target.value)} className="w-full px-3 py-2 border rounded" /></div><div><label className="block text-sm">End Date</label><input type="date" value={expEnd} onChange={(e) => setExpEnd(e.target.value)} className="w-full px-3 py-2 border rounded" /></div></div>
              <div><label className="block text-sm">Description</label><textarea value={expDesc} onChange={(e) => setExpDesc(e.target.value)} className="w-full px-3 py-2 border rounded" rows={3} /></div>
              <div className="flex justify-end gap-2 mt-4"><button type="button" onClick={() => setExpOpen(false)} className="px-4 py-2 rounded border">Cancel</button><button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{expEdit ? "Save" : "Add"}</button></div>
            </form>
          </motion.div>
        </div>
      )}

      {/* EDUCATION MODAL */}
      {eduOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-2xl bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4">{eduEdit ? "Edit Education" : "Add Education"}</h3>
            <form onSubmit={saveEducation} className="space-y-3">
              <div><label className="block text-sm">School</label><input value={eduSchool} onChange={(e) => setEduSchool(e.target.value)} className="w-full px-3 py-2 border rounded" required /></div>
              <div><label className="block text-sm">Degree</label><input value={eduDegree} onChange={(e) => setEduDegree(e.target.value)} className="w-full px-3 py-2 border rounded" /></div>
              <div className="grid grid-cols-2 gap-2"><div><label className="block text-sm">Start Year</label><input value={eduStart} onChange={(e) => setEduStart(e.target.value)} className="w-full px-3 py-2 border rounded" /></div><div><label className="block text-sm">End Year</label><input value={eduEnd} onChange={(e) => setEduEnd(e.target.value)} className="w-full px-3 py-2 border rounded" /></div></div>
              <div className="flex justify-end gap-2 mt-4"><button type="button" onClick={() => setEduOpen(false)} className="px-4 py-2 rounded border">Cancel</button><button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{eduEdit ? "Save" : "Add"}</button></div>
            </form>
          </motion.div>
        </div>
      )}

      {/* SKILL MODAL */}
      {skillOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4">{skillEdit ? "Edit Skill" : "Add Skill"}</h3>
            <form onSubmit={saveSkill} className="space-y-3">
              <div><label className="block text-sm">Skill</label><input value={skillName} onChange={(e) => setSkillName(e.target.value)} className="w-full px-3 py-2 border rounded" required /></div>
              <div className="flex justify-end gap-2 mt-4"><button type="button" onClick={() => setSkillOpen(false)} className="px-4 py-2 rounded border">Cancel</button><button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{skillEdit ? "Save" : "Add"}</button></div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ADDRESS MODAL */}
      {/* {addrOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-lg bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Edit Address</h3>
            <form onSubmit={saveAddress} className="space-y-3">
              <div><label className="block text-sm">Address line 1</label><input value={line1} onChange={(e) => setLine1(e.target.value)} className="w-full px-3 py-2 border rounded" /></div>
              <div><label className="block text-sm">Address line 2</label><input value={line2} onChange={(e) => setLine2(e.target.value)} className="w-full px-3 py-2 border rounded" /></div>
              <div className="grid grid-cols-2 gap-2"><div><label className="block text-sm">City</label><input value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-3 py-2 border rounded" /></div><div><label className="block text-sm">State</label><input value={stateStr} onChange={(e) => setStateStr(e.target.value)} className="w-full px-3 py-2 border rounded" /></div></div>
              <div className="grid grid-cols-2 gap-2"><div><label className="block text-sm">Zipcode</label><input value={zipcode} onChange={(e) => setZipcode(e.target.value)} className="w-full px-3 py-2 border rounded" /></div><div><label className="block text-sm">Country</label><input value={country} onChange={(e) => setCountry(e.target.value)} className="w-full px-3 py-2 border rounded" /></div></div>
              <div className="flex justify-end gap-2 mt-4"><button type="button" onClick={() => setAddrOpen(false)} className="px-4 py-2 rounded border">Cancel</button><button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button></div>
            </form>
          </motion.div>
        </div>
      )} */}

    </div>
  );
}

export default function Dashboard() {
  // This ensures the component is only rendered on the client side
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <DashboardContent />;
}
