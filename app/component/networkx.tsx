import * as React from "react";
import {useEffect, useReducer} from "react";

import '../styles/networkx.scss';
import NetworkxTable from "./networkx-table";
import {browser} from "webextension-polyfill-ts";

interface RequestsAction {
    type: string;
    payload: any
}

function requestsReducer(state: any, action: RequestsAction) {
    switch (action.type) {
        case 'add':
            let requests = state.requests.slice();
            requests.push(action.payload);
            return {...state, requests};
        case 'load':
            return {...state, requests: action.payload};
        default:
            break;
    }
    return state;
}

let count = 0;
function Networkx() {
    console.log('Networkx count: ', count++);

    const [state, dispatch] = useReducer(requestsReducer, {requests: []});

    useEffect(() => {
        // 初始化加载
        chrome.devtools.network.getHAR(function (harlog: any) {
            dispatch({
                type: 'load',
                payload: harlog.entries
            });

            browser.devtools.network.onRequestFinished.addListener(request => {
                dispatch({
                    type: 'add',
                    payload: request
                });
            });
        });
    }, []);

    return (
        <div className='networkx'>
            <NetworkxTable requests={state.requests} />
        </div>
    );
}

export default Networkx;
