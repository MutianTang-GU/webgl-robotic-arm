#version 300 es
#pragma vscode_glsllint_stage: frag
precision mediump float;

in vec4 v_color;
out vec4 outColor;

void main() {
    outColor = v_color;
}