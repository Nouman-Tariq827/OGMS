pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Cloning repository...'
            }
        }

        stage('System Info') {
            steps {
                sh 'pwd'
                sh 'ls -la'
            }
        }

        stage('Done') {
            steps {
                echo 'Pipeline completed successfully!'
            }
        }
    }
}
