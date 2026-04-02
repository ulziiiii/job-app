const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Регистрация
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Проверяем есть ли уже такой пользователь
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Пользователь уже существует" });
    }

    // Шифруем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаём пользователя
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({ message: "Пользователь создан!", user });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера", err });
  }
});

// Вход
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Пользователь не найден" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Неверный пароль" });

    const token = jwt.sign({ id: user._id, role: user.role }, "secret123", {
      expiresIn: "7d",
    });

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера", err });
  }
});

module.exports = router;
