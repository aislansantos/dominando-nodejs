import { Router } from "express";

import auth from "./app/middlewares/auth";

import sessions from "./app/controllers/sessionsController";
import customers from "./app/controllers/customersController";
import contacts from "./app/controllers/contactsController";
import users from "./app/controllers/usersController";

const routes = new Router();

//* Sessions
routes.post("/sessions", sessions.create);

// ! Controla o acesso a partir desse ponto
routes.use(auth);

//* Customers
routes.get("/customers", customers.index);
routes.get("/customers/:id", customers.show);
routes.post("/customers", customers.create);
routes.put("/customers/:id", customers.update);
routes.delete("/customers/:id", customers.destroy);

//* Contacts
// TODO: Como estamos trabalhando com os contatos de um determinado customer vamos trabalhar com rotas aninhadas.
routes.get("/customers/:customerId/contacts", contacts.index);
routes.get("/customers/:customerId/contacts/:id", contacts.show);
routes.post("/customers/:customerId/contacts", contacts.create);
routes.put("/customers/:customerId/contacts/:id", contacts.update);
routes.delete("/customers/:customerId/contacts/:id", contacts.destroy);

//* Users
routes.get("/users", users.index);
routes.get("/users/:id", users.show);
routes.post("/users", users.create);
routes.put("/users/:id", users.update);
routes.delete("/users/:id", users.destroy);

export default routes;
