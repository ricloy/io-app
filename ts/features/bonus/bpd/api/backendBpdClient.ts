import {
  ApiHeaderJson,
  composeHeaderProducers,
  createFetchRequestForApi,
  MapResponseType,
  RequestHeaderProducer
} from "italia-ts-commons/lib/requests";
import * as t from "io-ts";
import * as r from "italia-ts-commons/lib/requests";
import { constNull } from "fp-ts/lib/function";
import { defaultRetryingFetch } from "../../../../utils/fetch";
import {
  enrollmentDecoder,
  EnrollmentT,
  findUsingGETDecoder,
  FindUsingGETT
} from "../../../../../definitions/bpd/citizen/requestTypes";
import {
  DeleteUsingDELETET,
  enrollmentPaymentInstrumentIOUsingPUTDefaultDecoder,
  EnrollmentPaymentInstrumentIOUsingPUTT,
  findUsingGETDefaultDecoder,
  FindUsingGETT as FindPaymentUsingGETT
} from "../../../../../definitions/bpd/payment/requestTypes";
import { Iban } from "../../../../../definitions/backend/Iban";
import {
  findAllUsingGETDefaultDecoder,
  FindAllUsingGETT
} from "../../../../../definitions/bpd/award_periods/requestTypes";

import {
  getTotalScoreUsingGETDefaultDecoder,
  GetTotalScoreUsingGETT
} from "../../../../../definitions/bpd/total_cashback/requestTypes";
import { PatchedCitizenResource } from "./patchedTypes";

const headersProducers = <
  P extends {
    readonly Authorization: string;
  }
>() =>
  ((p: P) => ({
    // since these headers are not correctly autogenerated we have to access them as an anonymous object
    Authorization: `Bearer ${(p as any).Bearer}`
  })) as RequestHeaderProducer<P, "Authorization">;

/* CITIZEN (status, enroll, delete) */
type FindUsingGETTExtra = MapResponseType<
  FindUsingGETT,
  200,
  PatchedCitizenResource
>;

const findT: FindUsingGETTExtra = {
  method: "get",
  url: () => `/bpd/io/citizen`,
  query: _ => ({}),
  headers: headersProducers(),
  response_decoder: findUsingGETDecoder(PatchedCitizenResource)
};

type EnrollmentTTExtra = MapResponseType<
  EnrollmentT,
  200,
  PatchedCitizenResource
>;
const enrollCitizenIOT: EnrollmentTTExtra = {
  method: "put",
  url: () => `/bpd/io/citizen`,
  query: _ => ({}),
  body: _ => "",
  headers: composeHeaderProducers(headersProducers(), ApiHeaderJson),
  response_decoder: enrollmentDecoder(PatchedCitizenResource)
};

const deleteResponseDecoders = r.composeResponseDecoders(
  r.composeResponseDecoders(
    r.constantResponseDecoder<undefined, 204>(204, undefined),
    r.constantResponseDecoder<undefined, 401>(401, undefined)
  ),
  r.constantResponseDecoder<undefined, 404>(404, undefined)
);

// these responses code/codec are built from api usage and not from API spec
// see https://bpd-dev.portal.azure-api.net/docs/services/bpd-ms-citizen/operations/deleteUsingDELETE
type DeleteUsingDELETETExtra = r.IDeleteApiRequestType<
  {
    readonly Authorization: string;
    readonly x_request_id?: string;
  },
  never,
  never,
  | r.IResponseType<204, undefined>
  | r.IResponseType<401, undefined>
  | r.IResponseType<404, undefined>
  | r.IResponseType<500, undefined>
>;

const deleteCitizenIOT: DeleteUsingDELETETExtra = {
  method: "delete",
  url: () => `/bpd/io/citizen`,
  query: _ => ({}),
  headers: headersProducers(),
  response_decoder: deleteResponseDecoders
};

/* PAYMENT (status, enroll, delete) */
const findPayment: FindPaymentUsingGETT = {
  method: "get",
  url: ({ id }) => `/bpd/io/payment-instruments/${id}`,
  query: _ => ({}),
  headers: headersProducers(),
  response_decoder: findUsingGETDefaultDecoder()
};

const enrollPayment: EnrollmentPaymentInstrumentIOUsingPUTT = {
  method: "put",
  url: ({ id }) => `/bpd/io/payment-instruments/${id}`,
  query: _ => ({}),
  body: () => "",
  headers: composeHeaderProducers(ApiHeaderJson, headersProducers()),
  response_decoder: enrollmentPaymentInstrumentIOUsingPUTDefaultDecoder()
};

const deletePaymentResponseDecoders = r.composeResponseDecoders(
  r.composeResponseDecoders(
    r.constantResponseDecoder<undefined, 204>(204, undefined),
    r.constantResponseDecoder<undefined, 400>(400, undefined)
  ),
  r.composeResponseDecoders(
    r.constantResponseDecoder<undefined, 401>(401, undefined),
    r.constantResponseDecoder<undefined, 500>(500, undefined)
  )
);

const deletePayment: DeleteUsingDELETET = {
  method: "delete",
  url: ({ id }) => `/bpd/io/payment-instruments/${id}`,
  query: _ => ({}),
  headers: headersProducers(),
  response_decoder: deletePaymentResponseDecoders
};

