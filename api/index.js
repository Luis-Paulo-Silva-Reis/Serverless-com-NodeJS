'use strict'
const { buildResponse } = require('./utils')
const { getUserByCredentials, saveResultsToDatabase, getResultById } = require('./database')
const { authorize, createToken, makeHash } = require('./auth')
const { countCorrectAnswers } = require('./responses')

function extractBody(event) {
  if (!event?.body) {
    return {
      name: "",
      answers: []
    };
  }

  return JSON.parse(event.body);
}



module.exports.login = async (event) => {
  const { username, password } = extractBody(event)
  const hashedPass = makeHash(password)

  const user = await getUserByCredentials(username, hashedPass)

  if (!user) {
    return buildResponse(401, { error: 'Invalid username or password' })
  }

  return buildResponse(200, { token: createToken(username, user._id) })
}

module.exports.sendResponse = async (event) => {
  console.log('Received Event:', event); // Adicione esta linha para verificar o conteúdo do evento antes da extração
  const authResult = await authorize(event);
  if (authResult.statusCode == 401) return authResult;

  const body = extractBody(event);
  console.log('Extracted Body:', body); // Adicione esta linha para verificar o corpo extraído do evento
  const { name, answers } = body;
  const result = countCorrectAnswers(name, answers);

  const insertedId = await saveResultsToDatabase(result);

  return buildResponse(201, {
    resultId: insertedId,
    __hypermedia: {
      href: `/results.html`,
      query: { id: insertedId }
    }
  });
};


module.exports.getResult = async (event) => {
  const authResult = await authorize(event)
  if (authResult.statusCode == 401) return authResult;

  const result = await getResultById(event.pathParameters.id)

  if (!result) {
    return buildResponse(404, {
      error: 'Result Not found'
    })
  }
  return buildResponse(200, result)
};

