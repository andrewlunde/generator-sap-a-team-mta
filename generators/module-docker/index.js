'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const yaml = require('js-yaml');
const fs = require('fs')

function suggest_docker_module_name(so_far) { 
  //return JSON.stringify(so_far);
  var retstr = "";
  
  retstr += so_far.app_name + "-docker";
  
  return retstr;
}

function get_provides_api(base_str) { 
  //return JSON.stringify(so_far);
  var retstr = "";
  
  retstr += base_str + "_api";
  
  return retstr;
}

module.exports = class extends Generator {

  initializing() {
    this.props = {};
    this.answers = {};
    this.config.defaults({ 
      docker_module_name: "doc_mod-cli",
      docker_module_img: "alunde/cf-cli:latest",
      docker_module_route: "cf-cli"
    });    
  }

  constructor(args, opts) {
    super(args, opts);

    // This makes `appname` a required argument.
    // this.argument("appname", { type: String, required: true });

    // This method adds support for a `--coffee` flag
    this.option("coffee");

    // And you can then access it later; e.g.
    this.scriptSuffix = this.options.coffee ? ".coffee" : ".js";

    // And you can then access it later; e.g.
    // this.log("Options appname:" + this.options.appname);
    // this.log("Passed Options app_name:" + JSON.stringify(this.options.app_name));
  }

  async prompting() {
    // Have Yeoman greet the user.
    //this.log(
    //  yosay(`Welcome to the fabulous ${chalk.red('generator-sap-a-team-haa')} generator!`)
    //);

    this.log("Options:" + JSON.stringify(this.options.app_name));
    this.log("Config:" + this.config.get("app_name"));
    this.log("Config Typeof:" + typeof(this.config.get("app_name")));

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
 
    if (typeof(this.config.get("app_name")) === "undefined") {
      prompts.push( {
        type: "input",
        name: "docker_module_name",
        message: "Docker module name",
        default: suggest_docker_module_name
        }
      );
    }
    else {
      prompts.push( {
        type: "input",
        name: "docker_module_name",
        message: "Docker module name",
        default: this.config.get("docker_module_name")
        }
      );
    }

    if (typeof(this.config.get("router_dir")) === "undefined") {
      prompts.push( 
        {
          type: "input",
          name: "router_dir",
          message: "Enter your app router directory name.",
          default: this.config.get("router_dir") // Default to current folder name
        }
      );
    }
    else {
      this.answers.router_dir = this.config.get("router_dir");
      this.log("Using router_dir: " + this.answers.router_dir);
    }
 
	  
	  prompts.push( {
        	type: "input",
	        name: "docker_module_img",
	        message: "Docker module image",
	        default: this.config.get("docker_module_img")
	  }
	  );

	  prompts.push( {
      type: "input",
      name: "docker_module_route",
      message: "Route path(after first /) that your module will handle",
      default: this.config.get("docker_module_route")
    }
    );


    this.answers = await this.prompt(prompts);

    // this.log("Passed Options app_name:" + JSON.stringify(this.options.app_name));

//    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
//      this.props = props;
//    });
  }

  
  writing() {

    this.config.set("docker_module_name", this.answers.docker_module_name);
    this.config.set("docker_module_img", this.answers.docker_module_img);
    this.config.set("docker_module_route", this.answers.docker_module_route);

    this.config.save();

    var the_app_name = "";
    if (typeof(this.config.get("app_name")) === "undefined") {
      the_app_name = this.answers.app_name;
    }
    else {
      the_app_name = this.config.get("app_name");
    }

    var the_router_dir = "";
    if (typeof(this.config.get("router_dir")) === "undefined") {
      the_router_dir = this.answers.router_dir;
    }
    else {
      the_router_dir = this.config.get("router_dir");
    }

    //var provides_api = get_provides_api(the_app_name);
    //var provides_api = "provide_this";
    var provides_api = the_app_name + "_api";
    var requires_dest = the_app_name + "_be";

    this.log("Using provides_api: " + provides_api);
    this.log("Using requires_dest: " + requires_dest);

    var subs = {
      docker_module_name: this.answers.docker_module_name,
      docker_module_img: this.answers.docker_module_img,
      docker_module_route: this.answers.docker_module_route,
      provides_api: provides_api,
      requires_dest: requires_dest
    };

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
            ins += indent + " - name: <?= docker_module_name ?>" + '\n';
            ins += indent + "   type: custom" + '\n';
            //ins += indent + "   path: none" + '\n';
            ins += indent + "   build-parameters:" + '\n';
            ins += indent + "      no-source: true" + '\n';
            ins += indent + "   parameters:" + '\n';
            ins += indent + "      memory: 1G" + '\n';
            ins += indent + "      health-check-type: none" + '\n';
            ins += indent + "      docker:" + '\n';
            ins += indent + "         image: <?= docker_module_img ?>" + '\n';
            ins += indent + "   provides:" + '\n';
            ins += indent + "    - name: <?= provides_api ?>" + '\n';
            ins += indent + "      properties:" + '\n';
            ins += indent + "         url: ${default-url}";
               
            line += ins;
          }
          var pos = line.search("### New Destinations Here ###");
          if (pos != -1) {
            //output += "###indent=" + pos + '\n';
            var indent = "";
            for (var j=0; j < pos; j++) { indent += " "; }
            var ins = "";
            ins += '\n';
      
            ins += indent + " - name: <?= provides_api ?>" + '\n';
            ins += indent + "   group: destinations" + '\n';
            ins += indent + "   properties:" + '\n';
            ins += indent + "      name: <?= requires_dest ?>" + '\n';
            ins += indent + "      url: ~{url}" + '\n';
            ins += indent + "      forwardAuthToken: true";
               
            line += ins;
          }
          output += line + '\n';
        }
        
        return(output);  
      }

    });

    this.fs.copyTpl(this.destinationPath('mta.yaml'),this.destinationPath('mta.yaml'),
    subs,{ delimiter: "?"} );

    this.fs.copy( this.destinationPath(the_router_dir+'/xs-app.json'), this.destinationPath(the_router_dir+'/xs-app.json'), {
	    process: function (content) {
        // var output = "typeof(content) : " + typeof(content);
        var output = "";

        var lines = String(content).split('\n');
        for (var i = 1; i <= lines.length; i++) {
          var line = lines[i-1];
          var pos = line.search("routes");
          if (pos != -1) {
            //output += "###indent=" + pos + '\n';
            var ins = "";
            ins += '\n';
            var indent = "    ";

            ins += indent + "{" + '\n';
            ins += indent + "  \"source\": \"(<?= docker_module_route ?>/)(.*)\"," + '\n';
            ins += indent + "  \"destination\": \"<?= requires_dest ?>\"," + '\n';
            ins += indent + "  \"csrfProtection\": true," + '\n';
            ins += indent + "  \"authenticationType\": \"xsuaa\"" + '\n';
            ins += indent + "},";
               
            line += ins;
          }
          output += line + '\n';
        }
        
        return(output);  
      }

    });

    this.fs.copyTpl(this.destinationPath(the_router_dir+'/xs-app.json'), this.destinationPath(the_router_dir+'/xs-app.json'),
    subs,{ delimiter: "?"} );

    this.fs.copy( this.destinationPath(the_router_dir+'/resources/index.html'), this.destinationPath(the_router_dir+'/resources/index.html'), {
	    process: function (content) {
        // var output = "typeof(content) : " + typeof(content);
        var output = "";

        var lines = String(content).split('\n');
        for (var i = 1; i <= lines.length; i++) {
          var line = lines[i-1];
          var pos = line.search("</body>");
          if (pos != -1) {
            //output += "###indent=" + pos + '\n';
            var ins = "";
            ins += '\n';
            var indent = "  ";

            ins += indent + "<a href=\"/<?= docker_module_route ?>/\">/<?= docker_module_route ?>/</a> link handled by <?= docker_module_name ?><br />" + '\n' + '\n';
               
            line = ins + line;
          }
          output += line + '\n';
        }
        
        return(output);  
      }

    });

    this.fs.copyTpl(this.destinationPath(the_router_dir+'/resources/index.html'), this.destinationPath(the_router_dir+'/resources/index.html'),
    subs,{ delimiter: "?"} );


