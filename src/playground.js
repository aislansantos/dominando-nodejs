// Arquivo somente para estudo do sequelize
import "./database";
// dentro do sequelize temos algumas formas de colocar operdores "AND"  e "=", por exemplo temos de importar Op
import { Op } from "sequelize";

import Customer from "./app/models/Customer";
import Contact from "./app/models/Contact";

class Playground {
    // findAll -> puxa todos os arquivos da base de dados dessa forma com todos os dados
    static async playAll() {
        const customers = await Customer.findAll();

        console.log(JSON.stringify(customers, null, 2));
    }

    static async playExclude() {
        // findAll -> puxa todos os arquivos da base de dados excluido alguns campos, se colocar atributes como array ele puxa aqueles atributos
        const customers = await Customer.findAll({
            attributes: { exclude: ["id", "status"] },
        });

        console.log(JSON.stringify(customers, null, 2));
    }

    static async play() {
        // findAll -> puxa todos os arquivos da base de dados excluido alguns campos, se colocar atributes como array ele puxa aqueles atributos puxa so nome nesse caso
        const customers = await Customer.findAll({
            attributes: ["name"],
        });

        console.log(JSON.stringify(customers, null, 2));
    }

    static async playSelect(nome) {
        // findOne -> não retorna um array, e limita a busca SQL a 1 registro com a clausula LIMIT, sem parametro retorna o primeiro registro
        const customer = await Customer.findOne(nome);

        console.log(JSON.stringify(customer, null, 2));
    }

    static async playSelectWhereSemOp() {
        // findAll -> mesmo retornando 1 com a clausula where ele ainda é um ARRAY
        const customer = await Customer.findAll({
            attributes: { exclude: ["status"] },
            where: {
                status: "ACTIVE",
            },
        });

        console.log(JSON.stringify(customer, null, 2));
    }

    static async playSelectPK(id) {
        // findByPk -> busca pelo "ID"(primary key) do registro
        const customer = await Customer.findByPk(id);

        console.log(JSON.stringify(customer, null, 2));
    }

    static async playSelectWhereComOp() {
        // findAll -> mesmo retornando 1 com a clausula where ele ainda é um ARRAY
        const customer = await Customer.findAll({
            where: {
                [Op.or]: {
                    status: {
                        [Op.in]: ["ACTIVE", "ARCHIVED"], // aqui ne siginifica tudo que não é igual, sobre os operadores a documentação do sequilize tem tudo. https://sequelize.org/docs/v6/core-concepts/model-querying-basics/
                    },
                    name: {
                        // para colocar uma clausula que deve contar parecido usar % percentual
                        // nesse exemplo buscando nome que tenha Augusto com qualquer coisa antes e depois
                        [Op.like]: "%Augusto%",
                    },
                },
                createdAt: {
                    // aqui buscamos por data de criação, com between que sempre vem dentro de um array para usarmos intervalos
                    [Op.between]: [
                        new Date(2021, 1, 1),
                        new Date(2023, 11, 16),
                    ],
                },
            },
        });

        console.log(JSON.stringify(customer, null, 2));
    }

    static async playSelectWithJoin() {
        const customer = await Customer.findAll({
            include: [
                {
                    model: Contact,
                    // quando não se tem o Where ele assumi o inner outer join, com o where vira inner Join
                    where: {
                        status: "ACTIVE",
                    },
                    // para mostrar até os registros sem contatos quando colocamos o where temos de colocar required: false
                    required: false,
                },
            ],
            where: {
                [Op.or]: {
                    status: {
                        [Op.in]: ["ACTIVE", "ARCHIVED"],
                    },
                    name: {
                        [Op.like]: "%Augusto%",
                    },
                },
                createdAt: {
                    [Op.between]: [
                        new Date(2021, 1, 1),
                        new Date(2023, 11, 16),
                    ],
                },
            },
            order: [["name", "DESC"], ["createdAt"]], // colocando o segundo paramentro como decrescente temos de colocar dentro de mais um array as sentenças
        });

        // SELECT * FROM customers ORDER BY name

        console.log(JSON.stringify(customer, null, 2));
    }

    static async playCount() {
        // o count pode ser simples
        const customer = await Customer.count();

        // O count pode também ter os seus includes e condições
        // const customer = await Customer.count({
        //     include: [
        //         {
        //             model: Contact,

        //             where: {
        //                 status: "ACTIVE",
        //             },

        //             required: false,
        //         },
        //     ],
        //     where: {
        //         [Op.or]: {
        //             status: {
        //                 [Op.in]: ["ACTIVE", "ARCHIVED"],
        //             },
        //             name: {
        //                 [Op.like]: "%Augusto%",
        //             },
        //         },
        //         createdAt: {
        //             [Op.between]: [
        //                 new Date(2021, 1, 1),
        //                 new Date(2023, 11, 16),
        //             ],
        //         },
        //     },
        //     order: [["name", "DESC"], ["createdAt"]],
        // });

        console.log(JSON.stringify(customer, null, 2));
    }

    static async playMax() {
        // O max é simples como o count, mais deve ser passada a função de agregação e o parametro da coluna que se quer contar
        const customers = await Customer.max("createdAt", {
            where: { status: "ACTIVE" },
        });

        console.log(JSON.stringify(customers, null, 2));
    }

    static async playMin() {
        // Para
        const customers = await Customer.min("createdAt", {
            where: { status: "ACTIVE" },
        });

        console.log(JSON.stringify(customers, null, 2));
    }

    // scopos -> são consultas que podem ser pré-criadas dentro do próprio models, para que sejam reutilizaveis em diversas situações/controllers
    static async playScope() {
        const customers = await Customer.scope([
            "active",
            "archived",
        ]).findAll();

        // const customers = await Customer.scope({
        //     method: ["created", new Date(2021, 12, 1)],
        // }).findAll();

        console.log(JSON.stringify(customers, null, 2));
    }

    static async playInsert() {
        const customer = await Customer.create({
            name: "Vidraçaria do Juca",
            email: "juca@vidro.com.br",
        });
        console.log(JSON.stringify(customer, null, 2));
    }

    static async playUpdate() {
        const customer = await Customer.findByPk(5);
        console.log("Antes: ", JSON.stringify(customer, null, 2));

        const newCustomer = await customer.update({ status: "ARCHIVED" });
        console.log("Depois: ", JSON.stringify(newCustomer, null, 2));
    }

    static async playDelete() {
        const customer = await Customer.findByPk(5);

        customer.destroy();
    }
}

// Playground.playAll();
// Playground.playExclude();
// Playground.play();
// Playground.playSelect();
// Playground.playSelectPK(2);
// Playground.playSelectWhereSemOp();
// Playground.playSelectWhereComOp();
// Playground.playSelectWithJoin();
// Playground.playCount();
// Playground.playMax();
// Playground.playMin();
// Playground.playScope();
// Playground.playInsert();
// Playground.playUpdate();
// Playground.playDelete();
