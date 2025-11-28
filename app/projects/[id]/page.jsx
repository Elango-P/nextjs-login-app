'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Github, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../utils/supabaseClient';
import Lottie from 'lottie-react';
import loaderAnimation from "../../../public/loader.json";

export default function ProjectDetails({ params }) {
  // Unwrap the params promise
  const resolvedParams = React.use(params);
  console.log("resolvedParams", resolvedParams);
  const id = resolvedParams.id;
  console.log("id", id);
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    
    const fetchProject = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setProject(data);
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
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
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Project not found</h1>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition-colors"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const techStack = Array.isArray(project.tech_stack)
    ? project.tech_stack
    : typeof project.tech_stack === 'string'
    ? project.tech_stack.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.button
          onClick={() => router.back()}
          className="flex items-center text-white hover:text-sky-300 mb-8 transition-colors backdrop-blur-sm bg-white/10 px-4 py-2 rounded-lg border border-white/10 hover:border-white/20"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Profile
        </motion.button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl overflow-hidden border border-white/10"
        >
          {project.image_url && (
            <div className="h-64 w-full overflow-hidden">
              <img
                src={project.image_url}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
              <div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-400 to-purple-500 bg-clip-text text-transparent">
                    {project.title}
                  </h1>
                  <p className="text-sky-100 mt-2">{project.subtitle || 'A remarkable project'}</p>
                </div>
                {project.created_at && (
                  <p className="text-gray-500 text-sm">
                    {new Date(project.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex flex-wrap gap-4 mt-6">
                {project.github_url && (
                  <motion.a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors border border-white/10"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Github className="w-5 h-5 mr-2" />
                    View on GitHub
                  </motion.a>
                )}
                {project.live_url && (
                  <motion.a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 rounded-lg text-white hover:opacity-90 transition-opacity"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    Live Demo
                  </motion.a>
                )}
              </div>
              
              <div className="prose-invert max-w-none">
                <div className="mt-10">
                  <h2 className="text-2xl font-semibold text-white mb-4 relative inline-block">
                    <span className="relative z-10">Project Details</span>
                    <span className="absolute bottom-0 left-0 w-full h-2 bg-sky-500/20 -z-0 rounded-full"></span>
                  </h2>
                  <div className="prose-invert text-white/90 leading-relaxed space-y-4">
                    {project.description.split('\n').map((paragraph, i) => (
                      <p key={i} className="text-white/80">{paragraph}</p>
                    ))}
                  </div>
                </div>

                {techStack.length > 0 && (
                  <div className="mt-8">
                    <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Tech Stack</h2>
                    <div className="flex flex-wrap gap-3">
                      {techStack.map((tech, index) => (
                        <motion.div 
                          key={index}
                          className="px-4 py-2 bg-white/5 rounded-lg text-white/90 backdrop-blur-sm border border-white/10"
                          whileHover={{ y: -2, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          {tech}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
