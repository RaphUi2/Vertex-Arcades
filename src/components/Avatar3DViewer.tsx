import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCcw, Sparkles, Eye, Shield, Crown, RefreshCw } from 'lucide-react';
import { AVATAR_COLORS_SHOP, AURA_COSMETICS } from '../gamesData';

interface Avatar3DViewerProps {
  avatarColor: string; // color id or hex
  avatarIcon: string;  // icon name like 'Crown', 'Zap', etc.
  activeAura: string;  // aura id like 'aura_cyan', 'aura_fire', 'aura_gold', etc.
  username: string;
}

export const Avatar3DViewer: React.FC<Avatar3DViewerProps> = ({
  avatarColor,
  avatarIcon,
  activeAura,
  username
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [wireframeMode, setWireframeMode] = useState(false);
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const avatarGroupRef = useRef<THREE.Group | null>(null);

  // Find color hex
  const colorObj = AVATAR_COLORS_SHOP.find(c => c.id === avatarColor);
  const hexColor = colorObj ? colorObj.hex : '#06b6d4';
  const threeColor = new THREE.Color(hexColor);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1, 6);
    camera.lookAt(0, 0.5, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    // Clear previous children
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 8, 5);
    scene.add(dirLight);

    const avatarGlowLight = new THREE.PointLight(threeColor, 3, 10);
    avatarGlowLight.position.set(0, 1, 2);
    scene.add(avatarGlowLight);

    const backLight = new THREE.PointLight(0xa855f7, 2, 8);
    backLight.position.set(0, 2, -3);
    scene.add(backLight);

    // Avatar Root Group
    const avatarGroup = new THREE.Group();
    avatarGroupRef.current = avatarGroup;
    scene.add(avatarGroup);

    // --- Pedestal / Platform ---
    const pedestalGeo = new THREE.CylinderGeometry(1.6, 1.8, 0.3, 32);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.9,
      roughness: 0.2,
      wireframe: wireframeMode
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -0.8;
    avatarGroup.add(pedestal);

    // Pedestal Neon Ring
    const ringGeo = new THREE.TorusGeometry(1.65, 0.05, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: threeColor });
    const neonRing = new THREE.Mesh(ringGeo, ringMat);
    neonRing.rotation.x = Math.PI / 2;
    neonRing.position.y = -0.65;
    avatarGroup.add(neonRing);

    // --- Cyber Head (Rounded Cube or Sphere Visor) ---
    const headGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2, 8, 8, 8);
    const headMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.8,
      roughness: 0.2,
      wireframe: wireframeMode
    });
    const headMesh = new THREE.Mesh(headGeo, headMat);
    headMesh.position.y = 0.8;
    avatarGroup.add(headMesh);

    // Curved Glowing Neon Visor
    const visorGeo = new THREE.CylinderGeometry(0.62, 0.62, 0.4, 32, 1, false, -Math.PI / 3, (Math.PI * 2) / 3);
    const visorMat = new THREE.MeshPhysicalMaterial({
      color: threeColor,
      emissive: threeColor,
      emissiveIntensity: 0.8,
      roughness: 0.1,
      metalness: 0.9,
      wireframe: wireframeMode
    });
    const visorMesh = new THREE.Mesh(visorGeo, visorMat);
    visorMesh.position.set(0, 0.85, 0.05);
    visorMesh.rotation.y = Math.PI / 2;
    avatarGroup.add(visorMesh);

    // Visor Eyes / Neon Slits
    const eyeGeo = new THREE.PlaneGeometry(0.7, 0.08);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const eyeMesh = new THREE.Mesh(eyeGeo, eyeMat);
    eyeMesh.position.set(0, 0.88, 0.68);
    avatarGroup.add(eyeMesh);

    // --- Headphones / Cyber Ears ---
    const earGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.2, 16);
    const earMat = new THREE.MeshStandardMaterial({ color: threeColor, metalness: 0.9, roughness: 0.1 });
    const leftEar = new THREE.Mesh(earGeo, earMat);
    leftEar.rotation.z = Math.PI / 2;
    leftEar.position.set(-0.68, 0.8, 0);
    avatarGroup.add(leftEar);

    const rightEar = leftEar.clone();
    rightEar.position.set(0.68, 0.8, 0);
    avatarGroup.add(rightEar);

    // --- Floating Crown / Head Accessory depending on icon ---
    if (avatarIcon.includes('Crown') || avatarIcon.includes('King') || avatarIcon === 'Crown') {
      const crownGroup = new THREE.Group();
      const crownBaseGeo = new THREE.CylinderGeometry(0.5, 0.45, 0.25, 5);
      const crownMat = new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        metalness: 0.9,
        roughness: 0.1,
        emissive: 0x854d0e,
        wireframe: wireframeMode
      });
      const crownMesh = new THREE.Mesh(crownBaseGeo, crownMat);
      crownGroup.add(crownMesh);

      // Jewels
      for (let i = 0; i < 5; i++) {
        const gemGeo = new THREE.SphereGeometry(0.08, 8, 8);
        const gemMat = new THREE.MeshBasicMaterial({ color: threeColor });
        const gem = new THREE.Mesh(gemGeo, gemMat);
        const angle = (i / 5) * Math.PI * 2;
        gem.position.set(Math.cos(angle) * 0.48, 0.15, Math.sin(angle) * 0.48);
        crownGroup.add(gem);
      }
      crownGroup.position.y = 1.65;
      avatarGroup.add(crownGroup);
    } else {
      // Default Cyber Antenna / Halo
      const haloGeo = new THREE.TorusGeometry(0.55, 0.04, 16, 32);
      const haloMat = new THREE.MeshBasicMaterial({ color: threeColor });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.rotation.x = Math.PI / 2;
      halo.position.y = 1.6;
      avatarGroup.add(halo);
    }

    // --- Orbital Aura Rings / Particles based on activeAura ---
    const orbitalGroup = new THREE.Group();
    avatarGroup.add(orbitalGroup);

    const auraColorHex = activeAura.includes('fire') ? 0xf97316
      : activeAura.includes('gold') ? 0xeab308
      : activeAura.includes('void') ? 0xa855f7
      : activeAura.includes('rose') ? 0xf43f5e
      : threeColor.getHex();

    const orbitalRingGeo1 = new THREE.TorusGeometry(1.4, 0.03, 16, 64);
    const orbitalMat1 = new THREE.MeshBasicMaterial({ color: auraColorHex, wireframe: true });
    const orbRing1 = new THREE.Mesh(orbitalRingGeo1, orbitalMat1);
    orbRing1.rotation.x = Math.PI / 4;
    orbitalGroup.add(orbRing1);

    const orbitalRingGeo2 = new THREE.TorusGeometry(1.6, 0.02, 16, 64);
    const orbitalMat2 = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const orbRing2 = new THREE.Mesh(orbitalRingGeo2, orbitalMat2);
    orbRing2.rotation.y = Math.PI / 3;
    orbitalGroup.add(orbRing2);

    // Floating Orbs
    const orbCount = 6;
    const orbMeshes: THREE.Mesh[] = [];
    for (let i = 0; i < orbCount; i++) {
      const orbGeo = new THREE.SphereGeometry(0.08, 12, 12);
      const orbMat = new THREE.MeshBasicMaterial({ color: auraColorHex });
      const orb = new THREE.Mesh(orbGeo, orbMat);
      orbitalGroup.add(orb);
      orbMeshes.push(orb);
    }

    // --- Animation Loop ---
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Bobbing head
      headMesh.position.y = 0.8 + Math.sin(elapsedTime * 2) * 0.05;
      visorMesh.position.y = 0.85 + Math.sin(elapsedTime * 2) * 0.05;
      eyeMesh.position.y = 0.88 + Math.sin(elapsedTime * 2) * 0.05;

      // Orbiting particles
      orbitalGroup.rotation.y = elapsedTime * 0.8;
      orbitalGroup.rotation.z = Math.sin(elapsedTime * 0.5) * 0.2;

      for (let i = 0; i < orbMeshes.length; i++) {
        const angle = (i / orbCount) * Math.PI * 2 + elapsedTime * 1.5;
        const radius = 1.5 + Math.sin(elapsedTime * 3 + i) * 0.1;
        orbMeshes[i].position.set(
          Math.cos(angle) * radius,
          Math.sin(elapsedTime * 2 + i) * 0.4 + 0.8,
          Math.sin(angle) * radius
        );
      }

      // Auto rotation
      if (autoRotate && !isDraggingRef.current && avatarGroupRef.current) {
        avatarGroupRef.current.rotation.y += 0.01;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [avatarColor, avatarIcon, activeAura, wireframeMode]);

  // Mouse / Touch Controls for manual 3D Drag Rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !avatarGroupRef.current) return;

    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    avatarGroupRef.current.rotation.y += deltaX * 0.01;
    avatarGroupRef.current.rotation.x += deltaY * 0.005;

    // Clamp X rotation to avoid flipping upside down
    avatarGroupRef.current.rotation.x = Math.max(-0.5, Math.min(0.5, avatarGroupRef.current.rotation.x));

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const resetView = () => {
    if (avatarGroupRef.current) {
      avatarGroupRef.current.rotation.set(0, 0, 0);
    }
  };

  return (
    <div className="flex flex-col items-center bg-slate-900/90 border-2 border-cyan-500/60 rounded-2xl p-3 relative overflow-hidden shadow-[0_0_25px_rgba(6,182,212,0.25)] select-none">
      {/* Header Badge */}
      <div className="w-full flex justify-between items-center mb-2 px-1">
        <div className="flex items-center gap-1.5 text-cyan-300 font-extrabold text-[10px] tracking-wider uppercase">
          <Sparkles size={13} className="text-cyan-400 animate-pulse" />
          <span>AVATAR 3D HOLOGRAMME</span>
        </div>
        <span className="text-[9px] bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-bold px-2 py-0.5 rounded-full uppercase">
          THREE.JS REALTIME
        </span>
      </div>

      {/* 3D Canvas Viewport Container */}
      <div
        ref={mountRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="w-full h-56 sm:h-64 cursor-grab active:cursor-grabbing relative flex items-center justify-center rounded-xl bg-gradient-to-b from-slate-950/80 via-slate-900/90 to-cyan-950/40 border border-slate-800"
      >
        {/* Subtle Crosshair grid background overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none"></div>
      </div>

      {/* Player nameplate tag underneath */}
      <div className="mt-2.5 flex items-center gap-2 bg-slate-950 border border-cyan-500/40 px-3 py-1 rounded-xl shadow-inner">
        <div className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: hexColor }}></div>
        <span className="text-xs font-black text-white tracking-widest uppercase">{username}</span>
      </div>

      {/* Interactive Controls Bar */}
      <div className="mt-3 flex items-center justify-between w-full gap-2 border-t border-slate-800/80 pt-2.5">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5 border ${
            autoRotate
              ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
              : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
          }`}
        >
          <RefreshCw size={11} className={autoRotate ? "animate-spin" : ""} />
          {autoRotate ? 'ROTATION: ON' : 'ROTATION: PAUSE'}
        </button>

        <button
          onClick={() => setWireframeMode(!wireframeMode)}
          className={`py-1.5 px-2.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer flex items-center justify-center gap-1 border ${
            wireframeMode
              ? 'bg-yellow-950 border-yellow-400 text-yellow-300'
              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
          }`}
          title="Mode Fil de Fer Matrix"
        >
          <Eye size={12} /> WIREFRAME
        </button>

        <button
          onClick={resetView}
          className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-500 transition-all cursor-pointer"
          title="Réinitialiser la vue 3D"
        >
          <RotateCcw size={12} />
        </button>
      </div>

      <p className="text-[9px] text-slate-500 italic mt-1.5">
        💡 Glissez votre curseur sur le modèle pour le faire pivoter librement à 360°
      </p>
    </div>
  );
};
