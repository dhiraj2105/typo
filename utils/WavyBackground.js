"use client";
import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function WavePlane() {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.geometry.attributes.position.array.forEach(
        (_, i, arr) => {
          if (i % 3 === 2) {
            arr[i] = Math.sin(i + t * 2) * 0.2;
          }
        }
      );
      meshRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const geometry = useMemo(() => {
    const plane = new THREE.PlaneGeometry(10, 10, 64, 64);
    return plane;
  }, []);

  return (
    <mesh ref={meshRef} rotateX={-Math.PI / 2}>
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial color="#1e293b" wireframe />
    </mesh>
  );
}

export default function WavyBackground() {
  return (
    <Canvas
      camera={{ position: [0, 3, 5], fov: 60 }}
      className="!fixed !top-0 !w-full pointer-events-none !h-full -z-10"
    >
      <ambientLight />
      <directionalLight position={[0, 5, 5]} />
      <WavePlane />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
      />
    </Canvas>
  );
}
