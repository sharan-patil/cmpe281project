/*
 *  Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>
 *  This file (ManagementPlanController.js) is part of LiteFarm.
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

const baseController = require('../controllers/baseController');
const managementPlanModel = require('../models/managementPlanModel');
const managementTasksModel = require('../models/managementTasksModel');
const taskModel = require('../models/taskModel');

const { transaction, Model, raw, ref } = require('objection');

const lodash = require('lodash');

const managementPlanController = {
  addManagementPlan() {
    return async (req, res) => {
      try {
        const result = await managementPlanModel.transaction(async trx => {
          return await managementPlanModel.query(trx).context({ user_id: req.user.user_id }).upsertGraph(
            req.body, { noUpdate: true, noDelete: true, noInsert: ['location', 'crop_variety'] });
        });
        return res.status(201).send(result);
      } catch (error) {
        console.log(error);
        return res.status(400).json({
          error,
        });
      }
    };
  },

  delManagementPlan() {
    return async (req, res) => {

      try {
        const isDeleted = await managementPlanModel.query().context(req.user).where({ management_plan_id: req.params.management_plan_id }).delete();
        if (isDeleted) {
          return res.sendStatus(200);
        } else {
          return res.sendStatus(404);
        }
      } catch (error) {
        console.log(error);
        return res.status(400).json({
          error,
        });
      }
    };
  },

  completeManagementPlan() {
    return async (req, res) => {

      try {
        const result = await managementPlanModel.query().context(req.user).where({ management_plan_id: req.params.management_plan_id }).patch(lodash.pick(req.body, ['complete_date', 'complete_notes', 'rating']));
        if (result) {
          return res.sendStatus(200);
        } else {
          return res.sendStatus(404);
        }
      } catch (error) {
        console.log(error);
        return res.status(400).json({
          error,
        });
      }
    };
  },

  abandonManagementPlan() {
    return async (req, res) => {
      try {
        const { management_plan_id } = req.params;
        const result = await managementPlanModel.transaction(async trx => {
          const managementPlanCountQuery = managementTasksModel.query().where({ management_plan_id }).distinct('task_id')
            .then(tasks => managementTasksModel.query().whereIn('task_id', tasks.map(({ task_id }) => task_id))
              .count('management_plan_id').first().then(total => total.count));
          const locationCountQuery = taskModel.relatedQuery('locations');
          await taskModel.query(trx).context(req.user)
            .whereNotExists(locationCountQuery)
            .where(managementPlanCountQuery, 1).patch({
              abandoned_time: req.body.abandon_date,
              //reason_for_abandon: 'Crop management plan abandoned'
            });
          const managementLocationCountQuery = managementTasksModel.query().where({ management_plan_id }).distinct('task_id')
            .then(tasks => taskModel.query().whereIn('task_id', tasks.map(({ task_id }) => task_id)).whereExists(locationCountQuery))
            .then(tasks => tasks.length);
          const plans = await managementTasksModel.query(trx).context(req.user)
            .where({ management_plan_id })
            .where(builder => builder.where(managementLocationCountQuery, '>', 0)
              .orWhere(managementPlanCountQuery, '>', 1))
            .delete();
          return await managementPlanModel.query().context(req.user).where({ management_plan_id }).patch(lodash.pick(req.body, ['abandon_date', 'complete_notes', 'rating']));
        });

        if (result) {
          return res.sendStatus(200);
        } else {
          return res.sendStatus(404);
        }
      } catch (error) {
        console.log(error);
        return res.status(400).json({
          error,
        });
      }
    };
  },

  updateManagementPlan() {
    return async (req, res) => {
      const trx = await transaction.start(Model.knex());
      try {
        const updated = await baseController.put(managementPlanModel, req.params.management_plan_id, req.body, req, { trx });
        await trx.commit();
        if (!updated.length) {
          return res.sendStatus(404);
        } else {
          return res.status(200).send(updated);
        }

      } catch (error) {
        console.log(error);
        await trx.rollback();
        return res.status(400).json({
          error,
        });
      }
    };
  },

  getManagementPlanByID() {
    return async (req, res) => {
      try {
        const management_plan_id = req.params.management_plan_id;
        const managementPlan = await managementPlanModel.query().whereNotDeleted().findById(management_plan_id)
          .withGraphFetched(planGraphFetchedQueryString, graphJoinedOptions);
        return managementPlan ? res.status(200).send(removeCropVarietyFromManagementPlan(managementPlan)) : res.status(404).send('Field crop not found');
      } catch (error) {
        console.log(error);
        return res.status(400).json({
          error,
        });
      }
    };
  },

  getManagementPlanByFarmID() {
    return async (req, res) => {
      try {
        const farm_id = req.params.farm_id;
        const managementPlans = await managementPlanModel.query().whereNotDeleted()
          .withGraphJoined(planGraphFetchedQueryString, graphJoinedOptions)
          .where('crop_variety.farm_id', farm_id);
        return managementPlans?.length ? res.status(200).send(removeCropVarietyFromManagementPlans(managementPlans)) : res.status(404).send('Field crop not found');
      } catch (error) {
        console.log(error);
        return res.status(400).json({
          error,
        });
      }
    };
  },

  getManagementPlansByDate() {
    return async (req, res) => {
      try {
        const farm_id = req.params.farm_id;
        const date = req.params.date;
        const managementPlans = await managementPlanModel.query().whereNotDeleted()
          .withGraphJoined(planGraphFetchedQueryString, graphJoinedOptions)
          .where('crop_variety.farm_id', farm_id)
          .andWhere('harvest_date', '>=', date);


        return managementPlans?.length ? res.status(200).send(removeCropVarietyFromManagementPlans(managementPlans)) : res.status(404).send('Field crop not found');
      } catch (error) {
        console.log(error);
        res.status(400).json({ error });
      }
    };
  },

  getExpiredManagementPlans() {
    return async (req, res) => {
      try {
        const farm_id = req.params.farm_id;
        const managementPlans = await managementPlanModel.query().whereNotDeleted()
          .withGraphJoined(planGraphFetchedQueryString, graphJoinedOptions)
          .where('crop_variety.farm_id', farm_id)
          .andWhere(raw('harvest_date < now()'));
        return managementPlans?.length ? res.status(200).send(removeCropVarietyFromManagementPlans(managementPlans)) : res.status(404).send('Field crop not found');
      } catch (error) {
        res.status(400).json({ error });
      }
    };
  },
};

const planGraphFetchedQueryString = '[crop_variety, crop_management_plan.[planting_management_plans.[bed_method, container_method, broadcast_method, row_method]]]';
const graphJoinedOptions = {
  aliases: {
    crop_management_plan: 'cmp',
    planting_management_plan: 'pmp',
    planting_management_plans: 'pmps',
  },
};

const removeCropVarietyFromManagementPlan = (managementPlan) => {
  !managementPlan.transplant_container && delete managementPlan.transplant_container;
  delete managementPlan.crop_variety;
  for (const plantingType of ['container', 'beds', 'rows', 'broadcast']) {
    !managementPlan.crop_management_plan[plantingType] && delete managementPlan.crop_management_plan[plantingType];
  }
  return managementPlan;
};

const removeCropVarietyFromManagementPlans = (managementPlans) => {
  for (let i = 0; i < managementPlans.length; i++) removeCropVarietyFromManagementPlan(managementPlans[i]);
  return managementPlans;
};

module.exports = managementPlanController;
