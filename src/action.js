export async function run(core, exec, env, logger) {
  try {
    const dockerUserName = core.getInput('docker-user-name');
    const dockerToken = core.getInput('docker-token');
    const dockerTargets = core.getInput('docker-targets') || '';
    const dockerTag = env.GITHUB_REF.split('/')[2];
    const dockerRepo = env.GITHUB_REPOSITORY.split('/')[1];

    logger.log(`GITHUB_REF: ${env.GITHUB_REF}`);
    logger.log(`GITHUB_REPOSITORY: ${env.GITHUB_REPOSITORY}`);

    const dockerTagTokens = dockerTag.split('.');
    const targets = dockerTargets.split(',');
    
    let tagList = [];

    for (let targetIdx in targets) {
      let targetName = targets[targetIdx].trim();
      let targetExt = `-${targetName}`;
      
      if (targetExt == '-') {
        targetExt = '';
      }
      
      let tagNames = [`docker.io/${dockerUserName}/${dockerRepo}:${dockerTag}${targetExt}`];

      if (dockerTagTokens.length == 3 && dockerTagTokens[0].startsWith('v')) {
        tagNames.push(`docker.io/${dockerUserName}/${dockerRepo}:${[dockerTagTokens[0], dockerTagTokens[1]].join('.')}${targetExt}`);
        tagNames.push(`docker.io/${dockerUserName}/${dockerRepo}:${dockerTagTokens[0]}${targetExt}`);
      }
  
      tagList = tagList.concat(tagNames);

      let buildArgs = tagNames.reduce(function(acc, curr) {
        acc.push('-t');
        acc.push(curr);
  
        return acc;
      }, ['build', '.']);
  
      if (targetName != '') {
        buildArgs.push('--target');
        buildArgs.push(targetName);
      }

      await exec.exec('docker', buildArgs);
    }

    await exec.exec('docker', ['login', '-u', dockerUserName, '--password-stdin'], {input: dockerToken});

    for (let tagName of tagList) {
      await exec.exec('docker', ['push', tagName]);
    }

    core.setOutput('images', tagList.join(','));
  } catch (error) {
    console.log(error);
    core.setFailed(error.message);
  } finally {
    await exec.exec('docker', ['logout']);
  }
}
