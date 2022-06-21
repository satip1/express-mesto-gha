// подключаем модуль экспресс, делаем сервер, задаем порт в глобальной переменной
const express = require('express');

const app = express();

const { PORT = 3000 } = process.env;

// подключаем парсер для пакетов
const bodyParser = require('body-parser');

// создаем подключение к базе
const mongoose = require('mongoose');

// импортируем роутеры
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');

const { ERROR_NOT_FOUND } = require('./errors/errors');

// роуты
// собираем пакеты
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// временное решение
app.use((req, res, next) => {
  // вставьте сюда _id созданного в предыдущем пункте пользователя
  req.user = { _id: '62ab7b35b8324f184cb93f99' };
  next();
});
// роуты для users
app.use(routerUsers);
// роуты для карточек
app.use(routerCards);
// роут для некорректных адресов
app.use('*', (req, res) => { res.status(ERROR_NOT_FOUND).send({ message: 'Несуществующий адрес' }); });

// запустили веб-сервер
app.listen(PORT, () => {
  console.log(`Сервер запущен напорту ${PORT}`);
});

// запустили сервер бд
mongoose.connect('mongodb://localhost:27017/mestodb ');
