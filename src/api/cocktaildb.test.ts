import { describe, it, expect, beforeEach, afterEach, beforeAll } from 'vitest';
import nock from 'nock';
import { searchByMultipleIngredients } from './cocktaildb';

const API_BASE_URL = 'https://www.thecocktaildb.com';
const filterAPI = '/api/json/v1/1/filter.php';

describe('searchByMultipleIngredients', () => {
  beforeAll(() => {
    nock.disableNetConnect();
  });

  beforeEach(() => {
    nock.cleanAll();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('should return drinks that contain any specified ingredients', async () => {
    const mockDrinks1 = { drinks: [{ idDrink: '1', strDrink: 'Drink1' }, { idDrink: '2', strDrink: 'Drink2' }, { idDrink: '4', strDrink: 'Drink4' }, { idDrink: '5', strDrink: 'Drink5' }, { idDrink: '6', strDrink: 'Drink6' }] };
    const mockDrinks2 = { drinks: [{ idDrink: '2', strDrink: 'Drink2' }, { idDrink: '3', strDrink: 'Drink3' }, { idDrink: '5', strDrink: 'Drink5' }] };

    nock(API_BASE_URL)
      .get(filterAPI)
      .query({ i: 'coffee' })
      .reply(200, mockDrinks1);

    nock(API_BASE_URL)
      .get(filterAPI)
      .query({ i: 'rum' })
      .reply(200, mockDrinks2);

    const result = await searchByMultipleIngredients(['coffee', 'rum']);
    const results = result.map((drink) => drink.strDrink);
    expect(results).toEqual(['Drink1', 'Drink2', 'Drink4', 'Drink5', 'Drink6', 'Drink3']);
    expect(result.length).toEqual(6);
  });

  it('should handle errors gracefully', async () => {
    nock(API_BASE_URL)
      .get(filterAPI)
      .query({ i: 'coffee' })
      .replyWithError('API Error');

    nock(API_BASE_URL)
      .get(filterAPI)
      .query({ i: 'rum' })
      .replyWithError('API Error');

    const result = await searchByMultipleIngredients(['coffee', 'rum']);
    expect(result).toEqual([]);
  });
});