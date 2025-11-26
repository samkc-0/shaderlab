import { Canvas } from "@react-three/fiber";
import { DoubleSide } from "three";
import "./index.css";
import { memo, useState } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-glsl";
import "prismjs/themes/prism.css"; // o el tema que uses

export function App() {
  const [vertexShader, setVertexShader] = useState<string>("");
  const [fragmentShader, setFragmentShader] = useState<string>("");

  return (
    <main className="fixed top-0 left-0 w-1/2 h-screen max-w-7xl mx-auto p-8 text-center z-10">
      <Preview vertexShader={vertexShader} fragmentShader={fragmentShader} />
      <Editor
        value={vertexShader}
        onValueChange={setVertexShader}
        highlight={(code) => highlight(code, languages.glsl, "glsl")}
        padding={0}
      />
      <Editor
        value={fragmentShader}
        onValueChange={setFragmentShader}
        highlight={(code) => highlight(code, languages.glsl, "glsl")}
        padding={0}
      />
    </main>
  );
}

type PreviewProps = {
  vertexShader: string;
  fragmentShader: string;
};

const Preview = memo(function Preview({
  vertexShader,
  fragmentShader,
}: PreviewProps) {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <mesh>
        <planeGeometry args={[1, 1, 32, 32]} />
        <meshBasicMaterial />
      </mesh>
    </Canvas>
  );
});

export default App;
