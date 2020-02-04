"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const path = require("path");
const mkdirp = require("mkdirp");

function makeProjectName(name) {
  name = _.kebabCase(name);
  return name;
}

function suggest_router_name(so_far) { 
  //return JSON.stringify(so_far);
  var retstr = "";
  
  retstr += so_far.app_name + "-web";
  
  return retstr;
}

function suggest_uaa_res_name(so_far) { 
  //return JSON.stringify(so_far);
  var retstr = "";
  
  retstr += so_far.app_name + "-uaa";
  
  return retstr;
}

function suggest_uaa_svc_name(so_far) { 
  //return JSON.stringify(so_far);
  var retstr = "";
  
  retstr += so_far.app_name.toUpperCase() + "_UAA";
  
  return retstr;
}

module.exports = class extends Generator {
  initializing() {
    this.props = {};
    this.answers = {};
    this.config.defaults({
      project_name: this.appname,
      app_name: "app",
      app_desc: "App Description",
      router_name: "web",
      router_dir: "web",
      uaa_res_name: "app-uaa",
      uaa_svc_name: "APP_UAA"
    });
  }

  async prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the awesome ${chalk.red(
          "SAP A-Team MTA"
        )} generator!`
      )
    );

    this.log(`Add Jenkins support with "yo sap-a-team-mta:jenkins"`);
    this.log(`Add a HDB-style HDI container with "yo sap-a-team-mta:db-hdb"`);
    this.log(`Add a CAP-style HDI container with "yo sap-a-team-cap:db-hdb"`);
    this.log(`Add a HANA SecureStore with "yo sap-a-team-cap:db-ss"`);
    this.log(`Add a NodeJS based module with "yo sap-a-team-mta:module-nodejs"`);
    this.log(`Add a Java based module with "yo sap-a-team-mta:module-java"`);
    this.log(`Add a Python based module with "yo sap-a-team-mta:module-python"`);
    this.log(`Add a Docker based module with "yo sap-a-team-mta:module-docker"`);

    const prompts = [
      {
        type: "confirm",
        name: "someAnswer",
        message: "Would you like to enable this option?",
        default: true
      }
    ];

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
          "Enter your project folder name (will be created if necessary).",
        default: this.config.get("project_name") // Default to current folder name
      },
      {
        type: "input",
        name: "app_name",
        message: "Enter your project application name.",
        default: this.config.get("app_name") // Default to current folder name
      },
      {
        type: "input",
        name: "app_desc",
        message: "Enter your project application description.",
        default: this.config.get("app_desc") // Default to current folder name
      },
      {
        type: "input",
        name: "router_name",
        message: "Application router name.",
        default: suggest_router_name
      },
      {
        type: "input",
        name: "router_dir",
        message: "Application router path",
        default: this.config.get("router_dir")
      },
      {
        type: "input",
        name: "uaa_res_name",
        message: "UAA resource name",
        default: suggest_uaa_res_name
      },
      {
        type: "input",
        name: "uaa_svc_name",
        message: "UAA service name",
        default: suggest_uaa_svc_name
      }

    ]);
  }

  default() {
    if (path.basename(this.destinationPath()) !== this.answers.project_name) {
      this.log(
        `Your project must be inside a folder named ${this.answers.project_name}\nI'll automatically create this folder.  Change into it with "cd ${this.answers.project_name}"`
      );
      mkdirp(this.answers.project_name);
      this.destinationRoot(this.destinationPath(this.answers.project_name));
    }
  }

  writing() {
    this.config.set("project_name", this.answers.project_name);
    this.config.set("app_name", this.answers.app_name);
    this.config.set("app_desc", this.answers.app_desc);

    this.config.set("router_name", this.answers.router_name);
    this.config.set("router_dir", this.answers.router_dir);

    this.config.set("uaa_res_name", this.answers.uaa_res_name);
    this.config.set("uaa_svc_name", this.answers.uaa_svc_name);

    this.config.save();

    // this.fs.copy(this.templatePath('.gitignore'), this.destinationPath('.gitignore'));

    var subs = {
      project_name: this.answers.project_name,
      app_name: this.answers.app_name,
      app_desc: this.answers.app_desc,
      router_name: this.answers.router_name,
      router_dir: this.answers.router_dir,
      uaa_res_name: this.answers.uaa_res_name,
      uaa_svc_name: this.answers.uaa_svc_name
    };

    this.fs.copyTpl(this.templatePath('README.md'),this.destinationPath('README.md'),subs);
    
    this.fs.copy(this.templatePath('.gitignore'),this.destinationPath('.gitignore'));

    this.fs.copyTpl(this.templatePath('mta.yaml'),this.destinationPath('mta.yaml'),subs);

    this.fs.copy( this.templatePath('web/package.json'), this.destinationPath(this.answers.router_dir + '/package.json'));
    this.fs.copy( this.templatePath('web/xs-app.json'), this.destinationPath(this.answers.router_dir + '/xs-app.json'));
    this.fs.copyTpl(this.templatePath('web/resources/index.html'),this.destinationPath(this.answers.router_dir + '/resources/index.html'),subs);

    this.fs.copy(this.templatePath('web/resources/favicon.ico'),this.destinationPath(this.answers.router_dir + '/resources/favicon.ico'));

    this.fs.copyTpl(this.templatePath('xs-security.json'),this.destinationPath('xs-security.json'),subs);

  }

  install() {
    // This.installDependencies();
  }

  end() {
    this.log(`Add Jenkins support with "yo sap-a-team-mta:jenkins"`);
    this.log(`Add a HDB-style HDI container with "yo sap-a-team-mta:db-hdb"`);
    this.log(`Add a CAP-style HDI container with "yo sap-a-team-cap:db-hdb"`);
    this.log(`Add a HANA SecureStore with "yo sap-a-team-cap:db-ss"`);
    this.log(`Add a NodeJS based module with "yo sap-a-team-mta:module-nodejs"`);
    this.log(`Add a Java based module with "yo sap-a-team-mta:module-java"`);
    this.log(`Add a Python based module with "yo sap-a-team-mta:module-python"`);
    this.log(`Add a Docker based module with "yo sap-a-team-mta:module-docker"`);
    this.log(`\nYour project is ready.  Change into it with "cd ${this.answers.project_name}"`);
    this.log(`Build+Deploy : "cd ${this.answers.project_name} ; mkdir -p target ; mbt build -p=cf -t=target --mtar=${this.answers.project_name}.mtar ; cf deploy target/${this.answers.project_name}.mtar -f"`);
    this.log(`UnDeploy : "cf undeploy ${this.answers.app_name} -f --delete-services"`);
  }
};
