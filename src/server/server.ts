import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import { LOG_FONT_COLORS } from '../constants';
import { errorHandler } from '../middlewares/errorHandler';
import routes from '../routes';

export const initExpressServer = (): void => {
  const app = express();

  app.use(
    cors({
      origin: [process.env.FRONT_END_APP_URI || '', 'http://localhost:5173'],
    }),
  );

  app.use(cookieParser());

  app.use(express.json());

  app.use(routes);

  // centralized error handler to avoid try catch in every controller
  app.use(errorHandler);

  app.listen(process.env.PORT || process.env.APP_PORT);

  console.log(
    LOG_FONT_COLORS.SUCCESS_CONSOLE_FONT_COLOR,
    `Server Started at port: ${process.env.APP_PORT}`,
  );
};
