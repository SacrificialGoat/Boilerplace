#!/bin/bash

##############################################
######### SETUP
##############################################

if ! command -v git >/dev/null 2>&1; then
  echo "INSTALL GIT"
  apt-get -y install git
fi

if ! command -v hg >/dev/null 2>&1; then
  echo "INSTALL MERCURIAL"
  apt-get -y install mercurial
fi

###############################################
######### BUILD STEPS
###############################################

if ! command -v go >/dev/null 2>&1; then
  echo "INSTALLING GO"
  cd /tmp/
  wget -q https://storage.googleapis.com/golang/go1.4.2.linux-amd64.tar.gz
  tar -C /usr/local -xzf go1.4.2.linux-amd64.tar.gz
  ln -s /usr/local/go/bin/go /usr/bin/go
  mkdir -p /go/src/github.com/my_github_user
  ln -s /srv/projects/my_project/ /go/src/github.com/my_github_user/my_project
  GOPATH=/go/ go get github.com/tools/godep
  GOPATH=/go/ go get github.com/onsi/ginkgo/ginkgo
  GOPATH=/go/ go get github.com/onsi/gomega

  cd /go/src/github.com/my_github_user/my_project
  GOPATH=/go/ /go/bin/godep restore

  # Helps when ssh'ing into the box
  echo "export PATH=$PATH:/go/bin" >> /home/vagrant/.bashrc
  echo "export GOPATH=/go/" >> /home/vagrant/.bashrc
  echo "cd /go/src/github.com/my_github_user/my_project" >> /home/vagrant/.bashrc
  echo "sudo su" >> /home/vagrant/.bashrc

  echo "export PATH=$PATH:/go/bin" >> /root/.bashrc
  echo "export GOPATH=/go/" >> /root/.bashrc
  echo "cd /go/src/github.com/my_github_user/my_project" >> /root/.bashrc
fi

echo "BUILDING PROJECT"
cd /go/src/github.com/my_github_user/my_project
GOPATH=/go/ /go/bin/godep go build

###############################################
######### RUN
###############################################

echo "RUNNING PROJECT"
# PUT YOUR RUN COMMAND HERE