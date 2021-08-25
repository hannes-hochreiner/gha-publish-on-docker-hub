import {run} from './action';
import {SequenceSpy} from './sequenceSpy';

describe('Action run', () => {
  it('can create and push a Docker image', async () => {
    await run(new SequenceSpy([
      {name: 'getInput', args: ['docker-user-name'], return: 'dockerUserName'},
      {name: 'getInput', args: ['docker-token'], return: 'dockerToken'},
      {name: 'getInput', args: ['docker-targets'], return: null},
      {name: 'setOutput', args: ['images', 'docker.io/dockerUserName/testRepo:master']}
    ]), new SequenceSpy([
      {name: 'exec', args: ['docker', ['build', '.', '-t', 'docker.io/dockerUserName/testRepo:master']]},
      {name: 'exec', args: ['docker', ['login', '-u', 'dockerUserName', '--password-stdin'], {input: 'dockerToken'}]},
      {name: 'exec', args: ['docker', ['push', 'docker.io/dockerUserName/testRepo:master']]},
      {name: 'exec', args: ['docker', ['logout']]},
    ]), {
      GITHUB_REF: '1/2/master',
      GITHUB_REPOSITORY: '1/testRepo'
    }, new SequenceSpy([
      {name: 'log', args: ['GITHUB_REF: 1/2/master']},
      {name: 'log', args: ['GITHUB_REPOSITORY: 1/testRepo']}
    ]));
  });

  it('can create and push a Docker image with multiple tags', async () => {
    await run(new SequenceSpy([
      {name: 'getInput', args: ['docker-user-name'], return: 'dockerUserName'},
      {name: 'getInput', args: ['docker-token'], return: 'dockerToken'},
      {name: 'getInput', args: ['docker-targets'], return: ''},
      {name: 'setOutput', args: ['images', 'docker.io/dockerUserName/testRepo:v1.2.3,docker.io/dockerUserName/testRepo:v1.2,docker.io/dockerUserName/testRepo:v1']}
    ]), new SequenceSpy([
      {name: 'exec', args: ['docker', ['build', '.', '-t', 'docker.io/dockerUserName/testRepo:v1.2.3', '-t', 'docker.io/dockerUserName/testRepo:v1.2', '-t', 'docker.io/dockerUserName/testRepo:v1']]},
      {name: 'exec', args: ['docker', ['login', '-u', 'dockerUserName', '--password-stdin'], {input: 'dockerToken'}]},
      {name: 'exec', args: ['docker', ['push', 'docker.io/dockerUserName/testRepo:v1.2.3']]},
      {name: 'exec', args: ['docker', ['push', 'docker.io/dockerUserName/testRepo:v1.2']]},
      {name: 'exec', args: ['docker', ['push', 'docker.io/dockerUserName/testRepo:v1']]},
      {name: 'exec', args: ['docker', ['logout']]},
    ]), {
      GITHUB_REF: '1/2/v1.2.3',
      GITHUB_REPOSITORY: '1/testRepo'
    }, new SequenceSpy([
      {name: 'log', args: ['GITHUB_REF: 1/2/v1.2.3']},
      {name: 'log', args: ['GITHUB_REPOSITORY: 1/testRepo']}
    ]));
  });

  it('can create and push a Docker image with multiple tags and targets', async () => {
    await run(new SequenceSpy([
      {name: 'getInput', args: ['docker-user-name'], return: 'dockerUserName'},
      {name: 'getInput', args: ['docker-token'], return: 'dockerToken'},
      {name: 'getInput', args: ['docker-targets'], return: 'target1, target2'},
      {name: 'setOutput', args: ['images', 'docker.io/dockerUserName/testRepo:v1.2.3-target1,docker.io/dockerUserName/testRepo:v1.2-target1,docker.io/dockerUserName/testRepo:v1-target1,docker.io/dockerUserName/testRepo:v1.2.3-target2,docker.io/dockerUserName/testRepo:v1.2-target2,docker.io/dockerUserName/testRepo:v1-target2']}
    ]), new SequenceSpy([
      {name: 'exec', args: ['docker', ['build', '.', '-t', 'docker.io/dockerUserName/testRepo:v1.2.3-target1', '-t', 'docker.io/dockerUserName/testRepo:v1.2-target1', '-t', 'docker.io/dockerUserName/testRepo:v1-target1', '--target', 'target1']]},
      {name: 'exec', args: ['docker', ['build', '.', '-t', 'docker.io/dockerUserName/testRepo:v1.2.3-target2', '-t', 'docker.io/dockerUserName/testRepo:v1.2-target2', '-t', 'docker.io/dockerUserName/testRepo:v1-target2', '--target', 'target2']]},
      {name: 'exec', args: ['docker', ['login', '-u', 'dockerUserName', '--password-stdin'], {input: 'dockerToken'}]},
      {name: 'exec', args: ['docker', ['push', 'docker.io/dockerUserName/testRepo:v1.2.3-target1']]},
      {name: 'exec', args: ['docker', ['push', 'docker.io/dockerUserName/testRepo:v1.2-target1']]},
      {name: 'exec', args: ['docker', ['push', 'docker.io/dockerUserName/testRepo:v1-target1']]},
      {name: 'exec', args: ['docker', ['push', 'docker.io/dockerUserName/testRepo:v1.2.3-target2']]},
      {name: 'exec', args: ['docker', ['push', 'docker.io/dockerUserName/testRepo:v1.2-target2']]},
      {name: 'exec', args: ['docker', ['push', 'docker.io/dockerUserName/testRepo:v1-target2']]},
      {name: 'exec', args: ['docker', ['logout']]},
    ]), {
      GITHUB_REF: '1/2/v1.2.3',
      GITHUB_REPOSITORY: '1/testRepo'
    }, new SequenceSpy([
      {name: 'log', args: ['GITHUB_REF: 1/2/v1.2.3']},
      {name: 'log', args: ['GITHUB_REPOSITORY: 1/testRepo']}
    ]));
  });
});
