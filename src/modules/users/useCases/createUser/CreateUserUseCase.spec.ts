import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase"


let createUserUseCase : CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository

describe ("Create User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  })

  it("Should be able create a new user", async () => {
    const user = {
      name: "User Test Name",
      email: "email@usertest.com",
      password: "1234"
    }

    await createUserUseCase.execute(user);

    const userCreated = await usersRepositoryInMemory.findByEmail(user.email);

    expect(userCreated).toHaveProperty("email");
  })

  it("Should not be able create a new user with email exists", () => {

    expect( async () => {
      const user = {
        name: "User Test Name",
        email: "email@usertest.com",
        password: "1234"
      }

      await createUserUseCase.execute(user);

      await createUserUseCase.execute(user);

    }).rejects.toBeInstanceOf(AppError);
  })




})