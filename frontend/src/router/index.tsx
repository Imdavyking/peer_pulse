import { useRoutes } from "react-router-dom";
import Home from "../views/home/main";
import NotFound from "../views/not-found/main";
import CreateLoan from "../views/create-loan/main";
import AcceptLoanForm from "../views/accept-loan/main";
import PayLoan from "../views/pay-loan/main";
import LockCollaterial from "../views/lock-collaterial/main";
function Router() {
  const routes = [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
    {
      path: "/create-loan",
      element: <CreateLoan />,
    },
    {
      path: "/accept-loan",
      element: <AcceptLoanForm />,
    },
    {
      path: "/pay-loan",
      element: <PayLoan />,
    },
    {
      path: "/lock-collateral",
      element: <LockCollaterial />,
    },
  ];
  return useRoutes(routes);
}

export default Router;
