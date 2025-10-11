import { Router } from 'express';
import { TransferController } from "../features/transfers/controllers/transfer-controller.ts";
import { verifyJwt } from "../middlewares/verify-jwt.ts";

const transferRouter = Router()
const transferController = new TransferController()

/**
 * @openapi
 * /transfers:
 *   post:
 *     description: create a transfer on database.
 *     responses:
 *       201:
 *         description: Returns created.
 *       401:
 *         description: Returns an error for: user invalid credentials or token not provided/invalid.
 *       404:
 *         description: Returns an error for: user bank account not found.
 *       400:
 *         description: Returns an error for: user dont have founds.
 */
transferRouter.post('/transfers', verifyJwt, transferController.create)

/**
 * @openapi
 * /transfers:
 *   get:
 *     description: list all transfers on database.
 *     responses:
 *       200:
 *         description: Returns a list of transfers or an empty array.
 *       401:
 *         description: Returns an error for: user invalid credentials or token not provided/invalid.
 */
transferRouter.get('/transfers', verifyJwt, transferController.list)

/**
 * @openapi
 * /transfers/:accountId
 *   get:
 *     description: list all transfers from a specific account.
 *     responses:
 *       200:
 *         description: Returns a list of transfers or an empty array.
 *       401:
 *         description: Returns an error for: user invalid credentials or token not provided/invalid.
 */
transferRouter.get('/transfers/:accountId', verifyJwt, transferController.findByAccountId)

export { transferRouter }