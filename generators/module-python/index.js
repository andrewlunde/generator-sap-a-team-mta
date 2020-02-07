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

    var the_app_name = "";
    if (typeof this.config.get("app_name") !== "undefined") {
      the_app_name = this.config.get("app_name");
    }

    this.config.defaults({
      python_module_name: the_app_name + "-pyt",
      python_module_dir: "python",
      python_module_api: the_app_name + "_pyt_api",
      python_module_be: the_app_name + "_pyt_be",
      router_dir: "web",
      python_module_route: "python"
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

    if (typeof this.config.get("router_dir") === "undefined") {
      prompts.push({
        type: "input",
        name: "router_dir",
        message: "Application router path",
        default: this.config.get("router_dir")
      });
    } else {
      this.answers.router_dir = this.config.get("router_dir");
      this.log("Using router_dir: " + this.answers.router_dir);
    }

    prompts.push({
      type: "input",
      name: "python_module_name",
      message: "Python Module Name.",
      default: this.config.get("python_module_name")
    });

    prompts.push({
      type: "input",
      name: "python_module_dir",
      message: "Python Module Path.",
      default: this.config.get("python_module_dir")
    });

    prompts.push({
      type: "input",
      name: "python_module_api",
      message: "Python Module API (Internal Reference).",
      default: this.config.get("python_module_api")
    });

    prompts.push({
      type: "input",
      name: "python_module_be",
      message: "Python Module Back End (AppRouter Destination).",
      default: this.config.get("python_module_be")
    });

    prompts.push({
      type: "input",
      name: "python_module_route",
      message: "Route path(after first /) that your module will handle",
      default: this.config.get("python_module_route")
    });

    this.answers = await this.prompt(prompts);

    if (typeof this.config.get("app_name") !== "undefined") {
      this.answers.app_name = this.config.get("app_name");
    }

    if (typeof this.config.get("router_dir") !== "undefined") {
      this.answers.router_dir = this.config.get("router_dir");
    }

    if (typeof this.config.get("uaa_res_name") !== "undefined") {
      this.answers.uaa_res_name = this.config.get("uaa_res_name");
      this.log("Using uaa_res_name: " + this.answers.uaa_res_name);
    }

    if (typeof this.config.get("hdi_res_name") !== "undefined") {
      this.answers.hdi_res_name = this.config.get("hdi_res_name");
      this.log("Using hdi_res_name: " + this.answers.hdi_res_name);
    }
  }

  writing() {
    this.config.set("python_module_name", this.answers.python_module_name);
    this.config.set("python_module_dir", this.answers.python_module_dir);
    this.config.set("python_module_api", this.answers.python_module_api);
    this.config.set("python_module_be", this.answers.python_module_be);
    this.config.set("python_module_route", this.answers.python_module_route);
    this.config.set("router_dir", this.answers.router_dir);

    this.config.save();

    var subs = {
      app_name: this.answers.app_name,
      python_module_name: this.answers.python_module_name,
      python_module_dir: this.answers.python_module_dir,
      python_module_api: this.answers.python_module_api,
      python_module_be: this.answers.python_module_be,
      python_module_route: this.answers.python_module_route,
      uaa_res_name: this.answers.uaa_res_name,
      hdi_res_name: ""
    };

    if (typeof this.answers.hdi_res_name !== "undefined") {
      this.log("Requiring to hdi_res_name: " + this.answers.hdi_res_name);
      subs.hdi_res_name = "\n" + "    - name: " + this.answers.hdi_res_name;
    }

    //this.log(":" + subs.hdi_res_name + ":");

    this.fs.copy(
      this.templatePath("python/favicon.ico"),
      this.destinationPath(this.answers.python_module_dir + "/favicon.ico")
    );
    this.fs.copy(
      this.templatePath("python/findme.txt"),
      this.destinationPath(this.answers.python_module_dir + "/findme.txt")
    );
    this.fs.copy(
      this.templatePath("python/Procfile"),
      this.destinationPath(this.answers.python_module_dir + "/Procfile")
    );
    this.fs.copy(
      this.templatePath("python/requirements.txt"),
      this.destinationPath(this.answers.python_module_dir + "/requirements.txt")
    );
    this.fs.copy(
      this.templatePath("python/runtime.txt"),
      this.destinationPath(this.answers.python_module_dir + "/runtime.txt")
    );

    this.fs.copyTpl(
      this.templatePath("python/server.py"),
      this.destinationPath("server.py"),
      subs,
      { delimiter: "?" }
    );

    this.fs.copy(
      this.destinationPath("mta.yaml"),
      this.destinationPath("mta.yaml"),
      {
        process: function(content) {
          // var output = "typeof(content) : " + typeof(content);
          var output = "";

          var lines = String(content).split("\n");
          var line = "";
          var pos = 0;
          var indent = "";
          var ins = "";

          for (var i = 1; i <= lines.length; i++) {
            line = lines[i - 1];
            pos = line.search("### New Modules Here ###");
            if (pos !== -1) {
              //output += "###indent=" + pos + '\n';
              indent = "";
              for (var j = 0; j < pos; j++) {
                indent += " ";
              }

              ins = "";
              ins += "\n\n";
              ins += indent + " - name: <?= python_module_name ?>" + "\n";
              ins += indent + "   type: python" + "\n";
              ins += indent + "   path: <?= python_module_dir ?>" + "\n";
              ins += indent + "   parameters:" + "\n";
              ins += indent + "      memory: 512M" + "\n";
              ins += indent + "      disk-quota: 256M" + "\n";
              ins += indent + "      #host: <?= python_module_name ?>-${space}" + "\n";
              ins += indent + "      #domain: yourdomain.com" + "\n";
              ins += indent + "   provides:" + "\n";
              ins += indent + "    - name: <?= python_module_api ?>" + "\n";
              ins += indent + "      properties:" + "\n";
              ins += indent + "         url: ${default-url}" + "\n";
              ins += indent + "   requires:" + "\n";
              ins += indent + "    - name: <?= uaa_res_name ?>";
              ins += indent + "<?= hdi_res_name ?>";

              line += ins;
            }

            pos = line.search("### New Destinations Here ###");
            if (pos !== -1) {
              //output += "###indent=" + pos + '\n';
              indent = "";
              for (var j = 0; j < pos; j++) {
                indent += " ";
              }

              ins = "";
              ins += "\n";

              ins += indent + " - name: <?= python_module_api ?>" + "\n";
              ins += indent + "   group: destinations" + "\n";
              ins += indent + "   properties:" + "\n";
              ins += indent + "      name: <?= python_module_be ?>" + "\n";
              ins += indent + "      url: ~{url}" + "\n";
              ins += indent + "      forwardAuthToken: true";

              line += ins;
            }

            output += line + "\n";
          }

          return output;
        }
      }
    );

    this.fs.copyTpl(
      this.destinationPath("mta.yaml"),
      this.destinationPath("mta.yaml"),
      subs,
      { delimiter: "?" }
    );

    this.fs.copy(
      this.destinationPath(this.answers.router_dir + "/xs-app.json"),
      this.destinationPath(this.answers.router_dir + "/xs-app.json"),
      {
        process: function(content) {
          // var output = "typeof(content) : " + typeof(content);
          var output = "";
          var line = "";
          var pos = 0;
          var indent = "";
          var ins = "";

          var lines = String(content).split("\n");
          for (var i = 1; i <= lines.length; i++) {
            line = lines[i - 1];
            pos = line.search("routes");
            if (pos !== -1) {
              //output += "###indent=" + pos + '\n';
              ins = "";
              ins += "\n";
              indent = "    ";

              ins += indent + "{" + "\n";
              ins +=
                indent + '  "source": "(<?= python_module_route ?>/)(.*)",' + "\n";
              ins += indent + '  "destination": "<?= python_module_be ?>",' + "\n";
              ins += indent + '  "csrfProtection": true,' + "\n";
              ins += indent + '  "authenticationType": "xsuaa"' + "\n";
              ins += indent + "},";

              line += ins;
            }

            output += line + "\n";
          }

          return output;
        }
      }
    );

    this.fs.copyTpl(
      this.destinationPath(this.answers.router_dir + "/xs-app.json"),
      this.destinationPath(this.answers.router_dir + "/xs-app.json"),
      subs,
      { delimiter: "?" }
    );

    this.fs.copy(
      this.destinationPath(this.answers.router_dir + "/resources/index.html"),
      this.destinationPath(this.answers.router_dir + "/resources/index.html"),
      {
        process: function(content) {
          // var output = "typeof(content) : " + typeof(content);
          var output = "";
          var line = "";
          var pos = 0;
          var indent = "";
          var ins = "";

          var lines = String(content).split("\n");
          for (var i = 1; i <= lines.length; i++) {
            line = lines[i - 1];
            pos = line.search("</body>");
            if (pos !== -1) {
              //output += "###indent=" + pos + '\n';
              ins = "";
              ins += "\n";
              indent = "  ";

              ins +=
                indent +
                '<a href="/<?= python_module_route ?>/">/<?= python_module_route ?>/</a> link handled by <?= python_module_name ?><br />' +
                "\n" +
                "\n";

              line = ins + line;
            }

            output += line + "\n";
          }

          return output;
        }
      }
    );

    this.fs.copyTpl(
      this.destinationPath(this.answers.router_dir + "/resources/index.html"),
      this.destinationPath(this.answers.router_dir + "/resources/index.html"),
      subs,
      { delimiter: "?" }
    );
  }

  install() {
    //this.installDependencies();
  }

  end() {
    this.log(
      "\n The Python module " +
        this.answers.python_module_name +
        " has be added to your project. \nDouble check your mta.yaml, " +
        this.answers.router_dir +
        "/xs-app.json" +
        ", and " +
        this.answers.router_dir +
        "/resources/index.html" +
        " files for issues."
    );
  }
};
