import express, { Express, Request, Response } from 'express';
import { createPatientHandler } from '../controller/patient.controller';
import { createDoctorHandler } from '../controller/doctor.controller';
import generateRoom from '../controller/newRoom.controller';
import logoutHandler from '../controller/commonLogout.controller';
import validateRequest from '../middleware/validateRequests';
import { createPatientSchema } from '../schema/patient.schema';
import { createDoctorSchema } from '../schema/doctor.schema';
import loginHandler from './loginRoutes'
import authRouter from './authorizedRoutes';
import cors from 'cors';
import renewAccessTokenHandler from '../controller/tokenRenew.controller';
import { refreshTokenSchema } from '../schema/refreshToken.schema';


export default function (app: Express) {
    app.use(express.json())
    app.use(cors())
    app.get('/isUp', (req: Request, res: Response) => res.sendStatus(200));

    // create new account
    app.post("/api/patient", validateRequest(createPatientSchema), createPatientHandler);
    app.post("/api/doctor", validateRequest(createDoctorSchema), createDoctorHandler);

    // get password and email from the client and send access, refresh tokens 
    // Login has two endpoints for doctor and patient
    app.use('/api/login', loginHandler)
    // Logout use one endpoint for both users
    app.post('/api/logout', validateRequest(refreshTokenSchema), logoutHandler)

    // generate new access token from refresh token
    app.post('/api/token', validateRequest(refreshTokenSchema), renewAccessTokenHandler)

    // Routes which need authentication
    /*  /api/me
     * 
     */

    app.get('/api/room', generateRoom) // called by a doctor; generate a unique roomid and redirected to it
    app.use('/api', authRouter)
}

