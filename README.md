# ReplicantGPT




## Create, show, and comment on issues

<img width="726" alt="Screenshot 2023-04-16 at 10 49 42 AM" src="https://user-images.githubusercontent.com/14149230/232331809-13bb9fbe-877b-4864-946f-049f4028a038.png">

<img width="701" alt="Screenshot 2023-04-16 at 9 25 24 AM" src="https://user-images.githubusercontent.com/14149230/232331765-6c2b733c-d3da-4f5d-99d6-b2fe8c5f6fa0.png">

## Summarize issue threads
<img width="703" alt="Screenshot 2023-04-16 at 10 50 39 AM" src="https://user-images.githubusercontent.com/14149230/232331874-eda256cc-978d-479e-b792-497eedb0ed85.png">


## List local files
<img width="708" alt="Screenshot 2023-04-16 at 9 25 10 AM" src="https://user-images.githubusercontent.com/14149230/232331746-ee1f9c28-3627-45c7-afb4-7d5048d17baa.png">


## Assign coders to implement

<img width="652" alt="Screenshot 2023-04-16 at 9 27 02 AM" src="https://user-images.githubusercontent.com/14149230/232331846-0de83059-09f2-4cb2-a905-3cfa63281387.png">

<img width="745" alt="Screenshot 2023-04-16 at 9 25 46 AM" src="https://user-images.githubusercontent.com/14149230/232331837-bd42eddb-1f72-4423-848d-9f5a93ca5b32.png">

## Coders commit to main
<img width="742" alt="Screenshot 2023-04-16 at 10 53 05 AM" src="https://user-images.githubusercontent.com/14149230/232332018-5b840b75-5a1a-47a6-a85f-a56d2b1d19fa.png">
<img width="1590" alt="Screenshot 2023-04-16 at 10 53 47 AM" src="https://user-images.githubusercontent.com/14149230/232332048-ea29bdbd-d1fe-4d9d-9180-4da8a6927857.png">


# Behind the scenes...
```
{
  "messages": [
    {
      "role": "system",
      "content": "You are DevGPT, a open source indie developer AI.\n\nTo create or replace entire files, wrap the contents of both files in the strings '-- FILE_START: filename' and '-- FILE_END: <filename>'.\n\n-- FILE_START: DEMO\nDemo File\nName:\nLast Line of Demo File\n-- FILE_END: DEMO\n\nTo delete files, use:\n--DELETE: DEMO\n\nTo rename files, use:\n--RENAME: old_filename new_filename\n\nYou will be given a task and a list of files that already exist.  If you need to see any files ask for them using the 'CAT' command before coding.\n\n--CAT: file1\n--CAT: file2\n"
    },
    {
      "role": "user",
      "content": "files:\n.DS_Store\nREADME.md\nindex.html"
    },
    {
      "role": "user",
      "content": "For this hackathon demo, the goal is to create a simple static page that showcases an interactive particle system. Users should be able to interact with the particles on the page by clicking and dragging their mouse. The particles should respond to user interactions in a visually appealing way. Below are the tasks involved in this issue:\n\n1. Use HTML, CSS, and JavaScript to create the static page.\n2. Implement the particle system using a JavaScript library such as p5.js or Three.js.\n3. Ensure that the page is responsive and works well on both desktop and mobile devices.\n\nBonus Features (optional):\n1. Allow users to customize the appearance of the particles (e.g., color, size, shape).\n2. Add background music or sound effects that are triggered by user interactions.\n\nPlease implement the tasks mentioned above."
    },
    {
      "role": "assistant",
      "content": "Let's start by creating the static HTML page with a canvas for our particle system.\n\n-- FILE_START: index.html\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Interactive Particle System</title>\n    <link rel=\"stylesheet\" href=\"styles.css\">\n</head>\n<body>\n    <main>\n        <h1>Interactive Particle System</h1>\n        <canvas id=\"particleCanvas\"></canvas>\n    </main>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js\"></script>\n    <script src=\"script.js\"></script>\n</body>\n</html>\n-- FILE_END: index.html\n\nNow, let's add some basic CSS styles for the page.\n\n-- FILE_START: styles.css\nbody {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    height: 100vh;\n    margin: 0;\n    font-family: Arial, sans-serif;\n    background-color: #ececec;\n}\n\nmain {\n    text-align: center;\n}\n\ncanvas {\n    display: block;\n    border: 2px solid #000;\n}\n-- FILE_END: styles.css\n\nNext, we'll implement the particle system using p5.js library in the script.js file.\n\n-- FILE_START: script.js\nlet particles = [];\n\nfunction setup() {\n    let canvas = createCanvas(windowWidth, windowHeight);\n    canvas.parent('particleCanvas');\n    frameRate(60);\n}\n\nfunction draw() {\n    background(255);\n\n    for (let i = particles.length - 1; i >= 0; i--) {\n        particles[i].display();\n        particles[i].move();\n        if (particles[i].isOutOfCanvas()) {\n            particles.splice(i, 1);\n        }\n    }\n}\n\nfunction mouseClicked() {\n    spawnParticles(mouseX, mouseY, 10);\n}\n\nfunction touchStarted() {\n    spawnParticles(touchX, touchY, 10);\n}\n\nfunction windowResized() {\n    resizeCanvas(windowWidth, windowHeight);\n}\n\nfunction spawnParticles(x, y, num) {\n    for (let i = 0; i < num; i++) {\n        particles.push(new Particle(x, y));\n    }\n}\n\nclass Particle {\n    constructor(x, y) {\n        this.x = x;\n        this.y = y;\n        this.size = random(5, 15);\n        this.vx = random(-3, 3);\n        this.vy = random(-3, 3);\n        this.color = color(random(0, 255), random(0, 255), random(0, 255));\n    }\n\n    move() {\n        this.x += this.vx;\n        this.y += this.vy;\n    }\n\n    display() {\n        fill(this.color);\n        ellipse(this.x, this.y, this.size);\n    }\n\n    isOutOfCanvas() {\n        return (this.x < 0 || this.x > width || this.y < 0 || this.y > height);\n    }\n}\n-- FILE_END: script.js\n\nThis implementation creates a responsive canvas with an interactive particle system using the p5.js library. Users can interact with particles by clicking or touching the screen, which spawns new particles.\n\nThe bonus features, such as customizing particle appearance and adding sound effects, can be implemented as enhancements after the base functionality is complete."
    },
    {
      "role": "user",
      "content": "Great!  Now it is time to commit your work.  Please enter a commit message in:\n\n-- COMMIT_START\ncommit message\n-- COMMIT_END"
    }
  ],
  "model": "gpt-4",
  "response": {
    "role": "assistant",
    "content": "-- COMMIT_START\nImplement interactive particle system using p5.js\n-- COMMIT_END"
  }
}
```
