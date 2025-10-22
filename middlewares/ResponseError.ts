// deno-lint-ignore-file
import { NextFunction, Request, Response } from 'npm:express'
import HttpStatus from 'npm:http-status-codes'
import fnCode from 'npm:fn-code'


const camelCase = (str: string) => str.toLowerCase().replace(/(\_\w)/g, (c) => c[1].toUpperCase())

type IOptions = {
  promptErrors: boolean | (() => boolean)
}

type IResponserrorObject = {
  code: number
  status: string
  message: string
  success: boolean
  errors: { [key: string]: any } | undefined
  [key: string]: unknown
}

export class ResponseError {
  // deno-lint-ignore ban-types
  private preFunctions: Function[] = []

  // deno-lint-ignore ban-types
  private posFunctions: Function[] = []

  // deno-lint-ignore ban-types
  public pre = (fn: Function) => this.preFunctions.push(fn) // (?)

  // deno-lint-ignore ban-types
  public pos = (fn: Function) => this.posFunctions.push(fn) // (?)

  private options: IOptions

  //  The key-value object that maps the statuses by code, Ex: { 500: INTERNAL_SERVER_ERROR }
  private mapStatusByCode: { [code: number]: string } = {}

  //  The error object that will be returned
  private responserror: IResponserrorObject = {
    code: 500,
    status: 'INTERNAL_SERVER_ERROR',
    message: 'Internal Server Error',
    success: false,
    errors: undefined,
  }

  //  Gets the statuses and codes from the lib 'npm:http-status-codes' and maps into a key-value obejct
  private setMapStatusByCode = () => {
    for (const [httpStatus, httpCode] of Object.entries(HttpStatus)) {
      if (
        !httpStatus.startsWith('get') &&
        typeof httpCode !== 'function' &&
        !['1', '2'].includes(String(httpCode).charAt(0))
      ) {
        Object.assign(this.mapStatusByCode, { [String(httpCode)]: httpStatus })
      }
    }
  }

  //  If error do not includes code || status ||  message, sets a default value to the responserror be a 500 - INTERNAL_SERVER_ERROR
  private setDefaultValuesForResponserror = () => {
    if (
      !['code', 'status', 'message'].some((prop) => this.responserror[prop])
    ) {
      this.responserror.code = 500
      this.responserror.status = 'INTERNAL_SERVER_ERROR'
      this.responserror.message = 'Internal Server Error'
    }
    if (!this.responserror.success) this.responserror.success = false
    if (!this.responserror.errors) this.responserror.errors = undefined
  }

  //  Gets the error message (internal server error) by the give code (500)
  public getMessageByCode = function (code: string | number) {
    try {
      return HttpStatus.getStatusText(code)
    } catch (e: unknown) {
      console.warn('Responserror warn: ', e)
      return undefined
    }
  }

  //  Gets the status (INTERNAL_SERVER_ERROR) by the given code (500)
  public getStatusByCode = (code: number): string | undefined => this.mapStatusByCode[code]

  //  Gets the code (400, 500) by the given status (BAD_REQUEST, INTERNAL_SERVER_ERROR)
  public getCodeByStatus = (status: string): number | undefined => {
    for (const [httpStatus, httpCode] of Object.entries(HttpStatus)) {
      if (
        !httpStatus.startsWith('get') && // Checks if the httpStatus not starts with 'get' (?)
        typeof httpCode !== 'function' && // Check if the httpStatus is not a function
        !['1', '2'].includes(String(httpCode).charAt(0)) // Error not starts with 1 or 2 => Ex: 101, 200, 201 (success and info statuses)
      ) {
        if (
          String(httpStatus).trim().toUpperCase() ==
            String(status).trim().toUpperCase()
        ) {
          return httpCode as number
        }
      }
    }
  }

  constructor(options: IOptions = { promptErrors: false }) {
    this.options = options
    this.setMapStatusByCode()
  }

