import { AppError } from "../../../../shared/errors/AppError";
import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let statementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

let userTest: ICreateUserDTO;
let userTestResult: User;

describe("Create StatementUseCase", () => {
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
  });

  it("Should be able create a statement type deposit", async () => {
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
    }
  });

  it("Should be able create a statement type withdraw", async () => {
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
    }
    if (userTestResult.id) {
      const type = OperationType.WITHDRAW;
      const result = await createStatementUseCase.execute({
        user_id: userTestResult.id,
        description: "Description Statement Test Deposit",
        type,
        amount: 200,
      });
      expect(result).toHaveProperty("id");
    }
  });

  it("Should not be able create a statement type withdraw with Insufficient Funds", async () => {
    expect(async () => {
      userTestResult = await createUserUseCase.execute(userTest);
      if (userTestResult.id) {
        let type = OperationType.DEPOSIT;
        await createStatementUseCase.execute({
          user_id: userTestResult.id,
          description: "Description Statement Test DEPOSIT",
          type,
          amount: 200,
        });
        type = OperationType.WITHDRAW;
        await createStatementUseCase.execute({
          user_id: userTestResult.id,
          description: "Description Statement Test WITHDRAW",
          type,
          amount: 2000,
        });
      }
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should not be able create a statement an nonexistent user", async () => {
    expect(async () => {
      const type = OperationType.DEPOSIT;

      await createStatementUseCase.execute({
        user_id: "nonexistent user id",
        description: "Description Statement Test Deposit",
        type,
        amount: 2000,
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
