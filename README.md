# creact-comp
Simple CLI tool to speed up development by allowing you to create react components with customizations and templates.

## Installation
Make sure to install this module globally so you can run the command from anywhere.
```bash
$ npm install -g creact-comp
```
## Or via github repo
Clone Repository
```bash
$ git clone https://github.com/zicsus/creact-comp.git
```
Navigate to the repo
```bash
$ cd creact-comp
```
Lastly, link repo so that you can execute anywhere
```bash
$ npm link
```

## Usage

### Version
```bash
$ creact-comp -v
```
Or
```bash
$ creact-comp --version
```

### Help
```bash
$ creact-comp -h
```
Or
```bash
$ creact-comp --help
```


### Create component
Usage: 
```bash
$ creact-comp <componentName> [options]
```
Options:

      -d                  Creates a [component name] directory with component file inside.
      -sl, --stateless      Creates a stateless component.
      -jsx                  Creates the component with `.jsx` extenstion. (Default is `.js`)
      -css, -less, -scss  Create and choose your css preprocessor to generate.
      -t <templateName>     Choose your template from which component will be generated. (By default base templates will be used).

### Create template
With creact-comp you can create your own templates and use them to generate components.
```bash
$ creact-comp -st <templatePath> <templateName>
```
Or
```bash
$ creact-comp --save-template <yourTemplatePath> <templateName>
```
Once template is created you can delete your template. creact-comp saves template to its src directory.
Note: If template with same name already exists than it will be overwritten.

#### Example
Let's create a template with some components already imported
```js
import React, { Component } from 'react';
import axios from 'axios';
import Btn from '../btn/Btn.js';
{%style%} // creact-comp will replace this with style preprocessor option. If you don't want this you can simply remove this.
class {%componentName%} extends Component { // creact-comp will replace this with componentName.
 render() {
    return (
      <div>
        { this.props.children }
      </div>
    );
  }
}

export default {%componentName%};
```