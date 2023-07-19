import { expect } from 'expect';
import { sendResponse, getResult, previousResults } from './api/index';

describe('sendResponse', () => {
  it('should return a successful response', async () => {
    const response = await sendResponse({
      body: JSON.stringify({
        name: 'luis',
        answers: [3, 1, 0, 2],
      }),
    });

    expect(response.statusCode).toEqual(201);
    expect(JSON.parse(response.body)).toEqual({
      resultId: expect.any(String),
      __hypermedia: {
        href: expect.any(String),
        query: { id: expect.any(String) },
      },
    });
  });
});

describe('getResult', () => {
  it('should return the result if it exists', async () => {
    const resultId = 'random-uuid';
    const result = {
      name: 'luis',
      correctAnswers: 2,
      totalAnswers: 4,
    };
    previousResults.set(resultId, result);

    const response = await getResult({
      pathParameters: { id: resultId },
    });

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual(result);
  });

  it('should return a 404 error if the result does not exist', async () => {
    const response = await getResult({
      pathParameters: { id: 'non-existent-id' },
    });

    expect(response.statusCode).toEqual(404);
    expect(JSON.parse(response.body)).toEqual({
      error: 'Result not found',
    });
  });
});
 