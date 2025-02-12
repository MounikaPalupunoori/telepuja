import LoginPage from '../pages/login.jsx';
import SignupPage from '../pages/signup.jsx';
import HomePage from '../pages/Home/home.jsx';
import AboutPage from '../pages/about.jsx';
import FormPage from '../pages/form.jsx';
import TemplesPage from '../pages/temples.jsx';
import PurohitsPage from '../pages/purohits.jsx';
import ProfilePage from '../pages/profile.jsx';
import NotificationsPage from '../pages/notifications.jsx';
import MessagesPage from '../pages/messages.jsx';
import ChatsPage from '../pages/chats.jsx';
import ServicesPage from '../pages/Services/services.jsx';
import TransactionsPage from '../pages/transactions.jsx';
import MyWalletPage from '../pages/mywallet.jsx';
import Bookingpage from '../pages/booking.jsx';
import ConfirmBookingPage from '../pages/confirmbooking.jsx';
import MyPujasPage from '../pages/mypujas.jsx';
import ForgotPasswordPage from '../pages/forgotpassword.jsx';
import ContactUsPage from '../pages/contactus.jsx';
import DonationPage from '../pages/donation.jsx';
import ChangePasswordPage from '../pages/changepassword.jsx';
import DynamicRoutePage from '../pages/dynamic-route.jsx';
import RequestAndLoad from '../pages/request-and-load.jsx';
import TransactionDetailsPage from '../pages/transactionDetails.jsx';
import FavouritesPage from '../pages/favouritesPage.jsx';
import InviteFriendsPage from '../pages/invitefriends.jsx';
import NotFoundPage from '../pages/404.jsx';
import SideNavBar from '../pages/sidenav.jsx';



var routes = [
  {
    path: '/',
    component: LoginPage,
  },
  {
    path: '/signup/',
    component: SignupPage,
  },
  {
    path: '/home/',
    component: HomePage,
  },
  {
    path: '/about/',
    component: AboutPage,
  },
  {
    path: '/form/',
    component: FormPage,
  },
  {
    path: '/temples/',
    component: TemplesPage,
  },
  {
    path: '/purohits/',
    component: PurohitsPage,
  },
  {
    path: '/notifications/',
    component: NotificationsPage,
  },
  {
    path: '/profile/',
    component: ProfilePage,
  },
  {
    path: '/services/:id',
    component: ServicesPage,
  },
  {
    path: '/booking/:id',
    component: Bookingpage,
  },
  {
    path: '/confirmbooking/:id',
    component: ConfirmBookingPage,
  },
  {
    path: '/mywallet/',
    component: MyWalletPage,
  },
  {
    path: '/donation/',
    component: DonationPage,
  },
  {
    path: '/mypujas/',
    component: MyPujasPage,
  },
  {
    path: '/messages/',
    component: MessagesPage,
  },
  {
    path: '/forgotpassword/',
    component: ForgotPasswordPage,
  },
  {
    path: '/transactions/',
    component: TransactionsPage,
  },
  {
    path: '/contactus/',
    component: ContactUsPage,
  },
  {
    path: '/changepassword/',
    component: ChangePasswordPage,
  },
  {
    path: '/chats/',
    component: ChatsPage,
  },
  {
    path: '/transactionDetails/',
    component: TransactionDetailsPage,
  },
  {
    path: '/favouritesPage/',
    component: FavouritesPage,
  },
  {
    path: '/invitefriends/',
    component: InviteFriendsPage,
  },
  {
    path: '/dynamic-route/blog/:blogId/post/:postId/',
    component: DynamicRoutePage,
  },
  {
    path:'/sidenav/',
    component: SideNavBar,
  },
  {
    path: '/request-and-load/user/:userId/',
    async: function ({ router, to, resolve }) {
      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // User ID from request
      var userId = to.params.userId;

      // Simulate Ajax Request
      setTimeout(function () {
        // We got user data from request
        var user = {
          firstName: 'Vladimir',
          lastName: 'Kharlampidi',
          about: 'Hello, i am creator of Framework7! Hope you like it!',
          links: [
            {
              title: 'Framework7 Website',
              url: 'http://framework7.io',
            },
            {
              title: 'Framework7 Forum',
              url: 'http://forum.framework7.io',
            },
          ]
        };
        // Hide Preloader
        app.preloader.hide();

        // Resolve route to load page
        resolve(
          {
            component: RequestAndLoad,
          },
          {
            props: {
              user: user,
            }
          }
        );
      }, 1000);
    },
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;
