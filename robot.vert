#version 300 es
#pragma vscode_glsllint_stage: vert

in vec4 a_position;
in vec4 a_color;

out vec4 v_color;

uniform mat4 u_cube_view;
uniform mat4 u_projection;

void main() {
    gl_Position = u_projection * u_cube_view * a_position;
    v_color = a_color;
}