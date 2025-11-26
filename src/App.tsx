import { Canvas } from "@react-three/fiber";
import { memo, useState } from "react";
import { CodeEditor as Editor } from "@/code-editor";
import { highlightGLSL as highlight } from "@/highlight-glsl";

export function App() {
  const [vertexShader, setVertexShader] = useState<string>("");
  const [fragmentShader, setFragmentShader] = useState<string>("");

  return (
    <main className="fixed top-0 left-0 w-1/2 h-screen max-w-7xl mx-auto p-8 text-center z-10">
      <Preview vertexShader={vertexShader} fragmentShader={fragmentShader} />
      <Editor
        value={"hello"}
        onValueChange={setVertexShader}
        highlight={highlight}
        padding={0}
      />
      <Editor
        value={"hello"}
        onValueChange={setFragmentShader}
        highlight={highlight}
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
