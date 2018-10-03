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
                    valid: field.inputEls.some(el => el.value.length === 0 || (meetsMin(el) && meetsMax(el)))
                });
            } else {
                reject('minMaxLength: No inputs set.');
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

    function getMinMaxValues(field) {
        let minVal = settings.minToken;
        let maxVal = settings.maxToken;
        if (field.inputEls) {
            const invalidEls = field.inputEls.filter(el => !meetsMin(el) || !meetsMax(el));
            if (invalidEls.length) {
                minVal = invalidEls[0].getAttribute(settings.minAttr);
                maxVal = invalidEls[0].getAttribute(settings.maxAttr);
            }
        }
        return {
            minVal,
            maxVal
        }
    }

    function postprocessMessage(msg, field = {}) {
        if (settings.postprocessMessage && typeof settings.postprocessMessage === 'function') {
            return settings.postprocessMessage(msg, settings, field);
        } 

        const {minVal, maxVal} = getMinMaxValues(field);
        msg = msg.replace(settings.minToken, minVal);
        msg = msg.replace(settings.maxToken, maxVal);
        return msg;
    }

    return {
        settings: getSettings(),
        isRelevant: isRelevant,
        validate: validate,
        postprocessMessage: postprocessMessage
    };

};

export default minMaxLength;