workflow "Lint, Build, Deploy" {
  on = "push"
  resolves = ["Build"]
}

action "Lint" {
  uses = "matthewferderber/co-bot/scripts@master"
  runs = "lint.sh"
}

action "Build" {
  uses = "actions/docker/cli@76ff57a"
  needs = ["Lint"]
  args = "build -t cobot ."
}