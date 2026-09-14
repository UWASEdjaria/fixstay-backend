/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TicketController } from './../controllers/ticket.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AuthController } from './../controllers/auth.controller';
import { expressAuthentication } from './../auth/authentication';
// @ts-ignore - no great way to install types from subpackage
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';

const expressAuthenticationRecasted = expressAuthentication as (req: ExRequest, securityName: string, scopes?: string[], res?: ExResponse) => Promise<any>;


// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "_36_Enums.UrgencyLevel": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["LOW"]},{"dataType":"enum","enums":["MEDIUM"]},{"dataType":"enum","enums":["HIGH"]},{"dataType":"enum","enums":["CRITICAL"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UrgencyLevel": {
        "dataType": "refAlias",
        "type": {"ref":"_36_Enums.UrgencyLevel","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "_36_Enums.TicketStatus": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["PENDING"]},{"dataType":"enum","enums":["IN_PROGRESS"]},{"dataType":"enum","enums":["ON_HOLD"]},{"dataType":"enum","enums":["RESOLVED"]},{"dataType":"enum","enums":["CLOSED"]},{"dataType":"enum","enums":["CANCELLED"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TicketStatus": {
        "dataType": "refAlias",
        "type": {"ref":"_36_Enums.TicketStatus","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AssignedStaffDTO": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "fullName": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TicketAttachmentDTO": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "fileUrl": {"dataType":"string","required":true},
            "fileType": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TicketResponseDTO": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "ticketNumber": {"dataType":"string","required":true},
            "roomId": {"dataType":"string","required":true},
            "roomNumber": {"dataType":"string","required":true},
            "floor": {"dataType":"double","required":true},
            "building": {"dataType":"string","required":true},
            "categoryId": {"dataType":"string","required":true},
            "categoryName": {"dataType":"string","required":true},
            "title": {"dataType":"string","required":true},
            "description": {"dataType":"string","required":true},
            "urgency": {"ref":"UrgencyLevel","required":true},
            "status": {"ref":"TicketStatus","required":true},
            "reportedByGuestName": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "guestTrackingToken": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "assignedStaff": {"dataType":"union","subSchemas":[{"ref":"AssignedStaffDTO"},{"dataType":"enum","enums":[null]}],"required":true},
            "attachments": {"dataType":"array","array":{"dataType":"refObject","ref":"TicketAttachmentDTO"},"required":true},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Record_string.string-Array_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"array","array":{"dataType":"string"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ErrorResponseDTO": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
            "details": {"ref":"Record_string.string-Array_"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateTicketDTO": {
        "dataType": "refObject",
        "properties": {
            "roomId": {"dataType":"string","required":true},
            "categoryId": {"dataType":"string","required":true},
            "title": {"dataType":"string","required":true},
            "description": {"dataType":"string","required":true},
            "urgency": {"ref":"UrgencyLevel","required":true},
            "reportedByGuestName": {"dataType":"string"},
            "guestContact": {"dataType":"string"},
            "attachmentUrls": {"dataType":"array","array":{"dataType":"string"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginationMetaDTO": {
        "dataType": "refObject",
        "properties": {
            "total": {"dataType":"double","required":true},
            "page": {"dataType":"double","required":true},
            "limit": {"dataType":"double","required":true},
            "totalPages": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginatedTicketsResponseDTO": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"array","array":{"dataType":"refObject","ref":"TicketResponseDTO"},"required":true},
            "meta": {"ref":"PaginationMetaDTO","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateTicketStatusDTO": {
        "dataType": "refObject",
        "properties": {
            "status": {"ref":"TicketStatus","required":true},
            "comment": {"dataType":"string"},
            "resolutionSummary": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AssignTicketDTO": {
        "dataType": "refObject",
        "properties": {
            "assignedToUserId": {"dataType":"string","required":true},
            "comment": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PublicAuditLogEntryDTO": {
        "dataType": "refObject",
        "properties": {
            "newStatus": {"dataType":"union","subSchemas":[{"ref":"TicketStatus"},{"dataType":"enum","enums":[null]}],"required":true},
            "comment": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "createdAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GuestTicketTrackingResponseDTO": {
        "dataType": "refObject",
        "properties": {
            "ticketNumber": {"dataType":"string","required":true},
            "roomNumber": {"dataType":"string","required":true},
            "categoryName": {"dataType":"string","required":true},
            "title": {"dataType":"string","required":true},
            "description": {"dataType":"string","required":true},
            "urgency": {"ref":"UrgencyLevel","required":true},
            "status": {"ref":"TicketStatus","required":true},
            "createdAt": {"dataType":"datetime","required":true},
            "resolvedAt": {"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"enum","enums":[null]}],"required":true},
            "resolutionSummary": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "timeline": {"dataType":"array","array":{"dataType":"refObject","ref":"PublicAuditLogEntryDTO"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "_36_Enums.UserRole": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["ADMIN"]},{"dataType":"enum","enums":["STAFF"]},{"dataType":"enum","enums":["GUEST"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserRole": {
        "dataType": "refAlias",
        "type": {"ref":"_36_Enums.UserRole","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserSummaryDTO": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "fullName": {"dataType":"string","required":true},
            "role": {"ref":"UserRole","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LoginResponseDTO": {
        "dataType": "refObject",
        "properties": {
            "accessToken": {"dataType":"string","required":true},
            "user": {"ref":"UserSummaryDTO","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RegisterRequestDTO": {
        "dataType": "refObject",
        "properties": {
            "email": {"dataType":"string","required":true},
            "fullName": {"dataType":"string","required":true},
            "phoneNumber": {"dataType":"string"},
            "password": {"dataType":"string","required":true},
            "confirmPassword": {"dataType":"string","required":true},
            "role": {"ref":"UserRole"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LoginRequestDTO": {
        "dataType": "refObject",
        "properties": {
            "email": {"dataType":"string","required":true},
            "password": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        const argsTicketController_createTicket: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"CreateTicketDTO"},
        };
        app.post('/api/v1/tickets',
            ...(fetchMiddlewares<RequestHandler>(TicketController)),
            ...(fetchMiddlewares<RequestHandler>(TicketController.prototype.createTicket)),

            async function TicketController_createTicket(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTicketController_createTicket, request, response });

                const controller = new TicketController();

              await templateService.apiHandler({
                methodName: 'createTicket',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTicketController_listTickets: Record<string, TsoaRoute.ParameterSchema> = {
                page: {"in":"query","name":"page","dataType":"double"},
                limit: {"in":"query","name":"limit","dataType":"double"},
                status: {"in":"query","name":"status","ref":"TicketStatus"},
                urgency: {"in":"query","name":"urgency","ref":"UrgencyLevel"},
                roomId: {"in":"query","name":"roomId","dataType":"string"},
                assignedToId: {"in":"query","name":"assignedToId","dataType":"string"},
        };
        app.get('/api/v1/tickets',
            authenticateMiddleware([{"jwt":["STAFF","ADMIN"]}]),
            ...(fetchMiddlewares<RequestHandler>(TicketController)),
            ...(fetchMiddlewares<RequestHandler>(TicketController.prototype.listTickets)),

            async function TicketController_listTickets(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTicketController_listTickets, request, response });

                const controller = new TicketController();

              await templateService.apiHandler({
                methodName: 'listTickets',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTicketController_updateStatus: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"ref":"UpdateTicketStatusDTO"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.patch('/api/v1/tickets/:id/status',
            authenticateMiddleware([{"jwt":["STAFF","ADMIN"]}]),
            ...(fetchMiddlewares<RequestHandler>(TicketController)),
            ...(fetchMiddlewares<RequestHandler>(TicketController.prototype.updateStatus)),

            async function TicketController_updateStatus(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTicketController_updateStatus, request, response });

                const controller = new TicketController();

              await templateService.apiHandler({
                methodName: 'updateStatus',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTicketController_assignTicket: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"ref":"AssignTicketDTO"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.patch('/api/v1/tickets/:id/assign',
            authenticateMiddleware([{"jwt":["STAFF","ADMIN"]}]),
            ...(fetchMiddlewares<RequestHandler>(TicketController)),
            ...(fetchMiddlewares<RequestHandler>(TicketController.prototype.assignTicket)),

            async function TicketController_assignTicket(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTicketController_assignTicket, request, response });

                const controller = new TicketController();

              await templateService.apiHandler({
                methodName: 'assignTicket',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTicketController_trackTicket: Record<string, TsoaRoute.ParameterSchema> = {
                token: {"in":"path","name":"token","required":true,"dataType":"string"},
        };
        app.get('/api/v1/tickets/track/:token',
            ...(fetchMiddlewares<RequestHandler>(TicketController)),
            ...(fetchMiddlewares<RequestHandler>(TicketController.prototype.trackTicket)),

            async function TicketController_trackTicket(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTicketController_trackTicket, request, response });

                const controller = new TicketController();

              await templateService.apiHandler({
                methodName: 'trackTicket',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthController_register: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"RegisterRequestDTO"},
        };
        app.post('/api/v1/auth/register',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.register)),

            async function AuthController_register(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_register, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'register',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthController_login: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"LoginRequestDTO"},
        };
        app.post('/api/v1/auth/login',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.login)),

            async function AuthController_login(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_login, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'login',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return async function runAuthenticationMiddleware(request: any, response: any, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            // keep track of failed auth attempts so we can hand back the most
            // recent one.  This behavior was previously existing so preserving it
            // here
            const failedAttempts: any[] = [];
            const pushAndRethrow = (error: any) => {
                failedAttempts.push(error);
                throw error;
            };

            const secMethodOrPromises: Promise<any>[] = [];
            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    const secMethodAndPromises: Promise<any>[] = [];

                    for (const name in secMethod) {
                        secMethodAndPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }

                    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                    secMethodOrPromises.push(Promise.all(secMethodAndPromises)
                        .then(users => { return users[0]; }));
                } else {
                    for (const name in secMethod) {
                        secMethodOrPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }
                }
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            try {
                request['user'] = await Promise.any(secMethodOrPromises);

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }

                next();
            }
            catch(err) {
                // Show most recent error as response
                const error = failedAttempts.pop();
                error.status = error.status || 401;

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }
                next(error);
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
