import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import { generateId } from '../utils/uuid';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { USER_COLORS } from '@syncwrite/shared';

export const AuthController = {
  async register(req: Request, res: Response) {
    const { email, username, password } = req.body;

    const existingUser = UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        error: {
          code: 'CONFLICT',
          message: 'An account with this email already exists',
        },
      });
    }

    const passwordHash = await hashPassword(password);
    // Pick avatar color based on username hash
    const colorIndex = Math.abs(
      username.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)
    ) % USER_COLORS.length;
    const avatarColor = USER_COLORS[colorIndex];

    const userId = generateId();
    const user = UserModel.create({
      id: userId,
      email,
      username,
      passwordHash,
      avatarColor,
    });

    const accessToken = generateAccessToken({ userId: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });

    res.status(201).json({
      user,
      accessToken,
      refreshToken,
    });
  },

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const userWithHash = UserModel.findByEmail(email);
    if (!userWithHash) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid email or password',
        },
      });
    }

    const isValid = await comparePassword(password, userWithHash.passwordHash);
    if (!isValid) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid email or password',
        },
      });
    }

    const accessToken = generateAccessToken({ userId: userWithHash.id, email: userWithHash.email });
    const refreshToken = generateRefreshToken({ userId: userWithHash.id, email: userWithHash.email });

    const { passwordHash, ...user } = userWithHash;

    res.status(200).json({
      user,
      accessToken,
      refreshToken,
    });
  },

  async refresh(req: Request, res: Response) {
    const { refreshToken } = req.body;

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid or expired refresh token',
        },
      });
    }

    const user = UserModel.findById(payload.userId);
    if (!user) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'User no longer exists',
        },
      });
    }

    const newAccessToken = generateAccessToken({ userId: user.id, email: user.email });

    res.status(200).json({
      accessToken: newAccessToken,
    });
  },

  async me(req: Request, res: Response) {
    const userId = req.user!.userId;
    const user = UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'User not found',
        },
      });
    }

    res.status(200).json(user);
  },

  async updateProfile(req: Request, res: Response) {
    const userId = req.user!.userId;
    const { username, avatarColor } = req.body;

    const updated = UserModel.updateProfile(userId, { username, avatarColor });
    res.status(200).json(updated);
  },
};
