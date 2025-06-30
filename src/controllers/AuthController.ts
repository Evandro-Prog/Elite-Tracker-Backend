import axios, { isAxiosError } from 'axios';
import { type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';

const {
  GITHUB_CLIENT_ID: clientId,
  GITHUB_CLIENT_SECRET: clientSecret,
  JWT_SECRET_KEY: secretKey,
  JWT_EXPIRES_IN: expiresIn,
} = process.env;

export class AuthController {
  auth = async (req: Request, res: Response) => {
    const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}`;
    res.status(200).json({ redirectUrl });
  };

  authCallBack = async (req: Request, res: Response) => {
    try {
      const { code } = req.query;

      console.log('Código recebido do GitHub:', code);

      const accessTokenResult = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: clientId,
          client_secret: clientSecret,
          code,
          redirect_uri: 'http://localhost:5173/autenticacao',
        },
        {
          headers: { Accept: 'application/json' },
        },
      );

      const { access_token } = accessTokenResult.data;
      if (!access_token) {
        return res
          .status(400)
          .json({ message: 'Failed to retrieve access token.' });
      }

      const userDataResult = await axios.get('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      const { node_id: id, avatar_url: avatarUrl, name } = userDataResult.data;

      const token = jwt.sign({ id }, String(secretKey), {
        expiresIn,
      });

      return res.status(200).json({ id, avatarUrl, name, token });
    } catch (error) {
      if (isAxiosError(error)) {
        return res
          .status(400)
          .json({ message: error.response?.data || error.message });
      }

      return res
        .status(500)
        .json({ message: 'Something went wrong during authentication.' });
    }
  };
}
