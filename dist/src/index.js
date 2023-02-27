"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const object_mapper_1 = __importDefault(require("object-mapper"));
const products_1 = require("./data/products");
const map_object_1 = require("./config/map_object");
const product_blueprint_1 = require("./blueprint/product.blueprint");
/**
 * Format data from external source to meet propeller json requirements
 * @param data
 * @returns [*]
 */
let propeller_products = [];
function format_json(data) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!data.length)
            return 'Data source is empty';
        for (const product of data) {
            yield mapFields(product);
        }
        return propeller_products[0];
    });
}
;
/**
 * Using the object-mapper library, this function maps values from the data source to a given key in our propeller product object
 * @param product
 * @returns void
 */
function mapFields(product) {
    return __awaiter(this, void 0, void 0, function* () {
        // Do a map of object keys between product and propeller keys
        try {
            const mappedObject = yield (0, object_mapper_1.default)(product, map_object_1.Map_object);
            const mergedObject = yield mergeFields(mappedObject);
            propeller_products.push(mergedObject);
        }
        catch (e) {
            console.error('Error mapping fields with map object config');
        }
    });
}
/**
 * Merge the object with mapped fields with the Propeller_products and overwrite default values where provided.
 * @param mappedObject
 * @returns {}
 */
function mergeFields(mappedObject) {
    return __awaiter(this, void 0, void 0, function* () {
        const { products } = product_blueprint_1.Propeller_Products;
        const result = {};
        for (const key in products) {
            if (!mappedObject[key]) {
                if (key === 'parent') {
                    products[key]['sourceId'] = mappedObject['sourceId'];
                    result[key] = products[key];
                }
                else if (key === 'package') {
                    result[key] = mappedObject['packageDescription']['unitInfo']['id'];
                }
                else {
                    result[key] = products[key];
                }
            }
            else {
                result[key] = mappedObject[key];
            }
        }
        return result;
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(yield format_json(products_1.Erp_products));
    });
}
run().catch(e => console.error(e));
//# sourceMappingURL=index.js.map