/*
 *  Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>
 *  This file (cropSaleVarietyModel.js) is part of LiteFarm.
 *
 *  LiteFarm is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  LiteFarm is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU General Public License for more details, see <https://www.gnu.org/licenses/>.
 */

import Model from './baseFormatModel.js';
import saleModel from './saleModel.js';
import cropVarietyModel from './cropVarietyModel.js';

class CropVarietySale extends Model {
  static get tableName() {
    return 'crop_variety_sale';
  }

  static get idColumn() {
    return ['sale_id', 'crop_variety_id'];
  }
  // Optional JSON schema. This is not the database schema! Nothing is generated
  // based on this. This is only used for validation. Whenever a model instance
  // is created it is checked against this schema. http://json-schema.org/.
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['sale_id', 'crop_variety_id'],

      properties: {
        // management_plan_id: { type: 'integer' },
        sale_id: { type: 'integer' },
        quantity: {
          type: 'number',
          format: 'float',
        },
        quantity_unit: { type: 'string' },
        sale_value: {
          type: 'number',
          format: 'float',
        },
        crop_variety_id: { type: 'string' },
      },
      additionalProperties: false,
    };
  }

  static get relationMappings() {
    return {
      sale: {
        relation: Model.BelongsToOneRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one.
        modelClass: saleModel,
        join: {
          from: 'crop_variety_sale.sale_id',
          to: 'sale.sale_id',
        },
      },
      crop_variety: {
        relation: Model.BelongsToOneRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one.
        modelClass: cropVarietyModel,
        join: {
          from: 'crop_variety_sale.crop_variety_id',
          to: 'crop_variety.crop_variety_id',
        },
      },
    };
  }
}

export default CropVarietySale;
