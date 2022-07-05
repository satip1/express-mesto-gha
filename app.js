// подключаем модуль экспресс, делаем сервер, задаем порт в глобальной переменной
const express = require('express');

const app = express();

const { PORT = 3000 } = process.env;

// подключаем парсер для пакетов
// создаем подключение к базе
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// импортируем библиотеку для валидации запросов на регистрацию и создание пользователя
const { celebrate, Joi, errors } = require('celebrate');

// импортируем роутеры и контроллеры
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const { auth } = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const { error } = require('./middlewares/error');

const ErrorNotFound = require('./errors/ErrorNotFound'); // 404
const { REG_LINK } = require('./constants/constants');

// роуты
// собираем пакеты
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// роутер для валидации запроса и создания пользователя
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(REG_LINK),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  createUser,
);
// роутер для валидации запроса и логирования пользователя
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);

// защита роутов
app.use(auth);

// роуты для users
app.use(routerUsers);
// роуты для карточек
app.use(routerCards);

// роут для некорректных адресов
app.use('*', (req, res, next) => {
  next(new ErrorNotFound('Несуществующий адрес'));
});

// обработка ошибок celebrate
app.use(errors());
// обработчик всех ошибок
app.use(error);

// запустили веб-сервер
app.listen(PORT, () => {
  console.log(`Сервер запущен напорту ${PORT}`);
});

// запустили сервер бд
mongoose.connect('mongodb://localhost:27017/mestodb ');
