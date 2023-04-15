import {runProjectCmd} from './filez';


runProjectCmd('ls -hal').then((result) => {
    console.log(result);
    }
);