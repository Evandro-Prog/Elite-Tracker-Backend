import dayjs from 'dayjs';
import { type Request, type Response } from 'express';
import { z } from 'zod';

import { FocusTimeModel } from '../models/FocusTimeModel';
import { buildValidationErrorMessage } from '../utils/build-validation-error-message-util';

export class FocusTimeController {
  store = async (req: Request, res: Response) => {
    const schema = z.object({
      timeFrom: z.coerce.date(),
      timeTo: z.coerce.date(),
    });

    const focusTime = schema.safeParse(req.body);

    if (!focusTime.success) {
      const errors = buildValidationErrorMessage(focusTime.error.issues);
      return res.status(422).json({
        message: errors,
      });
    }

    const timeFrom = dayjs(focusTime.data.timeFrom);
    const timeTo = dayjs(focusTime.data.timeTo);

    const isTimeToBeforeTimeFrom = timeTo.isBefore(timeFrom);

    if (isTimeToBeforeTimeFrom) {
      return res
        .status(400)
        .json({ message: 'Finish time cannot be lower than starting time' });
    }

    const createdFocusTime = await FocusTimeModel.create({
      timeFrom: timeFrom.toDate(),
      timeTo: timeTo.toDate(),
      userId: req.user.id,
    });

    return res.status(201).json(createdFocusTime);
  };

  index = async (req: Request, res: Response) => {
    const schema = z.object({
      date: z.coerce.date(),
    });

    const validated = schema.safeParse(req.query);

    if (!validated.success) {
      const errors = buildValidationErrorMessage(validated.error.issues);
      return res.status(422).json({
        message: errors,
      });
    }

    const startDate = dayjs(validated.data.date).startOf('day');
    const endDate = dayjs(validated.data.date).endOf('day');

    const focusTimes = await FocusTimeModel.find({
      timeFrom: {
        $gte: startDate.toDate(),
        $lte: endDate.toDate(),
      },
      userId: req.user.id,
    }).sort({
      timeFrom: 1,
    });

    return res.status(200).json(focusTimes);
  };

  metricsByMonth = async (req: Request, res: Response) => {
    const schema = z.object({
      date: z.coerce.date(),
    });

    const validated = schema.safeParse(req.query);

    if (!validated.success) {
      const errors = buildValidationErrorMessage(validated.error.issues);
      return res.status(422).json({
        message: errors,
      });
    }

    const startDate = dayjs(validated.data.date).startOf('month');
    const endDate = dayjs(validated.data.date).endOf('month');

    const focusTimeMetrics = await FocusTimeModel.aggregate()
      .match({
        timeFrom: {
          $gte: startDate.toDate(),
          $lte: endDate.toDate(),
        },
        userId: req.user.id,
      })
      .project({
        year: {
          $year: '$timeFrom',
        },
        month: {
          $month: '$timeFrom',
        },
        day: {
          $dayOfMonth: '$timeFrom',
        },
      })
      .group({
        _id: ['$year', '$month', '$day'],
        count: {
          $sum: 1,
        },
      })
      .sort({
        _id: 1,
      });

    return res.status(200).json(focusTimeMetrics);
  };
}
