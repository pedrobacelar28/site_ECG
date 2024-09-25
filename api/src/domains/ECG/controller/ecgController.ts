import { Router, Request, Response } from "express";
import ECGService from "../service/ecgService";

class ECGController {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post("/", this.create); // POST /ecgs
        this.router.get("/", this.findAll); // GET /ecgs
        this.router.get("/:id", this.findById); // GET /ecgs/:id
        this.router.put("/:id", this.update); // PUT /ecgs/:id
        this.router.delete("/:id", this.delete); // DELETE /ecgs/:id
        this.router.get("/oldClassification/:oldClassification", this.findByOldClassification); // GET /ecgs/oldClassification/:oldClassification
    }

    // Método para criar um novo ECG
    async create(req: Request, res: Response) {
        try {
            const ecg = await ECGService.create(req.body);
            return res.status(201).json(ecg);
        } catch (error) {
            return res.status(400).json({ error: "Erro ao criar o ECG." });
        }
    }

    // Método para encontrar um ECG por ID
    async findById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const ecg = await ECGService.findById(id);
            if (ecg) {
                return res.status(200).json(ecg);
            }
            return res.status(404).json({ error: "ECG não encontrado." });
        } catch (error) {
            return res.status(400).json({ error: "Erro ao buscar o ECG." });
        }
    }

    // Método para listar todos os ECGs
    async findAll(req: Request, res: Response) {
        try {
            const ecgs = await ECGService.findAll();
            return res.status(200).json(ecgs);
        } catch (error) {
            return res.status(400).json({ error: "Erro ao listar os ECGs." });
        }
    }

    // Método para atualizar um ECG
    async update(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const ecg = await ECGService.update(id, req.body);
            return res.status(200).json(ecg);
        } catch (error) {
            return res.status(400).json({ error: "Erro ao atualizar o ECG." });
        }
    }

    // Método para deletar um ECG
    async delete(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await ECGService.delete(id);
            return res.status(204).send();
        } catch (error) {
            return res.status(400).json({ error: "Erro ao deletar o ECG." });
        }
    }

    // Método para encontrar ECGs por classificação antiga
    async findByOldClassification(req: Request, res: Response) {
        try {
            const oldClassification = req.params.oldClassification;
            const ecgs = await ECGService.findByOldClassification(oldClassification);
            return res.status(200).json(ecgs);
        } catch (error) {
            return res.status(400).json({ error: "Erro ao buscar os ECGs." });
        }
    }
}

export default new ECGController().router;
