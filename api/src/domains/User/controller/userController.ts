import { Router, Request, Response, NextFunction } from "express";
import UserService from "../service/userService";
import { login as loginMiddleware, logout as logoutMiddleware, notLoggedIn, verifyJWT, checkRole } from "../../../middlewares/auth";

class UserController {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post("/", this.create); // POST /users
        this.router.get("/", verifyJWT, checkRole(["Admin"]), this.findAll); // GET /users
        this.router.get("/:id", verifyJWT, checkRole(["Admin"]), this.findById); // GET /users/:id
        this.router.put("/:id", this.update); // PUT /users/:id
        this.router.delete("/:id", this.delete); // DELETE /users/:id
        this.router.get("/email/:email", verifyJWT, checkRole(["Admin"]), this.findByEmail);// GET /users/email/:email

        // Rotas de autenticação
        this.router.post("/login", notLoggedIn, this.login); // POST /users/login
        this.router.post("/logout", verifyJWT, this.logout); // POST /users/logout
    }

    // Método para criar um novo usuário
    async create(req: Request, res: Response) {
        try {
            const user = await UserService.create(req.body);
            return res.status(201).json(user);
        } catch (error) {
            return res.status(400).json({ error: "Erro ao criar o usuário." });
        }
    }

    // Método para encontrar um usuário por ID
    async findById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const user = await UserService.findById(id);
            if (user) {
                return res.status(200).json(user);
            }
            return res.status(404).json({ error: "Usuário não encontrado." });
        } catch (error) {
            return res.status(400).json({ error: "Erro ao buscar o usuário." });
        }
    }

    // Método para listar todos os usuários
    async findAll(req: Request, res: Response) {
        try {
            const users = await UserService.findAll();
            return res.status(200).json(users);
        } catch (error) {
            return res.status(400).json({ error: "Erro ao listar os usuários." });
        }
    }

    // Método para atualizar um usuário
    async update(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const user = await UserService.update(id, req.body);
            return res.status(200).json(user);
        } catch (error) {
            return res.status(400).json({ error: "Erro ao atualizar o usuário." });
        }
    }

    // Método para deletar um usuário
    async delete(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await UserService.delete(id);
            return res.status(204).send();
        } catch (error) {
            return res.status(400).json({ error: "Erro ao deletar o usuário." });
        }
    }

    // Método para encontrar um usuário por email
    async findByEmail(req: Request, res: Response) {
        try {
            const email = req.params.email;
            const user = await UserService.findByEmail(email);
            if (user) {
                return res.status(200).json(user);
            }
            return res.status(404).json({ error: "Usuário não encontrado." });
        } catch (error) {
            return res.status(400).json({ error: "Erro ao buscar o usuário." });
        }
    }

    // Método para realizar o login
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            await loginMiddleware(req, res, next); // Garantir que o middleware seja chamado com `next`
        } catch (error) {
            next(error); // Propagar o erro corretamente
        }
    }

    // Método para realizar o logout
    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            await logoutMiddleware(req, res, next); // Garantir que o middleware seja chamado com `next`
        } catch (error) {
            next(error); // Propagar o erro corretamente
        }
    }
}

export default new UserController().router;
