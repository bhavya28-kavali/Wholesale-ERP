import Customer from '../models/Customer.js';

export const getCustomers = async (req, res) => {
  const filter = { isActive: true };
  if (req.query.search) {
    filter.name = { $regex: req.query.search, $options: 'i' };
  }
  const customers = await Customer.find(filter).sort({ name: 1 });
  res.json(customers);
};

export const createCustomer = async (req, res) => {
  const customer = await Customer.create(req.body);
  res.status(201).json(customer);
};

export const updateCustomer = async (req, res) => {
  const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!customer) return res.status(404).json({ message: 'Customer not found' });
  res.json(customer);
};
