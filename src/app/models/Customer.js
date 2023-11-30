import Sequelize, { Model, Op } from "sequelize";

class Customer extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
                email: Sequelize.STRING,
                status: Sequelize.ENUM("ACTIVE", "ARCHIVED"),
            },
            {
                /*
                Scopo -> para criar o escopo vamos criar o seguinte aqui, aqui vamos fazer um scopo pegando todos os ativos, o uso é da mesma forma que estavamos fazendo no nosso playground até usando where ou mesmo os Op
                Depois vamos aonde temos de usar o scopo no arquivo, por exemplo no arquivo playground
                */
                // Ficar atendo para não criar aqui regra de negócios
                scopes: {
                    active: {
                        where: {
                            status: "ACTIVE",
                        },
                    },
                    archived: {
                        where: {
                            name: "Studant Augusto",
                        },
                    },
                    // Parametro de scopo pode ser passado como se fosse uma função
                    created(date) {
                        return {
                            where: {
                                createdAt: {
                                    [Op.gte]: date,
                                },
                            },
                        };
                    },
                },
                // HOOKS -> dentro sequelize, são ganchos que sempre vem em função de um evento que vai ser realizado
                // Se quisermos fazer uma validação/ação antes do create podemos usar o beforeValidate
                // hooks: {
                //     beforeValidate: (customer, options) => {
                //         customer.status = "ARCHIVED";
                //     },
                // },
                sequelize,
                // sobre escrevendo o nome do propriedade quando usar os contacts.
                name: {
                    singular: "customer",
                    plural: "customers",
                },
            },
        );
    }

    static associate(models) {
        this.hasMany(models.Contact);
    }
}

export default Customer;
