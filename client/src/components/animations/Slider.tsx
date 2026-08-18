import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";

const vertexShader = `
  varying vec2 vUv;
  uniform float uVelocity;
  uniform float uRadius;
  void main(){
    vUv = uv;
    vec3 pos = position;
    
    // Bend horizontally around a vertical cylinder of radius uRadius
    float angle = pos.x / uRadius;
    pos.x = sin(angle) * uRadius;
    pos.z = (cos(angle) - 1.0) * uRadius;
    
    pos.y += sin(uv.x * 3.14159) * uVelocity * 0.06;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform sampler2D uMap;
  uniform float uVelocity;   // motion smear amount
  uniform float uFocus;      // 0 = in focus (center), 1 = fully unfocused (edges)
  uniform float uHover;      // 0 = normal, 1 = hovered
  uniform float uImageAspect; // image width / height (e.g. 16/9)
  uniform float uCardAspect;  // card width / height  (e.g. 2.9/1.8)
  
  // object-fit: cover — zoom into image so it fills card, clamp edges
  vec2 coverUV(vec2 uv) {
    float ratio = uCardAspect / uImageAspect;
    vec2 scale;
    if (ratio > 1.0) {
      // card wider than image → fit width, crop top/bottom
      scale = vec2(1.0, ratio);
    } else {
      // image wider than card → fit height, crop sides
      scale = vec2(1.0 / ratio, 1.0);
    }
    // Scale UV outward from center (zooms into image = cover crop)
    vec2 uv2 = (uv - 0.5) / scale + 0.5;
    return clamp(uv2, 0.0, 1.0);
  }

  vec4 sampleBlur(sampler2D map, vec2 uv, float amount){
    if (amount <= 0.001) return texture2D(map, uv);
    vec4 sum = vec4(0.0);
    float total = 0.0;
    for (int x = -2; x <= 2; x++){
      for (int y = -2; y <= 2; y++){
        vec2 offset = vec2(float(x), float(y)) * amount * 0.01;
        float w = 1.0;
        sum += texture2D(map, uv + offset) * w;
        total += w;
      }
    }
    return sum / total;
  }
  
  void main(){
    // Cover UV: image fills card completely, no black bars, no white gaps
    vec2 coverUv = coverUV(vUv);

    float shift = uVelocity * 0.015;
    float blurAmt = uFocus * 2.8; 
    vec4 r  = sampleBlur(uMap, coverUv + vec2(shift, 0.0), blurAmt);
    vec4 gC = sampleBlur(uMap, coverUv, blurAmt);
    vec4 b  = sampleBlur(uMap, coverUv - vec2(shift, 0.0), blurAmt);
    vec3 col = vec3(r.r, gC.g, b.b);
    
    // desaturate as it goes out of focus
    float gray = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(col, vec3(gray), uFocus * 0.75);
    
    // darken card on hover
    col = mix(col, vec3(0.0), uHover * 0.60);
    
    // Rounded corners — computed in card-aspect-corrected UV space
    // Card aspect 2.9/1.8 ≈ 1.611; use exact card ratio for pixel-perfect corners
    float ar = uCardAspect;
    vec2 p = vUv - vec2(0.5);
    p.x *= ar;
    float cornerR = 0.08 * ar;  // corner radius in card-aspect space
    vec2 d = abs(p) - vec2(ar * 0.5 - cornerR, 0.5 - cornerR);
    float dist = min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - cornerR;
    // Use color-based mask (fade to transparent) — NOT alpha-based
    // This prevents the page background bleeding through transparent edges.
    float borderAlpha = 1.0 - smoothstep(-0.008, 0.008, dist);
    
    gl_FragColor = vec4(col, borderAlpha);
  }
`;

