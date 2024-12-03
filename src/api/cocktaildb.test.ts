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

  it.only('should return drinks that contain all specified ingredients', async () => {
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
    expect(result[0]).toEqual({ idDrink: '2', strDrink: 'Drink2' });
    expect(result[1]).toEqual({ idDrink: '5', strDrink: 'Drink5' });
    expect(result.length).toEqual(2);
  });

  it('should return an empty array if no drinks contain all specified ingredients', async () => {
    const mockDrinks1 = { drinks: [{ idDrink: '1', strDrink: 'Drink1' }] };
    const mockDrinks2 = { drinks: [{ idDrink: '2', strDrink: 'Drink2' }] };

    nock(API_BASE_URL)
      .get(filterAPI)
      .query({ i: 'coffee' })
      .reply(200, mockDrinks1);

    nock(API_BASE_URL)
      .get(filterAPI)
      .query({ i: 'rum' })
      .reply(200, mockDrinks2);

    const result = await searchByMultipleIngredients(['coffee', 'rum']);
    expect(result).toEqual([]);
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