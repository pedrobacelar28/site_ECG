import { Request, Response, NextFunction } from "express";
import { sign, verify, JwtPayload } from "jsonwebtoken";
import { compare } from "bcryptjs";
import UserService from "../domains/User/service/userService";
import { User } from "@prisma/client";

// Estender a interface Request para incluir a propriedade user
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                email: string;
                cargo: string;
                nome: string;
            };
        }
    }
}

// Função para gerar o token JWT
function generateJWT(user: User, res: Response) {
    const body = {
        id: user.id,
        email: user.email,
        cargo: user.cargo, // ajuste conforme sua estrutura de dados
        name: user.nome
    };

    const token = sign({ user: body }, process.env.SECRET_KEY || "", { expiresIn: process.env.JWT_EXPIRATION });

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development", // Use secure cookies only in production
        sameSite: "strict" // Pode ser útil para evitar CSRF
    });
}

// Função para extrair o token do cookie
function cookieExtractor(req: Request): string | null {
    return req.cookies ? req.cookies["jwt"] : null;
}

// Middleware para verificar JWT e autenticar o usuário

export function verifyJWT(req: Request, res: Response, next: NextFunction) {
    const token = cookieExtractor(req);
    if (!token) {
        return res.status(401).json({ error: "Você precisa estar logado para realizar essa ação!" });
    }

    try {
        const decoded = verify(token, process.env.SECRET_KEY || "") as JwtPayload;
        req.user = decoded.user;

        console.log("Decoded user:", req.user); // Adicione este log

        if (!req.user) {
            return res.status(401).json({ error: "Token inválido ou expirado." });
        }

        next();
    } catch (error) {
        return res.status(401).json({ error: "Token inválido ou expirado." });
    }
}

// Função de login tradicional
export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const user = await UserService.findByEmail(req.body.email);

        if (!user) {
            return res.status(401).json({ error: "Email e/ou senha incorretos!" });
        }

        const match = await compare(req.body.senha, user.senha);
        if (!match) {
            return res.status(401).json({ error: "Email e/ou senha incorretos!" });
        }

        generateJWT(user, res);
        return res.status(200).json({ message: "Login realizado com sucesso!" });
    } catch (error) {
        next(error);
    }
}

// Middleware para verificar se o usuário já está logado
export function notLoggedIn(req: Request, res: Response, next: NextFunction) {
    const token = cookieExtractor(req);

    if (token) {
        try {
            // Tente verificar o token
            const decoded = verify(token, process.env.SECRET_KEY || "") as JwtPayload;
            
            if (decoded) {
                // Se o token for válido, bloqueia o acesso ao login
                return res.status(400).json({ error: "Você já está logado!" });
            }
        } catch (error) {
            // Se o token for inválido ou expirado, permita o acesso
            console.log("Token inválido ou expirado:", error.message);
            next();
        }
    } else {
        // Se não houver token, permitir o acesso
        next();
    }
}

// Função de logout
export function logout(req: Request, res: Response, next: NextFunction) {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict"
        });

        return res.status(200).json({ message: "Logout realizado com sucesso!" });
    } catch (error) {
        next(error);
    }
}

// Verificar se o usuário tem um papel específico
export function checkRole(allowedRoles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;

        console.log("User role:", user?.cargo); // Adicione este log

        if (!user) {
            return res.status(401).json({ error: "Usuário não autenticado" });
        }

        const hasPermission = allowedRoles.includes(user.cargo);
        if (!hasPermission) {
            return res.status(403).json({ error: "Você não tem permissão para acessar essa rota!" });
        }

        next();
    };
}