let easycam;
let uvShader;
let opacity;
let size;

function preload() {
  // The projection and modelview matrices may be emitted separately
  // (i.e., matrices: Tree.pMatrix | Tree.mvMatrix), which actually
  // leads to the same gl_Position result.
  // Interpolate only texture coordinates (i.e., varyings: Tree.texcoords2).
  // see: https://github.com/VisualComputing/p5.treegl#handling
  uvShader = readShader('../../../../sketches/texturing/uv_alpha.frag', { varyings: Tree.texcoord2 });
}

function setup() {
  createCanvas(600, 600, WEBGL);
  size = 2;

  // easycam stuff
  let state = {
    distance: 250,           // scalar
    center: [0, 0, 0],       // vector
    rotation: [0, 0, 0, 1],  // quaternion
  };
  easycam = createEasyCam();
  easycam.state_reset = state;   // state to use on reset (double-click/tap)
  easycam.setState(state, 2000); // now animate to that state
  textureMode(NORMAL);
  opacity = createSlider(0, 1, 0.5, 0.01);
  opacity.position(10, 25);
  opacity.style('width', '280px');
}

function draw() {
  background(200);
  // reset shader so that the default shader is used to render the 3D scene
  resetShader();
  // world space scene
  axes();
  grid();
  translate(0, -70);
  rotateY(0.5);
  fill(color(255, 0, 255, 125));
  box(30, 50);
  translate(70, 70);
  fill(color(0, 255, 255, 125));
  sphere(30, 50);
  // use custom shader
  shader(uvShader);
  // https://p5js.org/reference/#/p5.Shader/setUniform
  uvShader.setUniform('opacity', opacity.value());
  // screen-space quad (i.e., x ∈ [0..width] and y ∈ [0..height])
  // see: https://github.com/VisualComputing/p5.treegl#heads-up-display
  beginHUD();
  noStroke();
  
  beginShape();
  vertex(mouseX, mouseY + (27*size), 10, 1, 1);
  vertex(mouseX + (25 *size), mouseY + (10*size), 10, 1, 0);
  vertex(mouseX + (20 *size), mouseY - (20*size), 10, 0, 1);
  vertex(mouseX - (20 *size), mouseY - (20*size), 10, 0, 1);
  vertex(mouseX - (25 *size), mouseY + (10*size), 10, 1, 0);
  endShape();

  endHUD();
}

function keyPressed() {
  if (key === 'r') {
    size = 1;
  }
}

function mouseWheel(event) {
  if(event.delta > 0 )
    size += 0.1
  else
    size -= 0.1
  return false;
}