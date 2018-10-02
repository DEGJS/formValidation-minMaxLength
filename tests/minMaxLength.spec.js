import minMaxLength from '../src/minMaxLength';

describe('Form Validation: minMaxLength', () => {
    describe('settings', () => {
        it ('should have default message', () => {
            const expectedVal = 'Please enter a value between [minToken] and [maxToken] characters.';
            const minMaxLengthInst = minMaxLength();
            const settings = minMaxLengthInst.settings;
            
            expect(settings).toBeDefined();
            expect(settings).toHaveProperty('message');
            expect(settings.message).toEqual(expectedVal);
        });

        it('should have default messageAttr', () => {
            const expectedVal = 'data-validation-minmaxlength-message';
            const minMaxLengthInst = minMaxLength();
            const settings = minMaxLengthInst.settings;
            
            expect(settings).toBeDefined();
            expect(settings).toHaveProperty('messageAttr');
            expect(settings.messageAttr).toEqual(expectedVal);
        });

		it('should have default minAttr', () => {
			const expectedVal = 'data-minlength';
            const minMaxLengthInst = minMaxLength();
            const settings = minMaxLengthInst.settings;
            
            expect(settings).toBeDefined();
            expect(settings).toHaveProperty('minAttr');
            expect(settings.minAttr).toEqual(expectedVal);
		});

		it('should have default maxAttr', () => {
			const expectedVal = 'maxlength';
            const minMaxLengthInst = minMaxLength();
            const settings = minMaxLengthInst.settings;
            
            expect(settings).toBeDefined();
            expect(settings).toHaveProperty('maxAttr');
            expect(settings.maxAttr).toEqual(expectedVal);
		});

		it ('should have default minToken', () => {
			const expectedVal = '[minToken]';
            const minMaxLengthInst = minMaxLength();
            const settings = minMaxLengthInst.settings;
            
            expect(settings).toBeDefined();
            expect(settings).toHaveProperty('minToken');
            expect(settings.minToken).toEqual(expectedVal);
		});

		it('should have default maxToken', () => {
			const expectedVal = '[maxToken]';
            const minMaxLengthInst = minMaxLength();
            const settings = minMaxLengthInst.settings;
            
            expect(settings).toBeDefined();
            expect(settings).toHaveProperty('maxToken');
            expect(settings.maxToken).toEqual(expectedVal);
		});

		it('should have default events', () => {
            const minMaxLengthInst = minMaxLength();
            const settings = minMaxLengthInst.settings;
            
            expect(settings).toBeDefined();
            expect(settings).toHaveProperty('events');
            expect(settings.events).toHaveLength(2);
            expect(settings.events).toContain('focusout');
            expect(settings.events).toContain('submit');
        });


        it('should overwrite defaults, if values passed in', () => {
            const newSettings = {
				minToken: '{{minToken}}',
				maxToken: '[[{maxToekn}]]'
            };
            const expectedVal = {
                message: 'Please enter a value between [minToken] and [maxToken] characters.',
				messageAttr: 'data-validation-minmaxlength-message',
				minAttr: 'data-minlength',
				maxAttr: 'maxlength',
				minToken: '{{minToken}}',
				maxToken: '[[{maxToekn}]]',
				events: [
					'focusout',
					'submit'
				]
            };

            const minMaxLengthInst = minMaxLength(newSettings);
            expect(minMaxLengthInst.settings).toEqual(expectedVal);
        });
    });    

    describe('isRelevant', () => {
        it('should return true if some input has a minAttr', () => {
            const mockField = {
                inputEls: [
                    {
                        getAttribute: () => null
                    },
                    {
                        getAttribute: () => null
                    },
                    {
                        getAttribute: attr => attr === 'data-minlength' ? 'minMaxLength' : null
                    }
                ]
            }
            const minMaxLengthInst = minMaxLength();
            expect(minMaxLengthInst.isRelevant(mockField)).toEqual(true);
		});
		
		it('should return true if some input has a maxAttr', () => {
            const mockField = {
                inputEls: [
                    {
                        getAttribute: () => null
                    },
                    {
                        getAttribute: () => null
                    },
                    {
                        getAttribute: attr => attr === 'maxlength' ? 'minMaxLength' : null
                    }
                ]
            }
            const minMaxLengthInst = minMaxLength();
            expect(minMaxLengthInst.isRelevant(mockField)).toEqual(true);
        });

        it('should return false if no inputs have minAttr or maxAttr', () => {
            const mockField = {
                inputEls: [
                    {
                        getAttribute: () => null
                    },
                    {
                        getAttribute: () => null
                    },
                    {
                        getAttribute: () => null
                    }
                ]
            }
            const minMaxLengthInst = minMaxLength();
            expect(minMaxLengthInst.isRelevant(mockField)).toEqual(false);
        });
    });

    describe('postprocessMessage', () => {
        it('should call postprocessMessage if defined and is function', () => {
			const postprocessMessage = jest.fn(msg => 'The message made it.');
            const settings = {
                postprocessMessage
			};
			const expectedSettings = {
				message: 'Please enter a value between [minToken] and [maxToken] characters.',
				messageAttr: 'data-validation-minmaxlength-message',
				minAttr: 'data-minlength',
				maxAttr: 'maxlength',
				minToken: '[minToken]',
				maxToken: '[maxToken]',
				events: [
					'focusout',
					'submit'
				],
				postprocessMessage
			}
            const mockMessage = 'I am a mock message.';
            const minMaxLengthInst = minMaxLength(settings);
            const retVal = minMaxLengthInst.postprocessMessage(mockMessage);

            expect(settings.postprocessMessage).toHaveBeenCalled();
            expect(settings.postprocessMessage).toHaveBeenCalledWith(mockMessage, expectedSettings);
            expect(retVal).toEqual('The message made it.');
        });

        it('should return msg if not function', () => {
            const settings = {
                postprocessMessage: 'I am not a function'
            };
            const mockMessage = 'I am a mock message.';
            const minMaxLengthInst = minMaxLength(settings);
            const retVal = minMaxLengthInst.postprocessMessage(mockMessage);

            expect(retVal).toEqual(mockMessage);
        });

        it('should return msg if no postprocessMessage', () => {
            const mockMessage = 'I am a mock message.';
            const minMaxLengthInst = minMaxLength();
            const retVal = minMaxLengthInst.postprocessMessage(mockMessage);

            expect(retVal).toEqual(mockMessage);
		});

		describe('getMinMaxValues', () => {
			it('should replace minToken with min val of first invalid el', () => {
				const mockMessage = 'Please be at least [minToken].';
				const minVal = '5';
				const mockField = {
					inputEls: [
						{
							getAttribute: attr => attr === 'maxlength' ? '10' : minVal,
							value: 'testtest'
						},
						{
							getAttribute: attr => attr === 'maxlength' ? '10' : minVal,
							value: 'test'
						}
					]
				}
				const minMaxLengthInst = minMaxLength();
				const retVal = minMaxLengthInst.postprocessMessage(mockMessage, mockField);

				expect(retVal).toEqual(`Please be at least ${minVal}.`);
			});

			it('should replace maxToken with max val of first invalid el', () => {
				const mockMessage = 'Please be less than [maxToken].';
				const maxVal = '10';
				const mockField = {
					inputEls: [
						{
							getAttribute: attr => attr === 'maxlength' ? maxVal : '5',
							value: 'testtest'
						},
						{
							getAttribute: attr => attr === 'maxlength' ? maxVal : '5',
							value: 'testtesttest'
						}
					]
				}
				const minMaxLengthInst = minMaxLength();
				const retVal = minMaxLengthInst.postprocessMessage(mockMessage, mockField);

				expect(retVal).toEqual(`Please be less than ${maxVal}.`)
			});

			it('should not replace min token if no val found', () => {
				const mockMessage = 'Please be at least [minToken].';
				const minVal = '5';
				const mockField = {
					inputEls: [
						{
							getAttribute: attr => attr === 'maxlength' ? '10' : minVal,
							value: 'testtest'
						},
						{
							getAttribute: attr => attr === 'maxlength' ? '10' : minVal,
							value: 'testtest'
						}
					]
				}
				const minMaxLengthInst = minMaxLength();
				const retVal = minMaxLengthInst.postprocessMessage(mockMessage, mockField);

				expect(retVal).toEqual(mockMessage);
			});

			it('should not replace max token if no val found', () => {
				const mockMessage = 'Please be less than [maxToken].';
				const maxVal = '10';
				const mockField = {
					inputEls: [
						{
							getAttribute: attr => attr === 'maxlength' ? maxVal : '5',
							value: 'testtest'
						},
						{
							getAttribute: attr => attr === 'maxlength' ? maxVal : '5',
							value: 'testtest'
						}
					]
				}
				const minMaxLengthInst = minMaxLength();
				const retVal = minMaxLengthInst.postprocessMessage(mockMessage, mockField);

				expect(retVal).toEqual(mockMessage);
			});
		});
		
    });

    describe('validate', () => {
        it('should reject if no inputs', async () => {
            const mockField = {};
            const minMaxLengthInst = minMaxLength();
            await expect(minMaxLengthInst.validate(mockField)).rejects.toEqual('minMaxLength: No inputs set.');
		});
		
		it('should return true if input has no value', async () => {
			const mockField = {
				inputEls: [
					{
						value: ''
					}
				]
			}
            const expectedResponse = {valid: true};
            const minMaxLengthInst = minMaxLength();
            await expect(minMaxLengthInst.validate(mockField)).resolves.toEqual(expectedResponse);
		})

        it('should return true if input meets min', async () => {
			const minVal = '5';
			const mockField = {
				inputEls: [
					{
						getAttribute: attr => attr === 'maxlength' ? '10' : minVal,
						value: 'tests'
					}
				]
			}
            const expectedResponse = {valid: true};
            const minMaxLengthInst = minMaxLength();
            await expect(minMaxLengthInst.validate(mockField)).resolves.toEqual(expectedResponse);
		});
		
		it('should return true if input is lower than max', async () => {
            const maxVal = '10';
			const mockField = {
				inputEls: [
					{
						getAttribute: attr => attr === 'maxlength' ? maxVal : '5',
						value: 'tests'
					}
				]
			}
            const expectedResponse = {valid: true};
            const minMaxLengthInst = minMaxLength();
            await expect(minMaxLengthInst.validate(mockField)).resolves.toEqual(expectedResponse);
        });

        it('should return true if input meets min and max', async () => {
			const minVal = '5';
			const maxVal = '10';
			const mockField = {
				inputEls: [
					{
						getAttribute: attr => attr === 'maxlength' ? maxVal : minVal,
						value: 'tests'
					}
				]
			}
            const expectedResponse = {valid: true};
            const minMaxLengthInst = minMaxLength();
            await expect(minMaxLengthInst.validate(mockField)).resolves.toEqual(expectedResponse);
        });

    	it('should return false if input val does meet min', async () => {
            const minVal = '5';
			const maxVal = '10';
			const mockField = {
				inputEls: [
					{
						getAttribute: attr => attr === 'maxlength' ? maxVal : minVal,
						value: 'test'
					}
				]
			}
            const expectedResponse = {valid: false};
            const minMaxLengthInst = minMaxLength();
            await expect(minMaxLengthInst.validate(mockField)).resolves.toEqual(expectedResponse);
		});
		
		it('should return false if input val exceeds max', async () => {
            const minVal = '5';
			const maxVal = '10';
			const mockField = {
				inputEls: [
					{
						getAttribute: attr => attr === 'maxlength' ? maxVal : minVal,
						value: 'testtesttest'
					}
				]
			}
            const expectedResponse = {valid: false};
            const minMaxLengthInst = minMaxLength();
            await expect(minMaxLengthInst.validate(mockField)).resolves.toEqual(expectedResponse);
        });

    });
})