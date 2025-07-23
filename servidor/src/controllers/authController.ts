import { Request, Response } from 'express';
import * as authService from '../services/authService';

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body; // Não precisa de publicKey aqui
  if (!email || !password) {
    return res.status(400).send('Email and password are required.');
  }

  try {
    const user = await authService.registerUser(email, password);
    res.status(201).json({ message: 'User registered successfully', userId: user.id });
  } catch (error: any) {
    if (error.message === 'Email already registered') {
      return res.status(409).send(error.message);
    }
    res.status(500).send('Error registering user.');
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send('Email and password are required.');
  }

  try {
    const { user, token } = await authService.loginUser(email, password);
    // Aqui estamos retornando a chave pública para o frontend, mas a privada fica no backend.
    res.status(200).json({ message: 'Login successful', token, user });
  } catch (error: any) {
    res.status(401).send(error.message);
  }
};
