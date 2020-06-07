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
  args = ["cobot", "matthewferderber/co-bot"]
}

action "Login to Docker" {
  uses = "actions/docker/login@master"
  secrets = ["DOCKER_USERNAME", "DOCKER_PASSWORD"]
}

action "Push Image" {
  needs = ["Tag Image", "Login to Docker"]
  uses = "actions/docker/cli@master"
  args = ["push", "matthewferderber/co-bot"]
}