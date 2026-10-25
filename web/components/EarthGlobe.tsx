"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { Compass, Sparkles, Navigation, X, ArrowRight, MapPin } from "lucide-react";

// Geographic Coordinates for Curated Destinations
export interface GlobeDestination {
  name: string;
  country: string;
  flag: string;
  lat: number;
  lon: number;
  tagline: string;
  priceUSD: number;
}

export const GLOBE_DESTINATIONS: GlobeDestination[] = [
  { name: "Mysuru", country: "India", flag: "🇮🇳", lat: 12.2958, lon: 76.6394, tagline: "Illuminated royal palaces and sandalwood culture.", priceUSD: 45 },
  { name: "Jaipur", country: "India", flag: "🇮🇳", lat: 26.9124, lon: 75.7873, tagline: "Pink City citadels, Sheesh Mahal and royal forts.", priceUSD: 55 },
  { name: "Goa", country: "India", flag: "🇮🇳", lat: 15.2993, lon: 74.1240, tagline: "Sun-drenched Konkan coasts, UNESCO churches and beach shacks.", priceUSD: 40 },
  { name: "Delhi", country: "India", flag: "🇮🇳", lat: 28.6139, lon: 77.2090, tagline: "Mughal monuments, India Gate promenades and historic bazaars.", priceUSD: 45 },
  { name: "Agra", country: "India", flag: "🇮🇳", lat: 27.1767, lon: 78.0081, tagline: "Taj Mahal marble wonder and monumental Mughal Agra Fort.", priceUSD: 40 },
  { name: "Mumbai", country: "India", flag: "🇮🇳", lat: 19.0760, lon: 72.8777, tagline: "Gateway of India, Marine Drive and vibrant metropolis.", priceUSD: 50 },
  { name: "Kerala", country: "India", flag: "🇮🇳", lat: 9.9312, lon: 76.2673, tagline: "Emerald backwaters, private houseboats and spice hills.", priceUSD: 50 },
  { name: "Varanasi", country: "India", flag: "🇮🇳", lat: 25.3176, lon: 82.9739, tagline: "Sacred Ganges morning aarti and centuries-old ghats.", priceUSD: 35 },
  { name: "Hampi", country: "India", flag: "🇮🇳", lat: 15.3350, lon: 76.4600, tagline: "Vijayanagara boulder kingdoms and chariot shrines.", priceUSD: 35 },
  { name: "Ladakh", country: "India", flag: "🇮🇳", lat: 34.1526, lon: 77.5771, tagline: "Himalayan moonscapes, Pangong lake and high passes.", priceUSD: 70 },
  { name: "Udaipur", country: "India", flag: "🇮🇳", lat: 24.5854, lon: 73.7125, tagline: "City of Lakes, Pichola palaces and Rajput courtyards.", priceUSD: 60 },
  { name: "Amritsar", country: "India", flag: "🇮🇳", lat: 31.6340, lon: 74.8723, tagline: "Sacred Golden Temple (Harmandir Sahib) and Wagah border.", priceUSD: 35 },
  { name: "Rishikesh", country: "India", flag: "🇮🇳", lat: 30.0869, lon: 78.2676, tagline: "Yoga capital of the world, Ganges aarti and Himalayan foothills.", priceUSD: 35 },
  { name: "Coorg", country: "India", flag: "🇮🇳", lat: 12.3375, lon: 75.8069, tagline: "Misty coffee plantations, abbey waterfalls and spice trails.", priceUSD: 45 },
  { name: "Bengaluru", country: "India", flag: "🇮🇳", lat: 12.9716, lon: 77.5946, tagline: "Garden City botanical trails and artisan craft breweries.", priceUSD: 45 },
  { name: "Jaisalmer", country: "India", flag: "🇮🇳", lat: 26.9157, lon: 70.9083, tagline: "Thar desert golden sand dunes and living medieval fort.", priceUSD: 45 },
  { name: "Srinagar", country: "India", flag: "🇮🇳", lat: 34.0837, lon: 74.7973, tagline: "Dal Lake Shikara houseboats, Mughal gardens and snow peaks.", priceUSD: 60 },
  { name: "Darjeeling", country: "India", flag: "🇮🇳", lat: 27.0410, lon: 88.2663, tagline: "Tiger Hill Kanchenjunga sunrise and heritage Toy Train.", priceUSD: 45 },
  { name: "Andaman", country: "India", flag: "🇮🇳", lat: 11.9761, lon: 92.9876, tagline: "Radhanagar turquoise beaches and coral reef diving.", priceUSD: 75 },
  { name: "Shillong", country: "India", flag: "🇮🇳", lat: 25.5788, lon: 91.8933, tagline: "Scotland of the East, living root bridges and roaring waterfalls.", priceUSD: 40 },
  { name: "Kolkata", country: "India", flag: "🇮🇳", lat: 22.5726, lon: 88.3639, tagline: "Cultural capital, Victoria Memorial and Howrah Bridge.", priceUSD: 40 },
  { name: "Chennai", country: "India", flag: "🇮🇳", lat: 13.0827, lon: 80.2707, tagline: "Coromandel coast, Marina beach and Dravidian temples.", priceUSD: 40 },
  { name: "Hyderabad", country: "India", flag: "🇮🇳", lat: 17.3850, lon: 78.4867, tagline: "Charminar citadels, pearl markets and Hyderabadi biryani.", priceUSD: 45 },
];