const fallbackImages = [
  "https://picsum.photos/id/10/512/320",
  "https://picsum.photos/id/12/512/320",
  "https://picsum.photos/id/15/512/320",
  "https://picsum.photos/id/29/512/320",
  "https://picsum.photos/id/48/512/320",
  "https://picsum.photos/id/60/512/320",
  "https://picsum.photos/id/102/512/320",
  "https://picsum.photos/id/122/512/320",
  "https://picsum.photos/id/133/512/320",
  "https://picsum.photos/id/160/512/320",
  "https://picsum.photos/id/180/512/320",
  "https://picsum.photos/id/201/512/320",
];

/** Extract YouTube video ID from any YouTube URL format */
function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  if (url.includes("youtu.be/"))
    return url.split("youtu.be/")[1]?.split("?")[0] || null;
  if (url.includes("watch?v="))
    return url.split("watch?v=")[1]?.split("&")[0] || null;
  if (url.includes("embed/"))
    return url.split("embed/")[1]?.split("?")[0] || null;
  return null;
}

/** Return the best available YouTube thumbnail URL */
function getYouTubeThumbnail(url: string): string | null {
  const id = extractYouTubeId(url);
  if (!id) return null;
  // mqdefault is 320×180 (native 16:9, no black bars)
  return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
}

interface SliderProps {
  workVideos?: string[];
}

