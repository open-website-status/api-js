export interface APIOptions {
  server: string;
  path?: string;
}

export interface APIQueryMessage {
  token: string;
  protocol: 'http:' | 'https:';
  hostname: string;
  port?: number;
  pathname: string;
  search: string;
  subscribe: boolean;
}

export interface WebsiteQueryMessage {
  reCaptchaResponse: string;
  protocol: 'http:' | 'https:';
  hostname: string;
  port?: number;
  pathname: string;
  search: string;
  subscribe: boolean;
}

export interface GetQueryMessage {
  queryId: string;
  subscribe: boolean;
}

export interface Query {
  id: string;
  timestamp: string;
  protocol: 'http:' | 'https:';
  hostname: string;
  port: number | undefined;
  pathname: string;
  search: string;
}

export interface GetHostnameQueriesMessage {
  hostname: string;
  subscribe: boolean;
}

export interface HostnameQueries {
  hostname: string;
  queries: Query[];
}

export interface BaseJob {
  id: string;
  queryId: string;
  jobState: string;
  dispatchTimestamp: string;
  countryCode: string,
  regionCode: string,
  ispName: string,
}

export interface DispatchedJob extends BaseJob {
  jobState: 'dispatched';
}

export interface AcceptedJob extends BaseJob {
  jobState: 'accepted';
  acceptTimestamp: string;
}

export interface RejectedJob extends BaseJob {
  jobState: 'rejected';
  rejectTimestamp: string;
}

export interface CanceledJob extends BaseJob {
  jobState: 'canceled';
  acceptTimestamp: string;
  cancelTimestamp: string;
}

export interface JobResultSuccess {
  state: 'success';
  httpCode: number;
  /**
   * Execution time in milliseconds
   */
  executionTime: number;
}

export interface JobResultTimeout {
  state: 'timeout',
  executionTime: number,
}

export interface JobResultError {
  state: 'error',
  errorCode: string,
}

export type JobResult = JobResultSuccess | JobResultTimeout | JobResultError;

export interface CompletedJob extends BaseJob {
  jobState: 'completed';
  acceptTimestamp: string;
  completeTimestamp: string;
  result: JobResult;
}

export type Job = DispatchedJob | AcceptedJob | RejectedJob | CanceledJob | CompletedJob;

export interface JobList {
  queryId: string;
  jobs: Job[];
}

export interface JobDeleteMessage {
  jobId: string;
  queryId: string;
}

export interface ConnectedProvidersCountMessage {
  count: number;
}
