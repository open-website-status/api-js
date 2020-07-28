import io from 'socket.io-client';
import { EventEmitter } from 'typed-event-emitter';
import {
  APIOptions, APIQueryMessage, GetQueryMessage, Job, JobDeleteMessage, JobList, Query, WebsiteQueryMessage,
} from './types';

export default class OpenWebsiteStatusAPI extends EventEmitter {
  public readonly onConnect = this.registerEvent<() => unknown>();

  public readonly onConnectError = this.registerEvent<(error: Error) => unknown>();

  public readonly onConnectTimeout = this.registerEvent<() => unknown>();

  public readonly onError = this.registerEvent<(error: string) => unknown>();

  public readonly onDisconnect = this.registerEvent<() => unknown>();

  public readonly onJobList = this.registerEvent<(queryId: string, jobs: Job[]) => unknown>();

  public readonly onJobCreate = this.registerEvent<(job: Job) => unknown>();

  public readonly onJobModify = this.registerEvent<(job: Job) => unknown>();

  public readonly onJobDelete = this.registerEvent<(jobId: string, queryId: string) => unknown>();

  private readonly socket: SocketIOClient.Socket;

  public constructor(options: APIOptions) {
    super();

    this.socket = io(options.server, {
      path: options.path ?? '/api-socket',
    });

    this.socket.on('connect', () => {
      this.emit(this.onConnect);
    });

    this.socket.on('connect_error', (error: Error) => {
      this.emit(this.onConnectError, error);
    });

    this.socket.on('connect_timeout', () => {
      this.emit(this.onConnectTimeout);
    });

    this.socket.on('error', (errorMessage: string) => {
      this.emit(this.onError, errorMessage);
    });

    this.socket.on('disconnect', () => {
      this.emit(this.onDisconnect);
    });

    this.socket.on('job-list', (message: JobList) => {
      this.emit(this.onJobList, message.queryId, message.jobs);
    });

    this.socket.on('job-create', (message: Job) => {
      this.emit(this.onJobCreate, message);
    });

    this.socket.on('job-modify', (message: Job) => {
      this.emit(this.onJobModify, message);
    });

    this.socket.on('job-delete', (message: JobDeleteMessage) => {
      this.emit(this.onJobDelete, message.jobId, message.queryId);
    });
  }

  public queryWebsite(data: WebsiteQueryMessage): Promise<Query> {
    return new Promise((resolve, reject) => {
      this.socket.emit('query-website', data, (errorMessage: string | null, query: Query) => {
        if (errorMessage !== null) {
          reject(new Error(errorMessage));
        } else {
          resolve(query);
        }
      });
    });
  }

  public queryAPI(data: APIQueryMessage): Promise<Query> {
    return new Promise((resolve, reject) => {
      this.socket.emit('query-api', data, (errorMessage: string | null, query: Query) => {
        if (errorMessage !== null) {
          reject(new Error(errorMessage));
        } else {
          resolve(query);
        }
      });
    });
  }

  public getQuery(data: GetQueryMessage): Promise<Query> {
    return new Promise(((resolve, reject) => {
      this.socket.emit('get-query', data, (errorMessage: string | null, query: Query) => {
        if (errorMessage !== null) {
          reject(new Error(errorMessage));
        } else {
          resolve(query);
        }
      });
    }));
  }
}
