'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {

  initializing() {
    this.props = {};
    this.answers = {};
    var the_app_name = "";
    if (typeof(this.config.get("app_name")) !== "undefined") {
      the_app_name = this.config.get("app_name");
    }

    this.config.defaults({ 
      "ss_res_name": the_app_name + "-ss",
      "ss_svc_name": (the_app_name).toUpperCase() + "_SS"
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
    
    if (typeof(this.config.get("app_name")) === "undefined") {
      prompts.push( 
        {
          type: "input",
          name: "app_name",
          message: "Enter your project application name.",
          default: this.config.get("app_name") // Default to current folder name
        }
      );
    }
    else {
      this.answers.app_name = this.config.get("app_name");
      this.log("Using app_name: " + this.answers.app_name);
    }
	  
	  prompts.push( {
      type: "input",
      name: "ss_res_name",
      message: "SecureStore resource name",
      default: this.config.get("ss_res_name")
    }
    );

	  prompts.push( {
      type: "input",
      name: "ss_svc_name",
      message: "SecureStore service name.",
      default: this.config.get("ss_svc_name")
    }
    );

    this.answers = await this.prompt(prompts);

    if (typeof(this.config.get("app_name")) !== "undefined") {
      this.answers.app_name = this.config.get("app_name");
    }

  }


  writing() {

    this.config.set("ss_res_name", this.answers.ss_res_name);
    this.config.set("ss_svc_name", this.answers.ss_svc_name);

    this.config.save();

    var subs = {
      app_name: this.answers.app_name,
      ss_res_name: this.answers.ss_res_name,
      ss_svc_name: this.answers.ss_svc_name
    };


    this.fs.copy( this.destinationPath('mta.yaml'), this.destinationPath('mta.yaml'), {
	    process: function (content) {
        // var output = "typeof(content) : " + typeof(content);
        var output = "";

        var lines = String(content).split('\n');
        for (var i = 1; i <= lines.length; i++) {
          var line = lines[i-1];
          var pos = line.search("### New Resources Here ###");
          if (pos != -1) {
            //output += "###indent=" + pos + '\n';
            var indent = "";
            for (var j=0; j < pos; j++) { indent += " "; }
            var ins = "";
            ins += '\n\n';
      
            ins += indent + " - name: <?= ss_res_name ?>" + '\n';
            ins += indent + "   type: com.sap.xs.hana-securestore" + '\n';
            ins += indent + "   parameters:" + '\n';
            ins += indent + "      service-name: <?= ss_svc_name ?>";
               
            line += ins;
          }
          output += line + '\n';
        }
        
        return(output);  
      }

    });

    this.fs.copyTpl(this.destinationPath('mta.yaml'),this.destinationPath('mta.yaml'),
    subs,{ delimiter: "?"} );

  }

  install() {
    //this.installDependencies();
  }

  end() {
    this.log("Be sure to add " + this.answers.ss_res_name + " to the requires: section of any existing module that needs access to the HANA SecureStore " + this.answers.ss_svc_name + ".");
  }

};
