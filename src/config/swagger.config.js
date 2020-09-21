import { Environments } from '../enums';
import appConfig from './app.config';

const swaggerDoc = {
    openapi: '3.0.1',
    info: {
        description:
            'This document provides test the endpoint of the record api.',
        version: '1.0.0',
        title: 'Documentation of the Record API',
        contact: {
            name: 'Berkay Çelik',
            email: 'berkayc78@gmail.com',
            url: 'https://github.com/berkayclk',
        },
        license: {
            name: 'Apache 2.0',
            url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
        },
    },
    servers: [],
    tags: [
        {
            name: 'Record Api',
            description: 'Handle record requests',
        },
        {
            name: 'View Endpoints',
            description: 'Handle record requests',
        },
    ],
    paths: {
        '/': {
            get: {
                tags: ['View Endpoints'],
                summary: 'Returns a simple table view to represent record data.',
                operationId: 'tableView',
                responses: {
                    200: {
                        description: "Returns html page",
                        content: {
                            "text/html": {}
                        }
                    }
                }
            }
        },
        '/records': {
            get: {
                tags: ['Record Api'],
                summary: 'Returns all records',
                description: 'Fetches the records from backend application.',
                operationId: 'findAll',
                responses: {
                    200: {
                        description: 'Records is successfully fetched.',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ApiResponse',
                                },
                            },
                        },
                    },
                    400: {
                        description: 'Bad request error',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ApiResponse',
                                },
                                example: {
                                    code: 1,
                                    msg: 'An error has been occurred!',
                                    records: [],
                                    apiDocUrl: 'http://api-doc-url',
                                },
                            },
                        },
                    },
                },
            },
        },
        '/records/findByDateAndCount': {
            post: {
                tags: ['Record Api'],
                summary:
                    'Filters the records according to ranges of the date and count.',
                description:
                    'Fetches the records from backend application according to min-max values of the date and total count.',
                operationId: 'findByDateAndCount',
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/RecordRequest',
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Records is successfully fetched.',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ApiResponse',
                                },
                            },
                        },
                    },
                    400: {
                        description: 'Bad request error',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ApiResponse',
                                },
                                example: {
                                    code: 2,
                                    msg: '"startDate" is required!',
                                    records: [],
                                    apiDocUrl: 'http://api-doc-url',
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    components: {
        schemas: {
            ApiResponse: {
                type: 'object',
                properties: {
                    code: {
                        type: 'integer',
                    },
                    msg: {
                        type: 'string',
                    },
                    records: {
                        type: 'array',
                        items: {
                            $ref: '#/components/schemas/RecordResponse',
                        },
                    },
                },
            },
            ApiErrorResponse: {
                type: 'object',
                properties: {
                    code: {
                        type: 'integer',
                    },
                    msg: {
                        type: 'string',
                    },
                    apiDocUrl: {
                        type: 'string',
                    },
                    records: {
                        type: 'array',
                        items: {
                            $ref: '#/components/schemas/RecordResponse',
                        },
                    },
                },
            },
            RecordRequest: {
                type: 'object',
                required: ['startDate', 'endDate', 'minCount', 'maxCount'],
                properties: {
                    startDate: {
                        type: 'string',
                        format: 'date',
                    },
                    endDate: {
                        type: 'string',
                        format: 'date',
                    },
                    minCount: {
                        type: 'integer',
                    },
                    maxCount: {
                        type: 'integer',
                    },
                },
                example: {
                    startDate: '2016-01-01',
                    endDate: '2016-12-31',
                    minCount: 3500,
                    maxCount: 4000,
                },
            },
            RecordResponse: {
                type: 'object',
                properties: {
                    key: {
                        type: 'string',
                    },
                    totalCount: {
                        type: 'integer',
                    },
                    createdAt: {
                        type: 'string',
                        format: 'date',
                    },
                },
                example: {
                    key: 'xDAxaSXS',
                    totalCount: 3000,
                    createdAt: '2017-07-23',
                },
            },
            ResponseCodes: {
                type: 'integer',
                enum: [0, 1, 2, 3, 4],
            },
        },
    },
};

if (appConfig.ENV !== Environments.PROD) {
    swaggerDoc.servers.push({
        url: `http://localhost:${appConfig.APP_PORT}/`,
        description: 'Local Server',
    });
}

if (appConfig.APP_URL) {
    swaggerDoc.servers.push({
        url: appConfig.APP_URL,
        description: 'Live Server',
    });
}

export default swaggerDoc;
