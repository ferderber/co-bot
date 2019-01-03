workflow "Build, Tag, Publish" {
  on = "push"
  resolves = ["Push Image"]
}

action "Build" {
  uses = "actions/docker/cli@master"
  args = "build -t cobot ."
}

action "Tag Image" {
  needs = [ "Build" ]
  uses = "actions/docker/tag@master"
  env = {
    IMAGE_NAME = "cobot"
  }
  args = ["$IMAGE_NAME", "base"]
}

action "Login To Docker" {
  needs = ["Build"]
  uses = "actions/docker/login@master"
  secrets = ["DOCKER_USERNAME", "DOCKER_PASSWORD"]
}

action "Push Image" {
  needs = ["Tag Image", "Login To Docker"]
  uses = "actions/docker/push@master"
  args = "push"
}