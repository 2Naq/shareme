import React, { useRef, useEffect, useCallback } from 'react';

/**
 * ThreeView: A React wrapper for Three.js 3D scene.
 * - buildScene(THREE, objGroup): callback invoked when scene needs to be built/rebuilt
 * - deps: dependency array — when any value changes, scene is rebuilt
 */
export default function ThreeView({ buildScene, deps = [], height = 360 }) {
  const containerRef = useRef(null);
  const stateRef = useRef(null);

  // Stable reference to buildScene to avoid stale closures
  const buildSceneRef = useRef(buildScene);
  buildSceneRef.current = buildScene;

  const initScene = useCallback(async () => {
    const container = containerRef.current;
    if (!container || stateRef.current) return;

    let THREE;
    try {
      THREE = await import('three');
    } catch {
      container.innerHTML = '<div style="padding:20px;font-family:monospace;font-size:12px;color:#e0b673;">Không tải được thư viện 3D.</div>';
      return;
    }

    const w = container.clientWidth || 400;
    const h = height;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x10151a);
    const camera = new THREE.PerspectiveCamera(40, w / h, 0.05, 200);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h);
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x9fb3bd, 0.85));
    const key = new THREE.DirectionalLight(0xffffff, 0.9);
    key.position.set(4, 7, 5);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x5588aa, 0.35);
    fill.position.set(-5, 2, -4);
    scene.add(fill);

    const grid = new THREE.GridHelper(14, 28, 0x2b3947, 0x1b242c);
    scene.add(grid);

    const objGroup = new THREE.Group();
    scene.add(objGroup);

    // Orbit controls (manual)
    let az = -0.7, elev = 0.5, radius = 6;
    const target = new THREE.Vector3(0, 0.5, 0);
    let dragging = false, px = 0, py = 0;

    function updateCam() {
      camera.position.set(
        target.x + radius * Math.cos(elev) * Math.sin(az),
        target.y + radius * Math.sin(elev),
        target.z + radius * Math.cos(elev) * Math.cos(az)
      );
      camera.lookAt(target);
    }

    function render() { renderer.render(scene, camera); }

    const dom = renderer.domElement;
    dom.style.touchAction = 'none';

    const onPointerDown = (e) => { dragging = true; px = e.clientX; py = e.clientY; dom.setPointerCapture(e.pointerId); };
    const onPointerUp = () => { dragging = false; };
    const onPointerMove = (e) => {
      if (!dragging) return;
      az -= (e.clientX - px) * 0.008;
      elev = Math.max(0.08, Math.min(1.45, elev + (e.clientY - py) * 0.008));
      px = e.clientX; py = e.clientY;
      updateCam(); render();
    };
    const onWheel = (e) => {
      e.preventDefault();
      radius = Math.max(2.2, Math.min(18, radius + e.deltaY * 0.012));
      updateCam(); render();
    };

    dom.addEventListener('pointerdown', onPointerDown);
    dom.addEventListener('pointerup', onPointerUp);
    dom.addEventListener('pointermove', onPointerMove);
    dom.addEventListener('wheel', onWheel, { passive: false });

    updateCam();

    stateRef.current = {
      THREE, scene, camera, renderer, render, objGroup, target, dom,
      listeners: { onPointerDown, onPointerUp, onPointerMove, onWheel },
      setTarget(t, r) {
        target.copy(t);
        if (r) radius = r;
        updateCam();
        render();
      },
      resize() {
        const w2 = container.clientWidth || w;
        renderer.setSize(w2, h);
        camera.aspect = w2 / h;
        camera.updateProjectionMatrix();
        render();
      },
    };

    // Build initial scene
    buildSceneRef.current(THREE, objGroup, stateRef.current.setTarget);
    render();
  }, [height]);

  // Init on mount
  useEffect(() => {
    initScene();
    const handleResize = () => stateRef.current?.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (stateRef.current) {
        const { dom, listeners, renderer } = stateRef.current;
        dom.removeEventListener('pointerdown', listeners.onPointerDown);
        dom.removeEventListener('pointerup', listeners.onPointerUp);
        dom.removeEventListener('pointermove', listeners.onPointerMove);
        dom.removeEventListener('wheel', listeners.onWheel);
        renderer.dispose();
        stateRef.current = null;
      }
    };
  }, [initScene]);

  // Rebuild objects when deps change
  useEffect(() => {
    if (!stateRef.current) return;
    const { THREE, objGroup, setTarget, render } = stateRef.current;
    // Clear existing objects
    while (objGroup.children.length) objGroup.remove(objGroup.children[0]);
    buildSceneRef.current(THREE, objGroup, setTarget);
    render();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return (
    <div className="rounded-md border border-border overflow-hidden bg-[#10151a] relative" style={{ cursor: 'grab' }}>
      <div ref={containerRef} style={{ height: `${height}px`, touchAction: 'none' }} />
      <div className="absolute bottom-2 right-3 font-mono text-[10px] text-muted-foreground bg-black/60 px-2 py-0.5 rounded pointer-events-none">
        Kéo để xoay · lăn chuột để zoom
      </div>
    </div>
  );
}
