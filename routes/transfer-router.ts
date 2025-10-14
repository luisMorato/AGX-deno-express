import { Router } from 'express';

import { verifyJwt } from "../middlewares/verify-jwt.ts";
import { TransferController } from "../features/transfers/controllers/transfer-controller.ts";

const transferRouter = Router()
const transferController = new TransferController()

/**
 * @openapi
 * /transfers:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *      - in: body
 *        schema:
 *          type: object
 *          properties:
 *            senderAccountId:
 *               type: string
 *               required: true
 *            receiverAccountId:
 *               type: string
 *               required: true
 *            amount:
 *               type: number
 *               required: true
 *     tags:
 *      - transfers
 *     description: "create a transfer on database."
 *     responses:
 *       201:
 *         description: "Returns created."
 *       401:
 *         description: "Returns an error for: user invalid credentials or token not provided/invalid."
 *       404:
 *         description: "Returns an error for: user bank account not found."
 *       400:
 *         description: "Returns an error for: user dont have founds."
 */
transferRouter.post('/transfers', verifyJwt, transferController.create)

/**
 * @openapi
 * /transfers:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *        - transfers
 *     description: "list all transfers on database."
 *     responses:
 *       200:
 *         description: "Returns a list of transfers or an empty array."
 *       401:
 *         description: "Returns an error for: user invalid credentials or token not provided/invalid."
 */
transferRouter.get('/transfers', verifyJwt, transferController.list)

/**
 * @openapi
 * /transfers/{accountId}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: "accountId"
 *         schema:
 *           type: string
 *         required: true
 *     tags:
 *        - transfers
 *     description: "list all transfers from a specific account."
 *     responses:
 *       200:
 *         description: "Returns a list of transfers or an empty array."
 *       401:
 *         description: "Returns an error for: user invalid credentials or token not provided/invalid."
 */
transferRouter.get('/transfers/:accountId', verifyJwt, transferController.findByAccountId)

export { transferRouter }