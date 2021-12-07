import { Result } from '../../boundaries/types/result';
import { Validator } from '../../boundaries/validation';
import { RequiredFieldValidator } from '../common/validators/required-field.validator';
import { ISolutionsApiService } from './boundaries';
import { CreateSolutionDTO, DeleteSolutionDTO, FetchSolutionDTO } from './dto';
import { Solution } from './types';

export class SolutionsHandler {
  constructor(private solutionsService: ISolutionsApiService) {}

  list(): Promise<Result<Solution[]>> {
    return this.solutionsService
      .listTemplateGroups()
      .then((solutions) => Result.ok(solutions));
  }

  fetch(dto: FetchSolutionDTO): Promise<Result<Solution>> {
    return this.solutionsService
      .fetchTemplateGroup(dto)
      .then((solutions) => Result.ok(solutions));
  }

  create(dto: CreateSolutionDTO): Promise<Result<Solution>> {
    const validator = new Validator(dto);
    validator.addRule('name', new RequiredFieldValidator());
    const validationResult = validator.validate();

    if (!validationResult.valid) {
      console.error(validationResult.errors);
      return Promise.resolve(Result.fail(validationResult.errors));
    }
    return this.solutionsService
      .createTemplateGroup(dto)
      .then((solution) => Result.ok(solution))
      .catch((err) => {
        if (err.status === 409) {
          return Result.fail({
            name: 'Solution name already exists.',
          });
        }

        return Result.fail(err);
      });
  }

  delete(dto: DeleteSolutionDTO): Promise<Result<unknown>> {
    return this.solutionsService
      .deleteTemplateGroup(dto)
      .then((res) => Result.ok(res))
      .catch((err) => {
        if (err.status === 403) {
          return Result.fail({
            name: 'Failed to delete the solution, insufficient access rights.',
          });
        }

        return Result.fail(err);
      });
  }
}
