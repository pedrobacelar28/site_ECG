import { Prisma } from "@prisma/client";
import prisma from "../../../../config/prismaclient";

class ECGService {
    // Método para criar um novo ECG
    async create(body: Prisma.ECGCreateInput) {
        return await prisma.eCG.create({
            data: {
                oldClassification: body.oldClassification,
                classification: body.classification,
                noise: body.noise,
                imagem: body.imagem
            }
        });
    }

    // Método para encontrar um ECG por ID
    async findById(id: number) {
        return await prisma.eCG.findUnique({
            where: {
                id: id
            }
        });
    }

    // Método para listar todos os ECGs
    async findAll() {
        return await prisma.eCG.findMany();
    }

    // Método para atualizar um ECG
    async update(id: number, body: Prisma.ECGUpdateInput) {
        return await prisma.eCG.update({
            where: {
                id: id
            },
            data: body
        });
    }

    // Método para deletar um ECG
    async delete(id: number) {
        return await prisma.eCG.delete({
            where: {
                id: id
            }
        });
    }

    // Método para encontrar ECGs por classificação antiga
    async findByOldClassification(oldClassification: string) {
        return await prisma.eCG.findMany({
            where: {
                oldClassification: oldClassification
            }
        });
    }
}

export default new ECGService();
