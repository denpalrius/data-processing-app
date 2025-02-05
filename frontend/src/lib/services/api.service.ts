import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { API_GATEWAY_URL } from "../constants";

export class ApiService {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string = API_GATEWAY_URL) {
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  }

  async get<TResponse>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<TResponse>> {
    try {
      const response: AxiosResponse<TResponse> = await this.axiosInstance.get(
        url,
        config
      );
      return response;
    } catch (error) {
      this.handleError(error);
    }
  }

  async post<TRequest, TResponse>(
    url: string,
    data: TRequest,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<TResponse>> {
    try {
      const response: AxiosResponse<TResponse> = await this.axiosInstance.post(
        url,
        data,
        config
      );
      return response;
    } catch (error) {
      this.handleError(error);
    }
  }

  async put<TRequest, TResponse>(
    url: string,
    data: TRequest,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<TResponse>> {
    try {
      const response: AxiosResponse<TResponse> = await this.axiosInstance.put(
        url,
        data,
        config
      );
      return response;
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete<TResponse>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<TResponse>> {
    try {
      const response: AxiosResponse<TResponse> =
        await this.axiosInstance.delete(url, config);
      return response;
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any): never {
    console.error("API call error:", error);
    throw new Error("API call failed");
  }
}
