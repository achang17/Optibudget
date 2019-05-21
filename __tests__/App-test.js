import 'react-native';
import React from 'react';
import App from '../App';
import renderer from 'react-test-renderer';
import NavigationTestUtils from 'react-navigation/NavigationTestUtils';

import * as app from "../models/__mocks__/app";
import * as parseAPI from '../models/__mocks__/ParsingAPIMocks';
import * as budget from '../models/__mocks__/BudgetMocks';
import * as visuals from '../models/__mocks__/VisualizationMocks';

describe('App snapshot', () => {
  jest.useFakeTimers();
  beforeEach(() => {
    NavigationTestUtils.resetInternalState();
  });

  it('renders the loading screen', async () => {
    const tree = renderer.create(<App />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders the root without loading screen', async () => {
    const tree = renderer.create(<App skipLoadingScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

test("returns undefined by default", () => {
  const mock = jest.fn();

  let result = mock("foo");

  expect(result).toBeUndefined();
  expect(mock).toHaveBeenCalled();
  expect(mock).toHaveBeenCalledTimes(1);
  expect(mock).toHaveBeenCalledWith("foo");
});

test("calls mocks.add", () => {
  const addMock = jest.spyOn(parseAPI, "add");

  // calls the original implementation
  expect(app.doAdd(1, 2)).toEqual(3);

  // and the spy stores the calls to add
  expect(addMock).toHaveBeenCalledWith(1, 2);
});

test("calls handleParseAPI", () => {
  const mockParse = jest.spyOn(parseAPI, "handleParseAPIResponse");
  const mockSetState = jest.spyOn(parseAPI, "handleSetState");

  // calls the original implementation
  expect(app.doParseAPI()).toEqual("8.00");
  expect(mockSetState).toHaveBeenCalled();

});

test("test handlePickPhotoFromAlbum", () => {
  const mockHandle = jest.spyOn(parseAPI, "handlePickPhotoFromAlbum");
  const mockSetState = jest.spyOn(parseAPI, "handleSetState");
  const mockUploadImage = jest.spyOn(parseAPI, "uploadImageToFirebase");
  const mockAPI = jest.spyOn(parseAPI, "handleOCRWithGoogleAPI");
  const mockParse = jest.spyOn(parseAPI, "handleParseAPIResponse");

  app.doPickPhoto();
  expect(mockSetState).toHaveBeenCalledTimes(5);
  expect(mockHandle).toHaveBeenCalled();
  expect(mockUploadImage).toHaveBeenCalled();
  expect(mockAPI).toHaveBeenCalled();
  expect(mockParse).toHaveBeenCalled();
});

test("test uploadImageToFirebase", () => {
  const mockUploadImage = jest.spyOn(parseAPI, "uploadImageToFirebase");
  app.doUploadPhoto();

  expect(app.doUploadPhoto()).toEqual("firebasePhotoURL");
  expect(mockUploadImage).toHaveBeenCalled();

});

test("test handleTakePhotoWithCamera", () => {
  const mockHandle = jest.spyOn(parseAPI, "handleTakePhotoWithCamera");
  const mockSetState = jest.spyOn(parseAPI, "handleSetState");
  const mockUploadImage = jest.spyOn(parseAPI, "uploadImageToFirebase");
  const mockAPI = jest.spyOn(parseAPI, "handleOCRWithGoogleAPI");
  const mockParse = jest.spyOn(parseAPI, "handleParseAPIResponse");

  app.doCameraPhoto();
  expect(mockSetState).toHaveBeenCalledTimes(7);
  expect(mockHandle).toHaveBeenCalled();
  expect(mockUploadImage).toHaveBeenCalled();
  expect(mockAPI).toHaveBeenCalled();
  expect(mockParse).toHaveBeenCalled();
});

test("test Budget Goals", () => {
  const mockUpdateOverallBudget = jest.spyOn(budget, "handleUpdateOverallBudget");
  const mockSetState = jest.spyOn(budget, "handleSetState");

  app.doUpdateOverallBudget(150);

  expect(mockUpdateOverallBudget).toHaveBeenCalledWith(150);
  expect(app.doUpdateOverallBudget(150)).toEqual(250);
  expect(mockSetState).toHaveBeenCalled();
});

test("test update category budgets", () => {
  const mockUpdateGroceriesBudget = jest.spyOn(budget, "handleUpdateGroceriesBudget");
  const mockUpdateOverallBudget = jest.spyOn(budget, "handleUpdateOverallBudget");
  const mockSetState = jest.spyOn(budget, "handleSetState");

  app.doUpdateGroceriesBudget(150);

  expect(mockUpdateOverallBudget).toHaveBeenCalledWith(150);
  expect(app.doUpdateGroceriesBudget(150)).toEqual(150);
  expect(mockSetState).toHaveBeenCalled();
});


test("test update shopping budgets", () => {
  const mockUpdateShoppingBudget = jest.spyOn(budget, "handleUpdateShoppingBudget");
  const mockUpdateOverallBudget = jest.spyOn(budget, "handleUpdateOverallBudget");
  const mockSetState = jest.spyOn(budget, "handleSetState");

  app.doUpdateShoppingBudget(150);

  expect(mockUpdateOverallBudget).toHaveBeenCalledWith(150);
  expect(app.doUpdateShoppingBudget(150)).toEqual(150);
  expect(mockSetState).toHaveBeenCalled();
});

test("test get percent for budgets", () => {
  const mockGetPercent = jest.spyOn(visuals, "getPercent");

  app.doGetPercent("Groceries");

  expect(mockGetPercent).toHaveBeenCalled();
  expect(mockGetPercent).toHaveBeenCalledWith("Groceries");
  expect(app.doGetPercent("Groceries")).toEqual(96.99);

});

test("test get percent for budgets", () => {
  const mockGetPercent = jest.spyOn(visuals, "getPercent");

  app.doGetPercent("Shopping");

  expect(mockGetPercent).toHaveBeenCalled();
  expect(mockGetPercent).toHaveBeenCalledWith("Shopping");
  expect(app.doGetPercent("Shopping")).toEqual(140.24);

});

test("test get percent for budgets", () => {
  const mockGetPercent = jest.spyOn(visuals, "getPercent");

  app.doGetPercent("Bills");

  expect(mockGetPercent).toHaveBeenCalled();
  expect(mockGetPercent).toHaveBeenCalledWith("Bills");
  expect(app.doGetPercent("Bills")).toEqual(71.1);

});

test("test get percent for budgets", () => {
  const mockGetPercent = jest.spyOn(visuals, "getPercent");

  app.doGetPercent("Dining Out");

  expect(mockGetPercent).toHaveBeenCalled();
  expect(mockGetPercent).toHaveBeenCalledWith("Dining Out");
  expect(app.doGetPercent("Dining Out")).toEqual(72.21);

});


test("test get percent for budgets", () => {
  const mockGetBudgetPercent = jest.spyOn(visuals, "getBudgetPercent");

  app.doGetBudgetPercent("Groceries");

  expect(mockGetBudgetPercent).toHaveBeenCalled();
  expect(mockGetBudgetPercent).toHaveBeenCalledWith("Groceries");
  expect(app.doGetBudgetPercent("Groceries")).toEqual(7.14);

});

test("test get percent for budgets", () => {
  const mockGetBudgetPercent = jest.spyOn(visuals, "getBudgetPercent");

  app.doGetBudgetPercent("Shopping");

  expect(mockGetBudgetPercent).toHaveBeenCalled();
  expect(mockGetBudgetPercent).toHaveBeenCalledWith("Shopping");
  expect(app.doGetBudgetPercent("Shopping")).toEqual(14.29);

});

test("test get percent for budgets", () => {
  const mockGetBudgetPercent = jest.spyOn(visuals, "getBudgetPercent");

  app.doGetBudgetPercent("Bills");

  expect(mockGetBudgetPercent).toHaveBeenCalled();
  expect(mockGetBudgetPercent).toHaveBeenCalledWith("Bills");
  expect(app.doGetBudgetPercent("Bills")).toEqual(71.43);

});

test("test get percent for budgets", () => {
  const mockGetBudgetPercent = jest.spyOn(visuals, "getBudgetPercent");

  app.doGetBudgetPercent("Dining Out");

  expect(mockGetBudgetPercent).toHaveBeenCalled();
  expect(mockGetBudgetPercent).toHaveBeenCalledWith("Dining Out");
  expect(app.doGetBudgetPercent("Dining Out")).toEqual(7.14);

});
