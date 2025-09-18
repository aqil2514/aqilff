export interface BasicHTTPResponse {
  message: string;
  ok: boolean;
}

export interface ResponseWithData<T = unknown> extends BasicHTTPResponse {
  data: T;
}