const Slider: React.FC<SliderProps> = ({ workVideos = [] }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  // Direct ref to overlay DOM node — position is set via inline style each frame (no React re-renders)
  const overlayDivRef = useRef<HTMLDivElement>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState<number>(-1);

  // Utility to extract YouTube embed URL
  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    let videoId = "";
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
    } else if (url.includes("watch?v=")) {
      videoId = url.split("watch?v=")[1]?.split("&")[0] || "";
    } else if (url.includes("embed/")) {
      videoId = url.split("embed/")[1]?.split("?")[0] || "";
    } else {
      videoId = url;
    }
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  };

  // Build image URL list: prefer YouTube thumbnail, fall back to picsum
  const imageUrls = Array.from({ length: 12 }, (_, i) => {
    const videoUrl = workVideos[i];
    const thumb = videoUrl ? getYouTubeThumbnail(videoUrl) : null;
    return thumb || fallbackImages[i % fallbackImages.length];
  });

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 500; // default height if 0

    // ---------- basic scene setup ----------
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 11);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // ---------- build a horizontal deck of cards ----------
    const COUNT = 12;
    const group = new THREE.Group();
    scene.add(group);

    // Responsive card size: smaller on mobile/tablet, full size on desktop
    const getSizeFactor = (w: number) => {
      if (w < 640) return 0.92;
      if (w < 768) return 1.05;
      if (w < 1024) return 1.02;
      return 1;
    };

    const seedOffsets = [
      0.9, -0.3, 0.15, -0.05, 0.55, -0.75, 0.3, -0.5, 0.7, -0.2, 0.4, -0.6,
    ];
    const seedTilt = [
      0.12, -0.08, 0.03, -0.15, 0.1, -0.05, 0.14, -0.1, 0.06, -0.12, 0.08,
      -0.09,
    ];

    const cards: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>[] = [];
    const texturesToDispose: THREE.Texture[] = [];
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");

    for (let i = 0; i < COUNT; i++) {
      // Bigger card geometry
      const geo = new THREE.PlaneGeometry(2.9, 1.8, 32, 16);
      const tex = loader.load(imageUrls[i % imageUrls.length]);
      texturesToDispose.push(tex);

      const mat = new THREE.ShaderMaterial({
        uniforms: {
          uMap: { value: tex },
          uVelocity: { value: 0 },
          uFocus: { value: 0 },
          uRadius: { value: 4.4 },
          uHover: { value: 0.0 },
          // mqdefault.jpg is 320×180 = native 16:9 (no black bars)
          // Card geometry is 2.9 × 1.8 ≈ 1.611 aspect ratio
          uImageAspect: { value: 16 / 9 },
          uCardAspect: { value: 2.9 / 1.8 },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.userData = { index: i };
      cards.push(mesh);
      group.add(mesh);
    }

    // ---------- scroll / drag state, GSAP-driven inertia ----------
    const AUTO_SPEED = 0.006;
    const state = {
      offset: 0,
      velocity: 0,
      auto: -AUTO_SPEED, // default: top to bottom (negative)
      targetAuto: -AUTO_SPEED, // target autoplay speed (positive = bottom-to-top, negative = top-to-bottom)
      hovering: false,
      idleTimer: null as ReturnType<typeof setTimeout> | null,
    };

    // Dragging is declared up-front so pause/resume helpers can reference it.
    let dragging = false;
    let lastY = 0;

    // --- Wheel: slow and smooth ---
    const handleWheel = (e: WheelEvent) => {
      e.stopPropagation();
      applyDelta(-e.deltaY); // inverted: scroll down = negative delta
    };

    function applyDelta(delta: number) {
      // Set autoplay direction based on the user's manual scroll/drag direction:
      // delta < 0 (scrolling down / dragging down) → top-to-bottom
      // delta > 0 (scrolling up / dragging up) → bottom-to-top
      if (delta < 0) {
        state.targetAuto = -AUTO_SPEED;
        state.auto = -AUTO_SPEED; // change direction immediately
      } else if (delta > 0) {
        state.targetAuto = AUTO_SPEED;
        state.auto = AUTO_SPEED; // change direction immediately
      }

      // Clamp individual scroll steps so a fast flick never launches the carousel
      const clamped = Math.max(-30, Math.min(30, delta));
      state.velocity += clamped * 0.0008; // much slower than before
    }

    const handleTouchStart = (e: TouchEvent) => {
      e.stopPropagation();
    };
    const handleTouchEnd = (e: TouchEvent) => {
      e.stopPropagation();
    };

    // --- Drag: apply delta without pausing the flow ---
    let dragDistance = 0;
    const handlePointerDown = (e: PointerEvent) => {
      dragging = true;
      lastY = e.clientY;
      dragDistance = 0;
    };

    const handlePointerUp = () => {
      dragging = false;
      // If pointer wasn't dragged significantly, treat as a click on hovered card
      if (dragDistance < 6 && hoveredCardIndex !== -1) {
        setActiveCardIndex(hoveredCardIndex);
        setIsPopupOpen(true);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dy = e.clientY - lastY;
      lastY = e.clientY;
      dragDistance += Math.abs(dy);
      applyDelta(-dy * 1.2); // drag down = negative delta (top-to-bottom)
    };

    // --- Visual hover: raycast → cursor change + shrink scale (slider never stops) ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Tracks which card is currently hovered (-1 = none). Read by ticker each frame.
    let hoveredCardIndex = -1;

    // Projects card corners to get exact screen-space rect (px) for the overlay
    function getCardScreenRect(card: THREE.Mesh) {
      const hw = (2.9 / 2) * card.scale.x; // half-width in local units
      const hh = (1.8 / 2) * card.scale.y; // half-height in local units

      // Top-left and bottom-right local corners → world → NDC → pixels
      const tl = new THREE.Vector3(-hw, hh, 0);
      const br = new THREE.Vector3(hw, -hh, 0);
      card.localToWorld(tl);
      card.localToWorld(br);

      const w = container.clientWidth;
      const h = container.clientHeight;

      tl.project(camera);
      br.project(camera);

      const x1 = (tl.x * 0.5 + 0.5) * w;
      const y1 = (-tl.y * 0.5 + 0.5) * h;
      const x2 = (br.x * 0.5 + 0.5) * w;
      const y2 = (-br.y * 0.5 + 0.5) * h;

      // Return center + dimensions
      const cx = (x1 + x2) / 2;
      const cy = (y1 + y2) / 2;
      const sw = Math.abs(x2 - x1);
      const sh = Math.abs(y2 - y1);
      return { cx, cy, sw, sh };
    }

    // Apply overlay position directly to the DOM — called every frame from ticker
    function syncOverlay() {
      const div = overlayDivRef.current;
      if (!div) return;
      if (hoveredCardIndex === -1) {
        div.style.opacity = "0";
        return;
      }
      const card = cards[hoveredCardIndex];
      // Bail if this card has scrolled out of the front zone
      if (
        (card.material as THREE.ShaderMaterial).uniforms.uFocus.value >= 0.4
      ) {
        div.style.opacity = "0";
        return;
      }
      const { cx, cy, sw, sh } = getCardScreenRect(card);
      div.style.left = `${cx}px`;
      div.style.top = `${cy}px`;
      div.style.width = `${sw}px`;
      div.style.height = `${sh}px`;
      div.style.opacity = "1";
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(cards);

      // Only trigger on front 3 cards (uFocus < 0.4)
      const frontHit = hits.find((h) => {
        const mat = (
          h.object as THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>
        ).material;
        return mat.uniforms.uFocus.value < 0.4;
      });

      const newIdx = frontHit
        ? (frontHit.object as THREE.Mesh).userData.index
        : -1;

      if (newIdx !== hoveredCardIndex) {
        // un-shrink previously hovered card and clear its hover darken
        if (hoveredCardIndex !== -1) {
          const prev = cards[hoveredCardIndex];
          gsap.to(prev.scale, {
            x: prev.scale.x / 0.93,
            y: prev.scale.y / 0.93,
            z: 1,
            duration: 0.35,
            ease: "power2.out",
            overwrite: true,
          });
          gsap.to(prev.material.uniforms.uHover, {
            value: 0.0,
            duration: 0.35,
            ease: "power2.out",
            overwrite: true,
          });
        }
        hoveredCardIndex = newIdx;
        if (newIdx !== -1) {
          // shrink newly hovered card and apply hover darken
          const cur = cards[newIdx];
          gsap.to(cur.scale, {
            x: cur.scale.x * 0.93,
            y: cur.scale.y * 0.93,
            z: 1,
            duration: 0.35,
            ease: "power2.out",
            overwrite: true,
          });
          gsap.to(cur.material.uniforms.uHover, {
            value: 1.0,
            duration: 0.35,
            ease: "power2.out",
            overwrite: true,
          });
          renderer.domElement.style.cursor = "pointer";
        } else {
          renderer.domElement.style.cursor = "default";
        }
      }
    };

    const handleMouseLeave = () => {
      if (hoveredCardIndex !== -1) {
        const prev = cards[hoveredCardIndex];
        gsap.to(prev.scale, {
          x: prev.scale.x / 0.93,
          y: prev.scale.y / 0.93,
          z: 1,
          duration: 0.35,
          ease: "power2.out",
          overwrite: true,
        });
        gsap.to(prev.material.uniforms.uHover, {
          value: 0.0,
          duration: 0.35,
          ease: "power2.out",
          overwrite: true,
        });
        hoveredCardIndex = -1;
        renderer.domElement.style.cursor = "default";
      }
      if (overlayDivRef.current) overlayDivRef.current.style.opacity = "0";
    };

    // Block right-click context menu on canvas
    const handleContextMenu = (e: Event) => e.preventDefault();

    // Attach events
    container.addEventListener("wheel", handleWheel, { passive: true });
    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });
    renderer.domElement.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointermove", handlePointerMove);
    renderer.domElement.addEventListener("mousemove", handleMouseMove);
    renderer.domElement.addEventListener("mouseleave", handleMouseLeave);
    renderer.domElement.addEventListener("contextmenu", handleContextMenu);

    // ease autoplay in on load (default to top-to-bottom)
    gsap.fromTo(
      state,
      { auto: 0 },
      { auto: -AUTO_SPEED, duration: 1.5, ease: "power2.out" },
    );

    const ORBIT_RADIUS = 4.4; // radius of the helix orbit
    const HEIGHT_FACTOR = 1.7; // increased vertical spacing
    const ANGULAR_SPACING = 0.75;

    // Physics constants — these drive the "realistic" deformation
    // A card facing the viewer (angle≈0) is nearly flat (large bend radius = barely bent).
    // A card at the side (angle≈π/2) is seen edge-on and gets strongly bent inward.
    const BEND_RADIUS_CENTER = 34.0; // large → barely curved when facing camera
    const BEND_RADIUS_SIDE = 5.0; // small → tightly curved when seen from the side

    function updateCardTransforms() {
      cards.forEach((mesh) => {
        const i = mesh.userData.index;
        let localAngle = i * ANGULAR_SPACING - state.offset;
        const totalSpacing = COUNT * ANGULAR_SPACING;
        // wrap into [-totalSpacing/2, totalSpacing/2]
        localAngle =
          ((((localAngle + totalSpacing / 2) % totalSpacing) + totalSpacing) %
            totalSpacing) -
          totalSpacing / 2;

        // --- Helix orbit position ---
        const orbitX = Math.sin(localAngle) * ORBIT_RADIUS;
        const orbitZ = (Math.cos(localAngle) - 1.0) * ORBIT_RADIUS;
        const orbitY = -localAngle * HEIGHT_FACTOR + seedOffsets[i] * 0.18;

        mesh.position.set(orbitX, orbitY, orbitZ);

        // --- Fixed orientation — cards always face the camera, NO self-rotation ---
        // Only a subtle static Z tilt per card for a natural scattered look
        const absAngle = Math.abs(localAngle);
        let focus = 0;
        if (absAngle > ANGULAR_SPACING * 1.15) {
          focus = THREE.MathUtils.clamp(
            (absAngle - ANGULAR_SPACING * 1.15) / (ANGULAR_SPACING * 1.8),
            0,
            1,
          );
        }

        const rotX = 0.0; // no forward/backward tilt
        const rotY = 0.0; // no yaw spin — always faces camera
        const rotZ = seedTilt[i] * (0.2 + focus * 0.3); // gentle static tilt per card

        mesh.rotation.set(rotX, rotY, rotZ);

        // --- Dynamic bend radius: flat when front-facing, curved when position is off-center ---
        // Use orbitX distance from center as proxy for foreshortening instead of angle
        const lateralFactor =
          1.0 - THREE.MathUtils.clamp(Math.abs(orbitX) / ORBIT_RADIUS, 0, 1);
        const dynamicBendRadius = THREE.MathUtils.lerp(
          BEND_RADIUS_SIDE,
          BEND_RADIUS_CENTER,
          lateralFactor,
        );
        mesh.material.uniforms.uRadius.value = dynamicBendRadius;

        // --- Scale: front cards are larger, background cards are smaller but still big ---
        const scale = 1.25 - focus * 0.28;
        mesh.scale.set(scale, scale, scale);

        mesh.material.uniforms.uFocus.value = focus;
        mesh.renderOrder = Math.round(
          (1.0 - absAngle / (ANGULAR_SPACING * 2.5)) * 100,
        );
      });
    }

    const tickerUpdate = () => {
      state.offset += state.velocity + state.auto;
      state.velocity *= 0.9;
      updateCardTransforms();
      syncOverlay(); // keep overlay perfectly aligned to hovered card every frame
      cards.forEach((m) => {
        m.material.uniforms.uVelocity.value = THREE.MathUtils.lerp(
          m.material.uniforms.uVelocity.value,
          Math.abs(state.velocity) * 6,
          0.2,
        );
      });
      renderer.render(scene, camera);
    };

    gsap.ticker.add(tickerUpdate);

    const applyResponsiveScale = () => {
      const w = container.clientWidth || window.innerWidth;
      const f = getSizeFactor(w);
      group.scale.set(f, f, f);
    };

    const handleResize = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 500;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      applyResponsiveScale();
    };

    window.addEventListener("resize", handleResize);

    applyResponsiveScale();
    updateCardTransforms();

    // Clean up
    return () => {
      gsap.ticker.remove(tickerUpdate);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
      renderer.domElement.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointermove", handlePointerMove);
      renderer.domElement.removeEventListener("mousemove", handleMouseMove);
      renderer.domElement.removeEventListener("mouseleave", handleMouseLeave);
      renderer.domElement.removeEventListener("contextmenu", handleContextMenu);

      if (state.idleTimer) clearTimeout(state.idleTimer);
      gsap.killTweensOf(state);

      if (overlayDivRef.current) overlayDivRef.current.style.opacity = "0";
      cards.forEach((mesh) => {
        mesh.geometry.dispose();
        mesh.material.dispose();
      });
      texturesToDispose.forEach((t) => t.dispose());

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [imageUrls.join(",")]);

  return (
    <div className="absolute inset-0 w-full h-full bg-transparent flex flex-col items-center justify-center z-10">
      <div ref={mountRef} className="w-full h-full touch-none" />

      {/* Overlay div: always in DOM, position+size set each frame by syncOverlay(), opacity driven by CSS transition */}
      <div
        ref={overlayDivRef}
        className="pointer-events-none absolute z-20 flex items-center justify-center"
        style={{
          top: 0,
          left: 0,
          width: "0px",
          height: "0px",
          opacity: 0,
          transform: "translate(-50%, -50%)",
          transition: "opacity 0.28s ease",
          willChange: "top, left, width, height, opacity",
        }}
      >
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white/90 shadow-lg">
          <Play className="w-6 h-6 text-gray-900 fill-gray-900 ml-1" />
        </div>
      </div>

      {/* Video Popup Modal */}
      {isPopupOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={() => setIsPopupOpen(false)}
        >
          <style>{`
            @keyframes modal-enter {
              0% { opacity: 0; transform: scale(0.75); }
              60% { opacity: 1; transform: scale(1.03); }
              100% { opacity: 1; transform: scale(1); }
            }
            .modal-animate {
              animation: modal-enter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            }
          `}</style>

          {/* Flex row: [Left Arrow] [Modal] [Right Arrow] — arrows sit right beside the popup. On sm: modal full-width, arrows stacked below the video. */}
          <div
            className="flex items-center gap-3 sm:gap-4 w-full max-w-5xl sm:grid sm:grid-cols-2 sm:justify-items-center md:flex md:flex-row md:items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left Arrow */}
            <button
              onClick={() => setActiveCardIndex((prev) => (prev - 1 + 12) % 12)}
              className="shrink-0 w-11 h-11 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white hover:scale-110 active:scale-95 transition-all border border-white/10 cursor-pointer shadow-2xl backdrop-blur-sm sm:col-start-1 sm:row-start-2 sm:justify-self-end md:order-none"
              title="Previous Video"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Modal */}
            <div className="modal-animate relative flex-1 min-w-0 bg-neutral-900/90 border border-white/10 rounded-2xl overflow-hidden shadow-2xl sm:col-start-1 sm:col-span-2 sm:row-start-1 sm:w-full md:order-none">
              {/* Close Button */}
              <button
                onClick={() => setIsPopupOpen(false)}
                className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-black/60 text-white/70 hover:text-white hover:bg-black/90 transition-all border border-white/20 cursor-pointer shadow-lg"
              >
                ✕
              </button>

              {/* Embedded YouTube Video Container */}
              <div className="aspect-video w-full bg-black relative">
                {(() => {
                  const videoUrl =
                    workVideos[activeCardIndex] ||
                    "https://www.youtube.com/watch?v=bSl7z00Hnug";
                  return (
                    <iframe
                      key={activeCardIndex}
                      src={getEmbedUrl(videoUrl)}
                      title={`Work Video ${activeCardIndex + 1}`}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  );
                })()}
              </div>
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => setActiveCardIndex((prev) => (prev + 1) % 12)}
              className="shrink-0 w-11 h-11 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white hover:scale-110 active:scale-95 transition-all border border-white/10 cursor-pointer shadow-2xl backdrop-blur-sm sm:col-start-2 sm:row-start-2 sm:justify-self-start md:order-none"
              title="Next Video"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Slider;
