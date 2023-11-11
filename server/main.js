const fastify = require("fastify")({ logger: false });
const axios = require("axios");
const cors = require("@fastify/cors");

fastify.register(cors, {
  origin: "*", 
  methods: ["GET", "PUT", "POST"], 
  allowedHeaders: ["Content-Type", "Authorization"], 
});

const API_KEY = "write your api key here!!!";
const URL_REQUEST = `https://quizapi.io/api/v1/questions?apiKey=${API_KEY}&category=code&limit=10`;

function capitalize(str) {
  if (typeof str !== "string" || str.length === 0) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const makeRequest = async (url) => {
  try {
    const response = await axios.get(URL_REQUEST + url);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Erro na resposta do servidor:", error.response.data);
    } else if (error.request) {
      console.error("Sem resposta do servidor:", error.request);
    } else {
      console.error("Erro na configuração da requisição:", error.message);
    }
    throw error;
  }
};

fastify.get("/", async (request, reply) => {
  try {
    const response = await makeRequest("");
    return reply.send(response);
  } catch (error) {
    console.error("Erro ao fazer requisição:", error);
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
    console.error("Erro ao fazer requisição:", error);
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

  const queryParams = `&tags=${language}${difficulty ? `&difficulty=${difficulty}` : ""}`;

  try {
    const response = await makeRequest(queryParams);
    return reply.send(response);
  } catch (error) {
    console.error("Erro ao fazer requisição:", error);
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
