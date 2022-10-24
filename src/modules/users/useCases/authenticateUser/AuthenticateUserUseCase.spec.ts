import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let userTest : ICreateUserDTO;

describe("Autehenticate User", () => {

  beforeEach(() =>{
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
  })

  beforeAll (() => {
    userTest = {
      name: "Jhon Doe",
      email: "jhondoe@email.com",
      password: "1234"
    }
  })


  it("Should be able to authenticate an user", async () => { 
    await createUserUseCase.execute(userTest);

    const result = await authenticateUserUseCase.execute({
      email: userTest.email,
      password: userTest.password
    })

    expect(result).toHaveProperty("token");
  });

  it("Should not be able authenticate an nonexistent email user", () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "false@email.com",
        password: userTest.password
      });
    }).rejects.toBeInstanceOf(AppError)
  });

  it("Should not be able authenticate with incorrect password", () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: userTest.email,
        password: "incorrectPassword"
      });
    }).rejects.toBeInstanceOf(AppError)
  });

})