import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

export class UnitOfWork {
  constructor(
    @InjectEntityManager()
    private manager: EntityManager,
  ) {
    this.manager = this.manager;
  }

  getManager() {
    return this.manager;
  }

  async doTransactional<T>(fn): Promise<T> {
    return await this.manager.transaction(async (manager) => {
      return fn(manager);
    });
  }
}
