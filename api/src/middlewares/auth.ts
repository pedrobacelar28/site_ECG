import { Request, Response, NextFunction } from "express";
import { sign, verify, JwtPayload } from "jsonwebtoken";
import { compare } from "bcryptjs";
import prisma from "../../config/prismaclient";
import UserService from "../services/UserService";
import { User } from "@prisma/client";
import { TokenError, PermissionError, InvalidRouteError, InvalidParamError, LoginError } from "../errors";
import statusCodes from "../constants/statusCodes";

// Função para gerar o token JWT
function generateJWT(user: User, res: Response) {
	const body = {
		id: user.id,
		email: user.email,
		role: user.cargo, // ajuste conforme sua estrutura de dados
		name: user.nome
	};

	const token = sign({ user: body }, process.env.SECRET_KEY || "", { expiresIn: process.env.JWT_EXPIRATION });

	res.cookie("jwt", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV !== "development",
	});
}

// Extrair token do cookie
function cookieExtractor(req: Request) {
	let token = null;

	if (req.cookies) {
		token = req.cookies["jwt"];
	}

	return token;
}

// Verificar JWT e autenticar o usuário
export function verifyJWT(req: Request, res: Response, next: NextFunction) {
	try {
		const token = cookieExtractor(req);
		if (token) {
			const decoded = verify(token, process.env.SECRET_KEY || "") as JwtPayload;
			req.user = decoded.user;
		}

		if (req.user == null) {
			throw new TokenError("Você precisa estar logado para realizar essa ação!");
		}
		next();
	} catch (error) {
		next(error);
	}
}

// Função de login tradicional
export async function login(req: Request, res: Response, next: NextFunction) {
	try {
		const user = await prisma.user.findUnique({
			where: {
				email: req.body.email
			}
		});

		if (!user) {
			throw new PermissionError("Email e/ou senha incorretos!");
		}
		if (user.senha != null) {
			const match = await compare(req.body.password, user.senha);
			if (!match) {
				throw new PermissionError("Email e/ou senha incorretos!");
			}
		}
		if (req.body.password == null) {
			throw new InvalidParamError("Você deve inserir uma senha!");
		}

		generateJWT(user, res);
		res.status(statusCodes.SUCCESS).json("Login realizado com sucesso!");
	} catch (error) {
		next(error);
	}
}

// Verificar se o usuário não está logado
export async function notLoggedIn(req: Request, res: Response, next: NextFunction) {
	try {
		const token = cookieExtractor(req);

		if (token) {
			res.status(statusCodes.BAD_REQUEST);
			throw new LoginError("Você já está logado!");
		}

		next();
	} catch (error) {
		next(error);
	}
}

// Função de logout
export async function logout(req: Request, res: Response, next: NextFunction) {
	try {
		res.clearCookie("jwt", {
			httpOnly: true,
			secure: process.env.NODE_ENV !== "development"
		});
		const token = cookieExtractor(req);
		if (!token) {
			res.status(statusCodes.BAD_REQUEST);
			throw new TokenError("Faça o logout novamente.");
		}

		res.status(statusCodes.SUCCESS).json("Logout realizado com sucesso!");
	} catch (error) {
		next(error);
	}
}

// Verificar se o usuário tem um papel específico
export function checkRole(allowedRoles: string[]) {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			const user = req.user as User;

			if (!user) {
				res.status(statusCodes.UNAUTHORIZED);
				throw new Error("Usuário não autenticado");
			}

			const hasPermission = allowedRoles.includes(user.cargo);
			if (!hasPermission) {
				res.status(statusCodes.FORBIDDEN);
				throw new Error("Você não tem permissão para acessar essa rota!");
			}

			next();
		} catch (error) {
			next(error);
		}
	};
}
