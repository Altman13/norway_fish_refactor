import Dep from './components/dep/Dep.js';
import Fiske from './components/fis/Fiske.js';
import Por from './components/por/Por.js';
import Main from './views/Main.js';
import Loop1 from './components/fis/loop1/Loop1.js';
import Dca from './components/dca/Dca.js';
import Cox from './components/cox/Cox.js';
import Coe from './components/coe/Coe.js';
import Sone from './components/sone/Sone.js';
import Loop6 from './components/dca/loop6/Loop6.js';
import Loop2 from './components/fis/loop2/Loop2.js';
import Loop3 from './components/fis/loop3/Loop3.js';
import Loop4 from './components/fis/loop4/Loop4.js';
import Loop5 from './components/fis/loop5/Loop5.js';
import Archive from './components/submenu/Archive.js';
import AUD from './components/submenu/AUD.js';
import Backup from './components/submenu/Backup.js';
import Favorite from './components/submenu/Favorite.js';
import Tra from './components/tra/Tra.js';
import Login from './components/auth/Login.js';
import DcaEdit from './components/dca/dcaEdit/DcaEdit.js';
import Firmware from './components/firmware/Firmware.js';

const pathToRegex = (path) => new RegExp('^' + path.replace(/\//g, '\\/').replace(/:\w+/g, '(.+)') + '$');
const getParams = (match) => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]];
    }));
};

const navigateTo = url => {
    history.pushState(null, null, url);
    router();
};

const router = async () => {
    const auth = localStorage.AUTH ? JSON.parse(localStorage.AUTH) : undefined;
    let routes;

    if (auth && auth.isLogin) {
        routes = [
            {path: '/', view: Main},
            {path: '/dep', view: Dep},
            {path: '/dep/:id', view: Dep},
            {path: '/por', view: Por},
            {path: '/fis', view: Fiske},
            {path: '/dca', view: Dca},
            {path: '/cox', view: Cox},
            {path: '/coe', view: Coe},
            {path: '/sone', view: Sone},
            {path: '/dca-edit', view: DcaEdit},
            {path: '/tra', view: Tra},
            {path: '/loop1', view: Loop1},
            {path: '/loop2', view: Loop2},
            {path: '/loop3', view: Loop3},
            {path: '/loop4', view: Loop4},
            {path: '/loop5', view: Loop5},
            {path: '/loop6', view: Loop6},
            {path: '/arch', view: Archive},
            {path: '/test', view: AUD},
            {path: '/backup', view: Backup},
            {path: '/fav', view: Favorite},
            {path: '/firmware', view: Firmware},
            {path: '/log-out', view: Login},
        ];
    } else {
        routes = [
            {path: '/', view: Login},
        ];
    }

    const potentialMatches = routes.map(route => {
        return {
            route: route,
            result: location.pathname.match(pathToRegex(route.path))
        };
    });

    let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);

    if (!match) {
        match = {
            route: routes[0],
            result: [location.pathname]
        };
    }

    const view = new match.route.view(getParams(match));

    document.querySelector('.dynamic-content').innerHTML = await view.getHtml();
};

window.addEventListener('popstate', router);

document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', (e) => {
        if (e.target.matches('[data-link]')) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
    });

    router();
});