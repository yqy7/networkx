import {browser} from "webextension-polyfill-ts";

// 打开devtools之后立刻创建panel并开始监听请求
browser.devtools.panels.create('NetworkX', 'icon-16.png', 'pages/networkx.html').then(panel => {
    console.log('创建panel', panel);
});

