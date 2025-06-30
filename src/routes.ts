import { Router } from 'express';

import packageJson from '../package.json';
import { AuthController } from './controllers/AuthController';
import { FocusTimeController } from './controllers/FocusTimeController';
import { HabitsController } from './controllers/HabitsController';
import { authMiddleware } from './middlewares/authMiddleware';

export const routes = Router();

const habitsController = new HabitsController();
const focusTimeController = new FocusTimeController();
const authController = new AuthController();

routes.get('/', (request, response) => {
  const { name, description, version } = packageJson;

  response.status(200).json({ name, description, version });
});

routes.get('/auth', authController.auth);
routes.get('/auth/callback', authController.authCallBack);

routes.use(authMiddleware);

routes.get('/habits', habitsController.index);
routes.get('/habits/:id/metrics', habitsController.metrics);
routes.post('/habits', habitsController.store);
routes.delete('/habits/:id', habitsController.remove);
routes.patch('/habits/:id/toggle', habitsController.toggle);

routes.post('/focus-time', focusTimeController.store);
routes.get('/focus-time', focusTimeController.index);
routes.get('/focus-time/metrics', focusTimeController.metricsByMonth);
