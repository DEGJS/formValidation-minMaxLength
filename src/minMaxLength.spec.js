import minMaxLength from './minMaxLength';
import expect from 'expect';

describe('minMaxLength', () => {
	it('should return true if some elements have atttibute', () => {
		const instance = minMaxLength({});
		const input = {
			getAttribute: attribute => {
			
				if (attribute ==='data-minlength' || attribute ==='maxlength') {
					return true;
				}
				return null;
			}
		};

		const field = {
			inputEls: [
				input
			]
		}
		expect(instance.isRelevant(field)).toEqual(true);
	})

	it('should return false if no elements have atttibute', () => {
		const instance = minMaxLength({});
		const input = {
			getAttribute: attribute => {
				return null;
			}
		};

		const field = {
			inputEls: [
				input,
				input
			]
		}
		expect(instance.isRelevant(field)).toEqual(false);
	})
})
