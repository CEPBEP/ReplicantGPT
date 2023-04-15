import {runProjectCmd} from './filez.js';


runProjectCmd('ls -hal').then((result) => {
    console.log(result);
    }
);