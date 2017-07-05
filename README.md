# formValidation-minMaxLength
A minlength/maxlength rule for the DEGJS formValidation module.

# formValidation-minMaxLength
A minlength/maxlength rule module for the DEGJS [formValidation](https://github.com/DEGJS/formValidation) module.


## Install
formValidation-minMaxLength is an ES6 module. Consequently, you'll need an ES6 transpiler ([Babel](https://babeljs.io) is a nice one) and a module loader ([SystemJS](https://github.com/systemjs/systemjs) will do the job) as part of your Javascript workflow.

If you're already using [JSPM package manager](http://jspm.io) for your project, you can install formValidation-minMaxLength with the following command:

```
$ jspm install github:DEGJS/formValidation-minMaxLength
```

Installing formValidation rule modules via JSPM will automatically install the base formValidation module.


## Usage
After importing, formValidation rule modules can be instantiated by passing an array of names into a formValidation options object:

```js
import formValidation from "DEGJS/formValidation";

/* Import the Pattern rule module */
import minMaxLength from "DEGJS/formValidation-minMaxLength";

let validationOptions = {
    rules: [
        minMaxLength
    ]
};

/* Instantiate the formValidation module on an element */
let formElement = document.querySelector('.form');
let validationInst = formValidation(formElement, validationOptions);
```

Optionally, default rule settings can be overridden by instantiating the rule as a function and passing options as an object: 
```js
let validationOptions = {
    rules: [
        minMaxLength({
            message: 'Please enter between [minToken] and [maxToken] characters.',
            events: [
                'focusout',
                'submit'
            ]
        })
    ]
};
```

formValidation-minMaxLength builds upon the HTML5 `maxlength` validation pattern, and also adds a custom `data-minlength` attribute for extending native functionality. Therefore, after instantiating the rule module, a field in the validation instance will be tested by this rule simply by setting the `data-minlength` and `maxlength` of a field's input.

This rule module contains its own default validation message. However, this message can be overridden by adding a data attribute at the field or form level (in that order of importance).

Because we may want to customize the validation message based on messages set on DOM elements, this module also makes use of token values that can be set in the rule's settings, or customized via a callback function.

Sample Markup:
```html
<form class="form" data-validation-minmaxlength-message="This message will override the default rule message, and only use [minToken].">
    <fieldset>
        <div class="js-validation-field" data-validation-minmaxlength-message="This message will override both the default rule message and the form element message, and only use [maxToken].">
            <label for="username">Username</label>
            <input data-minlength="1" maxlength="100" type="text" id="username" name="username">
        </div>
        <button type="submit">Submit</button>
    </fieldset>
</form>
```


## Options

#### options.message
Type: `String`  
Default: `Please enter a value between [minToken] and [maxToken] characters.`  
The default message displayed when a field fails this rule's validation test.

#### options.messageAttr
Type: `String`  
Default: `data-validation-minmaxlength-message`  
The data attribute formValidation will check when determining [message hierarchy](https://github.com/DEGJS/formValidation#configuring-error-messages)

#### options.events
Type: `Array`  
Default: `['focusout','submit']`  
An array of DOM events that will cause the rule to run validation on a field (or the entire form, when using `submit`). NOTE: `focusout` should be used in place of `blur` due to event bubbling limitations.

#### options.minAttr
Type: `String`  
Default: `data-minlength`  
The data attribute the rule will check when determining minimum length.

#### options.maxAttr
Type: `String`  
Default: `maxlength`  
The data attribute the rule will check when determining maximum length.

#### options.minToken
Type: `String`  
Default: `[minToken]`  
The token the rule will replace with the calculated minlength value.

#### options.maxToken
Type: `String`  
Default: `[maxToken]`  
The token the rule will replace with the calculated maxlength value.

For more detailed usage instructions, see the [formValidation Usage](https://github.com/DEGJS/formValidation#usage) documentation.
