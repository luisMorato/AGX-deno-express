import { Router } from 'express';

import { verifyJwt } from "../middlewares/verify-jwt.ts";
import { AccountsController } from "../features/accounts/controller/accounts-controller.ts";

const accountsRouter = Router()
const accountsController = new AccountsController()

/**
 * @openapi
 * /accounts:
 *   post:
 *     parameters:
 *      - in: body
 *        schema:
 *          type: object
 *          properties:
 *            userId:
 *              type: string
 *              required: true
 *        required: true
 *     tags:
 *        - Accounts
 *     description: "create a user bank account on database."
 *     responses:
 *       201:
 *         description: "Returns created."
 *       401:
 *         description: "Returns an error for: user invalid credentials or token not provided/invalid."
 *       409:
 *         description: "Returns an error for: user bank account already exists."
 */
accountsRouter.post('/accounts', verifyJwt, accountsController.create)

/**
 * @openapi
 * /accounts/{id}:
 *   get:
 *     parameters:
 *       - in: path
 *         name: "id"
 *         schema:
 *           type: string
 *         required: true
 *     tags:
 *        - Accounts
 *     description: "searches for a user bank account on database."
 *     responses:
 *       200:
 *         description: "Returns a user bank account."
 *       401:
 *         description: "Returns an error for: user invalid credentials or token not provided/invalid."
 *       404:
 *         description: "Returns an error for: user bank account not found."
 */
accountsRouter.get('/accounts/:id', verifyJwt, accountsController.find)

/**
 * @openapi
 * /accounts/{id}/increment:
 *   patch:
 *     parameters:
 *       - in: path
 *         name: "id"
 *         schema:
 *           type: string
 *         required: true
 *     tags:
 *        - Accounts
 *     description: "increments user bank account balance on database."
 *     responses:
 *       200:
 *         description: "Returns success for user bank account balance increment."
 *       401:
 *         description: "Returns an error for: user invalid credentials or token not provided/invalid."
 *       404:
 *         description: "Returns an error for: user bank account not found."
 */
accountsRouter.patch('/accounts/:id/increment', verifyJwt, accountsController.increment)

/**
 * @openapi
 * /accounts/{id}:
 *   delete:
 *     parameters:
 *       - in: path
 *         name: "id"
 *         schema:
 *           type: string
 *         required: true
 *     tags:
 *        - Accounts
 *     description: "deletes a user bank account on database."
 *     responses:
 *       200:
 *         description: "Returns success for deleting user bank account."
 *       401:
 *         description: "Returns an error for: user invalid credentials or token not provided/invalid."
 *       404:
 *         description: "Returns an error for: user bank account not found."
 */
accountsRouter.delete('/accounts/:id', verifyJwt, accountsController.delete)

export { accountsRouter }