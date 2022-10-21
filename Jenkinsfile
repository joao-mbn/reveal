@Library('jenkins-helpers') _

static final String PR_COMMENT_MARKER = "🚀[pr-server]\n"
static final String SLACK_ALERTS_CHANNEL = "#datastudio-logs"
// deploySpinnakerPipelineConfigs {}
static final String APP_ID = 'cdf-context-ui-pnid'
static final String APPLICATION_REPO_ID = 'cdf-ui-interactive-diagrams'
static final String NODE_VERSION = 'node:14'
static final String VERSIONING_STRATEGY = "single-branch"
static final String SENTRY_PROJECT_NAME = "watchtower"
static final String SENTRY_DSN = "https://d09f6d3557114e6cbaa63b56d7ef86cc@o124058.ingest.sentry.io/1288725"
static final String LOCIZE_PROJECT_ID = "0774e318-387b-4e68-94cc-7b270321bbf1" // not used


def pods = { body ->
  yarn.pod(nodeVersion: NODE_VERSION) {
    previewServer.pod(nodeVersion: NODE_VERSION) {
      fas.pod(
        nodeVersion: NODE_VERSION,
        sentryProjectName: SENTRY_PROJECT_NAME,
        sentryDsn: SENTRY_DSN,
        locizeProjectId: LOCIZE_PROJECT_ID
      ) {
        // This enables codecov for the repo. If this fails to start, then
        // do the following:
        //  1. Obtain a token by going to:
        //     https://codecov.io/gh/cognitedata/YOUR-REPO-HERE
        //  2. Create a PR similar to:
        //     https://github.com/cognitedata/terraform/pull/1923
        //  3. Get that PR approved, applied, and merged
        //
        // If you don't want codecoverage, then you can just remove this.
        testcafe.pod() {
          properties([])
          node(POD_LABEL) {
            body()
          }
        }
      }
    }
  }
}

pods {
  def gitCommit
  def gitAuthor
  def getTitle

  def isPullRequest = !!env.CHANGE_ID
  def isRelease = env.BRANCH_NAME == 'master' || env.BRANCH_NAME.contains("release-");
  def bucketBundles = "cdf-hub-bundles"

  def context_checkout = "continuous-integration/jenkins/checkout"
  def context_install = "continuous-integration/jenkins/install"
  def context_setup = "continuous-integration/jenkins/setup"
  def context_lint = "continuous-integration/jenkins/lint"
  def context_test = "continuous-integration/jenkins/test"
  def context_unitTests = "continuous-integration/jenkins/unit-tests"
  def context_buildPrPreview = "continuous-integration/jenkins/build-pr-preview"
  def context_build_fas = "continuous-integration/jenkins/build-fas"
  def context_build = "continuous-integration/jenkins/build"
  def context_deploy_app = "continuous-integration/jenkins/deploy-app"
  def context_publishRelease = "continuous-integration/jenkins/publish-release"

  static final Map<String, Boolean> version = versioning.getEnv(
    versioningStrategy: VERSIONING_STRATEGY
  )

  dir('main') {
    stage("Checkout code") {
      checkout(scm)
      gitCommit = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
      gitTitle = sh(returnStdout: true, script: "git show -s --format='%s' HEAD").trim()
      gitAuthor = sh(returnStdout: true, script: "git show -s --format='%ae' HEAD").trim()
    }

    githubNotifyWrapper(context_install) {
      stage('Install dependencies') {
        yarn.setup()
      }
    }

    parallel(
      'Lint': {
        container('fas') {
          stageWithNotify('Lint') {
            sh("yarn lint")
          }
        }
      },
      'Test': {
        container('fas') {
          stageWithNotify('Unit tests') {
            sh("yarn test")
          }
        }
      },
      'Preview': {
        if(!isPullRequest) {
          print "No PR previews for release builds"
          return;
        }
        stageWithNotify('Build and deploy PR') {
          def package_name = "@cognite/cdf-context-ui-pnid";
          def prefix = jenkinsHelpersUtil.determineRepoName();
          def domain = "fusion-preview";
          previewServer(
            buildCommand: 'yarn build',
            buildFolder: 'build',
            prefix: prefix,
            repo: domain
          )
          deleteComments("[FUSION_PREVIEW_URL]")
          def url = "https://fusion-pr-preview.cogniteapp.com/?externalOverride=${package_name}&overrideUrl=https://${prefix}-${env.CHANGE_ID}.${domain}.preview.cogniteapp.com/index.js";
          pullRequest.comment("[FUSION_PREVIEW_URL] [$url]($url)");
        }
      },
      'Build': {
        if (isPullRequest) {
          println "Skipping build for pull requests"
          return
        }
        stageWithNotify('Build for FAS') {
          fas.build(
            appId: APP_ID,
            repo: APPLICATION_REPO_ID,
            buildCommand: 'yarn build',
            shouldPublishSourceMap: false
          )
        }
      },
    )

    if (isRelease) {
      stageWithNotify('Deploy to FAS') {
        fas.publish(
          shouldPublishSourceMap: false
        )
      }
    }
  }
}

