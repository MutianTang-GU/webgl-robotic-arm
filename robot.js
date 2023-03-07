import { mat4 } from "gl-matrix";
import vsSource from "./robot.vert";
import fsSource from "./robot.frag";

class Robot {
  constructor() {
    this.camara_x = 0;
    this.camara_y = 0;
    this.camara_z = 0;
    this.rotation_1x = 0;
    this.rotation_1y = 0;
    this.rotation_1z = 0;
    this.rotation_2x = 0;
    this.rotation_2y = 0;
    this.rotation_2z = 0;
    this.rotation_3x = 0;
    this.rotation_3y = 0;
    this.rotation_3z = 0;
  }

  init() {
    const canvas = document.getElementById("glcanvas");
    /** @type {WebGLRenderingContext} */
    this.gl = canvas.getContext("webgl2");
    if (!this.gl) {
      window.alert(
        "Unable to initialize WebGL. Your browser or machine may not support it."
      );
      throw new Error("Unable to initialize WebGL");
    }
    this.gl.clearColor(0.9, 0.9, 0.9, 1);

    // create the shader program
    this.shaderProgram = this.createShaderProgram(vsSource, fsSource);
  }

  // Create a shader program from the source code of the shaders
  createShaderProgram(vsSource, fsSource) {
    const vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
    this.gl.shaderSource(vertexShader, vsSource);
    this.gl.compileShader(vertexShader);
    const fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
    this.gl.shaderSource(fragmentShader, fsSource);
    this.gl.compileShader(fragmentShader);
    const program = this.gl.createProgram();
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);
    return program;
  }

  createBuffers() {
    const basic_cube = [
      // basic cube
      // Front face
      -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
      // Back face
      -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,
      // Top face
      -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,
      // Bottom face
      -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
      // Right face
      1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,
      // Left face
      -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
    ];

    const cube1 = basic_cube.map((x, i) => {
      if (i % 3 === 1) {
        return x * 1.5;
      }
      return x;
    });
    const cube2 = basic_cube.map((x, i) => {
      if (i % 3 === 0) {
        return x + 2.5;
      } else {
        return x * 0.5;
      }
    });
    const cube3 = basic_cube.map((x, i) => {
      x = x * 0.25;
      if (i % 3 === 0) {
        return x + 4;
      }
      return x;
    });

    const cube1PointsBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, cube1PointsBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(cube1),
      this.gl.STATIC_DRAW
    );

    const cube2PointsBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, cube2PointsBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(cube2),
      this.gl.STATIC_DRAW
    );
    const cube3PointsBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, cube3PointsBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(cube3),
      this.gl.STATIC_DRAW
    );

    const colors = [
      [1.0, 0.647, 0.0, 1.0], // Front face: orange
      [1.0, 0.0, 0.0, 1.0], // Back face: red
      [0.0, 1.0, 0.0, 1.0], // Top face: green
      [0.0, 0.0, 1.0, 1.0], // Bottom face: blue
      [1.0, 1.0, 0.0, 1.0], // Right face: yellow
      [1.0, 0.0, 1.0, 1.0], // Left face: purple
    ];

    let generatedColors = [];
    for (let j = 0; j < 6; j++) {
      const c = colors[j];
      for (let i = 0; i < 4; i++) {
        generatedColors = generatedColors.concat(c);
      }
    }

    const colorsBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorsBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(generatedColors),
      this.gl.STATIC_DRAW
    );

    const cubeVertexIndices = [
      // front
      0, 1, 2, 0, 2, 3,
      // back
      4, 5, 6, 4, 6, 7,
      // top
      8, 9, 10, 8, 10, 11,
      // bottom
      12, 13, 14, 12, 14, 15,
      // right
      16, 17, 18, 16, 18, 19,
      // left
      20, 21, 22, 20, 22, 23,
    ];
    const cubeVerticesIndexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);
    this.gl.bufferData(
      this.gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(cubeVertexIndices),
      this.gl.STATIC_DRAW
    );

    return {
      position: [cube1PointsBuffer, cube2PointsBuffer, cube3PointsBuffer],
      color: colorsBuffer,
      indices: cubeVerticesIndexBuffer,
    };
  }

  draw() {
    // clear the canvas
    this.gl.clearDepth(1.0); // Clear everything
    this.gl.enable(this.gl.DEPTH_TEST); // Enable depth testing
    this.gl.depthFunc(this.gl.LEQUAL); // Near things obscure far things
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    const fieldOfView = (45 * Math.PI) / 180;
    const aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    this.projectionMatrix = mat4.create();

    mat4.perspective(this.projectionMatrix, fieldOfView, aspect, zNear, zFar);

    const {
      position: [
        positionBuffer_cube1,
        positionBuffer_cube2,
        positionBuffer_cube3,
      ],
      color: colorBuffer,
      indices: indexBuffer,
    } = this.createBuffers();

    const cube1View = mat4.create();
    mat4.translate(
      cube1View, // destination matrix
      cube1View, // matrix to translate
      [-2.5 + this.camara_x, this.camara_y, -10.0 + this.camara_z]
    );
    mat4.translate(cube1View, cube1View, [-1.0, 0, 0]);
    mat4.rotateX(cube1View, cube1View, (this.rotation_1x / 180) * Math.PI);
    mat4.rotateY(cube1View, cube1View, (this.rotation_1y / 180) * Math.PI);
    mat4.rotateZ(cube1View, cube1View, (this.rotation_1z / 180) * Math.PI);
    mat4.translate(cube1View, cube1View, [1.0, 0, 0]);

    this.draw_cube(
      this.shaderProgram,
      positionBuffer_cube1,
      colorBuffer,
      indexBuffer,
      cube1View
    );

    const cube2View = mat4.clone(cube1View);
    mat4.translate(cube2View, cube2View, [1.0, 0, 0]);
    mat4.rotateX(cube2View, cube2View, (this.rotation_2x / 180) * Math.PI);
    mat4.rotateY(cube2View, cube2View, (this.rotation_2y / 180) * Math.PI);
    mat4.rotateZ(cube2View, cube2View, (this.rotation_2z / 180) * Math.PI);
    mat4.translate(cube2View, cube2View, [-1.0, 0, 0]);

    this.draw_cube(
      this.shaderProgram,
      positionBuffer_cube2,
      colorBuffer,
      indexBuffer,
      cube2View
    );

    const cube3View = mat4.clone(cube2View);
    mat4.translate(cube3View, cube3View, [3.5, 0, 0]);
    mat4.rotateX(cube3View, cube3View, (this.rotation_3x / 180) * Math.PI);
    mat4.rotateY(cube3View, cube3View, (this.rotation_3y / 180) * Math.PI);
    mat4.rotateZ(cube3View, cube3View, (this.rotation_3z / 180) * Math.PI);
    mat4.translate(cube3View, cube3View, [-3.5, 0, 0]);

    this.draw_cube(
      this.shaderProgram,
      positionBuffer_cube3,
      colorBuffer,
      indexBuffer,
      cube3View
    );
  }

  draw_cube(
    shaderProgram,
    positionBuffer,
    colorBuffer,
    indexBuffer,
    modelView
  ) {
    this.gl.useProgram(shaderProgram);

    this.gl.uniformMatrix4fv(
      this.gl.getUniformLocation(shaderProgram, "u_projection"),
      false,
      this.projectionMatrix
    );
    this.gl.uniformMatrix4fv(
      this.gl.getUniformLocation(shaderProgram, "u_cube_view"),
      false,
      modelView
    );

    const positionAttributeLocation = this.gl.getAttribLocation(
      shaderProgram,
      "a_position"
    );
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    {
      const size = 3;
      const type = this.gl.FLOAT;
      const normalized = false;
      const stride = 0;
      const offset = 0;
      this.gl.vertexAttribPointer(
        positionAttributeLocation,
        size,
        type,
        normalized,
        stride,
        offset
      );
    }
    this.gl.enableVertexAttribArray(positionAttributeLocation);

    const colorAttributeLocation = this.gl.getAttribLocation(
      shaderProgram,
      "a_color"
    );
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
    {
      const size = 4;
      const type = this.gl.FLOAT;
      const normalized = false;
      const stride = 0;
      const offset = 0;
      this.gl.vertexAttribPointer(
        colorAttributeLocation,
        size,
        type,
        normalized,
        stride,
        offset
      );
    }
    this.gl.enableVertexAttribArray(colorAttributeLocation);

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    {
      const count = 36;
      const type = this.gl.UNSIGNED_SHORT;
      const offset = 0;
      this.gl.drawElements(this.gl.TRIANGLES, count, type, offset);
    }
  }
}
function main() {
  const robot = new Robot();
  robot.init();
  robot.draw();

  for (const controller of [
    "camara_x",
    "camara_y",
    "camara_z",
    "rotation_1x",
    "rotation_1y",
    "rotation_1z",
    "rotation_2x",
    "rotation_2y",
    "rotation_2z",
    "rotation_3x",
    "rotation_3y",
    "rotation_3z",
  ]) {
    document.getElementById(controller).addEventListener("input", (e) => {
      robot[controller] = Number(e.target.value);
      robot.draw();
    });
  }
}

if (document.readyState !== "loading") {
  main();
} else {
  document.addEventListener("DOMContentLoaded", main);
}
