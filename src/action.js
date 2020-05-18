export async function run(core, exec, env, logger) {
  try {
    const dockerUserName = core.getInput('docker-user-name');
    const dockerToken = core.getInput('docker-token');
    const dockerTag = env.GITHUB_REF.split('/')[2];
    const dockerRepo = env.GITHUB_REPOSITORY.split('/')[1];

    logger.log(`GITHUB_REF: ${env.GITHUB_REF}`);
    logger.log(`GITHUB_REPOSITORY: ${env.GITHUB_REPOSITORY}`);

    let tagNames = [`docker.io/${dockerUserName}/${dockerRepo}:${dockerTag}`];
    const dockerTagTokens = dockerTag.split('.');

    if (dockerTagTokens.length == 3 && dockerTagTokens[0].startsWith('v')) {
      tagNames.push(`docker.io/${dockerUserName}/${dockerRepo}:${[dockerTagTokens[0], dockerTagTokens[1]].join('.')}`);
      tagNames.push(`docker.io/${dockerUserName}/${dockerRepo}:${dockerTagTokens[0]}`);
    }

    let buildArgs = tagNames.reduce(function(acc, curr) {
      acc.push('-t');
      acc.push(curr);

      return acc;
    }, ['build', '.']);


    await exec.exec('docker', buildArgs);
    await exec.exec('docker', ['login', '-u', dockerUserName, '--password-stdin'], {input: dockerToken});

    for (let tagName of tagNames) {
      await exec.exec('docker', ['push', tagName]);
    }

    core.setOutput('images', tagNames.join(','));
  } catch (error) {
    core.setFailed(error.message);
  } finally {
    await exec.exec('docker', ['logout']);
  }
}