export const WORLD_COORDINATES: Record<string, { lat: number; lon: number; country: string; flag: string; tagline: string }> = {
  "mumbai": { lat: 19.0760, lon: 72.8777, country: "India", flag: "🇮🇳", tagline: "Gateway of India and Marine Drive promenade." },
  "bangalore": { lat: 12.9716, lon: 77.5946, country: "India", flag: "🇮🇳", tagline: "Garden City tech corridors and botanical retreats." },
  "seoul": { lat: 37.5665, lon: 126.9780, country: "South Korea", flag: "🇰🇷", tagline: "Gyeongbokgung palaces, K-pop culture and night markets." },
  "istanbul": { lat: 41.0082, lon: 28.9784, country: "Turkey", flag: "🇹🇷", tagline: "Bosphorus strait bridges, Blue Mosque and Grand Bazaar." },
  "rio de janeiro": { lat: -22.9068, lon: -43.1729, country: "Brazil", flag: "🇧🇷", tagline: "Christ the Redeemer, Copacabana and Sugarloaf mountain." },
  "cape town": { lat: -33.9249, lon: 18.4241, country: "South Africa", flag: "🇿🇦", tagline: "Table Mountain summits and Cape Peninsula penguins." },
  "vienna": { lat: 48.2082, lon: 16.3738, country: "Austria", flag: "🇦🇹", tagline: "Imperial Schönbrunn palace and classic coffee houses." },
  "prague": { lat: 50.0755, lon: 14.4378, country: "Czech Republic", flag: "🇨🇿", tagline: "Charles Bridge, Old Town square and medieval castles." },
};

function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

interface EarthGlobeProps {
  onSelectCity: (cityName: string) => void;
  locatingCity: string | null;
  onFlyComplete?: () => void;
  className?: string;
}

