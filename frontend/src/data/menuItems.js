import { BookOpenIcon, PencilSquareIcon, UserPlusIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/solid'

const menuItems = [
    {
        path: '/',
        title: "博客列表",
        iconColor: '',
        isActive: true,
        component: BookOpenIcon,
    },
    {
        path: '/blogmanager',
        title: "管理博客",
        iconColor: '',
        isActive: false,
        component: PencilSquareIcon,
    },
    {
        path: '/usermanager',
        title: "管理用户",
        iconColor: '',
        isActive: false,
        component: UserPlusIcon,
    },
];

export default menuItems;