'use strict'

class Validator {
    constructor(form) {
        this.ruls = {
            name: /^[a-zа-яё]+$/i,
            phone: /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/,
            email: /^[\w._-]+@\w+\.[a-z]{2,4}$/i
        };
        this.errors = {
            name: 'Имя должно состоять только из букв',
            phone: 'Телефон должен соответствовать шаблону +7(777)777-77-77',
            email: 'Электронная почта должна соответствовать шаблону: mymail@mail.ru'
        };
        this.form = form;
        this.valid = false;
        this._validForm();
        this.errorClass = 'error_msg';
    }
    validate(regexp, value) {
        regexp.test(value);
    }

    _validForm() {
        let errors = [...document.getElementById(this.form).querySelectorAll(`.${this.errorClass}`)];
        for (let error of errors) {
            error.remove();
        }

        let inputs = [...document.getElementById(this.form).getElementsByTagName('input')];
        for (let field of inputs) {
            this._validate(field);
        }
        if (![...document.getElementById(this.form).querySelectorAll('.invalid')].length) {
            this.valid = true;
        }
    }

    _validate(field) {
        if (this.ruls[field.name]) {
            if (!this.ruls[field.name].test(field.value)) {
                field.classList.add('invalid');
                this._toFollowFields(field);
                this._addErrMsg(field);
            }
        }
    }

    _toFollowFields(field) {
        field.addEventListener('input', () => {
            let error = field.parentNode.querySelector(`.${this.errorClass}`);
            if (this.ruls[field.name].test(field.value)) {
                field.classList.add('valid');
                field.classList.remove('invalid');
                if (error) {
                    error.remove();
                }
            } else {
                field.classList.remove('valid');
                field.classList.add('invalid');
                if (!error) {
                    this._addErrMsg(field);
                }
            }
        })
    }

    _addErrMsg(field) {
        let error = `<p class = "${this.errorClass}">${this.errors[field.name]}</p>`;
        field.parentNode.insertAdjacentHTML('beforeend', error);
    }


}