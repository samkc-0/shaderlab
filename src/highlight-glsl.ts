const GLSL_KEYWORDS = new Set([
  // control flow
  "if",
  "else",
  "for",
  "while",
  "do",
  "switch",
  "case",
  "default",
  "break",
  "continue",
  "return",
  "discard",
  // qualifiers
  "const",
  "attribute",
  "uniform",
  "varying",
  "buffer",
  "shared",
  "coherent",
  "volatile",
  "restrict",
  "readonly",
  "writeonly",
  "layout",
  "centroid",
  "flat",
  "smooth",
  "noperspective",
  "patch",
  "sample",
  "in",
  "out",
  "inout",
  "invariant",
  "precise",
  // precision
  "highp",
  "mediump",
  "lowp",
  "precision",
]);

const GLSL_TYPES = new Set([
  "void",
  "bool",
  "int",
  "uint",
  "float",
  "double",
  "vec2",
  "vec3",
  "vec4",
  "bvec2",
  "bvec3",
  "bvec4",
  "ivec2",
  "ivec3",
  "ivec4",
  "uvec2",
  "uvec3",
  "uvec4",
  "mat2",
  "mat3",
  "mat4",
  "mat2x2",
  "mat2x3",
  "mat2x4",
  "mat3x2",
  "mat3x3",
  "mat3x4",
  "mat4x2",
  "mat4x3",
  "mat4x4",
  "sampler2D",
  "isampler2D",
  "usampler2D",
  "sampler3D",
  "isampler3D",
  "usampler3D",
  "samplerCube",
  "isamplerCube",
  "usamplerCube",
  "sampler2DShadow",
  "samplerCubeShadow",
  "sampler2DArray",
  "isampler2DArray",
  "usampler2DArray",
  "sampler2DArrayShadow",
  "samplerBuffer",
  "isamplerBuffer",
  "usamplerBuffer",
  "sampler2DMS",
  "isampler2DMS",
  "usampler2DMS",
  "sampler2DMSArray",
  "isampler2DMSArray",
  "usampler2DMSArray",
]);

const GLSL_BUILTINS = new Set([
  // common built-ins (not exhaustive)
  "radians",
  "degrees",
  "sin",
  "cos",
  "tan",
  "asin",
  "acos",
  "atan",
  "sinh",
  "cosh",
  "tanh",
  "asinh",
  "acosh",
  "atanh",
  "pow",
  "exp",
  "log",
  "exp2",
  "log2",
  "sqrt",
  "inversesqrt",
  "abs",
  "sign",
  "floor",
  "trunc",
  "round",
  "roundEven",
  "ceil",
  "fract",
  "mod",
  "modf",
  "min",
  "max",
  "clamp",
  "mix",
  "step",
  "smoothstep",
  "length",
  "distance",
  "dot",
  "cross",
  "normalize",
  "faceforward",
  "reflect",
  "refract",
  "matrixCompMult",
  "outerProduct",
  "transpose",
  "determinant",
  "inverse",
  "lessThan",
  "lessThanEqual",
  "greaterThan",
  "greaterThanEqual",
  "equal",
  "notEqual",
  "any",
  "all",
  "not",
  "texture",
  "textureLod",
  "textureProj",
  "textureLodProj",
  "textureGrad",
  "textureSize",
  "dFdx",
  "dFdy",
  "fwidth",
  "gl_Position",
  "gl_FragCoord",
  "gl_FragColor",
  "gl_FragData",
  "gl_PointCoord",
  "gl_PointSize",
  "gl_VertexID",
  "gl_InstanceID",
  "gl_FrontFacing",
  "gl_DepthRange",
]);

type TokenType =
  | "whitespace"
  | "comment"
  | "string"
  | "number"
  | "keyword"
  | "type"
  | "builtin"
  | "preprocessor"
  | "operator"
  | "identifier"
  | "punctuation"
  | "unknown";

interface Token {
  type: TokenType;
  value: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function tokenizeGLSL(code: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;

  const patterns: { type: TokenType; regex: RegExp }[] = [
    // multi-line or single-line comments
    { type: "comment", regex: /\/\*[\s\S]*?\*\/|\/\/.*/y },
    // strings (simple double-quoted)
    { type: "string", regex: /"(?:\\.|[^"\\])*"/y },
    // preprocessor (#version, #define, etc.) – match from # to end of line
    { type: "preprocessor", regex: /#[^\n]*/y },
    // numbers (int / float)
    { type: "number", regex: /\b\d+(\.\d+)?([eE][+-]?\d+)?[uUfF]?\b/y },
    // identifiers
    { type: "identifier", regex: /[A-Za-z_]\w*/y },
    // whitespace
    { type: "whitespace", regex: /\s+/y },
    // operators & punctuation
    { type: "operator", regex: /[+\-*/%=&|^!<>]=?|[?:]/y },
    { type: "punctuation", regex: /[;,()[\]{}.,]/y },
    // fallback
    { type: "unknown", regex: /./y },
  ];

  while (index < code.length) {
    let matched = false;

    for (const { type, regex } of patterns) {
      regex.lastIndex = index;
      const match = regex.exec(code);
      if (match && match.index === index) {
        let value = match[0];
        let finalType: TokenType = type;

        if (type === "identifier") {
          if (GLSL_KEYWORDS.has(value)) finalType = "keyword";
          else if (GLSL_TYPES.has(value)) finalType = "type";
          else if (GLSL_BUILTINS.has(value)) finalType = "builtin";
          else finalType = "identifier";
        }

        tokens.push({ type: finalType, value });
        index += value.length;
        matched = true;
        break;
      }
    }

    if (!matched) {
      // safety net: shouldn't happen because of "unknown", but just in case
      tokens.push({ type: "unknown", value: code[index] });
      index += 1;
    }
  }

  return tokens;
}

// Main API: use this with react-simple-code-editor
export function highlightGLSL(code: string): string {
  const tokens = tokenizeGLSL(code);

  return tokens
    .map((token) => {
      const escaped = escapeHtml(token.value);

      if (token.type === "whitespace") {
        // keep whitespace raw so newlines/indentation are preserved
        return escaped;
      }

      const className = `token-${token.type}`;
      return `<span class="${className}">${escaped}</span>`;
    })
    .join("");
}
