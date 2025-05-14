import { Unit } from 'src/enums/unit.enums';

const weightFactors: Partial<Record<Unit, number>> = {
  [Unit.MCG]: 0.001,
  [Unit.MG]: 1,
  [Unit.G]: 1000,
  [Unit.KG]: 1_000_000,
};

const volumeFactors: Partial<Record<Unit, number>> = {
  [Unit.ML]: 1,
  [Unit.L]: 1000,
  [Unit.GTT]: 0.05, // Approx: 1 drop = 0.05 ml
  [Unit.TSP]: 5, // 1 tsp = 5 ml
  [Unit.TBSP]: 15, // 1 tbsp = 15 ml
};

export function convertUnit(value: number, from: Unit, to: Unit): number {
  if (from === to) {
    return value; // No conversion needed
  }

  if (weightFactors[from] && weightFactors[to]) {
    return (value * weightFactors[from]) / weightFactors[to];
  }

  if (volumeFactors[from] && volumeFactors[to]) {
    return (value * volumeFactors[from]) / volumeFactors[to];
  }

  throw new Error(
    `Conversion from '${from}' to '${to}' is not supported or invalid.`,
  );
}
