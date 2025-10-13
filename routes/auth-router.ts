import { Router } from 'express';

import { AuthController } from "../features/auth/controllers/auth-controller.ts";

const authRouter = Router()
const authController = new AuthController()

/**
 * @openapi
 * /authenticate:
 *   post:
 *     parameters:
 *        - in: body
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                required: true
 *              password:
 *                type: string
 *                required: true
 *     tags:
 *        - Authentication
 *     description: "Authenticate user by generating a JWT token."
 *     responses:
 *       200:
 *         description: "Returns created."
 *       401:
 *         description: "Returns an error for: user invalid credentials."
 */
authRouter.post('/authenticate', authController.authenticate)

export { authRouter }