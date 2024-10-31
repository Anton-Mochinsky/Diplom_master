

export const validateUsername = (name: string): boolean => {
				//только латинские буквы и цифры, первый символ — буква, длина от 4 до 20 символов
				if (name.trim() === '' || name.trim().length < 4 || name.trim().length >= 20) return false;
				let regex = /^[a-z][a-z|0-9]*/gmi;
				return regex.test(name)
}

export const validatePassword = (pwd: string): boolean => {
				//не менее 6 символов: как минимум одна заглавная буква, одна цифра и один специальный символ.
				if (pwd.trim() === '' || pwd.trim().length < 6 || pwd.trim().length >= 200) return false;
				let regexLetter = /[A-Z]/gm;
				let regexDigit = /[0-9]/gm;
				let regexSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/? ]/gm;
				return regexLetter.test(pwd) && regexDigit.test(pwd) && regexSpecial.test(pwd)
}

export const validateEmail = (email: string): boolean => {
				const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
				return re.test(email)
}