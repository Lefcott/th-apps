pipeline {
    agent {
          kubernetes {
      label 'teamhub-cypress-worker'
      defaultContainer 'jnlp'
      yaml """
apiVersion: v1
kind: Pod
metadata:
  labels:
    jenkins: "slave"
    jenkins/label: "slave"
spec:
  containers:
  - name: docker
    image: docker:19.03.8
    command:
    - cat
    tty: true
    volumeMounts:
    - mountPath: /var/run/docker.sock
      name: docker-sock
    - mountPath: "/home/jenkins/agent"
      name: "workspace-volume"
      readOnly: false
  - name: cypress-included
    image: cypress/included:7.4.0
    command:
    - cat
    tty: true
    volumeMounts:
    - mountPath: /var/run/docker.sock
      name: docker-sock
    - mountPath: "/home/jenkins/agent"
      name: "workspace-volume"
      readOnly: false
  - name: cypress
    image: cypress/browsers:node14.16.0-chrome89-ff86
    command:
    - cat
    tty: true
    volumeMounts:
    - mountPath: /var/run/docker.sock
      name: docker-sock
    - mountPath: "/home/jenkins/agent"
      name: "workspace-volume"
      readOnly: false
  volumes:
    - name: docker-sock
      hostPath:
        path: /var/run/docker.sock
    - emptyDir:
        medium: ""
      name: "workspace-volume"
"""
    }
  }
    options {
        timeout(time: 30, unit: 'MINUTES')
    }
    stages {
        stage('Install dependencies') {
          steps {
            container("cypress") {
              sh 'npm config set "//registry.npmjs.org/:_authToken" $NPM_TOKEN'
              sh 'npm config set "@fortawesome:registry" https://npm.fontawesome.com/'
              sh 'npm config set "//npm.fontawesome.com/:_authToken" $FONT_AWESOME_NPM_TOKEN'
              sh 'npx lerna bootstrap --scope $PROJECT_NAME --  --production=false --unsafe-perm' // if we don't set that flag, devDependencies won't be installed, so no building!
            }
          }
        }
        stage("Start local server") {
          when { expression { env.ENVIRONMENT == "local" } }
          options { timeout(time: 2, unit: 'MINUTES')} // just in case something goes wrong here, don't want it to hang indefinitely
          steps {
            container("cypress") {
              echo "running"
              sh "npx lerna run start:ci --scope $PROJECT_NAME"
            }
          }
        }
        stage('Run Cypress Tests') {
          environment {
            CYPRESS_RECORD_KEY = credentials("cypress-record-key-${env.PROJECT_NAME}")
            CYPRESS_VIDEO_RECORDING=0
            ENVIRONMENT="${env.ENVIRONMENT}"
          }
          steps {
            slackSend color: 'good', channel: '#cloud_build_notifications', message: "Cypress tests for TH ${env.PROJECT_NAME} have started"
            container('cypress-included') {
              dir("./packages/${env.PROJECT_NAME}") {
                sh "cypress run -c video=true,videoUploadOnPasses=false -b chrome --record --env environment=${env.ENVIRONMENT},ENVIRONMENT=${env.ENVIRONMENT},SLOW=${env.SLOW || true}"
              }
            }
          }
        }
    }
    post {
        fixed {
        slackSend channel: "#cloud_build_notifications", color: 'good', message: ":mostly_sunny: Cypress tests for TH ${env.PROJECT_NAME} completed SUCCESSFULLY on staging"
        }
        success {
        slackSend color: 'good', message: ":sunny: Cypress tests for TH ${env.PROJECT_NAME} completed SUCCESSFULLY on staging"
        }
        failure {
        slackSend color: 'danger', message: ":volcano: Cypress tests for TH ${env.PROJECT_NAME} FAILED on staging"
        }
        aborted {
        slackSend color: 'warning', message: ":ghost: Cypress tests for TH ${env.PROJECT_NAME} ABORTED on staging"
        }
    }
}
