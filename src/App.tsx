import { Canvas } from "@react-three/fiber";
import { memo, useState } from "react";
import Editor from "@/editor";
import "./index.css";
import { OrbitControls } from "@react-three/drei";
import { highlightGLSL as highlight } from "./highlight-glsl";

export function App() {
  const [vertexShader, setVertexShader] = useState<string>(
    getDefaultVertexShader(),
  );
  const [fragmentShader, setFragmentShader] = useState<string>(
    getDefaultFragmentShader(),
  );

  const handleVertexShaderChange = (value: string) => {
    setVertexShader(value);
  };

  const handleFragmentShaderChange = (value: string) => {
    setFragmentShader(value);
  };
  return (
    <main className="grid-container fixed top-0 left-0 w-full h-full mx-auto text-center z-10 bg-lime-50">
      <Preview vertexShader={vertexShader} fragmentShader={fragmentShader} />
      <Editor
        className="vertex-shaders-editor"
        value={vertexShader}
        onValueChange={handleVertexShaderChange}
        highlight={highlight}
        padding={0}
      />
      <Editor
        className="fragment-shaders-editor"
        value={fragmentShader}
        onValueChange={handleFragmentShaderChange}
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
    <Canvas className="canvas" camera={{ position: [0, 0, 5] }}>
      <OrbitControls />
      <mesh>
        <planeGeometry args={[1, 1, 32, 32]} />
        {fragmentShader && vertexShader ? (
          <shaderMaterial
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
          />
        ) : (
          <meshBasicMaterial />
        )}
      </mesh>
    </Canvas>
  );
});

export default App;

function getDefaultVertexShader() {
  return `
#ifdef GL_ES
precision mediump float;
#endif


void main() {
  gl_Position = position;
}
`;
}

function getDefaultFragmentShader() {
  return `#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;

void main() {
	gl_FragColor = vec4(1.0,0.0,1.0,1.0);
}
`;
}
