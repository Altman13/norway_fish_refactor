import AbstractView from "../../views/AbstractView.js";
import {observer} from "../../utils/observer/observer.js";
import {findElement} from "../utils/managmentDOM/controlElement.js";
import {useHttp} from "../../utils/useHttp.js";
import {state} from "../../utils/state/state.js";

let loginData;

const login = () => {
    const dc = document.querySelector('.dynamic-content');
    localStorage.removeItem('AUTH');

    const logicLogin = () => {
        findElement('.burger-content').innerHTML = '';
        findElement('.header-content').innerHTML = '';
        findElement('.footer-content').innerHTML = '';

        const login = findElement('.callsign-field');
        const password = findElement('.password-field');
        const submit = findElement('.auth-btn');

        if (loginData) {
            login.value = loginData;
        }

        const auth = () => {
            if (login.value && password.value) {
                const auth = {
                    login: login.value,
                    password: password.value
                };
                useHttp(`${state.url}/api/auth/login`, 'POST', {auth: auth})
                    .then(req => {
                        if (req) {
                            localStorage.AUTH = JSON.stringify({
                                isLogin: req,
                                login: login.value
                            });
                            window.location.href = '/';
                        }
                    });
            }
        }

        submit.onclick = () => {
            auth();
        }

        password.onkeypress = (event) => {
            if (event.keyCode === 13) {
                auth();
            }
        }
    }

    observer(dc, logicLogin);
    return '';
}

export default class extends AbstractView {

    constructor(params) {
        super(params);
        this.setTitle('Login');
    }

    getData = async (callback) => {
        const name = await useHttp(`${state.url}/api/auth/login`);
        return callback(name);
    }

    login = (data) => {
        loginData = data;
        return '';
    }

    loginTemplate = () =>
        `
        <main class="form-signin text-center d-flex align-content-center align-items-center justify-content-center position-fixed overflow-auto" style="width: 100%; height: 80%; top: 0; left: 0;">
            <form>
                <img class="mb-4" src="/static/icons/person-circle.svg" alt="" width="72" height="57">
                <h1 class="h3 mb-3 fw-normal">Sign in</h1>
                
                <div class="form-floating mb-3">
                    <input type="text" class="form-control callsign-field" id="floatingInput" placeholder="Callsign">
                    <label for="floatingInput">Operator</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="password" class="form-control password-field" id="floatingPassword" placeholder="Password">
                    <label for="floatingPassword">Password</label>
                </div>
                
                <button class="w-100 auth-btn btn btn-lg btn-primary" type="button">Sign in</button>
            </form>
        </main>
    `

    getHtml = async () =>
        `       
        ${this.loginTemplate()}
        ${await this.getData(this.login)}
        ${login()}
    `
}