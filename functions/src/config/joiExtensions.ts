import * as Joi from 'joi';

export const JoiState = Joi.extend((joi) => ({
    base: joi.string(),
    name: 'state',
    language: {
        abbreviation: 'Invalid abbreviation: {{v}}'
    },
    rules: [
        {
            name: 'uf',
            validate(params, value, state, options) {
                const abbreviations = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 
                'PA', 'PB', 'PR', 'PE', 'PI', 'RR', 'RO', 'RJ', 'RN', 'RS', 'SC', 'SP', 'SE', 'TO'];

                if(abbreviations.indexOf(value) < 0 )
                    return joi.createError('state.abbreviation', { v: value }, state, options);
                
                return value;
            } //end validate
        } //end rule
    ] //end rules
}));

export const JoiDocument = Joi.extend((joi) => ({
    base: joi.string(),
    name: 'document',
    coerce(value, state, options) {
        const strValue = String(value);
        return strValue;
    },
    language: {
        invalidCpfFormat: 'Invalid Format',
        invalidCheckDigits: 'Invalid check digits: {{dv1}}{{dv2}}'
    },
    rules: [
        {
            name: 'cpf',
            validate(params, value, state, options) {
                const newValue = value.replace(/\D/g, '');
                const regex = RegExp(/[0-9]{11}/);
                if (!regex.test(newValue)) {
                    // Generate an error, state and options need to be passed
                    return joi.createError('document.invalidCpfFormat', { v: newValue }, state, options);
                }

                const rcpf: string = newValue.split("").reverse().join(""); //inverte o cpf
                let checkDigit1 = 0, checkDigit2 = 0;

                for (let i = 2; i < 11; i++) {
                    checkDigit1 += parseInt(rcpf[i]) * (9 - ((i - 2) % 10));
                    checkDigit2 += parseInt(rcpf[i]) * (9 - ((i - 1) % 10));
                }

                checkDigit1 = (checkDigit1 % 11) % 10;
                checkDigit2 += checkDigit1 * 9;
                checkDigit2 = (checkDigit2 % 11) % 10;

                if (checkDigit1 === parseInt(rcpf[1]) &&
                    checkDigit2 === parseInt(rcpf[0])) {
                    return newValue;
                } else {
                    return joi.createError('document.invalidCheckDigits', 
                        { v: newValue, dv1: checkDigit1, dv2: checkDigit2 }, state, options);
                }
            } //end validate
        } //end rule
    ] //end rules
}));

