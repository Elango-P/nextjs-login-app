'use client';

import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { useTheme } from "../context/ThemeContext";

export default function ParticlesBackground() {
  const { particlesTheme } = useTheme();

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const THEMES = {
    default: {
      background: { color: "#0f172a" },
      particles: { number: { value: 80 }, color: { value: "#ffffff" }, move: { enable: true, speed: 1 } }
    },
    cyberpunk: {
      background: { color: "#070510" },
      particles: { 
        number: { value: 80 },
        color: { value: ["#00eaff", "#ff00e0"] },
        size: { value: { min: 2, max: 4 } },
        opacity: { value: 0.7 },
        links: { enable: true, distance: 130, color: "#ff00e0", opacity: 0.3, width: 1.2 },
        move: { enable: true, speed: 2 } 
      },
      interactivity: { events: { onHover: { enable: true, mode: "grab" } }, modes: { grab: { distance: 180 } } }
    },
    matrix: {
      background: { color: "#000" },
      particles: { 
        number: { value: 100 },
        color: { value: "#00ff5f" },
        shape: { type: "char", character: ["0","1"] },
        size: { value: 12 },
        move: { enable: true, speed: 10, direction: "bottom", straight: true, outModes: { default: "out" } }
      }
    },
    fireflies: {
      background: { color: "#0a0f1f" },
      particles: { number: { value: 40 }, color: { value: "#ffe066" }, opacity: { value: { min: 0.2, max: 1 } }, size: { value: { min: 1, max: 4 } }, move: { enable: true, speed: 1.2, random: true } }
    },
    snow: {
      background: { color: "#0f172a" },
      particles: { number: { value: 150 }, color: { value: "#ffffff" }, size: { value: { min: 1, max: 3 } }, move: { enable: true, speed: 1, direction: "bottom" } }
    },
    rain: {
      background: { color: "#0f172a" },
      particles: { number: { value: 100 }, shape: { type: "line" }, size: { value: { min: 20, max: 30 } }, opacity: { value: 0.4 }, move: { enable: true, speed: 25, direction: "bottom", straight: true } }
    },
    galaxy: {
      background: { color: "#050816" },
      particles: { number: { value: 60 }, color: { value: ["#4facfe", "#00f2fe", "#a18cd1"] }, size: { value: { min: 1, max: 4 } }, opacity: { value: 0.8 }, move: { enable: true, speed: 0.6 } },
      interactivity: { events: { onHover: { enable: true, mode: "bubble" } }, modes: { bubble: { size: 6, distance: 200 } } }
    },
    glass: {
      background: { color: "transparent" },
      particles: { number: { value: 20 }, color: { value: "#ffffff" }, opacity: { value: 0.15 }, size: { value: 80, random: { enable: true, minimumValue: 40 } }, shape: { type: "circle" }, move: { enable: true, speed: 0.6, direction: "none", outModes: "bounce" }, shadow: { enable: true, color: "#ffffff", blur: 10, offset: { x:0,y:0 } } }
    },
    minimal: {
      background: { color: "#111827" },
      particles: { number: { value: 120 }, color: { value: "#ffffff" }, size: { value: 2 }, opacity: { value: 0.5 }, move: { enable: true, speed: 0.3 } }
    },
    bubbles: {
      background: { color: "#0f0f0f" },
      particles: { number: { value: 50 }, color: { value: "#00eaff" }, opacity: { value: 0.1 }, size: { value: { min: 20, max: 60 } }, move: { enable: true, speed: 1, direction: "top" } }
    },
    confetti: {
      background: { color: "#ffffff" },
      particles: { number: { value: 100 }, color: ["#FF6B6B","#FFD93D","#6BCB77","#4D96FF"], shape: { type: "square" }, size: { value: { min:3,max:6 } }, move: { enable: true, speed:3, direction:"bottom" } }
    },
    neonRings: {
      background: { color: "#000" },
      particles: { number: { value: 40 }, color: { value: "#ff00ff" }, shape: { type: "circle" }, size: { value: { min: 10, max: 40 } }, opacity: { value: 0.2 }, move: { enable: true, speed: 1.2 }, links: { enable: true, distance: 100, color: "#ff00ff" } }
    },
    aurora: {
      background: { color: "#001" },
      particles: { number: { value: 50 }, color: { value: ["#0ff","#f0f","#0f0"] }, size: { value: { min: 2, max: 8 } }, opacity: { value: { min: 0.1, max: 0.6 } }, move: { enable: true, speed: 0.4, random: true } }
    },
    holoGrid: {
      background: { color: "#0b0b1a" },
      particles: { number: { value: 80 }, color: { value: "#33ccff" }, shape: { type: "square" }, size: { value: 4 }, opacity: { value: 0.3 }, move: { enable: true, speed: 0.8 } }
    },
    sparkTrails: {
      background: { color: "#000" },
      particles: { number: { value: 70 }, color: { value: "#ffcc00" }, size: { value: { min: 2, max: 5 } }, opacity: { value: 0.6 }, move: { enable: true, speed: 2 }, links: { enable: true, distance: 120, color: "#ffcc00" } }
    },
    energyPulse: {
      background: { color: "#0a0a0a" },
      particles: { number: { value: 50 }, color: { value: "#ff0000" }, size: { value: { min: 5, max: 10 } }, opacity: { value: 0.5 }, move: { enable: true, speed: 3, direction: "none" } }
    },
    lavaLamp: {
      background: { color: "#110000" },
      particles: { number: { value: 30 }, color: { value: ["#ff4500","#ff8c00"] }, size: { value: { min: 15, max: 30 } }, opacity: { value: 0.3 }, move: { enable: true, speed: 0.5, random: true, outModes:"bounce" } }
    },
    cosmicDust: {
      background: { color: "#000010" },
      particles: { number: { value: 80 }, color: { value: ["#ffffff","#a0a0ff","#ffb0b0"] }, size: { value: { min: 1, max: 3 } }, opacity: { value: 0.7 }, move: { enable: true, speed: 0.8 } }
    },
    starWarp: {
      background: { color: "#000" },
      particles: { number: { value: 200 }, color: { value: "#ffffff" }, size: { value: { min: 1, max: 2 } }, move: { enable: true, speed: 15, straight: false } }
    },
    diamondSpark: {
      background: { color: "#0a0a0a" },
      particles: { number: { value: 50 }, color: { value: "#00ffff" }, shape: { type: "star" }, size: { value: { min: 2, max: 6 } }, opacity: { value: 0.8 }, move: { enable: true, speed: 3 } }
    },
    oceanWaves: {
      background: { color: "#001f3f" },
      particles: { number: { value: 80 }, color:{value:"#1ca3ec"}, shape:{type:"circle"}, opacity:{value:0.3}, size:{value:{min:2,max:6}}, move:{enable:true,speed:1.5,direction:"bottom",straight:false,outModes:"out"}, wobble:{enable:true,distance:10,speed:3} }
    },
    lightning: {
      background:{color:"#0a0a0a"},
      particles:{number:{value:50}, color:{value:"#ffff33"}, shape:{type:"star"}, size:{value:{min:2,max:5}}, opacity:{value:{min:0.3,max:1}}, move:{enable:true,speed:5,direction:"none",outModes:"bounce"}},
      interactivity:{events:{onHover:{enable:true,mode:"repulse"}}, modes:{repulse:{distance:120}}}
    },
    auroraLights: { 
      background:{color:"#01010a"}, 
      particles:{number:{value:70}, color:{value:["#0ff","#f0f","#0f0"]}, size:{value:{min:2,max:8}}, opacity:{value:{min:0.1,max:0.6}}, move:{enable:true,speed:0.4, random:true}}, 
      interactivity:{events:{onHover:{enable:true,mode:"bubble"}}, modes:{bubble:{distance:150,size:8}}} 
    },
    autumnLeaves: { 
      background:{color:"#1a0f00"}, 
      particles:{number:{value:50}, color:{value:["#ff6f61","#ffa500","#ffc107"]}, shape:{type:"polygon", polygon:{sides:6}}, size:{value:{min:8,max:16}}, opacity:{value:{min:0.4,max:0.9}}, move:{enable:true,speed:1,direction:"bottom-right",outModes:"out"}} 
    },
    bubbleRise: { 
      background:{color:"#0b1e2d"}, 
      particles:{number:{value:40}, color:{value:"#88d9f3"}, shape:{type:"circle"}, size:{value:{min:10,max:30}}, opacity:{value:0.2}, move:{enable:true,speed:1,direction:"top",outModes:"out"}} 
    },
    starfieldWarp: { 
      background:{color:"#000000"}, 
      particles:{number:{value:300}, color:{value:"#ffffff"}, size:{value:{min:1,max:2}}, move:{enable:true,speed:15,direction:"none",straight:false}, opacity:{value:{min:0.5,max:1}}} 
    },
    magicOrbs: { 
      background:{color:"#0d0d1a"}, 
      particles:{number:{value:30}, color:{value:["#ff66ff","#66ccff","#33ffcc"]}, shape:{type:"circle"}, size:{value:{min:15,max:35}}, opacity:{value:0.25}, move:{enable:true,speed:0.5, random:true, outModes:"bounce"}, wobble:{enable:true,distance:15,speed:2}} 
    },
    fireworkBurst: { 
      background:{color:"#050505"}, 
      particles:{number:{value:80}, color:{value:["#ff0000","#00ff00","#0000ff","#ffff00"]}, shape:{type:"circle"}, size:{value:{min:2,max:5}}, opacity:{value:0.8}, move:{enable:true,speed:4,outModes:"destroy"}}, 
      interactivity:{events:{onClick:{enable:true,mode:"explode"}}, modes:{explode:{particles_nb:20}}} 
    }
  };

  const selected = THEMES[particlesTheme] || THEMES.default;

  return <Particles id="tsparticles" init={particlesInit} options={selected} />;
}