/* AWARD PERIODS  */
const awardPeriods: FindAllUsingGETT = {
  method: "get",
  url: () => `/bpd/io/award-periods`,
  query: _ => ({}),
  headers: headersProducers(),
  response_decoder: findAllUsingGETDefaultDecoder()
};

/* TOTAL CASHBACK  */
const totalCashback: GetTotalScoreUsingGETT = {
  method: "get",
  url: ({ awardPeriodId }) =>
    `/bpd/io/winning-transactions/total-cashback?awardPeriodId=${awardPeriodId}`,
  query: _ => ({}),
  headers: headersProducers(),
  response_decoder: getTotalScoreUsingGETDefaultDecoder()
};

// decoders composition to handle updatePaymentMethod response
export function patchIbanDecoders<A, O>(type: t.Type<A, O>) {
  return r.composeResponseDecoders(
    r.composeResponseDecoders(
      r.composeResponseDecoders(
        r.ioResponseDecoder<200, typeof type["_A"], typeof type["_O"]>(
          200,
          type
        ),
        r.composeResponseDecoders(
          r.constantResponseDecoder<undefined, 400>(400, undefined),
          r.constantResponseDecoder<undefined, 401>(401, undefined)
        )
      ),
      r.constantResponseDecoder<undefined, 404>(404, undefined)
    ),
    r.constantResponseDecoder<undefined, 500>(500, undefined)
  );
}

/* Patch IBAN */
const jsonContentType = "application/json; charset=utf-8";
const PatchIban = t.interface({ validationStatus: t.string });
type PatchIban = t.TypeOf<typeof PatchIban>;
type finalType =
  | r.IResponseType<200, PatchIban>
  | r.IResponseType<401, undefined>
  | r.IResponseType<404, undefined>
  | r.IResponseType<400, undefined>
  | r.IResponseType<500, undefined>;
// custom implementation of patch request
// TODO abstract the usage of fetch
const updatePaymentMethodT = (
  options: Options,
  fiscalCode: string,
  iban: { payoffInstr: Iban; payoffInstrType: string },
  headers: Record<string, string>
): (() => Promise<t.Validation<finalType>>) => () =>
  new Promise((res, rej) => {
    withTestToken(options, fiscalCode)
      .then(tokenResponse => {
        const testToken = tokenResponse.text();
        options
          .fetchApi(`${options.baseUrl}/bpd/io/citizen`, {
            method: "patch",
            headers: { ...headers, Authorization: `Bearer ${testToken}` },
            body: JSON.stringify(iban)
          })
          .then(response => {
            patchIbanDecoders(PatchIban)(response).then(res).catch(rej);
          })
          .catch(rej);
      })
      .catch(constNull);
  });

type Options = {
  baseUrl: string;
  fetchApi: typeof fetch;
};

// FIX ME !this code must be removed!
// only for test purpose
const withTestToken = (options: Options, fiscalCode: string) =>
  options.fetchApi(
    `${options.baseUrl}/bpd/pagopa/api/v1/login?fiscalCode=${fiscalCode}`,
    {
      method: "post"
    }
  );

export function BackendBpdClient(
  baseUrl: string,
  token: string,
  fiscalCode: string,
  fetchApi: typeof fetch = defaultRetryingFetch()
) {
  const options: Options = {
    baseUrl,
    fetchApi
  };
  // withBearerToken injects the header "Bearer" with token
  // and "Ocp-Apim-Subscription-Key" with an hard-coded value (perhaps it won't be used)
  type extendHeaders = {
    readonly apiKeyHeader?: string;
    readonly Authorization?: string;
    readonly Bearer?: string;
    ["Ocp-Apim-Subscription-Key"]?: string;
  };

  const withBearerToken = <P extends extendHeaders, R>(
    f: (p: P) => Promise<R>
  ) => async (po: P): Promise<R> => {
    const params = Object.assign({ Bearer: token }, po) as P;
    return f(params);
  };

  return {
    find: withBearerToken(createFetchRequestForApi(findT, options)),
    enrollCitizenIO: withBearerToken(
      createFetchRequestForApi(enrollCitizenIOT, options)
    ),
    deleteCitizenIO: withBearerToken(
      createFetchRequestForApi(deleteCitizenIOT, options)
    ),
    updatePaymentMethod: (iban: Iban) =>
      withBearerToken(
        updatePaymentMethodT(
          options,
          fiscalCode,
          // payoffInstrType has IBAN as hardcoded value
          { payoffInstr: iban, payoffInstrType: "IBAN" },
          { ["Content-Type"]: jsonContentType }
        )
      ),
    findPayment: withBearerToken(
      createFetchRequestForApi(findPayment, options)
    ),
    enrollPayment: withBearerToken(
      createFetchRequestForApi(enrollPayment, options)
    ),
    deletePayment: withBearerToken(
      createFetchRequestForApi(deletePayment, options)
    ),
    awardPeriods: withBearerToken(
      createFetchRequestForApi(awardPeriods, options)
    ),
    totalCashback: withBearerToken(
      createFetchRequestForApi(totalCashback, options)
    )
  };
}
