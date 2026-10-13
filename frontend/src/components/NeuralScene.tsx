import { useMemo, useRef } from "react";
import { Float, Line, OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import type { Group } from "three";

const points: [number, number, number][] = [
  [-1.7, -1, 0], [-1.7, 0, 0.2], [-1.7, 1, -0.1],
  [-0.55, -1.35, -0.1], [-0.55, -0.45, 0.45], [-0.55, 0.45, -0.4], [-0.55, 1.35, 0.1],
  [0.65, -1, 0.25], [0.65, 0, -0.25], [0.65, 1, 0.15],
  [1.75, -0.5, 0], [1.75, 0.5, 0.2],
];
const layers = [[0, 1, 2], [3, 4, 5, 6], [7, 8, 9], [10, 11]];

export default function NeuralScene() {
  const group = useRef<Group>(null);
  const prefersReducedMotion = useReducedMotion();
  const connections = useMemo(() => {
    const segments: [number, number, number][][] = [];
    layers.slice(0, -1).forEach((layer, layerIndex) => {
      layer.forEach((start) => {
        layers[layerIndex + 1].forEach((end) => segments.push([points[start], points[end]]));
      });
    });
    return segments;
  }, []);

  useFrame((_, delta) => {
    if (group.current && prefersReducedMotion === false) {
      group.current.rotation.y += delta * 0.075;
      group.current.rotation.x = Math.sin(Date.now() * 0.0002) * 0.05;
    }
  });

  return (
    <>
      <ambientLight intensity={1.3} />
      <directionalLight position={[3, 4, 5]} intensity={2} color="#f7f8e5" />
      <Float speed={prefersReducedMotion === false ? 0.7 : 0} rotationIntensity={0.08} floatIntensity={0.12}>
        <group ref={group}>
          {connections.map((segment, index) => (
            <Line key={`link-${index}`} points={segment} color="#6d6a61" transparent opacity={0.45} lineWidth={0.8} />
          ))}
          {points.map((position, index) => (
            <mesh key={`node-${index}`} position={position}>
              <icosahedronGeometry args={[index % 4 === 1 ? 0.12 : 0.075, 1]} />
              <meshStandardMaterial color={index % 3 === 0 ? "#232d23" : "#6d6a61"} roughness={0.38} metalness={0.12} />
            </mesh>
          ))}
          <mesh position={[0, 0, -1.25]}>
            <torusGeometry args={[2.25, 0.008, 8, 120]} />
            <meshBasicMaterial color="#6d6a61" transparent opacity={0.3} />
          </mesh>
        </group>
      </Float>
      <OrbitControls enablePan={false} enableZoom={false} />
    </>
  );
}
