# GitHub Action: Publish on Docker Hub
A GitHub action that builds a Docker image based on the Dockerfile in the repository and publishes it to Docker Hub.
The image is tagged with the user name and the name of the branch.
If the commit is tagged, the image is tagged with the commit tag.
If the tag is a version number in the form "vX.Y.Z", the three tags "vX", "vX.Y", and "vX.Y.Z" are created and pushed to Docker Hub.
If targets are specified, only the targets are built.
The images resulting from the targets are tagged as described above with a suffix of a dash and the target name (e.g. "-target1").

## Inputs
  * docker-user-name: Docker user name
  * docker-token: Docker token
  * docker-targets: comma-separated list of targets to build (optional)

## Outputs
  * images: A comma-separated list of images that were published

## Example
```yml
name: CI
on: [push]

jobs:
  publish:
    name: Publish to Docker
    needs: test
    runs-on: ubuntu-latest
    steps:
    - name: Checkout repo
      uses: actions/checkout@v2
    - name: Create image and publish it to Docker Hub
      uses: hannes-hochreiner/gha-publish-on-docker-hub@v1.5.0
      with:
        docker-user-name: ${{ secrets.DOCKER_USER }}
        docker-token: ${{ secrets.DOCKER_TOKEN }}
        docker-targets: target1, target2
```
