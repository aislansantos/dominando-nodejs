module.exports = {
    dialect: "postgres",
    host: "localhost",
    username: "postgres",
    password: "1234",
    database: "teste-dominando-nodejs",
    define: {
        timestamp: true, // cria duas colunas: createdAt e updatedAt
        underscored: true,
        underscoredAll: true,
    },
};
