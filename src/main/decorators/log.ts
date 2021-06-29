import { LogErrorRepository } from '../../data/protocols/log-error-repository';
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '../../presentation/protocols';

export class LogControllerDecorator implements Controller {
  private readonly controller: Controller;

  private readonly logRepository: LogErrorRepository

  constructor(controller: Controller, logRepository: LogErrorRepository) {
    this.controller = controller;
    this.logRepository = logRepository;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest);
    if (httpResponse.statusCode === 500) {
      await this.logRepository.log(httpResponse.body.stack);
    }
    return httpResponse;
  }
}
