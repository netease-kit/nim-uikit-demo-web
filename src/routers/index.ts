export const routes = [
  {
    exact: true,
    path: '/',
    redirect: '/main',
  },
  {
    path: '/main',
    component: '@/pages/index',
    routes: [
      {
        path: '/main/chat',
        component: '@/pages/Chat/index',
      },
      {
        path: '/main/addressBook',
        component: '@/pages/AddressBook/index',
      },
      { component: '@/pages/Chat/index' },
    ],
  },
];
