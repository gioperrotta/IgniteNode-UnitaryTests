import { AppError } from "../../../../shared/errors/AppError";
import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let statementsRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;
let createStatementUseCase: CreateStatementUseCase;

let userTest: ICreateUserDTO;
let userTestResult: User;

describe("Get BalanceUseCase", () => {
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
    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepository,
      usersRepositoryInMemory
    );
  });

  it("Should be able get a statements balnce", async () => {
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

      const balanceResult = await getBalanceUseCase.execute({
        user_id: userTestResult.id,
      });
      expect(balanceResult).toHaveProperty("balance");
    }
  });

  it("Should not be able get a statements balnce an nonexistent user", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: "nonexistent user id",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
