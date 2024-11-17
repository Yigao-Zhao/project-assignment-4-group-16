export const NAVIGATION = [
    { id: '/admin/usermanage', label: 'User Management' },
    { id: '/admin/productsmanage', label: 'Product Management' },
];

export const router = {
    pathname: '/admin/users', // 当前路径，默认设置为用户管理页面
    navigate: (path) => {
        console.log(`Navigating to: ${path}`);
        router.pathname = path; // 更新当前路径（实际中可使用 React Router）
    },
};