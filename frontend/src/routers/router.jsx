import {
    createBrowserRouter,
} from "react-router-dom";
import App from "../App";
import Home from "../pages/home/Home";
import Login from "../components/Login";
import Register from "../components/Register";
import CartPage from "../pages/books/CartPage";
import SingleBook from "../pages/books/SingleBook";
import OrderPage from "../pages/books/OrderPage";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import ManageBooks from "../pages/dashboard/manageBooks/ManageBooks";
import AddBook from "../pages/dashboard/addBooks/AddBook";
import EditBook from "../pages/dashboard/editBook/UpdateBook";
import ManageOrders from "../pages/dashboard/manageOrders/ManageOrders";
import ManageUsers from "../pages/dashboard/manageUsers/ManageUsers";
import ManageCoupons from "../pages/dashboard/manageEvents/ManageCoupons";
import AddCoupon from "../pages/dashboard/manageEvents/AddCoupon";
import ManageForms from "../pages/dashboard/manageForms/ManageForms";
import ManageRanks from "../pages/dashboard/manageRanks/ManageRanks";
import Shop from "../pages/home/Shop";
import Contact from "../pages/home/Contact";
import Points from "../pages/home/Points";
import UserDashboard from "../pages/user/UserDashboard";
import UserProfile from "../pages/user/UserProfile";
import UserSettings from "../pages/user/UserSettings";
import Favorites from "../pages/user/Favorites";
import Notifications from "../pages/user/Notifications";


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/shop",
                element: <Shop />,
            },
            {
                path: "/notifications",
                element: <PrivateRoute><Notifications /></PrivateRoute>,
            },
            {
                path: "/contact",
                element: <Contact />,
            },
            {
                path: "/points",
                element: <Points />,
            },
            {
                path: "/about",
                element: <div>About</div>,
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/register",
                element: <Register />,
            },
            {
                path: "/cart",
                element: <CartPage />,
            },
            {
                path: "/books/:id",
                element: <SingleBook />,
            },
            {
                path: "/user/dashboard",
                element: <PrivateRoute><UserDashboard /></PrivateRoute>,
                children: [
                    {
                        index: true,
                        element: <UserProfile />,
                    },
                    {
                        path: "profile",
                        element: <UserProfile />,
                    },
                    {
                        path: "orders",
                        element: <OrderPage />,
                    },
                    {
                        path: "favorites",
                        element: <Favorites />,
                    },
                    {
                        path: "settings",
                        element: <UserSettings />,
                    }
                ]
            }
        ]
    },

    {
        path:"/dashboard",
        element: <AdminRoute><DashboardLayout /></AdminRoute>,
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            {
                path: "add-new-book",
                element: <AdminRoute><AddBook /></AdminRoute>,
            },
            {
                path: "edit-book/:id",
                element: <AdminRoute><EditBook /></AdminRoute>,
            },
            {
                path:"manage-books",
                element: <AdminRoute><ManageBooks/></AdminRoute>,
            },
            {
                path:"manage-orders",
                element: <AdminRoute><ManageOrders/></AdminRoute>,
            },
            {
                path:"manage-users",
                element: <AdminRoute><ManageUsers/></AdminRoute>,
            },
            {
                path:"manage-coupons",
                element: <AdminRoute><ManageCoupons/></AdminRoute>,
            },
            {
                path:"add-coupon",
                element: <AdminRoute><AddCoupon/></AdminRoute>,
            },
            {
                path:"edit-coupon/:id",
                element: <AdminRoute><AddCoupon/></AdminRoute>,
            },
            {
                path:"manage-forms",
                element: <AdminRoute><ManageForms/></AdminRoute>,
            },
            {
                path:"manage-ranks",
                element: <AdminRoute><ManageRanks/></AdminRoute>,
            }

        ]
    }
]);

export default router;

