/* eslint-disable prettier/prettier */
/* eslint-disable no-redeclare */
/* eslint-disable no-useless-concat */
/* eslint-disable block-scoped-var */
/* eslint-disable no-template-curly-in-string */
/* eslint-disable spaced-comment */
/* eslint-disable camelcase */
/* eslint-disable capitalized-comments */
"use strict";
const Generator = require("yeoman-generator");
// const chalk = require("chalk");
// const yosay = require("yosay");

module.exports = class extends Generator {
  initializing() {
    this.props = {};
    this.answers = {};

    // var the_app_name = "";
    // if (typeof this.config.get("app_name") !== "undefined") {
    //   the_app_name = this.config.get("app_name");
    // }

    this.config.defaults({
    });
  }

  async prompting() {
    // Have Yeoman greet the user.
    //this.log(
    //  yosay(`Welcome to the fabulous ${chalk.red('generator-sap-a-team-haa')} generator!`)
    //);

    //this.log("Options:" + JSON.stringify(this.options.app_name));
    //this.log("Config:" + this.config.get("app_name"));
    //this.log("Config Typeof:" + typeof(this.config.get("app_name")));

    var prompts = [];

    if (typeof this.config.get("app_name") === "undefined") {
      prompts.push({
        type: "input",
        name: "app_name",
        message: "Enter your project application name.",
        default: this.config.get("app_name") // Default to current folder name
      });
    } else {
      this.answers.app_name = this.config.get("app_name");
      this.log("Using app_name: " + this.answers.app_name);
    }

    this.answers = await this.prompt(prompts);

    if (typeof this.config.get("project_name") !== "undefined") {
      this.answers.project_name = this.config.get("project_name");
    }

    if (typeof this.config.get("app_name") !== "undefined") {
      this.answers.app_name = this.config.get("app_name");
    }

    if (typeof this.config.get("uaa_res_name") !== "undefined") {
      this.answers.uaa_res_name = this.config.get("uaa_res_name");
      this.log("Using uaa_res_name: " + this.answers.uaa_res_name);
    }

  }

  writing() {

    var subs = {
      project_name: this.answers.project_name,
      app_name: this.answers.app_name,
      uaa_res_name: this.answers.uaa_res_name
    };

    this.fs.copyTpl(
      this.templatePath("deploy2xsa.mtaext"),
      this.destinationPath("deploy2xsa.mtaext"),
      subs
    );

    this.fs.copy(
      this.destinationPath("README.md"),
      this.destinationPath("README.md"),
      {
        process: function(content) {
          // var output = "typeof(content) : " + typeof(content);
          var output = "";

          var lines = String(content).split("\n");
          for (var i = 1; i <= lines.length; i++) {
            var line = lines[i - 1];
            var pos = line.search("Build Command:");
            if (pos !== -1) {
              //output += "###indent=" + pos + '\n';
              var indent = "";
              for (var j = 0; j < pos; j++) {
                indent += " ";
              }

              var ins = "";
              ins += "\n\n";

              ins += indent + "```" + "\n";
              ins += indent + "cd <%= project_name %> ; mkdir -p mta_archives ; mbt build -p=xsa -t=mta_archives --mtar=<%= project_name %>.mtar" + "\n";
              ins += indent + "```" + "\n";
              ins += indent + "\nBuild Command:" + "\n";

              line += ins;
            }

            var pos = line.search("Deploy Command:");
            if (pos !== -1) {
              //output += "###indent=" + pos + '\n';
              var indent = "";
              for (var j = 0; j < pos; j++) {
                indent += " ";
              }

              var ins = "";
              ins += "\n";

              ins += indent + "```" + "\n";
              ins += indent + "xs deploy mta_archives/<%= project_name %>.mtar -f -e deploy2xsa.mtaext" + "\n";
              ins += indent + "```" + "\n";
              ins += indent + "\nDeploy Command:" + "\n";


              line += ins;
            }

            var pos = line.search("Undeploy Command:");
            if (pos !== -1) {
              //output += "###indent=" + pos + '\n';
              var indent = "";
              for (var j = 0; j < pos; j++) {
                indent += " ";
              }

              var ins = "";
              ins += "\n";

              ins += indent + "```" + "\n";
              ins += indent + "xs undeploy <%= app_name %> -f --delete-services" + "\n";
              ins += indent + "```" + "\n";
              ins += indent + "\nUndeploy Command:" + "\n";


              line += ins;
            }

            output += line + "\n";
          }

          return output;
        }
      }
    );


    this.fs.copyTpl(
      this.destinationPath("README.md"),
      this.destinationPath("README.md"),
      subs
    );


  }

  install() {
    //this.installDependencies();
  }

  end() {
    this.log(
      "\n An MTA Extension file(" +
        "deploy2xsa.mtaext" +
        ") has be added to your project. \nBe sure to deploy with it using the -e deploy2xsa.txt parameter."
    );
  }
};
