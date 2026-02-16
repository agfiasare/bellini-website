"use client";

import { Suspense, useRef, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows, Center } from "@react-three/drei";
import type { Group } from "three";
import type { PerspectiveCamera } from "three";

const MODEL_PATH = "/models/oven.glb";

/** Breakpoints (px) para ajustar cámara por resolución */
const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

/**
 * Ajusta posición Z y FOV de la cámara según el ancho del viewport.
 * Pantallas chicas: cámara más lejos para que el modelo entre en cuadro.
 */
function ResponsiveCamera() {
  const { size, camera } = useThree();
  const width = size.width;
  const persp = camera as PerspectiveCamera;

  useEffect(() => {
    if (width < BREAKPOINTS.sm) {
      camera.position.z = 4.5;
      if ("fov" in persp) persp.fov = 46;
    } else if (width < BREAKPOINTS.md) {
      camera.position.z = 4;
      if ("fov" in persp) persp.fov = 44;
    } else if (width < BREAKPOINTS.lg) {
      camera.position.z = 3.5;
      if ("fov" in persp) persp.fov = 42;
    } else if (width < BREAKPOINTS.xl) {
      camera.position.z = 3.2;
      if ("fov" in persp) persp.fov = 42;
    } else {
      camera.position.z = 3;
      if ("fov" in persp) persp.fov = 42;
    }
    camera.updateProjectionMatrix();
  }, [width, camera]);

  return null;
}

/**
 * Modelo 3D del horno (GLB). Recibe rotación en grados para sincronizar con scroll.
 */
function OvenModel({ rotationY }: { rotationY: number }) {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF(MODEL_PATH);
  const rotationYRad = (rotationY * Math.PI) / 180;

  return (
    <group ref={groupRef} rotation={[0, rotationYRad, 0]}>
      <primitive object={scene} scale={2.2} />
    </group>
  );
}

/**
 * Escena 3D: iluminación industrial, sombras suaves, modelo centrado.
 */
function Scene({ rotationY }: { rotationY: number }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <spotLight
        position={[5, 8, 5]}
        angle={0.35}
        penumbra={1}
        intensity={1.2}
        castShadow
      />
      <spotLight
        position={[-5, 5, 5]}
        angle={0.35}
        penumbra={1}
        intensity={0.6}
      />
      <pointLight position={[0, 3, 2]} intensity={0.5} />
      <Environment preset="studio" />
      <Center>
        <OvenModel rotationY={rotationY} />
      </Center>
      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.4}
        scale={10}
        blur={2}
        far={4}
      />
    </>
  );
}

export type Product3DProps = {
  /** Rotación Y en grados (0–360). Sincronizada con ScrollTrigger. */
  rotationY?: number;
  /** Clases CSS del contenedor. */
  className?: string;
};

/**
 * Product3D: canvas Three.js con modelo GLB del horno.
 * Pensado para usarse dentro del bloque de producto; rotationY se controla por scroll.
 */
export default function Product3D({ rotationY = 0, className = "" }: Product3DProps) {
  return (
    <div className={`h-full w-full ${className}`}>
      <Canvas
        gl={{ antialias: true, alpha: false }}
        camera={{ position: [0, 0, 3], fov: 42 }}
        dpr={[1, 2]}
        shadows
      >
        <ResponsiveCamera />
        <Suspense
          fallback={
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#1a1a1a" />
            </mesh>
          }
        >
          <Scene rotationY={rotationY} />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Precarga del GLB en cliente para reducir parpadeo
if (typeof window !== "undefined") {
  try {
    useGLTF.preload(MODEL_PATH);
  } catch {
    // Ignorar si preload no está disponible
  }
}
