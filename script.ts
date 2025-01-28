import {
  DeliveryT,
  PathT,
  StepT,
  ActionT,
  ValidationError,
  SuccessResult,
} from "./types";

// Étape 1 : Parser les entrées
const parseInput = (
  deliveriesInput: string,
  pathInput: string
): { deliveries: DeliveryT[]; path: PathT } => {
  const deliveries = JSON.parse(deliveriesInput);
  const path = JSON.parse(pathInput);
  return { deliveries, path };
};

// Étape 2 : Valider le chemin

const validatePath = (deliveries: DeliveryT[], path: PathT) => {
  const deliveriesFlattened = deliveries.flat();

  for (const delivery of deliveriesFlattened) {
    if (!path.includes(delivery)) {
      return {
        status: "error",
        error_code: "delivery_address_not_in_path",
        error_message: `L'adresse ${delivery} est manquante dans le trajet fourni.`,
      };
    }
  }

  for (const [pickup, dropoff] of deliveries) {
    if (path.indexOf(pickup) > path.indexOf(dropoff)) {
      return {
        status: "error",
        error_code: "delivery_dropoff_before_pickup",
        error_message: `Le dropoff à l'adresse ${dropoff} ne peut pas avoir lieu sans un pickup préallable à l'adresse ${pickup}.`,
      };
    }
  }

  return null;
};

// Étape 3 : Générer les étapes
const generateSteps = (deliveries: DeliveryT[], path: PathT): StepT[] => {
  const steps: StepT[] = [];
  const pickupRealised: number[] = [];

  for (const address of path) {
    let action: ActionT = null;

    for (const [pickup, dropoff] of deliveries) {
      if (address === pickup && !pickupRealised.includes(pickup)) {
        action = "pickup";
        pickupRealised.push(pickup);
        break;
      } else if (address === dropoff && pickupRealised.includes(pickup)) {
        action = "dropoff";
        break;
      }
    }

    steps.push({ address, action });
  }

  return steps;
};

// Étape 4 : Fonction principale
const main = (deliveriesInput: string, pathInput: string) => {
  const { deliveries, path } = parseInput(deliveriesInput, pathInput);

  const validationError = validatePath(deliveries, path) as ValidationError;
  if (validationError) {
    console.log(JSON.stringify(validationError));
    return;
  }

  const steps = generateSteps(deliveries, path) as StepT[];

  const successResult = {
    status: "success",
    steps: steps,
  } as SuccessResult;

  console.log(JSON.stringify(successResult));
};

const deliveriesInput = "[[1,3],[2,5]]";
const pathInput = "[1,2,3,4,5]";

main(deliveriesInput, pathInput);
