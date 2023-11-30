import * as Yup from "yup";
import { Op } from "sequelize";
import { parseISO } from "date-fns";

import Customer from "../models/Customer";
import Contact from "../models/Contact";

class CustomersController {
    // Listagem dos registros(Customers)
    async index(req, res) {
        const {
            name,
            email,
            status,
            createdBefore,
            createdAfter,
            updatedBefore,
            updatedAfter,
            sort,
        } = req.query;

        const page = req.query.page || 1;
        const limit = req.query.limit || 25;

        let where = {};
        let order = [];

        if (name) {
            where = {
                ...where,
                name: {
                    [Op.iLike]: name,
                },
            };
        }
        if (email) {
            where = {
                ...where,
                email: {
                    [Op.iLike]: email,
                },
            };
        }
        if (status) {
            where = {
                ...where,
                status: {
                    [Op.iLike]: status,
                },
            };
        }

        if (status) {
            where = {
                ...where,
                status: {
                    [Op.in]: status
                        .split(",")
                        .map((item) => item.toUpperCase()),
                },
            };
        }
        if (createdBefore) {
            where = {
                ...where,
                createdAt: {
                    [Op.gte]: parseISO(createdBefore),
                },
            };
        }
        if (createdAfter) {
            where = {
                ...where,
                createdAt: {
                    [Op.lte]: parseISO(createdAfter),
                },
            };
        }

        if (updatedBefore) {
            where = {
                ...where,
                updatedAt: {
                    [Op.gte]: parseISO(updatedBefore),
                },
            };
        }

        if (updatedAfter) {
            where = {
                ...where,
                updatedAt: {
                    [Op.lte]: parseISO(updatedAfter),
                },
            };
        }

        console.log(where);

        if (sort) {
            order = sort.split(",").map((item) => item.split(":"));
        }

        const data = await Customer.findAll({
            where,
            include: [
                {
                    model: Contact,
                    attributes: ["id", "status"],
                },
            ],
            order,
            limit,
            offset: limit * page - limit,
        });
        return res.status(201).json(data);
    }

    // Recupera um registro especifico(Customer)
    async show(req, res) {
        const customer = await Customer.findByPk(req.params.id);

        if (!customer) {
            return res.status(404).json();
        }

        return res.status(201).json(customer);
    }

    // Cria um novo registro(Customer)
    async create(req, res) {
        // vamos usar o yup para construir a validação dos dados antes de fazer o create do registro.
        // dentro do shape é onde é construida todas as validações de schema.
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            status: Yup.string().uppercase(),
        });
        console.log(req.body);
        // Validar o schema com o req.body
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: "Error on validate schema" });
        }

        // Dentro do req.body estão todos os dados em formato de json, que serão necessários para o cadastro novo.
        const customer = await Customer.create(req.body);

        return res.status(200).json(customer);
    }

    // Atualiza um registro(Customer)
    async update(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            status: Yup.string().uppercase(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: "Error on validate schema" });
        }

        // Antes de retornar a o registro temos de validar tbm a existencia dele no DB
        const customer = await Customer.findByPk(req.params.id);

        if (!customer) {
            return res.status(404).json();
        }

        // atualização no sequelize
        await customer.update(req.body);

        return res.status(200).json(customer);
    }

    // Deleta um registro(Customer)
    async destroy(req, res) {
        const customer = await Customer.findByPk(req.params.id);

        if (!customer) {
            return res.status(404).json();
        }

        await customer.destroy();

        // retornamos um json vazio como oarquivo foi deletado não faz sentido retornar um registro ali dentro.
        return res.status(200).json();
    }
}

export default new CustomersController();
