
// Constructor function
function Validator(options) {

    function getParent(element, selector) {

        while(element.parentElement) {
            if(element.parentElement.matches(selector))
            return element.parentElement;
        }
        element = element.parentElement;

    }

    let selectorRules = {};

    function validate(inputElement, rule) {
        // Trỏ lại thằng cha của inputElement xong chọn select .form-messgae
        let errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
        let errorMessage; //= rule.test(inputElement.value); // Lấy ra lỗi

        // Lấy rules của selector
        let rules = selectorRules[rule.selector];
       

        // Lặp qua từng rule và kiểm tra, nếu có lỗi thì break luôn
        for(let rul of rules) {
            errorMessage = rul(inputElement.value);
            if(errorMessage) break;
        }

        // Nếu lỗi tồn tại thì set text cho .form-message và thêm class invalid
        // Ngược lại set text rỗng và remove class invalid
        if (errorMessage) {
            errorElement.innerText = errorMessage;
            getParent(inputElement, options.formGroupSelector).classList.add('invalid');
        } else {
            errorElement.innerText = '';
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
        }

        return !!errorMessage;

    }
    // Lấy element của form cần validate
    const formElement = document.querySelector(options.form);

   if (formElement) {

       formElement.onsubmit = function(e) {
           let isFormValid = true;
           e.preventDefault();
           options.rules.forEach(function(rule) {
            let inputElement = formElement.querySelector(rule.selector);
            let isValid = validate(inputElement, rule);
            if(isValid) {
                isFormValid = false;
            }

           })

           if(isFormValid) {
               // Không có lỗi

               // Trường hợp submit với Javascript bằng API
               if(typeof options.onSubmit ==='function') {

                let enableInput = formElement.querySelectorAll('[name]:not([disable])');
   
                let formValue =  Array.from(enableInput).reduce(function(values, input) {
                    values[input.name] = input.value;
                    return values;
                }, {})
               
                options.onSubmit(formValue);
                       
                // Không submit mặc định
               } else {
                formElement.submit();
               }
           } else {
               // có lỗi
           }


       }

        // Chạy từng cái rule và xử lý (lắng nghe sự kiện blur, input)
       options.rules.forEach(function(rule) {

            // Lưu lại các rules cho mỗi input
            if (Array.isArray(selectorRules[rule.selector])) {

                selectorRules[rule.selector].push(rule.test);

            } else {
                selectorRules[rule.selector] = [rule.test];

            }

           // Lấy rule selector
           let inputElement = formElement.querySelector(rule.selector);

           // Lấy element của span hiển thị lỗi
           let errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
           
           // Nếu inputElement tồn tại thì thực hiện
           // onblur là sự kiện khi element mất focus thì nó xảy ra
           if (inputElement) {

            // Xử lý trường hợp blur khỏi input
               inputElement.onblur = function() {
                // id: rule.selector
                // value: inputElement.value
                validate(inputElement, rule);
               }
            // Xử lý trường hợp người dùng khi nhập input
               
               inputElement.oninput = function() {
                errorElement.innerText = '';
                getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
               }
           }
       });
   }
   

}

// Define rules
/** Nguyên tắc của rules
 * 1. Khi có lỗi => Trả ra message lỗi
 * 2. Khi hợp lệ => Không trả ra gì cả (undefined)
 */
Validator.isRequired = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
            return value.trim() ? undefined : message || 'Vui lòng nhập trường này';
        }
    }

}

Validator.isEmail = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
            let isValidEmail = validateEmail(value);

            return isValidEmail ? undefined : message || 'Trường này phải là email';

            
        }
    }
}

Validator.isCheckPassword = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
           let isValidPassWord = validatePassword(value);
           return isValidPassWord ? undefined : message || 'Giá trị nhập vào không hợp lệ';
        }
    }
}

Validator.isConfirmed = function(selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function(value) {
           return value === getConfirmValue() ? undefined : message || 'Giá trị nhập vào không chính xác';
        }
    }
}

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validatePassword(password) {
    // Ít nhất là 6 kí tự, phải có chữ thường, chữ hoa và số
    var passwordPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    return passwordPattern.test(password);
}

