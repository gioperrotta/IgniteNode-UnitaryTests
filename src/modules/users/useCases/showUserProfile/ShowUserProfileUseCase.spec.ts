
import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"


let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

let showUserProfileUseCae: ShowUserProfileUseCase;
let userTest : ICreateUserDTO;


describe("Show User Profile", () => {

  beforeEach(() =>{
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    showUserProfileUseCae = new ShowUserProfileUseCase(usersRepositoryInMemory);
    userTest = {
      name: "Jhon Doe",
      email: "jhondoe@email.com",
      password: "1234"
    }
  })

  it ("Shoud be able list user profile", async () => {

    const {id} = await createUserUseCase.execute(userTest);

    if (id) {
      const userProfile = await showUserProfileUseCae.execute(id)
      expect(userProfile.email).toEqual("jhondoe@email.com")
    }
  })

  it ("Should not be list when user not exists", async () => {

    expect (async () => {
      await showUserProfileUseCae.execute("not exists id");
    }).rejects.toBeInstanceOf(AppError);
  })
})