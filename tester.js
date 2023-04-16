#!/usr/bin/env node

import { runProjectCmd } from "./filez.js";

const work = async () => {
  //  Don't output any other text before or after the files. ??
  const changes = await runProjectCmd({
    prompt:
      "Please create a THANKS.md to get the first release of the project done",
    model: "gpt-3.5-turbo",
  });

  console.log(changes);
};

work();
