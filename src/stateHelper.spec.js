import expect from 'expect';
import stateHelper from 'src/stateHelper';

describe('StateHelper', () => {
  it('transform to array', () => {
    expect(stateHelper.asArray(1)).toEqual([1]);
    expect(stateHelper.asArray(['2'])).toEqual(['2']);
    expect(stateHelper.asArray(undefined)).toEqual([]);
    expect(stateHelper.asArray(null)).toEqual([]);
  })
});

describe('StateHelper isEmptyQuery', () => {
  it('can test if a query is empty', () => {
    expect(stateHelper.isEmptyQuery({})).toEqual(true);
  })
});

describe('StateHelper updateFilter', () => {
  it('can add new key', () => {
    const initialFilter = {};
    const options = {key: 'datasetKey', value: '123', action: 'ADD'};
    const expectedResult = {
      must: {datasetKey: ['123']}
    };
    expect(stateHelper.getUpdatedFilter(initialFilter, options)).toEqual(expectedResult);
  });

  it('can add to existing key', () => {
    const initialFilter = {must: {taxonKey: [4]}};
    const options = {key: 'datasetKey', value: '123', action: 'ADD'};
    const expectedResult = {
      must: {datasetKey: ['123'], taxonKey: [4]}
    };
    expect(stateHelper.getUpdatedFilter(initialFilter, options)).toEqual(expectedResult);
  });

  it('can add multiple values to a key', () => {
    const initialFilter = {must: {datasetKey: ['old_dataset']}};
    const options = {key: 'datasetKey', value: ['new_dataset_1', 'new_dataset_2'], action: 'ADD'};
    const expectedResult = {
      must: {datasetKey: ['old_dataset', 'new_dataset_1', 'new_dataset_2']}
    };
    expect(stateHelper.getUpdatedFilter(initialFilter, options)).toEqual(expectedResult);
  });

  it('can remove existing key', () => {
    const initialFilter = {must: {datasetKey: ['123'], taxonKey: [4, 2]}};
    const options = {key: 'taxonKey', value: 2, action: 'REMOVE'};
    const expectedResult = {
      must: {datasetKey: ['123'], taxonKey: [4]}
    };
    expect(stateHelper.getUpdatedFilter(initialFilter, options)).toEqual(expectedResult);
  });

  it('can remove multiple entries from a key', () => {
    const initialFilter = {must: {datasetKey: ['dataset_1', 'dataset_2', 'dataset_3', 'dataset_4']}};
    const options = {key: 'datasetKey', value: ['dataset_2', 'dataset_4'], action: 'REMOVE'};
    const expectedResult = {
      must: {datasetKey: ['dataset_1', 'dataset_3']}
    };
    expect(stateHelper.getUpdatedFilter(initialFilter, options)).toEqual(expectedResult);
  });

  it('can clear a key', () => {
    const initialFilter = {must: {datasetKey: ['dataset_1', 'dataset_2', 'dataset_3', 'dataset_4'], taxonKey: [2]}};
    const options = {key: 'datasetKey', action: 'CLEAR'};
    const expectedResult = {
      must: {taxonKey: [2]}
    };
    expect(stateHelper.getUpdatedFilter(initialFilter, options)).toEqual(expectedResult);
  });

  it('can add values to a key as NOT appearing', () => {
    const initialFilter = {must: {datasetKey: ['old_dataset']}};
    const options = {key: 'datasetKey', value: ['new_dataset_1', 'new_dataset_2'], action: 'ADD', isNegated: true};
    const expectedResult = {
      must: {datasetKey: ['old_dataset']},
      must_not: {datasetKey: ['new_dataset_1', 'new_dataset_2']}
    };
    expect(stateHelper.getUpdatedFilter(initialFilter, options)).toEqual(expectedResult);
  });
  
});