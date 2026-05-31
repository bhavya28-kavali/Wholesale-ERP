import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!req.body) {
    return res.status(400).json({ message: "Request body missing" });
  }
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'User already exists' });

  const userCount = await User.countDocuments();
  const isFirstUser = userCount === 0;
  const allowedRoles = ['user', 'accountant', 'manager'];
  let finalRole = 'user';
  if (isFirstUser) {
    finalRole = 'admin';
  } else if (req.user?.role === 'admin' && role && ['admin', ...allowedRoles].includes(role)) {
    finalRole = role;
  } else if (!req.user && role === 'admin') {
    finalRole = 'user';
  } else if (allowedRoles.includes(role)) {
    finalRole = role;
  }

  const user = await User.create({
    name,
    email,
    password,
    role: finalRole,
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  }
  res.status(401).json({ message: 'Invalid email or password' });
};

export const getMe = async (req, res) => {
  res.json(req.user);
};

export const getUsers = async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
};
