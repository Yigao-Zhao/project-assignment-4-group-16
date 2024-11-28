export const NAVIGATION = [
    { id: '/admin/usermanage', label: 'User Management' },
    { id: '/admin/productsmanage', label: 'Product Management' },
];

export const router = {
    pathname: '/admin/users', 
    navigate: (path) => {
        console.log(`Navigating to: ${path}`);
        router.pathname = path; 
    },
};