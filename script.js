// Étape 1 : Parser les entrées
var parseInput = function (deliveriesInput, pathInput) {
    var deliveries = JSON.parse(deliveriesInput);
    var path = JSON.parse(pathInput);
    return { deliveries: deliveries, path: path };
};
var validatePath = function (deliveries, path) {
    var deliveriesFlattened = deliveries.flat();
    for (var _i = 0, deliveriesFlattened_1 = deliveriesFlattened; _i < deliveriesFlattened_1.length; _i++) {
        var delivery = deliveriesFlattened_1[_i];
        if (!path.includes(delivery)) {
            return {
                status: "error",
                error_code: "delivery_address_not_in_path",
                error_message: "L'adresse ".concat(delivery, " est manquante dans le trajet fourni."),
            };
        }
    }
    for (var _a = 0, deliveries_1 = deliveries; _a < deliveries_1.length; _a++) {
        var _b = deliveries_1[_a], pickup = _b[0], dropoff = _b[1];
        if (path.indexOf(pickup) > path.indexOf(dropoff)) {
            return {
                status: "error",
                error_code: "delivery_dropoff_before_pickup",
                error_message: "Le dropoff \u00E0 l'adresse ".concat(dropoff, " ne peut pas avoir lieu sans un pickup pr\u00E9allable \u00E0 l'adresse ").concat(pickup, "."),
            };
        }
    }
    return null;
};
// Étape 3 : Générer les étapes
var generateSteps = function (deliveries, path) {
    var steps = [];
    var pickupRealised = [];
    for (var _i = 0, path_1 = path; _i < path_1.length; _i++) {
        var address = path_1[_i];
        var action = null;
        for (var _a = 0, deliveries_2 = deliveries; _a < deliveries_2.length; _a++) {
            var _b = deliveries_2[_a], pickup = _b[0], dropoff = _b[1];
            if (address === pickup && !pickupRealised.includes(pickup)) {
                action = "pickup";
                pickupRealised.push(pickup);
                break;
            }
            else if (address === dropoff && pickupRealised.includes(pickup)) {
                action = "dropoff";
                break;
            }
        }
        steps.push({ address: address, action: action });
    }
    return steps;
};
// Étape 4 : Fonction principale
var main = function (deliveriesInput, pathInput) {
    var _a = parseInput(deliveriesInput, pathInput), deliveries = _a.deliveries, path = _a.path;
    var validationError = validatePath(deliveries, path);
    if (validationError) {
        console.log(JSON.stringify(validationError));
        return;
    }
    var steps = generateSteps(deliveries, path);
    var successResult = {
        status: "success",
        steps: steps,
    };
    console.log(JSON.stringify(successResult));
};
var deliveriesInput = "[[1,3],[2,5]]";
var pathInput = "[1,2,3,4,5]";
main(deliveriesInput, pathInput);
