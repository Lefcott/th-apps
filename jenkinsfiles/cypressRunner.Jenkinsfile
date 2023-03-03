// This file is responsible primarily for orchestrating individual runs of each micro
pipeline {
  agent {
    kubernetes {
      label 'teamhub-cypress-test-runner-worker'
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
  stages {
    stage('Staff Directory') {
      steps {
        slackSend color: 'good', channel: '#ce-cypress-notifications', message: "Running Tests for Staff Directory"
        build job: 'teamhub-staging-tests',
          propagate: false,
          wait: true,
          parameters: [
            [$class: 'StringParameterValue', name: 'PROJECT_NAME', value: "staff-directory"],
            [$class: 'StringParameterValue', name: 'ENVIRONMENT', value: "staging"],
          ]
      }
    }
    stage('Content Library') {
      steps {
        slackSend color: 'good', channel: '#ce-cypress-notifications', message: "Running Tests for Content Library"
        build job: 'teamhub-staging-tests',
          propagate: false,
          wait: true,
          parameters: [
            [$class: 'StringParameterValue', name: 'PROJECT_NAME', value: "content-library"],
            [$class: 'StringParameterValue', name: 'ENVIRONMENT', value: "staging"],
          ]
      }
    }
    stage('Content Creator') {
      steps {
        slackSend color: 'good', channel: '#ce-cypress-notifications', message: "Running Tests for Content Creator"
        build job: 'teamhub-staging-tests',
          propagate: false,
          wait: true,
          parameters: [
            [$class: 'StringParameterValue', name: 'PROJECT_NAME', value: "content-creator"],
            [$class: 'StringParameterValue', name: 'ENVIRONMENT', value: "staging"],
          ]
      }
    }
    stage('Post Manager') {
      steps {
        slackSend color: 'good', channel: '#ce-cypress-notifications', message: "Running Tests for Post Manager"
        build job: 'teamhub-staging-tests',
          propagate: false,
          wait: true,
          parameters: [
            [$class: 'StringParameterValue', name: 'PROJECT_NAME', value: "app-content"],
            [$class: 'StringParameterValue', name: 'ENVIRONMENT', value: "staging"],
            [$class: 'BooleanParameterValue', name: 'SLOW', value: true],
          ]
      }
    }
    stage('Event Management') {
      steps {
        slackSend color: 'good', channel: '#ce-cypress-notifications', message: "Running Tests for Event Management"
        build job: 'teamhub-staging-tests',
          propagate: false,
          wait: true,
          parameters: [
            [$class: 'StringParameterValue', name: 'PROJECT_NAME', value: "event-management"],
            [$class: 'StringParameterValue', name: 'ENVIRONMENT', value: "staging"],
          ]
      }
    }
    stage('Resident Directory') {
      steps {
        slackSend color: 'good', channel: '#ce-cypress-notifications', message: "Running Tests for Resident Directory"
        build job: 'teamhub-staging-tests',
          propagate: false,
          wait: true,
          parameters: [
            [$class: 'StringParameterValue', name: 'PROJECT_NAME', value: "resident-directory"],
            [$class: 'StringParameterValue', name: 'ENVIRONMENT', value: "staging"],
          ]
      }
    }
    stage('Resident Check-In') {
      steps {
        slackSend color: 'good', channel: '#ce-cypress-notifications', message: "Running Tests for Resident Check-in UI"
        build job: 'teamhub-staging-tests',
          propagate: false,
          wait: true,
          parameters: [
            [$class: 'StringParameterValue', name: 'PROJECT_NAME', value: "resident-check-in-ui"],
            [$class: 'StringParameterValue', name: 'ENVIRONMENT', value: "staging"],
          ]
      }
    }
    stage('Digital Signage Manager') {
      steps {
        slackSend color: 'good', channel: '#ce-cypress-notifications', message: "Running Tests for DSM"
        build job: 'teamhub-staging-tests',
          propagate: false,
          wait: true,
          parameters: [
            [$class: 'StringParameterValue', name: 'PROJECT_NAME', value: "digital-signage"],
            [$class: 'StringParameterValue', name: 'ENVIRONMENT', value: "staging"],
          ]
      }
    }
    stage('Device Alerts UI') {
      steps {
        slackSend color: 'good', channel: '#ce-cypress-notifications', message: "Running Tests for Device Alerts UI"
        build job: 'teamhub-staging-tests',
          propagate: false,
          wait: true,
          parameters: [
            [$class: 'StringParameterValue', name: 'PROJECT_NAME', value: "device-alerts"],
            [$class: 'StringParameterValue', name: 'ENVIRONMENT', value: "staging"],
          ]
      }
    }
    stage('Dining') {
      steps {
        slackSend color: 'good', channel: '#ce-cypress-notifications', message: "Running Tests for Dining"
        build job: 'teamhub-staging-tests',
          propagate: false,
          wait: true,
          parameters: [
            [$class: 'StringParameterValue', name: 'PROJECT_NAME', value: "dining"],
            [$class: 'StringParameterValue', name: 'ENVIRONMENT', value: "staging"],
          ]
      }
    }
  }
}
