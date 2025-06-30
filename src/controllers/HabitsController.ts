import dayjs from 'dayjs';
import { type Request, type Response } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';

import { habitModel } from '../models/HabitModel';
import { buildValidationErrorMessage } from '../utils/build-validation-error-message-util';

export class HabitsController {
  store = async (req: Request, res: Response) => {
    const schema = z.object({
      name: z.string(),
    });

    const habit = schema.safeParse(req.body);

    if (!habit.success) {
      const errors = buildValidationErrorMessage(habit.error.issues);
      return res.status(422).json({
        message: errors,
      });
    }

    //Método que busca no banco se já esxite um hábito com o nome descrito, caso exista exibe uma mensagem de erro
    //caso não exista cria um novo hábito
    const findHabit = await habitModel.findOne({ name: habit.data.name });
    if (findHabit) {
      return res.status(400).json({ message: 'Habit already exists!' });
    }

    const newHabit = await habitModel.create({
      name: habit.data.name,
      completedDate: [],
      userId: req.user.id,
    });

    return res.status(201).json(newHabit);
  };

  //Metodo que lista os habitos, foi adicionado um .sort(name: 1) para garantir que venha em ordem alfabética.
  index = async (req: Request, res: Response) => {
    const habits = await habitModel
      .find({
        userId: req.user.id,
      })
      .sort({ name: 1 });

    return res.status(200).json(habits);
  };

  //Método que busca um hábito pelo ID e deleta.
  remove = async (req: Request, res: Response) => {
    const schema = z.object({
      id: z.string(),
    });

    const habit = schema.safeParse(req.params);

    if (!habit.success) {
      const errors = buildValidationErrorMessage(habit.error.issues);
      return res.status(422).json({
        message: errors,
      });
    }

    const findHabit = await habitModel.findOne({
      _id: habit.data.id,
      userId: req.user.id,
    });

    if (!findHabit) {
      return res.status(404).json({
        message: 'Habit not found!',
      });
    }

    await habitModel.deleteOne({
      _id: habit.data.id,
    });

    return res.status(204).send();
  };

  //Método que marca e desmarca hábitos como concluido.
  toggle = async (req: Request, res: Response) => {
    const schema = z.object({
      id: z.string(),
    });

    const validated = schema.safeParse(req.params);

    if (!validated.success) {
      const errors = buildValidationErrorMessage(validated.error.issues);
      return res.status(422).json({
        message: errors,
      });
    }

    const findHabit = await habitModel.findOne({
      _id: validated.data.id,
      userId: req.user.id,
    });

    if (!findHabit) {
      return res.status(404).json({
        message: 'Habit not found!',
      });
    }

    const now = dayjs().startOf('day').toISOString();
    const isHabitCompletedOnDate = findHabit
      .toObject()
      ?.completedDate.find((item) => dayjs(String(item)).toISOString() === now);

    if (isHabitCompletedOnDate) {
      const habitUpdated = await habitModel.findOneAndUpdate(
        {
          _id: validated.data.id,
        },
        {
          $pull: {
            completedDate: now,
          },
        },
        {
          returnDocument: 'after',
        },
      );
      return res.status(200).json(habitUpdated);
    }

    const habitUpdated = await habitModel.findOneAndUpdate(
      {
        _id: validated.data.id,
      },
      {
        $push: {
          completedDate: now,
        },
      },
      {
        returnDocument: 'after',
      },
    );
    return res.status(200).json(habitUpdated);
  };
  //Método que busca e exibe as métricas do usuário para cada hábito no mês de referência.
  metrics = async (req: Request, res: Response) => {
    const schema = z.object({
      id: z.string(),
      date: z.coerce.date(),
    });

    const validated = schema.safeParse({ ...req.params, ...req.query });

    if (!validated.success) {
      const errors = buildValidationErrorMessage(validated.error.issues);
      return res.status(422).json({
        message: errors,
      });
    }

    const dateFrom = dayjs(validated.data.date).startOf('month');
    const dateTo = dayjs(validated.data.date).endOf('month');

    const [habitMetrics] = await habitModel
      .aggregate()
      .match({
        _id: new mongoose.Types.ObjectId(validated.data.id),
        userId: req.user.id,
      })
      .project({
        _id: 1,
        name: 1,
        completedDate: {
          $filter: {
            input: '$completedDate',
            as: 'completedDates',
            cond: {
              $and: [
                {
                  $gte: ['$$completedDates', dateFrom.toDate()],
                },
                {
                  $lte: ['$$completedDates', dateTo.toDate()],
                },
              ],
            },
          },
        },
      });

    if (!habitMetrics) {
      return res.status(404).json({ message: 'Habit not found!' });
    }

    return res.status(200).json(habitMetrics);
  };
}
