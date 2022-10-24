import { AppError } from "../../../../shared/errors/AppError";
import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let statementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

let userTest: ICreateUserDTO;
let userTestResult: User;

describe("Get StatementOperationUseCase", () => {
  beforeAll(() => {
    userTest = {
      name: "Jhon Doe",
      email: "jhondoe@email.com",
      password: "1234",
    };
  });

  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);

    statementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementsRepository
    );
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepositoryInMemory,
      statementsRepository
    );
  });

  it("Should be able get a statement operation", async () => {
    userTestResult = await createUserUseCase.execute(userTest);

    if (userTestResult.id) {
      const type = OperationType.DEPOSIT;
      const result = await createStatementUseCase.execute({
        user_id: userTestResult.id,
        description: "Description Statement Test Deposit",
        type,
        amount: 2000,
      });
      expect(result).toHaveProperty("id");

      if (result.id) {
        const resultOperation = await getStatementOperationUseCase.execute({
          user_id: userTestResult.id,
          statement_id: result.id,
        });
        expect(resultOperation.amount).toEqual(2000);
      }
    }
  });

  it("Should not be able a statement operation an nonexistent user", async () => {
    expect(async () => {
      if (userTestResult.id) {
        const type = OperationType.DEPOSIT;
        const result = await createStatementUseCase.execute({
          user_id: userTestResult.id,
          description: "Description Statement Test Deposit",
          type,
          amount: 2000,
        });
        expect(result).toHaveProperty("id");

        if (result.id) {
          await getStatementOperationUseCase.execute({
            user_id: "nonexistent user id",
            statement_id: result.id,
          });
        }
      }
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should not be able a statement operation an nonexistent statement", async () => {
    expect(async () => {
      if (userTestResult.id) {
        const type = OperationType.DEPOSIT;

        const result = await createStatementUseCase.execute({
          user_id: userTestResult.id,
          description: "Description Statement Test Deposit",
          type,
          amount: 2000,
        });
        expect(result).toHaveProperty("id");

        await getStatementOperationUseCase.execute({
          user_id: userTestResult.id,
          statement_id: "nonexistent statement id",
        });
        
      }
    }).rejects.toBeInstanceOf(AppError);
  });
});
