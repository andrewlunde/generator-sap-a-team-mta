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
      // db_name: the_app_name + "-hdb",
      // db_dir: "db",
      database_guid: "run cf service <hana-db instance name> --guid",
      db_schema_name: the_app_name.toUpperCase() + "_DB",
      sch_res_name: the_app_name + "-sch",
      sch_svc_name: the_app_name.toUpperCase() + "_SCH",
      router_dir: "web",
      pyt_sch_name: the_app_name + "-pyt-sch",
      pyt_sch_dir: "pyt-sch",
      pyt_sch_api: the_app_name + "_pyt_sch_api",
      pyt_sch_be: the_app_name + "_pyt_sch_be",
      pyt_sch_route: "pyt-sch"
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
      name: "database_guid",
      prefix: "Format Similar to this 9ab5c11d-394e-459e-d251-bb99aa73a3da .\n",
      message: "HANA DB GUID.",
      default: this.config.get("database_guid")
    });

    prompts.push({
      type: "input",
      name: "db_schema_name",
      prefix:
        "Leave this blank if you want the system to generate the schema name.\n",
      message: "DB Schema Name.",
      default: this.config.get("db_schema_name")
    });

    prompts.push({
      type: "input",
      name: "sch_res_name",
      message: "SCHema resource name",
      default: this.config.get("sch_res_name")
    });

    prompts.push({
      type: "input",
      name: "sch_svc_name",
      message: "SCHema service name.",
      default: this.config.get("sch_svc_name")
    });

    prompts.push({
      type: "input",
      name: "pyt_sch_name",
      message: "Python-Schema Module Name.",
      default: this.config.get("pyt_sch_name")
    });

    prompts.push({
      type: "input",
      name: "pyt_sch_dir",
      message: "Python-Schema Module path.",
      default: this.config.get("pyt_sch_dir")
    });

    prompts.push({
      type: "input",
      name: "pyt_sch_api",
      message: "Python-Schema Module API (Internal Reference).",
      default: this.config.get("pyt_sch_api")
    });

    prompts.push({
      type: "input",
      name: "pyt_sch_be",
      message: "Python-Schema Module Back End (AppRouter Destination).",
      default: this.config.get("pyt_sch_be")
    });

    prompts.push({
      type: "input",
      name: "pyt_sch_route",
      message: "Route path(after first /) that your module will handle",
      default: this.config.get("pyt_sch_route")
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
  }

  writing() {
    // this.config.set("db_name", this.answers.db_name);
    // this.config.set("db_dir", this.answers.db_dir);
    this.config.set("database_guid", this.answers.database_guid);
    this.config.set("db_schema_name", this.answers.db_schema_name);
    this.config.set("sch_res_name", this.answers.sch_res_name);
    this.config.set("sch_svc_name", this.answers.sch_svc_name);
    this.config.set("pyt_sch_name", this.answers.pyt_sch_name);
    this.config.set("pyt_sch_dir", this.answers.pyt_sch_dir);
    this.config.set("pyt_sch_api", this.answers.pyt_sch_api);
    this.config.set("pyt_sch_be", this.answers.pyt_sch_be);
    this.config.set("pyt_sch_route", this.answers.pyt_sch_route);
    this.config.set("router_dir", this.answers.router_dir);

    this.config.save();

    var schemaline = "";
    if (this.answers.db_schema_name !== "") {
      schemaline = "         schema: " + this.answers.db_schema_name + "\n";
    }

    var subs = {
      app_name: this.answers.app_name,
      // db_name: this.answers.db_name,
      // db_dir: this.answers.db_dir,
      database_guid: this.answers.database_guid,
      db_schema_name: this.answers.db_schema_name,
      schemaline: schemaline,
      sch_res_name: this.answers.sch_res_name,
      sch_svc_name: this.answers.sch_svc_name,
      pyt_sch_name: this.answers.pyt_sch_name,
      pyt_sch_dir: this.answers.pyt_sch_dir,
      pyt_sch_api: this.answers.pyt_sch_api,
      pyt_sch_be: this.answers.pyt_sch_be,
      pyt_sch_route: this.answers.pyt_sch_route,
      uaa_res_name: this.answers.uaa_res_name
    };

    this.fs.copy(
      this.templatePath("pyt-sch/Procfile"),
      this.destinationPath(this.answers.pyt_sch_dir + "/Procfile")
    );

    this.fs.copy(
      this.templatePath("pyt-sch/favicon.ico"),
      this.destinationPath(this.answers.pyt_sch_dir + "/favicon.ico")
    );

    this.fs.copy(
      this.templatePath("pyt-sch/requirements.txt"),
      this.destinationPath(this.answers.pyt_sch_dir + "/requirements.txt")
    );

    this.fs.copy(
      this.templatePath("pyt-sch/runtime.txt"),
      this.destinationPath(this.answers.pyt_sch_dir + "/runtime.txt")
    );

    this.fs.copyTpl(
      this.templatePath("pyt-sch/server.py"),
      this.destinationPath(this.answers.pyt_sch_dir + "/server.py"),
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
          var line = "";
          var pos = 0;
          var indent = "";
          var ins = "";

          var lines = String(content).split("\n");
          for (var i = 1; i <= lines.length; i++) {
            var line = lines[i - 1];
            var pos = line.search("### New Modules Here ###");
            if (pos !== -1) {
              //output += "###indent=" + pos + '\n';
              var indent = "";
              for (var j = 0; j < pos; j++) {
                indent += " ";
              }

              ins += "\n\n";
              ins += indent + " - name: <?= pyt_sch_name ?>" + "\n";
              ins += indent + "   type: python" + "\n";
              ins += indent + "   path: <?= pyt_sch_dir ?>" + "\n";
              ins += indent + "   parameters:" + "\n";
              ins += indent + "      memory: 256M" + "\n";
              ins += indent + "      disk-quota: 512M" + "\n";

              ins += indent + "   provides:" + "\n";
              ins += indent + "    - name: <?= pyt_sch_api ?>" + "\n";
              ins += indent + "      properties:" + "\n";
              ins += indent + "         url: ${default-url}" + "\n";

              ins += indent + "   requires:" + "\n";
              ins += indent + "    - name: <?= sch_res_name ?>" + "\n";
              ins += indent + "    - name: <?= uaa_res_name ?>" + "\n";

              line += ins;
            }

            var pos = line.search("### New Resources Here ###");
            if (pos !== -1) {
              //output += "###indent=" + pos + '\n';
              var indent = "";
              for (var j = 0; j < pos; j++) {
                indent += " ";
              }

              var ins = "";
              ins += "\n\n";

              ins += indent + " - name: <?= sch_res_name ?>" + "\n";
              ins += indent + "   type: com.sap.xs.hana-schema" + "\n";
              ins += indent + "   parameters:" + "\n";
              ins += indent + "      service-name: <?= sch_svc_name ?>" + "\n";
              ins += indent + "      config:" + "\n";
              ins +=
                indent + "         database_id: <?= database_guid ?>" + "\n";
              ins += indent + "<?= schemaline ?>" + "\n";

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

              ins += indent + " - name: <?= pyt_sch_api ?>" + "\n";
              ins += indent + "   group: destinations" + "\n";
              ins += indent + "   properties:" + "\n";
              ins += indent + "      name: <?= pyt_sch_be ?>" + "\n";
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
                indent + '  "source": "(<?= pyt_sch_route ?>/)(.*)",' + "\n";
              ins += indent + '  "destination": "<?= pyt_sch_be ?>",' + "\n";
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
                '<a href="/<?= pyt_sch_route ?>/">/<?= pyt_sch_route ?>/</a> link handled by <?= pyt_sch_name ?><br />' +
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
      "Be sure to add " +
        this.answers.sch_res_name +
        " to the requires: section of any existing module that needs access to the HANA service instance " +
        this.answers.sch_svc_name +
        "."
    );
  }
};
