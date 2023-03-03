pipeline {
  agent {
    kubernetes {
      label 'teamhub-deploy-app-worker'
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
    image: docker:19.03.7
    command:
    - cat
    tty: true
    volumeMounts:
    - mountPath: /var/run/docker.sock
      name: docker-sock
    - mountPath: "/home/jenkins/agent"
      name: "workspace-volume"
      readOnly: false
  - name: node
    image: node:13
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
  environment {
    NODE_ENV = 'production'
  }
  stages {
    stage('Checkout') {
      steps {
        slackSend channel: "#k4community-deployments", color: 'good', message: "Deploy ${env.PROJECT_NAME} - ${env.K4_ENV}"
        container('docker') {
          script {
            def gitVars = checkout scm
            echo "${gitVars}"
            env.GIT_COMMIT = gitVars.GIT_COMMIT
            echo "${env.GIT_COMMIT}"
          }
        }
      }
    }
    stage('Build') {
      steps {
        container('node') {
          sh'''
            npm config set "//registry.npmjs.org/:_authToken" $NPM_TOKEN
            npm config set "@fortawesome:registry" https://npm.fontawesome.com/
            npm config set "//npm.fontawesome.com/:_authToken" $FONT_AWESOME_NPM_TOKEN
            npx lerna bootstrap --scope $PROJECT_NAME -- --production=false
            npx lerna run build --scope $PROJECT_NAME
            ls packages/ -la
            ls packages/$PROJECT_NAME -la
          '''
        }
      }
    }
    stage('Publish to S3') {
      steps {
        dir("./packages/${env.PROJECT_NAME}") {
          echo "deploying to s3"
          withAWS(region:'us-east-1', credentials: 'jenkins-aws') {
            s3Upload(bucket: "apps${env.K4_ENV == "production" ? '' : "-${env.K4_ENV}" }.k4connect.com", path: "teamhub/${env.PROJECT_NAME}/${GIT_COMMIT}", workingDir:'dist', includePathPattern:'**')
          }
        }
      }
    }
    stage('Extract project name') {
      steps {
        dir("./packages/${env.PROJECT_NAME}") {
          script {
            env.APP_NAME = sh(returnStdout: true, script: '''
            ENTRY_FILE_PATH=$(find ./src -name 'teamhub-*')
            ENTRY_FILE=${ENTRY_FILE_PATH##*/}
            NO_EXT=${ENTRY_FILE%.*}
            echo ${NO_EXT#*-}
          ''').trim()
            env.URL_POSTFIX = sh(returnStdout: true, script: '''
              if [ "$K4_ENV" = "production" ]
              then
                echo ""
              else
                echo "-$K4_ENV"
              fi
            ''').trim()
          }
        }
      }
    }
    stage('Update Import Maps') {
      steps {
        echo "updating import maps"
        sh '''
            curl --location --request PATCH "https://import-map-deployer.k4connect.com/services/?env=$K4_ENV" \
          --header "Authorization: Basic ${IMPORT_MAP_AUTH_TOKEN}" \
          --header "Content-Type: application/json" \
          --data-raw '{
            "service": "@teamhub/'${APP_NAME}'",
            "url": "https://teamhub'${URL_POSTFIX}'.k4connect.com/'${PROJECT_NAME}'/'${GIT_COMMIT}'/teamhub-'${APP_NAME}'.js"
          }'
        '''
        slackSend channel: "#k4community-deployments", color: 'good', message: "${env.PROJECT_NAME} deploy to ${env.K4_ENV} complete"
      }
    }
  }
}
