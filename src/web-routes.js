import { aboutController } from "./controllers/about-controller.js";
import { accountsController } from "./controllers/accounts-controller.js";
import { dashboardController } from "./controllers/dashboard-controller.js";
import { placeController } from "./controllers/placemark-controller.js";

export const webRoutes = [
  { method: "GET", path: "/", config: accountsController.index },
  { method: "GET", path: "/signup", config: accountsController.showSignup },
  { method: "GET", path: "/login", config: accountsController.showLogin },
  { method: "GET", path: "/logout", config: accountsController.logout },
  { method: "POST", path: "/register", config: accountsController.signup },
  { method: "POST", path: "/authenticate", config: accountsController.login },
  { method: "POST", path: "/updateUser", config: accountsController.update },
  { method: "GET", path: "/editAccount", config: accountsController.edit },

  { method: "GET", path: "/addPlace", config: placeController.add },
  { method: "POST", path: "/addPlace", config: placeController.save },

  { method: "GET", path: "/about", config: aboutController.index },

  { method: "GET", path: "/dashboard", config: dashboardController.index },
  { method: "POST", path: "/addCategory", config: dashboardController.addCategory },
  { method: "GET", path: "/deleteCategory/{id}", config: dashboardController.deleteCategory },
  { method: "POST", path: "/editCategory/{id}", config: dashboardController.editCategory },
  { method: "GET", path: "/{param*}", handler: { directory: { path: "../public" } }, options: { auth: false } }
];
