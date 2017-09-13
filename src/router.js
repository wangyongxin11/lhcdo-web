import Index from './views/layout/index.vue';
import Cockpit from './views/business/cockpit.vue';
import CalDefaultRate from './views/business/defaultRateTable.vue';

const routers = [
    {
        path: '/',
        meta: {
            title: '联合信用评级'
        },
        name:'index',
        redirect:'calDefaultRate',
        component: Index,
        children:[
            {
                path:'cockpit',
                component: Cockpit,
                name:'cockpit'
            },
            {
                path:'calDefaultRate',
                meta: {
                    title: '违约率计算'
                },
                component: CalDefaultRate,
                name:'calDefaultRate'
            }
        ]
    }

];

export default routers;