  errorHandler = (
    error: any,
    _request: Request,
    response: Response,
    _next: NextFunction,
  ) => {
    /* Example Schema Validation Error

    {
    "status": "UNPROCESSABLE_ENTITY",
    "code": 422,
    "success": false,
    "message": "User validation failed: name: Nome inválido!, password: Senha inválida! Por favor insira uma senha mais forte!, accountConfirmation.cellphone.value: Path `value` is required.",
    "errors": {
        "name": {
            "name": "ValidatorError",
            "message": "Nome inválido!",
            "properties": {
                "message": "Nome inválido!",
                "type": "user defined",
                "path": "name",
                "value": "Teste 2"
            },
            "kind": "user defined",
            "path": "name",
            "value": "Teste 2"
        },
        "password": {
            "name": "ValidatorError",
            "message": "Senha inválida! Por favor insira uma senha mais forte!",
            "properties": {
                "message": "Senha inválida! Por favor insira uma senha mais forte!",
                "type": "user defined",
                "path": "password",
                "value": "123"
            },
            "kind": "user defined",
            "path": "password",
            "value": "123"
        },
        "accountConfirmation.cellphone.value": {
            "name": "ValidatorError",
            "message": "Path `value` is required.",
            "properties": {
                "message": "Path `value` is required.",
                "type": "required",
                "path": "value"
            },
            "kind": "required",
            "path": "value"
        }
    }
} */

    // Example Request Check Error
    /*

    {
    "status": "UNPROCESSABLE_ENTITY",
    "code": 422,
    "success": false,
    "message": "1 campos inválidos! (name)",
    "errors": [
        {
            "field": "name",
            "message": "Nome inválido!"
        }
    ]
}

 */
    this.preFunctions.forEach((fn) => fn.apply(null))

    if (error.status) {
      this.responserror.status = error.status
      const code = this.getCodeByStatus(error.status) //  Ex: INTERNAL_SERVER_ERROR => Map-Code: 500
      if (code) this.responserror.code = code
    }

    if (error.code) {
      this.responserror.code = error.code
      const status = this.getStatusByCode(error.code) //  Ex: 500 => Map-Status => INTERNAL_SERVER_ERROR
      if (status) this.responserror.status = status
    }

    this.responserror.message = error.message || //  Gets the error message from the incoming error OR
      this.getMessageByCode(this.responserror.code) //  Ex: 500 => Map-Message => internal server error

    this.responserror.errors = error.errors || error.content // Maps all the errors that ocurred into an array

    enum SchemaTypeErrors {
      ValidateError = 'ValidatorError',
      UniqueIndexError = 'UniqueIndexError',
      DefaultStatusError = 'DefaultStatusError',
    }

    let schemaTypeErrors: SchemaTypeErrors = SchemaTypeErrors.DefaultStatusError

    /* ValidateError: VALIDATION ERROR FROM SCHEMA */
    function isValidationSchemaErrorObject(
      errors: { [key: string]: any } | undefined,
    ) {
      const errorsJson = JSON.stringify(errors)
      if (errorsJson.includes('ValidatorError')) return true
      return false
    }

    const isValidationSchemaError = this.responserror.errors &&
      isValidationSchemaErrorObject(this.responserror.errors)

    /* UniqueIndexError: UNIQUE INDEX ERROR FROM SCHEMA */
    const isUniqueIndexError = this.responserror.message.includes('E11000')

    if (isValidationSchemaError) {
      schemaTypeErrors = SchemaTypeErrors.ValidateError
    }
    if (isUniqueIndexError) {
      schemaTypeErrors = SchemaTypeErrors.UniqueIndexError

      /* Replaces mongoose unique index error message to a more user friendly message
       * Example:
       * Original Message "Plan executor error during findAndModify :: caused by :: E11000 duplicate key error collection: ORCHESTRATOR_DEV_DB.users index: master.domain_1 dup key: { master.domain: "qualquerdominio.com" }"
       * Treated Message: "Já existe registro cadastrado com domain (master.domain: "novomasterdois.com")!"
       */

      this.responserror.message = this.responserror.message.replace(
        /.*index: (.*) dup key: { (.*) }/g,
        (_, index, key) => {
          const indexParts = index.split('.')
          let indexName = indexParts[indexParts.length - 1]
          const keyParts = key.split(',')
          const indexAndValue = keyParts
            .map((keyPart: string) => {
              const keyPartParts = keyPart.split(':')
              const keyName = keyPartParts[0].trim()
              const keyValue = keyPartParts[1].trim()
              return `${keyName}: ${keyValue}`
            })
            .join(', ')
          if (indexName.endsWith('_1')) indexName = indexName.slice(0, -2)
          return `Já existe registro cadastrado com ${indexName} (${indexAndValue})!`
        },
      )
    }

    /* ErroDaAana:  */

    // const identificacaodoerrodaana = this.responserror.message.includes('ERRO DAHORA DA ANA')
    // if (identificacaodoerrodaana) schemaTypeErrors = SchemaTypeErrors.ErrorNovoLegalDaAna

    /* Chose status by error type without using nested if's or switch */
    const status = fnCode.default.one(
      schemaTypeErrors,
      {
        [SchemaTypeErrors.ValidateError]: 'Bad Request',
        [SchemaTypeErrors.UniqueIndexError]: 'Conflict',
        // [SchemaTypeErrors.ErrorNovoLegalDaAna]: 'Banana Ana Error'
      },
      {
        default: this.responserror.status,
      },
    )

    const responserLikeStatus = camelCase(status)

    this.setDefaultValuesForResponserror()

    const responserrorObject = { ...this.responserror, ...error }

    if (isValidationSchemaError) {
      // @ts-ignore is necessary
      //  Maps all validation errors into the errors field
      responserrorObject.errors = Object.entries(this.responserror.errors).map(
        ([field, { message }]: [string, { message: string }]) => {
          const fieldName = field
          return {
            field: fieldName,
            message,
          }
        },
      )

      //  Sets the principal error code and status
      if (responserrorObject.errors.length) {
        responserrorObject.status = 'BAD_REQUEST'
        responserrorObject.code = 400
      }
    }

    //  If promptErrors prop is true, show errors on the terminal with console.error()
    if (
      this.options.promptErrors === true ||
      (typeof this.options.promptErrors === 'function' &&
        this.options.promptErrors())
    ) {
      // Handle ALL errors
      console.error('Error', error)
    }

    this.posFunctions.forEach((fn) => fn.apply(null))

    //  Deletes the prop '_message' from 'responserrorObject' (?)
    delete responserrorObject?._message

    // @ts-ignore: responserLikeStatus is a valid method
    //  Checks if the status fits some of the responser return errors
    if (typeof response[`send_${responserLikeStatus}`] === 'function') {
      // @ts-ignore: responserLikeStatus is a valid method
      //  If it fits some of responser pre configured errors function, then, returns it to the client
      return response[`send_${responserLikeStatus}`](
        this.responserror.message,
        responserrorObject?.errors,
      )
    }

    const defineResponseErrorCode = (responserrorObject: { code?: number }) => {
      //  Checks if the error exists and it is a number
      if (responserrorObject?.code && !isNaN(responserrorObject.code)) {
        const code = Number(responserrorObject.code)
        //  Checks if the incoming code is in a valid range of http status codes
        if (code >= 100 && code < 600) {
          return code
        }
      }

      // returns the code or default 500
      return this.responserror.code ?? 500
    }

    //  Defines the main error code to be returned, based on the 'responserrorObject' code prop
    const responseErrorCode = defineResponseErrorCode(responserrorObject)

    //  Return's the error reponse to the client
    return response.status(responseErrorCode).json(responserrorObject)
  }
}
