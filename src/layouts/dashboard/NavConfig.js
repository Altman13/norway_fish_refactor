// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: 'Arkiv',
    path: '/archive/',
    icon: getIcon('material-symbols:menu-book-sharp'),
  },
  {
    title: 'Test melding',
    path: '/aud/',
    icon: getIcon('ic:outline-message'),
  },
  {
    title: 'Favoritter',
    path: '/favorite/',
    icon: getIcon('ic:baseline-anchor'),
  },
  // {
  //   title: 'Backup',
  //   path: '/backup/',
  //   icon: getIcon('eva:people-fill'),
  // },

  // {
  //   title: 'Hjelp',
  //   path: '/help/',
  //   icon: getIcon('eva:people-fill'),
  // },

  {
    title: 'Update software',
    path: '/upload/',
    icon: getIcon('material-symbols:security-update-good-outline-sharp'),
  },

  {
    title: 'Logg ut',
    path: '/login',
    icon: getIcon('ic:baseline-logout'),
  },

];

export default navConfig;
