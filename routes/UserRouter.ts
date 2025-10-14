import { Router } from 'express'

import { verifyJwt } from '../middlewares/VerifyJwt.ts'
import { UsersController } from '../features/users/controllers/UsersController.ts'

const userRouter = Router()
const usersController = new UsersController()

/**
 * @openapi
 * /users:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *      - in: query
 *        name: "name"
 *        schema:
 *          type: string
 *        required: false
 *      - in: query
 *        name: "email"
 *        schema:
 *          type: string
 *        required: false
 *     tags:
 *       - Users
 *     description: "list all users on database."
 *     responses:
 *       200:
 *         description: "Returns a list of users or an empty array."
 *       401:
 *         description: "Returns an error for: token not provided or invalid."
 */
userRouter.get('/users', verifyJwt, usersController.list)

/**
 * @openapi
 * /users:
 *   post:
 *     parameters:
 *      - in: body
 *        schema:
 *          type: object
 *          properties:
 *            name:
 *              type: string
 *              required: true
 *            email:
 *              type: string
 *              required: true
 *            password:
 *              type: string
 *              required: true
 *            birthdate:
 *              type: string
 *              format: date
 *              required: true
 *        required: true
 *     tags:
 *       - Users
 *     description: "create a user on database."
 *     responses:
 *       201:
 *         description: "Returns created."
 *       409:
 *         description: "Returns an error for: user already exists with same email."
 */
userRouter.post('/users', usersController.create)

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *      - in: path
 *        name: "id"
 *        schema:
 *          type: string
 *        required: true
 *     tags:
 *       - Users
 *     description: "returns a unique user by id."
 *     responses:
 *       200:
 *         description: "Returns a user."
 *       401:
 *         description: "Returns an error for: token not provided or invalid."
 *       404:
 *         description: "Returns an error for: user not found."
 */
userRouter.get('/users/:id', verifyJwt, usersController.findById)

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *      - in: path
 *        name: "id"
 *        schema:
 *          type: string
 *        required: true
 *      - in: body
 *        schema:
 *          type: object
 *          properties:
 *            name:
 *              type: string
 *              required: true
 *            email:
 *              type: string
 *              required: true
 *            password:
 *              type: string
 *              required: true
 *            newPassword:
 *              type: string
 *              required: false
 *            birthdate:
 *              type: string
 *              format: date
 *              required: true
 *        required: true
 *     tags:
 *       - Users
 *     description: "updates a user by id."
 *     responses:
 *       200:
 *         description: "Returns a user."
 *       401:
 *         description: "Returns an error for: user invalid credentials or token not provided/invalid."
 *       404:
 *         description: "Returns an error for: user not found."
 *       409:
 *         description: "Returns an error for: user with sent email already registered."
 */
userRouter.put('/users/:id', verifyJwt, usersController.updateById)

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *      - in: path
 *        name: "id"
 *        schema:
 *          type: string
 *        required: true
 *     tags:
 *       - Users
 *     description: "deletes a user by id."
 *     responses:
 *       200:
 *         description: "Returns deleted."
 *       401:
 *         description: "Returns an error for: user invalid credentials or token not provided/invalid."
 *       404:
 *         description: "Returns an error for: user not found."
 */
userRouter.delete('/users/:id', verifyJwt, usersController.deleteById)

export { userRouter }
