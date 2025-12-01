// @flow strict

import { useRouter } from 'next/navigation';
import * as React from 'react';

function ProjectCard({ project }) {
  const router = useRouter();
  const [showModal, setShowModal] = React.useState(false);

  return (
    <>
      {/* ==== CARD ==== */}
      <div
        className="border from-[#0d1224] relative rounded-lg border bg-gradient-to-r to-[#0a0d37] w-full h-auto flex flex-col overflow-hidden"
        style={{ borderColor: "aqua" }}
      >

        {/* ==== TOP SECTION ==== */}
        <div className="flex w-full items-center p-4 border-b border-indigo-900">
          
          {/* LEFT: IMAGE */}
          {project.image_url && (
            <div
              className="h-50 lg:h-50 overflow-hidden rounded-md cursor-pointer"
              style={{ width: "80%" }}
              onClick={() => setShowModal(true)}
            >
              <img
                src={project.image_url}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* RIGHT: TITLE + BUTTON */}
          <div className="w-2/3 flex flex-col justify-center items-start pl-4">
            <p className="text-[#16f2b3] text-lg font-semibold">{project.title}</p>

            <button
              onClick={() => router.push(`/projects/${project.id}`)}
              className="mt-2 px-4 py-1 rounded bg-[#16f2b3] text-black font-bold shadow hover:opacity-80 transition"
            >
              View
            </button>
          </div>
        </div>

        {/* ==== BOTTOM DETAILS ==== */}
        <div className="overflow-hidden px-4 lg:px-8 py-4 flex-grow">
          <code className="font-mono text-xs md:text-sm lg:text-base block h-full">
            <div className="blink">
              <span className="mr-2 text-pink-500">const</span>
              <span className="mr-2 text-white">project</span>
              <span className="mr-2 text-pink-500">=</span>
              <span className="text-gray-400">{'{'}</span>
            </div>

            <div>
              <span className="ml-4 lg:ml-8 mr-2 text-white">name:</span>
              <span className="text-gray-400">'</span>
              <span className="text-amber-300">{project.title}</span>
              <span className="text-gray-400">',</span>
            </div>

            <div className="ml-4 lg:ml-8 mr-2">
              <span className="text-white">tools:</span>
              <span className="text-gray-400"> ['</span>
              {project.tech_stack.map((tag, i) => (
                <React.Fragment key={i}>
                  <span className="text-amber-300">{tag}</span>
                  {project.tech_stack.length - 1 !== i && <span className="text-gray-400">', '</span>}
                </React.Fragment>
              ))}
              <span className="text-gray-400">],</span>
            </div>

            <div>
              <span className="ml-4 lg:ml-8 mr-2 text-white">myRole:</span>
              <span className="text-orange-400">Full Stack Developer</span>
              <span className="text-gray-400">,</span>
            </div>

            <div className="ml-4 lg:ml-8 mr-2">
              <span className="text-white">Description:</span>
              <span className="text-cyan-400 line-clamp-3">{' ' + project.description}</span>
            </div>
          </code>
        </div>
      </div>

      {/* ==== IMAGE MODAL ==== */}
      {/* ==== IMAGE MODAL ==== */}
{showModal && (
  <div
    className="fixed inset-0 bg-black/80 flex justify-center items-center p-4"
    style={{ zIndex: 99999 }}       // <-- Highest possible z-index
    onClick={() => setShowModal(false)}
  >
    <div
      className="relative"
      onClick={(e) => e.stopPropagation()} // Prevent close on image click
      style={{ zIndex: 100000 }}            // <-- Even higher than overlay
    >

      {/* Close button */}
      <button
  onClick={() => setShowModal(false)}
  className="
    absolute top-1 right-1 
    w-10 h-10 
    flex items-center justify-center
    rounded-full 
    bg-red-600/80 
    text-white text-2xl font-bold
    hover:bg-red-600 
    transition
    shadow-lg
    cursor-pointer
  "
  style={{ zIndex: 100001 }}
>
  ×
</button>


      {/* Resized Image */}
      <img
        src={project.image_url}
        alt={project.title}
        className="rounded-lg shadow-xl"
        style={{
          maxWidth: "80vw",   // reduced width
          maxHeight: "70vh",  // reduced height
          objectFit: "contain",
        }}
      />
    </div>
  </div>
)}

    </>
  );
}

export default ProjectCard;
