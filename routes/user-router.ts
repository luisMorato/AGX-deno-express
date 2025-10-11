import { Router } from 'express'
import { UserController } from "../features/users/controllers/user-controller.ts";
import { verifyJwt } from "../middlewares/verify-jwt.ts";

const userRouter = Router()
const userController = new UserController()

/**
 * @openapi
 * /users:
 *   get:
 *     description: list all users on database.
 *     responses:
 *       200:
 *         description: Returns a list of users or an empty array.
 *       401:
 *         description: Returns an error for: token not provided or invalid.
 */
userRouter.get('/users', verifyJwt, userController.list)

/**
 * @openapi
 * /users:
 *   post:
 *     description: create a user on database.
 *     responses:
 *       201:
 *         description: Returns created.
 *       409:
 *         description: Returns an error for: user already exists with same email.
 */
userRouter.post('/users', userController.create)

/**
 * @openapi
 * /users/:id:
 *   get:
 *     description: returns a unique user by id.
 *     responses:
 *       200:
 *         description: Returns a user.
 *       401:
 *         description: Returns an error for: token not provided or invalid.
 *       404:
 *         description: Returns an error for: user not found.
 */
userRouter.get('/users/:id', verifyJwt, userController.findById)

/**
 * @openapi
 * /users/:id:
 *   put:
 *     description: updates a user by id.
 *     responses:
 *       200:
 *         description: Returns a user.
 *       401:
 *         description: Returns an error for: user invalid credentials or token not provided/invalid.
 *       404:
 *         description: Returns an error for: user not found.
 *       409:
 *         description: Returns an error for: user with sent email already registered.
 */
userRouter.put('/users/:id', verifyJwt, userController.updateById)

/**
 * @openapi
 * /users/:id:
 *   delete:
 *     description: deletes a user by id.
 *     responses:
 *       200:
 *         description: Returns deleted.
 *       401:
 *         description: Returns an error for: user invalid credentials or token not provided/invalid.
 *       404:
 *         description: Returns an error for: user not found.
 */
userRouter.delete('/users/:id', verifyJwt, userController.deleteById)

export { userRouter }