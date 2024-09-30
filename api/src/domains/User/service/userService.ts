import { Prisma } from "@prisma/client";
import prisma from "../../../../config/prismaclient";
import { hash } from "bcryptjs";

class UserService {
    // Método para criar um novo usuário
    async create(body: Prisma.UserCreateInput) {
        const hashedPassword = await hash(body.senha, 10); // Criptografando a senha
        return await prisma.user.create({
            data: {
                nome: body.nome,
                email: body.email,
                senha: hashedPassword, // Usando a senha criptografada
                cargo: body.cargo
            }
        });
    }

    // Método para encontrar um usuário por ID
    async findById(id: number) {
        return await prisma.user.findUnique({
            where: {
                id: id
            }
        });
    }

    // Método para listar todos os usuários
    async findAll() {
        return await prisma.user.findMany();
    }

    // Método para atualizar um usuário
    async update(id: number, body: Prisma.UserUpdateInput) {
        return await prisma.user.update({
            where: {
                id: id
            },
            data: body
        });
    }

    // Método para deletar um usuário
    async delete(id: number) {
        return await prisma.user.delete({
            where: {
                id: id
            }
        });
    }

    // Método para encontrar um usuário por email
    async findByEmail(email: string) {
        return await prisma.user.findUnique({
            where: {
                email: email
            }
        });
    }
}

export default new UserService();
