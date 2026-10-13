import { lazy, Suspense } from "react";
import { Canvas } from "@react-three/fiber";

const NeuralScene = lazy(() => import("./NeuralScene"));

export default function NeuralCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      aria-hidden="true"
    >
      <Suspense fallback={null}>
        <NeuralScene />
      </Suspense>
    </Canvas>
  );
}
