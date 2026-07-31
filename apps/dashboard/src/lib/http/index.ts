import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
} from 'axios';

export type AuthGetter = () => (string | null) | Promise<string | null>;

export type HttpClientConfig = {
  baseUrl: string;
  hasAuthMethode?: boolean;
  authGetter?: AuthGetter;
};

export class HttpClient {
  private readonly httpInstance: AxiosInstance;

  constructor(private readonly config: HttpClientConfig) {
    this.authorizationInterceptor = this.authorizationInterceptor.bind(this);
    this.httpInstance = axios.create({
      baseURL: this.config.baseUrl,
    });
    this.httpInstance.interceptors.request.use(this.authorizationInterceptor);
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return (await this.httpInstance.get(url, config)).data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return (await this.httpInstance.post(url, data, config)).data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return (await this.httpInstance.put(url, data, config)).data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return (await this.httpInstance.patch(url, data, config)).data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return (await this.httpInstance.delete(url, config)).data;
  }

  private async authorizationInterceptor(
    config: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> {
    if (!this.config.hasAuthMethode) return config;
    config.headers['Authorization'] =
      (await this.config.authGetter?.()) ?? undefined;
    return config;
  }
}

export class HttpClientBuilder {
  private config: HttpClientConfig;

  constructor(baseUrl: string) {
    this.config = { baseUrl };
  }

  setAuthGetter(cb: AuthGetter): HttpClientBuilder {
    this.config.authGetter = cb;
    this.config.hasAuthMethode = true;
    return this;
  }

  build(): HttpClient {
    return new HttpClient(this.config);
  }
}
