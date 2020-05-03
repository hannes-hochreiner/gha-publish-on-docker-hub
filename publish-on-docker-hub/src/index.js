const core = require('@actions/core');

try {
  const dockerUserName = core.getInput('docker-user-name');
  const dockerToken = core.getInput('docker-token');
  console.log(`docker-user-name: ${dockerUserName}`);
  console.log(`docker-token: ${dockerToken}`);
  console.log(`GITHUB_REF: ${GITHUB_REF}`);
  console.log(`GITHUB_REPOSITORY: ${GITHUB_REPOSITORY}`);
} catch (error) {
  core.setFailed(error.message);
}
