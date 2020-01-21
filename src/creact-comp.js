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
		console.log("Error: component name not provided;");
		process.exit();
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
				// Display docs
				break;
			}

			default: 
			{
				console.log("ERROR: Flag not recognized.");
				break;
			}
		}
	}

	function parse()
	{
		let state = true,
			style = Styles.NONE,
			stylesheet = "",
			jsx = false,
			dir = false;

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
			}
		}

		createComponent(componentName, dir, state, style, stylesheet, jsx);
	} 

	function createComponent(componentName, dir, state, style, stylesheet, jsx)
	{
		let code;
		if (state)
		{
			code = fs.readFileSync(STATE_TEMPLATE_PATH, "utf8");
		}
		else
		{
			code = fs.readFileSync(STATELESS_TEMPLATE_PATH, "utf8");
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

}