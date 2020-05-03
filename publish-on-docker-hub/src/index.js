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

    await exec.exec('docker', ['build', '-t', dockerFullName]);
    await exec.exec('docker', ['login', '-u', dockerUserName, '-p', dockerToken]);
    await exec.exec('docker', ['push', dockerFullName]);
  } catch (error) {
    core.setFailed(error.message);
  }
}

init();
