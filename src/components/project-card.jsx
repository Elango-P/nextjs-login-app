// @flow strict

import * as React from 'react';

function ProjectCard({ project }) {
  return (
    <div className="border  from-[#0d1224] relative rounded-lg border bg-gradient-to-r to-[#0a0d37] w-full h-[450px] flex flex-col overflow-hidden" style={{ borderColor: "aqua"}}> 
      
      {/* === Project Image === */}
      {project.image_url && (
        <div className="h-32 lg:h-40 w-full overflow-hidden rounded-t-lg">
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Header */}
      <div className="px-4 lg:px-8 py-3 lg:py-5 relative flex-shrink-0">
        <div className="flex flex-row space-x-1 lg:space-x-2 absolute top-1/2 -translate-y-1/2">
          <div className="h-2 w-2 lg:h-3 lg:w-3 rounded-full bg-red-400"></div>
          <div className="h-2 w-2 lg:h-3 lg:w-3 rounded-full bg-orange-400"></div>
          <div className="h-2 w-2 lg:h-3 lg:w-3 rounded-full bg-green-200"></div>
        </div>
        <p className="text-center ml-3 text-[#16f2b3] text-base lg:text-md">
          {project.title}
        </p>
      </div>

      {/* Content */}
      <div className="overflow-hidden border-t-[2px] border-indigo-900 px-4 lg:px-8 py-4 lg:py-4 flex-grow">
        <code className="font-mono text-xs md:text-sm lg:text-base overflow-hidden block h-full">
          <div className="blink">
            <span className="mr-2 text-pink-500">const</span>
            <span className="mr-2 text-white">project</span>
            <span className="mr-2 text-pink-500">=</span>
            <span className="text-gray-400">{'{'}</span>
          </div>
          <div>
            <span className="ml-4 lg:ml-8 mr-2 text-white">name:</span>
            <span className="text-gray-400">{`'`}</span>
            <span className="text-amber-300">{project.title}</span>
            <span className="text-gray-400">{`',`}</span>
          </div>
          <div className="ml-4 lg:ml-8 mr-2">
            <span className=" text-white">tools:</span>
            <span className="text-gray-400">{` ['`}</span>
            {project.tech_stack.map((tag, i) => (
              <React.Fragment key={i}>
                <span className="text-amber-300">{tag}</span>
                {project.tech_stack.length - 1 !== i && <span className="text-gray-400">{`', '`}</span>}
              </React.Fragment>
            ))}
            <span className="text-gray-400">{"],"}</span>
          </div>
          <div>
            <span className="ml-4 lg:ml-8 mr-2 text-white">myRole:</span>
            <span className="text-orange-400">Full Stack Developer</span>
            <span className="text-gray-400">,</span>
          </div>
          <div className="ml-4 lg:ml-8 mr-2">
            <span className="text-white">Description:</span>
            <span className="text-cyan-400">{' ' + project.description}</span>
            <span className="text-gray-400">,</span>
          </div>
          <div><span className="text-gray-400">{`};`}</span></div>
        </code>
      </div>
    </div>
  );
};

export default ProjectCard;
