import * as Yup from "yup";
import { Op } from "sequelize";
import { parseISO } from "date-fns";

import Contact from "../models/Contact";
import Customer from "../models/Customer";

class ContactsController {
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

        let where = { customer_id: req.params.customerId };
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

        const data = await Contact.findAll({
            where,
            include: [
                {
                    model: Customer,
                    attributes: ["id", "status"],
                    required: true,
                },
            ],
            order,
            limit,
            offset: limit * page - limit,
        });
        return res.status(200).json(data);
    }

    async show(req, res) {
        // usando o findOne conseguimos fazer um where no ID do Contact e do Customer
        const contact = await Contact.findOne({
            where: {
                customer_id: req.params.customerId,
                id: req.params.id,
            },
            // include: [Customer],
            // retirar os parametros de 	"customerId": 1 "customer_id": 1 da consulta
            attributes: { exclude: ["customerId", "customer_id"] },
        });

        // const contact = await Contact.findByPk(req.params.id, {
        //     include: [Customer],
        // });

        if (!contact) {
            return res.status(404).json();
        }

        return res.status(201).json(contact);
    }

    async create(req, res) {
        // vamos usar o yup para construir a validação dos dados antes de fazer o create do registro.
        // dentro do shape é onde é construida todas as validações de schema.
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            status: Yup.string().uppercase(),
        });
        // Validar o schema com o req.body
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: "Error on validate schema" });
        }

        // Dentro do req.body estão todos os dados em formato de json, que serão necessários para o cadastro novo.
        const contact = await Contact.create(req.body);

        return res.status(200).json(contact);
    }

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
        const contact = await Contact.findOne({
            where: {
                customer_id: req.params.customerId,
                id: req.params.id,
            },
            attributes: { exclude: ["customerId", "customer_id"] },
        });

        if (!contact) {
            return res.status(404).json();
        }

        // atualização no sequelize
        await contact.update(req.body);

        return res.status(200).json(contact);
    }

    async destroy(req, res) {
        const contact = await Contact.findOne({
            where: {
                customer_id: req.params.customerId,
                id: req.params.id,
            },
        });

        if (!contact) {
            return res.status(404).json();
        }

        await contact.destroy();

        // retornamos um json vazio como oarquivo foi deletado não faz sentido retornar um registro ali dentro.
        return res.status(200).json();
    }
}
export default new ContactsController();