export default function EarthGlobe({
  onSelectCity,
  locatingCity,
  onFlyComplete,
  className = "",
}: EarthGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredDest, setHoveredDest] = useState<GlobeDestination | null>(null);
  const [hudStatus, setHudStatus] = useState<string>("Interactive 3D Earth Ready · Drag to Explore");
  const [satelliteLock, setSatelliteLock] = useState<{ name: string; lat: number; lon: number } | null>(null);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    earthGroup: THREE.Group;
    pinObjects: Array<{ mesh: THREE.Mesh; dest: GlobeDestination }>;
    flightArcs: THREE.Line[];
    isDragging: boolean;
    prevMouseX: number;
    prevMouseY: number;
    velX: number;
    velY: number;
    animFrameId: number;
    targetQuaternion: THREE.Quaternion | null;
    isFlying: boolean;
    flyProgress: number;
    startCamZ: number;
    startQuaternion: THREE.Quaternion;
  } | null>(null);

  // Initialize Three.js WebGL Scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 2.8;

    // Ambient & Directional Sun Lighting
    const ambientLight = new THREE.AmbientLight(0x556677, 1.3);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.2);
    sunLight.position.set(5, 3, 5);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x4da6ff, 1.1);
    rimLight.position.set(-5, -2, -4);
    scene.add(rimLight);

    // Deep Space Starfield
    const starGeo = new THREE.BufferGeometry();
    const starCount = 1200;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 40;
      starPos[i + 1] = (Math.random() - 0.5) * 40;
      starPos[i + 2] = (Math.random() - 0.5) * 40 - 10;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.04, transparent: true, opacity: 0.65 });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // Earth Sphere Group
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    // Photorealistic NASA Blue Marble / Satellite Earth Textures
    const textureLoader = new THREE.TextureLoader();
    const earthDayMap = textureLoader.load("/images/earth/earth-day.jpg");
    earthDayMap.colorSpace = THREE.SRGBColorSpace;
    const earthNormalMap = textureLoader.load("/images/earth/earth-normal.jpg");
    const earthSpecularMap = textureLoader.load("/images/earth/earth-specular.jpg");
    const earthCloudsMap = textureLoader.load("/images/earth/earth-clouds.png");

    // Earth Mesh with High Segment Geometry (96x96 for perfect smoothness)
    const earthGeo = new THREE.SphereGeometry(1, 96, 96);
    const earthMat = new THREE.MeshPhongMaterial({
      map: earthDayMap,
      normalMap: earthNormalMap,
      normalScale: new THREE.Vector2(0.85, 0.85),
      specularMap: earthSpecularMap,
      specular: new THREE.Color(0x223344),
      shininess: 25,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthGroup.add(earthMesh);

    // Realistic Floating Cloud Layer
    const cloudsGeo = new THREE.SphereGeometry(1.009, 96, 96);
    const cloudsMat = new THREE.MeshPhongMaterial({
      map: earthCloudsMap,
      transparent: true,
      opacity: 0.42,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });
    const cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
    earthGroup.add(cloudsMesh);

    // Google Earth Celestial Atmosphere Glow Halo
    const atmosphereGeo = new THREE.SphereGeometry(1.035, 64, 64);
    const atmosphereMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.70 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
          gl_FragColor = vec4(0.35, 0.72, 1.0, 1.0) * intensity * 1.3;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    earthGroup.add(atmosphereMesh);

    // Destination Pin Meshes
    const pinObjects: Array<{ mesh: THREE.Mesh; dest: GlobeDestination }> = [];
    const pinHeadGeo = new THREE.SphereGeometry(0.022, 16, 16);
    const pinStemGeo = new THREE.CylinderGeometry(0.004, 0.004, 0.06, 8);

    GLOBE_DESTINATIONS.forEach(dest => {
      const pos = latLonToVector3(dest.lat, dest.lon, 1.0);
      const pinContainer = new THREE.Group();
      pinContainer.position.copy(pos);
      pinContainer.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());

      // Golden Pin Head
      const pinMat = new THREE.MeshStandardMaterial({
        color: 0xF8D057,
        emissive: 0xF8D057,
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.8,
      });
      const pinHead = new THREE.Mesh(pinHeadGeo, pinMat);
      pinHead.position.y = 0.06;
      pinContainer.add(pinHead);

      // Pin Stem
      const stemMat = new THREE.MeshBasicMaterial({ color: 0xFFF2A3 });
      const stem = new THREE.Mesh(pinStemGeo, stemMat);
      stem.position.y = 0.03;
      pinContainer.add(stem);

      // Radar Wave Ring on surface
      const ringGeo = new THREE.RingGeometry(0.015, 0.032, 24);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x14F195, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      pinContainer.add(ring);

      earthGroup.add(pinContainer);
      pinObjects.push({ mesh: pinHead, dest });
    });

    // Flight Arcs connecting Indian cultural & transit corridors
    const flightArcs: THREE.Line[] = [];
    const arcPairs = [
      ["Delhi", "Srinagar"],
      ["Delhi", "Ladakh"],
      ["Delhi", "Jaipur"],
      ["Delhi", "Agra"],
      ["Delhi", "Varanasi"],
      ["Mumbai", "Goa"],
      ["Mumbai", "Bengaluru"],
      ["Bengaluru", "Mysuru"],
      ["Bengaluru", "Kerala"],
      ["Kolkata", "Darjeeling"],
      ["Chennai", "Andaman"],
      ["Delhi", "Amritsar"],
      ["Mumbai", "Udaipur"],
      ["Delhi", "Rishikesh"],
    ];

    arcPairs.forEach(([cityA, cityB]) => {
      const destA = GLOBE_DESTINATIONS.find(d => d.name === cityA);
      const destB = GLOBE_DESTINATIONS.find(d => d.name === cityB);
      if (!destA || !destB) return;

      const p1 = latLonToVector3(destA.lat, destA.lon, 1.0);
      const p2 = latLonToVector3(destB.lat, destB.lon, 1.0);
      const mid = p1.clone().add(p2).multiplyScalar(0.5);
      const distance = p1.distanceTo(p2);
      mid.normalize().multiplyScalar(1.0 + distance * 0.28);

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const points = curve.getPoints(40);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
      const arcMat = new THREE.LineBasicMaterial({
        color: 0xF8D057,
        transparent: true,
        opacity: 0.45,
      });
      const arcLine = new THREE.Line(arcGeo, arcMat);
      earthGroup.add(arcLine);
      flightArcs.push(arcLine);
    });

    // Set initial friendly Earth view facing India directly
    earthGroup.rotation.y = -1.35;
    earthGroup.rotation.x = 0.35;

    // Interaction State
    const state = {
      renderer,
      scene,
      camera,
      earthGroup,
      cloudsMesh,
      pinObjects,
      flightArcs,
      isDragging: false,
      prevMouseX: 0,
      prevMouseY: 0,
      velX: 0,
      velY: 0,
      animFrameId: 0,
      targetQuaternion: null as THREE.Quaternion | null,
      isFlying: false,
      flyProgress: 0,
      startCamZ: 2.8,
      startQuaternion: new THREE.Quaternion(),
    };
    sceneRef.current = state;

    // Animation Loop
    let time = 0;
    function animate() {
      state.animFrameId = requestAnimationFrame(animate);
      time += 0.015;

      // Gentle cloud drift
      if (state.cloudsMesh) {
        state.cloudsMesh.rotation.y += 0.00025;
      }

      // Handle Fly-To Zoom Camera Sequence
      if (state.isFlying && state.targetQuaternion) {
        state.flyProgress += 0.018;
        const t = Math.min(1, state.flyProgress);
        // Smooth easeInOutCubic
        const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        // Slerp Earth rotation towards target coordinates
        state.earthGroup.quaternion.slerpQuaternions(state.startQuaternion, state.targetQuaternion, ease);

        // Zoom camera in (Google Earth zoom fly-in effect: 2.8 -> 1.14)
        state.camera.position.z = THREE.MathUtils.lerp(state.startCamZ, 1.15, ease);

        if (t >= 1) {
          state.isFlying = false;
        }
      } else {
        // Natural idle rotation & inertia
        if (!state.isDragging) {
          state.earthGroup.rotation.y += 0.0015; // Slow gentle spin
          state.velX *= 0.94;
          state.velY *= 0.94;
          state.earthGroup.rotation.y += state.velX;
          state.earthGroup.rotation.x += state.velY;
          state.earthGroup.rotation.x = Math.max(-1.1, Math.min(1.1, state.earthGroup.rotation.x));
        }
      }

      // Pulse pin halos
      pinObjects.forEach(({ mesh }, idx) => {
        const pulse = 1 + Math.sin(time * 3 + idx) * 0.15;
        mesh.scale.set(pulse, pulse, pulse);
      });

      renderer.render(scene, camera);
    }
    animate();

    // Mouse / Touch Drag Listeners
    function onMouseDown(e: MouseEvent) {
      if (state.isFlying) return;
      state.isDragging = true;
      state.prevMouseX = e.clientX;
      state.prevMouseY = e.clientY;
    }

    function onMouseMove(e: MouseEvent) {
      const rect = container?.getBoundingClientRect();
      if (!rect) return;

      // Drag Rotation
      if (state.isDragging) {
        const deltaX = (e.clientX - state.prevMouseX) * 0.005;
        const deltaY = (e.clientY - state.prevMouseY) * 0.005;
        state.earthGroup.rotation.y += deltaX;
        state.earthGroup.rotation.x += deltaY;
        state.earthGroup.rotation.x = Math.max(-1.1, Math.min(1.1, state.earthGroup.rotation.x));
        state.velX = deltaX;
        state.velY = deltaY;
        state.prevMouseX = e.clientX;
        state.prevMouseY = e.clientY;
        return;
      }

      // Raycast for Pin Hovering
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, state.camera);

      const pinMeshes = state.pinObjects.map(p => p.mesh);
      const intersects = raycaster.intersectObjects(pinMeshes, false);

      if (intersects.length > 0) {
        const matched = state.pinObjects.find(p => p.mesh === intersects[0].object);
        if (matched) {
          setHoveredDest(matched.dest);
          container!.style.cursor = "pointer";
          return;
        }
      }
      setHoveredDest(null);
      container!.style.cursor = "grab";
    }

    function onMouseUp() {
      state.isDragging = false;
    }

    function onClick(e: MouseEvent) {
      if (state.isFlying) return;
      const rect = container?.getBoundingClientRect();
      if (!rect) return;

      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, state.camera);
      const pinMeshes = state.pinObjects.map(p => p.mesh);
      const intersects = raycaster.intersectObjects(pinMeshes, false);

      if (intersects.length > 0) {
        const matched = state.pinObjects.find(p => p.mesh === intersects[0].object);
        if (matched) {
          onSelectCity(matched.dest.name);
        }
      }
    }

    const dom = renderer.domElement;
    dom.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    dom.addEventListener("click", onClick);

    // Responsive Resize Handler
    function handleResize() {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(state.animFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      dom.removeEventListener("mousedown", onMouseDown);
      dom.removeEventListener("click", onClick);
      renderer.dispose();
      earthGeo.dispose();
      earthMat.dispose();
      atmosphereGeo.dispose();
      atmosphereMat.dispose();
    };
  }, [onSelectCity]);

  // Google Earth Fly-To Coordinate Lock Sequence
  useEffect(() => {
    if (!locatingCity || !sceneRef.current) return;
    const clean = locatingCity.trim().toLowerCase();
    const dest = GLOBE_DESTINATIONS.find(d => d.name.toLowerCase() === clean)
      || (WORLD_COORDINATES[clean] ? { name: locatingCity, priceUSD: 50, ...WORLD_COORDINATES[clean] } : null)
      || { name: locatingCity, country: "Global Destination", flag: "🌍", lat: 20.5937, lon: 78.9629, tagline: "Global exploration coordinates", priceUSD: 60 };

    setSatelliteLock({ name: dest.name, lat: dest.lat, lon: dest.lon });
    setHudStatus(`🛰️ SATELLITE LOCK: ${dest.name.toUpperCase()} · ${dest.lat.toFixed(2)}° N, ${dest.lon.toFixed(2)}° E`);
    setIsTransitioning(true);

    const state = sceneRef.current;
    state.startCamZ = state.camera.position.z;
    state.startQuaternion.copy(state.earthGroup.quaternion);

    // Calculate rotation angles to point exact (lat, lon) directly at camera (+Z axis)
    const targetY = -((dest.lon + 90) * (Math.PI / 180));
    const targetX = (dest.lat) * (Math.PI / 180);

    const targetEuler = new THREE.Euler(targetX, targetY, 0, "YXZ");
    const targetQuat = new THREE.Quaternion().setFromEuler(targetEuler);

    state.targetQuaternion = targetQuat;
    state.flyProgress = 0;
    state.isFlying = true;

    // After fly-in zoom completes (~1600ms), transition smoothly to itinerary
    const timer = setTimeout(() => {
      if (onFlyComplete) {
        onFlyComplete();
      }
    }, 1650);

    return () => clearTimeout(timer);
  }, [locatingCity, onFlyComplete]);

  return (
    <div
      className={`earth-globe-wrapper ${className} ${isTransitioning ? "globe-disappearing" : ""}`}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        transition: isTransitioning ? "opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1), filter 1.5s ease-out, transform 1.5s ease-out" : "none",
        opacity: isTransitioning ? 0 : 1,
        filter: isTransitioning ? "blur(6px) brightness(1.2)" : "none",
        transform: isTransitioning ? "scale(1.08)" : "scale(1)",
      }}
    >
      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          cursor: "grab",
        }}
      />

      {/* Google Earth Navigation HUD Overlay */}
      <div className="globe-hud-overlay" style={{
        position: "absolute",
        top: 20,
        left: 24,
        right: 24,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        pointerEvents: "none",
        zIndex: 10,
      }}>
        {/* HUD Satellite Telemetry Badge */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          background: "rgba(12, 14, 18, 0.75)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(248, 208, 87, 0.3)",
          borderRadius: 30,
          padding: "8px 18px",
          fontSize: 12,
          fontWeight: 700,
          color: "var(--yellow)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: "50%",
            background: satelliteLock ? "#14F195" : "var(--yellow)",
            boxShadow: satelliteLock ? "0 0 8px #14F195" : "0 0 6px var(--yellow)",
            animation: "pulse 1.5s infinite",
          }} />
          <span>{hudStatus}</span>
        </div>

        {/* Quick Nav Instructions */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "rgba(12, 14, 18, 0.6)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: 20,
          padding: "6px 14px",
          fontSize: 11,
          color: "var(--gray-light)",
        }}>
          <Navigation size={12} color="var(--yellow)" />
          <span>Click any glowing pin to inspect</span>
        </div>
      </div>

      {/* Target Satellite Reticle when locating */}
      {satelliteLock && (
        <div className="satellite-target-reticle" style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          animation: "fadeIn 0.3s ease-out",
        }}>
          <div style={{
            width: 140,
            height: 140,
            border: "1.5px dashed rgba(248, 208, 87, 0.8)",
            borderRadius: "50%",
            animation: "spinSlow 8s linear infinite",
            position: "relative",
          }}>
            <div style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", width: 16, height: 2, background: "var(--yellow)" }} />
            <div style={{ position: "absolute", bottom: -8, left: "50%", transform: "translateX(-50%)", width: 16, height: 2, background: "var(--yellow)" }} />
            <div style={{ position: "absolute", left: -8, top: "50%", transform: "translateY(-50%)", width: 2, height: 16, background: "var(--yellow)" }} />
            <div style={{ position: "absolute", right: -8, top: "50%", transform: "translateY(-50%)", width: 2, height: 16, background: "var(--yellow)" }} />
          </div>
          <div style={{
            marginTop: 14,
            background: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(12px)",
            border: "1px solid var(--yellow)",
            borderRadius: 10,
            padding: "6px 16px",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#FFF", letterSpacing: 1 }}>{satelliteLock.name.toUpperCase()}</div>
            <div style={{ fontSize: 10, color: "var(--yellow)", fontWeight: 700 }}>{satelliteLock.lat.toFixed(4)}° N, {satelliteLock.lon.toFixed(4)}° E</div>
          </div>
        </div>
      )}

      {/* Floating Hover Destination Tooltip */}
      {hoveredDest && !satelliteLock && (
        <div
          className="globe-dest-tooltip"
          onClick={() => onSelectCity(hoveredDest.name)}
          style={{
            position: "absolute",
            bottom: 30,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(14, 17, 23, 0.92)",
            backdropFilter: "blur(16px)",
            border: "1.5px solid rgba(248, 208, 87, 0.4)",
            borderRadius: 16,
            padding: "14px 22px",
            display: "flex",
            alignItems: "center",
            gap: 16,
            cursor: "pointer",
            boxShadow: "0 10px 30px rgba(0,0,0,0.7)",
            zIndex: 15,
            transition: "transform 0.2s ease",
            animation: "fadeInUp 0.25s ease-out",
          }}
        >
          <div style={{ fontSize: 28 }}>{hoveredDest.flag}</div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#FFF" }}>{hoveredDest.name}</span>
              <span style={{ fontSize: 11, color: "var(--gray)", padding: "2px 8px", background: "rgba(255,255,255,0.08)", borderRadius: 10 }}>{hoveredDest.country}</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--gray-light)", marginTop: 2, maxWidth: 300 }}>
              {hoveredDest.tagline}
            </div>
          </div>
          <div style={{
            background: "var(--yellow)",
            color: "#0C0E12",
            padding: "8px 14px",
            borderRadius: 10,
            fontSize: 12,
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}>
            <span>Fly & Plan</span>
            <ArrowRight size={14} />
          </div>
        </div>
      )}

      {/* Keyframe animations */}
      <style jsx>{`
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translate(-50%, 15px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
