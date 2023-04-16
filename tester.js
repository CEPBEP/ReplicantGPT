import path from 'path';
import run from './agent/runner.js';
import * as files from './agent/files_system.js';

let prompt =
  "Update the file 'space.html' to add a fantasy story about the Space Invaders.";

let model = 'gpt-4';
const project_dir = path.join(process.cwd(), 'project');

run({ model, prompt, project_dir }).then((result) => console.log({ result }));

// let content =
//   "-- PATCH_START: space.html\n@@ -16,6 +16,28 @@\n       obstacles and gaining points. With its vector graphics and\n       addictive gameplay, Asteroids set the standard for future space games.\n     </li>\n+    <li>\n+      <strong>Space Invaders (1978)</strong> - As one of the earliest arcade games, Space Invaders put players in control of a laser cannon tasked with defending the planet from waves of alien invaders. The game's never-ending onslaught of enemies created a tense and thrilling experience, sparking a global phenomenon and captivating the imaginations of a generation.\n+      <p>\n+        <em><strong>The Legend of the Space Invaders:</strong></em> - In a far-off galaxy, a galactic war rages between the humans of Earth and the mysterious Space Invaders. These otherworldly beings possess powerful technology, harnessing energy shields to protect their fleets and deploying countless waves of attack ships in their relentless pursuit.\n+      </p>\n+      <p>\n+        As Earth's last hope, you command an advanced laser cannon capable of repelling the constant waves of invading ships. Traverse the landscape, taking down enemy rows and avoiding their devastating bombardments. With each enemy defeated, tales of victory spread throughout human settlements, giving hope to a desperate population.\n+      </p>\n+      <p>\n+        As the conflict continues, the Space Invaders grow ever more ambitious, unleashing new waves of attackers upon Earth. But with bravery and skill, you must protect humanity and rise in the ranks, becoming the hero that Earth desperately needs.\n+      </p>\n+      <p>\n+        Ultimately, the battle for the galaxy hinges on the result of one final confrontation. Earth, backed by its united forces, makes a daring assault on the Space Invaders' home planet. The two sides clash in an epic struggle, with losses accumulating on both ends. The final outcome remains uncertain, but the cause of Earth unites people from all corners of the galaxy in their shared fight against the Space Invaders.\n+      </p>\n+    </li>\n     <li>\n       <strong>Galaga (1981)</strong> - Another classic space game, Galaga\n       features players controlling a ship that must fend off swarms of enemy\n@@ -46,6 +68,6 @@\n       truly endless.\n     </p>\n   </body>\n-</html>\n\n-- FILE_END: space.html\n";

// const changes = files.performOperations(content, project_dir);
