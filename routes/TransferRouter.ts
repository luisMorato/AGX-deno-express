import { Router } from 'express'

import { verifyJwt } from '../middlewares/VerifyJwt.ts'
import { TransferController } from '../features/transfers/controllers/TransferController.ts'

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

/**
 * @openapi
 * /transfers/{accountId}/resume/spent:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: "accountId"
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: "from"
 *         schema:
 *           type: date
 *         required: false
 *       - in: query
 *         name: "to"
 *         schema:
 *          type: date
 *         required: false
 *     tags:
 *        - transfers
 *     description: "list an array of objects grouped by transaction type from a specific account, that shows how much a user spent."
 *     responses:
 *       200:
 *         description: "Returns a list of objects that contains: transactionType, transactionsCount and totalSpent or an empty array."
 *       404:
 *         description: "Returns an error for: user bank account not found"
 *       401:
 *         description: "Returns an error for: user invalid credentials or token not provided/invalid."
 */
transferRouter.get('/transfers/:accountId/resume/spent', verifyJwt, transferController.spent)

export { transferRouter }
