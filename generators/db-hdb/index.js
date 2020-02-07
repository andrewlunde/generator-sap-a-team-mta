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
      "db_name": the_app_name + "-hdb",
      "db_dir": "db",
      "db_schema_name": (the_app_name).toUpperCase() + "_DB",
      "hdi_res_name": the_app_name + "-hdi",
      "hdi_svc_name": (the_app_name).toUpperCase() + "_HDI",


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
      name: "db_name",
      message: "DB Module Name.",
      default: this.config.get("db_name")
    }
	  );

	  prompts.push( {
      type: "input",
      name: "db_dir",
      message: "DB Module path.",
      default: this.config.get("db_dir")
    }
    );

	  prompts.push( {
      type: "input",
      name: "db_schema_name",
      prefix: "Leave this blank if you want the system to generate the schema name.\n",
      message: "DB Schema Name.",
      default: this.config.get("db_schema_name")
    }
    );

	  prompts.push( {
      type: "input",
      name: "hdi_res_name",
      message: "HDI resource name",
      default: this.config.get("hdi_res_name")
    }
    );

	  prompts.push( {
      type: "input",
      name: "hdi_svc_name",
      message: "HDI service name.",
      default: this.config.get("hdi_svc_name")
    }
    );

    this.answers = await this.prompt(prompts);

    if (typeof(this.config.get("app_name")) !== "undefined") {
      this.answers.app_name = this.config.get("app_name");
    }

  }


  writing() {

    this.config.set("db_name", this.answers.db_name);
    this.config.set("db_dir", this.answers.db_dir);
    this.config.set("db_schema_name", this.answers.db_schema_name);
    this.config.set("hdi_res_name", this.answers.hdi_res_name);
    this.config.set("hdi_svc_name", this.answers.hdi_svc_name);

    this.config.save();

    var subs = {
      app_name: this.answers.app_name,
      db_name: this.answers.db_name,
      db_dir: this.answers.db_dir,
      db_schema_name: this.answers.db_schema_name,
      hdi_res_name: this.answers.hdi_res_name,
      hdi_svc_name: this.answers.hdi_svc_name
    };

    this.fs.copy( this.templatePath('db/package.json'), this.destinationPath(this.answers.db_dir + '/package.json'));

    this.fs.copy( this.templatePath('db/src/.hdiconfig'), this.destinationPath(this.answers.db_dir + '/src/.hdiconfig'));
    this.fs.copy( this.templatePath('db/src/.hdinamespace'), this.destinationPath(this.answers.db_dir + '/src/.hdinamespace'));

    this.fs.copyTpl( this.templatePath('db/src/defaults/default_access_role.hdbrole'), this.destinationPath(this.answers.db_dir + '/src/defaults/default_access_role.hdbrole'),subs);

    this.fs.copyTpl(this.templatePath('db/src/roles/app_name_admin.hdbrole'),this.destinationPath(this.answers.db_dir + '/src/roles/' + this.answers.app_name + '_admin.hdbrole'),subs);

    this.fs.copy( this.templatePath('db/src/data/.hdinamespace'), this.destinationPath(this.answers.db_dir + '/src/data/.hdinamespace'));
    this.fs.copy( this.templatePath('db/src/data/sensors.hdbcds'), this.destinationPath(this.answers.db_dir + '/src/data/sensors.hdbcds'));
    this.fs.copy( this.templatePath('db/src/data/sys.hdbsynonym'), this.destinationPath(this.answers.db_dir + '/src/data/sys.hdbsynonym'));
    this.fs.copy( this.templatePath('db/src/data/temp.csv'), this.destinationPath(this.answers.db_dir + '/src/data/temp.csv'));
    this.fs.copy( this.templatePath('db/src/data/temp.hdbtabledata'), this.destinationPath(this.answers.db_dir + '/src/data/temp.hdbtabledata'));
    this.fs.copy( this.templatePath('db/src/data/tempId.hdbsequence'), this.destinationPath(this.answers.db_dir + '/src/data/tempId.hdbsequence'));

    this.fs.copy( this.templatePath('db/src/views/temps.hdbcalculationview'), this.destinationPath(this.answers.db_dir + '/src/views/temps.hdbcalculationview'));

    this.fs.copy( this.destinationPath('mta.yaml'), this.destinationPath('mta.yaml'), {
	    process: function (content) {
        // var output = "typeof(content) : " + typeof(content);
        var output = "";

        var lines = String(content).split('\n');
        for (var i = 1; i <= lines.length; i++) {
          var line = lines[i-1];
          var pos = line.search("### New Modules Here ###");
          if (pos != -1) {
            //output += "###indent=" + pos + '\n';
            var indent = "";
            for (var j=0; j < pos; j++) { indent += " "; }
            var ins = "";
            ins += '\n\n';
            ins += indent + " - name: <?= db_name ?>" + '\n';
            ins += indent + "   type: hdb" + '\n';
            ins += indent + "   path: <?= db_dir ?>" + '\n';
            ins += indent + "   parameters:" + '\n';
            ins += indent + "      memory: 512M" + '\n';
            ins += indent + "      disk-quota: 512M" + '\n';
            ins += indent + "   requires:" + '\n';
            ins += indent + "    - name: <?= hdi_res_name ?>";
               
            line += ins;
          }
          var pos = line.search("### New Resources Here ###");
          if (pos != -1) {
            //output += "###indent=" + pos + '\n';
            var indent = "";
            for (var j=0; j < pos; j++) { indent += " "; }
            var ins = "";
            ins += '\n\n';
      
            ins += indent + " - name: <?= hdi_res_name ?>" + '\n';
            ins += indent + "   type: com.sap.xs.hdi-container" + '\n';
            ins += indent + "   parameters:" + '\n';
            ins += indent + "      service-name: <?= hdi_svc_name ?>" + '\n';
            ins += indent + "      config:" + '\n';
            ins += indent + "         schema: <?= db_schema_name ?>";
               
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
    this.log("Be sure to add " + this.answers.hdi_res_name + " to the requires: section of any existing module that needs access to the HANA service instance " + this.answers.hdi_svc_name + ".");
  }

};
