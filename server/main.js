/****************************************************
 * Propriedade de BrunoSoft. Todos os direitos reservados.
 *
 * O uso não autorizado deste código é estritamente proibido.
 * Qualquer reprodução, modificação ou distribuição sem permissão é uma violação de direitos autorais.
 ****************************************************/

const axios = require("axios");
const fastify = require("fastify")({ logger: false });
const cors = require("@fastify/cors");

fastify.register(cors, {
  origin: "*",
  methods: ["GET", "PUT", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

const PORT = 1212;
const API_KEY = "";
const BASE_URL = "https://quizapi.io/api/v1/questions";
const CATEGORY = "code";
const LIMIT = 10;

// Parâmetros da solicitação
const requestConfig = {
  params: {
    API_KEY,
    CATEGORY,
    LIMIT,
  },
};

let result = "";

const makeRequest = async (url) => {
  try {
    url = BASE_URL + url;
    const response = await axios.get(url, requestConfig);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(`Erro na solicitação: ${error.message}`);
    throw error;
  }
};

fastify.get("/favicon.ico", async (request, reply) => {
  reply.status(204).send();
});

fastify.get("/", async (request, reply) => {
  try {
    const response = await makeRequest("");
    return reply.send(response);
  } catch (error) {
    return reply.send(error);
  }
});

fastify.get("/dif/:difficulty", async (request, reply) => {
  const difficulty = request.params.difficulty;
  const queryParams = difficulty ? `&difficulty=${difficulty}` : "";
  try {
    const response = await makeRequest(queryParams);
    return reply.send(response);
  } catch (error) {
    return reply.send(error);
  }
});

fastify.get("/:language", async (request, reply) => {
  const language = request.params.language;
  const difficulty = request.query.difficulty;

  const validDifficulties = ["easy", "medium", "hard"];

  if (difficulty && !validDifficulties.includes(difficulty)) {
    return reply
      .code(400)
      .send({ error: "Invalid difficulty parameter.", difficulty });
  }

  const queryParams = `&tags=${language}${
    difficulty ? `&difficulty=${difficulty}` : ""
  }`;

  try {
    const response = await makeRequest(queryParams);
    console.log(response);
    return reply.send(response);
  } catch (error) {
    return reply.send(error);
  }
});

const start = async () => {
  try {
    await fastify.listen({ port: PORT });
    fastify.log.info(`Servidor iniciado em: http://localhost:${PORT}`);
    console.log(`Servidor iniciado em: http://localhost:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