/*
    this.fs.copy( this.templatePath('pom.xml'), this.destinationPath(this.answers.haa_module_dir + '/pom.xml'));
    this.fs.copy( this.templatePath('target/java-xsahaa.war'), this.destinationPath(this.answers.haa_module_dir + '/target/java-xsahaa.war'));


// https://github.com/sboudrias/mem-fs-editor
	  
    this.fs.copy( this.destinationPath('mta.yaml'), this.destinationPath('mta.yaml'), {
	    process: function (content) {
		var doc = yaml.safeLoad(content);
		var found = false;

		if (Array.isArray(doc.modules)) {
	        	doc.modules.forEach(function(module) { 
				if (module.name === "<?= haa_module_app ?>") {
					found = true;
				} 
			}
			);
		}
		else {
			doc.modules = [];
		}
		if (!found) {
			doc.modules.push(  
    {
      "name": "<?= haa_module_app ?>",
      "type": "java",
      "path": "<?= haa_module_dir ?>",
      "parameters": {
        "memory": "800M",
        "buildpack": "sap_java_buildpack"
      },
      "properties": {
        "TARGET_RUNTIME": "tomee",
        "SAP_JWT_TRUST_ACL": "[{\"clientid\":\"*\", \"identityzone\": \"*\"}]",
        "JBP_CONFIG_RESOURCE_CONFIGURATION": "['tomee/webapps/ROOT/WEB-INF/resources.xml': {'xsahaa-hdi-container':'<?= haa_hdi_svc_name ?>'}]"
      },
      "provides": [
        {
          "name": "<?= haa_module_app ?>",
          "properties": {
            "url": "${default-url}"
          }
        }
      ],
      "requires": [
        {
          "name": "<?= haa_uaa_res_name ?>"
        },
        {
          "name": "<?= haa_hdi_res_name ?>"
        }
      ]
    }
			);

		}
		return(yaml.safeDump(doc));  
	    }});
	
	  // Now make the name substitutions
	  // How to pass these values in when running not as a subgenerator but prompt for them if so?
	  // Passed in values override prompted for values.
	  
	  if(typeof(this.options.haa_uaa_res_name) !== "undefined") { this.answers.haa_uaa_res_name = this.options.haa_uaa_res_name; }
	  if(typeof(this.options.haa_hdi_res_name) !== "undefined") { this.answers.haa_hdi_res_name = this.options.haa_hdi_res_name; }
	  if(typeof(this.options.haa_hdi_svc_name) !== "undefined") { this.answers.haa_hdi_svc_name = this.options.haa_hdi_svc_name; }

    this.fs.copyTpl(this.destinationPath('mta.yaml'),this.destinationPath('mta.yaml'),{ 
	    haa_module_app: this.answers.docker_module_name,
	    haa_module_dir: this.answers.haa_module_dir,
            haa_uaa_res_name: this.answers.haa_uaa_res_name,
            haa_hdi_res_name: this.answers.haa_hdi_res_name,
            haa_hdi_svc_name: this.answers.haa_hdi_svc_name
    },{ delimiter: "?"} );
*/
  }

  install() {
    // this.installDependencies();
    this.log("Double check your mta.yaml file.");
  }

  end() {
    this.config.save();
  }
};

