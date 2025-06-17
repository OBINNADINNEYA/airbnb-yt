import { canadianCities } from "./canadianCities";

export function useCanadianCities() {
  function getAllCities() {
    return canadianCities;
  }
  function getCityByValue(value: string) {
    return canadianCities.find(city => city.value === value);
  }
  return { getAllCities, getCityByValue };
} 