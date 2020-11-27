import * as React from "react";

import '../styles/networkx-table.scss';
import {Drawer, Table, Tabs} from "antd";
import {useEffect, useState} from "react";

const { TabPane } = Tabs;

function urlName(url: string) {
    let url0 = new URL(url)
    let pathname = url0.pathname;
    if (pathname === '/') {
        return url0.hostname;
    }
    if (pathname.lastIndexOf('/') == pathname.length - 1) {
        pathname = pathname.substring(0, pathname.length - 1);
        return pathname.substring(pathname.lastIndexOf('/') + 1) + '/';
    }
    return pathname.substring(pathname.lastIndexOf('/') + 1);
}

const columnHelper = {
    'Name': (req: any) => urlName(req.request.url),
    'Path': (req: any) => new URL(req.request.url).pathname,
    'Url': (req: any) => req.request.url,
    'Method': (req: any) => req.request.method,
    'Status': (req: any) => req.response.status,
    'Protocol': (req: any) => req.response.httpVersion,
    'Scheme': (req: any) => new URL(req.request.url).protocol,
    'Domain': (req: any) => new URL(req.request.url).hostname,
    'Remote Address': (req: any) => req.serverIPAddress,
    'Type': (req: any) => req._resourceType,
    'Initiator': (req: any) => req._initiator.type,
    // 'Cookies': (req: any) => req,
    // 'Set Cookies': (req: any) => req,
    'Size': (req: any) => req.response.content?.size,
    'Time': (req: any) => req.time.toFixed() + ' ms',
    'Priority': (req: any) => req._priority,
    'Connection ID': (req: any) => req.connection,
}

const columns = Object.keys(columnHelper).map(s => {
    return {
        title: s,
        dataIndex: s,
        key: s,
        ellipsis: true,
    }
});

function CookieTable(props: any) {
    let request = props.request;
    if (!request) {
        return null;
    }

    let requestCookies = request.request.cookies;
    let responseCookies = request.response.cookies;

    let columns = [
        {title: 'Name', dataIndex: 'name', key: 'name', width: 150, ellipsis: true,},
        {title: 'Value', dataIndex: 'value', key: 'value', width: 150, ellipsis: true,},
        {title: 'Domain', dataIndex: 'domain', key: 'domain', width: 150, ellipsis: true,},
        {title: 'Path', dataIndex: 'path', key: 'path', width: 150, ellipsis: true,},
        {title: 'HttpOnly', dataIndex: 'httpOnly', key: 'httpOnly', width: 150, ellipsis: true,},
        {title: 'Expires', dataIndex: 'expires', key: 'expires', width: 150, ellipsis: true,},
        {title: 'Secure', dataIndex: 'secure', key: 'secure', width: 150, ellipsis: true,},
    ];

    let requestCookiesDataSource = requestCookies.map((cookie, index) => {
        return Object.assign({key: index}, cookie);
    });

    let responseCookiesDataSource = responseCookies.map((cookie, index) => {
        return Object.assign({key: index}, cookie);
    });

    return (
      <div>
          <h3>Request Cookies</h3>
          <Table dataSource={requestCookiesDataSource} columns={columns} pagination={false} size='small'/>
          <hr/>
          <h3>Response Cookies</h3>
          <Table dataSource={responseCookiesDataSource} columns={columns} pagination={false} size='small'/>
      </div>
    );
}

function DrawerContent(props: any) {
    let request = props.request;
    if (!request) {
        return null;
    }

    let [responseContent, setResponseContent] = useState('');
    useEffect(() => {
        request.getContent(function (content: string, encoding: string) {
            setResponseContent(content);
        });
    }, [request]);


    return (
        <Tabs defaultActiveKey="1">
            <TabPane tab="Headers" key="1">
                <div>
                    <h3>Request headers</h3>
                    {
                        request.request.headers.map((header, index) => {
                            return (
                                <div key={index}>
                                    <strong>{header.name}: </strong>
                                    <span>{header.value}</span>
                                </div>
                            )
                        })
                    }
                </div>
                <hr/>
                <div>
                    <h3>Response headers</h3>
                    {
                        request.response &&
                        request.response.headers.map((header, index) => {
                            return (
                                <div key={index}>
                                    <strong>{header.name}: </strong>
                                    <span>{header.value}</span>
                                </div>
                            )
                        })
                    }
                </div>
            </TabPane>
            <TabPane tab="Preview" key="2">

            </TabPane>
            <TabPane tab="Response" key="3">
                {
                    responseContent
                }
            </TabPane>
            <TabPane tab="Initiator" key="4">

            </TabPane>
            <TabPane tab="Timing" key="5">

            </TabPane>
            <TabPane tab="Cookies" key="6">
                <CookieTable request={request}/>
            </TabPane>
        </Tabs>
    );
}

let count = 0;
function NetworkxTable(props: any) {
    console.log('NetworkxTable count: ', count++);

    let [drawerVisible, setDrawerVisible] = useState(false);
    let [selectedRow, setSelectedRow] = useState(null);

    let requests = props.requests;
    let dataSource = requests.map((req, index) => {
        let row = {key: index};
        Object.keys(columnHelper).forEach(s => {
            row[s] = columnHelper[s](req);
        });
        row['_req'] = req;
        return row;
    });

    let onRow = record => {
        return {
            onClick: () => {
                setDrawerVisible(true);
                setSelectedRow(record);
            }
        }
    };

    const onDrawerClose = function () {
        setDrawerVisible(false);
        setSelectedRow(null);
    }

    return (
        <div className="networkx-table">
            <Table columns={columns}
                   dataSource={dataSource}
                   size="small"
                   onRow={onRow}
                   pagination={false}
                   sticky={true}
                   />

            {   drawerVisible &&
                <Drawer
                    placement="right"
                    onClose={onDrawerClose}
                    width={'50%'}
                    visible={drawerVisible}
                    getContainer={false}>

                    <DrawerContent request={selectedRow?._req} />

                </Drawer>
            }
        </div>
    );
}

export default NetworkxTable;
