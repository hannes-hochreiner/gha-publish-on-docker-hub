const core = require('@actions/core');
const exec = require('@actions/exec');

async function init() {
  try {
    const dockerUserName = core.getInput('docker-user-name');
    const dockerToken = core.getInput('docker-token');
    const dockerTag = process.env.GITHUB_REF.split('/')[2];
    const dockerRepo = process.env.GITHUB_REPOSITORY.split('/')[1];
    console.log(`GITHUB_REF: ${process.env.GITHUB_REF}`);
    console.log(`GITHUB_REPOSITORY: ${process.env.GITHUB_REPOSITORY}`);
    const dockerFullName = `${dockerUserName}/${dockerRepo}:${dockerTag}`;
    let buildArgs = ['build', '.', '-t', dockerFullName];
    const dockerTagTokens = dockerTag.split('.');

    if (dockerTagTokens.length == 3 && dockerTagTokens[0].startsWith('v')) {
      buildArgs.push('-t');
      buildArgs.push(`${dockerUserName}/${dockerRepo}:${[dockerTagTokens[0], dockerTagTokens[1]].join('.')}`);
      buildArgs.push('-t');
      buildArgs.push(`${dockerUserName}/${dockerRepo}:${dockerTagTokens[0]}`);
    }

    await exec.exec('docker', buildArgs);
    await exec.exec('docker', ['login', '-u', dockerUserName, '--password-stdin'], {input: dockerToken});
    await exec.exec('docker', ['push', dockerFullName]);
    await exec.exec('docker', ['logout']);
  } catch (error) {
    core.setFailed(error.message);
  }
}

init();
