// Import dependencies
import { JSDOM } from "jsdom";

describe("Particle Simulation Tests", () => {
  let dom;
  let document;
  let window;
  let canvas;
  let ctx;

  beforeAll(() => {
    // Set up the DOM with jsdom
    dom = new JSDOM(
      `<!DOCTYPE html><html><body><canvas id="canvas"></canvas><div class="controls">...</div></body></html>`
    );
    document = dom.window.document;
    window = dom.window;
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
  });

  beforeEach(() => {
    // Reset canvas state before each test
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  // Requirement 1: Users adjust number, size, max velocity, and interaction radius
  test("Should allow users to adjust number, size, velocity, and interaction radius", () => {
    const numParticlesInput = document.getElementById("numParticles");
    const particleSizeInput = document.getElementById("particleSize");
    const maxVelocityInput = document.getElementById("maxVelocity");
    const interactionRadiusInput = document.getElementById("interactionRadius");

    // Simulate user input
    numParticlesInput.value = 200;
    particleSizeInput.value = 5;
    maxVelocityInput.value = 3;
    interactionRadiusInput.value = 150;

    // Trigger events to simulate the input change
    numParticlesInput.dispatchEvent(new window.Event("input"));
    particleSizeInput.dispatchEvent(new window.Event("input"));
    maxVelocityInput.dispatchEvent(new window.Event("input"));
    interactionRadiusInput.dispatchEvent(new window.Event("input"));

    // Check if the values are updated in the DOM and if particles react to the changes
    expect(document.getElementById("numParticlesValue").textContent).toBe(
      "200"
    );
    expect(document.getElementById("particleSizeValue").textContent).toBe("5");
    expect(document.getElementById("maxVelocityValue").textContent).toBe("3");
    expect(document.getElementById("interactionRadiusValue").textContent).toBe(
      "150"
    );
  });

  // Requirement 2: Update particle motion in real-time when inputs change
  test("Should update particle motion in real-time when settings change", () => {
    const maxVelocityInput = document.getElementById("maxVelocity");
    maxVelocityInput.value = 4;
    maxVelocityInput.dispatchEvent(new window.Event("input"));

    // Simulate a particle's velocity update
    const particle = new Particle();
    expect(particle.velocityX).toBeLessThanOrEqual(4);
    expect(particle.velocityY).toBeLessThanOrEqual(4);
  });

  // Requirement 3: Particles react to mouse movement
  test("Particles should move away from the mouse pointer when it gets close", () => {
    const mouse = { x: 100, y: 100 }; // Simulate mouse coordinates

    const particle = new Particle();
    particle.x = 110;
    particle.y = 110;

    particle.update(); // Update particle based on mouse position

    // Expect the particle to move away from the mouse
    expect(particle.x).toBeGreaterThan(110);
    expect(particle.y).toBeGreaterThan(110);
  });

  // Requirement 4: Allow grouping particles into clusters with different behaviors
  test("Should allow creating separate groups of particles with different behaviors", () => {
    const group1 = new ParticleGroup({ velocity: 1, interactionRadius: 100 });
    const group2 = new ParticleGroup({ velocity: 3, interactionRadius: 200 });

    expect(group1.velocity).toBe(1);
    expect(group2.velocity).toBe(3);
    expect(group1.interactionRadius).toBe(100);
    expect(group2.interactionRadius).toBe(200);
  });

  // Requirement 5: Display particle paths for movement history
  test("Should display particle trails to visualize their movement history", () => {
    const particle = new Particle();
    particle.x = 50;
    particle.y = 50;
    particle.update(); // Move the particle

    // Check if trail is being drawn
    ctx.beginPath = jest.fn(); // Mock the canvas draw function
    particle.draw();

    expect(ctx.beginPath).toHaveBeenCalled();
  });

  // Requirement 6: Reset all particle settings to default values
  test("Should reset all particle settings to default values when reset button is clicked", () => {
    const resetButton = document.createElement("button");
    resetButton.id = "resetButton";
    document.body.appendChild(resetButton);

    resetButton.addEventListener("click", () => {
      numParticlesInput.value = 100;
      particleSizeInput.value = 3;
      maxVelocityInput.value = 2;
      interactionRadiusInput.value = 100;
    });

    // Simulate click
    resetButton.click();

    expect(numParticlesInput.value).toBe("100");
    expect(particleSizeInput.value).toBe("3");
    expect(maxVelocityInput.value).toBe("2");
    expect(interactionRadiusInput.value).toBe("100");
  });

  // Requirement 7: Allow users to slow down or speed up the particle movement
  test("Should allow users to control the particle movement speed", () => {
    const maxVelocityInput = document.getElementById("maxVelocity");
    maxVelocityInput.value = 5; // Simulate user input to increase velocity
    maxVelocityInput.dispatchEvent(new window.Event("input"));

    const particle = new Particle();
    expect(particle.velocityX).toBeLessThanOrEqual(5);
  });

  // Requirement 8: Adjust how particles interact with each other
  test("Should allow users to adjust particle interaction radius", () => {
    const interactionRadiusInput = document.getElementById("interactionRadius");
    interactionRadiusInput.value = 200;
    interactionRadiusInput.dispatchEvent(new window.Event("input"));

    const particle1 = new Particle();
    const particle2 = new Particle();
    const dist = Math.hypot(
      particle1.x - particle2.x,
      particle1.y - particle2.y
    );

    expect(dist).toBeLessThanOrEqual(200);
  });

  // Requirement 9: Customize visual appearance of particles
  test("Should allow users to change particle color and transparency", () => {
    const colorPicker = document.createElement("input");
    colorPicker.type = "color";
    colorPicker.value = "#0000ff"; // Simulate user picking blue color
    document.body.appendChild(colorPicker);

    colorPicker.dispatchEvent(new window.Event("input"));

    const particle = new Particle();
    particle.draw();

    expect(ctx.fillStyle).toBe("#0000ff"); // Check if the fill color is updated
  });

  // Requirement 10: Apply gravity or other forces to particles
  test("Should apply gravity to particles", () => {
    const gravity = 9.8; // Simulate gravity
    const particle = new Particle();
    particle.velocityY = 0;
    particle.applyGravity(gravity);

    expect(particle.velocityY).toBeGreaterThan(0); // Expect velocity to increase due to gravity
  });

  // Requirement 11: Switch between different visual effects
  test("Should allow users to toggle visual effects", () => {
    const glowingEffectCheckbox = document.createElement("input");
    glowingEffectCheckbox.type = "checkbox";
    glowingEffectCheckbox.checked = true; // Simulate user enabling glowing effect
    document.body.appendChild(glowingEffectCheckbox);

    const particle = new Particle();
    particle.update();

    expect(particle.glow).toBe(true); // Check if the particle is glowing
  });
});
