import { langObj } from './lang.js';

const lang = {
    ru: document.querySelector('.lang-check-rus'),
    en: document.querySelector('.lang-check-eng'),
    no: document.querySelector('.lang-check-nor'),
};

for (const key in lang) {
    lang[key].onclick = () => {
        document.querySelectorAll('[val]').forEach((el) => {
            const val = el.getAttribute('val');
            console.log(langObj[val][key]);
            el.textContent = langObj[val][key];
        });
    };
}
