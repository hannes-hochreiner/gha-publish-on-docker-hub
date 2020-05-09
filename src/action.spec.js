import {run} from './action';
import {SequenceSpy} from './sequenceSpy';

describe('Action run', () => {
  it('can create and push a Docker image', async () => {
    await run(new SequenceSpy([
      {name: 'getInput', args: ['docker-user-name'], return: 'dockerUserName'},
      {name: 'getInput', args: ['docker-token'], return: 'dockerToken'},
      {name: 'setOutput', args: ['images', 'dockerUserName/testRepo:master']}
    ]), new SequenceSpy([
      {name: 'exec', args: ['docker', ['build', '.', '-t', 'dockerUserName/testRepo:master']]},
      {name: 'exec', args: ['docker', ['login', '-u', 'dockerUserName', '--password-stdin'], {input: 'dockerToken'}]},
      {name: 'exec', args: ['docker', ['push', 'dockerUserName/testRepo:master']]},
      {name: 'exec', args: ['docker', ['logout']]},
    ]), {
      GITHUB_REF: '1/2/master',
      GITHUB_REPOSITORY: '1/testRepo'
    }, new SequenceSpy([
      {name: 'log', args: ['GITHUB_REF: 1/2/master']},
      {name: 'log', args: ['GITHUB_REPOSITORY: 1/testRepo']}
    ]));
    expect(true).toBe(true);
  });

  it('can create and push a Docker image with multiple tags', async () => {
    await run(new SequenceSpy([
      {name: 'getInput', args: ['docker-user-name'], return: 'dockerUserName'},
      {name: 'getInput', args: ['docker-token'], return: 'dockerToken'},
      {name: 'setOutput', args: ['images', 'dockerUserName/testRepo:v1.2.3,dockerUserName/testRepo:v1.2,dockerUserName/testRepo:v1']}
    ]), new SequenceSpy([
      {name: 'exec', args: ['docker', ['build', '.', '-t', 'dockerUserName/testRepo:v1.2.3', '-t', 'dockerUserName/testRepo:v1.2', '-t', 'dockerUserName/testRepo:v1']]},
      {name: 'exec', args: ['docker', ['login', '-u', 'dockerUserName', '--password-stdin'], {input: 'dockerToken'}]},
      {name: 'exec', args: ['docker', ['push', 'dockerUserName/testRepo:v1.2.3']]},
      {name: 'exec', args: ['docker', ['push', 'dockerUserName/testRepo:v1.2']]},
      {name: 'exec', args: ['docker', ['push', 'dockerUserName/testRepo:v1']]},
      {name: 'exec', args: ['docker', ['logout']]},
    ]), {
      GITHUB_REF: '1/2/v1.2.3',
      GITHUB_REPOSITORY: '1/testRepo'
    }, new SequenceSpy([
      {name: 'log', args: ['GITHUB_REF: 1/2/v1.2.3']},
      {name: 'log', args: ['GITHUB_REPOSITORY: 1/testRepo']}
    ]));
    expect(true).toBe(true);
  });
});
