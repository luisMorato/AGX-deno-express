import { assertEquals } from 'https://deno.land/std@0.201.0/assert/mod.ts'
// import is from '@zarco/isness'
// import HttpStatus from 'npm:http-status-codes'

// const keys = Object.keys(HttpStatus.StatusCodes)
// const httpStatuses = keys.filter((status) => is.number(status)).map((status) => Number(status))

// type Statuses = (typeof httpStatuses)[number]

export enum ResponseType {
  success = 'success',
  error = 'error'
}

type IValidationError = {
  field?: string
  message: string
}

export type IResponsePayload = {
  success?: boolean
  message: string
  code: number
  status: string
  data?: any
  errors?: IValidationError[] // Field Reserved for Request Check validation Errors
}

type IExpected = {
  message?: string
  code?: number
  status: string
  data?: any
  errors?: IValidationError[] // Field Reserved for Request Check validation Errors
}

export const defaultAssert = (responsePayload: IResponsePayload, responseType: ResponseType, expected: IExpected) => {
  switch (responseType) {
    case ResponseType.success: {
      assertEquals(responsePayload.success, true)
      assertEquals(responsePayload.code, expected.code)
      assertEquals(responsePayload.status, expected.status)

      if (responsePayload.data) assertEquals(responsePayload.data, expected.data)
      
      break
    }

    case ResponseType.error: {
      assertEquals(responsePayload.code, expected.code)
      assertEquals(responsePayload.status, expected.status)
      assertEquals(responsePayload.message, expected.message)

      if (responsePayload.errors?.length && expected.errors?.length) {
        assertEquals(responsePayload.errors[0].message, expected.errors[0].message)
      }
      
      break
    }
  }
}