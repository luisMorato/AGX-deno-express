import { Router } from 'express'
import { AccountsController } from "../features/accounts/controller/accounts-controller.ts";
import { verifyJwt } from "../middlewares/verify-jwt.ts";

const accountsRouter = Router()
const accountsController = new AccountsController()

/**
 * @openapi
 * /accounts:
 *   post:
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
 * /accounts/:id:
 *   get:
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
 * /accounts/:id/increment:
 *   patch:
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

export { accountsRouter }