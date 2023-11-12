const fastify = require("fastify")({ logger: false });
const axios = require("axios");
const cors = require("@fastify/cors");

fastify.register(cors, {
  origin: "*", 
  methods: ["GET", "PUT", "POST"], 
  allowedHeaders: ["Content-Type", "Authorization"], 
});

const PORT = 1212;
const API_KEY = "write your api key here!!!";
const URL_REQUEST = `https://quizapi.io/api/v1/questions?apiKey=${API_KEY}&category=code&limit=10`;


let result = '';

const makeRequest = async (url) => {
  try {
    const fullURL = new URL(URL_REQUEST, url);
    console.log('url', fullURL.toString());
    const response = axios.get(fullURL.toString());
    console.log('status',response.status);
    console.log('data', response.data);
    if (response.status === 404) {

    } else {
      result = response.data;
      return result;
    }
  } catch (error) {
    throw Error;
  }
};

fastify.get("/", async (request, reply) => {
  try {
    const response = await makeRequest('');
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

  const queryParams = `&tags=${language}${difficulty ? `&difficulty=${difficulty}` : ""}`;

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
