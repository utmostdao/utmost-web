@Library('common-lib') _

def builder = new com.abm.cicd.front.web.build()
def yamlFile = builder.get_web_node_yaml()

pipeline {
  environment {
    DING_DING_ROBOT = 'iotmatrix'

    K8S_SVC_NAME = 'web-utmost-swap'
    IMAGE_NAME = 'web-utmost-swap'

    PROD_WEB_URL = 'https://app.utmost.finance'
    TEST_WEB_URL = 'https://test.utmost.finance:30443'

    OUT_PUT_PATH = 'dist'

    BASE_REPO = 'registry.cn-hangzhou.aliyuncs.com/abmatrix'

    BUILD_PATH = '/web-docker/web'
  }

  agent {
    kubernetes {
      yaml yamlFile
    }
  }

  parameters {
    booleanParam(name: 'isFull', defaultValue: false, description: '是否需要清理 node_modules 进行编译')
  }

  stages {
    stage('编译') {
      steps {
        container('node') {
          script {
            def envCmd
            if (env.BRANCH_NAME ==~ /(.*master.*)|(.*main.*)/) {
              envCmd = 'cp .env.production .env'
            } else {
              envCmd = 'cp .env.preview .env'
            }
            withCredentials([usernamePassword(credentialsId: 'github_chanson', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
              def echoCmd = "echo \"//npm.pkg.github.com/:_authToken=" + env.GIT_PASSWORD + "\" >> .npmrc"
              builder.build_web_node_yarn_package_custom(echoCmd, 'yarn --registry https://registry.npmmirror.com', envCmd, 'yarn build && yarn generate')
            }
          }
        }
      }
    }

    stage('构建镜像') {
      environment {
        ABM_REGISTRY = credentials('c5425e91-91d8-4084-8011-82c6497cd40a')
      }
      steps {
        container('image-builder') {
          script {
            builder.build_push_web_package_image()
          }
        }
      }
    }

    stage('部署更新服务') {
      environment {
        K8S_MASTER_IP = credentials('jiaxing-prod-k8s-master-ip')
        K8S_MASTER = credentials('jiaxing-prod-k8s-auth')
        // K8S_MASTER_IP = credentials('jiaxing-k8s-master-ip')
        // K8S_MASTER = credentials('381816aa-abe9-4a66-8842-5f141dff42b4')
      }

      steps {
        container('sshpass') {
          script {
            builder.deploy_web_package_image()
          }
        }
      }
    }
  }

  post {
    success {
      wrap([$class: 'BuildUser']) {
        script {
          builder.post_success_dingding_web_cicd_rst()
        }
      }
    }

    failure {
      wrap([$class: 'BuildUser']) {
        script {
          builder.post_failure_dingding_web_cicd_rst()
        }
      }
    }
  }
}
