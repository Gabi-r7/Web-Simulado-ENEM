import { User } from '@prisma/client';
import { prisma } from '../../../../../prisma/client';
import { CreateUserDTO } from '../../dtos/createUserDTO';

export class CreateUserUseCase {
    async execute({ login, password, email }: CreateUserDTO): Promise<User> {
        //verificar se o email e login já existem
        const userAlreadyExists = await prisma.user.findUnique({
            where: {
                login,
                email
            }
        });

        if (userAlreadyExists) {
            
        }
        //criptografar a senha


        //criar o usuário
        const user = await prisma.user.create({
            data: {
                login,
                password,
                email
            }
        });

        return user;
    }
}