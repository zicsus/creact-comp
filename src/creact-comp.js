'use strict';

const fs = require("fs");
const path = require("path");
const pck = require("../package.json");

module.exports = function ()
{
	const STATE_TEMPLATE_PATH = path.join(__dirname, "/templates/state.template");
	const STATELESS_TEMPLATE_PATH = path.join(__dirname, "/templates/stateless.template");
	const Styles = {
		NONE: -1,
		CSS: 0,
		SCSS: 1,
		LESS: 2
	};

	// Get the present working directory.
	const pwd = process.cwd();

	// Parse arguments
	const args = process.argv.splice(2);
	if (args.length === 0)
	{
		error("Error: component name not provided;");
	}

	if (args[0].startsWith("-"))
	{
		resolveFlag(args[0]);
	}
	else
	{
		parse();
	}

	function resolveFlag(flag)
	{
		switch (flag)
		{
			case "--version":
			case "-v":
			{
				console.log(pck.version);
				break;
			}

			case "--help":
			case "-h":
			{
				let message = "HELP\n";
				message += "  creact-comp -v/--version              Know the version of creact-comp.\n";
				message += "  creact-comp -st/--save-template       Create new template.\n";
				message += "  creact-comp <componentName> [options] Create new component.\n";
				message += "\n  Options:\n";
				message += "    -d	                Creates a [component name] directory with component file inside.\n";
				message += "    -sl, --stateless	Creates a stateless component.\n";
				message += "    -jsx                Creates the component with `.jsx` extenstion. (Default is `.js`)\n";
				message += "    -css, -less, -scss  Create and choose your css preprocessor to generate.\n";
				message += "    -t <templateName>   Choose your template from which component will be generated. (By default base templates will be used)\n"      
      
				console.log(message);
				break;
			}

			case "--save-template":
			case "-st":
			{
				saveTemplate();
				break;
			}

			default: 
			{
				error("ERROR: Flag not recognized.");
				break;
			}
		}
	}

	function saveTemplate()
	{
		args.splice(0, 1);
		if (args.length >= 2)
		{
			const templatePath = path.join(pwd, args[0]);
			const templateName = args[1];

			if (templateName.startsWith("-"))
			{
				error("ERROR: Template name cannot start with '-'.");
				process.exit();
			}

			try 
			{
				fs.copyFileSync(templatePath, path.join(__dirname, `/templates/${templateName}.template`));
				console.log("Template saved !!");
				console.log("You can use this template by typing-");
				console.log(`creact-comp <componentName> -t ${templateName}`);
			}
			catch(err)
			{
				error([
					"ERROR: Failed to copy template.",
					err
				]);
			}
		}
		else
		{
			error("ERROR: Provide template path and template name.");
		}
	}

	function parse()
	{
		let state = true,
			style = Styles.NONE,
			stylesheet = "",
			jsx = false,
			dir = false,
			useTemplate = false,
			templateName = "";

		const componentName = args[0];
		args.splice(0, 1);

		for (let i = 0; i < args.length; i++)
		{
			let arg = args[i];
			switch (arg)
			{
				case "--stateless": 
				case "-sl":
				{
					state = false;
					break;
				}

				case "-css": 
				{
					style = Styles.CSS;
					stylesheet = `${componentName}.css`;
					break;
				}

				case "-scss": 
				{
					style = Styles.SCSS;
					stylesheet = `${componentName}.scss`;
					break;
				}

				case "-less": 
				{
					style = Styles.LESS;
					stylesheet = `${componentName}.less`;
					break;
				}

				case "-jsx": 
				{
					jsx = true;
					break;
				}

				case "-d": 
				{
					dir = true;
					break;
				}

				case "-t":
				{
					useTemplate = true;
					break;
				}

				default:
				{
					if (useTemplate)
					{
						if (arg && !arg.startsWith("-"))
						{
							templateName = arg;
							useTemplate = false;
						}
						else
						{
							error("ERROR: Enter valid template name.");
						}
					}
					break;
				}
			}
		}

		createComponent(
			componentName, 
			dir, 
			state, 
			style, 
			stylesheet, 
			jsx,
			templateName
		);
	} 

	function createComponent(componentName, 
			dir, 
			state, 
			style, 
			stylesheet, 
			jsx,
			templateName)
	{
		let code;
		if (templateName)
		{
			try 
			{
				const templatePath = path.join(__dirname, `/templates/${templateName}.template`);
				code = fs.readFileSync(templatePath, "utf8");
			}
			catch (err)
			{
				error([
					"ERROR: Unable to read template.",
					err
				]);
			}
		}
		else
		{
			if (state)
			{
				code = fs.readFileSync(STATE_TEMPLATE_PATH, "utf8");
			}
			else
			{
				code = fs.readFileSync(STATELESS_TEMPLATE_PATH, "utf8");
			}
		}

		// Replace values
		code = code.replace(/{%componentName%}/g, componentName);
		if (style !== Styles.NONE)
		{
			code = code.replace(/{%style%}/g, `import './${stylesheet}'`);
		}
		else
		{
			code = code.replace(/{%style%}/g, '');
		}

		let compDir = pwd;
		if (dir)
		{
			compDir = path.join(pwd, componentName);
			if (!fs.existsSync(compDir))
			{
			    fs.mkdirSync(compDir);
			}
		}

		let fileName = componentName;
		if (jsx)
		{
			fileName += ".jsx";
		}
		else
		{
			fileName += ".js";
		}

		fs.writeFileSync(path.join(compDir, fileName), code);
		if (style !== Styles.NONE)
		{
			fs.writeFileSync(path.join(compDir, stylesheet), "");
		}
	}

	function error(messages)
	{
		if (Array.isArray(messages))
		{
			for (let i in messages)
			{
				console.log(messages[i]);
			}
		}
		else
		{
			console.log(messages);
		}

		process.exit();
	}
}