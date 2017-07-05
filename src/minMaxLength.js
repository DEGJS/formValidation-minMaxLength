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
    let settings = Object.assign({}, defaults, options);

    const getSettings = () => {
        return settings;
    }

    const isRelevant = (field) => {
        return field.inputEls.some(el => el.getAttribute(settings.minAttr) !== null || el.getAttribute(settings.maxAttr) !== null);
    }

    const validate = (field) => {
        return new Promise(function(resolve, reject) {
            if (field.inputEls) {
                resolve({
                    valid: field.inputEls.some(el => {
                    	return meetsMin(el) && meetsMax(el);
                    }
                });
            } else {
                reject('required: No inputs set.');
            }
        });
    }

    const meetsMin = (el) => {
		let minVal = el.getAttribute(settings.minAttr);
		return minVal === null ? true : el.value.length >= parseInt(minVal);
	}

	const meetsMax = (el) => {
		let maxVal = inputEl.getAttribute(settings.maxAttr);
		return maxVal === null ? true : el.value.length <= parseInt(maxVal);
	}

    const postprocessMessage = (msg) => {
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

}

export default minMaxLength;