/* eslint-disable no-undef */
/* eslint-disable no-redeclare */
/* eslint-disable no-useless-concat */
/* eslint-disable block-scoped-var */
/* eslint-disable no-template-curly-in-string */
/* eslint-disable spaced-comment */
/* eslint-disable camelcase */
/* eslint-disable capitalized-comments */
"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
// const path = require("path");
// const mkdirp = require("mkdirp");

// function makeProjectName(name) {
//   name = _.kebabCase(name);
//   return name;
// }

function get_landscape_api(so_far) {
  //return JSON.stringify(so_far);
  var retstr =
    "https://api.cf." + so_far.deploy_landscape + ".hana.ondemand.com";
  //var existing_default = so_far.defaults.deploy_dnsdomain;
  //if (existing_default.substr(0,6) != "cfapps") {
  //  retstr = existing_default;
  //}
  return retstr;
}

module.exports = class extends Generator {
  initializing() {
    this.props = {};
    this.answers = {};
    this.config.defaults({
      project_name: this.appname,
      piper_library: "piper-library-os-acl",
      github_creds: "GITHUBALUNDESAP",
      build_image: "alunde/mbtci:latest",
      deploy_landscape: "us10",
      cf_deploy_api: "https://api.cf.<landscape>.hana.ondemand.com",
      cf_deploy_creds: "CF_CREDENTIALSID",
      cf_deploy_org: "ConcileTime",
      cf_deploy_space: "dev",
      deploy_image: "ppiper/cf-cli:latest",
      deploy_params: "-f",
      slack_creds: "SLACKSECRET",
      slack_channel: "#jenkins_builds"
    });
  }

  async prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the awesome ${chalk.red(
          "generator-sap-a-team-mta-base"
        )} generator!`
      )
    );

    // const prompts = [
    //   {
    //     type: "confirm",
    //     name: "someAnswer",
    //     message: "Would you like to enable this option?",
    //     default: true
    //   }
    // ];

    /*
    Return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
	  */

    this.answers = await this.prompt([
      {
        type: "input",
        name: "project_name",
        message:
          "Enter your project folder name (default for existing project).",
        default: this.config.get("project_name") // Default to current folder name
      },
      {
        type: "input",
        name: "piper_library",
        message: "Confirm your Jenkins configured piper library name.",
        default: this.config.get("piper_library")
      },
      {
        type: "input",
        name: "github_creds",
        message: "Jenkins defined credentialID for GitHub.",
        default: this.config.get("github_creds")
      },
      {
        type: "input",
        name: "build_image",
        message: "Confirm the Docker image used in the build phase.",
        default: this.config.get("build_image")
      },
      {
        type: "list",
        name: "deploy_landscape",
        message: "SAP Cloud Foundry Landscape you will deploy into.",
        choices: [
          { name: "US East (VA) AWS + trial = us10", value: "us10" },
          { name: "US West (WA) Azu = us20", value: "us20" },
          { name: "US Central (IA) GCP = us30", value: "us30" },
          { name: "Europe (Frankfurt) AWS + trial = eu10", value: "eu10" },
          { name: "Europe (Netherlands) Azu = eu20", value: "eu20" },
          { name: "Japan (Tokyo) AWS = jp10", value: "jp10" },
          { name: "Japan (Tokyo) Azu = jp20", value: "jp20" },
          { name: "Brazil (São Paulo) AWS = br10", value: "br10" },
          { name: "Australia (Sydney) AWS = ap10", value: "ap10" },
          { name: "Canada (Montreal) AWS = ca10", value: "ca10" },
          { name: "Singapore AWS = ap11", value: "ap11" }
        ],
        default: this.config.get("deploy_landscape")
      },
      {
        type: "input",
        name: "cf_deploy_api",
        // prefix: "Make sure that you are logged into the Cloud Foundry landscape before deploying.\n",
        message: "Cloud Platform API endpoint.",
        default: get_landscape_api
      },
      {
        type: "input",
        name: "cf_deploy_creds",
        message: "Jenkins defined credentialID for SAP Cloud Foundry.",
        default: this.config.get("cf_deploy_creds")
      },
      {
        type: "input",
        name: "cf_deploy_org",
        message: "SAP Cloud Foundry Organization you will deploy into.",
        default: this.config.get("cf_deploy_org")
      },
      {
        type: "input",
        name: "cf_deploy_space",
        message: "SAP Cloud Foundry Space you will deploy into.",
        default: this.config.get("cf_deploy_space")
      },
      {
        type: "input",
        name: "deploy_image",
        message: "Confirm the Docker image used in the deploy phase.",
        default: this.config.get("deploy_image")
      },
      {
        type: "input",
        name: "deploy_params",
        message:
          "Confirm the deploy parameters(-e for merging with an mtaext).",
        default: this.config.get("deploy_params")
      },
      {
        type: "input",
        name: "slack_creds",
        message: "Jenkins defined credentialID for Slack.",
        default: this.config.get("slack_creds")
      },
      {
        type: "input",
        name: "slack_channel",
        message: "Slack channel for deploy notifications.",
        default: this.config.get("slack_channel")
      }
    ]);
  }

  default() {}

  writing() {
    this.config.set("project_name", this.answers.project_name);
    this.config.set("piper_library", this.answers.piper_library);
    this.config.set("github_creds", this.answers.github_creds);
    this.config.set("build_image", this.answers.build_image);
    this.config.set("deploy_landscape", this.answers.deploy_landscape);
    this.config.set("cf_deploy_api", this.answers.cf_deploy_api);
    this.config.set("cf_deploy_creds", this.answers.cf_deploy_creds);
    this.config.set("cf_deploy_org", this.answers.cf_deploy_org);
    this.config.set("cf_deploy_space", this.answers.cf_deploy_space);
    this.config.set("deploy_image", this.answers.deploy_image);
    this.config.set("deploy_params", this.answers.deploy_params);
    this.config.set("slack_creds", this.answers.slack_creds);
    this.config.set("slack_channel", this.answers.slack_channel);

    this.config.save();

    // this.fs.copy(this.templatePath('.gitignore'), this.destinationPath('.gitignore'));

    var subs = {
      project_name: this.answers.project_name,
      piper_library: this.answers.piper_library,
      github_creds: this.answers.github_creds,
      build_image: this.answers.build_image,
      deploy_landscape: this.answers.deploy_landscape,
      cf_deploy_api: this.answers.cf_deploy_api,
      cf_deploy_creds: this.answers.cf_deploy_creds,
      cf_deploy_org: this.answers.cf_deploy_org,
      cf_deploy_space: this.answers.cf_deploy_space,
      deploy_image: this.answers.deploy_image,
      deploy_params: this.answers.deploy_params,
      slack_creds: this.answers.slack_creds,
      slack_channel: this.answers.slack_channel
    };

    this.fs.copyTpl(
      this.templatePath("Jenkinsfile"),
      this.destinationPath("Jenkinsfile"),
      subs
    );

    this.fs.copyTpl(
      this.templatePath(".pipeline/config.yml"),
      this.destinationPath(".pipeline/config.yml"),
      subs
    );
  }

  install() {
    // This.installDependencies();
  }

  end() {
    this.log(`Your project is now ready for Jenkins.`);
  }
};
