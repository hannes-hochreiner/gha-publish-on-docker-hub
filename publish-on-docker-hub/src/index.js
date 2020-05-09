import {default as core} from '@actions/core';
import {default as exec} from '@actions/exec'
import {run} from './action';

async function init() {
  await run(core, exec, process.env, console);
}

init();
