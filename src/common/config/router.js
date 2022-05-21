/**
 * 规则：
 * 一、例如：index/index,shop/index以index结尾的，path和name默认去除index
 * 二、shop/list,默认生成name为shop_list(如果结尾为index,例如shop/index则是shop)
 * 三、填写后不会自动生成
 */

//路由配置
let routes = [
    {
        path: '/',
        name: 'layout',
        redirect: { //重定向
            name: 'index'
        },
        component: 'layout',
        children: [
            {
                path: '/index',
                name: 'index',
                component: 'index/index',
            },
            {
                path: '/shop/goods/list',
                name: 'list',
                component: 'shop/goods/list',
            }
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: 'login/index'
    },
    {
        path: '*',
        redirect: { //重定向
            name: 'index'
        },
    }
]

// 获取路由信息方法component
let getRoutes = function () {
    // 自动生成路由
    createRoute(routes);
    return routes;
}

//自动生成路由
function createRoute(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (!arr[i].component) return; //没有设置路由直接返回
        // 去除index
        let val = getValue(arr[i].component);

        // 自动生成component
        let componentFun = import(`../../views/${arr[i].component}.vue`);
        arr[i].component = () => componentFun; //拼接路由信息
        if (arr[i].children && arr[i].children.length > 0) { //有子路由继续循环
            createRoute(arr[i].children)
        }
    }
}

//结尾是index的去除index
function getValue(str) {
    //获取最后一个/的索引
    let index = str.lastIndexOF('/');

    //获取最后一个/后面的值
    let val = str.substring(index + 1, str.length);

    // 判断是不是index结尾
    if (val === 'index') {
        return str.substring(index, -1);
    }
    return str;
}

export default getRoutes();