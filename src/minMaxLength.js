const minMaxLength = (options) => {

    const defaults = {
        message: 'Please enter a value between [minToken] and [maxToken] characters.',
        messageAttr: 'data-validation-minmaxlength-message',
        minAttr: 'data-minlength',
        maxAttr: 'maxlength',
        minToken: '[minToken]',
        maxToken: '[maxToken]',
        events: [
            'focusout',
            'submit'
        ]
    };
    let settings = {...defaults, ...options};

    function getSettings() {
        return settings;
    }

    function isRelevant(field) {
        return field.inputEls.some(el => el.getAttribute(settings.minAttr) !== null || el.getAttribute(settings.maxAttr) !== null);
    }

    function validate(field) {
        return new Promise((resolve, reject) => {
            if (field.inputEls) {
                resolve({
                    valid: field.inputEls.some(el => meetsMin(el) && meetsMax(el))
                });
            } else {
                reject('required: No inputs set.');
            }
        });
    }

    function meetsMin(el) {
		const minVal = el.getAttribute(settings.minAttr);
		return minVal === null ? true : el.value.length >= parseInt(minVal);
	}

	function meetsMax(el) {
		const maxVal = el.getAttribute(settings.maxAttr);
		return maxVal === null ? true : el.value.length <= parseInt(maxVal);
	}

    function postprocessMessage(msg) {
        if (settings.postprocessMessage && typeof settings.postprocessMessage === 'function') {
            return settings.postprocessMessage(msg, settings);
        } else {
        	msg = msg.replace(settings.minToken, minVal);
        	msg = msg.replace(settings.maxToken, maxVal);
            return msg;
        }
    }

    return {
        settings: getSettings(),
        isRelevant: isRelevant,
        validate: validate,
        postprocessMessage: postprocessMessage
    };

};

export default minMaxLength;