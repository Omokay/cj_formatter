import objectMapper from 'object-mapper';
import {Erp_products} from "./data/products";
import {Map_object} from "./config/map_object";
import {Propeller_Products} from "./blueprint/product.blueprint";

/**
 * Format data from external source to meet propeller json requirements
 * @param data
 * @returns [*]
 */
let propeller_products = [];
async function format_json(data: {}[]): Promise<string | {}> {
    if (!data.length) return 'Data source is empty';
    for (const product of data) {
        await mapFields(product);
    }
    return propeller_products[0];
};


/**
 * Using the object-mapper library, this function maps values from the data source to a given key in our propeller product object
 * @param product
 * @returns void
 */
async function mapFields(product: {}): Promise<void> {
    // Do a map of object keys between product and propeller keys
    try {
        const mappedObject = await objectMapper(product, Map_object);
        const mergedObject = await mergeFields(mappedObject);
        propeller_products.push(mergedObject);
    } catch(e) {
        console.error('Error mapping fields with map object config');
    }
}


/**
 * Merge the object with mapped fields with the Propeller_products and overwrite default values where provided.
 * @param mappedObject
 * @returns {}
 */
async function mergeFields(mappedObject: {}): Promise<{}> {
    const {products} = Propeller_Products;
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
        } else {
            result[key] = mappedObject[key];
        }
    }
    return result;
}

async function run() {
    console.log(await format_json(Erp_products));
}


run().catch(e => console.error(e));

