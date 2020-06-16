var argv = require("optimist").argv;
delete argv["$0"];
console.log(argv);

/**
 * optimist can accept flags in the command line
 *      -f -r -s
 *      prints {f: true, r: true, s: true}
 * it can also accept values after a flag
 *      -t 1000
 *      prints: {t: 1000}
 */
