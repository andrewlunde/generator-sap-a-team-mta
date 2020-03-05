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
      db_name: the_app_name + "-hdb",
      db_dir: "db",
      db_schema_name: the_app_name.toUpperCase() + "_DB",
      hdi_res_name: the_app_name + "-hdi",
      hdi_svc_name: the_app_name.toUpperCase() + "_HDI",
      router_dir: "web",
      srv_name: the_app_name + "-srv",
      srv_dir: "srv",
      srv_api: the_app_name + "_srv_api",
      srv_be: the_app_name + "_srv_be",
      srv_route: "catalog"
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
      name: "db_name",
      message: "DB Module Name.",
      default: this.config.get("db_name")
    });

    prompts.push({
      type: "input",
      name: "db_dir",
      message: "DB Module path.",
      default: this.config.get("db_dir")
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
      name: "hdi_res_name",
      message: "HDI resource name",
      default: this.config.get("hdi_res_name")
    });

    prompts.push({
      type: "input",
      name: "hdi_svc_name",
      message: "HDI service name.",
      default: this.config.get("hdi_svc_name")
    });

    prompts.push({
      type: "input",
      name: "srv_name",
      message: "SRV Module Name.",
      default: this.config.get("srv_name")
    });

    prompts.push({
      type: "input",
      name: "srv_dir",
      message: "SRV Module path.",
      default: this.config.get("srv_dir")
    });

    prompts.push({
      type: "input",
      name: "srv_api",
      message: "SRV Module API (Internal Reference).",
      default: this.config.get("srv_api")
    });

    prompts.push({
      type: "input",
      name: "srv_be",
      message: "SRV Module Back End (AppRouter Destination).",
      default: this.config.get("srv_be")
    });

    prompts.push({
      type: "input",
      name: "srv_route",
      message: "Route path(after first /) that your module will handle",
      default: this.config.get("srv_route")
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
    this.config.set("db_name", this.answers.db_name);
    this.config.set("db_dir", this.answers.db_dir);
    this.config.set("db_schema_name", this.answers.db_schema_name);
    this.config.set("hdi_res_name", this.answers.hdi_res_name);
    this.config.set("hdi_svc_name", this.answers.hdi_svc_name);
    this.config.set("srv_name", this.answers.srv_name);
    this.config.set("srv_dir", this.answers.srv_dir);
    this.config.set("srv_api", this.answers.srv_api);
    this.config.set("srv_be", this.answers.srv_be);
    this.config.set("srv_route", this.answers.srv_route);
    this.config.set("router_dir", this.answers.router_dir);

    this.config.save();

    var subs = {
      app_name: this.answers.app_name,
      db_name: this.answers.db_name,
      db_dir: this.answers.db_dir,
      db_schema_name: this.answers.db_schema_name,
      hdi_res_name: this.answers.hdi_res_name,
      hdi_svc_name: this.answers.hdi_svc_name,
      srv_name: this.answers.srv_name,
      srv_dir: this.answers.srv_dir,
      srv_api: this.answers.srv_api,
      srv_be: this.answers.srv_be,
      srv_route: this.answers.srv_route,
      uaa_res_name: this.answers.uaa_res_name
    };

    this.fs.copyTpl(
      this.templatePath(".cdsrc.json"),
      this.destinationPath(".cdsrc.json"),
      subs
    );

    this.fs.copyTpl(
      this.templatePath("package.json"),
      this.destinationPath("package.json"),
      subs
    );

    this.fs.copyTpl(
      this.templatePath("db/.build.js"),
      this.destinationPath(this.answers.db_dir + "/.build.js"),
      subs
    );

    this.fs.copyTpl(
      this.templatePath("db/data-model.cds"),
      this.destinationPath(this.answers.db_dir + "/data-model.cds"),
      subs
    );

    this.fs.copyTpl(
      this.templatePath("db/package.json"),
      this.destinationPath(this.answers.db_dir + "/package.json"),
      subs
    );

    this.fs.copy(
      this.templatePath("db/csv/my.bookshop-Authors.csv"),
      this.destinationPath(this.answers.db_dir + "/csv/my.bookshop-Authors.csv")
    );

    this.fs.copy(
      this.templatePath("db/csv/my.bookshop-Books.csv"),
      this.destinationPath(this.answers.db_dir + "/csv/my.bookshop-Books.csv")
    );

    this.fs.copy(
      this.templatePath("db/csv/my.bookshop-Orders.csv"),
      this.destinationPath(this.answers.db_dir + "/csv/my.bookshop-Orders.csv")
    );

    this.fs.copyTpl(
      this.templatePath("srv/.build.js"),
      this.destinationPath(this.answers.srv_dir + "/.build.js"),
      subs
    );

    this.fs.copyTpl(
      this.templatePath("srv/cat-service.cds"),
      this.destinationPath(this.answers.srv_dir + "/cat-service.cds"),
      subs
    );

    this.fs.copyTpl(
      this.templatePath("srv/package.json"),
      this.destinationPath(this.answers.srv_dir + "/package.json"),
      subs
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

              var ins = "";
              ins += "\n\n";
              ins += indent + " - name: <?= db_name ?>" + "\n";
              ins += indent + "   type: hdb" + "\n";
              ins += indent + "   path: <?= db_dir ?>" + "\n";
              ins += indent + "   parameters:" + "\n";
              ins += indent + "      memory: 512M" + "\n";
              ins += indent + "      disk-quota: 512M" + "\n";
              ins += indent + "   requires:" + "\n";
              ins += indent + "    - name: <?= hdi_res_name ?>";

              ins += "\n\n";
              ins += indent + " - name: <?= srv_name ?>" + "\n";
              ins += indent + "   type: nodejs" + "\n";
              ins += indent + "   path: <?= srv_dir ?>" + "\n";
              ins += indent + "   parameters:" + "\n";
              ins += indent + "      memory: 512M" + "\n";
              ins += indent + "      disk-quota: 512M" + "\n";

              ins += indent + "   provides:" + "\n";
              ins += indent + "    - name: <?= srv_api ?>" + "\n";
              ins += indent + "      properties:" + "\n";
              ins += indent + "         url: ${default-url}" + "\n";

              ins += indent + "   requires:" + "\n";
              ins += indent + "    - name: <?= hdi_res_name ?>" + "\n";
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

              ins += indent + " - name: <?= hdi_res_name ?>" + "\n";
              ins += indent + "   type: com.sap.xs.hdi-container" + "\n";
              ins += indent + "   parameters:" + "\n";
              ins += indent + "      service-name: <?= hdi_svc_name ?>" + "\n";
              ins += indent + "      config:" + "\n";
              ins += indent + "         schema: <?= db_schema_name ?>";

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

              ins += indent + " - name: <?= srv_api ?>" + "\n";
              ins += indent + "   group: destinations" + "\n";
              ins += indent + "   properties:" + "\n";
              ins += indent + "      name: <?= srv_be ?>" + "\n";
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
              ins += indent + '  "source": "(<?= srv_route ?>/)(.*)",' + "\n";
              ins += indent + '  "destination": "<?= srv_be ?>",' + "\n";
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
                '<a href="/<?= srv_route ?>/">/<?= srv_route ?>/</a> link handled by <?= srv_name ?><br />' +
                "\n" +
                '<a href="/<?= srv_route ?>/Authors?$expand=books($select=ID,title)">/<?= srv_route ?>/Authors?$expand=books($select=ID,title)</a> link handled by <?= srv_name ?><br />' +
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
        this.answers.hdi_res_name +
        " to the requires: section of any existing module that needs access to the HANA service instance " +
        this.answers.hdi_svc_name +
        "."
    );
  }
};
